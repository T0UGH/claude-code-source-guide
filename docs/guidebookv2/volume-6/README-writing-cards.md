---
title: 卷六写作卡片
status: draft
updated: 2026-04-08
---

# 卷六写作卡片

> 用途：作为新版卷六（多 agent 协作运行时）的内部写作卡片。先立“协作 runtime”总问题，再回到旧卷六的 team / teammate / mailbox / swarm 主线。

---

## 卷六当前结构总览

当前确定：

- 总起篇：**1 篇**
- 旧卷六主线：**6 篇**
- 合计：**7 篇**

卷六主线顺序固定为：

> **总起 → team 位置 → lifecycle → teammate runtime → mailbox / idle / shutdown → local / remote / teammate 边界 → swarm 收束**

---

## 01｜为什么说 Claude Code 的多 agent 能力本质上是一层协作 runtime

### 主问题
为什么 Claude Code 的多 agent 能力，不只是“多开几个 agent”，而是一层独立协作运行时？

### 核心判断句
**Claude Code 的多 agent 能力，不是执行者数量增加这么简单，而是系统已经长出一层新的协作 runtime。**

### 这篇必须完成的任务
- 作为卷六总起篇，先立“协作 runtime”这个卷级判断
- 从卷五的 Agent 主轴自然导向 team / teammate runtime
- 防止卷六后半滑成 team 机制说明清单

### 这篇不讲什么
- 不提前把 team lifecycle 讲完
- 不抢 mailbox / shutdown 正文
- 不提前吃卷七的命令入口与产品整合

### Mermaid 主图
1. 单执行者系统 → 多执行者系统 → 协作 runtime 的演化图
2. Agent 主轴与 team / teammate runtime 的关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/README.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-5/25-why-these-extension-objects-converge-into-a-platform-layer.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/`
- `/Users/haha/.openclaw/workspace/cc/src/team/`

### 对后文的导流
- 第 02 篇进入 team / teammate runtime 的系统位置

---

## 02｜Claude Code 的 team / teammate runtime 到底在系统里处在什么位置

### 主问题
team / teammate runtime 在整个 Claude Code 系统里到底处在什么位置？

### 核心判断句
**team / teammate 不是附着在 agent runtime 外面的功能点，而是协作运行时层的正式对象。**

### 这篇必须完成的任务
- 解释 team / teammate runtime 的系统位置
- 把它和卷五的 Agent 主轴衔接起来
- 让读者先看见协作层总图

### 这篇不讲什么
- 不把 lifecycle 细节讲完
- 不把 swarm 收束提前做掉
- 不转去讲卷七的入口与控制层

### Mermaid 主图
1. Claude Code runtime → 协作 runtime 分层图
2. team / teammate / leader 关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/01-team-runtime-position.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/team/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/`

### 对后文的导流
- 第 03 篇进入 team lifecycle
- 第 04 篇进入 teammate runtime 真正落地

---

## 03｜team 是怎么被创建、注册和清理的

### 主问题
team 作为正式对象，是怎样被创建、注册和清理的？

### 核心判断句
**team 之所以是一层正式协作运行时，不是因为它能协作，而是因为它有完整的生命周期。**

### 这篇必须完成的任务
- 把 team 从概念推进成正式对象
- 讲清 TeamCreate / TeamDelete 这类生命周期操作的意义
- 解释协作层为什么需要对象生命周期

### 这篇不讲什么
- 不抢 teammate runtime 正文
- 不把 mailbox 协议提前讲完
- 不写成 API 说明书

### Mermaid 主图
1. team lifecycle 图
2. team 创建、注册、清理流程图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/02-team-lifecycle.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/team/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/`

### 对后文的导流
- 第 04 篇进入 InProcessTeammateTask

---

## 04｜InProcessTeammateTask：真正的 teammate runtime 是怎么在同进程里跑起来的

### 主问题
真正的 teammate runtime 是怎样在同进程里跑起来的？

### 核心判断句
**多 agent 协作层真正成立，不在于有 team 对象，而在于 teammate runtime 能作为正式运行体落地。**

### 这篇必须完成的任务
- 进入卷六执行层核心
- 解释 InProcessTeammateTask 的位置
- 让读者看见 teammate runtime 不是薄包装层

### 这篇不讲什么
- 不把 mailbox / shutdown 提前吃完
- 不抢边界篇与 swarm 收束篇
- 不写成孤立函数解说

### Mermaid 主图
1. teammate runtime 装配图
2. InProcessTeammateTask 在协作层中的位置图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/03-inprocess-teammate-task.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tasks/InProcessTeammateTask/`
- `/Users/haha/.openclaw/workspace/cc/src/team/`

