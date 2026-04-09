---
title: 卷六｜多 agent 协作运行时
status: draft
updated: 2026-04-09
---

# 卷六｜多 agent 协作运行时

卷六要回答的是：

> **Claude Code 的多 agent 能力，为什么本质上是一层正式的协作运行时。**

## 目录

1. [卷六 01｜为什么 Claude Code multi-agent 是协作运行时](./01-why-claude-code-multi-agent-is-a-collaboration-runtime.md)
2. [卷六 02｜team 与 teammate runtime 在 Claude Code 里处在哪](./02-where-team-and-teammate-runtime-sit-in-claude-code.md)
3. [卷六 03｜teams 是怎么被创建、注册与清理的](./03-how-teams-are-created-registered-and-cleaned-up.md)
4. [卷六 04｜InProcessTeammate runtime 是怎么真正跑起来的](./04-how-inprocess-teammate-runtime-actually-runs.md)
5. [卷六 05｜mailbox / idle / shutdown 怎么把闭环合上](./05-how-mailbox-idle-and-shutdown-close-the-loop.md)
6. [卷六 06｜local、remote、teammate task 的边界](./06-boundaries-between-local-remote-and-teammate-tasks.md)
7. [卷六 07｜为什么 Claude Code team 本质上是一种 swarm](./07-why-claude-code-team-is-a-swarm.md)

## 这一卷不重点展开什么

- 不把卷六写成 team feature 列表
- 不把卷六写成命令入口卷
- 不提前展开卷七的产品控制层问题
