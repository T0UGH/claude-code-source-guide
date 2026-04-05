---
title: 卷一 11｜runAgent 是把 agent 组装成可运行体的装配线
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
  - agent
  - runtime
source_files:
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/agentToolUtils.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/loadAgentsDir.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx
status: done
source_url: https://feishu.cn/docx/HnJbdMFKboyUKNxkL84c1HGOn4f
---

# 卷一 11｜runAgent 是把 agent 组装成可运行体的装配线

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Agent 2/5
- **上一篇**：[上一篇：AgentTool 不是再开一个 agent 这么简单](./10-agenttool.md)
- **下一篇**：[下一篇：forkSubagent 是在同一上下文里分叉出 worker](./12-forksubagent.md)

这一篇是 agent 段的中心轴。看完它，Claude Code 里的 agent 就不再只是一个抽象名词，而会变成一条具体的装配线。

---

## 这篇看什么

前一篇刚把主循环 `query.ts` 拉回总线上看了一遍。那篇回答的是：

> 一轮 agent 回合在 Claude Code 里是怎么被编排起来的。

接下来最自然的问题就是：

> 那 agent 自己是怎么被塞进这套循环里的？

这次我主要看的是：

- `src/tools/AgentTool/runAgent.ts`

为了避免只剩函数解说，我又补了几个邻接文件：

- `src/tools/AgentTool/agentToolUtils.ts`
- `src/tools/AgentTool/loadAgentsDir.ts`
- `src/tools/AgentTool/AgentTool.tsx`

看完后的感觉很明确：

> `runAgent.ts` 不是“启动一个子 agent”这么简单，它更像 Claude Code 里 agent runtime 的装配线：把 agent 定义、上下文、工具池、权限、skill 预载、MCP、transcript、hooks 和 query 主循环真正接成一个可运行体。

如果说上一篇 `query.ts` 是总调度台，那这一篇的 `runAgent.ts` 更像：

> 把一台 agent 在上电前全部接线、装配、登记、清场的那条线。

---

## 先给主结论

### 1. `runAgent` 不是一个轻薄包装层，而是 agent 运行前的总装步骤

光看函数签名就已经能感觉出来，它接的不是一两个参数，而是一整套运行时材料：

- `agentDefinition`
- `promptMessages`
- `toolUseContext`
- `canUseTool`
- `isAsync`
- `forkContextMessages`
- `querySource`
- `override`
- `model`
- `maxTurns`
- `availableTools`
- `allowedTools`
- `contentReplacementState`
- `useExactTools`
- `worktreePath`
- `description`
- `transcriptSubdir`
- `onQueryProgress`

这说明它不是“拿 prompt 去跑一下模型”，而是在接收一套 agent 启动所需的运行时部件。

也就是说，在 Claude Code 眼里，agent 不是一句 prompt，而是一个：

> 带定义、带权限、带工具、带状态、带清理责任的运行实例。

### 2. `runAgent` 的核心任务，是把“agent 定义”翻译成“可执行上下文”

`loadAgentsDir.ts` 负责把 markdown / JSON / plugin / built-in 这些来源解析成 `AgentDefinition`。

但定义还只是定义。

真正让它跑起来的，是 `runAgent.ts`。

它要把定义里的这些字段落成运行时现实：

- `model`
- `permissionMode`
- `tools`
- `disallowedTools`
- `skills`
- `mcpServers`
- `hooks`
- `maxTurns`
- `background`
- `memory`
- `isolation`

所以我更愿意把这一步理解成：

> 把声明式 agent 配置，翻译成一套具体现实可跑的 agent context。

### 3. `runAgent` 真正接上的不是某个局部功能，而是整条 agent 执行链

它最后不是自己完成任务，而是把前面装好的东西交给：

- `query(...)`

这点很关键。

说明 `runAgent` 在架构上的位置，刚好卡在：

- agent 定义层
- 主循环执行层

之间。

它不是 agent 的“脑子”，也不是 agent 的“手脚”，而是：

> agent 变成可运行个体之前的装配层。

---

## 从架构层看，`runAgent.ts` 到底在干什么

我觉得可以拆成 7 层。

## 第一层：先给 agent 一个明确身份，而不是匿名跑一轮

`runAgent` 很早就先确定这些东西：

- `resolvedAgentModel`
- `agentId`
- `transcriptSubdir`
- Perfetto trace 注册
- dump prompts 路径日志

这说明 agent 一上来就不是匿名过程。

它从启动开始就带着：

- 自己是谁
- 用哪个 model
- transcript 放哪
- 在 tracing 体系里挂在哪棵树上

