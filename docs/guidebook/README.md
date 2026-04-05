---
title: Claude Code Source Guide
date: 2026-04-06
status: draft
---

# Claude Code Source Guide

这是一个把 **Claude Code 源码阅读** 整理成手册的项目。

它不是源码仓库镜像，也不是零散笔记归档。更准确地说，它想做的是一件中间态的事：

> 把一组按阅读和研究过程长出来的源码笔记，重新整理成一套适合公开阅读的导读手册。

如果你是第一次来到这里，可以先记住一句话：

> 这里不是在解释“Claude Code 怎么用”，而是在解释“Claude Code 这套系统是怎么长成现在这个样子的”。

---

## 这个项目现在在做什么

现在还不是建站阶段，也还没到最终定稿。

眼下更像是在做内容重组。

具体来说，眼下在推进的是三件事：

1. 把原本按研究顺序写出来的文章，重排成更适合阅读的卷结构
2. 把每篇文章在全书里的位置重新定义清楚
3. 先把内容骨架搭稳，再决定后面怎么做 GitHub Pages

所以你现在看到的内容，重点不是“包装完成度”，而是“结构有没有站住”。

---

## 这套手册适合谁

这套东西主要写给下面几类读者：

### 1. 想系统读 Claude Code 源码的人
不是只查一个函数，不是只看一个 feature，而是想知道这套系统整体怎么运转。

### 2. 在用 coding agent，但想看清内部结构的人
你可能已经在用 Claude Code、Codex、OpenCode 这类东西，但如果你想把内部运行机制看明白，这套手册会比产品文档更有用。

### 3. 想做 agent runtime、工具系统、skill 体系研究的人
Claude Code 值得看的地方，不只是它能干什么，而是它怎么把 tool、agent、skill、prompt、权限、team runtime 这些层面拼成一个整体。

它不太适合纯扫盲读者。如果你只是想快速上手命令，官方文档会更直接。这里更像是“源码导读”和“系统拆解”。

---

## 推荐从哪里开始

如果你不想猜顺序，直接从这里开始：

### 第一站
- [卷一｜Claude Code 的运行时底座](./01-volume-one-runtime-foundation.md)

这是当前最适合当入口的一页。

原因很简单：
- 它不再承担学习路线的任务
- 也不试图把全书一次说完
- 它先把 Claude Code 最底下那几层搭清楚

把这一卷读顺了，后面再看 QueryEngine 主链、长上下文、权限系统和 team runtime，会轻松很多。

### 第二站
- 映射表 v2：[`00-mapping-table-v2.md`](./00-mapping-table-v2.md)

如果你更在意全书结构、卷内顺序、哪些文章被删了、哪些被挪卷了，那先看映射表也可以。

---

## 当前手册结构

这套 guidebook 目前按 6 卷来整理。

### 卷一：运行时底座
先把 Claude Code 的底层骨架搭起来：
- tool
- agent
- skill
- prompt

入口：
- [卷一｜Claude Code 的运行时底座](./01-volume-one-runtime-foundation.md)

### 卷二：一条请求是怎么跑完整个系统的
看 QueryEngine 主链，理解一条请求如何真正跑完整个 runtime。

### 卷三：长上下文与会话恢复
看 compact、microCompact、snip、session 恢复这一整套上下文治理机制。

### 卷四：外部能力和扩展点
看 MCP、hooks、plugin 这些外部能力是怎么接进来的。

### 卷五：执行边界与安全控制
看权限系统、路径规则、policy limits 这些边界控制怎么工作。

### 卷六：多 agent 协作运行时
看 team、teammate、mailbox、swarm 这一层怎么成立。

这 6 卷现在还在持续调整，但大的骨架已经基本定下来了。

---

## 这个仓库里的内容怎么分

### `docs/guidebook/`
放导读手册本体，也就是最终应该更接近公开阅读版本的内容。

当前已经有：
- `00-mapping-table-v2.md`
- `01-volume-one-runtime-foundation.md`

### `docs/notes/`
放过程文档、brainstorm 纪要、结构调整记录。

这些文件不是最终导读正文，但对理解“为什么这样改”很有用。

### `docs/superpowers/`
放初始化过程中的 spec 和 plan。

这部分更像仓库工作记录，不是面向普通读者的正文内容。

---

## 当前阶段最值得看的文件

如果你现在就想快速判断这个项目在做什么，建议按这个顺序看：

1. [卷一｜Claude Code 的运行时底座](./01-volume-one-runtime-foundation.md)
2. [映射表 v2](./00-mapping-table-v2.md)
3. `docs/notes/2026-04-05-volume-one-restructure-brainstorm.md`

这三份看完，基本就能知道：
- 这个项目要做成什么样
- 第一卷为什么这样改
- 当前重排到了哪一步

---

## 后面会继续写什么

接下来最自然的推进顺序是：

1. 补 guidebook 首页
2. 继续写卷二、卷三等导读页
3. 补阅读路径页
4. 回头处理卷内弱去重和导语
5. 等内容骨架稳下来，再进入 GitHub Pages 方案选择

所以现在还不用急着定技术栈。

先把内容结构做对，后面的站点层才不容易返工。

---

## 一句话说明这个仓库

如果要用一句最短的话介绍这个项目，我会这样写：

> Claude Code Source Guide 是一个把 Claude Code 源码阅读笔记重组成公开导读手册的项目，先整理内容骨架，再考虑 GitHub Pages。