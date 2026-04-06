---
title: 卷一 12｜forkSubagent 是在同一上下文里分叉出 worker
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
  - agent
  - fork
source_files:
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/forkSubagent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/resumeAgent.ts
status: done
source_url: https://feishu.cn/docx/BN5cdLG21oxRxixB4ZZcZixanug
---

# 卷一 12｜forkSubagent 是在同一上下文里分叉出 worker

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Agent 3/5
- **上一篇**：[上一篇：runAgent 是把 agent 组装成可运行体的装配线](./11-runagent-assembly-line.md)
- **下一篇**：[下一篇：loadAgentsDir 是 agent 定义层的总入口](./13-loadagentsdir.md)

这一篇往前推进一步：当 agent 已经能跑起来之后，Claude Code 是怎么在同一上下文里继续分叉出 worker 的。

---

## 这篇看什么

前一篇已经把 `runAgent.ts` 看完了，知道了 agent 是怎么被装成一个可运行体的。

顺着前一篇往下，最自然的问题就是：

> fork 到底是什么？它和普通 `subagent_type=xxx` 的 agent 调用差在哪？

这次我主要看的是：

- `src/tools/AgentTool/forkSubagent.ts`

为了不把它看成一段孤立工具代码，我又补了两块连接位置：

- `src/tools/AgentTool/AgentTool.tsx`
- `src/tools/AgentTool/resumeAgent.ts`

看完之后，我现在对 fork 的判断很明确：

> `forkSubagent.ts` 干的不是“再选一个 agent 去做事”，而是在当前对话已经形成的上下文上，直接切出一个 worker 分支，让子 agent 继承父上下文、继承父 system prompt、继承父工具面，然后只替换最后那条 fork directive。

如果说普通 agent 调用更像“按 agent 类型启动一个角色”，那 fork 更像：

> 在当前这条正在进行的思路里，直接掰出一个分叉 worker。

---

## 先给主结论

### 1. fork 的核心不是选 agent 类型，而是省掉“重新建角色”这一步

普通 AgentTool 调用通常是：

- 给一个 `subagent_type`
- 选中对应 `AgentDefinition`
- 再按那个 agent 的 prompt / tools / mcp / hooks 去装配

但 fork 路径不是这么走的。

在 `AgentTool.tsx` 里可以看到：

- `subagent_type` 省略
- 且 `isForkSubagentEnabled()` 为真
- 就走 `isForkPath`

这时选中的不是某个真实可配置 agent，而是一个内置的：

- `FORK_AGENT`

而这个 `FORK_AGENT` 非常有意思：

- `tools: ['*']`
- `model: 'inherit'`
- `permissionMode: 'bubble'`
- `getSystemPrompt: () => ''`

重点在于最后这一条。

它不是靠自己的 system prompt 活着。

注释已经写得很直白：

> fork path 真正使用的是父 agent 已经渲染好的 system prompt bytes。

也就是说，fork 的第一原则不是“切角色”，而是：

> 尽量保持和父上下文字节级一致，只在最后一小段指令上分叉。

### 2. fork 的目标不是通用委派，而是 prompt cache 友好的上下文分叉

`forkSubagent.ts` 整个文件最值得看的，其实不是功能，而是它对 prompt cache 的执念。

里面反复强调一件事：

- fork children 要尽量共享 byte-identical API request prefixes

这件事直接影响它怎么设计消息。

比如：

- 保留完整 parent assistant message
- tool_result 全部写成同一个 placeholder
- 只让最后的 directive text block 因 worker 不同而变化

这套做法的出发点不是“语义优雅”，而是：

> 让一堆 fork child 在 API 前缀上尽量命中同一份 prompt cache。

所以 fork 不是普通 delegation feature，它更像：

> 一个为分叉执行和缓存命中专门设计的子路径。

### 3. fork child 不是一个自由 agent，而是被强约束成 worker

`buildChildMessage()` 里有整段 fork boilerplate。

里面最核心的规则其实就几条：

- 你不是主 agent
- 不要再 spawn sub-agents
- 不要聊天，不要提建议
- 直接用工具
- 修改文件就 commit
- tool call 之间不要乱说话
- 严格待在自己 scope 里
- 输出以 `Scope:` 开头

这说明 fork child 的产品定位非常明确：

> 它不是对话伙伴，也不是独立策划者，而是一个干活 worker。

也就是说，fork 在 Claude Code 里不是“更轻的 agent”，而是：

> 更硬约束的 worker agent。

---

## 从架构层看，`forkSubagent.ts` 到底在干什么

我觉得可以拆成 5 层。

