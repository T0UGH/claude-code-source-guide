---
title: 卷五｜执行边界与安全控制
date: 2026-04-06
status: draft
---

# 卷五｜执行边界与安全控制

前面几卷讲了 Claude Code 的能力、主链、上下文治理与扩展体系。  
卷五处理的是另一件决定系统气质的核心问题：

> **Claude Code 为什么不是“有能力就直接跑”的 agent，而是一套带明确执行边界和安全闸门的 runtime。**

这一卷不是单讲某个弹窗或某条 allow 规则，而是把权限系统看成一套分层行动边界：
- 哪些动作能直接做
- 哪些动作必须问
- 哪些动作会被规则长期记住
- 哪些动作即使用户想放开，也还会被更高层策略卡住

---

## 这一卷在讲什么

卷五主要讲的是 Claude Code 的权限系统，以及它怎样把安全控制接进 agent runtime。

更具体一点，这一卷会回答：

- 权限系统到底在管什么
- tool execution 和 permission decision 是怎样真正接上的
- BashTool 为什么会成为权限系统里最复杂的案例
- 路径权限、allow / deny 规则和 settings 持久化怎样组成长期授权体系
- policy limits 为什么说明本地权限系统之上还有组织级闸门
- 为什么说整套权限系统本质上是在给 agent runtime 做分层行动边界

---

## 为什么这一卷重要

Claude Code 如果只有：
- tool
- skill
- agent
- MCP
- hooks
- plugin

却没有卷五这套权限系统，那它很容易滑向另一种形态：

- 能力越多，风险越大
- 工具接得越全，越不可控
- agent 越自主，越难解释“它为什么能做这件事”

卷五的关键价值在于：

> **它说明 Claude Code 的安全性，不是靠“少做能力”换来的，而是靠把能力正式接进一套分层决策系统。**

也就是说，Claude Code 不是“安全所以很弱”，而是：

- 能力很强
- 但每一层能力都要过边界

---

## 前置阅读建议

建议先读：

- [卷一 03｜BashTool 不是跑 shell 这么简单](../volume-1/03-bashtool-is-not-just-shell.md)
- [卷二 04｜query(...) 是怎么驱动模型、工具、消息主循环的](../volume-2/04-query-main-loop.md)
- [卷四 05｜MCP 权限边界：为什么外部能力进来以后还要再过统一闸门](../volume-4/05-mcp-permission-boundary.md)

如果想更完整一点，再补：
- [卷一 09｜主循环里 tool 怎么被接住](../volume-1/09-how-tools-enter-runtime.md)
- [卷四 07｜PreToolUse 与 PostToolUse hook 是怎么进入工具执行主链的](../volume-4/07-pretooluse-posttooluse-hooks.md)

因为卷五的重点不是“权限是什么”，而是“权限怎样进入执行链”。不补前面这些，很容易只把它读成几条安全规则，而看不见它和 runtime 主链的关系。

---

## 建议阅读顺序

1. [卷五 01｜Claude Code 的权限系统到底在管什么](./01-permission-system-overview.md)  
   先立总图，知道这套系统究竟在管什么。

2. [卷五 02｜tool execution 和 permission decision 是怎么接上的](./02-tool-execution-and-permission-decision.md)  
   再看权限判断如何进入真实工具调用主链。

3. [卷五 03｜BashTool 的权限判断为什么不是跑命令前问一下这么简单](./03-bashtool-permission-model.md)  
   看权限系统里最重、最典型的案例。

4. [卷五 04｜路径权限、allow / deny 规则和 settings 持久化是怎么组成长期授权体系的](./04-path-permissions-and-persistence.md)  
   把视角从单次决策推进到长期授权体系。

5. [卷五 05｜policy limits 是怎么把本地权限系统再往上套一层组织策略闸门的](./05-policy-limits.md)  
   继续往上，看谁拥有更高层权威。

6. [卷五 06｜为什么说 Claude Code 的权限系统本质上是在给 agent runtime 做分层行动边界](./06-permission-system-conclusion.md)  
   最后把这一卷收成一个架构判断。

---

## 如果你只想先抓主线

先读这 4 篇：

1. [01｜Claude Code 的权限系统到底在管什么](./01-permission-system-overview.md)
2. [02｜tool execution 和 permission decision 是怎么接上的](./02-tool-execution-and-permission-decision.md)
3. [03｜BashTool 的权限判断为什么不是跑命令前问一下这么简单](./03-bashtool-permission-model.md)
4. [06｜为什么说 Claude Code 的权限系统本质上是在给 agent runtime 做分层行动边界](./06-permission-system-conclusion.md)

这 4 篇读顺了，卷五的骨架就基本立住了：
- 它在管什么
- 它怎么接进执行链
- 它为什么不是表面问一下那么简单
- 它最终在系统里承担什么角色

---

## 读完这一卷你会得到什么

如果卷五读顺了，你应该会更清楚地知道：

- Claude Code 的权限系统不是几条零散规则，而是一条正式决策链
- permission decision 不是布尔值，而是能影响执行、输入、结果和日志的一层运行时决策
- BashTool 为什么会成为整套权限系统里最复杂、也最关键的高风险案例
- 本地授权体系和更高层策略闸门之间是什么关系
- 为什么这整套设计最终服务的不是“确认框 UI”，而是 agent runtime 的分层行动边界

一句话说：

> **卷五读完，Claude Code 的安全控制就不再像一堆零碎限制，而会显出一套完整的执行边界体系。**
