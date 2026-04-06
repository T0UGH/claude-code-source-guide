---
title: 卷二 02｜主循环在编排一次完整 agent 回合
date: 2026-04-06
tags:
  - Claude Code
  - 源码共读
---

# 卷二 02｜主循环在编排一次完整 agent 回合

## 导读

- **所属卷**：卷二：一条请求是怎么跑完整个系统的
- **卷内位置**：卷二 2/13
- **上一篇**：[上一篇：从 query 到 tool.call 的连接处](./01-from-query-to-tool-call.md)
- **下一篇**：[下一篇：QueryEngine 是一次用户请求进入运行时主链路的总入口](./03-queryengine-entry.md)

这一篇把视角稍微拉高，不再只盯工具连接点，而是先看主循环如何把一次完整 agent 回合编排出来，为后面正式进入 QueryEngine 主链做铺垫。

---

## 这篇看什么

这一篇回到主循环，但重点不是把它当成一段普通控制流，而是把它看成 Claude Code 的总调度台。前面工具链已经拆得差不多了，现在更值得看的是：这套系统怎样把一整轮 agent 回合编排起来。

核心文件是：

- `src/query.ts`

可以先把判断收成一句话：

> 主循环真正负责的，不是“让模型回一句话”，而是把一次 agent 回合从输入、压缩、采样、识别 tool_use、执行工具、拼回结果、决定是否继续，完整地编排出来。

它本质上是一个持续推进的 runtime loop。

---

## 先给主结论

### 1. 主循环的基本单位不是“单次回复”，而是一整轮 agent 回合

`query()` 外面只是壳，真正的核心在 `queryLoop()`。

而 `queryLoop()` 不是跑一轮就结束。它会在 `while (true)` 里不断推进状态。

每一轮大致都在做这些事：

1. 整理当前消息上下文
2. 做各种压缩和恢复准备
3. 调模型采样
4. 看模型有没有产出 `tool_use`
5. 如果有，就执行工具
6. 把 `tool_result` 和附件重新塞回消息流
7. 进入下一轮
8. 如果没有要继续的理由，就结束

所以它不是一个普通 chat loop，更像是：

> 一个以 message 流为状态、以 tool_use 为分叉点往前推的 agent 执行循环。

### 2. 主循环的核心判断其实很朴素：有没有 `tool_use`

源码里有句注释很关键：

- `stop_reason === 'tool_use' is unreliable`

所以它不迷信 API 给的 `stop_reason`，而是在流式过程中自己收集：

- `toolUseBlocks`
- `needsFollowUp`

只要 assistant 输出里出现了 `tool_use` block，它就认为这轮还没完，后面必须继续。

这点很值。Claude Code 的主循环不是“模型说停就停”，而是自己按消息结构判断：

> 这轮到底是结束了，还是只是刚进入工具执行阶段。

### 3. 主循环真正做的是“编排”，不是“思考”

模型负责生成内容和 tool_use。

工具负责执行动作。

但把这两者接成一个可持续推进的回合，是主循环的工作。

它负责：

- 什么时候调用模型
- 用什么上下文调用模型
- 什么时候执行工具
- 怎么把工具结果重新并回会话
- 什么时候压缩上下文
- 什么时候自动续跑
- 什么时候因为错误、中断、hook、token budget 而停下

所以我会把 `query.ts` 定义成：

> Claude Code 的回合编排器。

---

## 从架构层看，主循环到底干了什么

我觉得可以拆成 6 层。

## 第一层：维护跨轮状态

`queryLoop()` 一开始先建一个 `State`。

里面放的不是业务对象，而是这轮执行真正需要跨迭代延续的状态：

- `messages`
- `toolUseContext`
- `autoCompactTracking`
- `maxOutputTokensRecoveryCount`
- `hasAttemptedReactiveCompact`
- `pendingToolUseSummary`
- `stopHookActive`
- `turnCount`
- `transition`

这说明主循环不是一次性函数，而是有记忆的状态机。

尤其是这几个字段很说明问题：

### `turnCount`
它明确知道自己已经递归推进到第几轮了。

### `transition`
它不仅继续，还记得“为什么继续”。
比如：
- 下一轮正常继续
- stop hook 阻塞后重试
- reactive compact 后重试
- max output tokens 恢复后重试

### `pendingToolUseSummary`
说明某些辅助产物不是同步塞进当前轮，而是异步生成、下一轮再发。

所以从架构上说，主循环一开始就承认：

> 一次 agent 回合不是线性的，而是一个带恢复、补偿、摘要和重试的状态推进过程。

---

## 第二层：在真正调用模型之前，先把上下文整理到可运行状态

这部分很重，但很关键。

在调模型前，主循环会做一整串上下文预处理：

- `applyToolResultBudget`
- `snipCompactIfNeeded`
- `microcompact`
- `contextCollapse.applyCollapsesIfNeeded`
- `autocompact`
- `appendSystemContext`
- `prependUserContext`

这说明 Claude Code 不是把所有历史原样喂给模型。

它真正做的是：

> 在每一轮采样前，动态把上下文整理成“当前最值得送去采样的一版”。

如果只把主循环想成“收消息 -> 调模型 -> 执行工具”，会低估它。真到源码里看，会发现模型调用前它已经先做了一轮上下文工程。

### 这层的职责不是压缩本身，而是控制上下文形态

它不只是为了省 token。

更像是在管三件事：

1. 不要爆 context
2. 不要让历史拖垮当前轮
3. 尽量保留对当前任务最有用的结构

所以主循环不只是 agent loop，还是 context runtime。

---

## 第三层：把模型采样当成一个流来消费，而不是一次性响应

