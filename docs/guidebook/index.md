---
title: Claude Code 源码导读手册
date: 2026-04-06
status: draft
---

# Claude Code 源码导读手册

这不是一份零散笔记归档，也不是一组按时间堆起来的源码阅读记录。

它更像一套**按系统结构重新整理过的导读手册**：

> 从 runtime 底座，到请求主链，到长上下文治理，再到扩展体系、权限边界与多 agent 协作，把 Claude Code 的核心内部结构重新排成六卷。

如果你第一次进这个项目，最重要的不是记住所有编号，
而是先知道：

- 这套手册在讲什么
- 六卷分别负责哪一块
- 你应该从哪里开始

---

## 这套 guidebook 适合谁读

这套手册主要适合三类读者：

### 1. 想系统理解 Claude Code 内部结构的人
你不满足于“会用”，而想知道：
- 它的主循环怎么跑
- tool / agent / skill 怎么分层
- 为什么长会话还能继续工作
- 扩展点和权限系统为什么这样设计

### 2. 正在做 coding agent / AI runtime / 多 agent 系统的人
你不一定关心 Claude Code 本身，但关心它背后的工程取舍：
- 运行时编排
- 上下文治理
- 工具调用闭环
- 权限边界
- team / swarm runtime

### 3. 想按主题跳读的人
你不一定准备从头读到尾，只想快速看：
- QueryEngine 主链
- MCP / hooks / plugin
- 权限系统
- 多 agent 协作层

这套 guidebook 也支持这样读。

---

## 六卷总览

### [卷一｜运行时底座](./volume-1/index.md)
这一卷讲 Claude Code 的基础部件：
- tool
- agent
- skill
- prompt

如果不先把这些对象各自处在哪一层看清，后面几卷很容易全都混成“主循环里的很多功能”。

### [卷二｜一条请求是怎么跑完整个系统的](./volume-2/index.md)
这一卷讲主线程请求主链：
- QueryEngine
- query(...)
- processUserInput
- messages.ts
- prompt / context 组装

它回答的是：**一次用户请求进入系统之后，到底怎么真正跑起来。**

### [卷三｜长上下文与会话恢复](./volume-3/index.md)
这一卷讲长会话能力：
- compact
- microCompact
- snip
- context collapse
- sessionStorage
- conversationRecovery
- sessionRestore

它回答的是：**Claude Code 为什么能在长会话里继续工作，并在中断后重新接活。**

### [卷四｜外部能力和扩展点是怎么接进来的](./volume-4/index.md)
这一卷讲扩展体系：
- MCP
- hooks
- plugin

它回答的是：**Claude Code 为什么不是封闭 runtime，而是一套有正式扩展能力面的系统。**

### [卷五｜执行边界与安全控制](./volume-5/index.md)
这一卷讲权限系统：
- permission decision
- BashTool 权限模型
- 路径授权
- policy limits

它回答的是：**Claude Code 为什么不是“有能力就直接跑”的 agent，而是一套带分层行动边界的 runtime。**

### [卷六｜多 agent 协作运行时](./volume-6/index.md)
这一卷讲 team / teammate / swarm runtime：
- team 生命周期
- teammate runtime
- mailbox 协议
- Local / Remote / teammate 边界

它回答的是：**Claude Code 的多 agent 协作层为什么已经不只是“多开几个 agent”，而是一套正式的 swarm 运行时。**

---

## 建议入口

### 如果你第一次读这套手册
先从：
- [卷一｜运行时底座](./volume-1/index.md)
- [卷二｜一条请求是怎么跑完整个系统的](./volume-2/index.md)

这是最稳的入口。

### 如果你最关心 runtime 主链
直接从：
- [卷二｜一条请求是怎么跑完整个系统的](./volume-2/index.md)

开始。

### 如果你最关心长上下文和 resume
直接从：
- [卷三｜长上下文与会话恢复](./volume-3/index.md)

开始。

### 如果你最关心扩展体系
直接从：
- [卷四｜外部能力和扩展点是怎么接进来的](./volume-4/index.md)

开始。

### 如果你最关心权限与安全边界
直接从：
- [卷五｜执行边界与安全控制](./volume-5/index.md)

开始。

### 如果你最关心多 agent / swarm
直接从：
- [卷六｜多 agent 协作运行时](./volume-6/index.md)

开始。

---

## 怎么读这套手册

### 读法 A：顺读
如果你想完整建立 Claude Code 的系统心智模型，最稳的顺序就是：

1. 卷一
2. 卷二
3. 卷三
4. 卷四
5. 卷五
6. 卷六

这是按“底座 → 主链 → 长会话 → 扩展 → 边界 → 协作”排出来的顺序。

### 读法 B：按主题跳读
如果你已经熟悉前两卷，只想补某个专题，可以直接跳到：
- 长上下文：卷三
- 扩展：卷四
- 权限：卷五
- 多 agent：卷六

### 读法 C：只抓主线
如果你不准备全读，至少建议先抓：
- 卷一 README
- 卷二 README
- 卷三 README
- 卷四 README
- 卷五 README
- 卷六 README

也就是先把六卷目录页走一遍。这样即使暂时不细读正文，也能先知道整套书的骨架。

---

## 六卷快速跳转

- [卷一｜运行时底座](./volume-1/index.md)
- [卷二｜一条请求是怎么跑完整个系统的](./volume-2/index.md)
- [卷三｜长上下文与会话恢复](./volume-3/index.md)
- [卷四｜外部能力和扩展点是怎么接进来的](./volume-4/index.md)
- [卷五｜执行边界与安全控制](./volume-5/index.md)
- [卷六｜多 agent 协作运行时](./volume-6/index.md)

---

## 一句话理解这套手册

如果只先记一句话，可以记这个：

> **这套 guidebook 的目标，不是把 Claude Code 源码拆成很多零件，而是把它重新整理成一套可以连续阅读、可以按主题跳读、也可以作为系统设计参考的源码导读手册。**
