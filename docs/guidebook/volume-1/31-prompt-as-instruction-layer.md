---
title: 卷一 31｜prompt 是 AgentTool 给模型看的使用说明层
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
  - agent
  - prompt
source_files:
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/prompt.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts
status: done
source_url: https://feishu.cn/docx/O8bud0SVtoLRwXxHxyicDHmknDg
---

# 卷一 31｜prompt 是 AgentTool 给模型看的使用说明层

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Prompt 1/1
- **上一篇**：[上一篇：skill 和 agent 是怎么分工的](./30-skill-vs-agent.md)
- **下一篇**：无

这一篇适合拿来给卷一收尾。tool、agent、skill 都看完之后，再来看 prompt，才会知道它不是孤零零的一层，而是在重新组织前面那些能力。

---

## 这篇看什么

前一篇刚把 built-in agents 看完，已经知道 Claude Code 官方给了哪些角色模板。

但还有一个更关键的问题：

> 这些 agent 定义，最后是怎么被讲给模型听的？

这次我主看的是：

- `src/tools/AgentTool/prompt.ts`

看完之后，我现在的判断很明确：

> `prompt.ts` 干的不是“写一段 AgentTool 描述”这么简单，它其实是 AgentTool 的使用说明层：负责把 agent 列表、工具边界、使用时机、并发建议、fork 规则、fresh-agent briefing 规则这些内容，组织成一段给模型看的操作手册。

如果说：

- `loadAgentsDir.ts` 在定义 agent
- `builtInAgents.ts` 在决定默认挂哪些 agent

那 `prompt.ts` 干的就是：

> 把这套 agent 世界翻译成模型能遵守的调用规范。

---

## 先给主结论

### 1. `prompt.ts` 的本质不是“文案文件”，而是 tool policy 的一部分

这个文件表面上返回的是字符串。

但它写的并不是营销文案，而是 Claude Code 明确希望模型遵守的调用规则，比如：

- 什么时候该用 AgentTool
- 什么时候不要用
- 什么时候该 fork，什么时候该 fresh spawn
- prompt 该怎么写
- background agent 怎么用
- worktree / remote isolation 怎么用
- parallel agent 怎么发

所以从系统定位上看，它不是可有可无的提示词润色层，而是：

> AgentTool 行为策略的一部分。

### 2. 它真正要解决的问题，是“如何让模型正确使用 agent 系统”

Agent 系统复杂的地方，不在于有没有这个工具，而在于：

- 什么时候该叫 agent
- 叫哪个
- 给它什么上下文
- 结果怎么信任
- 什么情况下别乱开 agent

`prompt.ts` 基本就是围着这件事展开的。

所以它不是在介绍 agent，而是在训练模型学会：

> 如何正确把 agent 当作一个工作流工具来使用。

### 3. 它非常在意 prompt cache，不愿意为了动态 agent 列表频繁打爆缓存

这篇里最有意思的点，不在例子，而在这里：

- `shouldInjectAgentListInMessages()`

注释写得非常直白：

- 动态 agent list 占了不少 cache creation tokens
- MCP async connect、/reload-plugins、permission mode 变化都会让 description 变动
- 一变动，整个 tools-block prompt cache 就 bust 了

所以现在它会考虑把 agent list 从 tool description 里挪出去，改成：

- 通过 attachment message 注入

这说明 `prompt.ts` 已经不是单纯“怎么写清楚”，而是在平衡：

> 说明是否够清楚 vs prompt cache 是否稳定。

这一点非常 Claude Code。

---

## 从架构层看，`prompt.ts` 到底在干什么

我觉得可以拆成 5 层。

## 第一层：先把 agent 定义压成模型能读懂的一行描述

这里最基础的一步是：

- `formatAgentLine(agent)`

格式很简单：

- `- type: whenToUse (Tools: ...)`

但它不只是字符串拼接，前面还有：

- `getToolsDescription(agent)`

这里会根据：

- allowlist only
- denylist only
- allowlist + denylist
- 无限制

去算最终该怎么给模型描述工具面。

这个点很重要。

因为它说明系统不满足于“把原始定义照抄给模型”，而是会先把：

> agent 的有效工具边界

整理成模型能直接理解的自然语言。

也就是说，定义层里的 `tools` / `disallowedTools` 到这里才被翻译成可读规则。

## 第二层：决定 agent 列表是内嵌在 tool description 里，还是通过消息附件单独注入

这层是全篇最值的工程点。

有一个明确分叉：

- `shouldInjectAgentListInMessages()`

它会检查：

- 环境变量强开/强关
- GrowthBook gate `tengu_agent_list_attach`

然后决定 agent 列表走哪条路。

### 路线 A：内嵌在 tool description 里

就是传统方式：

- `Available agent types and the tools they have access to:`
- 然后把所有 agent line 拼进去

### 路线 B：通过 attachment message 注入

这时 tool description 里只会写：

- `Available agent types are listed in <system-reminder> messages in the conversation.`

也就是说，真正动态变化的 agent 列表不放进 schema prompt，而是放进对话消息里。

### 为什么这事重要

因为 tool description 一变，整个 tools block 的缓存前缀就容易失效。

而 agent 列表恰好很容易变：

- MCP 连接状态变了
- plugin reload 了
- permission 变了
- 某些 agent 被过滤了

如果每次都把这些变化直接写进 tool description，缓存会被打得很碎。

所以这里的本质不是“小优化”，而是：

> 把 agent listing 从 schema prompt 里剥离出来，减少因为动态环境变化造成的全局缓存失效。

这就是我为什么说 `prompt.ts` 已经不是普通提示词文件了。

---