## 第一层：先决定 fork 这条路什么时候可用

`isForkSubagentEnabled()` 很短，但信息量很大。

它要求：

- feature gate 开着
- 不能在 coordinator mode 下
- 不能在 non-interactive session 下

这个组合已经说明，fork 不是一个随时可用的底层能力，而是一个受场景约束的交互式功能。

### 为什么 coordinator mode 下禁掉

注释写得很直接：

- coordinator 已经有自己的 orchestration model

这说明在作者眼里，fork 和 coordinator 都在争“谁负责分工调度”这个位置。

两套并存会打架，所以直接互斥。

### 为什么 non-interactive session 下禁掉

这点也合理。

fork child 的 `permissionMode` 是：

- `bubble`

意味着必要时权限交互会往父终端冒。

如果当前会话本身就是 non-interactive，那这个交互模型就不成立了。

所以它不是单纯 feature gate，而是在保护一套前提：

> fork 是面向交互式父会话的分叉 worker 机制。

---

## 第二层：构造一个假的内置 agent，但关键运行字节来自父上下文

`FORK_AGENT` 本身很像一个 synthetic agent definition。

它不是注册到 built-in 列表里的正常 agent，只在 fork path 里临时使用。

关键字段值得一起看：

- `tools: ['*']`
- `maxTurns: 200`
- `model: 'inherit'`
- `permissionMode: 'bubble'`
- `getSystemPrompt: () => ''`

这里最反直觉的是：

### `getSystemPrompt()` 基本是摆设

因为真实执行时，fork path 会通过：

- `override.systemPrompt`

把父 agent 已经渲染好的 system prompt bytes 线程式传进去。

它不重新调用 `getSystemPrompt()`，原因也写得很实在：

- 重新构造可能因为环境状态变化导致字节不一致
- prompt cache 会因此失效

这是这篇里我最喜欢的工程点之一。

它不是停留在“语义等价就行”，而是直接承认：

> 对 fork 来说，语义等价不够，字节等价才值钱。

所以 fork child 其实不是靠自己的人设 prompt 站起来的，而是：

> 复用父 agent 已经成型的那套 prompt 实体。

---

## 第三层：不是复制整段对话，而是精心构造一段 cache-friendly fork prefix

`buildForkedMessages()` 是这个文件最核心的函数。

它做的事情表面看不复杂，但设计味很重。

### 第一步：保留完整 assistant message

它不是只拿最新一个 tool_use block，也不是抽取摘要。

它会保留 parent 当前那条完整的 assistant message，包括：

- thinking
- text
- 所有 `tool_use`

这个动作很关键。

说明 fork child 继承的不是“一个任务摘要”，而是父 agent 当下那一轮已经成型的推理产物。

### 第二步：把所有 tool_use 对应的 tool_result 都填成相同 placeholder

它会把每个 tool use block 都配上：

- `Fork started — processing in background`

这个统一占位结果。

这里的重点不在文案，而在“全部相同”。

因为一旦每个 child 的 tool_result 内容不同，前缀就不共享了。

### 第三步：只在最后追加一个 per-child directive

最后那条 user message 长这样：

- 前面是一串 placeholder tool_result blocks
- 最后才接 `buildChildMessage(directive)` 生成的文本

这样得到的结果就是：

> `[...history, assistant(all_tool_uses), user(placeholder_results..., directive)]`

除了最后那段 directive 外，前缀几乎一样。

这就是为什么我前面说，fork 的真正目标不是“复制上下文”，而是：

> 构造一段最大化 cache 复用的分叉前缀。

---

## 第四层：给 fork child 一段极其强硬的 worker boilerplate

`buildChildMessage()` 基本就是 fork worker 的操作规程。

我觉得这里最值得记的不是具体十条规则，而是它在解决什么问题。

### 它在解决 3 个风险

#### 风险 1：fork child 继续 fork
所以第一条就直接写：

- 你已经是 fork 了
- 忽略“default to forking”那条上层指令
- 不要再 spawn sub-agents

这相当于显式切断递归分叉。

#### 风险 2：fork child 退回成聊天助手
所以又加：

- 不要 converse
- 不要 ask questions
- 不要 suggest next steps
- tool call 之间不要发文本

这就是强制它从“会聊的 agent”退化成“干活 worker”。

#### 风险 3：fork child 越界
所以还会要求：

- 严格待在 assigned scope
- 发现旁支系统最多一两句带过
- 报告结构固定
- 500 字以内

所以这段 boilerplate 的真实作用是：

> 把一个本来具备完整 agent 能力的模型，压缩成一个窄职责 worker。

### 输出格式也很说明产品意图

