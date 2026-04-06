---
title: 卷一 27｜skills 篇结语：skill 不是提示词而是能力单元
date: 2026-04-04
tags:
  - Claude Code
  - 源码共读
  - skill
  - summary
  - runtime
source_files:
  - /Users/haha/.openclaw/workspace/cc/src/skills/loadSkillsDir.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/SkillTool.ts
  - /Users/haha/.openclaw/workspace/cc/src/utils/forkedAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processSlashCommand.tsx
  - /Users/haha/.openclaw/workspace/cc/src/utils/frontmatterParser.ts
  - /Users/haha/.openclaw/workspace/cc/src/skills/bundled/skillify.ts
  - /Users/haha/.openclaw/workspace/cc/src/skills/bundled/verify.ts
  - /Users/haha/.openclaw/workspace/cc/src/skills/bundled/debug.ts
status: done
source_url: https://feishu.cn/docx/QVzwdELI5o8XMrx0bDccICECnKc
---

# 卷一 27｜skills 篇结语：skill 不是提示词而是能力单元

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Skill 13/16
- **上一篇**：[上一篇：debug 是面向当前 session 的现场诊断 skill](./26-debug.md)
- **下一篇**：[下一篇：skill 的 name 和 description 是什么时候让 LLM 感知到的](./28-skill-name-description.md)

这一篇是 skill 段的一个明显收口。读到这里，skill 作为能力单元这件事应该已经站稳了。

---

## 这篇看什么

这一轮 skills 篇，看到这里其实已经不再是“又读了几个和 skill 相关的文件”。

真正更重要的是：

> Claude Code 里 skill 这套东西，到底是什么、怎么进 runtime、为什么这样设计、以及什么样的 skill 才算写对了，基本都已经讲清了。

所以这篇不再开新文件，不再补新细节，而是给这一轮 skill 主线做一个正式收尾。

如果只留一句总判断，我现在会写：

> **Claude Code 里的 skill，不是 markdown 提示词，也不是 command 的边角装饰，而是一种被正式接进 runtime 的能力单元。**

我觉得这句话基本可以当作整轮 skills 篇的总纲。

因为一开始最容易犯的错，就是把 skill 理解成：

- 一个 `SKILL.md`
- 一段 frontmatter
- 再加一层 prompt 技巧

但这轮看完之后，这种理解已经完全不够了。

现在更准确的说法应该是：

> skill 是一种先在定义层被编译成结构化 prompt command，再在入口层进入 Tool runtime，随后按 inline 或 fork 两条路径执行，并通过 frontmatter 把权限、模型、上下文、激活条件这些运行时约束一起带进去的能力单元。

这才是 skills 篇真正立住的东西。

---

## 先给主结论

### 1. skills 篇真正讲清的，不是“Claude Code 有哪些技能”，而是“Claude Code 如何把可复用方法压成可运行能力”

我觉得这一轮最值钱的地方，不是枚举了多少个 skill，也不是解释了几个字段。

而是它最后把 skill 的系统地位讲清了：

> skill 不是 prompt 模板库，而是 Claude Code 用来承接“可复用方法”的一层运行时抽象。

也就是说，Claude Code 团队不是想让用户“多写几份提示词”，而是想让：

- 可复用的方法
- 执行边界
- 权限约束
- 激活条件
- 运行路径

都能被压缩进一个系统真正能调用的对象里。

这就是 skill 在 Claude Code 里的真实角色。

### 2. 这轮最大的认知升级，是把心智模型从“skill = markdown”换成了“skill = 结构化 prompt command”

如果只看文件表面，很容易觉得 skill 就是：

- 一个目录
- 里面一个 `SKILL.md`
- 顶部一点 frontmatter
- 正文一段说明

但 `loadSkillsDir.ts` 已经把这个误解拆掉了。

看完之后更准确的说法是：

> skill 最终不是以文档身份进入系统，而是被统一编译成 `type: 'prompt'` 的 `Command`。

这件事太关键了。

因为只要这一步成立，后面很多问题就都顺了：

- frontmatter 为什么不是注释
- skill 为什么能走 Tool runtime
- skill 为什么能带 permissions / model / effort / hooks
- skill 为什么能按 inline / fork 两条路径执行

所以 skills 篇真正的第一块基石，不是哪一个字段，而是这个认知升级。

### 3. skill 写法层最重要的结论，不是“怎么把 prompt 写漂亮”，而是“怎么把能力边界写清楚”

这一轮看到后半段，其实已经不只是 runtime 理解了，而是开始进入写法方法论。

最后真正收住的，不是“好的 prompt 应该更自然”，而是：

> 一个好的 skill，不是写得花，而是它的边界清楚、权限克制、执行路径明确、正文能直接转成稳定动作，并且进入 runtime 后不变形。

这句话我觉得是整个 skills 篇最应该保留下来的写法结论。

---

## 一、这轮 skills 篇，最后立住了一条完整主线

我觉得这轮共读真正搭起来的是一条结构非常完整的主线：

