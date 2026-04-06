---
title: 卷二 06｜getAttachmentMessages 是怎么把文件、agent、MCP 和提醒抽出来的
date: 2026-04-06
tags:
  - Claude Code
  - 源码共读
---

# 卷二 06｜getAttachmentMessages 是怎么把文件、agent、MCP 和提醒抽出来的

## 导读

- **所属卷**：卷二：一条请求是怎么跑完整个系统的
- **卷内位置**：卷二 6/13
- **上一篇**：[上一篇：processUserInput 是怎么分流 slash、attachment 和普通文本的](./05-process-user-input.md)
- **下一篇**：[下一篇：messages.ts 是怎么把消息规范化成 API 请求的](./07-messages-normalization.md)

这一篇继续沿输入链往下拆，但只看附件与结构化消息这一层：文件、agent、MCP 引用和提醒信息，究竟是怎样被抽成可进入主链的 message。

---

## 这篇看什么

前一篇刚把 `processUserInput(...)` 那层输入路由拆开。

那里有个点其实反复出现，但还没单独讲透：

- 普通 prompt 会先跑 `getAttachmentMessages(...)`
- prompt/skill 展开后也会再跑一次 `getAttachmentMessages(...)`
- `query(...)` 主循环里有些 inter-turn 信息，也会继续通过 attachment 这条路补进来

也就是说，Claude Code 里有很多“不是用户直接说出来，但又必须让模型看见”的上下文，都不是硬塞进 user text，而是走了 **attachment** 这条单独通道。

这次我主要回看了：

- `src/utils/attachments.ts`
- `src/utils/messages.ts`

看完之后，我现在会把 `getAttachmentMessages(...)` 的角色压成一句很清楚的话：

> **`getAttachmentMessages(...)` 不是简单的“抽附件”，而是 Claude Code 把各种外生上下文统一转译成 attachment messages 的入口。**

这里的“附件”并不只是文件。

它实际上覆盖了至少四大类东西：

1. **用户显式引用的外部对象**
   - `@file`
   - `@agent-xxx`
   - `@server:resource`

2. **系统根据当前状态补进来的上下文**
   - changed files
   - nested memory
   - dynamic skill / skill listing
   - queued commands
   - team/task/todo/status 类提醒

3. **模式切换或运行时边界提醒**
   - plan mode / plan mode exit
   - auto mode / auto mode exit
   - compaction reminder
   - critical system reminder

4. **供模型消费、但不直接作为普通用户文本出现的控制信息**
   - command permissions
   - hook additional context
   - agent mention instruction
   - MCP resource full contents

所以这篇如果只留一句最短的话，我会留：

> **attachment 是 Claude Code 的“结构化上下文注入层”，而 `getAttachmentMessages(...)` 是这层的统一入口。**

---

## 先给主结论

### 1. `getAttachmentMessages(...)` 本身很薄，真正复杂的是 `getAttachments(...)`

这一点要先讲清。

`getAttachmentMessages(...)` 自己其实只做三件事：

1. 调 `getAttachments(...)`
2. 记录 telemetry
3. 把每个 attachment 包成 `createAttachmentMessage(...)`

所以如果只读 `getAttachmentMessages(...)`，会觉得它没什么内容。

真正的复杂度全在 `getAttachments(...)`。

也就是说：

- `getAttachmentMessages(...)` 是 message 包装层
- `getAttachments(...)` 才是 attachment 组装层

### 2. Claude Code 的 attachment 不是“文件附件”，而是“上下文对象”

这是我觉得这篇最重要的一个判断。

如果只看名字，很容易把 attachment 理解成：

- 文件
- 图片
- 某种附带材料

但源码里它明显不是这么窄。

attachment 其实是在承载各种：

> **需要进入模型上下文、但不适合直接伪装成普通 user text 的结构化上下文对象。**

比如：

- `agent_mention`
- `mcp_resource`
- `hook_additional_context`
- `queued_command`
- `todo_reminder`
- `critical_system_reminder`
- `command_permissions`

这些都不是传统“附件”，但都被收进了 attachment 体系。

