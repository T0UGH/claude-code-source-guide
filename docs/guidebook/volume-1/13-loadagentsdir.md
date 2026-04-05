---
title: 卷一 13｜loadAgentsDir 是 agent 定义层的总入口
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
  - agent
  - definitions
source_files:
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/loadAgentsDir.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/generalPurposeAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/exploreAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/planAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/verificationAgent.ts
status: done
source_url: https://feishu.cn/docx/H2BldpWUpoGczpxmWEtcPRgHn1b
---

# 卷一 13｜loadAgentsDir 是 agent 定义层的总入口

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Agent 4/5
- **上一篇**：[上一篇：forkSubagent 是在同一上下文里分叉出 worker](./12-forksubagent.md)
- **下一篇**：[下一篇：builtInAgents 是官方内建角色模板总表](./14-builtinagents.md)

这一篇把视角从运行时拉回定义层。前面几篇解释 agent 怎么跑，这一篇解释 agent 定义是怎么进入系统的。

---

## 这篇看什么

前面几篇已经把 agent 执行层差不多拆开了：

- `query.ts` 看主循环
- `runAgent.ts` 看装配层
- `forkSubagent.ts` 看分叉 worker

那现在就该回头补一个问题：

> 这些 agent 本身到底从哪来？

这次主看的是：

- `src/tools/AgentTool/loadAgentsDir.ts`

为了不把这篇写成纯 schema 讲解，我又补了几块定义层样本：

- `src/tools/AgentTool/builtInAgents.ts`
- `src/tools/AgentTool/built-in/generalPurposeAgent.ts`
- `src/tools/AgentTool/built-in/exploreAgent.ts`
- `src/tools/AgentTool/built-in/planAgent.ts`
- `src/tools/AgentTool/built-in/verificationAgent.ts`

看完之后，我现在的判断很明确：

> `loadAgentsDir.ts` 干的不是“读一下 agents 目录”这么简单，它其实是 Claude Code 的 agent 定义层总入口：负责把 built-in、plugin、markdown、JSON 这些不同来源的 agent，统一收敛成一套 `AgentDefinition` 模型，再按来源优先级决出当前真正生效的 agent 集合。

如果说 `runAgent.ts` 是 agent runtime 的装配线，那 `loadAgentsDir.ts` 更像：

> agent 世界的编户齐民系统。

谁算一个 agent，agent 能声明什么，重名时谁覆盖谁，最后都在这里定下来。

---

## 先给主结论

### 1. `loadAgentsDir.ts` 的核心任务，是统一 agent 的声明来源

Claude Code 的 agent 并不是只来自一个地方。

至少从这份代码看，它同时接这些来源：

- built-in agents
- plugin agents
- markdown agents
- JSON agents
- 不同 setting source 下的 custom agents

这些来源显然长得不一样。

有的是代码里写死的对象；
有的是 markdown frontmatter + 正文；
有的是 JSON 配置；
有的是 plugin 动态注入。

但在 `loadAgentsDir.ts` 里，最后都被收敛成：

- `AgentDefinition`

也就是说，这个文件真正做的是：

> 把多来源、不同形态的 agent 声明，统一翻译成同一种 runtime 可消费的数据模型。

### 2. 它定义的不是“prompt 文件格式”，而是一整套 agent 声明语言

看 `BaseAgentDefinition` 就很清楚，Claude Code 对 agent 的定义远不止 prompt：

- `agentType`
- `whenToUse`
- `tools`
- `disallowedTools`
- `skills`
- `mcpServers`
- `hooks`
- `color`
- `model`
- `effort`
- `permissionMode`
- `maxTurns`
- `background`
- `initialPrompt`
- `memory`
- `isolation`
- `requiredMcpServers`
- `criticalSystemReminder_EXPERIMENTAL`
- `omitClaudeMd`

这说明 agent definition 在 Claude Code 里不是“写一段 system prompt”。

它更像：

> 一种把角色、人设、工具边界、运行约束、外部能力和生命周期提示一起声明出来的 DSL。

### 3. 它不只负责加载，还负责决定“谁生效”

很多系统的 loader 只是把配置读出来。

但 `loadAgentsDir.ts` 不是。

它还有一层关键逻辑：

- `getActiveAgentsFromList(...)`

这一步会把：

- built-in
- plugin
- userSettings
- projectSettings
- flagSettings
- policySettings

按顺序分组，再用 `agentType` 做 map 覆盖。

这就意味着：

> agent 定义层不仅在管“有哪些 agent”，也在管“同名 agent 最终谁说了算”。

所以它其实是加载器 + 合并器 + 优先级裁决器。

---

## 从架构层看，`loadAgentsDir.ts` 到底在干什么

我觉得可以拆成 6 层。

## 第一层：先把 agent 这个概念定义成统一类型系统

这篇最容易被低估的地方，是它先把 agent 的类型边界划得很清楚。

### 三大类定义

文件里明确分了：

- `BuiltInAgentDefinition`
- `CustomAgentDefinition`
- `PluginAgentDefinition`

最后统一成：

- `AgentDefinition`

