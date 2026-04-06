---
title: 卷一 02｜Tool 体系总览
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 02｜Tool 体系总览

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 2/9
- **上一篇**：[上一篇：Tool 总图与 BashTool 入口](./01-tool-overview-and-bash-entry.md)
- **下一篇**：[下一篇：BashTool 不是跑 shell 这么简单](./03-bashtool-is-not-just-shell.md)

上一篇先把入口立起来：tool 不是零散功能，而是 Claude Code 把模型能力落成执行能力的关键接口。这一篇往前再推一步，回答另一个更基础的问题：**Claude Code 到底把“工具”定义成了什么对象。**

如果这个问题不先说清，后面去看 BashTool、FileReadTool、MCPTool，很容易只看到一堆实现细节，却看不出它们为什么都能被同一套 runtime 接住、调度、展示和约束。

所以这一篇的任务不是继续追完整执行链，而是先把 `src/Tool.ts` 这份“工具总契约”读明白：Claude Code 眼里的 tool，到底有哪些组成部分，runtime 又默认替它承担了哪些共同规则。

---

## 先给判断：Tool.ts 解决的不是“怎么执行”，而是“什么才算一个 tool”

`src/Tool.ts` 不是某个具体工具的实现文件，也不是调度入口。它更像 Claude Code 对整个工具层下的一份正式接口定义：

> **一个 tool 在这里不是单个函数，而是一种可以被 runtime 识别、校验、调度、执行、展示的标准对象。**

这句话里有两个重点。

第一，它不是“给模型暴露几个函数签名”那么简单。
第二，它也不是“只有 call 方法的后端执行器”。

因为你只要看 `Tool` 类型本身，就会发现 Claude Code 给工具塞进了至少四层职责：

1. **调用契约**：输入 schema、输出 schema、`call()`
2. **运行约束**：只读性、并发安全、破坏性、权限检查、输入校验
3. **UI 协议**：调用时怎么显示、进度怎么显示、结果怎么显示
4. **runtime 对接点**：可否中断、是否需要延迟加载、结果过大时怎么处理、给搜索/折叠视图什么语义标签

所以 Tool.ts 最重要的价值，不是告诉你“某个工具怎么写”，而是告诉你：

> **Claude Code 里的工具，从一开始就不是薄薄一层 function call，而是 runtime 内的正式执行对象。**

---

## 为什么先盯 `Tool.ts`

这一篇如果只想回答一句话，其实就是：

> **先读 `Tool.ts`，是为了先拿到所有具体工具共享的低分辨率总图。**

否则一上来就钻进 BashTool，很容易把很多产品策略误以为是 BashTool 的私货。比如：

- 工具有权限检查
- 工具能声明自己是不是只读
- 工具自己提供 UI 渲染方法
- 工具结果不是原样 stdout，而是先被加工成 tool_result block

这些并不只是某个工具的特殊写法，而是 Claude Code 在 Tool 抽象层统一预留的能力位。

也就是说，`Tool.ts` 的角色不是“第一个文件”，而是**总纲文件**。先读它，是为了后面读具体工具时，能分清楚：

- 哪些是全体工具共享的制度
- 哪些才是某个具体工具的个性实现

---

## 1. Tool 不是函数，而是带完整协议的对象

最直观的一点，是 `Tool` 类型本身就已经说明了问题。

```typescript
export type Tool<
  Input extends AnyObject = AnyObject,
  Output = unknown,
  P extends ToolProgressData = ToolProgressData,
> = {
  name: string
  call(args, context, canUseTool, parentMessage, onProgress?): Promise<ToolResult<Output>>
  description(args, options): Promise<string>
  inputSchema: Input
  outputSchema?: z.ZodType<unknown>
  isConcurrencySafe(input): boolean
  isEnabled(): boolean
  isReadOnly(input): boolean
  isDestructive?(input): boolean
  checkPermissions(input, context): Promise<PermissionResult>
  validateInput?(input, context): Promise<ValidationResult>
  renderToolUseMessage(input, options): React.ReactNode
  renderToolResultMessage(content, progress, options): React.ReactNode
  renderToolUseProgressMessage?(progress, options): React.ReactNode
  interruptBehavior?(): 'cancel' | 'block'
  // ... 还有很多扩展位
}
```

这里最值得先改掉的直觉是：**tool 在 Claude Code 里不是“做事的函数”，而是“可被 runtime 使用的一整份对象协议”。**

你可以把它粗分成三层看。

### 第一层：执行本体

这一层最像大家熟悉的工具定义：