### 对后文的导流
- 第 05 篇进入 mailbox / idle / shutdown

---

## 05｜mailbox + idle / shutdown 协议：teammate 之间是怎么通信和收尾的

### 主问题
teammate 之间怎样通信、检测 idle、完成 shutdown，为什么这些协议不是边角机制？

### 核心判断句
**mailbox / idle / shutdown 不是协作层边缘小机制，而是多 agent 协作闭环成立的关键协议。**

### 这篇必须完成的任务
- 立住 mailbox / idle / shutdown 的系统地位
- 解释通信与收尾为什么是协作运行时的一部分
- 让卷六不只剩对象和运行体，还看见协作协议

### 这篇不讲什么
- 不写成协议细节流水账
- 不抢边界篇与 swarm 收束篇
- 不转去讲产品层通信接口

### Mermaid 主图
1. mailbox 通信图
2. idle / shutdown 收尾协议图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/04-mailbox-idle-shutdown.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/team/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/InProcessTeammateTask/`

### 对后文的导流
- 第 06 篇进入 local / remote / teammate 边界

---

## 06｜LocalAgentTask、RemoteAgentTask 和 teammate runtime 的边界是什么

### 主问题
LocalAgentTask、RemoteAgentTask 和 teammate runtime 各自服务什么场景，为什么不能混成一种东西？

### 核心判断句
**不同任务承载体之所以必须分层，不是因为实现不同，而是因为它们在协作运行时里承担的角色根本不同。**

### 这篇必须完成的任务
- 给卷六主体做边界收口
- 解释 local / remote / teammate 各自的职责位置
- 为最终 swarm 判断铺路

### 这篇不讲什么
- 不重写 teammate runtime 正文
- 不提前把卷七 command / interface 边界带进来
- 不写成任务类型速查表

### Mermaid 主图
1. Local / Remote / Teammate 边界图
2. 不同承载体在协作 runtime 中的分工图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/05-local-remote-teammate-boundaries.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tasks/LocalAgentTask/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/RemoteAgentTask/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/InProcessTeammateTask/`

### 对后文的导流
- 第 07 篇进入 swarm 收束

---

## 07｜为什么说 Claude Code 的 team 系统本质上是一个 swarm

### 主问题
为什么卷六最终不能只停在 team 功能说明上，而要收束为 swarm runtime 判断？

### 核心判断句
**Claude Code 的 team 系统，不是几个 teammate feature 的堆叠，而是一套带 leader、mailbox 和 task runtime 的 swarm。**

### 这篇必须完成的任务
- 把卷六全部对象、运行体和协议压回总图
- 解释为什么它们合起来更像 swarm runtime
- 自然导向卷七，但不抢卷七的产品入口问题

### 这篇不讲什么
- 不再逐个重讲前文正文
- 不把卷七的命令 / 控制层提前讲完
- 不写成空泛“多 agent 很强”总结文

### Mermaid 主图
1. 卷六 swarm runtime 总图
2. 卷六到卷七的导流图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/06-team-runtime-conclusion.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-6/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/team/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/`

### 对后文的导流
- 卷七进入命令、工作流与产品层整合

---

## 当前写作约束

1. **先立“协作 runtime”总问题，再拆 team / teammate / mailbox / swarm。**
2. **卷六重点是协作层如何成立，不是命令入口如何暴露。**
3. **不允许把卷六重新写成 team 功能目录。**
4. **不允许提前把卷七的 command / control layer / 产品整合吃掉。**
5. **卷尾必须收成 swarm 判断。**
6. **先按 skeleton-first 写作：先职责、再边界、再骨架、最后回收旧文素材。**