1. **定义层**：skill 到底是什么
2. **入口层**：skill 怎么进入运行时
3. **执行层**：inline / fork 怎么跑
4. **写法层**：SKILL.md 为什么不是文档而是接口
5. **样本层**：官方内置 skill 在示范什么

也就是说，这轮不是零散地看几个文件，而是把 skill 从“文件格式”一路讲到了“系统能力”。

### 这一点为什么重要

因为如果没有这条骨架，读 skill 特别容易陷进两种误区：

#### 误区 1：只记字段
最后会变成：
- `context`
- `paths`
- `hooks`
- `effort`
- `model`

都记住了，但不知道它们怎么接进运行时。

#### 误区 2：只记入口
比如只看 `SkillTool.ts`，会知道 skill 会被调，但不知道：
- 它从哪里来
- 为什么长这样
- 为什么有这些属性
- 为什么会分 inline/fork

而这轮最后真正搭好的，就是一条从定义到执行再到写法的闭环。

---

## 二、第一块基石：skill 不是 markdown，而是结构化 prompt command

skills 篇的第一块基石，肯定是 `loadSkillsDir.ts`。

这一篇真正讲清楚了一件事：

> skill 最终不是被系统当作 markdown 文档处理，而是被统一编译成 `type: 'prompt'` 的 `Command`。

### 这件事意味着什么

意味着 Claude Code 对 skill 的态度不是：

- 再搞一套独立的 skill runtime
- 再发明一套平行的调度体系
- 再让 skill 和 command 并行存在

它选的是更克制的一条路：

> 让 skill 直接复用 command 抽象，成为 prompt command 宇宙的一部分。

这一步非常重要。

因为它直接解释了后面很多现象：

- skill 为什么能被统一查找
- skill 为什么能被 Tool runtime 调用
- skill 为什么能有统一的 permission / model / context 语义
- skill 为什么既能本地加载，也能来自 MCP / remote discovery

也就是说，skill 在 Claude Code 里不是一套孤立小系统，
而是更大 command/runtime 体系里的一个正式分支。

---

## 三、第二块基石：frontmatter 不是 metadata，而是 runtime contract

这一轮之后，我觉得 frontmatter 的地位已经被彻底改写了。

以前很容易把 skill 顶上的字段看成说明头：

- `description`
- `when_to_use`
- `context`
- `agent`
- `hooks`
- `paths`
- `model`
- `effort`
- `allowed-tools`

但从 `frontmatterParser.ts` 到 `loadSkillsDir.ts` 的整条链路看下来，已经很清楚：

> 这些字段不是写给读者看的文档信息，而是写给 runtime 的接口声明。

### 也就是说，写这些字段时，你其实是在声明什么？

- 这个 skill 谁能调
- 它什么时候会出现
- 它走 inline 还是 fork
- 它会不会切 agent
- 它带什么权限边界
- 它会不会改 model / effort
- 它会不会注册 hooks
- 它是不是条件激活 skill

这和“文档头信息”根本不是一个层级。

所以这一轮之后，frontmatter 最准确的定义已经不是 metadata，而是：

> **skill 暴露给系统的 runtime contract。**

---

## 四、SkillTool 让 skill 真正进入运行时，而不是停留在定义层

如果说定义层讲清楚了 skill 是什么，那 `SkillTool.ts` 讲清楚的就是：

> skill 怎么被正式纳入 Claude Code 的执行体系。

这层特别重要，因为它说明 skill 调用不是一种模糊的 prompt 宏展开，而是：

- 有输入校验
- 有权限检查
- 有调用分流
- 有 telemetry
- 有 contextModifier
- 有 tool-use 生命周期绑定

也就是说，skill 在执行层里不再只是：

- “给模型补一段提示”

而是变成：

> **通过 Tool runtime 正式调用的高阶能力单元。**

这一步意义很大。

因为它把 skill 从 prompt engineering 技巧，推进成了系统级能力入口。

---

## 五、skills 有两条执行路径：inline 和 fork

这一轮真正让整条线闭环的，是把 skill 的两条执行路径都讲清楚了。

### 1. inline 路径
- `SkillTool`
- `processPromptSlashCommand`
- `getMessagesForPromptSlashCommand`

这条路径说明：

> inline skill 不是简单回一段 prompt，而是会展开成当前主循环可消费的一组结构化消息，并把权限、模型、effort 等运行信息挂回当前线程。

也就是说，inline skill 的结果不是“文本”，而是：

- metadata message
- main content message
- attachment messages
- command_permissions attachment
- 以及后续 context 影响

### 2. fork 路径
- `SkillTool`
- `forkedAgent`
- `runAgent`

这条路径则说明：

> skill 在某些情况下不只是当前 agent 的一段方法，而会被提升成独立 agent sidechain 去执行。

这里最值钱的不是“能 fork”，而是 Claude Code 把 fork 做成了一种很认真、很工程化的执行链：

- cache-safe 前缀复用
- 子上下文默认隔离
- usage 累积
- transcript 记录
- cleanup 完整

