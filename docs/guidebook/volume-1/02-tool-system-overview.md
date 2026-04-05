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

这一篇接着把 tool 层再往上提一层。上一篇解决的是入口感，这一篇解决的是结构感：Claude Code 的工具不是一堆命令实现，而是一整套带类型、权限、渲染和执行协议的体系。

---

## 从这个文件开始的理由

`src/Tool.ts` 是整个 Claude Code 工具体系的总纲。

它不是某个工具的实现，而是所有工具的统一抽象。读懂这个文件，就知道一个工具在 Claude Code 里长什么样，而不是陷进某个具体 BashTool 实现里东一块西一块地看。

---

## 这个文件的核心结论

### 1. Tool 是一个带类型的对象，不是函数

Claude Code 的 Tool 不是简单 export 一个函数，而是一个带完整类型的 TypeScript 对象：

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
  isReadOnly(input): boolean
  isDestructive?(input): boolean
  checkPermissions(input, context): Promise<PermissionResult>
  validateInput?(input, context): Promise<ValidationResult>
  renderToolUseMessage(input, options): React.ReactNode
  renderToolResultMessage(content, progress, options): React.ReactNode
  renderToolUseProgressMessage?(progress, options): React.ReactNode
  // ... 还有二十多个可选方法
}
```

这个结构本身就是一个完整的架构声明：工具不只是执行单元，也是 UI 渲染单元。

### 2. 工具有执行三层状态

大多数 agent 实现里，工具只有输入和输出。Claude Code 加了第三层：

- **执行前**：renderToolUseMessage，工具被调用时，界面怎么展示
- **执行中**：renderToolUseProgressMessage，工具在跑，界面怎么展示进度
- **执行完**：renderToolResultMessage，结果回来，界面怎么展示

所以 tool 在 Claude Code 里实际上是执行对象加 UI 对象的合并体，而不是单纯的"后端函数"。

### 3. buildTool 是所有工具的出厂函数

所有工具都应该通过 buildTool 创建：

```typescript
export function buildTool<D extends AnyToolDef>(def: D): BuiltTool<D>
```

它做了两件事：填充通用默认行为、让每个工具的调用方永远拿到完整的 Tool 对象，不需要处理 `?.()` 的边界情况。

TOOL_DEFAULTS 里的默认策略很有意思：

- `isConcurrencySafe: () => false`——默认认为所有工具都不能并发
- `isReadOnly: () => false`——默认认为所有工具都会写东西
- `checkPermissions: () => ({ behavior: 'allow' })`——默认允许执行
- `toAutoClassifierInput: () => ''`——默认跳过安全分类

fail-closed，不是 fail-open。除非明确说安全，否则默认不安全。

### 4. ToolUseContext 是工具运行时拿到的一切

工具在 call() 里能访问的上下文是一个巨大的对象：

```typescript
export type ToolUseContext = {
  options: {
    commands: Command[]
    tools: Tools
    mcpClients: MCPServerConnection[]
    agentDefinitions: AgentDefinitionsResult
    customSystemPrompt?: string
    appendSystemPrompt?: string
    refreshTools?: () => Tools
    // ... 还有很多
  }
  abortController: AbortController
  messages: Message[]
  toolDecisions?: Map<string, { source, decision, timestamp }>
  toolUseId?: string
  // ...
}
```

这说明工具在执行时可以访问当前所有消息历史、AppState、文件状态缓存、MCP server 连接、权限决策记录，甚至能动态刷新可用工具列表。工具执行和整个 agent runtime 的状态完全打通了。

### 5. 权限检查有两层，不是简单的是/否

- `validateInput()`：这个输入合法吗
- `checkPermissions()`：当前上下文允许执行吗

这两个是分开的。

PermissionResult 的结构也实用：

```typescript
{
  behavior: 'allow' | 'deny' | 'ask'
  updatedInput?: Record<string, unknown>
}
```

`updatedInput` 允许权限层在放行时顺便改掉输入参数。权限层可以按降级处理策略，把一个危险操作自动改成安全版本，而不是直接拒绝。

### 6. 工具用语义标注代替硬编码判断

```typescript
isConcurrencySafe(input): boolean   // 可以并发吗
isReadOnly(input): boolean          // 只读吗
isDestructive?(input): boolean      // 有破坏性吗
```

这三个方法不是为了记录日志，而是让 runtime 做实际的调度决策。

有一个细节有意思：isReadOnly 和 isDestructive 不是互斥的。一个工具可以同时返回 false 和 false——既不是只读也不是破坏性。

### 7. isSearchOrReadCommand 把工具分成三类

```typescript
isSearchOrReadCommand?(input): {
  isSearch: boolean   // 搜索类：grep、find、glob
  isRead: boolean    // 读文件类：cat、head、tail、Read
  isList?: boolean   // 列表类：ls、tree、du
}
```

这个返回值不是给人类看的，是给 runtime 的 UI 层用的——决定一个工具调用在 REPL 里是展开还是折叠。搜索和读操作通常折叠（结果可能很长），写操作通常展开（需要看到 diff 或变更内容）。

---

## 看完 Tool.ts 之后，接下来应该看什么

Tool.ts 解决了"工具是什么"的问题。接下来要解决的是"工具怎么被调起来"。

建议下一站：

- `src/utils/processUserInput/processUserInput.ts`
  看看用户输入怎么流进 runtime，tool call 在哪个节点被接住并转发给具体 tool 的 call() 方法

或者直接看：

- `src/tools/BashTool/BashTool.ts`
  找 Tool.ts 里声明的某个方法，在这个具体实现里长什么样

---

## 这个文件给我印象最深的一点

Tool.ts 里有一个很特别的字段：

```typescript
interruptBehavior?(): 'cancel' | 'block'
```

用户在新消息发过来时，当前工具是取消还是阻塞等待。

这个设计把工具执行和用户交互解耦了：工具自己决定被中断时的行为，而不是 runtime 统一处理。

这也是为什么 Claude Code 在跑一个耗时工具时，用户可以继续打字，而不会破坏工具执行状态。