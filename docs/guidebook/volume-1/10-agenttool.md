---
title: 卷一 10｜AgentTool 不是再开一个 agent 这么简单
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 10｜AgentTool 不是再开一个 agent 这么简单

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Agent 1/5
- **上一篇**：[上一篇：主循环里 tool 怎么被接住](./09-how-tools-enter-runtime.md)
- **下一篇**：[下一篇：runAgent 是把 agent 组装成可运行体的装配线](./11-runagent-assembly-line.md)

这一篇正式进入 agent 段。它解决的不是“再开一个 agent”这么直觉化的问题，而是 AgentTool 在运行时里到底扮演什么角色。

---

## 这篇看什么

这篇主看的是：

- `src/tools/AgentTool/AgentTool.tsx`

如果前面那些工具大多还在处理“单个动作”——读文件、改文件、搜索内容、执行命令——那 AgentTool 处理的已经是另一层问题：

> 当主 agent 不想自己干，或者不适合自己干时，怎么把任务委派出去。

更准确地说：

> AgentTool 不是一个“帮你再开个 Claude”的小开关，而是 Claude Code 里任务委派、子 agent 生命周期、团队协作、异步执行、隔离运行的总入口之一。

所以它比我原先预期的要重很多。

---

## 先给结论

### 1. AgentTool 的核心语义是“委派任务”，不是“复制一个自己”

从输入 schema 就能看出来，它关心的不是“开一个会话”本身，而是：

- `description`
- `prompt`
- `subagent_type`
- `model`
- `run_in_background`
- `name`
- `team_name`
- `mode`
- `isolation`
- `cwd`

这里最关键的是前两个字段：

- `description`
- `prompt`

这说明 AgentTool 的基本单位不是“新 session”，而是：

> 一项要被委派出去的任务。

Claude Code 不是把 agent 当聊天分身，而是把 agent 当任务执行者。

### 2. AgentTool 天生带多种运行模式，不是只有一种 spawn

这点特别重要。

从代码里能明显看到几条不同路径：

- 普通 subagent
- fork subagent
- teammate / team 场景
- 异步 background agent
- worktree 隔离
- remote 隔离

也就是说，AgentTool 并不是“统一 new 一个 agent”那么简单，而是在做：

> 根据任务形态，选择不同的委派运行方式。

这很像真正的 runtime，而不像 demo 级多 agent 功能。

### 3. 它本质上是多 agent runtime 的路由器

你看它 import 的东西就能感觉出来，它不是单点功能文件，而是把很多子系统都拉进来了：

- AgentSummary
- LocalAgentTask
- RemoteAgentTask
- spawnTeammate
- worktree
- systemPrompt
- tool pool assembly
- progress tracking
- async lifecycle
- built-in agents
- loadAgentsDir

这基本说明：

> AgentTool 本身不是“子 agent 实现”，而是把子 agent 系统各个部件串起来的路由层。

这个定位很关键。

---

## 输入 schema 其实很能说明问题

### 1. 它首先是“任务描述 + 任务正文”

最核心的输入是：

- `description`
- `prompt`

而且 `description` 明确要求是短短几词。

这很像一个任务调度系统，而不是聊天系统。

因为调度系统最需要的不是自然聊天，而是：

- 这任务叫什么
- 这任务到底要做什么

### 2. `subagent_type` 说明它支持角色化 agent

这个字段非常关键。

它说明 Claude Code 的 agent 不是只有“通用子 agent”一种，而是支持：

- 专项 agent
- 内建 agent
- 从 agents 目录加载的 agent

也就是说，AgentTool 背后连接的不只是 runtime，还连接 agent definition 体系。

### 3. `run_in_background` 说明 agent 在 Claude Code 里首先是任务，不是必须同步等待的对话对象

这一点我觉得特别能说明问题。

如果一个系统把子 agent 当聊天对象，默认思路会是：

- 开一个
- 等它说完

但 AgentTool 从 schema 层就承认：

> 这个 agent 任务可能本来就应该后台跑。

这说明它在设计时已经把 agent 看成可调度任务，而不是只会同步往返的会话。

### 4. `name` / `team_name` / `mode` 说明它还兼容团队协作

这块让 AgentTool 明显超出了“subagent tool”的常规印象。

它不仅能拉一个 worker，还能进入：

- team 语境
- teammate spawn
- plan mode required
- addressable agent name

也就是说，它不是“单兵分身工具”，而是已经触到团队协作抽象了。

### 5. `isolation` / `cwd` 说明它对执行环境也有控制权

这个很重要。

AgentTool 不只是派任务，还能控制任务在哪跑：

- 当前工作区
- worktree 隔离
- remote 环境
- 指定 cwd

这意味着它委派出去的不是一个纯逻辑对象，而是：

> 一个带执行环境约束的任务执行体。

---

## 它最有意思的几块设计

### 1. AgentTool 一上来就做很多“能不能派”的前置判断

这点非常重要。

它不是收到 prompt 就傻乎乎开 agent，而是先判断：

