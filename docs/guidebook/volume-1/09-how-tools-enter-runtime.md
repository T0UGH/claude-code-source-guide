---
title: 卷一 09｜主循环里 tool 怎么被接住
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 09｜主循环里 tool 怎么被接住

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 9/9
- **上一篇**：[上一篇：ToolSearchTool 是工具发现层](./08-toolsearchtool.md)
- **下一篇**：[下一篇：AgentTool 不是再开一个 agent 这么简单](./10-agenttool.md)

这一篇是 tool 段的收束。前面几篇主要在讲工具是什么、有哪些原语、怎么组织；这篇开始回答另一件更关键的事：这些工具最后是怎么真正接进 runtime 的。

---

## 这篇看什么

这篇主看的是：`src/utils/processUserInput/processUserInput.ts`

如果上一篇 `Tool.ts` 解决的是“tool 是什么”，那这一篇要解决的是另一个更关键的问题：

> 用户输入进来以后，Claude Code 在哪一层决定这是普通对话、slash command、bash command，还是会走到后面的 tool 调用链。

这个文件本身不直接执行某个 tool，但它是主循环入口。后面的 tool call、slash command、hook、attachment，都是从这里分流出去的。

---

## 先说结论

我看完之后，觉得这个文件最重要的作用不是“处理用户输入”这么泛，而是三件事：

1. **把输入标准化**
   - 文本、图片、粘贴内容、附件引用，先整理成统一形式

2. **把输入分流到不同执行路径**
   - bash
   - slash command
   - 普通 prompt

3. **在真正发起模型查询前，把上下文补齐**
   - hooks
   - attachments
   - image metadata
   - agent mention

换句话说，这里还没开始真正“跑 tool”，但它已经决定了后面 tool 会不会被调起来，走哪条路。

---

## 整体结构怎么读

### 第一层：`processUserInput()` 是外层包装

这个函数是公开入口。

它先做几件事：

- 如果当前是 prompt 模式，先把用户输入立刻显示到界面上
- 打 query checkpoint
- 读取 appState
- 调 `processUserInputBase()` 做真正的输入处理
- 如果 `shouldQuery` 为 false，就直接返回
- 如果还要继续 query，就执行 `UserPromptSubmit hooks`

这里最值得记的一点是：

> `processUserInput()` 本身不做复杂分流，它更像一个壳，负责把前后处理包起来。

真正的主逻辑在 `processUserInputBase()`。

---

### 第二层：`processUserInputBase()` 才是核心

这部分基本可以看成主循环的输入分发器。

它做的事情很多，但顺序很清楚：

1. 识别输入是字符串还是 content blocks
2. 处理图片 resize / downsample
3. 处理 pasted image 和 image metadata
4. 判断 bridge 场景下 slash command 能不能执行
5. 判断要不要走 ultraplan 特殊路径
6. 提取 attachment messages
7. 分流到 bash / slash command / 普通 prompt

所以这个函数不是“处理文本”，而是在做一件更底层的事：

> 把用户输入改造成 runtime 能消费的标准化请求。

---

## tool 调用链和这个文件的关系

很多人第一次看这里会有个错觉：

“怎么没看到直接执行 `Tool.call()`？”

这是正常的。因为 `processUserInput.ts` 还不是 tool execution 层，它是 tool execution 的上游。

它的作用更像：

- 决定这次输入是不是 slash command
- 如果是 slash command，就转给 `processSlashCommand()`
- 如果是 bash command，就转给 `processBashCommand()`
- 如果是普通 prompt，就转给 `processTextPrompt()`

真正 tool 被模型调用，通常是在后面的 query / assistant turn 里发生的。

所以从链路上看，大概是：

```text
用户输入
  -> processUserInput
  -> processUserInputBase
      -> processSlashCommand / processBashCommand / processTextPrompt
          -> 后续 query / model turn
              -> 模型决定是否发起 tool use
                  -> runtime 执行具体 Tool.call()
```

这点很关键。

> 这个文件不是 tool executor，而是 tool executor 的总入口上游。

---

## 这里最值得关注的几个点

### 1. 输入先被标准化，不急着分流

代码一开始没有急着判断 slash 或 bash，而是先把输入做标准化：

- 如果是字符串，直接记成 `inputString`
- 如果是 content blocks，就把最后一个 text block 当成输入文本，其余 block 放进 `precedingInputBlocks`
- 图片会先 resize / downsample
- pasted image 会被存盘、转 block，并补充 metadata

这说明 Claude Code 的主循环不是“文本优先”，而是多模态输入先归一化。

这很像一个正规的 runtime，而不像只围着聊天文本打补丁的产品。

---

### 2. slash command 的判断很靠前

在这个文件里，slash command 是一个非常正式的分支，不是 UI 小功能。

你能看到两层相关逻辑。

#### 第一层：bridge 安全判断