所以这个词在 Claude Code 里更接近：

> **structured context payload**

而不是 file attachment。

### 3. attachment 体系的作用，是把“外生上下文”从用户文本里剥离出来

这点我觉得特别值。

很多系统会把各种系统补充信息直接拼成长文本，混在用户消息里。

Claude Code 明显不想这么做。

它更倾向于：

- 用户说的话，还是用户说的话
- 系统额外补的上下文，单独作为 attachment 进来
- 最后再由 `messages.ts` 统一转成模型可读的 meta message/system reminder

也就是说，attachment 体系在语义上起的作用是：

> **把“用户意图”和“系统补充上下文”分层。**

这比全部揉成一坨 prompt 要干净得多。

---

## 先把总图立住：attachment 是怎么进入模型上下文的

```mermaid
flowchart TD
    A[输入文本 / 当前状态 / 运行时事件] --> B[getAttachments]
    B --> C[生成 Attachment[]]
    C --> D[getAttachmentMessages]
    D --> E[createAttachmentMessage]
    E --> F[messages.ts 统一转译]
    F --> G[模型看到 system reminder / meta user messages]
```

这张图最关键的一点是：

> **attachment 不是最终 prompt 形态，而是中间态的结构化上下文对象。**

真正送进模型之前，还要再经过 `messages.ts` 那层转译。

---

## 第一层：`getAttachments(...)` 的核心不是“提取”，而是“组装”

这层特别值得说清。

函数名容易让人以为它只是在从输入文本里抽东西。

但实际看下来，它做的是两大块：

### A. 用户输入驱动的 attachment
也就是：
- `processAtMentionedFiles(...)`
- `processMcpResourceAttachments(...)`
- `processAgentMentions(...)`
- turn-0 的 `skill_discovery`

### B. 线程/运行时驱动的 attachment
也就是：
- `queued_commands`
- `date_change`
- `changed_files`
- `nested_memory`
- `dynamic_skill`
- `skill_listing`
- `plan_mode`
- `plan_mode_exit`
- `auto_mode`
- `todo_reminders`
- `team_context`
- `agent_pending_messages`
- `critical_system_reminder`
- 等等

所以这里真正发生的事不是“从文本中提取附件”，而是：

> **把用户信号、线程状态、运行时提醒统一装配成一批 attachment。**

这就是为什么我更愿意叫它 **attachment assembly layer**，不是 extractor。

---

## 第二层：用户侧 attachment 有三条特别清楚的显式引用链

### 1. `@file` → 文件 / 目录 / PDF reference

`processAtMentionedFiles(...)` 先从文本里：

- `extractAtMentionedFiles(...)`
- `parseAtMentionedFileLines(...)`

把用户提到的路径和可选行号范围抽出来。

然后后面的处理并不粗暴，而是分得很细：

- 如果是目录，就列目录内容
- 如果是普通文件，就走 `generateFileAttachment(...)`
- 如果是大 PDF，可能退化成 `pdf_reference`
- 如果文件已在上下文里且没变，可能变成 `already_read_file`

### 这说明“@文件”不是单一 attachment，而是一套分级策略

Claude Code 没有把“读文件”写成傻逻辑：

- 永远全读
- 永远一样处理

而是根据对象类型和上下文状态，生成不同 attachment：

- `file`
- `directory`
- `pdf_reference`
- `already_read_file`
- `compact_file_reference`

所以这里真正保住的是：

> **attachment 不只是把对象带进来，还会带着“应该以什么粒度被带进来”的策略。**

这点我觉得特别成熟。

---

### 2. `@agent-xxx` → 不是直接启动 agent，而是生成一个 agent_mention attachment

`processAgentMentions(...)` 很直接：

- 从输入里抽 `@agent-...`
- 对照 `activeAgents`
- 找到就生成：`{ type: 'agent_mention', agentType }`

关键点是：

> **它不会在 attachment 层直接启动 agent。**

它只是把“用户表达了想调用某个 agent”这件事，编码成一个结构化 attachment。

然后在 `messages.ts` 里，这个 attachment 会被转成一条 meta message：