- 你有没有 agent teams 权限
- teammate 能不能再 spawn teammate
- in-process teammate 能不能起 background agent
- 当前 team context 是否允许这种行为

这说明 AgentTool 不是“能力开口”，而是一个严格受 runtime 规则约束的入口。

这很像真实系统，不像演示系统。

### 2. 它支持 built-in agent，也支持目录加载 agent

从 import 就能看出来：

- `GENERAL_PURPOSE_AGENT`
- 一堆 built-in agent
- `loadAgentsDir.ts`

这说明 Claude Code 的 agent 系统不是硬编码死的。

它同时支持：

- 内建角色
- 外部 agent 定义

所以 AgentTool 不只是运行器，还是 agent definition 体系的消费方。

### 3. 它把 fork subagent 当成一条特殊路径

代码里有明显的 fork path 逻辑：

- `FORK_AGENT`
- `isForkSubagentEnabled()`
- `isInForkChild()`
- `buildForkedMessages()`
- `buildWorktreeNotice()`

而且还专门防止：

- fork child 再 fork

这个设计很值。

它说明 Claude Code 已经意识到“无限递归分叉”会让系统很快变乱，所以在运行时直接加了防线。

### 4. 它会根据场景选同步、异步、本地、远程路径

虽然我这轮没把整份文件深抠到底，但从主干已经很清楚：

- 有 `LocalAgentTask`
- 有 `RemoteAgentTask`
- 有 async lifecycle
- 有 foreground / background 注册
- 有 progress update
- 有 notification enqueue

也就是说，AgentTool 背后不止一条执行通路。

这点非常像 Claude Code 的总体设计风格：

> 统一暴露一个 tool，内部根据上下文路由到不同执行机制。

这和 BashTool、FileReadTool 的思想是一致的。

### 5. 它会重新组装子 agent 能看到的工具池

有一条 import 特别关键：

- `assembleToolPool`

这意味着子 agent 并不是简单继承父 agent 的全部工具，而是会重新拼一份自己的工具池。

这个点很重要。

因为多 agent 系统如果不控制 tool pool，很容易：

- 权限失控
- 能力边界失控
- 递归乱套

所以 AgentTool 的工作不只是“把 prompt 发过去”，还包括：

> 给这个被派出去的 agent 定义一个合理的工作空间、系统提示和工具集合。

---

## AgentTool 和其他 tools 最大的不同

我觉得 AgentTool 和前面那几类 tool 最大的不同，在于它不直接完成任务。

### BashTool / FileReadTool / FileEditTool / GrepTool
这些工具本身就是动作执行者。

### AgentTool
它自己不直接读、不直接改、不直接搜。

它做的是：

- 选一个 agent
- 选一种运行模式
- 组装 prompt / system prompt / tools / context
- 启动 agent
- 管理生命周期
- 汇总结果

也就是说，它不是动作工具，而是：

> 任务委派工具。

这类 tool 在整个 Claude Code 架构里，明显属于更高一层。

---

## 我现在对它的一个直觉判断

如果把 Claude Code 的 tools 分层，大概可以这么看：

### 第一层：基础动作原语
- Read
- Edit
- Write
- Grep
- Glob
- Bash

### 第二层：外部能力桥接
- MCP
- WebFetch
- WebSearch
- LSP

### 第三层：runtime 级工具
- SkillTool
- AgentTool
- ToolSearchTool

AgentTool 明显就在第三层。

它不直接解决“做什么”，而是解决：

- 这件事该不该委派出去
- 委派给谁
- 在哪跑
- 同步还是异步
- 如何把执行结果带回来

这已经很接近一个调度器入口了。

---

## 这个 tool 最像产品判断的地方

如果让我现在挑 AgentTool 里最像产品判断的几个点，我会选这几个：

### 1. 背景执行是一等能力，不是附加能力
这说明 Claude Code 把 agent 当任务，而不是只当对话分身。

### 2. 隔离运行是一等能力
worktree / remote 这些不是补丁，是正式设计。

### 3. 会限制 teammate / fork 的递归行为
这说明系统设计者很清楚多 agent 一旦放飞，会立刻失控。

### 4. agent definition、tool pool、system prompt 都会重新组装
这说明 spawn 的不是“复制父进程”，而是“构造一个新的受控执行体”。

---

## 我对 AgentTool 的整体判断

如果让我现在先给 AgentTool 下一个定义，我会这么说：

> AgentTool 是 Claude Code 的任务委派原语。它不直接完成工作，而是负责把一项任务连同合适的角色、模型、工具池、执行环境和生命周期管理，一起交给另一个 agent。

这比“拉起一个 subagent”要重很多。

也正因为它太重，所以 AgentTool 这条线大概率还不能只看一个 `AgentTool.tsx` 就算完。后面还值得继续拆：

- `runAgent.ts`
- `forkSubagent.ts`
- `loadAgentsDir.ts`
- built-in agents
- `agentToolUtils.ts`

---

## 这一篇我最想记住的一句话

> AgentTool 的价值不在于“多开一个 agent”，而在于它把任务委派这件事做成了可控、可隔离、可异步、可协作的 runtime 能力。

---
