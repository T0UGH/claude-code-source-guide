---
title: 卷一 01｜Tool 总图与 BashTool 入口
date: 2026-04-02
tags:
  - Claude Code
  - tool
  - BashTool
  - 源码共读
---

# 卷一 01｜Tool 总图与 BashTool 入口

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 1/9
- **上一篇**：无
- **下一篇**：[下一篇：Tool 体系总览](./02-tool-system-overview.md)

这一篇是卷一的正文入口。它先不急着讲主循环，而是先把 Claude Code 的 tool 层立起来：tool 在系统里到底是什么、为什么 BashTool 会成为理解整套工具体系的最好入口，以及工具不是零散功能，而是 runtime 里的正式执行对象。

---

## 这篇看什么

这一篇是卷一正文入口，目标不是把 `Tool.ts` 讲成制度手册，而是先给读者一个能站住的入口：为什么卷一要从 tool 起手，以及为什么 BashTool 会成为理解整套工具体系的最好切口。

大概顺序是：

1. 先看 `src/Tool.ts`，弄清楚 tool 在 Claude Code 里到底是什么
2. 再看 `src/utils/processUserInput/processUserInput.ts`，看主循环入口怎么分流输入
3. 接着追“tools 到底在哪里真正被调用”，把连接处一路追到
   - `src/query.ts`
   - `src/services/tools/toolOrchestration.ts`
   - `src/services/tools/toolExecution.ts`
   - 最终的 `tool.call(...)`
4. 最后开始看一个具体工具：`src/tools/BashTool/BashTool.tsx`

这一轮结束后，tool 体系至少已经不是“有很多工具目录”这种散点印象了，而是能看清楚一条主链。

---

## 1. Tool 在 Claude Code 里是什么

`src/Tool.ts` 读下来，最重要的结论是：

> **tool 不是一个函数，而是一个带完整类型、执行逻辑、权限逻辑和 UI 渲染能力的对象。**

核心感受有几条：

### 1.1 tool 不只是执行单元，也是 UI 单元

一个 Tool 除了 `call()` 之外，还有：

- `renderToolUseMessage`
- `renderToolUseProgressMessage`
- `renderToolResultMessage`
- `mapToolResultToToolResultBlockParam`

这意味着 Claude Code 的工具不是“后端做事，前端随便显示”，而是工具自己就带着展示协议。

### 1.2 `buildTool()` 是统一出厂函数

所有工具都应该经 `buildTool()` 生成。它的作用不是花哨，而是把默认行为集中起来，比如：

- 默认不并发安全
- 默认不是只读
- 默认不是破坏性操作
- 默认权限检查放行到通用权限系统继续处理

这能保证调用方拿到的永远是完整 Tool 对象，不用四处写 `?.()`。

### 1.3 `ToolUseContext` 很重

`ToolUseContext` 里不只是工具执行参数，还带了大量 runtime 状态：

- AppState
- messages
- readFileState
- mcpClients
- agentDefinitions
- permission context
- notification / prompt / OS notification 等回调

也就是说，tool 运行时其实是深度嵌在整个 Claude Code runtime 里的，不是独立小模块。

---

## 2. `processUserInput.ts` 不是 tool 执行层

一开始看 `processUserInput.ts` 时，很容易误以为“主循环应该就在这里调 tool”。

但读下来更准确的理解是：

> **`processUserInput.ts` 是输入编排层，不是 tool 执行层。**

它主要做三件事：

1. 标准化输入
   - 文本
   - content blocks
   - pasted images
   - attachment messages

2. 决定走哪条路径
   - `processBashCommand()`
   - `processSlashCommand()`
   - `processTextPrompt()`

3. 在 query 前做最后一轮拦截
   - UserPromptSubmit hooks
   - additional contexts
   - blocking / preventContinuation

所以这层负责的是：

- 用户输入怎么进入系统
- 进系统之后先走哪条路径

但**不是**工具最终怎么执行。

---

## 3. 真正的连接处：从 query 到 tool.call

今天最关键的收获其实在这里。

因为前面一直在看输入和抽象，真正的疑问是：

> tool 到底在哪里被真正调用？

答案不在 `processUserInput.ts`，而在下面这条链：

```text
query.ts
  -> runTools(...)
  -> runToolUse(...)
  -> tool.call(...)
```

### 3.1 `query.ts`

`query.ts` 在模型返回 assistant message 后，会抽取 `tool_use blocks`，然后交给 `runTools(...)`。

关键点在于：

- `processUserInput.ts` 处理的是“人类输入”
- `query.ts` 处理的是“模型输出”

tool 系统真正开始启动，是在模型已经决定要发起 `tool_use` 之后。

### 3.2 `toolOrchestration.ts`

`runTools(...)` 不直接执行具体 tool，它先做调度：

- 读 `isConcurrencySafe`
- 分批
- 并发安全的并发跑
- 不并发安全的串行跑

也就是说，这层是 scheduler，不是 executor。

### 3.3 `toolExecution.ts`

