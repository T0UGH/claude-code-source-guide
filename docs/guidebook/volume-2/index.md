---
title: 卷二｜一条请求是怎么跑完整个系统的
date: 2026-04-06
status: draft
---

# 卷二｜一条请求是怎么跑完整个系统的

卷一解决的是运行时底座：tool、agent、skill、prompt 这些部件各自是什么、处在哪一层。  
卷二开始处理另一件更关键的事：

> **一条真实用户请求进入 Claude Code 之后，这整套系统到底是怎么被真正跑起来的。**

所以这一卷的重点，不再是单独认识某个部件，而是把它们放回主线程请求里，看一轮交互从输入进入、消息整理、prompt 组装、query 主循环推进，到上下文治理与最终收口，究竟怎样连成一条真正可运行的主链。

---

## 这一卷在讲什么

这一卷主要讲的是 **QueryEngine 主链**。

更具体一点，它会回答这些问题：

- 用户输入从哪里正式进入 runtime
- `query(...)` 为什么不是单次模型调用，而是一个闭环主循环
- `tool_use` 和 `tool_result` 是怎么被接回消息流的
- 输入为什么不会原样直送模型，而要先经过分流、附件抽取和消息规范化
- system prompt、user context、system context 最终怎样一起进入请求
- 上下文一旦变长，主链又是怎么继续活下去的

如果卷一更像在搭地图，那卷二就是开始真正沿着主干路走一遍。

---

## 为什么这一卷重要

Claude Code 最容易被误解的地方之一，就是把它看成：

- 用户说一句话
- 模型回一句话
- 中间偶尔调几个工具

但源码真正做的远比这复杂。

Claude Code 不是把“模型输出”和“工具调用”松散拼在一起，而是把：

- 输入预处理
- prompt 分层装配
- 消息规范化
- 工具执行
- 上下文治理
- 多轮续转与收口

组织成了一条持续推进的 runtime 主链。

这一卷的价值就在于：

> **把 Claude Code 从“会调工具的聊天程序”重新看成一个真正的 agent runtime。**

---

## 前置阅读建议

如果你还没读卷一，建议至少先补这些文章：

- [卷一 09｜主循环里 tool 怎么被接住](../volume-1/09-how-tools-enter-runtime.md)
- [卷一 10｜AgentTool 不是再开一个 agent 这么简单](../volume-1/10-agenttool.md)
- [卷一 15｜SkillTool 是把 skill 接进 runtime 的桥](../volume-1/15-skilltool-bridge.md)
- [卷一 31｜prompt 是 AgentTool 给模型看的使用说明层](../volume-1/31-prompt-as-instruction-layer.md)

如果不补也能读，但会更容易把卷二里的主链看成“突然冒出来的一堆流程细节”。

---

## 建议阅读顺序

### 第一段：先钉住主链入口与闭环
1. [卷二 01｜从 query 到 tool.call 的连接处](./01-from-query-to-tool-call.md)  
   先把主链最先碰到的工具连接点钉住。
2. [卷二 02｜主循环在编排一次完整 agent 回合](./02-full-agent-turn.md)  
   先从高处看清一整轮回合如何被编排。
3. [卷二 03｜QueryEngine 是一次用户请求进入运行时主链路的总入口](./03-queryengine-entry.md)  
   正式进入主线程请求入口。
4. [卷二 04｜query(...) 是怎么驱动模型、工具、消息主循环的](./04-query-main-loop.md)  
   看这条链如何真正持续跑起来。

### 第二段：补齐输入与消息层
5. [卷二 05｜processUserInput 是怎么分流 slash、attachment 和普通文本的](./05-process-user-input.md)  
   看 query 前的输入路由。
6. [卷二 06｜getAttachmentMessages 是怎么把文件、agent、MCP 和提醒抽出来的](./06-get-attachment-messages.md)  
   看外生上下文如何转成 attachment messages。
7. [卷二 07｜messages.ts 是怎么把消息规范化成 API 请求的](./07-messages-normalization.md)  
   看内部消息世界和 API 消息世界的归一化边界。
8. [卷二 08｜system prompt 和 context 最后是怎么并进请求的](./08-system-prompt-and-context.md)  
   看最终模型请求是怎样被分层组装的。

### 第三段：处理上下文治理与卷内收口
9. [卷二 09｜旧消息压缩切边投影是怎么继续工作的](./09-collapse-keeps-working.md)  
   开始进入卷二与卷三的交界层。
10. [卷二 10｜context collapse 为什么是读时投影而不是改写 transcript](./10-context-collapse-read-time-projection.md)  
    看主链里的上下文治理设计意图。
11. [卷二 11｜用一个新会话例子串起 QueryEngine 主链](./11-queryengine-example-walkthrough.md)  
    用结构化例子把整条主链重新串起来。
12. [卷二 12｜用一个新会话例子通俗解释 QueryEngine 主链](./12-queryengine-example-plain.md)  
    作为更友好的补充篇。
13. [卷二 13｜system prompt、用户上下文、系统上下文分别是什么](./13-system-user-contexts.md)  
    卷尾把最容易混的三层上下文重新分开。

---

## 如果你只想抓主线

如果你现在只想抓住卷二的骨架，先读这 5 篇：

1. [01｜从 query 到 tool.call 的连接处](./01-from-query-to-tool-call.md)
2. [03｜QueryEngine 是一次用户请求进入运行时主链路的总入口](./03-queryengine-entry.md)
3. [04｜query(...) 是怎么驱动模型、工具、消息主循环的](./04-query-main-loop.md)
4. [07｜messages.ts 是怎么把消息规范化成 API 请求的](./07-messages-normalization.md)
5. [08｜system prompt 和 context 最后是怎么并进请求的](./08-system-prompt-and-context.md)

这 5 篇读顺了，卷二的主干就基本立住了。

---

## 读完这一卷你会得到什么

如果这一卷读顺了，你应该会更清楚地知道：

- Claude Code 的一次请求不是“直接问模型”，而是一轮完整 runtime turn
- `QueryEngine` 和 `query(...)` 各自处在主链的哪一层
- 输入、附件、消息规范化、prompt 组装、工具执行为什么必须拆层
- 主循环为什么必须把 `tool_use` / `tool_result` 做成严格闭环
- 上下文治理为什么不是简单“满了就总结”

一句话说：

> **卷二读完，Claude Code 的主线程请求就不再像一堆流程细节，而会变成一条真正能在脑子里跑起来的系统主链。**
