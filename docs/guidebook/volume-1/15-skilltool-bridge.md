---
title: 卷一 15｜SkillTool 是把 skill 接进 runtime 的桥
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 15｜SkillTool 是把 skill 接进 runtime 的桥

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Skill 1/16
- **上一篇**：[上一篇：builtInAgents 是官方内建角色模板总表](./14-builtinagents.md)
- **下一篇**：[下一篇：loadSkillsDir 是 skill 定义层的总入口](./16-loadskillsdir.md)

skill 段从这里正式开始。这一篇先不展开 skill 的定义细节，也不进入具体写法，而是先看一个更靠中间层的问题：skill 这类能力单元，究竟是怎么被接进 Claude Code runtime 的。

---

## 这篇看什么

这篇主要看的是：

- `src/tools/SkillTool/SkillTool.ts`

这一篇只回答一个核心问题：**SkillTool 为什么是 bridge，而不是普通执行器。**

如果前面那些工具大多是在做具体动作——读、写、改、搜、跑命令、拉 agent——那 SkillTool 的位置不一样。它不直接完成某项业务动作，而是在做一件更中层的事：

> 把 Claude Code 的 skill / slash-command 体系，接进统一的 tool runtime。

更准确地说，这篇关心的是 **skill 在系统里的桥位**：它连的是 command、权限、inline / fork 分流和 agent 执行链。至于“什么算 skill、skill 从哪里来”，留到下一篇 `loadSkillsDir` 再讲；“已经定义好的 skill 如何真正进入执行层”，则放到再下一篇继续展开。

---

## 先给结论

### 1. SkillTool 的核心不是“做事”，而是“把方法模块接进系统”

这个工具的输入非常简单：

- `skill`
- `args`

从 schema 看，它几乎像个薄壳。

但它背后连的是一整套东西：

- skills / commands 发现
- MCP skills 合并
- frontmatter 解析
- allowed tools
- model override
- inline 执行
- forked 执行
- skill usage telemetry
- skill progress 回传

所以它真正承担的是：

> 让 skill 从“文档 / 提示词资产”变成 runtime 里可调用的能力单元。

### 2. SkillTool 同时支持 inline skill 和 forked skill

这是它最重要的结构点。

从 output schema 就能直接看出来，它不是一种执行模式：

- `status: inline`
- `status: forked`

也就是说，Claude Code 里的 skill 并不都是“展开成提示词塞回当前会话”这么简单。

有些 skill 可以 inline，直接在当前 agent 上下文里展开；有些 skill 则会 fork 到独立子 agent 去跑。

这点非常关键。

因为它说明 Claude Code 对 skill 的理解不是“都是 prompt 宏”，而是：

> 有些 skill 是当前 agent 的方法提示，有些 skill 是独立工作流，需要隔离执行。

### 3. SkillTool 其实把 command 和 skill 这两个世界接到了一起

代码里有几个很关键的信号：

- `getCommands()`
- `findCommand()`
- `PromptCommand`
- `builtInCommandNames()`

这说明在 Claude Code 内部，skill 并不是完全独立的一套对象模型，而是和 command 体系高度复用。

也就是说，SkillTool 背后接的其实是：

- slash command
- prompt command
- 本地 / bundled skill
- MCP skill

这些能力最后在这里汇总成一种统一调用入口。

所以如果你问 SkillTool 是什么，我会先回答：

> 它是 slash-command skill 的 runtime 适配器。

---

## 它最有意思的几块设计

### 1. `getAllCommands()` 会把本地 skills 和 MCP skills 合起来

这个函数很关键。

注释已经说得很明确：

- `getCommands()` 只返回 local / bundled skills
- SkillTool 还要把 MCP skills 补进来

于是它会：

1. 从 AppState 里拿 MCP commands
2. 只保留真正的 MCP skills
3. 再和本地 commands 合并
4. 用 `uniqBy(..., 'name')` 去重

这说明 SkillTool 不只是本地 slash command 的执行器。

它还把“通过 MCP 暴露出来的 skill 能力”也拉进了统一入口。

这一步其实挺有架构意义的：

> skill 来源可以很多，但调用入口最好只有一个。

### 2. 它支持 forked skill，而且是通过 AgentTool/runAgent 接上的

文件里有一个很核心的函数：

- `executeForkedSkill(...)`

这里面最关键的不是细节，而是方向：

- skill 不是直接在当前会话里跑
- 而是可以准备一套 forked command context
- 然后调用 `runAgent(...)`
- 让一个独立子 agent 执行它

这说明 SkillTool 和 AgentTool 在架构上是连着的。

也就是说：

- AgentTool：显式委派任务给 agent
- SkillTool：某些 skill 本身就会隐式走 agent 执行路径

这非常有意思。