而且它们的差异不是标签差异，而是真有结构差异。

#### Built-in agent
- `source: 'built-in'`
- `baseDir: 'built-in'`
- `getSystemPrompt(params)` 是动态函数

#### Custom agent
- 来自 settings / markdown / JSON
- `getSystemPrompt()` 通常是 closure

#### Plugin agent
- 也有自己的 `plugin` 元数据
- 但最后还是收束成统一 agent 结构

这说明在定义层，Claude Code 并没有强行把所有 agent 当成完全一样的文件对象，而是承认：

> 不同来源的 agent，其声明方式不同；但它们必须在运行前汇成统一抽象。

### 这里最关键的是 `getSystemPrompt`

不管 built-in 还是 custom，最后都要提供：

- `getSystemPrompt`

这点非常重要。

说明系统真正需要的不是“prompt 文本”，而是：

> 一个能在需要时生成 system prompt 的接口。

这也解释了为什么 built-in agent 可以带动态 prompt 逻辑，而 markdown / JSON agent 也能以 closure 形式并进去。

---

## 第二层：把 frontmatter / JSON 解析成结构化 agent 定义

这层是最像“定义语言解析器”的部分。

### JSON 路径：`parseAgentFromJson`

JSON agent 支持的字段很完整：

- `description`
- `tools`
- `disallowedTools`
- `prompt`
- `model`
- `effort`
- `permissionMode`
- `mcpServers`
- `hooks`
- `maxTurns`
- `skills`
- `initialPrompt`
- `memory`
- `background`
- `isolation`

解析后再装成 `CustomAgentDefinition`。

### Markdown 路径：`parseAgentFromMarkdown`

markdown 这条线更有意思，因为它把：

- frontmatter
- 正文 content

拆开用了。

frontmatter 负责声明：

- `name`
- `description`
- `tools`
- `disallowedTools`
- `skills`
- `initialPrompt`
- `mcpServers`
- `hooks`
- `model`
- `effort`
- `permissionMode`
- `maxTurns`
- `background`
- `memory`
- `isolation`
- `color`

正文 content 则直接变成：

- system prompt 本体

这就说明 markdown agent 的本质其实是：

> frontmatter 声明运行约束，正文提供角色 prompt。

### 解析并不只是“读出来”，还带一堆修正逻辑

比如：

- `model: inherit` 会被标准化
- `description` 里的 `\n` 会解转义
- `background` / `memory` / `isolation` 都会验证合法值
- `maxTurns` 会强制正整数
- `hooks` 走 `HooksSchema`
- `mcpServers` 走 Zod 校验
- `tools` / `skills` 会做 frontmatter 专用解析

这说明定义层不是宽松接收、后面再报错，而是：

> 尽量在入口就把 agent 声明规范化。

---

## 第三层：不是原样存储字段，而是把声明翻译成运行时语义

这一层我觉得特别关键。

因为 `loadAgentsDir.ts` 不只是 parse，它还会顺手做一些“语义展开”。

### 1. memory 会影响最终 system prompt 和工具集

不管 JSON 还是 markdown，只要开了：

- `memory`

就不只是给对象多挂一个字段。

它还会：

- 把 memory prompt 拼进 `getSystemPrompt()`
- 在开启 auto memory 时，自动把 `Write/Edit/Read` 工具补进去

这说明 `memory` 不是一个描述标签，而是一个：

> 会改变 agent 能力面和 prompt 内容的语义开关。

### 2. `hooks`、`mcpServers`、`skills` 也不是纯数据

这些字段到了 `runAgent.ts` 那层会真正生效，但在定义层已经先被解析成结构化对象。

这就说明：

> 定义层在做的是“把声明转换成后续可执行的配置形态”。

### 3. `omitClaudeMd` 这种字段说明定义层已经开始碰 token/cost 策略

比如 Explore / Plan 这种 read-only agent，会设置：

- `omitClaudeMd: true`

这不是角色文案，而是一个非常具体的上下文裁剪策略。

也就是说，agent 定义层里已经不只是“角色设计”，还掺进了：

- token 优化
- context 策略
- 成本控制

这点很有 Claude Code 味。

---

## 第四层：把多来源 agent 汇总，并按来源优先级做覆盖

这是这篇最像“总入口”的地方。

`getAgentDefinitionsWithOverrides(cwd)` 里会把这些来源都拉进来：

- markdown files
- plugin agents
- built-in agents

然后拼成：

- `allAgentsList`

再走：

- `getActiveAgentsFromList(allAgentsList)`

### `getActiveAgentsFromList` 很关键

它会按 source 分组：

- built-in
- plugin
- userSettings
- projectSettings
- flagSettings
- managed/policySettings

然后按这个顺序依次 `set(agentType, agent)`。

因为 Map 后写会覆盖前写，所以最后生效的优先级其实就是：

> 后面的来源覆盖前面的来源。

也就是说，Claude Code 不是简单把 agent 合并成数组，而是：

> 用 `agentType` 作为主键，做了一次带优先级的声明覆盖。

这个设计很实用。

它允许：