真正开始接触具体 tool 的地方，是 `runToolUse(...)`。

这里最关键的一步是：

```ts
findToolByName(toolUseContext.options.tools, toolName)
```

模型只给了一个 `tool_use.name`，runtime 在这里把它绑定成真实的 Tool 对象。

后面再走：

- `validateInput`
- `checkPermissions`
- `tool.call(...)`

所以今天最清晰的结论是：

> **Claude Code 不是主循环直接调工具，而是模型先产出结构化 `tool_use`，runtime 再把它翻译成真实的 `tool.call(...)`。**

这层边界很清楚。

---

## 4. BashTool 读下来的第一印象

今天后半段开始看 `src/tools/BashTool/BashTool.tsx`。

这部分最重要的感觉是：

> **BashTool 不是“跑个 shell”这么简单，它已经是一套小型执行系统。**

### 4.1 并发安全直接建立在只读判断上

BashTool 里这句很关键：

```ts
isConcurrencySafe(input) {
  return this.isReadOnly?.(input) ?? false;
}
```

也就是说：

- 只读 bash → 更容易并发
- 非只读 bash → 更谨慎

Claude Code 没给 bash 再单独造一套并发规则，而是把它直接挂在只读判断上。

### 4.2 `isReadOnly()` 不是表面文章

它背后接的是 `checkReadOnlyConstraints(...)`，而不是简单看命令前缀。

这也解释了为什么 `readOnlyValidation.ts` 会很大。BashTool 的很多运行策略都绕不过这层判断。

### 4.3 输入输出 schema 很重

BashTool 的输入不只是 `command`，还有：

- `timeout`
- `description`
- `run_in_background`
- `dangerouslyDisableSandbox`
- `_simulatedSedEdit`

输出也不只是 `stdout/stderr`，还包括：

- `interrupted`
- `isImage`
- `backgroundTaskId`
- `assistantAutoBackgrounded`
- `returnCodeInterpretation`
- `persistedOutputPath`
- `persistedOutputSize`

也就是说，BashTool 返回的不是“命令结果”，而是“命令结果 + runtime 元信息 + UI 所需信息”。

### 4.4 它从一开始就不是“一次性返回结果”设计

`call()` 里不是直接 `exec(command)`，而是走 `runShellCommand()`，用 async generator 做：

- 流式 progress
- 最终结果返回
- 后台任务切换

这让 BashTool 从结构上就更像一个 session 内任务执行器，而不是普通 shell wrapper。

### 4.5 它承担了很多产品级判断

这部分最像 Claude Code 的“产品哲学”：

- 检测阻塞型 `sleep N`，引导用后台任务或 Monitor
- 长任务可以自动 background
- 大输出写到磁盘，再给模型 preview + path
- 图片输出会识别并特殊处理
- simulated sed edit 直接按 preview 结果落盘，避免 preview 和实际执行不一致

这些都说明 BashTool 不只是工具，而是 Claude Code 执行体验的核心承载点之一。

---

## 5. 目前这轮对 tool 体系的整体判断

如果把今天的收获压成几句话，我会记成下面这样：

### 5.1 tool 体系是五层结构，不是一团实现

1. `processUserInput.ts`：输入编排层
2. `query.ts`：模型输出解释层
3. `toolOrchestration.ts`：调度层
4. `toolExecution.ts`：执行层
5. `Tool.ts`：抽象层

### 5.2 Claude Code 的 tool 系统不是“模型直接调函数”

它中间有很明确的 runtime 翻译层：

- 模型产出 `tool_use`
- runtime 抽取 `tool_use`
- runtime 调度、校验、执行
- 再映射成 `tool_result`

### 5.3 BashTool 是最重的基础设施型 tool

它表面上是 shell 工具，实际上背着：

- 执行策略
- 安全策略
- UI 策略
- 输出整理策略

这也是为什么 BashTool 看起来特别肥。

---

## 6. 后面最值得继续读的 tool

今天还顺手列了一遍 `src/tools/` 下的工具目录。接下来如果要继续构建整体心智模型，我会优先看这几类：

### 文件与搜索类
- `FileReadTool`
- `FileEditTool`
- `FileWriteTool`
- `GrepTool`
- `GlobTool`

### runtime / agent 类
- `SkillTool`
- `AgentTool`
- `ToolSearchTool`

### 外部连接类
- `MCPTool`
- `WebFetchTool`
- `WebSearchTool`
- `LSPTool`

如果按当前热度往下接，我觉得最自然的是两条线：

1. 继续深读 `readOnlyValidation.ts`
2. 补 `FileReadTool` / `FileEditTool`

前者能补清 BashTool 的核心判断；后者能补完整“本地文件操作”那条主能力线。

---

## 一句话收口

> 这一轮之后，tool 体系终于从“很多工具目录”变成了一条清楚的链：用户输入进主循环，模型产出 `tool_use`，runtime 调度并执行，最后再把结果包装回模型能继续理解的 `tool_result`。而 BashTool 是这条链上最重、最像执行内核的那个工具。