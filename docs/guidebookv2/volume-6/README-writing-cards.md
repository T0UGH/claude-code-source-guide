---
title: 卷六写作卡片
status: draft
updated: 2026-04-08
---

# 卷六写作卡片

> 用途：作为新版卷六（多 agent 协作运行时）的**证据作战卡**。  
> 不再只给卷级判断和文章职责，也必须提前给每篇文章的：
>
> - 旧文章素材锚点
> - 源码锚点
> - 主证据链
> - mermaid 主图要求
> - 不能空讲的硬货
>
> **没有证据抓手的卡片，不允许直接派给 agent。**

---

## 一、卷六当前结构总览

当前确定：

- 总起篇：**1 篇**
- 旧卷六主线：**6 篇**
- 合计：**7 篇**

卷六主线顺序固定为：

> **总起 → team 位置 → lifecycle → teammate runtime → mailbox / idle / shutdown → local / remote / teammate 边界 → swarm 收束**

---

## 二、卷六硬约束（新增证据版）

1. **每篇至少 1 张 mermaid 主图。**
2. **每篇必须写明旧文章素材锚点。**
3. **每篇必须写明必读源码文件。**
4. **每篇必须给出一条主证据链。**
5. **每篇必须写明“不能空讲的硬货”。**
6. **没有主证据链的卡片，不允许派给 agent。**
7. **没有主图方案的卡片，不允许派给 agent。**
8. **源码证据优先于方法论包装。**
9. **卷六比卷五更要防“大判断空转”。**
10. **旧文章只能做素材仓，不能反向决定新文章骨架。**
11. **卷六重点始终是协作层如何成立，不是命令入口如何暴露。**
12. **禁止把卷六写成“team 功能目录”或“swarm 概念宣言”。**

---

## 三、卷六分组总卡

## 3.1 总起 / 定位组（01-02）

### 这一组要解决什么
先把卷六立成“协作 runtime 卷”，并给出 team / teammate runtime 在整套 Claude Code 系统中的位置。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-6/README.md`
- `docs/guidebook/volume-6/01-team-runtime-position.md`
- `docs/guidebookv2/volume-5/25-why-these-extension-objects-converge-into-a-platform-layer.md`
- `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`

### 这一组最重要的源码入口
- `cc/src/tools/AgentTool/`
- `cc/src/tasks/`
- `cc/src/team/`

### 这一组最容易跑偏成什么
- “多 agent 很强”的概念文
- 协作 runtime 哲学文
- team 功能总览页

---

## 3.2 对象 / 运行体 / 协议组（03-05）

### 这一组要解决什么
把协作层从概念推进成正式对象、正式运行体和正式协议闭环。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-6/02-team-lifecycle.md`
- `docs/guidebook/volume-6/03-inprocess-teammate-task.md`
- `docs/guidebook/volume-6/04-mailbox-idle-shutdown.md`
- `docs/guidebook/volume-6/README.md`

### 这一组最重要的源码入口
- `cc/src/team/`
- `cc/src/tasks/InProcessTeammateTask/`
- `cc/src/tasks/`
- `cc/src/tools/`

### 这一组最容易跑偏成什么
- team API 说明书
- lifecycle 流程记事本
- 协议细节流水账

---

## 3.3 边界 / 收束组（06-07）

### 这一组要解决什么
切清不同任务承载体的角色边界，并最终把卷六收成 swarm runtime 判断。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-6/05-local-remote-teammate-boundaries.md`
- `docs/guidebook/volume-6/06-team-runtime-conclusion.md`
- `docs/guidebook/volume-6/README.md`

### 这一组最重要的源码入口
- `cc/src/tasks/LocalAgentTask/`
- `cc/src/tasks/RemoteAgentTask/`
- `cc/src/tasks/InProcessTeammateTask/`
- `cc/src/team/`

### 这一组最容易跑偏成什么
- 任务类型速查表
- “本质上就是 swarm”的大判断文
- 提前偷吃卷七的产品整合问题

---

## 四、单篇证据作战卡

## 01｜为什么说 Claude Code 的多 agent 能力本质上是一层协作 runtime
- **这篇主问题**：为什么 Claude Code 的多 agent 能力，不只是“多开几个 agent”，而是一层独立协作运行时。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-6/README.md`
  - `docs/guidebookv2/volume-5/25-why-these-extension-objects-converge-into-a-platform-layer.md`
  - `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/AgentTool.tsx`
  - `cc/src/tools/AgentTool/runAgent.ts`
  - `cc/src/tasks/`
  - `cc/src/team/`
