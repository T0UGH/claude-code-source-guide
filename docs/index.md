---
title: Claude Code 源码导读手册
date: 2026-04-12
---

# Claude Code 源码导读手册

> 一套按 **7 个认知台阶** 重组 Claude Code 内部结构的中文源码导读手册。

这里是公开站点首页。当前默认阅读入口已经切到 **guidebook v2**。

## 从哪里开始

### 第一次进入这个项目
建议直接从这里开始：

- [开始阅读｜Guidebook v2 总览](./guidebookv2/README.md)
- [卷一｜Claude Code 系统全景导论](./guidebookv2/volume-1/index.md)
- [卷二｜一次 Agent Turn 怎么跑起来](./guidebookv2/volume-2/index.md)

### 如果你想先抓整套结构
可以直接按七卷导读进入：

1. [卷一｜Claude Code 系统全景导论](./guidebookv2/volume-1/index.md)
2. [卷二｜一次 Agent Turn 怎么跑起来](./guidebookv2/volume-2/index.md)
3. [卷三｜工具系统怎么把模型意图落成执行](./guidebookv2/volume-3/index.md)
4. [卷四｜上下文与状态怎么维持系统持续工作](./guidebookv2/volume-4/index.md)
5. [卷五｜外部扩展与多代理能力](./guidebookv2/volume-5/index.md)
6. [卷六｜多 agent 协作运行时](./guidebookv2/volume-6/index.md)
7. [卷七｜命令、工作流与产品层整合](./guidebookv2/volume-7/index.md)

## 这套手册在讲什么

这套手册不是带你“逛源码目录”，而是在回答一串更关键的问题：

- Claude Code 到底是什么系统
- 一次请求怎么跑成一次 Agent Turn
- 模型决定做事之后，执行能力怎么真正落地
- 上下文、状态和恢复机制为什么能让系统持续工作
- Claude Code 怎样接入外部能力，并长成一个可扩展平台
- 为什么它的多 agent 能力已经更像协作运行时，而不只是“多开几个 agent”
- 用户入口、运行时接口、工作流控制层，最后又怎样被收成今天这个产品

## 七卷各自回答什么

- **卷一**：先看清 Claude Code 到底是什么系统
- **卷二**：看一次用户请求怎样闭合成一轮 Agent Turn
- **卷三**：看模型意图怎样被执行层真正落成现实动作
- **卷四**：看上下文、状态、压缩和恢复机制怎样维持持续工作
- **卷五**：看 skills、MCP、agents、hooks、plugins 怎样把系统推向平台层
- **卷六**：看 team / teammate / mailbox / swarm 怎样把系统推进成协作 runtime
- **卷七**：看用户入口、runtime interface、workflow control layer 怎样最终收成产品形态

## 推荐阅读路线

### 路线 A：第一次系统阅读
- [Guidebook v2 总览](./guidebookv2/README.md)
- [卷一](./guidebookv2/volume-1/index.md)
- [卷二](./guidebookv2/volume-2/index.md)
- 然后按卷三到卷七顺序继续

### 路线 B：只想抓运行主线
- [卷二｜一次 Agent Turn 怎么跑起来](./guidebookv2/volume-2/index.md)
- [卷三｜工具系统怎么把模型意图落成执行](./guidebookv2/volume-3/index.md)
- [卷四｜上下文与状态怎么维持系统持续工作](./guidebookv2/volume-4/index.md)

### 路线 C：只想抓平台到产品这条线
- [卷五｜外部扩展与多代理能力](./guidebookv2/volume-5/index.md)
- [卷六｜多 agent 协作运行时](./guidebookv2/volume-6/index.md)
- [卷七｜命令、工作流与产品层整合](./guidebookv2/volume-7/index.md)

## 当前入口说明

- `guidebookv2/` 是当前正式阅读入口
- `guidebook/` 旧资产仍保留在仓库中，但已退出主导航
- 站点导航默认按 guidebook v2 的七卷结构展开
