---
title: 卷四｜上下文与状态怎么维持系统持续工作
status: draft
updated: 2026-04-09
---

# 卷四｜上下文与状态怎么维持系统持续工作

卷四要回答的是：

> **Claude Code 为什么不是一轮跑完就散，而是能持续工作、持续接住上下文与状态。**

## 目录

1. [卷四 01｜为什么 Claude Code 不是一轮一重置系统](./01-why-claude-code-is-not-a-one-turn-reset-system.md)
2. [卷四 02｜为什么 messages、context、system prompt、transcript、session 不是一回事](./02-why-messages-context-system-prompt-transcript-session-are-not-the-same.md)
3. [卷四 03｜当前可工作上下文是怎么被组出来的](./03-how-the-current-workable-context-is-assembled.md)
4. [卷四 04｜为什么系统不能一直把整段历史原样发出去](./04-why-the-system-cannot-keep-sending-the-entire-history.md)
5. [卷四 05｜collapse / compaction / projection / restore 总图](./05-overall-map-of-collapse-compaction-projection-restore.md)
6. [卷四 06｜projection 与 collapse 管的是可工作视图，不是 transcript 本身](./06-projection-and-collapse-govern-the-workable-view-not-the-transcript-itself.md)
7. [卷四 07｜compact / compaction 是主动减载机制](./07-compact-and-compaction-as-the-active-load-shedding-mechanism.md)
8. [卷四 08｜restore / session recovery 怎么让系统恢复工作](./08-restore-and-session-recovery-how-the-system-resumes-work.md)

## 这一卷不重点展开什么

- 不把卷四写成上下文机制名词表
- 不把卷四写成单纯的 token 优化技巧文
- 不把卷四提前展开成扩展系统或控制层说明