- **主证据链**：卷五已立住“系统能长出更多执行者” → team / teammate / task / mailbox 这组对象继续把执行者结构推向协作层 → 因而多 agent 不只是数量增加，而是 runtime 结构升级。
- **必须有的 mermaid 主图**：单执行者系统 → 多执行者系统 → 协作 runtime 演化图。
- **这篇绝对不能空讲的硬货**：必须明确卷六后半要解决的 4 件硬事：team 对象、teammate 运行体、mailbox 协议、swarm 收束。
- **禁止偷吃的相邻篇职责**：不能提前把 lifecycle、mailbox、local / remote / teammate 边界讲完。

## 02｜Claude Code 的 team / teammate runtime 到底在系统里处在什么位置
- **这篇主问题**：team / teammate runtime 在整个 Claude Code 系统里到底处在什么位置。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-6/01-team-runtime-position.md`
  - `docs/guidebook/volume-6/README.md`
  - `docs/guidebook/volume-1/10-agenttool.md`
- **必读源码文件**：
  - `cc/src/team/`
  - `cc/src/tasks/`
  - `cc/src/tools/AgentTool/`
- **主证据链**：Agent 主轴已经让执行者进入 runtime → team / teammate 不是额外挂件，而是围绕执行者组织关系再长出的一层正式协作结构 → 因而它处在 agent runtime 之上、卷七控制层之下。
- **必须有的 mermaid 主图**：Claude Code runtime → 协作 runtime 分层图。
- **这篇绝对不能空讲的硬货**：必须把 team / teammate / leader 的关系放进同一张系统位置图里，不能只给抽象口号。
- **禁止偷吃的相邻篇职责**：不把 lifecycle 细节讲完，不把 swarm 收束提前做掉。

## 03｜team 是怎么被创建、注册和清理的
- **这篇主问题**：team 作为正式对象，是怎样被创建、注册和清理的。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-6/02-team-lifecycle.md`
  - `docs/guidebook/volume-6/README.md`
- **必读源码文件**：
  - `cc/src/team/`
  - `cc/src/tools/`
  - `cc/src/tasks/`
- **主证据链**：team 并不是抽象协作概念 → 它要经过创建、注册、清理这些正式生命周期步骤 → TeamCreate / TeamDelete 等对象或动作因此具有结构意义。
- **必须有的 mermaid 主图**：team lifecycle 图。
- **这篇绝对不能空讲的硬货**：必须把“正式对象”的判断压回至少一条创建 / 注册 / 清理链，而不只是抽象说 team 有生命周期。
- **禁止偷吃的相邻篇职责**：不把 InProcessTeammateTask 运行细节讲完，不把 mailbox 协议提前吃掉。

## 04｜InProcessTeammateTask：真正的 teammate runtime 是怎么在同进程里跑起来的
- **这篇主问题**：真正的 teammate runtime 是怎样在同进程里跑起来的。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-6/03-inprocess-teammate-task.md`
  - `docs/guidebook/volume-1/11-runagent-assembly-line.md`
- **必读源码文件**：
  - `cc/src/tasks/InProcessTeammateTask/`
  - `cc/src/team/`
  - `cc/src/tasks/`
- **主证据链**：team 只是对象层 → InProcessTeammateTask 把 teammate 变成正式运行体 → 协作层从对象存在推进到真正运行。
- **必须有的 mermaid 主图**：teammate runtime 装配图。
- **这篇绝对不能空讲的硬货**：必须说明它怎样接住上下文、执行职责和运行边界，不能只写“不是薄包装层”。
- **禁止偷吃的相邻篇职责**：不把 mailbox / shutdown 写完，不把边界篇写完。

## 05｜mailbox + idle / shutdown 协议：teammate 之间是怎么通信和收尾的
- **这篇主问题**：teammate 之间怎样通信、检测 idle、完成 shutdown，为什么这些协议不是边角机制。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-6/04-mailbox-idle-shutdown.md`
  - `docs/guidebook/volume-6/README.md`