> The user has expressed a desire to invoke the agent "xxx". Please invoke the agent appropriately...

### 这个分层很关键

也就是说：

- attachment 层只负责表达意图
- 真正要不要调用 agent，仍然留给模型/runtime 决策

它没有把 `@agent-xxx` 硬编码成“立刻 spawn”。

这说明 Claude Code 在这里保留的是：

> **引用语义，而不是直接执行语义。**

---

### 3. `@server:uri` → MCP resource attachment

`processMcpResourceAttachments(...)` 这条线也很清楚：

- 先 `extractMcpResourceMentions(...)`
- 解析 `serverName` 和 `uri`
- 找对应 MCP client
- 查资源 metadata
- 调 `readResource({ uri })`
- 成功后生成 `mcp_resource` attachment

然后在 `messages.ts` 里，再把这个 attachment 转成：

- 如果有文本内容：
  - `Full contents of resource:`
  - 正文
  - `Do NOT read this resource again...`
- 如果是二进制：
  - `[Binary content: ...]`
- 如果没内容：
  - `(No content)` / `(No displayable content)`

### 这说明 MCP resource 被当成“上下文资源”，不是普通工具返回

这点很重要。

因为这里不是模型主动 tool call 去读 MCP，而是用户在输入里显式引用了资源。

Claude Code 的处理方式是：

> **把它预先读出来，变成 attachment，再统一注入模型上下文。**

这和 tool execution 的语义是不同的。

---

## 第三层：attachment 体系不只服务“输入引用”，还服务“线程状态补充”

这是我觉得这篇最值钱的点之一。

`getAttachments(...)` 里真正更大的一块，其实不是用户输入，而是这堆线程级 attachment：

- `queued_commands`
- `date_change`
- `changed_files`
- `nested_memory`
- `dynamic_skill`
- `skill_listing`
- `plan_mode`
- `plan_mode_exit`
- `auto_mode`
- `todo_reminders`
- `team_context`
- `agent_pending_messages`
- `critical_system_reminder`

### 这说明 attachment 是 Claude Code 的“状态注入总线”

这些东西跟用户当前一句输入没直接关系，但又必须让模型知道。

如果没有 attachment 这层，系统只能：

- 把它们混进 system prompt
- 或者直接拼成长提醒文本

Claude Code 没这么做。

它选择把这些都做成 attachment，再按时机注入。

所以这里特别值得收一句：

> **attachment 体系不只是输入解析器，还是线程状态向模型暴露的标准通道。**

---

## 第四层：为什么 `getAttachments(...)` 特别强调顺序

我觉得这一层很容易被忽略，但其实很值。

源码里有句注释很关键：

> 先处理 user input attachments，再处理 thread-safe attachments。

原因是：

- user input attachments 里可能会更新 nested memory 的触发器
- 后面的 `getNestedMemoryAttachments(...)` 依赖这些触发器

也就是说，attachment 组装不是无序拼盘，而是有依赖顺序的。

### 这说明 attachment 之间也有“前置关系”

它不是：

- 所有 attachment 独立生成
- 最后 concat

而是：

> **有些 attachment 会影响另一些 attachment 是否出现、如何出现。**

这点挺像一个小型 pipeline。

所以 `getAttachments(...)` 其实不是简单聚合，而是：

- 一段有阶段顺序的装配流程

---

## 第五层：attachment message 只是包装壳，真正给模型看的内容在 `messages.ts`

这层特别关键，不然很容易误判 attachment 本身的职责。

`createAttachmentMessage(...)` 非常薄：

- 把 attachment 包成 `{ type: 'attachment', attachment, uuid, timestamp }`

它本身不决定模型看到什么。

真正把 attachment 翻译成模型上下文的，是 `messages.ts`。

### 这意味着 Claude Code 把“采集”和“呈现”拆开了

- `attachments.ts`：负责收集结构化 attachment
- `messages.ts`：负责决定 attachment 最后怎么呈现给模型

这个拆分非常关键。

因为同一个 attachment 类型可以有非常特定的呈现策略。

比如：