- `name`
- `inputSchema`
- `outputSchema`
- `call()`

也就是：它叫什么、吃什么输入、吐什么输出、真正怎么干活。

### 第二层：运行约束

这层是很多“函数调用”心智模型里没有的：

- `isConcurrencySafe()`
- `isReadOnly()`
- `isDestructive()`
- `validateInput()`
- `checkPermissions()`

这些字段说明 Claude Code 不是把工具当成黑盒调用，而是希望 tool 自己声明：

- 这个调用能不能并发
- 它是只读、写入，还是破坏性操作
- 输入是否合法
- 当前上下文下要不要放行、拒绝或询问

### 第三层：展示协议

再往后还有一整排 UI 相关方法：

- `renderToolUseMessage`
- `renderToolUseProgressMessage`
- `renderToolResultMessage`
- `renderToolUseRejectedMessage`
- `renderToolUseErrorMessage`

这等于在源码层明确了一件事：

> **tool 不只是执行单元，也是展示单元。**

Claude Code 没把“做事”和“怎么把这件事展示给用户/模型”硬切成两套系统，而是让工具自己带着这份协议进入 runtime。

这也是后面看 BashTool 时最容易看走眼的地方：你看到很多 UI 行为，不一定是 BashTool 特别重，而是 Tool 抽象本身就允许工具带展示责任。

---

## 2. `buildTool()` 不是语法糖，而是统一出厂口

`Tool.ts` 里另一个很关键的点，是所有工具都应该经 `buildTool()` 生成。

```typescript
export function buildTool<D extends AnyToolDef>(def: D): BuiltTool<D>
```

如果只看签名，它像个普通 helper；但往下看 `TOOL_DEFAULTS`，就知道它其实在集中落实整个工具体系的默认策略。

```typescript
const TOOL_DEFAULTS = {
  isEnabled: () => true,
  isConcurrencySafe: (_input?: unknown) => false,
  isReadOnly: (_input?: unknown) => false,
  isDestructive: (_input?: unknown) => false,
  checkPermissions: (input) => Promise.resolve({ behavior: 'allow', updatedInput: input }),
  toAutoClassifierInput: () => '',
  userFacingName: () => '',
}
```

这里最值得注意的，不是它帮你少写几行代码，而是它把默认安全姿态集中在一起了。

### 默认不并发安全

```typescript
isConcurrencySafe: () => false
```

也就是：**除非工具自己明确说安全，否则 runtime 默认按不安全处理。**

### 默认不是只读

```typescript
isReadOnly: () => false
```

也就是：**除非工具自己证明它只是读，否则先按可能会写来处理。**

### 默认不是破坏性操作

```typescript
isDestructive: () => false
```

这点更像语义标注位，只有真正在做 delete / overwrite / send 这类不可逆操作时才需要覆盖。

### 默认权限检查先放行到通用系统

```typescript
checkPermissions: (input) => Promise.resolve({ behavior: 'allow', updatedInput: input })
```

这不是说工具就没有权限系统，而是说：如果某个工具没有自己的特化逻辑，就先交给通用权限机制继续处理。

所以 `buildTool()` 的真正作用是：

> **让调用方永远拿到一份完整 Tool 对象，同时把“默认保守、按需放宽”的工具制度集中在一个地方。**

从这个角度看，它不是语法糖，而是工具体系的统一出厂口。

---

## 3. `ToolUseContext` 说明 tool 并不是孤立执行

如果说 `Tool` 类型定义了“工具自己长什么样”，那 `ToolUseContext` 定义的就是：**工具运行时到底能摸到什么世界。**

看这个类型，最强烈的感受不是“字段好多”，而是：**工具执行深度嵌在整个 runtime 里。**

```typescript
export type ToolUseContext = {
  options: {
    commands: Command[]
    tools: Tools
    mcpClients: MCPServerConnection[]
    agentDefinitions: AgentDefinitionsResult
    refreshTools?: () => Tools
    // ...
  }
  abortController: AbortController
  readFileState: FileStateCache
  messages: Message[]
  toolDecisions?: Map<string, { source, decision, timestamp }>
  toolUseId?: string
  // ... 还有大量状态与回调
}
```

这里可以压出几个很具体的判断。

### 3.1 工具不是独立模块，而是 runtime 上下文中的一段执行

tool 能拿到：

- 当前消息历史 `messages`
- 文件读取缓存 `readFileState`
- 当前工具集 `tools`
- MCP clients / resources
- agent definitions
- AppState 读写接口
- 中断控制器 `abortController`

