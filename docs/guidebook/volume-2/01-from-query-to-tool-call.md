---
title: 卷二 01｜从 query 到 tool.call 的连接处
date: 2026-04-06
tags:
  - Claude Code
  - 源码共读
---

# 卷二 01｜从 query 到 tool.call 的连接处

## 导读

- **所属卷**：卷二：一条请求是怎么跑完整个系统的
- **卷内位置**：卷二 1/13
- **上一篇**：无
- **下一篇**：[下一篇：主循环在编排一次完整 agent 回合](./02-full-agent-turn.md)

这一篇作为卷二前置，先把 QueryEngine 主链真正会碰到的第一处“工具连接点”钉住：模型产出的 `tool_use`，到底是在哪一层被接成真实的 `tool.call(...)`。

---

## 这篇解决什么问题

前两篇其实已经把上下两头分开了：

- `Tool.ts` 告诉我们 tool 是什么
- `processUserInput.ts` 告诉我们用户输入怎么进入主循环

但你刚才那个问题很准：

> 说了半天，tools 到底是在哪里真正被调用的？

这篇就专门回答这个问题。

短答案先说：

> 真正的连接处不在 `processUserInput.ts`，而在 `query.ts -> runTools(...) -> runToolUse(...) -> tool.call(...)` 这条链上。

---

## 先给结论链路

完整链路可以先记成这样：

```text
用户输入
  -> processUserInput.ts
      -> processTextPrompt() / processSlashCommand() / processBashCommand()
          -> query.ts 发起模型调用
              -> 模型返回 assistant message
                  -> assistant message 里包含 tool_use blocks
                      -> query.ts 抽出 toolUseBlocks
                          -> runTools(...) in toolOrchestration.ts
                              -> runToolUse(...) in toolExecution.ts
                                  -> findToolByName(...)
                                  -> validateInput / checkPermissions
                                  -> tool.call(...)
                                  -> mapToolResultToToolResultBlockParam(...)
                                  -> 生成 tool_result
                                  -> 回到 query 继续下一轮
```

如果只记一句话，那就是：

> Claude Code 不是主循环直接调工具，而是模型先产出 `tool_use`，runtime 再把它翻译成真实的 `tool.call(...)`。

---

## 第一跳：`query.ts` 负责接住模型产出的 `tool_use`

关键文件：

- `src/query.ts`

你前面没看到 tool 调用，是因为 `processUserInput.ts` 还只是在处理“人类输入”。

真正进入工具系统，是在模型已经返回 assistant message 之后。

`query.ts` 会从 assistant message 里找 `tool_use` blocks，然后把它们交给工具执行层。

关键代码是这句：

```ts
const toolUpdates = streamingToolExecutor
  ? streamingToolExecutor.getRemainingResults()
  : runTools(toolUseBlocks, assistantMessages, canUseTool, toolUseContext)
```

这一句的意思很简单：

- 如果有 streaming tool executor，就拿剩余结果
- 否则，直接把 `toolUseBlocks` 交给 `runTools(...)`

你要找的第一处连接点就在这里。

> 模型输出里的 `tool_use` block，在这里第一次被当成“待执行工具调用”处理。

这一步还没有真正执行某个具体工具，但已经完成了一个关键转换：

- 从“模型输出内容块”
- 变成“runtime 要执行的一批工具调用”

---

## 第二跳：`runTools(...)` 负责调度，不负责具体执行

关键文件：

- `src/services/tools/toolOrchestration.ts`

入口函数：

```ts
export async function* runTools(
  toolUseMessages,
  assistantMessages,
  canUseTool,
  toolUseContext,
)
```

这个函数本身不直接 `tool.call()`，它先做调度。

### 它先干什么

先按工具是不是并发安全来分批：

```ts
for (const { isConcurrencySafe, blocks } of partitionToolCalls(...))
```

这里会调用每个 tool 的：

```ts
tool?.isConcurrencySafe(parsedInput.data)
```

也就是说，`Tool.ts` 里定义的 `isConcurrencySafe` 在这里第一次真正参与 runtime 调度，而不只是一个静态标签。

### 然后怎么跑

- 并发安全的一批 → `runToolsConcurrently(...)`
- 不并发安全的一批 → `runToolsSerially(...)`

不管哪条路，最后都会走到同一个地方：

```ts
runToolUse(...)
```

所以 `runTools(...)` 的职责很清楚：

> 它是调度层，不是执行层。

它决定：

- 这批工具怎么分组
- 哪些可以并发
- 哪些必须串行
- contextModifier 什么时候应用回主上下文

---

## 第三跳：`runToolUse(...)` 才开始接触“具体是哪一个 tool”

关键文件：

- `src/services/tools/toolExecution.ts`

入口函数：

```ts
export async function* runToolUse(
  toolUse,
  assistantMessage,
  canUseTool,
  toolUseContext,
)
```

这里一上来就做了一件最关键的事：

```ts
let tool = findToolByName(toolUseContext.options.tools, toolName)
```

这句就是整条链里最关键的绑定动作：

- 模型只知道自己输出了一个 `tool_use.name`
- runtime 要把这个字符串名字映射成一个真实的 Tool 对象

这一步之后，系统才真的知道：