这点很值。

如果没有这层，subagent 很容易变成“能跑，但事后说不清是谁干的”。

现在这套做法更像是：

> 先建身份，再运行。

### 这里我最喜欢的是 `agentId`

很多系统里子 agent 只是临时调用，看起来像“顺手起一个”。

但这里不是。

它会明确创建：

- `agentId`

后面 transcript、hooks、todos、background bash tasks、prompt cache tracking、perfetto tracing，几乎都围着这个 `agentId` 来挂。

这说明 Claude Code 把 agent 当作真正的一等运行对象，而不是 prompt 的副作用。

---

## 第二层：先处理上下文继承，不让父会话的脏状态直接漏进来

这里有一层很容易被忽略，但我觉得特别关键：

- `forkContextMessages`
- `filterIncompleteToolCalls(...)`
- `initialMessages`
- `cloneFileStateCache(...)`
- `createFileStateCacheWithSizeLimit(...)`

其中最说明工程判断的，是：

### `filterIncompleteToolCalls`

它会过滤掉父消息里那种：

- assistant 发了 `tool_use`
- 但还没有对应 `tool_result`

的残缺消息。

原因很现实：

> 不完整 tool call 直接带进新的 agent 上下文，会触发 API pairing 错误。

这说明 `runAgent` 不是傻继承父上下文，而是会先做一次“上下文净化”。

这个动作很像容器启动前先检查镜像一致性。

### 文件状态缓存也不是直接共用

如果有 forked context，它会：

- clone 父的 `readFileState`

如果没有，就新建一个受限大小的 file state cache。

这说明 agent 虽然继承上下文，但不是完全和父会话共享所有低层状态。

它更像是：

> 带选择地继承，带边界地复制。

---

## 第三层：重写 agent 的 AppState 视图，把权限和行为模式落进去

这一段是 `runAgent.ts` 里我最看重的部分之一。

它没有直接改全局 AppState，而是造了一个：

- `agentGetAppState()`

这个函数会在读取 state 时动态覆写这些东西：

- `toolPermissionContext.mode`
- `shouldAvoidPermissionPrompts`
- `awaitAutomatedChecksBeforeDialog`
- `alwaysAllowRules`
- `effortValue`

也就是说，agent 不是拿父会话原始状态直接跑，而是拿一个：

> 经过 agent 自己权限/交互模式改写后的 AppState 视图。

这比“把参数散着传”要高级不少。

### 这里最值得注意的几个点

#### 1. agent 可以覆盖 permission mode
但不是无条件覆盖。

如果父会话已经在：

- `bypassPermissions`
- `acceptEdits`
- 某些 `auto` 模式

那父级优先。

这个判断挺稳。

说明它允许 agent 有自己的权限人格，但不会随便推翻更高层会话的硬约束。

#### 2. async agent 默认避免权限弹窗
因为它没法像前台 agent 那样自然弹 UI。

所以会设置：

- `shouldAvoidPermissionPrompts`

这个点特别像真正做过产品的人才会补的逻辑。

因为后台 agent 如果还在等交互式权限弹窗，整条链就会卡死。

#### 3. `allowedTools` 会重建 session allow rules
而且它会保留 CLI 级别的显式允许规则，只替换 session 级部分。

这不是小实现细节，而是在明确：

> 父 agent 之前的临时授权，不应该无意外泄给子 agent。

这点非常重要。

---

## 第四层：把 agent 的工具池真正装起来，而不是默认继承全部工具

这一层要和 `agentToolUtils.ts` 一起看才清楚。

`runAgent.ts` 会先决定：

- 是直接用 `availableTools`
- 还是走 `resolveAgentTools(...)`

而 `resolveAgentTools` 做的事包括：

- built-in / custom / async agent 的工具过滤
- `ALL_AGENT_DISALLOWED_TOOLS`
- `CUSTOM_AGENT_DISALLOWED_TOOLS`
- `ASYNC_AGENT_ALLOWED_TOOLS`
- wildcard `*` 展开
- `disallowedTools` 再过滤
- `allowedAgentTypes` 解析

也就是说，agent 能看到什么工具，不是“父亲有什么我就有什么”。

而是：

> 先过全局 agent 安全约束，再过 agent 自己 frontmatter 里的工具声明，最后才得到真正的工具池。

### 这里的一个关键信号是 async agent 的工具过滤

在 `filterToolsForAgent` 里，async agent 默认只能拿到一组更窄的工具。

这背后的设计态度很明确：

> 后台 agent 不该天然拥有和前台同等的动作能力。