- `agent_mention` → 一条明确的委派意图提醒
- `mcp_resource` → 资源全文 + 不要重复读取的提醒
- `hook_additional_context` → 包在 system reminder 里
- `critical_system_reminder` → 高优先级提醒
- `queued_command` → 转成类似用户排队输入/中途通知

所以 attachment 真正的职责是：

> **把上下文对象标准化；至于最终话怎么说，交给消息转译层。**

---

## 第六层：`messages.ts` 里能看出 attachment 的真正语义设计

这次我顺手看了几个 case，特别能说明这套设计不是“为了传数据”，而是为了控制模型理解方式。

### `mcp_resource`
它不会只是说“这里有个资源”。
而是会明确告诉模型：

- 这是资源全文
- 已经给你看过了
- **不要再读一次，除非你觉得它变了**

这其实是在主动减少重复工具调用。

### `agent_mention`
它不会自动执行 agent，而是把用户意图翻译成：

- 用户表达了想调用这个 agent
- 你应当适当地 invoke 它

这在保留模型自治。

### `hook_additional_context`
它会被包装成：

- `hookName hook additional context: ...`

也就是很清楚地标注来源，不把 hook 产物伪装成用户原话。

### 这说明 attachment 转译层在做两件事

1. **给模型补信息**
2. **同时标清信息来源和语义角色**

我觉得第二点特别重要。

因为如果不标来源，模型很容易把系统补充信息和用户需求本体混淆。

---

## 第七层：所以 attachment 的本质，是“把系统补充上下文显式对象化”

如果把上面这些点都收起来，我现在最想保住的不是“attachment 可以带文件”，而是：

> **Claude Code 用 attachment 把各种补充上下文做成了显式对象，而不是把它们偷偷混进 prompt 文本。**

这里的“显式对象化”带来三个好处：

### 1. 采集逻辑可以独立演化
比如：
- 新增一种 agent/team/status 提醒
- 新增一种 MCP/resource 类型
- 新增一种 mode exit 提醒

都只是在 attachment 层加对象，不需要重写 prompt 大串。

### 2. 呈现逻辑可以统一控制
因为最后都走 `messages.ts`，所以：
- 可以统一包 system reminder
- 可以统一做 meta visible
- 可以对不同 attachment 类型加不同的提示话术

### 3. 语义边界更清楚
用户说的话、系统推出来的上下文、hook 返回的上下文、线程状态提醒，都不容易混成一坨。

这其实是这套设计最漂亮的地方。

---

## 我现在对 `getAttachmentMessages(...)` 的一句话定义

如果只留一句最短的话，我会留：

> **`getAttachmentMessages(...)` 是 Claude Code 的结构化上下文注入入口：先在 `getAttachments(...)` 里把用户引用、线程状态和运行时提醒装配成 attachment，再交给消息层转译成模型真正看到的 meta/system 内容。**

这句话里最想保住的是五个词：

- **结构化上下文**
- **注入入口**
- **装配**
- **转译**
- **meta/system 内容**

因为这五个词基本就是它在主链里的真实职责。

---

## 这篇最值得记住的几个判断

### 判断 1：`getAttachmentMessages(...)` 本身很薄，真正的复杂度在 `getAttachments(...)`，所以它更像包装层而不是业务核心

### 判断 2：Claude Code 里的 attachment 不是狭义文件附件，而是各种“需要进入模型上下文的结构化上下文对象”

### 判断 3：用户显式引用的 `@file`、`@agent-xxx`、`@server:uri` 都不会直接变执行动作，而是先变成 attachment，再交给后续消息层解释

### 判断 4：attachment 体系同时承担“输入引用解析”和“线程状态注入”两类职责，所以它其实是 Claude Code 的状态注入总线之一

### 判断 5：attachment 的采集层和呈现层是分开的：`attachments.ts` 负责装配对象，`messages.ts` 负责把对象翻译成模型真正看到的 reminder / meta message

### 判断 6：这套设计最重要的价值，不是多传几份上下文，而是把用户原话和系统补充上下文明确分层，避免全都混进一大段 prompt 文本里

---