因为它说明 skill 并不总是“提示词增强”，有些 skill 本身已经是一种 agent workflow。

### 3. forked skill 不是只跑结果，还会回传 progress

在 `executeForkedSkill(...)` 里，`runAgent(...)` 返回的 message 会被收集起来。

如果消息里带：

- `tool_use`
- `tool_result`

它还会通过 `onProgress(...)` 往外报告 `skill_progress`。

这意味着 forked skill 在体验上，不是黑盒跑完给你一个结果，而是：

> 它可以把子 agent 里的工具调用过程重新反馈给上层。

这点很值。

如果没有这层，skill 一旦 fork，就会变成“看不见的异步魔法”。现在这种设计让 skill 仍然保持了可观察性。

### 4. SkillTool 会记录“这个 skill 被调用过”

代码里明显有这类逻辑：

- `addInvokedSkill(...)`
- `recordSkillUsage(...)`
- 一堆 `tengu_skill_tool_invocation` 相关 telemetry

这说明 SkillTool 在 Claude Code 里不只是执行器，还是 skill 使用追踪点。

这很合理。

因为 skill 是否真的被用、在哪些场景被用、是 inline 还是 forked、被调用效果如何，这些都会影响：

- suggestions
- coaching
- analytics
- 后续 skill 发现与推荐

也就是说，SkillTool 其实站在 skill 生态的交叉点上。

### 5. 它很在意 skill 的来源和身份

`executeForkedSkill(...)` 里有一整段逻辑在区分：

- built-in
- official marketplace
- bundled
- custom
- third-party plugin

而且这些差异还会进 telemetry。

这说明 Claude Code 并没有把所有 skill 当成一类“匿名 prompt”。

它在 runtime 里很清楚：

- 这个 skill 从哪来
- 是不是官方的
- 是不是 marketplace 里的
- 是不是插件带来的

这背后其实是在给 skill 生态做身份层和信任层。

---

## SkillTool 和 ToolSearchTool / AgentTool 的关系

我觉得这三个工具应该放在一起理解。

### ToolSearchTool
负责：
- 当工具太多时，先帮你找“该用哪个”

### SkillTool
负责：
- 当某个方法论已经被封装成 skill 时，把它接进执行系统

### AgentTool
负责：
- 当任务应该委派给另一个 agent 时，负责 spawn / route / lifecycle

也就是说：

- ToolSearchTool 更像发现层
- SkillTool 更像方法层
- AgentTool 更像委派层

而 SkillTool 正好站在中间：

> skill 既可能只是当前 agent 的方法提示，也可能进一步触发 agent 级执行。

这就是它最有意思的地方。

---

## 它和普通 tool 最大的不同

BashTool、FileReadTool、GrepTool 这些工具，调用之后发生的事情都比较直接：

- 跑命令
- 读文件
- 搜内容

SkillTool 不一样。

它本身不直接提供底层动作能力，而是：

- 找到一个 command / skill
- 解析它
- 决定 inline 还是 fork
- 可能重组上下文
- 可能触发子 agent
- 再把结果包装回 tool result

所以它不像“动作原语”，更像：

> 方法原语。

这个词我觉得挺适合它。

它让 Claude Code 能把一些高阶工作流，不是硬编码在 system prompt 里，而是变成一个可以被调用、被追踪、被路由的单元。

---

## 我对 SkillTool 的整体判断

如果让我现在先给 SkillTool 下一个定义，我会这么说：

> SkillTool 是 Claude Code 的方法调用原语。它把 slash-command / skill 体系接进统一 runtime，让 skill 不再只是静态提示词，而是可 inline、可 fork、可追踪、可集成到 agent 执行链里的能力单元。

这点非常重要。

因为如果没有 SkillTool，skill 体系很容易停留在“提示词资产库”层面。

但有了它以后，skill 就能真正进入运行时：

- 被调用
- 被授权
- 被观察
- 被统计
- 被委派

这就完全不是一个量级了。

---

## 这一篇我最想记住的一句话

> SkillTool 的价值不在于“执行一个 skill 文本”，而在于它把 skill 从静态方法文档变成了 Claude Code runtime 里可调用、可分流、可追踪的能力单元。

---

## 下一步最顺怎么接

我觉得后面有两条自然路线。

### 路线 A：接 `ToolSearchTool`

这样可以把“发现工具 / 方法”和“真正调用 skill”这两层连起来看。

### 路线 B：接 `runAgent.ts`

因为 forked skill 已经明显连到 `runAgent(...)`，顺着这条线往下能看到更完整的 agent 执行链。

如果按当前阅读顺序，我更建议下一步接 `ToolSearchTool`。因为 SkillTool 正好处在“工具发现”和“agent 委派”之间，先把发现层补上，会更完整。