这个限制不是可有可无的，它直接决定了异步 agent 更像受限 worker，而不是另一个全权主控。

### MCP tools 又是个例外

`mcp__` 开头的工具会被优先允许。

说明在 Claude Code 的设计里，MCP 更像能力接入口，不完全等同于内置工具的权限层级。

这点后面和 agent 自己的 MCP frontmatter 一接，就更有意思了。

---

## 第五层：把 system prompt、skills、hooks、MCP 都预装进去

这层是我觉得最能说明“装配线”味道的一层。

### 1. system prompt 不是静态文本，而是动态增强后的结果

`runAgent` 会调用：

- `getAgentSystemPrompt(...)`
- 里面再去走 `enhanceSystemPromptWithEnvDetails(...)`

也就是说，最终喂给 agent 的 system prompt，不只是 agent 自己写的那段 prompt。

它还会被补上：

- 当前 model
- working directories
- enabled tool names

所以这里不是“拿 prompt 原文就开跑”，而是：

> 先把 prompt 变成带环境事实的运行时 prompt。

### 2. frontmatter 里的 skill 会在 agent 启动时预载

这段特别值。

如果 agent 定义里带了：

- `skills`

它会：

1. 从 `getSkillToolCommands(...)` 拿全部 skills
2. 解析 skill 名，兼容 plugin namespace
3. 加载 skill prompt 内容
4. 用 `createUserMessage(...)` 把 skill 内容作为 meta message 塞进 `initialMessages`

这个动作说明：

> skill 在 agent 这里不是“等调用再发现”，也可以是 agent 启动时自带的方法论预热包。

这和前面 SkillTool 那篇正好接上。

前面看的是“skill 怎么作为 tool 被接进 runtime”；这里看到的是“agent 怎么在启动时主动预载 skill”。

### 3. frontmatter hooks 也会按 agent 生命周期注册

如果 agent 定义里有：

- `hooks`

它会在 agent 启动时注册，而且是带 `agentId` 作用域的 session hooks。

结束时再清掉。

这说明 frontmatter hook 不是“全局配置”，而是：

> 跟着这个 agent 活，跟着这个 agent 死。

### 4. agent 自己还能定义 MCP servers

`initializeAgentMcpServers(...)` 这一段非常关键。

agent frontmatter 里的 `mcpServers` 可以是：

- 引用已有 server 名字
- inline 定义新的 server config

然后它会：

- `connectToServer(...)`
- `fetchToolsForClient(...)`
- 收集 agent 专属 MCP tools
- 在 agent 结束时 cleanup

而且只有 inline 新建出来的 client 会被回收；引用父上下文共享的 client 不会乱清。

这套设计相当成熟。

它让 agent 不只是“使用父上下文已有 MCP”，而是：

> agent 可以带自己的外部能力接入面。

这个能力一出来，agent 就更像独立角色，而不只是共享父会话的 prompt 变体。

---

## 第六层：真正造出一个子 agent 的 ToolUseContext

前面那些装配动作，最后都要落到一个真正的运行时上下文里。

这里它调用的是：

- `createSubagentContext(...)`

并把这些东西一起塞进去：

- `options`
- `agentId`
- `agentType`
- `messages`
- `readFileState`
- `abortController`
- `getAppState`
- `contentReplacementState`
- 以及一些共享/不共享策略

这是整篇里我最想记住的一步。

因为到这一步，agent 才第一次从“定义 + 预处理结果”变成了真正的：

> 可被 `query()` 驱动的 ToolUseContext 实例。

也就是说，前面所有东西——权限、tool pool、MCP、skills、system prompt——到这里才终于收束成一个 runtime 对象。

### 这里还有两个很细但很重要的点

#### `preserveToolUseResults`
某些有可查看 transcript 的 subagent，会保留 tool result。

这不是核心逻辑，但说明 transcript 展示体验也被考虑进来了。

#### `onCacheSafeParams`
它会把 system prompt、context、toolUseContext 等暴露出去，给 background summarization / prompt cache 共享用。

这意味着 `runAgent` 不只是运行 agent，也在给更外层的缓存/摘要系统喂可复用参数。

---

## 第七层：把 agent 接进主循环，并负责收尾清场

装完之后，真正的执行就很直接了：

- `for await (const message of query(...))`

也就是说，`runAgent` 自己并不重写主循环。

它做的是：

1. 构造 `query(...)` 所需的一切输入
2. 消费消息流
3. 记录 transcript
4. 透传可记录消息
5. 最后做完整清理

### transcript 不是最后一次性写，而是边跑边记

这点很值。

它在 query 开始前就先：