## 第三层：给模型写一套什么时候用 / 什么时候别用 agent 的操作规范

这部分很像“给 LLM 的 SOP”。

### 核心 shared prompt

`getPrompt()` 先构建一个 shared core，大意是：

- AgentTool 可以 launch a new agent
- 每个 agent type 有不同能力和工具面
- 当前有哪些 agent
- 指定 `subagent_type` 怎么走，fork 模式怎么走

这个 shared 部分，是所有模式都要有的底板。

### 非 coordinator 模式会再加一大堆 usage notes

这部分才是真正的“操作手册”。

比如它会明确告诉模型：

- 总是写简短 description
- significant work 完成后可以让 agent 回结果
- 结果不会自动暴露给用户，需要主 agent 自己转述
- background agent 不要轮询，不要 sleep
- agent 输出一般可被信任
- 要明确告诉 agent 是 research 还是 implementation
- 用户说 parallel 时，必须单消息多 tool calls
- 可以用 `isolation: "worktree"`
- ant 环境还可以 remote isolation

这些内容其实已经不是“介绍工具”，而是在约束模型行为。

### 还有一段 When NOT to use

在非 fork 模式下，它还会明确写：

- 如果只是读一个文件，优先 `Read`
- 如果只是找类定义或关键词，优先 `Glob/Grep` 或等价搜索
- 如果只在 2-3 个文件里搜代码，不要上 AgentTool

这点很值。

说明官方知道 agent 很强，但也很贵，所以得主动防止模型把 agent 用成：

> 一个替代所有基础工具的重锤。

---

## 第四层：fork 模式不是只改 schema，而是整套说明书都会改写

这一段是 `prompt.ts` 和 `forkSubagent.ts` 接得最紧的地方。

当：

- `isForkSubagentEnabled()`

为真时，`getPrompt()` 不只是把 `subagent_type` 变成可选，而是整段说明都会切换。

### 它会插入一整段 `When to fork`

里面核心在讲：

- 什么场景适合 fork
- fork 适合 research，也适合稍复杂 implementation
- fork 很便宜，因为共享 prompt cache
- 不要给 fork 指定 model
- 给 fork 起短 name
- 不要偷看 output_file
- 不要在 fork 结果没回来前瞎猜结果

这一段其实是在教模型：

> fork 不是普通 subagent，而是一种上下文继承、缓存友好的分叉执行方式。

### 连例子都换成 fork-aware 版本

非 fork 模式用的是老式 example：

- greeting-responder
- test-runner

而 fork 模式下会换成更真实的例子：

- ship-readiness audit
- 中途用户追问但 fork 还没回来
- fresh subagent_type agent 要写完整 briefing

这说明官方知道：

> fork 上线之后，连“怎么举例子教模型”这件事都必须一起改。

否则模型只会继续用老世界观理解 AgentTool。

---

## 第五层：最深的一层，其实是在教模型“怎么给 agent 写 prompt”

我觉得这篇里最容易被低估的一段，是：

- `## Writing the prompt`

这段不是在讲 agent 功能，而是在讲：

> 你作为主 agent，如何把任务正确地交给子 agent。

里面有几条非常值：

- fresh agent 没上下文，要像同事刚进门一样 brief 它
- 解释目标和原因
- 说明已经试过什么、排除了什么
- 如果要短回复要明确说
- lookup 给命令，investigation 给问题
- **Never delegate understanding**

最后这句尤其重要。

它明确反对这种 prompt：

- based on your findings, fix the bug
- based on the research, implement it

因为这会把理解和综合责任直接甩给子 agent。

官方更希望主 agent 自己先形成理解，再把：

- 文件路径
- 行号
- 具体变更点

这些具体内容写进 prompt。

这一段我觉得几乎是 Claude Code 多 agent 使用哲学的明文版。

不是“有 agent 就多派”，而是：

> 主 agent 必须承担理解和调度责任，不能把自己的思考偷懒外包掉。

---

## `prompt.ts` 和前面几篇的关系

这篇放回主线里，位置就很清楚了。

### `loadAgentsDir.ts`
回答：有哪些 agent 定义

### `builtInAgents.ts`
回答：官方默认给哪些 built-in 角色

### `prompt.ts`
回答：怎么把这套 agent 世界讲给模型听，让模型知道何时、为何、如何使用 AgentTool

### `runAgent.ts`
回答：一旦模型真的调了 AgentTool，agent 怎么被装起来

这几篇接起来之后，链路就完整很多了：

> 先有 agent 定义，再有角色集合，再有给模型的使用说明，最后才进入实际运行。

---

## 这篇我最想记住的 5 个点

### 1. `prompt.ts` 是 AgentTool 的使用说明层，不只是字符串模板
它直接参与模型行为约束。

### 2. 它的核心目标，是教模型正确使用 agent 系统
不是介绍 agent 是什么，而是教“怎么用”。

### 3. agent list 注入方式会为了 prompt cache 稳定性而切换
这是这篇最有工程味的点。

### 4. fork 模式上线后，整套使用说明书都跟着改了
不仅是 schema 可选项变了，连例子和世界观都变了。

### 5. `Writing the prompt` 其实是在公开 Claude Code 的多 agent 调度哲学
尤其是那句：不要把理解外包给子 agent。

---

## 我现在对 `prompt.ts` 的一句话定义

> `prompt.ts` 是 Claude Code 的 AgentTool 使用说明层：它把 agent 列表、工具边界、何时调用、何时不要调用、fork 规则、并发建议和任务 brief 规范组织成模型可遵守的操作手册，同时尽量减少动态 agent 列表对 prompt cache 的破坏。

---
