---
title: 卷六 04｜mailbox + idle / shutdown 协议：teammate 之间是怎么通信和收尾的
date: 2026-04-06
tags:
  - Claude Code
  - 源码共读
---

# 卷六 04｜mailbox + idle / shutdown 协议：teammate 之间是怎么通信和收尾的

## 导读

- **所属卷**：卷六：多 agent 协作运行时
- **卷内位置**：卷六 4/6
- **上一篇**：[上一篇：InProcessTeammateTask：真正的 teammate runtime 是怎么在同进程里跑起来的](./03-inprocess-teammate-task.md)
- **下一篇**：[下一篇：LocalAgentTask、RemoteAgentTask 和 teammate runtime 的边界是什么](./05-local-remote-teammate-boundaries.md)

这一篇继续沿 teammate runtime 往下，但重点从执行体转到协议层：mailbox、idle、shutdown 怎样共同组成通信与收尾机制。

---

## 这篇看什么

85-87 已经把 swarm 这条线的三层基本立住了：

- 85：team / teammate runtime 在系统里的位置
- 86：team 这个正式对象怎么被创建、注册和清理
- 87：InProcessTeammateTask 这个 teammate 本体怎么在同进程里跑起来

那接下来最自然的问题就是：

> 这些 teammate 跑起来之后，彼此之间到底怎么通信？leader 怎么知道谁空了？team 又怎么安全收尾？

如果没有这层，team 仍然只像“一组同时在跑的 agent”。

真正让它变成 swarm runtime 的，恰恰是：

- 有消息通道
- 有 idle 协议
- 有 shutdown 协议
- 有 leader 侧的收尾循环

这一篇就专门讲这套机制。

核心文件主要是：

- `teammateMailbox.ts`
- `teammateInit.ts`
- `stopHooks.ts`
- `cli/print.ts`

如果说 87 讲的是 teammate 本体“怎么活起来”，那 88 讲的就是：

> **teammate 活起来之后，怎么互相通报状态、怎么被 leader 协调、怎么最终优雅收尾。**

## 先给主结论

如果这篇只先记一句话，我会留这个版本：

> Claude Code 的 swarm 协作不是靠共享内存里几次函数调用硬拼出来的，而是靠一套显式协议在维持：`teammateMailbox.ts` 提供按 team+agentName 路由的文件式 inbox，`teammateInit.ts` 给非 leader 成员注册 Stop hook 用于回报 idle，`stopHooks.ts` 进一步把 TaskCompleted / TeammateIdle 这类事件接进运行时收尾链，而 `cli/print.ts` 则在 leader 侧持续轮询未读 teammate 消息、处理 shutdown_approved、在输入关闭时主动发起 shutdown 提示。也就是说，Claude Code 的 teammate 协作不是“大家都在跑”，而是“大家都在遵守一套 mailbox + idle + shutdown 协议”。**

再压缩一点，就是：

- **mailbox 负责消息通道**
- **idle 通知负责状态回报**
- **shutdown 流程负责 team 收尾闭环**

一句最短版：

> **Claude Code 的 swarm 是靠协议运转的，不是靠并发本身运转的。**

## 先把总图立住：teammate 协作不是直接互调，而是“邮箱 + hook + leader polling”三段链

如果把这一层画出来，我觉得更接近下面这样：

```mermaid
flowchart TD
    A[teammate finishes / becomes idle] --> B[Stop hook]
    B --> C[writeToMailbox(leader inbox)]
    C --> D[leader polls unread mailbox messages]
    D --> E[process idle / shutdown_approved / other teammate events]
    E --> F[update teamContext / remove teammate / continue or cleanup]
```

这张图最重要的点是：

> teammate 之间不是直接同步调用，而是通过显式 mailbox 协议与 leader 协调循环来完成协作。**

这会带来两个很大的好处：

1. teammate 不需要强绑定在 leader 当前调用栈里
2. team 收尾可以通过统一的事件流来处理，而不是每个 teammate 各自瞎退出

这就是 swarm runtime 的味道。

## 第一部分：`teammateMailbox.ts` 说明 Claude Code 给 swarm 专门做了一套按 team/agent 路由的通信通道

我觉得这个文件特别值得记。

因为它直接说明了 Claude Code 的多 agent 协作，不是“大家共享同一个全局队列”，而是：

> **每个 teammate 在每个 team 下都有一个独立 inbox 文件。**

路径规则大概就是：

- `.claude/teams/{team_name}/inboxes/{agent_name}.json`

这已经很说明问题了。

### 为什么这设计有意思

它没有上来就做复杂网络协议，也没有强耦合某个内存消息总线，而是选择了：

