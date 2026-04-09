# Claude Code 源码导读手册

> 按 7 个认知台阶重组 Claude Code 内部结构的中文源码导读项目。

这是一个面向中文读者的公开项目。

它不是零散笔记归档，也不是按源码目录平铺的阅读记录，而是把 Claude Code 重新整理成一套**可连续阅读、可按主题跳读、也可作为系统设计参考**的 guidebook。

当前仓库的正式阅读入口已经切到 **guidebook v2**。

## 在线阅读

- 文档站：首页：<https://t0ugh.github.io/claude-code-source-guide/>
- Guidebook v2 总览：<https://t0ugh.github.io/claude-code-source-guide/guidebookv2/>

说明：
- `guidebookv2/` 是当前正式阅读入口
- `guidebook/` 旧资产仍保留在仓库中，但不再作为默认导航

## 这套手册在讲什么

这套手册不是带你“逛源码目录”，而是想回答一串更关键的问题：

- Claude Code 到底是什么系统
- 一次请求怎么跑成一次 Agent Turn
- 模型决定做事之后，执行能力怎么真正落地
- 上下文、状态和恢复机制为什么能让系统持续工作
- Claude Code 怎样接入外部能力，并长成一个可扩展平台
- 为什么它的多 agent 能力已经更像协作运行时，而不只是“多开几个 agent”
- 用户入口、运行时接口、工作流控制层，最后又怎样被收成今天这个产品

## 七卷分别讲什么

### 卷一｜Claude Code 系统全景导论
先回答：**Claude Code 到底是什么系统。**

这一卷建立全景图，帮助读者先看清核心对象、层次关系和整体轮廓。

### 卷二｜一次 Agent Turn 怎么跑起来
回答：**一次用户请求怎么真正进入系统，并闭合成一轮 agent turn。**

这一卷是动态主线卷，重点在请求入口、主循环、QueryEngine 与当前 turn 的形成。

### 卷三｜工具系统怎么把模型意图落成执行
回答：**模型已经决定做事之后，runtime 怎么把意图落成现实执行。**

这一卷进入执行层，重点看 tool abstraction、tool orchestration 和本地能力接入。

### 卷四｜上下文与状态怎么维持系统持续工作
回答：**Claude Code 为什么不是一轮跑完就散，而是能持续工作。**

这一卷重点是上下文构造、状态维持、压缩治理与恢复机制。

### 卷五｜外部扩展与多代理能力
回答：**Claude Code 怎样长出更多能力，并把系统外部的能力源接进来。**

这一卷聚焦 skills、MCP、agents、hooks、plugins 等扩展对象。

### 卷六｜多 agent 协作运行时
回答：**为什么 Claude Code 的多 agent 能力，本质上是一层协作运行时。**

这一卷重点看 team / teammate runtime、生命周期、mailbox 协议与 swarm 收束。

### 卷七｜命令、工作流与产品层整合
回答：**用户入口、运行时接口、工作流控制层，是怎样最终收成一个完整产品形态的。**

这一卷是控制层 / 产品整合卷，负责把 command、workflow、runtime interface 和产品形态收在一起。

## 适合谁读

这套手册主要适合：

1. **Claude Code 用户 / 爱好者**  
   不只想“会用”，还想知道它为什么这样工作。

2. **做 coding agent / AI runtime / 多 agent 系统的工程师**  
   想看运行时编排、上下文治理、执行层、扩展层、权限边界与协作系统的工程取舍。

3. **想按主题快速跳读的人**  
   不一定从头读到尾，但想快速抓某一条主线，比如 QueryEngine、工具执行层、MCP、team runtime 或产品控制层。

## 从哪里开始读

### 如果你第一次进入这个项目
建议先读：

- [Guidebook v2 总览](./docs/guidebookv2/README.md)
- [卷一｜Claude Code 系统全景导论](./docs/guidebookv2/volume-1/index.md)
- [卷二｜一次 Agent Turn 怎么跑起来](./docs/guidebookv2/volume-2/index.md)

### 如果你只想先抓整体结构
可以直接看七卷导读：

- [卷一](./docs/guidebookv2/volume-1/index.md)
- [卷二](./docs/guidebookv2/volume-2/index.md)
- [卷三](./docs/guidebookv2/volume-3/index.md)
- [卷四](./docs/guidebookv2/volume-4/index.md)
- [卷五](./docs/guidebookv2/volume-5/index.md)
- [卷六](./docs/guidebookv2/volume-6/index.md)
- [卷七](./docs/guidebookv2/volume-7/index.md)

## 仓库结构

- `docs/guidebookv2/` — 当前正式阅读入口与重写结果
- `docs/guidebook/` — 旧资产与旧卷结构，保留作参考与迁移素材
- `docs/notes/` — 重组、编辑、建站相关工作笔记
- `docs/superpowers/` — 设计稿、实施计划与过程性文档

## 当前状态

目前仓库已经完成：

- GitHub Pages 默认入口切到 `guidebookv2/`
- v2 七卷主结构已经建立
- 卷一到卷七均已具备卷级入口页
- MkDocs Material 文档站已部署并可在线阅读
- 旧版 `guidebook/` 继续保留在仓库中，方便回收旧资产

## 一句话理解这个项目

> 这不是把 Claude Code 源码拆成很多零件的资料堆，而是把它重新整理成一套适合中文读者建立系统心智模型的源码导读手册。