- 这是 BashTool
- 还是 FileReadTool
- 还是某个 MCP tool

如果找不到，就直接返回错误的 `tool_result`：

```ts
<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>
```

这也说明 Claude Code 的工具系统不是“模型说了算”。

模型只能提一个 tool name，最终能不能执行，要 runtime 里真有这个 Tool 对象才行。

---

## 第四跳：权限检查和工具执行是绑在一起的

`runToolUse(...)` 找到 tool 之后，不会立刻 `tool.call()`。

它会继续走：

```ts
streamedCheckPermissionsAndCallTool(...)
```

也就是说，在 Claude Code 里：

> tool execution 和 permission gating 是同一条流水线里的两个阶段，不是两个彼此独立的系统。

这一点挺关键。

很多 agent 的做法是：

- 先决定调用工具
- 然后额外再挂一层 permission

Claude Code 这里更像：

- 一旦进入工具执行链，权限检查就是执行链的一部分

从工程上看，这样做的好处很明显：

- progress 能统一处理
- 拒绝、报错、成功都能统一落成 `tool_result`
- UI 层不用猜某次工具失败是不是权限问题

---

## 第五跳：真正的执行点就是 `tool.call(...)`

你要找的最终针脚，在 `toolExecution.ts` 更深一点的地方。

关键代码是这段：

```ts
const result = await tool.call(
  processedInput,
  {
    ...toolUseContext,
    toolUseId: toolUseID,
    userModified: permissionDecision.userModified ?? false,
  },
  canUseTool,
  assistantMessage,
  progress => {
    onToolProgress({
      toolUseID: progress.toolUseID,
      data: progress.data,
    })
  },
)
```

这就是整条链真正落地的地方。

> 模型给出 `tool_use`，runtime 找到对应的 Tool 对象，最后在这里调用 `tool.call(...)`。

如果你要一个最直接的答案，那就是：

- 真正调用 tools 的地方，是 `src/services/tools/toolExecution.ts` 里的 `tool.call(...)`

前面的所有层，都是在把输入一路送到这里。

---

## 第六跳：工具执行完，结果会被重新包装回 API 语义

`tool.call(...)` 返回的是 Claude Code 内部的 `ToolResult`。

但模型下一轮需要看到的，不是内部对象，而是标准的 `tool_result block`。

所以后面还会走：

```ts
const mappedToolResultBlock = tool.mapToolResultToToolResultBlockParam(
  result.data,
  toolUseID,
)
```

这个动作也很关键。

因为它说明 Claude Code 的工具执行不是“跑完拿字符串塞回去”，而是：

- tool 内部有自己的输出结构
- runtime 再把它映射成模型 API 能接受的 `tool_result`

也就是说，tool 和 API block 之间还有一层显式映射。

这层映射把两个世界隔开了：

- tool 内部世界：自由的 TypeScript 结构
- API 外部世界：标准化的 tool_result block

这层边界做得很干净。

---

## 这条链里每一层分别干嘛

### 1. `processUserInput.ts`
处理人类输入。

### 2. `query.ts`
处理模型输出，并抽取 `tool_use blocks`。

### 3. `toolOrchestration.ts`
调度工具调用，决定并发还是串行。

### 4. `toolExecution.ts`
把 `tool_use.name` 绑定成真实 Tool 对象，做检查，然后调用 `tool.call(...)`。

### 5. `Tool.ts`
定义每个 Tool 应该长什么样。

这五层拆开以后，你再回头看 Claude Code，会发现它不是一个“模型顺手调用几个函数”的 CLI，而是一套结构很完整的 runtime。

---

## 为什么你之前在主循环里看不到 tool 调用

因为 `processUserInput.ts` 的职责到头了，它只负责：

- 接人类输入
- 做预处理
- 分流到不同路径

但 tool 调用属于“模型输出解释”和“工具执行”阶段。

所以你在主循环入口里当然看不到 `tool.call(...)`。

真正跨过去的边界是：

1. `processUserInput.ts` 把请求送进 query
2. `query.ts` 收到模型返回的 `tool_use`
3. `runTools(...)` 开始调度
4. `runToolUse(...)` 找到具体 tool
5. `tool.call(...)` 真正执行

你刚才的疑惑，本质上就是把“输入入口层”和“工具执行层”看成一层了。源码这里拆得很开。

---

## 这篇我最想记住的一句话

> `processUserInput.ts` 负责把用户送进系统，`query.ts` 负责把模型产出的 `tool_use` 送进工具系统，而 `toolExecution.ts` 才负责真正调用 `tool.call(...)`。

---

## 下一步最顺的两个方向

### 路线 A：继续读 `toolExecution.ts`

如果你现在最关心的是：

- validateInput 怎么插进来
- checkPermissions 怎么插进来
- progress message 怎么冒出来
- tool_result 怎么生成

那就继续深读这个文件。

### 路线 B：回头读 `BashTool`

如果你已经知道连接处了，下一步就可以看一个具体工具怎么实现：

- 它的 `call()` 怎么写
- 它的 `renderToolUseMessage()` 怎么写
- 它的 `mapToolResultToToolResultBlockParam()` 怎么写

我个人觉得现在最顺的是先接 `toolExecution.ts`，因为连接点刚找出来，热度还在。
