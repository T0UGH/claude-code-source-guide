---
title: 卷二｜一次 Agent Turn 怎么跑起来
status: draft
updated: 2026-04-06
---

# 卷二｜一次 Agent Turn 怎么跑起来

卷二要回答的，不是 Claude Code 里有哪些组件，而是一个更具体的问题：

> **用户输入怎么变成一次完整的 agent turn？**

这一卷默认按**时间顺序**展开，而不是按组件百科展开。读完之后，读者应该至少留下这样一张稳定运行图：

- request 先被整理并接入运行时
- 当前工作面被组织出来
- 系统形成当前判断
- 必要时切到执行路径
- 结果回流当前 turn
- 最后判断这一轮继续还是收口

## 目录

1. [卷二 01｜一次请求怎么进入 Claude Code 的主循环](./01-how-a-request-enters-the-main-loop.md)
2. [卷二 02｜用户输入在进入运行时之前经历了什么](./02-what-happens-before-user-input-enters-runtime.md)
3. [卷二 03｜请求是怎么进入 QueryEngine 的](./03-how-a-request-enters-queryengine.md)
4. [卷二 04｜当前 query 是怎么被组织起来的](./04-how-the-current-query-is-organized.md)
5. [卷二 05｜系统怎么决定这一轮要不要调用能力](./05-how-the-system-decides-to-act.md)
6. [卷二 06｜tool use / action 之后，结果怎么重新回到当前 turn](./06-how-results-return-to-the-current-turn.md)
7. [卷二 07｜一轮 Agent Turn 什么时候继续，什么时候收口](./07-when-an-agent-turn-continues-or-stops.md)
8. [卷二 08｜把整条主循环重新压成一张稳定运行图](./08-stable-main-loop-map.md)

## 这一卷不重点展开什么

- 不把卷二写成 QueryEngine 文件导读
- 不把卷二写成工具系统实现卷
- 不把卷二提前写成长期上下文治理卷

这些会分别留给后续卷继续展开。