如果输入来自 remote bridge，而且以 `/` 开头，系统会先解析命令，再判断是不是 `isBridgeSafeCommand()`。

也就是说，不是所有 slash command 都能在远程控制环境里跑。

如果不安全，直接返回一条提示消息：

> `/<command> isn't available over Remote Control.`

这说明 slash command 在 Claude Code 里已经不是“只是 prompt shortcut”，而是带执行语义、带环境约束的 runtime command。

#### 第二层：真正进入 `processSlashCommand()`

如果满足条件：

- 输入是字符串
- 不跳过 slash command
- 以 `/` 开头

就直接走：

```ts
const { processSlashCommand } = await import('./processSlashCommand.js')
```

这里很直白：slash command 是一个明确的一级执行路径，不是普通 prompt 的特例。

---

### 3. 普通 prompt 和 slash command 在附件处理上不完全一样

有一段逻辑挺细：

```ts
const shouldExtractAttachments =
  !skipAttachments &&
  inputString !== null &&
  (mode !== 'prompt' || effectiveSkipSlash || !inputString.startsWith('/'))
```

这段意思是：

- 对 slash command，不一定在这里提前抽 attachments
- 因为 slash command 的 attachment 提取，会在 `getMessagesForSlashCommand` 里做

这说明主循环不是“先统一补附件，再分发”，而是根据执行路径决定附件在哪一层处理。

这里有点像编译器的不同分支 pipeline，不是一个平铺直叙的消息处理器。

---

### 4. hooks 是 query 前的最后一道门

`processUserInput()` 外层在 `processUserInputBase()` 之后，还会执行：

```ts
executeUserPromptSubmitHooks(...)
```

这个时机很讲究。

输入已经基本处理完了，但还没真正交给模型，这时候再过一遍 hook。

这时候 hook 可以做几件事：

- block 整个请求
- preventContinuation
- 注入 additionalContexts
- 追加 hook message

也就是说，hook 在主循环里插的位置很强：

- 既看得到用户输入
- 又能阻断后续 query
- 还能往上下文里塞额外信息

这就是一个真正的拦截层，不是简单的事件监听。

---

### 5. `shouldQuery` 是主循环的关键开关

`ProcessUserInputBaseResult` 里最关键的字段之一是：

```ts
shouldQuery: boolean
```

这个字段很朴素，但它决定了主循环后面要不要真的进入模型查询。

也就是说，这一层的职责不是“无论如何都进入 query”，而是允许很多输入在本地就被消费掉。

比如：

- 某些 slash command
- 某些 bash command
- 某些 hook 阻断情况
- 某些本地 command 返回结果

这些都可能让 `shouldQuery` 直接变成 false。

这一点很重要，因为它说明 Claude Code 不是“所有输入都先发给模型，再由模型决定”。它有一层明确的本地 runtime，可以在模型之前就截流很多事。

---

### 6. 普通 prompt 最后才落到 `processTextPrompt()`

如果不是 bash，不是 slash command，也没有被前面的逻辑拦住，最后才会走：

```ts
processTextPrompt(...)
```

这点很值得反过来看。

很多人会把“普通聊天”当默认主路径，其他都是例外。但从代码结构上看，Claude Code 的实现更像：

- 先做统一输入处理
- 再看有没有特殊执行路径
- 最后剩下的才是普通 prompt

也就是说，普通 prompt 反而像默认回退路径。

这很符合一个 agent runtime 的形态：

> 先判断要不要走命令式、本地式、结构化路径；都不满足，才交给自然语言对话。

---

## 读完这篇之后，我对主循环的理解

我现在会把 `processUserInput.ts` 理解成三层：

### 第一层：输入整理层

把字符串、图片、粘贴内容、attachments、metadata 先整理干净。

### 第二层：路径选择层

决定这次输入走：

- bash
- slash command
- 普通 prompt

### 第三层：query 前拦截层

通过 hooks、blocking error、preventContinuation 等机制，在模型调用前做最后一轮调整。

所以这份文件虽然没有直接调用具体 tool，但它已经决定了：

- 后面有没有机会进入 tool use
- 是通过 slash command 这条显式路径进入
- 还是通过普通 prompt -> model -> tool call 这条隐式路径进入

---

## 这一篇看完之后，下一步最适合接哪里

我觉得有两条自然的后续路线。

### 路线 A：接 `processSlashCommand.tsx`

如果你现在最关心的是：

> slash command / skill / fork command 是怎么在主循环里真正落执行的

那下一步就应该看这个。因为 `processUserInput.ts` 看到这里，已经把球传过去了。

### 路线 B：接 `BashTool`

如果你现在更想看：

> 一个具体 tool 的实现，到底怎么把 `Tool.ts` 里的抽象落地

那就直接去 `BashTool`。

---

## 这一篇我最想记住的一句话

> `processUserInput.ts` 不是 tool 执行层，但它决定了 tool 会不会被调起来，以及通过哪条路被调起来。