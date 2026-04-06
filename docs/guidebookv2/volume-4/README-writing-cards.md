---
title: 卷四写作卡片
status: draft
updated: 2026-04-07
---

# 卷四写作卡片

> 用途：作为新卷四的内部写作卡片。先按“持续工作总图”搭骨架，再从旧文和源码里抽素材，禁止让旧文反向决定新文章结构。

---

## 01｜为什么 Claude Code 不是“一轮跑完就重来”的系统

### 主问题
为什么 Claude Code 不能被理解成“一次输入、一次输出就结束”的系统，而必须被理解成一套持续工作的系统？

### 核心判断句
**Claude Code 不是一轮跑完就重来的系统；它的很多内部设计都服务于“把工作继续维持下去”。**

### 这篇必须完成的任务
- 作为卷四总起篇，先立“持续工作”这个总问题
- 把卷四和卷二、卷三区分开：卷二讲一轮怎么跑，卷三讲怎么执行，卷四讲怎么持续维持
- 让读者先理解为什么需要这一整条上下文与状态线

### 这篇不讲什么
- 不先讲对象百科
- 不先讲 compact 细节
- 不把这一篇写成 session 存储实现篇

### Mermaid 主图
1. 一轮系统 vs 持续工作系统对照图
2. Claude Code 持续工作总位置图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/15-session-line-conclusion.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/04-session-storage.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-2/01-how-a-request-enters-the-main-loop.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-3/11-stable-execution-layer-map.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/assistant/sessionHistory.ts`
- `/Users/haha/.openclaw/workspace/cc/src/bridge/createSession.ts`
- `/Users/haha/.openclaw/workspace/cc/src/commands/session/session.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/services/SessionMemory/sessionMemory.ts`

### 对后文的导流
- 第 2 篇进入卷四核心对象边界
- 第 3 篇进入当前可工作上下文的构造

---

## 02｜messages / context / system prompt / transcript / session 为什么不是一回事

### 主问题
卷四里的 messages、context、system prompt、transcript、session 为什么不能被混成一个“大上下文”概念？

### 核心判断句
**messages、context、system prompt、transcript、session 不是一回事；Claude Code 的持续工作能力正是建立在这些对象被分层对待之上。**

### 这篇必须完成的任务
- 把卷四最核心的一组对象边界立住
- 防止后文 projection / compact / restore 全部讲糊
- 让读者看见哪些是消息层，哪些是工作面，哪些是长期轨迹，哪些是会话单位

### 这篇不讲什么
- 不展开 projection / compact 细节
- 不讲所有 UI 状态对象
- 不写成术语手册

### Mermaid 主图
1. messages / context / system prompt / transcript / session 分层图
2. 卷四对象边界对照图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/08-system-prompt-and-context.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/13-system-user-contexts.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/11-four-context-forms-side-by-side.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/04-session-storage.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/constants/messages.ts`
- `/Users/haha/.openclaw/workspace/cc/src/constants/prompts.ts`
- `/Users/haha/.openclaw/workspace/cc/src/constants/systemPromptSections.ts`
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`
- `/Users/haha/.openclaw/workspace/cc/src/assistant/sessionHistory.ts`

### 对后文的导流
- 第 3 篇进入当前可工作的上下文构造
- 第 4 篇进入为什么不能原样无限送模

---

## 03｜当前可工作的上下文是怎么被拼起来的

### 主问题
Claude Code 当前 turn 真正依赖的上下文面是怎么形成的，为什么它不等于“把全部历史直接送模”？

### 核心判断句
**Claude Code 每一轮真正依赖的不是裸历史，而是一块被构造出来、可继续工作的当前上下文面。**

### 这篇必须完成的任务
- 解释当前工作面是如何由 system prompt、additional contexts、messages 等共同构成
- 把对象边界推进成“构造链”
- 为后面的治理链铺路

### 这篇不讲什么
- 不提前深讲 compact / collapse / projection
- 不讲 restore 逻辑
- 不写成 prompt 拼装流水账

### Mermaid 主图
1. 当前可工作上下文构造图
2. system prompt + contexts + messages 形成工作面的示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/08-system-prompt-and-context.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/13-system-user-contexts.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/03-does-long-context-recompute-every-turn.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/constants/prompts.ts`
- `/Users/haha/.openclaw/workspace/cc/src/constants/systemPromptSections.ts`
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/api/sessionIngress.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/messages.ts`

### 对后文的导流
- 第 4 篇进入治理链为什么变成必要能力
- 第 5 篇进入治理链总图

---

## 04｜为什么系统不能把全部历史原样一直送模

### 主问题
为什么持续工作一旦成立，系统就不能把全部历史原样无限送模？

### 核心判断句
**Claude Code 之所以需要上下文治理，不是为了炫技，而是因为持续工作一旦成立，原样无限送模就会变成必然失效的路径。**

### 这篇必须完成的任务
- 立住治理链的必要性
- 说明持续工作为什么天然带来历史膨胀与失真风险
- 把读者从“上下文构造”推进到“上下文治理”

### 这篇不讲什么
- 不提前深讲每个治理机制
- 不写成 token 节约技巧文
- 不抢第 5 篇总体关系图的角色

### Mermaid 主图
1. 历史原样无限送模的失效图
2. 从持续工作到治理必要性的因果图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/09-collapse-keeps-working.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/10-context-collapse-read-time-projection.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/03-does-long-context-recompute-every-turn.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/autoCompact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/compactWarningState.ts`
- `/Users/haha/.openclaw/workspace/cc/src/components/messages/CompactBoundaryMessage.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/hooks/useMaybeTruncateInput.ts`