主循环调模型时，不是拿一个最终结果，而是：

- `for await (const message of deps.callModel(...))`

也就是说，主循环吃的是流。

而这带来几个重要后果。

### 1. 它可以边流边识别 `tool_use`
assistant 消息一到，就会去扫：

- 有没有 `tool_use` block
- 有的话就塞进 `toolUseBlocks`
- 并把 `needsFollowUp = true`

所以工具调用并不是“最后统一解析”，而是流式消费过程中就已经被标记出来。

### 2. 它可以边流边处理 streaming tool execution
如果打开了 streaming tool execution，就不是等模型整段吐完再执行工具，而是交给：

- `StreamingToolExecutor`

它会在 assistant 流式产出 tool block 后，尽快把能跑的工具先跑起来。

这点我觉得很关键。主循环不是串行的“先说完再做”，而是在尝试把：

- 模型输出
- 工具执行
- 结果回流

尽量重叠起来。

### 3. 它会对中途 fallback、错误、无效 thinking 做清理
比如 streaming fallback 发生时，它会：

- tombstone 掉前面那批 orphan assistant messages
- 清空临时累积的 tool/result 状态
- 重建 executor

这说明主循环不仅会“往前跑”，还要负责在流式失败后把现场收干净。

---

## 第四层：把 `tool_use` 当成下一轮的分叉点

这一层是主循环最核心的结构。

当模型流结束后，会看：

- `needsFollowUp` 是不是为真

如果不是，说明这轮 assistant 没有发起工具调用，主循环就进入：

- stop hooks
- token budget 判断
- 完成/恢复/退出判断

如果是，说明这轮 assistant 其实还没结束，只是走到了“请执行工具”的中间态。

于是主循环会进入工具执行阶段：

- `runTools(...)`
- 或 `streamingToolExecutor.getRemainingResults()`

执行完以后，它会把结果统一变成可继续送回 API 的消息形态：

- `normalizeMessagesForAPI(...)`
- 形成 `toolResults`

然后再把：

- `messagesForQuery`
- `assistantMessages`
- `toolResults`

拼回新的 `state.messages`

进入下一轮。

这一步其实就是 Claude Code agentic runtime 的核心闭环：

> assistant 产出 tool_use -> runtime 执行 tool -> runtime 生成 tool_result -> 再喂回模型继续。

所以主循环不是简单“调用工具”，而是在维护 tool-use 语义闭环。

---

## 第五层：把附件、记忆、队列消息也视为下一轮输入的一部分

这个点很容易被忽略，但我觉得很关键。

工具结果并不是主循环唯一会回灌的输入。

工具执行之后，它还会继续拼别的输入源：

- `getAttachmentMessages(...)`
- memory prefetch 结果
- skill discovery prefetch 结果
- queue 里的 prompt / task-notification

这说明下一轮送给模型的，不只是 tool_result。

而是一个更广义的“补充上下文包”。

也就是说，主循环在架构上承认：

> agent 的下一步判断，不只依赖工具输出，也依赖系统在这一轮收集到的各种补充信号。

这就把主循环从“tool loop”抬高成了“多输入源编排器”。

---

## 第六层：决定什么时候继续、什么时候停

主循环最后一层职责，就是决定回合生命周期。

它不是简单看“模型说完了没”，而是看很多条件：

### 会继续的情况
- 产出了 `tool_use`
- stop hook 给了 blocking error
- reactive compact 后需要重试
- max output tokens 命中后需要续跑
- token budget 决定允许再继续一轮

### 会停下的情况
- 没有 `tool_use`，而且没有其他恢复/续跑理由
- 用户中断
- max turns 到了
- hook 明确阻止继续
- 错误不可恢复

也就是说，主循环实际在做的是：

> 生命周期调度。

它要负责一轮 agent 回合什么时候自然完成，什么时候是暂时中断，什么时候应该补救后继续。

---

## 为什么说主循环是 Claude Code 的总调度台

如果把前面看过的东西都放回来，这个定位会特别清楚。

### 工具层负责动作
- Bash
- Read
- Edit
- Write
- Grep

### 高阶工具层负责能力组织
- ToolSearchTool
- SkillTool
- MCPTool
- AgentTool

### 主循环负责把这些东西变成一个可持续推进的回合

它不关心某个工具内部怎么实现。

它关心的是：

- 这些能力何时进入当前轮
- 以什么消息结构进入
- 结果如何回流
- 是否触发下一轮
- 出问题后怎么恢复

所以我觉得主循环的准确定位应该是：

> Claude Code 的总编排层。它把模型、上下文压缩、工具执行、系统附件、恢复机制和回合生命周期接成一次完整的 agent 运行。

---

## 这次回看主循环，我最想记住的 4 个点

### 1. 主循环不是一次请求，而是一个状态机
核心不在“调一次模型”，而在带状态地持续推进。

### 2. `tool_use` 才是回合继续的真正信号
不是 stop reason，而是 assistant message 里有没有真正出现 tool block。

### 3. 工具只是其中一类输入，下一轮真正吃的是一个拼装后的上下文包
tool_result、attachments、memory、queue、skill discovery 都可能一起进入下一轮。

### 4. 主循环最重要的职责是编排，不是生成
生成是模型做的，执行是工具做的，编排它们的是主循环。

---

## 我现在对 `query.ts` 的一句话定义

> `query.ts` 不是一个“问模型然后拿答案”的文件，而是 Claude Code agent runtime 的主循环：它维护状态，整理上下文，消费流式输出，识别并执行 tool_use，把结果重新接回消息流，并决定这次 agent 回合是否继续。

---
