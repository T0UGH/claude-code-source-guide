# Claude Code 源码导读手册

> 六卷系统拆解 Claude Code 的内部结构。

这是一个面向中文读者的公开项目：
把 Claude Code 的核心源码重新整理成一套**可连续阅读、可按主题跳读、也可作为系统设计参考**的导读手册。

它不是零散笔记归档，也不是按写作时间堆起来的源码阅读记录。  
它更像一套按系统结构重排后的 guidebook：

- 从 runtime 底座开始
- 进入请求主链
- 解释长上下文与会话恢复
- 再展开扩展体系、权限边界与多 agent 协作

## 在线阅读

- 文档站：<https://t0ugh.github.io/claude-code-source-guide/>
- Guidebook 总览：<https://t0ugh.github.io/claude-code-source-guide/guidebook/>

## 这套手册为什么值得看

如果你在用 Claude Code，或者正在研究 coding agent / AI runtime，最容易遇到的问题往往不是“怎么用某个功能”，而是：

- 它的主循环到底怎么跑
- tool / agent / skill / prompt 分别处在哪一层
- 为什么长会话还能继续工作
- MCP、hooks、plugin 为什么不是一类东西
- 为什么它的权限系统不是几个确认框
- team / teammate 为什么已经像一套 swarm runtime

这套手册的目标，就是把这些问题系统地讲清楚。

## 六卷分别讲什么

### 卷一｜运行时底座
讲 Claude Code 的基础部件：
- tool
- agent
- skill
- prompt

### 卷二｜一条请求是怎么跑完整个系统的
讲主线程请求主链：
- QueryEngine
- query(...)
- processUserInput
- messages.ts
- prompt / context 组装

### 卷三｜长上下文与会话恢复
讲长会话能力：
- compact
- microCompact
- snip
- context collapse
- sessionStorage
- conversationRecovery
- sessionRestore

### 卷四｜外部能力和扩展点是怎么接进来的
讲扩展体系：
- MCP
- hooks
- plugin

### 卷五｜执行边界与安全控制
讲权限系统：
- permission decision
- BashTool 权限模型
- 路径授权
- policy limits

### 卷六｜多 agent 协作运行时
讲 team / teammate / swarm runtime：
- team 生命周期
- teammate runtime
- mailbox 协议
- Local / Remote / teammate 边界

## 适合谁读

这套手册主要适合：

1. **Claude Code 用户 / 爱好者**  
   想知道它到底是怎么工作的，而不只满足于“会用”。

2. **做 coding agent / AI runtime 的工程师**  
   想借 Claude Code 看运行时编排、上下文治理、权限边界和多 agent 协作的工程设计。

3. **想按主题快速跳读的人**  
   你不一定准备从头读到尾，只想快速看 QueryEngine、MCP、权限系统、team runtime 等某一块。

## 从哪里开始读

### 如果你第一次进入这个项目
建议先读：
- [Guidebook 总览](./docs/guidebook/index.md)
- [卷一｜运行时底座](./docs/guidebook/volume-1/index.md)
- [卷二｜一条请求是怎么跑完整个系统的](./docs/guidebook/volume-2/index.md)

### 如果你只想抓主线
可以直接看每卷的导读页：
- [卷一](./docs/guidebook/volume-1/index.md)
- [卷二](./docs/guidebook/volume-2/index.md)
- [卷三](./docs/guidebook/volume-3/index.md)
- [卷四](./docs/guidebook/volume-4/index.md)
- [卷五](./docs/guidebook/volume-5/index.md)
- [卷六](./docs/guidebook/volume-6/index.md)

## 仓库结构

- `docs/guidebook/` — 手册正文与各卷导读
- `docs/notes/` — 结构重组、编辑与建站相关工作笔记
- `docs/superpowers/` — 这轮项目推进中用到的设计稿与实施计划

## 当前状态

目前仓库已经完成：
- 六卷正文迁移
- 第一轮技术编辑收稿
- 各卷导读页
- guidebook 总入口页
- MkDocs Material 文档站部署

## 一句话理解这个项目

> 这不是把 Claude Code 源码拆成很多零件的资料堆，而是把它重新整理成一套适合中文读者系统阅读的源码导读手册。