所以这一轮之后，skill 的执行模型已经很清楚了：

> **inline = 在当前线程展开**
> 
> **fork = 交给独立 sidechain 执行**

---

## 六、写法层真正收住的，不是“prompt 怎么写”，而是“能力边界怎么写”

这一轮到后半段，其实已经开始从 runtime 理解，走到写法方法论了。

最后真正沉淀下来的，不是“怎么把 prompt 写得更自然”，而是这几条更硬的判断：

### 1. 能 inline 就别 fork
`context: fork` 不是增强版 skill，而是另一种执行架构。

默认路径应该始终是 inline，
只有当任务确实：
- 自成一体
- token 成本更高
- 适合 worker 独立完成

时，fork 才值得写。

### 2. frontmatter 要像接口声明，不要像愿望清单
尤其这些字段都属于高影响字段：

- `allowed-tools`
- `hooks`
- `model`
- `effort`
- `paths`
- `context`

都应该默认克制。

能不写就不写；真写了，就必须能回答：

> 为什么这个字段一定要改变 runtime 行为？

### 3. 正文不要像说明书，要像 workflow
好的 skill 正文应该给模型：

- 目标
- 边界
- 步骤
- 输出要求
- 例外处理

而不是大段背景、抽象原则和“请认真思考”式空话。

### 4. 每个好 skill 都应该有完成判据
没有完成判据的 skill，模型很容易只交一种“看起来像完成”的结果。

所以 skill 最好总能回答：

> 做到什么，才算这次 skill 真正完成？

这一层我觉得特别关键，因为它把 skill 从“文案写作问题”，真正拉回到了“能力设计问题”。

---

## 七、内置 bundled skills 让整个 skills 篇从机制走向方法论

如果只看 runtime 文件，这轮其实还是在讲系统怎么工作。

真正让它落地的，是后面拆 bundled skills。

### `skillify`
它最值钱的地方，不是“帮你写 skill”，而是：

> 它定义了什么样的流程，才值得被沉淀成 skill。

它让人看到，官方并不是把 skill 当 prompt 模板，而是把它当成：

- 可复用流程
- 可采集输入/步骤/成功标准/约束的能力单元

### `verify`
它最值钱的地方，不是技巧，而是重新定义了：

> 什么才算验证。

它明确把：

- tests
- typecheck
- import-and-call
- 代码阅读

都排除在“验证本身”之外，强调：

> verification = runtime observation + evidence

这是一份非常强的工程价值观文件。

### `debug`
它则展示了另一类 skill 写法：

> 不是静态 `SKILL.md`，而是围绕当前 session 现场动态组装 prompt。

它说明：

- skill 不一定都该写成静态文档
- 有些 skill 的本质就是运行时 prompt assembler

这让 skills 篇的写法样本一下就丰富了起来。

---

## 八、skills 篇最后真正讲清的，是 Claude Code 对 skill 的总体态度

如果把这一整轮再压成一句话，我会写：

> Claude Code 对 skill 的态度，不是“给模型多几段提示词”，而是“把可复用的方法、执行边界和运行时约束，压成一种可以被系统正式调用的能力单元”。

这句话里最重要的其实是三个词：

- **可复用的方法**
- **执行边界**
- **能力单元**

因为这三个词，基本就是 skills 篇全部内容的骨架。

Claude Code 团队最在意的，也不是“让模型更会说”，而是让模型：

- 更可复用
- 更可观察
- 更可验证
- 更少凭空发挥

这其实是一种很强的工程文化，而不只是某几个 prompt 的风格偏好。

---

## 我现在对 skills 篇的最终定义

如果只留一句最短的话，我会留这个：

> Claude Code 的 skill 不是 markdown 模板，而是一套进入 runtime 的能力系统：它先在定义层被编译成结构化 prompt command，再在入口层进入 Tool runtime，随后按 inline 或 fork 两条路径执行，并通过 frontmatter 把权限、模型、上下文、激活条件这些运行时约束一起带进去。

再往前多补一句，就是这轮真正的结论：

> 真正好的 skill，不在于提示词写得多花，而在于它边界清楚、权限克制、路径明确、正文可执行，并且进入系统后仍然稳定不变形。

---

## 这篇最值得记住的几个判断

### 判断 1：skills 篇讲清的不是“有哪些 skill”，而是“skill 作为能力单元如何进入系统”

### 判断 2：最大的认知升级，是把 `skill = markdown` 改成了 `skill = 结构化 prompt command`

### 判断 3：frontmatter 的本质不是 metadata，而是 runtime contract

### 判断 4：SkillTool 让 skill 进入 Tool runtime，skill 从 prompt 技巧升级成系统能力

### 判断 5：skill 的两条执行路径——inline / fork——构成了整套 runtime 运行模型

### 判断 6：写 skill 的关键不是文笔，而是能力边界、权限克制、执行路径和完成判据

### 判断 7：`skillify`、`verify`、`debug` 三个样本，分别把 skill 设计、验证标准和现场诊断的方法论补齐了

---