- **必读源码文件**：
  - `cc/src/team/`
  - `cc/src/tasks/InProcessTeammateTask/`
  - `cc/src/tasks/`
- **主证据链**：teammate 运行体需要彼此通信与收尾 → mailbox / idle / shutdown 把协作过程变成可闭合协议 → 多 agent 协作才不至于沦为松散并行。
- **必须有的 mermaid 主图**：mailbox 通信图或 idle / shutdown 收尾协议图。
- **这篇绝对不能空讲的硬货**：必须讲出通信 + 收尾至少各一个关键结构点，不能只用“协作闭环”概括。
- **禁止偷吃的相邻篇职责**：不把 local / remote / teammate 边界写完，不把 swarm 判断提前讲完。

## 06｜LocalAgentTask、RemoteAgentTask 和 teammate runtime 的边界是什么
- **这篇主问题**：LocalAgentTask、RemoteAgentTask 和 teammate runtime 各自服务什么场景，为什么不能混成一种东西。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-6/05-local-remote-teammate-boundaries.md`
  - `docs/guidebook/volume-6/README.md`
- **必读源码文件**：
  - `cc/src/tasks/LocalAgentTask/`
  - `cc/src/tasks/RemoteAgentTask/`
  - `cc/src/tasks/InProcessTeammateTask/`
  - `cc/src/tasks/`
- **主证据链**：不同任务承载体分别服务本地执行、远程执行、协作执行 → 它们在职责、边界、回流方式上不同 → 所以不能被混成一种“任务类型”。
- **必须有的 mermaid 主图**：Local / Remote / Teammate 边界图。
- **这篇绝对不能空讲的硬货**：必须把三类承载体至少切出一个明确职责差异和一个明确运行差异。
- **禁止偷吃的相邻篇职责**：不重写 teammate runtime 正文，不提前带入卷七 command / interface 边界。

## 07｜为什么说 Claude Code 的 team 系统本质上是一个 swarm
- **这篇主问题**：为什么卷六最终不能只停在 team 功能说明上，而要收束为 swarm runtime 判断。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-6/06-team-runtime-conclusion.md`
  - `docs/guidebook/volume-6/README.md`
  - `docs/guidebookv2/volume-5/25-why-these-extension-objects-converge-into-a-platform-layer.md`
- **必读源码文件**：
  - `cc/src/team/`
  - `cc/src/tasks/`
  - `cc/src/tasks/InProcessTeammateTask/`
- **主证据链**：team 正式对象 + teammate 运行体 + mailbox / idle / shutdown 协议 + 承载体边界一起闭合 → system 不再只是 team feature 堆叠，而是带 leader / mailbox / task runtime 的 swarm 结构。
- **必须有的 mermaid 主图**：卷六 swarm runtime 总图。
- **这篇绝对不能空讲的硬货**：必须重新压出“对象 + 运行体 + 协议 + 边界”四层，而不能只喊 swarm。
- **禁止偷吃的相邻篇职责**：不把卷七的命令入口 / 控制层提前讲完。

---

## 五、当前执行提醒

1. **派单前必须先检查该篇是否已具备旧文锚点、源码锚点、主证据链、主图方案。**
2. **如果某篇卡片还不能支撑 agent 找到原始素材，禁止直接起稿。**
3. **卷六天然更容易长成“大判断文”，主会话必须优先检查“有没有把判断压回对象和链路”。**
4. **任何一篇如果写成“本质上如何如何，但证据抓手很少”的稿子，应直接判为卡片输入不足或执行跑偏。**
5. **卷六默认目标不是“概念上把协作 runtime 讲圆”，而是“把协作层怎样成立讲得有源码结构感”。**
