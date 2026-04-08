---
title: 卷六 04｜InProcessTeammateTask：真正的 teammate runtime 是怎么在同进程里跑起来的
date: 2026-04-08
tags:
  - Claude Code
  - InProcessTeammateTask
  - teammate runtime
  - in-process
source_files:
  - cc/src/tools/AgentTool/runAgent.ts
  - cc/src/tasks/InProcessTeammateTask/InProcessTeammateTask.tsx
  - cc/src/tasks/InProcessTeammateTask/startInProcessTeammateTask.ts
  - cc/src/tasks/InProcessTeammateTask/checkForCompletedTasks.ts
  - cc/src/tasks/InProcessTeammateTask/idleStatus.ts
  - cc/src/agent/team.ts
status: draft
---

# 卷六 04｜InProcessTeammateTask：真正的 teammate runtime 是怎么在同进程里跑起来的

## 这篇要回答的问题

前一篇已经把 team 从协作概念推进成了正式对象：它会被创建、会被注册、会被查询，也会被统一清理。

但卷六如果只停在这里，还只是对象层成立，还不是运行层成立。因为真正干活的不是 team，而是 teammate。

于是问题必须继续往前压：

> **Claude Code 里的 teammate，到底是怎么在同进程里被装配成正式运行体，并真正跑起来的？**

这篇的重点不是证明“teammate 也能执行”，而是要说明：它不是 team 下挂的一个名字，不是 worker wrapper，也不是抽象角色，而是通过 `InProcessTeammateTask` 被正式接入 Claude Code 当前 runtime 的运行体。

## 旧文与源码锚点

### 旧文素材锚点
- `docs/guidebook/volume-6/03-inprocess-teammate-task.md`
- `docs/guidebook/volume-1/11-runagent-assembly-line.md`

### 源码锚点
- `cc/src/tools/AgentTool/runAgent.ts`
- `cc/src/tasks/InProcessTeammateTask/InProcessTeammateTask.tsx`
- `cc/src/tasks/InProcessTeammateTask/startInProcessTeammateTask.ts`
- `cc/src/tasks/InProcessTeammateTask/checkForCompletedTasks.ts`
- `cc/src/tasks/InProcessTeammateTask/idleStatus.ts`
- `cc/src/agent/team.ts`

## 主图：teammate runtime 装配图

```mermaid
flowchart TD
    A[AgentTool / runAgent] --> B{taskType?}
    B -->|subagent| C[startSubagentTask]
    B -->|teammate| D[findTeammateByName + agentContext.team]

    D --> E[startInProcessTeammateTask]
    E --> F[createInProcessTeammateTask]
    F --> G[写入 teammate.name / systemPrompt / teamId / leaderTask]
    G --> H[task.run()]
    H --> I[query(...)]
    I --> J[mailbox / completed task 消息并入 query state]
    J --> K[idle 检测 / maybeShutdown]
```

这张图要说明的不是“teammate 也会调用 query”，而是它怎样从 team 中注册过的成员，经过装配线，被做成一个带上下文、带 leader 关系、带 mailbox、带 shutdown 行为的正式 task。

## 先给结论

### 结论一：teammate runtime 的起点不是 team 本身，而是 runAgent 装配线上的 teammate 分流

`runAgent.ts` 的关键意义，在卷一时我们已经讲过：它不是简单启动一个新 agent，而是承担受控装配责任。到了卷六，这条装配线继续分出一条很重要的支路。

当 `taskType === "teammate"`，并且 `agentContext.team` 中能找到对应 teammate 时，`runAgent` 不会继续走普通 subagent 路线，而是把当前委派交给：

- `findTeammateByName(...)`
- `startInProcessTeammateTask(...)`

这一步说明 teammate runtime 不是后来附会出来的概念，而是装配线明确承认的一种执行者形态。

### 结论二：InProcessTeammateTask 不是 wrapper，而是标准 task 形态的正式运行体

`InProcessTeammateTask.tsx` 里定义的对象非常扎实。它不是“包一下 subagent”那么轻，而是直接扩展出一个正式 task，至少带有：

- `id`
- `name`
- `teamId`
- `systemPrompt`
- `mailbox`
- `agentContext`
- `leaderTask`
- `status`
- `shutdown()`
- `run()`

这些字段共同说明一件事：teammate 不是 team 下的配置项，而是 Claude Code 运行时里一类真的会被调度、会推进状态、会持有上下文、会被回收的实体。

### 结论三：所谓“in-process”，核心不是实现趣味，而是它仍在 Claude Code 当前 runtime 身体里运行

这篇最容易被写轻的地方，就是把 in-process 当成本地实现细节。其实这个词恰恰点明了 teammate runtime 的结构位置：

> **它不是被甩到一个完全外部化的 worker 系统里，而是继续在 Claude Code 当前进程、当前 query / task / context 体系中运行。**

这很关键，因为它意味着：

- teammate 能直接复用现有 query runtime
- teammate 与 leader、与同组成员的协作关系不必额外跨进程搭一个外部协调层
- mailbox、completed task、idle / shutdown 等机制都能直接接进当前运行时身体

