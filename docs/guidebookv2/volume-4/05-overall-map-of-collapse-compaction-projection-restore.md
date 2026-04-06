---
title: 卷四 05｜collapse / compaction / projection / restore 的总体关系图
date: 2026-04-07
tags:
  - Claude Code
  - 治理链
  - 总图
  - guidebookv2
---

# 卷四 05｜collapse / compaction / projection / restore 的总体关系图

## 导读

- **所属卷**：卷四：上下文与状态怎么维持系统持续工作
- **卷内位置**：05 / 08
- **上一篇**：[卷四 04｜为什么系统不能把全部历史原样一直送模](./04-why-the-system-cannot-keep-sending-the-entire-history.md)
- **下一篇**：[卷四 06｜projection / collapse：系统治理的不是 transcript 本身，而是当前可工作的视图](./06-projection-and-collapse-govern-the-workable-view-not-the-transcript-itself.md)

上一篇已经说明：一旦系统允许同一条工作线长期推进，治理就会变成必需项。现在还不能直接冲进单个机制，因为那样卷四后半会退化成功能目录。更稳的做法，是先把 collapse、compaction、projection、restore 压回一条链：它们不是并排能力，而是围绕“维持当前可工作的上下文面”展开的治理与恢复分工。

## 这篇要回答的问题

> **collapse、compaction、projection、restore 到底是什么关系，为什么不能被写成几块并列功能？**

这篇要留下的判断是：

> **卷四后半真正展开的，不是四个功能名，而是一条围绕“当前工作面能否继续成立”组织起来的治理与恢复链。**

## 先给后半卷总图

```mermaid
flowchart TD
    A[当前工作面持续增长] --> B[必须治理]
    B --> C[projection / collapse\n调整当前工作视图]
    C --> D[compact / compaction\n主动减负并重设活动段]
    D --> E[restore / recovery\n把工作线重新接回当前 runtime]
    E --> F[继续工作]
```

这张图最重要的是顺序关系，不是时间顺序，而是职责顺序：先看清治理对象，再看主动减负，再看如何续接。

## projection / collapse：更靠近“当前视图怎么被处理”

projection 和 collapse 更靠近视图层。它们首先回答的不是“历史是否被删除”，而是：

- 当前 turn 还需要带着哪些旧内容？
- 这些旧内容该以原样、折叠、投影还是替代表达进入当前工作面？
- 怎样在不要求历史总是原密度出现的前提下，维持一块可工作的视图？

也因此，projection / collapse 更像 **视图治理**，而不是对 transcript 本体发动处理。

## compact / compaction：更靠近“主动减负并重设下一段工作条件”

compact 往前走了一步。它不只是把当前视图变轻，而是明确引入：

- boundary
- summary
- retained context
- post-compact cleanup

这些动作连在一起，意味着系统不是简单“缩一缩”，而是在 **主动改写后续工作段的默认起跑线**。这也是为什么 compact 在卷四里必须单独成篇：它是治理链里最像“重新组织工作条件”的动作。

## restore / recovery：更靠近“这条线怎样重新接活”

如果链条只停在治理，它仍然只是半套系统。卷四最后必须把 restore / recovery 拉回来，因为持续工作不是“能压缩”，而是“压完之后还能接着干”。

从职责上说，restore / recovery 主要处理的是：

- 从档案里整理出还能接的工作包
- 把这份工作包接回当前 runtime
- 让 session、当前状态和新一轮 query 重新连成一条线

所以它们不是治理链的尾声装饰，而是卷四总问题的最后闭环。

## 代码里的分工，也天然更像一条链

- `cc/src/services/compact/compact.ts` 负责完整 compact 主逻辑。
- `postCompactCleanup.ts` 说明 compact 不只是加摘要，还会清理系统 prompt section、user context cache、session message cache 等运行状态。
- `cc/src/constants/systemPromptSections.ts` 与 `context.ts` 说明当前工作面本来就是会被清空、重算、重建的。
- `sessionHistory.ts` 与 `createSession.ts` 则说明系统一直保留可用于恢复的会话壳与事件历史。

这几组文件放在一起，展示的不是四个互不相干的 feature，而是一条从“维持当前工作面”到“重新接回工作线”的链。

## 后三篇为什么必须按这个关系来拆

如果没有这张总图，后面的 06 / 07 / 08 很容易互相串线：

- 06 会膨胀成全部治理总论
- 07 会吞掉 projection / collapse 的职责
- 08 会只剩 session 恢复说明，而丢掉卷尾收束

所以这一篇真正做的事，是先把后半卷的边界钉死：

- 06 先校正治理对象
- 07 专讲主动减负机制本体
- 08 再把恢复与卷尾总图收回来

## 一句话收口

> **collapse、projection、compact、restore 在卷四里不是并排功能，而是一条连续分工：先调节当前工作视图，再主动减负并重设活动段，最后把这条工作线重新接回当前 runtime。**
