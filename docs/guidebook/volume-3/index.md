---
title: 卷三｜长上下文与会话恢复
date: 2026-04-06
status: draft
---

# 卷三｜长上下文与会话恢复

卷二把主线程请求跑通了：输入怎么进入、消息怎么整理、prompt 怎么组装、`query(...)` 怎样维持模型—工具—消息闭环。  
卷三处理的是另一件同样关键的事：

> **当会话越来越长、状态越来越多、用户又希望随时 resume 时，Claude Code 到底怎么继续活下去。**

所以这一卷不再主要讲“请求怎么跑”，而是讲：
- 上下文怎样被逐层减负
- transcript 和送模视图为什么不是一回事
- session 状态怎样落盘
- resume 时又怎样把一条旧会话重新接活

---

## 这一卷在讲什么

卷三主要处理两条线：

### 1. 长上下文治理线
也就是：
- `compact`
- `microCompact`
- `snip`
- `context collapse`
- `cache_edits`
- content replacement

这条线回答的是：

> 当 Claude Code 面对长会话时，它不是怎样“一次性总结掉历史”，而是怎样沿着一条从轻到重的治理链，尽量保住上下文连续性，同时控制送模负担。

### 2. 会话恢复线
也就是：
- `sessionStorage`
- `conversationRecovery`
- `sessionRestore`

这条线回答的是：

> 一条已经跑过的会话怎样被存下来、读回来，再继续作为 runtime 会话接着跑。

这两条线放在一起，才会真正看懂 Claude Code 的“长会话能力”不是补丁，而是一套正式运行机制。

---

## 为什么这一卷重要

如果没有卷三，Claude Code 很容易被误读成一种“只能在短上下文里临时工作”的 agent。

但源码真正做的事情是：

- 它会管理送模视图，而不是机械回放全部 transcript
- 它会区分 transcript、UI scrollback、model-facing messages 这几层
- 它会把状态落盘，并在 resume 时重新接回当前 runtime
- 它不会把“压缩上下文”理解成单一总结动作，而是多层治理链

这一卷的重要性就在于：

> **它解释了 Claude Code 为什么不只是能跑一轮请求，而是能在长会话里持续工作，并在中断后重新接活。**

---

## 前置阅读建议

建议先读卷二的这些文章：

- [卷二 03｜QueryEngine 是一次用户请求进入运行时主链路的总入口](../volume-2/03-queryengine-entry.md)
- [卷二 04｜query(...) 是怎么驱动模型、工具、消息主循环的](../volume-2/04-query-main-loop.md)
- [卷二 07｜messages.ts 是怎么把消息规范化成 API 请求的](../volume-2/07-messages-normalization.md)
- [卷二 08｜system prompt 和 context 最后是怎么并进请求的](../volume-2/08-system-prompt-and-context.md)
- [卷二 09｜旧消息压缩切边投影是怎么继续工作的](../volume-2/09-collapse-keeps-working.md)
- [卷二 10｜context collapse 为什么是读时投影而不是改写 transcript](../volume-2/10-context-collapse-read-time-projection.md)

不补也能读，但会更容易把卷三里的很多术语和机制误解成“突然新冒出来的另一套系统”。

---

## 建议阅读顺序

### 第一段：先建立观察框架
1. [卷三 01｜主循环术语表](./01-main-loop-glossary.md)  
   先把高频词摆平。
2. [卷三 02｜主循环时序图版](./02-main-loop-sequence-diagram.md)  
   再把主循环、治理链和恢复链放到时间顺序里看。

### 第二段：进入上下文治理主线
3. [卷三 03｜长上下文每轮都重算吗](./03-does-long-context-recompute-every-turn.md)  
   先立“长上下文问题”本身。
4. [卷三 04｜sessionStorage 是会话状态落盘与恢复的汇合点](./04-session-storage.md)  
   把上下文压力与状态落盘接起来。
5. [卷三 05｜compact 是怎么把长会话压成可继续运行的新上下文的](./05-compact.md)  
   先看 compact 本体。
6. [卷三 06｜microCompact 为什么不是小号 compact，而是另一层治理机制](./06-microcompact.md)  
   再看 microCompact 的边界。
7. [卷三 07｜什么时候会触发 compact，什么时候会触发 microCompact](./07-compact-vs-microcompact.md)  
   把两者放回同一张图里比较。
8. [卷三 08｜snip 是主循环里的轻量剪枝层](./08-snip.md)  
   看更轻的一层治理动作。
9. [卷三 09｜cache_edits 是什么，以及和 content replacement 有什么区别](./09-cache-edits-and-content-replacement.md)  
   补编辑缓存与内容替换机制。
10. [卷三 10｜snip 到底裁掉了什么](./10-what-snip-removes.md)  
    把 snip 的裁剪对象真正讲清。
11. [卷三 11｜上下文管理四种形态并排例子](./11-four-context-forms-side-by-side.md)  
    做并排对照。
12. [卷三 12｜从 59 篇里归纳 20 条 agent 层设计](./12-twenty-agent-design-takes.md)  
    从机制提升到设计原则。

### 第三段：进入会话恢复链
13. [卷三 13｜conversationRecovery 是 resume 把会话重新接回 runtime 的恢复入口](./13-conversation-recovery.md)  
    看恢复入口。
14. [卷三 14｜sessionRestore 是把恢复包真正接回当前 runtime 的落地层](./14-session-restore.md)  
    看恢复包如何接活。
15. [卷三 15｜session 线收尾：Claude Code 怎么把会话存下来、读回来、再接着跑](./15-session-line-conclusion.md)  
    把整条 session 线收口。

---

## 如果你只想先抓主线

先读这 6 篇：

1. [03｜长上下文每轮都重算吗](./03-does-long-context-recompute-every-turn.md)
2. [05｜compact 是怎么把长会话压成可继续运行的新上下文的](./05-compact.md)
3. [06｜microCompact 为什么不是小号 compact，而是另一层治理机制](./06-microcompact.md)
4. [08｜snip 是主循环里的轻量剪枝层](./08-snip.md)
5. [13｜conversationRecovery 是 resume 把会话重新接回 runtime 的恢复入口](./13-conversation-recovery.md)
6. [14｜sessionRestore 是把恢复包真正接回当前 runtime 的落地层](./14-session-restore.md)

这几篇读顺了，卷三最核心的两条线就已经立住了：
- 如何减负
- 如何恢复

---

## 读完这一卷你会得到什么

如果卷三读顺了，你应该会更清楚地知道：

- Claude Code 的长上下文管理不是一个单点功能，而是一条治理链
- transcript、scrollback、model-facing query view 不是同一层东西
- compact、microCompact、snip、context collapse 的职责为什么必须拆开
- session 状态为什么必须单独落盘
- resume 为什么不是“把旧消息读出来”这么简单，而是重新接回 runtime

一句话说：

> **卷三读完，Claude Code 的长会话能力和恢复能力就不再像一堆零碎机制，而会变成一套完整、可解释的运行体系。**