- team 维度隔离
- agentName 维度路由
- json 文件存储
- 读写加 lock

这个方案看起来朴素，但非常实用。

因为它天然支持：

- 多个 teammate 并发写
- leader 侧轮询未读消息
- 消息持久化留痕
- 不依赖某个常驻 server 进程

所以这套 mailbox 的角色，不是“临时聊天记录”，而是：

> **swarm runtime 的消息总线。**

### 它不是只存 text，还存 sender / color / summary / read 状态
`TeammateMessage` 结构里有：

- from
- text
- timestamp
- read
- color
- summary

这说明 mailbox 不是只为了传 payload，而是已经带有：

- UI 展示信息
- 未读状态
- sender 身份
- 预览摘要

也就是说，这是一套既服务 runtime，又服务前台展示的消息格式。

## 第二部分：文件锁和按 inbox 追加说明作者把“并发写 mailbox”当真问题在处理

这块很工程，也很重要。

`writeToMailbox(...)` 不是简单：

- 读文件
- append
- 写回

它会：

- 先确保 inbox 文件存在
- 对 inbox file 加 lock
- 获取锁后再重新读最新消息
- append 新消息
- 再写回

这说明什么？

说明作者非常清楚 swarm 环境里会出现：

- 多个 agent 同时给一个 recipient 写消息
- leader 和其他 teammate 并发读写

如果不做锁，inbox 很容易就炸。

所以 mailbox 这层不是“为了方便实现随便写个 JSON”，而是：

> **一个认真处理并发追加的消息通道。**

这也进一步证明它确实是 runtime 协议层，而不是 UI 辅助工具。

## 第三部分：`teammateInit.ts` 把 Stop hook 变成了“idle 协议出口”

如果 mailbox 是通道，那 `teammateInit.ts` 就是协议接入点之一。

这个文件里最关键的动作是：

- 非 leader teammate 在初始化时注册一个 Stop hook
- 当 session stop 时，把自己标记 idle
- 给 leader 发 idle notification

这意味着在 swarm 里，Stop hook 的意义已经和普通单机 session 不一样了。

在普通 session 里，stop 更多只是“这一轮结束”。

但在 teammate 里，stop 还变成：

> **向 team 其他成员，尤其是 leader，显式广播“我现在空了 / 我现在可用了”。**

这个设计很漂亮。

因为它把“运行结束”提升成了“协作状态变化”。

### 这里还有个很妙的点：同一文件里顺手注入 team-wide allowed paths
这意味着 teammateInit 不是只做 idle hook，它还会：

- 从 team file 里读 `teamAllowedPaths`
- 通过 `applyPermissionUpdate(...)` 注入到当前 teammate 的 session permission context

这相当于在 swarm 初始化时，一边接上通信协议，一边接上团队权限继承。

所以 `teammateInit.ts` 的真实角色更像：

> **teammate runtime 接入 swarm 协议与 team 规则的初始化适配层。**

## 第四部分：`stopHooks.ts` 说明 idle / task completed 这些 teammate 事件已经被抬进正式 runtime 收尾链

这是我觉得特别关键的一步。

如果只有 teammateInit 发消息，那它还像“局部技巧”。

但 `src/query/stopHooks.ts` 明显说明：

- 当当前 session 是 teammate 时
- Stop hooks 通过后
- 还会继续执行 `TaskCompleted` 和 `TeammateIdle` 这些 teammate 相关 hooks
- 如果这些 hooks 阻止 continuation，也会形成正式 stop reason / blocking error

这说明什么？

说明 Claude Code 并没有把 swarm 协议当成外挂，而是：

> **把 teammate 的 idle / task-completed 语义正式接进了 stop runtime 链。**

这个判断非常重要。

因为它意味着：

- teammate idle 不是附属日志
- teammate 完成任务不是纯业务层概念
- 它们是 stop 阶段的一等事件

也就是说，swarm 协议已经进入 query/runtime 级别的主收尾路径了。

这就是为什么我会说 swarm 在 Claude Code 里是 runtime，不是 feature。

## 第五部分：`cli/print.ts` 暴露了 leader 侧真正的“协调循环”

如果只看前面几层，你可能还会觉得 leader 只是个被动收件箱。

但 `cli/print.ts` 里那段逻辑把 leader 的角色讲得很清楚了。

它会做几件关键事：

- 如果当前是 team lead，就轮询 unread teammate messages
- 在队友仍 active 时持续 poll
- 处理 `shutdown_approved`
- 收到 shutdown_approved 后，把对应 teammate 从 team file 和 teamContext 里移除
- 如果输入关闭但队友还活着，会主动注入 shutdown prompt
- 最终要确保 team 清掉，用户才能收到最后响应