这就说明，Claude Code 里的 tool 不是“给你一组参数自己跑去”，而是**带着会话上下文执行**。

### 3.2 工具可以修改的不只是输出，还有上下文

`ToolResult` 里除了 `data`，还有：

- `newMessages`
- `contextModifier`
- `mcpMeta`

也就是说，一个工具返回的并不只是结果，还可能顺手改后续上下文、追加消息、透传协议元信息。

这点很重要，因为它说明 tool 调用在 Claude Code 里不是“同步函数返回值”那种窄动作，而是**runtime 状态演化的一步**。

### 3.3 工具和中断/交互机制是打通的

例如：

```typescript
interruptBehavior?(): 'cancel' | 'block'
```

这个设计很有分量。它不是 runtime 粗暴规定“新消息来了就都停”或“都排队”，而是让**工具自己声明被打断时该怎么办**。

这意味着 Claude Code 在工具层就已经在处理“执行中的任务”和“继续对话”之间的协调关系，而不是事后补一层 UI 开关。

---

## 4. `validateInput()` 和 `checkPermissions()` 是两道不同的门

很多系统会把“这个调用能不能做”揉成一个布尔判断。但 `Tool.ts` 里把它明确拆成了两步：

1. `validateInput()`
2. `checkPermissions()`

这两者解决的问题并不一样。

### `validateInput()`：这个输入本身合法吗

比如 BashTool 里会拦某些阻塞型 `sleep N`，提示你该用后台任务或 Monitor。这里拦的是：

- 输入是否符合产品期望
- 调用方式是不是不合适
- 参数值虽然能 parse，但语义上不应该这么用

也就是：**先判断“这是不是一个合理的 tool 调用”。**

### `checkPermissions()`：当前上下文下准不准做

这一步才是权限层面的判断：

- allow
- deny
- ask

而且返回的不是简单布尔值，而是：

```typescript
{
  behavior: 'allow' | 'deny' | 'ask'
  updatedInput?: Record<string, unknown>
}
```

这里的 `updatedInput` 特别值得记一下。

它说明权限系统不只是“挡”或者“放”，还可以在放行前**改写输入**。也就是说，权限层可以把高风险调用降级成一个更安全的版本，而不是只有生硬拒绝这一种动作。

所以更准确的理解是：

> **Claude Code 把“是否合法”和“是否允许”拆成两层：前者面向调用语义，后者面向当前权限环境。**

这比“一个 canUseTool 布尔值打天下”成熟得多。

---

## 5. 工具语义不是拿来写文档的，而是给 runtime 真用的

`Tool` 里还有几个看起来像标注、其实直接参与 runtime 决策的方法：

```typescript
isConcurrencySafe(input): boolean
isReadOnly(input): boolean
isDestructive?(input): boolean
isSearchOrReadCommand?(input): {
  isSearch: boolean
  isRead: boolean
  isList?: boolean
}
```

这几项如果只是存在于注释里，价值不大；但顺着源码往后看，就知道 runtime 真拿它们做事。

### 5.1 `isConcurrencySafe()` 真会影响调度

在 `src/services/tools/toolOrchestration.ts` 里，`partitionToolCalls()` 会先找出 tool，再 parse 输入，然后调用：

```typescript
tool?.isConcurrencySafe(parsedInput.data)
```

结果为真的工具，会被并进并发 batch；否则就走串行。

也就是说：

> **并发与否不是 runtime 靠工具名硬编码，而是工具自己声明。**

这一点和前面 `buildTool()` 的默认值连起来看就更清楚了：默认串行，谁能并发，谁自己证明。

### 5.2 `isSearchOrReadCommand()` 真会影响 UI 呈现

这一类返回值不是给人读文档的，而是告诉 UI：

- 这是搜索类
- 这是读文件类
- 这是列目录类

BashTool 里对应实现会把 `grep / find / rg` 视为 search，把 `cat / head / tail / jq / awk` 视为 read，把 `ls / tree / du` 视为 list。

这不是安全判断，而是展示语义判断：**哪些结果应该折叠，哪些应该展开。**

所以 Tool.ts 里这些“语义位”的意义是：runtime 不是仅凭工具名，而是依赖工具主动暴露自己的行为特征。

---

## 6. 主线要记住：Tool.ts 是“定义层”，不是“执行层”

说到这里，最容易混的地方反而出现了：既然 Tool.ts 里已经有 `call()`、权限、渲染、上下文，那它是不是已经把执行链也包了？

不是。

这一篇最该守住的边界是：

> **`Tool.ts` 负责定义工具对象的协议，不负责把一次 `tool_use` 真正跑起来。**