### 对后文的导流
- 第 5 篇进入 collapse / compaction / projection / restore 总体关系图

---

## 05｜collapse / compaction / projection / restore 的总体关系图

### 主问题
collapse、compaction、projection、restore 到底是什么关系，为什么不能被写成几组并排功能点？

### 核心判断句
**collapse、compaction、projection、restore 不是并排功能，而是一条围绕“维持可工作上下文”展开的治理与恢复链。**

### 这篇必须完成的任务
- 给卷四后半建立统一总图
- 解释哪些机制偏视图治理，哪些偏主动减负，哪些偏恢复续接
- 防止后半卷散成机制图鉴

### 这篇不讲什么
- 不在这里把单个机制正文讲完
- 不把 restore 细节提前写掉
- 不写成功能目录

### Mermaid 主图
1. 卷四治理链总图
2. collapse / projection / compaction / restore 关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/09-collapse-keeps-working.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/10-context-collapse-read-time-projection.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/05-compact.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/06-microcompact.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/07-compact-vs-microcompact.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/14-session-restore.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/compact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/microCompact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/apiMicrocompact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/postCompactCleanup.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/sessionMemoryCompact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/SessionMemory/sessionMemory.ts`

### 对后文的导流
- 第 6 篇进入视图治理
- 第 7 篇进入 compact / compaction
- 第 8 篇进入 restore / recovery

---

## 06｜projection / collapse：系统治理的不是 transcript 本身，而是当前可工作的视图

### 主问题
为什么卷四真正先要校正的是“治理对象”，projection / collapse 又分别怎样改变当前可工作的视图？

### 核心判断句
**Claude Code 真正优先治理的不是 transcript 本身，而是当前 turn 可继续工作的上下文视图。**

### 这篇必须完成的任务
- 纠正“治理 = 改历史文本”的直觉误解
- 把 projection / collapse 解释成视图治理的一组关键动作
- 为 compact / compaction 正文腾出更清晰的边界

### 这篇不讲什么
- 不把 compact 细节抢掉
- 不写成实现细节目录
- 不提前展开 session recovery

### Mermaid 主图
1. transcript 与当前工作视图的区别图
2. projection / collapse 改变工作视图的流程图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/09-collapse-keeps-working.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/10-context-collapse-read-time-projection.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/11-four-context-forms-side-by-side.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/compact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/grouping.ts`
- `/Users/haha/.openclaw/workspace/cc/src/components/CompactSummary.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/components/ContextVisualization.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/components/messages/CollapsedReadSearchContent.tsx`

### 对后文的导流
- 第 7 篇进入 compact / compaction
- 第 8 篇进入 restore / recovery

---

## 07｜compact / compaction：主动减负机制本体

### 主问题
compact / compaction 在治理链里到底承担什么职责，为什么它不等于“简单删历史”？

### 核心判断句
**compact / compaction 的价值不是压短文本，而是主动重组当前工作条件，让系统继续维持可工作的上下文面。**

### 这篇必须完成的任务
- 立住 compact / compaction 的主机制地位
- 解释它为什么是主动减负，而不是被动截断
- 让读者看到它如何把系统从“越跑越胀”拉回可工作状态

### 这篇不讲什么
- 不和 projection / collapse 再混成一篇
- 不提前展开 restore / session recovery
- 不写成 compact 命令手册

### Mermaid 主图
1. compact / compaction 主机制图
2. 从膨胀上下文到重新可工作的转化图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/05-compact.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/06-microcompact.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/07-compact-vs-microcompact.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/09-collapse-keeps-working.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/commands/compact/compact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/compact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/microCompact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/apiMicrocompact.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/prompt.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/compact/postCompactCleanup.ts`

### 对后文的导流
- 第 8 篇进入 restore / session recovery

---

## 08｜restore / session recovery：系统怎么把这条线重新接活

### 主问题
为什么治理之后还需要恢复与续接，session recovery 又怎样把工作线重新接起来？

### 核心判断句
**卷四真正要解释的不是系统怎样压缩历史，而是它怎样在治理、视图调整和状态续接之后，把工作线继续维持下去。**

### 这篇必须完成的任务
- 把 recovery 拉回“持续工作总图”里收束
- 解释 session restore / recovery 为什么不是单纯读档
- 让卷四最后回到“这套系统为什么能继续活”

### 这篇不讲什么
- 不抢卷五的扩展能力正题
- 不抢卷六的命令 / 控制层入口
- 不写成 session 存档说明书

### Mermaid 主图
1. restore / recovery 续接工作线图
2. 卷四持续工作总图（卷尾收束图）

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/14-session-restore.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/15-session-line-conclusion.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/04-session-storage.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/assistant/sessionHistory.ts`
- `/Users/haha/.openclaw/workspace/cc/src/bridge/createSession.ts`
- `/Users/haha/.openclaw/workspace/cc/src/bridge/sessionRunner.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/SessionMemory/sessionMemory.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/SessionMemory/sessionMemoryUtils.ts`
- `/Users/haha/.openclaw/workspace/cc/src/commands/session/session.tsx`

### 对后文的导流
- 卷五进入外部扩展与多代理能力
- 卷六进入命令、工作流与产品层整合