所以 InProcessTeammateTask 真正立住的，不是“有一种任务叫 teammate”，而是：**协作层没有漂到系统外面，而是继续长在 Claude Code 本体里。**

## 第一部分：装配起点——runAgent 是怎么把 teammate 拉进来的

如果要回答“teammate runtime 怎么跑起来”，第一步一定不是从 `InProcessTeammateTask.tsx` 开始，而要先回到装配入口。

## 1. runAgent 先判断当前是不是 teammate 路线

`runAgent.ts` 会先根据 `taskType`、`subagentType` 和 `agentContext.team` 判断当前这次委派究竟是什么：

- 普通的 generic subagent
- 还是某个已经配置在 team 里的 teammate

这一步很重要。因为它说明 teammate 不是普通 subagent 跑到一半“自我升级”成的，而是一开始就被装配线识别为不同任务类型。

## 2. teammate 会带着 team 上下文进入装配

在调用 `createAgentContext(...)` 时，`runAgent` 对 team 的处理也很有分寸：

- 如果是 `teammate`，就把当前 `agentContext.team` 继续传进去
- 如果是普通 `subagent`，则不携带这个 team 上下文

这意味着 teammate 从装配一开始就处在协作结构里，而不是先作为孤立 agent 跑起来，之后再补挂 team 关系。

## 3. 最终分流到 startInProcessTeammateTask

一旦找到 teammate，`runAgent` 最终不会调用 `startSubagentTask(...)`，而会调用 `startInProcessTeammateTask(teammate, subagentContext, taskState, sourceTask)`。

这一步是卷六第四篇最核心的转折点：

> **team 里的正式成员，被进一步装配成真正的 teammate runtime。**

## 第二部分：startInProcessTeammateTask 到底做了什么

`startInProcessTeammateTask.ts` 本身不长，但正因为短，反而很容易看清它的结构作用。

## 1. 它接收的不是任意 task，而是 Team.teammates 中的正式成员

函数签名直接写成：

- `Pick<Team, "teammates">["teammates"][number]`

这其实已经说得很明白：要启动 teammate runtime，前提是这个对象已经是 **team 里的注册成员**。也就是说，对象层与运行层在这里被接起来了。

## 2. 它会用 teammate 自己的 systemPrompt 改写新的 agentContext

在调用 `createInProcessTeammateTask(...)` 时，`startInProcessTeammateTask` 会把：

- 当前装配出来的 `agentContext`
- teammate 自己的 `systemPrompt`

合成一个新的运行上下文。

这说明 teammate runtime 不是把 leader 的上下文整包硬拷过去，而是拥有自己的职责入口。也正因此，它不能被写成“只是 leader 的薄包装 worker”。

## 3. 它把 teamId 再写回运行体

返回值里还会显式保留 `teamId: teammate.teamId`。这点也很关键，因为运行体一旦被真正启动，成员关系并没有消失。相反，运行中的 teammate 仍然知道自己属于哪个 team。

这使得后面的 mailbox、idle、completed task 汇总，都能继续站在 team 协作语义上工作。

## 第三部分：InProcessTeammateTask 为什么是一种真正的运行体

这篇最核心的一段，还是要落回 `InProcessTeammateTask.tsx`。

## 1. 它有自己的运行时身份

`createInProcessTeammateTask(...)` 一上来就为 task 生成 `id`，并给出 `name`、`teamId`、`status`、`abortController`、`updatedAt`。这不是角色描述，而是运行实体的基本身份证明。

没有这一层，teammate 就只能是 team 配置里的成员名；有了这一层，它才真正变成系统里的一个可调度对象。

## 2. 它有自己的上下文和职责边界

对象里直接挂着 `agentContext` 与 `systemPrompt`，说明 teammate 不是 leader 的一个函数回调，而是带自己运行上下文的实体。它不是“主 agent 顺便扮演另一个角色”，而是当前 runtime 中另外一个正式执行位。

## 3. 它有自己的协作输入面：mailbox

`mailbox: MailboxMessage[]` 这一项非常关键。因为它说明 teammate 不是只接 prompt 就跑一次，而是有一个正式的协作消息入口。虽然本篇不展开 mailbox 协议细节，但至少要把这个结构事实压出来：**协作输入已经成为运行体的一部分。**

## 4. 它有自己的收尾能力：shutdown

对象上还定义了 `shutdown(message)`。这同样说明 teammate runtime 不是跑完就算，而是带着明确的收尾接口。这为后面的 idle / shutdown 协议篇留出了结构挂点。

## 5. 它最终不是“伪运行”，而是真的走 query(...)

`run()` 里最关键的一步，是直接调用：

- `query(task.query, taskState, task.agentContext, task.abortController.signal, task.id, ..., task)`

这句几乎可以视为整篇的硬证据：teammate runtime 不是某种外围 worker 模拟，而是直接接进 Claude Code 当前的 query runtime。