- `recordSidechainTranscript(initialMessages, agentId)`
- `writeAgentMetadata(...)`

之后每产生一条 recordable message，又会继续写 sidechain transcript。

说明 Claude Code 对 agent transcript 的理解不是“事后导出日志”，而是：

> agent 运行过程本身就是一条持续被持久化的 sidechain。

这和 resume / background task / 可查看 transcript 这些能力是连着的。

### finally 里的清理非常重

`runAgent.ts` 的 `finally` 里清的东西非常多：

- agent-specific MCP cleanup
- clear session hooks
- cleanup prompt cache tracking
- clear cloned file state cache
- release initial messages
- unregister perfetto agent
- clear transcript subdir mapping
- 清掉 agent 对应 todos
- kill 这个 agent 启动的 background bash tasks
- kill monitor MCP tasks

这段很能说明它不是“帮你启动一下 agent”的文件，而是：

> 对一个 agent 的完整生命周期负责到底。

启动时装，退出时拆。

这才叫真正的 runtime。

---

## `runAgent` 和 `AgentTool.tsx` 的关系

如果只看 `runAgent.ts`，你会觉得它已经够像主入口了。

但再补 `AgentTool.tsx` 会更清楚：

- `AgentTool.tsx` 更像调度与分流入口
- `runAgent.ts` 更像具体装配与执行入口

前者负责决定：

- sync 还是 async
- foreground 还是 background
- 需不需要 worktree
- 任务怎么注册、怎么通知
- background 过程中怎么 summarization / progress / handoff

后者负责：

- 把选好的 agent 真正组装出来并接进 `query()`

所以我现在更愿意把它们这样分工：

### `AgentTool.tsx`
负责“agent 要不要起、以什么方式起、外层任务生命周期怎么管理”

### `runAgent.ts`
负责“这个 agent 一旦要起，怎么把它装成一个能跑的 runtime 实体”

---

## `runAgent` 和上一篇主循环的关系

这两篇其实刚好是一前一后。

### 上一篇 `query.ts`
回答的是：
- 一轮 agent 回合怎么推进
- tool_use 怎么接
- tool_result 怎么回流
- 生命周期怎么继续/停止

### 这一篇 `runAgent.ts`
回答的是：
- 谁来准备这轮 query 所需要的 agent 全套运行材料
- 谁来给 agent 装权限、工具、skills、MCP、hooks、transcript
- 谁来保证 agent 结束后清干净

所以这两篇合起来，刚好拼成：

> `runAgent.ts` 负责把 agent 装出来，`query.ts` 负责把 agent 跑起来。

这是我这次最明确的结构感。

---

## 这篇我最想记住的 5 个点

### 1. `runAgent` 的核心不是 spawn，而是 assembly
它真正做的是装配，不是简单启动。

### 2. agent 定义不会直接执行，必须先被翻译成 runtime context
frontmatter / JSON / built-in 定义到这里才真正落地。

### 3. agent 的权限、工具池、skills、MCP、hooks 都是在这一层接好的
这就是它为什么是 agent runtime 的汇合点。

### 4. 它对上下文继承是谨慎的，不是无脑复制
尤其是 incomplete tool calls 过滤和 readFileState clone，说明边界意识很强。

### 5. 它对清理负全责
从 transcript 到 MCP 到 hooks 到 bash tasks，最后都要在这里收口。

---

## 我现在对 `runAgent.ts` 的一句话定义

> `runAgent.ts` 是 Claude Code 的 agent 装配线：它把 agent 定义、上下文继承、权限模型、工具池、skill 预载、MCP 接入、transcript 持久化和清理逻辑组装成一个真正可被 `query()` 驱动的运行时实体。

---

## 下一步最顺怎么接

我觉得后面最顺有两条路。

### 路线 A：接 `forkSubagent.ts`
因为 `runAgent` 已经看清“agent 怎么被装出来”，下一步很自然就是：

- forked subagent 的隔离、worktree、上下文复制到底怎么成立

这条线会更像 agent runtime 的分叉执行篇。

### 路线 B：接 built-in agents / `loadAgentsDir.ts` 深挖
如果你想把 agent 定义层补扎实，可以去看：

- `builtInAgents.ts`
- `built-in/*.ts`
- `loadAgentsDir.ts`

那会更接近：

- agent 人设从哪来
- description / prompt / tools / hooks / mcpServers 在定义层怎么声明

如果按当前节奏，我更建议：

> 先接 `forkSubagent.ts`。因为 `runAgent` 已经把“装配”讲清了，下一步接“分叉与隔离”会更顺。