把它和前后文件摆在一起，更容易看清层次：

- `Tool.ts`：定义一个 tool 至少有哪些能力位
- `processUserInput.ts`：处理用户输入从哪里进系统、走 bash / slash / prompt 哪条路
- `toolOrchestration.ts`：决定哪些 tool call 并发、哪些串行
- `toolExecution.ts`：把 `tool_use.name + input` 绑定成真实 tool，对它做 parse / validate / permission / call
- 具体工具文件（如 `BashTool.tsx`）：实现自己的细节

所以 Tool.ts 在这条链上更像**制度层 / 抽象层**，不是主循环上的执行节点。

这也是为什么上一篇已经把 `query -> runTools -> runToolUse -> tool.call(...)` 那条链单独拿出来讲：

- 那条链解决“tool 怎么被调起来”
- 这一篇解决“被调起来的那个东西到底长什么样”

两者不能混成一句“Tool.ts 管工具执行”。那样会把定义层和执行层塌成一层。

---

## 7. 再回头看 BashTool，很多“重”其实是 Tool 抽象先给了位子

这一篇虽然不主讲 BashTool，但读完 `Tool.ts` 再回头看 `src/tools/BashTool/BashTool.tsx`，有些东西会突然顺很多。

比如 BashTool 里这些实现：

- `isConcurrencySafe(input) { return this.isReadOnly?.(input) ?? false }`
- `isReadOnly(input) { return checkReadOnlyConstraints(...).behavior === 'allow' }`
- `validateInput()` 里拦阻塞型 `sleep`
- `checkPermissions()` 走 `bashToolHasPermission`
- `renderToolUseMessage / Progress / Result`
- `mapToolResultToToolResultBlockParam()` 把实际结果重新整理成模型能吃的 block
- `interruptBehavior`、后台化、持久化大输出、图片输出识别

如果没有 `Tool.ts` 先把这些能力槽位摆出来，你会觉得 BashTool 特别像一大坨产品逻辑。但现在再看，会更容易分清：

- **哪些是 Tool 抽象本来就要求工具回答的问题**
- **哪些才是 BashTool 在这些接口上填进去的具体策略**

这也是这一篇的卷内作用：它不是要替 BashTool 分析细节，而是先把“为什么一个工具文件里会同时出现执行、安全、展示、结果映射”这件事，提前讲通。

---

## 8. 这一篇最后该留下什么结论

如果把 `Tool.ts` 压成几条最值得带走的判断，我会记这几句。

### 8.1 Tool 是正式执行对象，不是函数注册表

Claude Code 里的 tool 不是“模型可以调用的一组函数”，而是**带输入/输出类型、运行约束、UI 协议、上下文接口的一类标准对象**。

### 8.2 `buildTool()` 把默认制度集中起来了

它不是省代码，而是把“默认不并发安全、默认不是只读、默认按通用权限系统处理”这类规则统一收口。调用方因此总能拿到完整 Tool 对象。

### 8.3 `ToolUseContext` 说明 tool 深度嵌在 runtime 里

工具执行不是孤立黑盒。它可以访问消息、状态、缓存、MCP 连接、中断控制和后续上下文修改接口。

### 8.4 输入校验和权限判断是两层事

`validateInput()` 解决“这个调用本身像不像一个合理调用”，`checkPermissions()` 解决“在当前上下文里允不允许做”。这两层拆开，是 Claude Code 工具体系成熟的地方之一。

### 8.5 Tool.ts 的角色是“定义工具”，不是“执行工具”

真正执行时，还是要靠 `toolExecution.ts`、`toolOrchestration.ts` 等 runtime 文件把模型产出的 `tool_use` 翻译成真实的 `tool.call(...)`。Tool.ts 给的是契约，不是主循环。

---

## 看完这一篇，下一步应该带着什么问题去读

到这里，关于工具层最值得继续追的问题就会变成：

1. **既然 Tool.ts 只定义协议，那 runtime 真正是在哪一层按这份协议去跑工具的？**
2. **BashTool 为什么会成为整套 tool 体系里最重、最像基础设施的那个样本？**

第一个问题，上一篇已经先把主链框出来了。
第二个问题，下一篇会真正落进 `BashTool.tsx` 里看。

所以这篇的最佳收口其实不是“tool 很复杂”，而是：

> **Claude Code 先在 `Tool.ts` 里把“什么才算一个工具”定义成了正式对象，后面的 Bash、文件、MCP、搜索类能力，才有可能被同一套 runtime 用统一方式接住。**