也正因为如此，我更愿意说：InProcessTeammateTask 不是把 teammate 包一层壳，而是把 teammate 正式接成了 Claude Code 里的一个 **同进程运行体**。

## 第四部分：它怎样接住上下文、执行职责和运行边界

按写作卡片要求，这篇不能只说“不是薄包装层”，必须真正说明它怎么接住上下文、执行职责和边界。

## 1. 上下文：通过 agentContext 与 systemPrompt 接住

前面已经看到，start 阶段会把 teammate 自己的 systemPrompt 写回新的 agentContext。这样一来，teammate 的职责入口不是空泛角色，而是带上下文边界的正式运行环境。

## 2. 执行职责：通过 run() 接住

`run()` 并不是简单调用一下别的函数，而是完整负责：

- 发出 `start` 事件
- 创建真实 query task
- 接管新的 `abortController`
- 接管 transcriptPath
- 把后续执行托付给真实 task.run()
- 在运行结束后把状态收成 `Completed`

这说明 teammate runtime 有自己的执行壳，而不是 leader 帮它“代跑”。

## 3. 运行边界：通过 leaderTask、teamId、mailbox 与 idle 检测共同接住

`leaderTask` 说明它处在一条明确的协作上游关系中；`teamId` 说明它属于哪个协作整体；`mailbox` 说明它如何接收协作消息；`idleStatus.ts` 又进一步根据：

- 当前 `agentContext` 是否处于 `AgentStatus.Idle`
- 当前 mailbox 是否还有未读消息
- team 里其他活跃成员是否还有未读 mailbox 消息

来判断这个运行体是不是已经进入可关闭的 idle 状态。

这套边界非常有分量。它说明 teammate runtime 不是只负责“做事”，还负责在协作关系里被正确地判断何时还该继续存在、何时可以收尾。

## 第五部分：completed task 与 idle / shutdown 说明它已经在协作闭环里

本篇虽然不能提前写完协议篇，但有两处源码事实必须点出来，否则运行体会被写得太轻。

## 1. completed teammate 会被重新喂回 query state

`checkForCompletedTasks.ts` 会遍历 `task.team.teammates`，把已经完成的 teammate 工作摘要重新整理成 `tool_result` 风格的 meta 消息，再喂回当前 query state。

这说明 teammate runtime 不是各跑各的。它的结果会被系统重新转译回协作链条，让别的执行者看见。

## 2. idle / shutdown 说明 teammate 不是永远常驻，而是带协作收尾语义

`idleStatus.ts` 和 `maybeShutdown(...)` 进一步说明：teammate runtime 的存在不是无边界的。它会检查：

- 自己是否已完成或中止
- 当前 agent 状态是不是 idle
- 自己与其他活跃成员是否还有未读 mailbox 消息

当这些条件满足时，系统会走 `shutdown(...)` 收尾。这说明 InProcessTeammateTask 从一开始就不是孤立任务，而是被安放在一个可闭合的协作生命周期里。

## 第六部分：本篇不能越界到哪里

这篇是运行体落地篇，边界也必须守住。

### 1. 不能把 mailbox / shutdown 全部讲完

这里只能证明 mailbox 与 shutdown 已经是运行体的一部分，具体协议逻辑要留到下一篇之后再展开。

### 2. 不能把 Local / Remote / Teammate 边界写掉

这里可以强调 in-process 的意义，但不能提前把 LocalAgentTask、RemoteAgentTask 和 teammate runtime 的系统边界全切完。

### 3. 不能把 swarm 判断提前收束

本篇的职责是把 teammate runtime 立成正式运行体，不是把整卷直接收成 swarm。swarm 判断必须等对象、运行体、协议和边界几条线都钉住之后再回来总收。

## 最后收一下

所以，真正的 teammate runtime 是怎么在同进程里跑起来的？

最稳的回答是这条链：

- `runAgent.ts` 在装配线上先识别当前是不是 teammate 路线
- 找到 team 中的正式成员后，转入 `startInProcessTeammateTask(...)`
- 这个 start 函数用 teammate 自己的 `systemPrompt` 与新的 `agentContext` 装配运行环境，并保留 `teamId`
- `createInProcessTeammateTask(...)` 再把它做成带 `mailbox`、`leaderTask`、`shutdown()`、`run()` 的正式 task
- `run()` 最终直接进入 `query(...)`，说明它并没有离开 Claude Code 当前 runtime，而是在其中真正跑起来
- completed task 汇总、idle 检测与 maybeShutdown 又进一步说明，它不是薄包装层，而是已经被纳入协作闭环中的正式运行体

因此，InProcessTeammateTask 最重要的意义不是“又一种任务类”，而是：

> **它把 team 里的成员角色真正推进成了 Claude Code 当前进程中的正式 teammate runtime。**

到这里，卷六前四篇的骨架就算真正立起来了：先有协作 runtime 总判断，再有系统位置，再有 team 正式对象，最后再有 teammate 正式运行体。接下来才轮到协议层继续接手：**mailbox、idle 与 shutdown 为什么不是边角机制，而是协作闭环的一部分。**
