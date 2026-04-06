---
title: 卷六｜多 agent 协作运行时
date: 2026-04-06
status: draft
---

# 卷六｜多 agent 协作运行时

前面几卷已经把 Claude Code 的运行时底座、请求主链、长上下文治理、扩展体系和权限边界拆得很清楚。  
卷六处理的是最后一块也最容易被误读的系统：

> **Claude Code 的 team / teammate 不是“多开几个 agent”，而是一套正式的多 agent 协作运行时。**

这一卷真正要立住的，不是“团队功能很多”，而是：
- team 为什么是正式对象
- teammate runtime 怎样真正跑起来
- leader、mailbox、idle、shutdown 为什么共同构成协作协议
- local / remote / teammate 这些任务承载体为什么不能混成一类

---

## 这一卷在讲什么

卷六讲的是 Claude Code 的多 agent 协作层，也就是：
- team
- teammate runtime
- mailbox 协议
- swarm 风格的调度与收尾

更具体一点，这一卷会回答：

- team / teammate runtime 在整个系统里处于什么位置
- team 作为正式对象是怎么被创建、注册和清理的
- 真正的 teammate runtime 怎样在同进程里跑起来
- teammate 之间怎样通信、检测 idle、完成 shutdown
- LocalAgentTask、RemoteAgentTask 和 teammate runtime 各自服务什么场景
- 为什么说这套系统已经不是“多 agent 功能”，而是一种 swarm runtime

---

## 为什么这一卷重要

如果不读卷六，很容易把 Claude Code 的 team 能力理解成：
- AgentTool 再包一层
- 多开几个 worker
- 并发跑任务
- 最后汇总一下

但源码真正做出来的明显比这重得多。

它不是简单“多开”，而是开始引入：
- leader / teammate 身份
- team 对象生命周期
- mailbox 通信
- idle / shutdown 协议
- 多种 task runtime 承载体

这一卷的重要性就在于：

> **它让 Claude Code 从“单 agent runtime”真正走向“多 agent 协作 runtime”。**

也就是说，team 在这里不是一个功能点，而是系统层升级。

---

## 前置阅读建议

建议先读：

- [卷一 10｜AgentTool 不是再开一个 agent 这么简单](../volume-1/10-agenttool.md)
- [卷一 11｜runAgent 是把 agent 组装成可运行体的装配线](../volume-1/11-runagent-assembly-line.md)
- [卷一 12｜forkSubagent 是在同一上下文里分叉出 worker](../volume-1/12-forksubagent.md)
- [卷二 04｜query(...) 是怎么驱动模型、工具、消息主循环的](../volume-2/04-query-main-loop.md)
- [卷五 06｜为什么说 Claude Code 的权限系统本质上是在给 agent runtime 做分层行动边界](../volume-5/06-permission-system-conclusion.md)

因为卷六其实是在前面这些 runtime 之上再加一层协作结构。不补这些，很容易把 team 误读成“只是 agent 功能更多了”。

---

## 建议阅读顺序

1. [卷六 01｜Claude Code 的 team / teammate runtime 到底在系统里处在什么位置](./01-team-runtime-position.md)  
   先立 team / teammate 的总图。

2. [卷六 02｜TeamCreateTool / TeamDeleteTool / team 是怎么被创建、注册和清理的](./02-team-lifecycle.md)  
   再看 team 这个正式对象的生命周期外壳。

3. [卷六 03｜InProcessTeammateTask：真正的 teammate runtime 是怎么在同进程里跑起来的](./03-inprocess-teammate-task.md)  
   进入真正的执行层。

4. [卷六 04｜mailbox + idle / shutdown 协议：teammate 之间是怎么通信和收尾的](./04-mailbox-idle-shutdown.md)  
   看协作协议和收尾机制。

5. [卷六 05｜LocalAgentTask、RemoteAgentTask 和 teammate runtime 的边界是什么](./05-local-remote-teammate-boundaries.md)  
   把几种任务承载体的边界拉开。

6. [卷六 06｜为什么说 Claude Code 的 team 系统本质上是一个带 leader、mailbox 和 task runtime 的 swarm](./06-team-runtime-conclusion.md)  
   最后把这一卷收成一个更大的架构判断。

---

## 如果你只想先抓主线

先读这 4 篇：

1. [01｜Claude Code 的 team / teammate runtime 到底在系统里处在什么位置](./01-team-runtime-position.md)
2. [03｜InProcessTeammateTask：真正的 teammate runtime 是怎么在同进程里跑起来的](./03-inprocess-teammate-task.md)
3. [04｜mailbox + idle / shutdown 协议：teammate 之间是怎么通信和收尾的](./04-mailbox-idle-shutdown.md)
4. [06｜为什么说 Claude Code 的 team 系统本质上是一个带 leader、mailbox 和 task runtime 的 swarm](./06-team-runtime-conclusion.md)

这 4 篇读顺了，卷六的主干就基本立住了：
- 它在系统里是什么
- 它怎么跑
- 它怎么协作
- 它为什么已经像 swarm runtime

---

## 读完这一卷你会得到什么

如果卷六读顺了，你应该会更清楚地知道：

- Claude Code 的 team / teammate 不是“多开几个 agent”，而是更正式的协作运行时
- team 是正式对象，teammate 是正式运行体，leader / mailbox / protocol 是正式结构件
- mailbox、idle、shutdown 为什么不是辅助小机制，而是协作闭环成立的关键
- LocalAgentTask、RemoteAgentTask、teammate runtime 为什么必须分层理解
- 为什么这套系统已经非常接近一个 swarm runtime，而不只是多 agent feature

一句话说：

> **卷六读完，Claude Code 的多 agent 协作层就不再像几个分散功能，而会显出一套真正的 swarm 运行时轮廓。**
