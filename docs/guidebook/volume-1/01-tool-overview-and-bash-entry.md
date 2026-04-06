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

很多人第一次看 Claude Code 源码时，注意力会先被主循环、消息流、上下文压缩这些更显眼的部分吸走。但如果想真正理解这个系统是怎么把“模型能力”落成“可执行能力”的，tool 体系其实更适合作为卷一入口。

这一篇要回答两个问题：**为什么卷一先讲 tool，而不是先讲主循环；为什么 BashTool 会成为理解整套工具体系的最好入口。** 顺着这两个问题往下看，tool 就不会再是“有很多工具目录”的散点印象，而会变成一条清楚的 runtime 执行链。

---

## 这篇看什么

这一篇的目标不是把 `Tool.ts` 讲成制度手册，而是先把读者带到一个能站住的位置：Claude Code 里的 tool 到底是什么、它在 runtime 里处在哪一层、模型产出的 `tool_use` 又是怎么一路落成真实的 `tool.call(...)`。

大概顺序是：

1. 先看 `src/Tool.ts`，建立 tool 的低分辨率总图
2. 再看 `src/utils/processUserInput/processUserInput.ts`，厘清这层负责什么、不负责什么
3. 接着追“tool 到底在哪里被真正调用”，把主链一路追到
   - `src/query.ts`
   - `src/services/tools/toolOrchestration.ts`
   - `src/services/tools/toolExecution.ts`
   - 最终的 `tool.call(...)`
4. 最后落到一个最重的具体样本：`src/tools/BashTool/BashTool.tsx`

这一轮结束后，tool 体系至少会从“工具很多”变成“执行链清楚”。

---

## 1. 先建立一个总图：Tool 在 Claude Code 里到底是什么

如果先不看细节，很多人会把 Claude Code 的 tool 直觉地理解成“模型可以调用的一组函数”。这个理解不能说全错，但远远不够。

真正把 `src/Tool.ts` 读下来，更准确的判断是：

> **tool 不是函数清单，而是 runtime 里的正式执行对象。**

它不只是负责“做事”，还同时带着输入校验、权限判断、执行约束，以及给 UI 展示 tool 使用过程和结果的协议。

这一层最值得先改掉的直觉不是“Claude Code 有很多工具”，而是：

> **tool 在这里并不是零散功能，而是一类可被 runtime 调度、校验、执行、展示的标准对象。**

核心感受有几条。

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

这样调用方拿到的永远是完整 Tool 对象，不用在外围到处补默认逻辑。

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

## 2. 一个关键误区：`processUserInput.ts` 不是 tool 执行层

如果顺着主循环入口往下读，很容易先盯上 `processUserInput.ts`，然后误以为“tool 应该就在这里被调起来”。

但更准确的理解是：

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

这一步之所以重要，是因为它把“人类输入进入系统”和“runtime 真正执行 tool”这两层分开了。前者解决的是入口分流，后者解决的是模型已经决定调用工具之后，系统怎么把 `tool_use` 变成真实执行。

---

## 3. 真正的主链：从 `tool_use` 到 `tool.call(...)`

这一篇最关键的问题其实在这里：

> **tool 到底在哪里被真正调用？**

答案不在 `processUserInput.ts`，而在下面这条链：

```text
query.ts
  -> runTools(...)
  -> runToolUse(...)
  -> tool.call(...)
```

这一条链立起来之后，tool 系统才真正从“抽象定义”和“输入入口”变成 runtime 里的执行路径。

### 3.1 `query.ts`

`query.ts` 在模型返回 assistant message 后，会抽取 `tool_use blocks`，然后交给 `runTools(...)`。

这里有一个很关键的边界：

- `processUserInput.ts` 处理的是“人类输入”
- `query.ts` 处理的是“模型输出”

所以 tool 系统真正开始启动，不是在用户刚输入时，而是在模型已经决定要发起 `tool_use` 之后。

### 3.2 `toolOrchestration.ts`

`runTools(...)` 不直接执行具体 tool，它先做调度：

- 读 `isConcurrencySafe`
- 分批
- 并发安全的并发跑
- 不并发安全的串行跑

也就是说，这层更像 scheduler，不是 executor。

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

所以这一层最清晰的结论是：

> **Claude Code 不是主循环直接调工具，而是模型先产出结构化 `tool_use`，runtime 再把它翻译成真实的 `tool.call(...)`。**

这也解释了为什么 tool 系统在源码里看起来不像“函数注册表”。它真正承接的，是模型输出和执行系统之间的翻译层。

---

## 4. 为什么 BashTool 是理解整套 tool 体系的最好入口

如果只是想找一个“具体工具”来读，Claude Code 里其实有很多候选。但 BashTool 之所以适合作为卷一第一篇的入口，不是因为它最常见，而是因为它最能暴露整个 tool runtime 的重量。

更直接地说：

> **BashTool 不是普通工具样本，而是 Claude Code tool 体系里压强最大的一类基础设施型工具。**

它同时碰到了：

- 执行策略
- 安全策略
- 并发策略
- 长任务与后台任务
- 输出组织
- UI 呈现

也就是说，读 BashTool，不只是读一个 shell 工具，而是在看 Claude Code 怎样把“模型调用工具”做成一套真正的运行时执行系统。

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

Claude Code 没给 bash 单独再造一套并发规则，而是把并发策略直接挂在只读判断上。

### 4.2 `isReadOnly()` 不是表面文章

它背后接的是 `checkReadOnlyConstraints(...)`，而不是简单看命令前缀。

这也解释了为什么 `readOnlyValidation.ts` 会很大。BashTool 的很多运行策略，实际上都绕不过这层判断。

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

所以 BashTool 返回的并不是“命令结果”，而是“命令结果 + runtime 元信息 + UI 所需信息”。

### 4.4 它从一开始就不是“一次性返回结果”设计

`call()` 里不是直接 `exec(command)`，而是走 `runShellCommand()`，用 async generator 做：

- 流式 progress
- 最终结果返回
- 后台任务切换

这让 BashTool 从结构上就更像一个 session 内任务执行器，而不是普通 shell wrapper。

### 4.5 它承担了很多产品级判断

这部分最能看出 Claude Code 的产品哲学：

- 检测阻塞型 `sleep N`，引导用后台任务或 Monitor
- 长任务可以自动 background
- 大输出写到磁盘，再给模型 preview + path
- 图片输出会识别并特殊处理
- simulated sed edit 直接按 preview 结果落盘，避免 preview 和实际执行不一致

这些都说明 BashTool 不只是工具，而是 Claude Code 执行体验的核心承载点之一。

---

## 5. 目前这轮对 tool 体系的整体判断

如果把这一轮的收获压成几句话，可以记成下面这样。

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

这一篇先把 tool 体系的总图立起来。顺着这条线继续往下，最值得补的不是“再找一个复杂工具随机看”，而是把 BashTool 周边的关键判断和本地文件能力线接上。

接下来优先级最高的几类是：

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

如果按当前这篇的主线继续推进，最自然的是两条线：

1. 继续深读 `readOnlyValidation.ts`
2. 补 `FileReadTool` / `FileEditTool`

前者能补清 BashTool 最核心的运行判断；后者能把“本地文件操作”这条主能力线补完整。

---

## 一句话收口

> Claude Code 的 tool 体系，本质上不是“模型直接调用一组函数”，而是模型先产出结构化 `tool_use`，runtime 再把它翻译成可调度、可校验、可执行、可展示的正式执行流程。BashTool 之所以适合作为卷一入口，不是因为它只是最常见的工具，而是因为它最完整地暴露了这套运行时设计。