- 内置先给默认值
- plugin 再补一层
- 用户或项目自己重写
- policy/managed 最后兜底或强覆盖

这就让 agent 系统既能扩展，也能被治理。

---

## 第五层：built-in agents 本身就是定义层样本，不只是硬编码列表

单看 `builtInAgents.ts`，你会觉得它只是个数组工厂。

但结合几个 built-in agent 文件一起看，它其实在展示：

> Claude Code 官方自己是怎么写 agent 定义的。

### `general-purpose`
最宽松，`tools: ['*']`，system prompt 强调的是：

- 搜索代码
- 分析架构
- 执行多步任务
- 不要主动建文档

它像默认 worker。

### `Explore`
明显是 read-only 搜索代理：

- 禁写
- 禁 AgentTool
- 强调搜索和快速返回
- `omitClaudeMd: true`
- 外部用户偏向 `haiku`，ant 内部可 inherit

这说明 built-in agent 的差异不只是 prompt 风格，而是：

- tool 边界
- model 策略
- context 策略
- 任务节奏

一起变化。

### `Plan`
本质上是 read-only 规划代理。

它和 Explore 很像，但目标从“找”切成了“设计 implementation plan”。

这也很能说明 Claude Code 的 agent 不是按“行业身份”切，而是按：

> 工作模式切。

### `verification`
这一类更有意思。

它：

- `background: true`
- `color: 'red'`
- 强约束输出必须给 `VERDICT`
- prompt 里直接写“你的工作不是确认它能用，而是试着把它弄坏”

这说明在定义层，Claude Code 已经把：

- 行为立场
- 输出协议
- 默认执行模式

都提前写进 agent 里了。

所以 built-in agent 不是几段 prompt，而是官方对“角色模板”这件事的完整表达。

---

## 第六层：定义层已经在替后面的运行层做准备

这一层和前面执行层那几篇可以直接接上。

从 `loadAgentsDir.ts` 里你已经能看到，后面 `runAgent.ts` 会用到的很多东西，其实这里已经准备好了：

- `skills`
- `mcpServers`
- `hooks`
- `permissionMode`
- `background`
- `memory`
- `isolation`
- `maxTurns`
- `requiredMcpServers`

也就是说：

> `loadAgentsDir.ts` 不负责执行这些语义，但它负责把这些语义先装进统一定义模型里。

所以如果说 `runAgent.ts` 是 runtime assembly，那这篇的 `loadAgentsDir.ts` 更像：

> runtime assembly 之前的 declaration assembly。

---

## `loadAgentsDir.ts` 和前几篇的关系

这一篇放回整条主线里，位置就很清楚了。

### `loadAgentsDir.ts`
回答的是：
- agent 从哪里声明出来
- 声明里能写什么
- 多来源 agent 怎么合并成一套定义系统

### `runAgent.ts`
回答的是：
- 这些定义怎么被装配成可跑的 runtime 实体

### `query.ts`
回答的是：
- 装好的 agent 在一轮循环里怎么真正运行

### `forkSubagent.ts`
回答的是：
- 不重新建角色时，怎么从现有上下文分叉 worker

这四篇连起来之后，agent 章节就开始有骨架了。

---

## 这篇我最想记住的 5 个点

### 1. `loadAgentsDir.ts` 的核心不是读目录，而是统一声明模型
它真正统一的是多来源 agent 的定义方式。

### 2. agent 定义在 Claude Code 里不是 prompt，而是一套 DSL
prompt 只是其中一部分。

### 3. 定义层已经在做语义展开，不只是字段搬运
memory、hooks、mcpServers、skills 这些都不是纯标签。

### 4. 同名 agent 的覆盖优先级是在这里裁决的
这决定了最后什么 agent 真正生效。

### 5. built-in agents 是官方角色模板，不只是硬编码 prompt
它们展示了 Claude Code 是怎么把工作模式、工具边界和输出协议一起封进 agent 的。

---

## 我现在对 `loadAgentsDir.ts` 的一句话定义

> `loadAgentsDir.ts` 是 Claude Code 的 agent 定义层总入口：它把 built-in、plugin、markdown、JSON 等不同来源的 agent 声明，解析并统一成 `AgentDefinition`，再按来源优先级决出最终生效的 agent 集合，为后续的 runtime 装配提供标准输入。

---

## 下一步最顺怎么接

我觉得后面最顺有两条。

### 路线 A：接 `builtInAgents.ts` + built-in agents 深挖
如果你想继续走定义层，可以顺着看：

- `builtInAgents.ts`
- `generalPurposeAgent.ts`
- `exploreAgent.ts`
- `planAgent.ts`
- `verificationAgent.ts`

这样能把 Claude Code 官方内建角色模板彻底看清。

### 路线 B：接 `prompt.ts`
如果你更想看 AgentTool 给模型展示 agent 列表时，描述信息和使用引导是怎么组织的，这条也顺。

如果按当前节奏，我更建议：

> 先补一篇 built-in agents 总览。因为 `loadAgentsDir.ts` 已经把“定义系统”讲清了，下一步自然就是看官方到底内置了哪些角色模板，以及它们之间怎么分工。