这说明 leader 在 swarm 里不是普通 agent，而更像：

> **一个带收件、协调、收尾职责的 orchestrator loop。**

这很关键。

因为它意味着 swarm 不是“leader 起几个 worker 然后等”，而是：

- worker 通过 mailbox 回报状态
- leader 持续轮询并消费这些状态
- leader 负责推动 shutdown 闭环
- team 不关，最终响应都不能安全结束

这已经很像一个小型编排器了。

## 第六部分：shutdown 流程说明 Claude Code 非常在意“优雅退场”，而不是“任务没了就行”

这条线我觉得是整个协议层里最有人味、也最工程的一点。

在 `TeamDeleteTool` 那边我们已经看到：

- 有 active teammate 时不能直接删 team
- 要先 `requestShutdown`

但直到看 `cli/print.ts` 和 mailbox 相关逻辑，才会真正明白为什么。

因为 shutdown 在这里不是：

- 直接 kill 进程

而是一个带反馈闭环的协议：

- leader 请求 shutdown
- teammate 通过协议回报 `shutdown_approved`
- leader 收到后移除 teammate
- 最终 team 清空后，leader 才能安全结束

这说明作者在 swarm 里关注的不是“尽快收掉资源”，而是：

> **协作关系要完整收束，状态、文件、UI、task 世界都要一起退场。**

这个设计很稳。

也说明 Claude Code 把 swarm 当成长期运行关系，而不是短命并发任务。

## 第七部分：所以这条协议线真正说明的是——swarm 的核心不在“多 agent”，而在“多 agent 之间有没有稳定协作协议”

如果把前面几层压一下，我觉得最值得留下来的判断是：

> **Claude Code 的 swarm 真正高级的地方，不是能起多个 teammate，而是这些 teammate 之间有一套稳定的 mailbox + idle + shutdown 协议。**

为什么这是重点？

因为“多 agent 并发”本身不难，难的是：

- 谁给谁发消息
- leader 怎么知道成员状态变了
- 成员 idle / 完成时怎么回报
- 输入关闭时怎么收尾
- 最终怎么确保 team 干净退出

Claude Code 在这块给出的答案，不是隐式魔法，而是显式协议。

这非常好。

因为显式协议意味着：

- 好调试
- 好追踪
- 好扩展
- 好接入 UI / hooks / stop chain

所以我会把 88 的最大结论定成：

> **swarm 之所以是 runtime，不是因为它并发，而是因为它有协议。**

## 一句话定义

如果让我给这篇留一个最短定义，我会写：

> Claude Code 的 teammate 协作，是靠显式协议而不是共享调用栈维持的：`teammateMailbox.ts` 提供 team+agent 维度的文件式消息总线，`teammateInit.ts` 在 Stop 时把 idle 状态回报给 leader，`stopHooks.ts` 把 TaskCompleted / TeammateIdle 纳入正式收尾链，而 `cli/print.ts` 在 leader 侧持续消费这些消息并推进 shutdown 闭环，因此 swarm 的关键不只是多 agent，而是多 agent 之间有一套稳定的通信与收尾协议。**

## 术语补充 / 名词解释

### mailbox

teammate 之间的文件式 inbox 通道。按 team 和 agentName 路由，不只是日志，而是运行时消息总线。

### idle notification

teammate 在 stop / idle 时发给 leader 的状态回报。说明这名成员当前可用或已结束这一轮。

### shutdown_approved

teammate 对 leader shutdown 请求的确认信号。leader 依赖它完成成员移除和 team 收尾。

### leader polling loop

leader 侧在 `cli/print.ts` 里的轮询协调循环。负责消费未读 teammate 消息并推动 swarm 收尾。

## 有意思的设计点

### 1. Claude Code 没把 swarm 协作做成隐式共享状态，而是做成显式协议

这让整个系统更像真正 runtime，而不是一些互相耦合的小技巧。

### 2. Stop hook 在 swarm 里被重新赋予了“协作事件出口”的意义

这非常漂亮，也把 hooks 线和 swarm 线接起来了。

### 3. team 清理闭环最终落到了 leader 的 print loop 上

这说明 leader 真的是编排者，而不是普通 agent 的一员。

## 和前面已读模块的关系

88 接在 85-87 后面是顺的：

- 85：team / teammate runtime 是什么
- 86：team 对象怎么 create / cleanup
- 87：teammate 本体怎么跑起来
- 88：这些 teammate 跑起来后怎么通信和收尾

到这里，swarm 线已经从：

- 对象层
- 生命周期层
- 运行体层
- 协议层

四层都开始成形了。