它要求最终输出是这种 plain-text label 结构：

- `Scope:`
- `Result:`
- `Key files:`
- `Files changed:`
- `Issues:`

这说明 fork child 的输出不是为了继续对话，而是为了：

> 方便父 agent 消化、归并和后处理。

---

## 第五层：处理 worktree fork 和 resume，让 fork child 真能长期活下去

### `buildWorktreeNotice()`

这个函数说明 fork 不只是逻辑分叉，还可能是物理工作目录分叉。

当 child 在 isolated worktree 里运行时，它会额外收到一段 notice，核心意思是：

- 你继承的上下文路径来自 parent cwd
- 你现在在另一个 worktree root
- 需要把路径翻译过去
- 编辑前最好重读文件
- 你的改动只影响这个 worktree

这个 notice 很短，但非常实用。

因为 fork + worktree 最大的风险之一就是：

> child 以为上下文里提到的文件路径还是原来那份 working copy。

所以这不是文案装饰，而是在补“同仓库、不同工作副本”这个认知差。

### `resumeAgent.ts` 里 fork resume 的处理也很有意思

`resumeAgentBackground()` 对 fork 有单独分支：

- 如果 meta 里的 `agentType === FORK_AGENT.agentType`
- 就认定这是 resumed fork
- 重新恢复 parent system prompt
- fork resume 时 `useExactTools: true`
- 不再重复 supply `forkContextMessages`

这里最关键的是两个点。

#### 1. resume fork 依然要尽量保持原来的 prompt cache 前缀

它会优先拿：

- `toolUseContext.renderedSystemPrompt`

拿不到才尝试重建父 system prompt。

这说明 fork 的 byte-identical obsession 不只是首次启动时有，resume 时也尽量延续。

#### 2. transcript 里已经有 parent context slice，所以不能再补一次

注释写得很清楚：

- transcript 已经含原 fork 的 parent context slice
- 再传 `forkContextMessages` 会产生 duplicate tool_use IDs

这点特别能说明作者对消息 pairing 的紧张程度。

也说明 fork 不是“恢复一段抽象任务”，而是：

> 恢复一条已经构造好的分叉消息链。

---

## `forkSubagent.ts` 和普通 AgentTool 路径的区别

我觉得可以直接这么对比。

### 普通 agent path
更像：
- 选一个 agent 类型
- 用它的定义装配出一个 agent
- 它有自己的人设、自己的 prompt、自己的工具约束

### fork path
更像：
- 不重建角色
- 直接继承父对话和父 prompt
- 保持字节级前缀尽量一致
- 只在最后加一条 worker directive
- 让 child 像当前对话的分支 worker 那样去执行

所以我现在更愿意把 fork 看成：

> 不是“启动另一个 agent”，而是“从当前 agent 的这条执行线上切出一根 worker 支线”。

---

## `forkSubagent.ts` 和前一篇 `runAgent.ts` 的关系

这两篇接起来看会很顺。

### `runAgent.ts`
回答的是：
- agent 怎么被装成 runtime 实体

### `forkSubagent.ts`
回答的是：
- 当不想重新建角色、只想沿当前上下文切分 worker 时，前缀消息和 worker 约束要怎么造

也就是说：

- `runAgent` 负责“装起来怎么跑”
- `forkSubagent` 负责“分叉时给它喂什么上下文，才能既像父分支又不失控”

这也是这篇最明确的结构感。

---

## 这篇我最想记住的 5 个点

### 1. fork 的核心不是 agent selection，而是 context branching
它不是先换角色，再跑；而是先继承父上下文，再局部改写 directive。

### 2. fork path 很在意 prompt cache
很多实现都是围着“保持 API request prefix 尽量字节一致”来设计的。

### 3. `FORK_AGENT` 只是壳，真正重要的是父 prompt 的继承
它的人设不是自己长出来的，而是从父 agent 线程过去的。

### 4. fork child 被明确压成 worker，而不是完整对话 agent
这就是那段 boilerplate 存在的意义。

### 5. worktree 和 resume 都说明 fork 不是一次性 hack，而是完整运行路径的一部分
它已经不是小实验味的 helper 了，而是 Claude Code 正式分叉执行模型的一环。

---

## 我现在对 `forkSubagent.ts` 的一句话定义

> `forkSubagent.ts` 是 Claude Code 的上下文分叉层：它不重新创建一个全新角色，而是在父 agent 已成型的上下文和 prompt 基础上，构造一个 cache-friendly 的 worker 分支，让子 agent 继承父前缀、收紧行为边界，并在需要时继续支持 worktree 与 resume。

---
