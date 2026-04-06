---
title: 卷一 14｜builtInAgents 是官方内建角色模板总表
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
  - agent
  - built-in
source_files:
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/generalPurposeAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/exploreAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/planAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/verificationAgent.ts
  - /Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/built-in/claudeCodeGuideAgent.ts
status: done
source_url: https://feishu.cn/docx/SrAYdyR4Qoj8Eyx7qgCcg5qrnOd
---

# 卷一 14｜builtInAgents 是官方内建角色模板总表

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Agent 5/5
- **上一篇**：[上一篇：loadAgentsDir 是 agent 定义层的总入口](./13-loadagentsdir.md)
- **下一篇**：[下一篇：SkillTool 是把 skill 接进 runtime 的桥](./15-skilltool-bridge.md)

这一篇是 agent 段收口。它不只是列模板，而是帮你看清 Claude Code 怎么组织官方内建角色。

---

## 这篇看什么

前一篇已经把 `loadAgentsDir.ts` 看了，知道了 agent 定义层是怎么统一各种来源的。

那下一步很自然就是：

> Claude Code 官方自己到底内建了哪些 agent？这些角色是怎么切分工的？

这次我主看的是：

- `src/tools/AgentTool/builtInAgents.ts`

以及几个典型 built-in agent：

- `generalPurposeAgent.ts`
- `exploreAgent.ts`
- `planAgent.ts`
- `verificationAgent.ts`
- `claudeCodeGuideAgent.ts`

看完之后，我现在的判断很明确：

> `builtInAgents.ts` 虽然代码不长，但它不是一个普通导出列表，而是 Claude Code 官方内建角色体系的总表。它决定了默认会有哪些 agent 角色进系统，以及哪些角色是按 feature gate、entrypoint、运行环境动态开关的。

如果说 `loadAgentsDir.ts` 解决的是“agent 定义系统怎么统一”，那 `builtInAgents.ts` 解决的就是：

> 官方默认给你配哪几种角色模板，以及在什么情况下给、什么时候不给。

---

## 先给主结论

### 1. built-in agents 不是“为了凑功能”随手加几个 prompt，而是一套明确分工的官方角色模板

从当前代码里能看到的几类核心 built-in agent，大概是：

- `general-purpose`
- `Explore`
- `Plan`
- `verification`
- `claude-code-guide`
- 还有一个 `statusline-setup`

这些角色不是按“职位名”切，而是按：

> 工作模式切。

也就是说，Claude Code 官方在 agent 设计上，优先区分的是：

- 通用执行
- 只读探索
- 只读规划
- 对抗式验证
- 文档/产品说明

这个切法很有意思。它不是“前端 agent / 后端 agent / Python agent”这种语言或领域切分，而是：

> 把不同工作姿态做成不同 agent 模板。

### 2. `builtInAgents.ts` 的核心任务不是定义角色，而是按环境装配角色集合

真正的 prompt 和角色内容分散在各个 `built-in/*.ts` 文件里。

`builtInAgents.ts` 自己干的事更像：

- 判断现在是什么入口
- 哪些 feature gate 开着
- 是否在 non-interactive / SDK / coordinator 等模式下
- 最后返回当前这次会话真正该挂进去的 built-in agent 列表

也就是说，它更像：

> built-in role registry 的装配层。

### 3. built-in agent 最大的价值，不只是 prompt，而是把“角色边界”做成系统级约束

看这几个内建 agent，会发现真正拉开差距的不是语气，而是：

- `tools`
- `disallowedTools`
- `model`
- `background`
- `permissionMode`
- `omitClaudeMd`
- `criticalSystemReminder_EXPERIMENTAL`

这意味着 Claude Code 内建 agent 不是“几段不同文案”，而是：

> 一套带工具边界、成本策略、执行模式和输出约束的角色模板。

---

## 从架构层看，`builtInAgents.ts` 到底在干什么

我觉得可以拆成 4 层。

## 第一层：先决定当前会话要不要 built-in agents

开头有个很现实的判断：

- 如果设置了 `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS`
- 且当前是 non-interactive session
- 那就直接返回空数组

这说明 built-in agent 并不是永远强绑在系统里的。

对 SDK 用户来说，Claude Code 接受一种“我想要 blank slate”的模式。

这个判断很值。

它说明官方内建角色模板默认是有的，但不是不可关闭的宗教。

换句话说：

> Claude Code 允许你把内建角色体系整个拿掉，自己定义自己的 agent 世界。

## 第二层：coordinator mode 会直接换掉整套 built-in agents

这里还有一个更强的分支：

- 如果 `COORDINATOR_MODE` feature 开着
- 且环境变量打开 coordinator mode
- 就去 `workerAgent.js` 拿 coordinator agents

这意味着：

> coordinator mode 不是在现有 built-in agents 上打补丁，而是直接换一套 worker 角色体系。

这个点非常重要。

因为它说明官方知道：

- 普通 subagent 世界观
- coordinator 世界观

不是一个小开关关系，而是角色系统本身就不同。

所以 `builtInAgents.ts` 的职责不只是“返回数组”，而是在决定：

> 当前到底使用哪一套官方角色宇宙。

## 第三层：built-in 列表本身是动态的，不是固定全量

默认一定会放进去的只有：

- `GENERAL_PURPOSE_AGENT`
- `STATUSLINE_SETUP_AGENT`

然后再按条件加：

- `Explore`
- `Plan`
- `claude-code-guide`
- `verification`

### Explore / Plan 不是永远开

它们受：

- `BUILTIN_EXPLORE_PLAN_AGENTS`
- GrowthBook gate `tengu_amber_stoat`

控制。

这说明即便是很核心的 built-in 角色，也还在被实验、度量和灰度控制。

### Claude Code Guide 只在非 SDK 入口开放

这一点也很合理。

如果当前入口不是：

- `sdk-ts`
- `sdk-py`
- `sdk-cli`

才会加上 `claude-code-guide`。

说明这个 agent 更偏面向真实 Claude Code 产品使用者，而不是给 SDK 内嵌场景准备的。

### verification 也受单独 feature gate 控制

- `VERIFICATION_AGENT`
- `tengu_hive_evidence`

都要满足。

这说明 verification 虽然看起来已经很成熟，但在官方这里仍然是一个被谨慎放量的角色。

所以整段代码真正表达的是：

> built-in agents 不是固定菜单，而是一组会随产品模式和实验状态变化的官方角色包。

---

## 这几类 built-in agent，到底怎么分工

这是这篇最值得记的部分。

## 1. `general-purpose`：默认执行 worker

这个 agent 很像 Claude Code 的默认通用工兵。

它的特点很明确：

- `tools: ['*']`
- 没显式限制工具
- model 没写死，默认走子 agent 默认模型
- prompt 重点是：搜索、分析、多步任务、别半途而废

它给人的感觉不是“专家”，而是：

> 一个默认靠谱、覆盖面最宽的通用执行体。

而且它的 prompt 里有个细节我挺喜欢：

- 不要为了好看去 gold-plate
- 但也不要把任务留半截

这句很 Claude Code。它希望这个默认 worker：

- 不过度设计
- 也不偷懒

## 2. `Explore`：快速只读搜索 agent

`Explore` 很有辨识度。

它本质上是个：

> 高速、只读、偏搜索型的代码探索 agent。

它的设计重点不是“会找代码”，而是把边界钉得特别死：

- 禁 `AgentTool`
- 禁 `FileEdit`
- 禁 `FileWrite`
- 禁 `NotebookEdit`
- 禁 `ExitPlanMode`
- 强调只读 Bash
- 明确禁止任何写文件、副作用命令

还有两个很关键的设定：

- `omitClaudeMd: true`
- 外部用户默认 `haiku`，内部环境更偏 inherit

这两个设定一起看，你就能看出官方心里给 Explore 的定位：

> 它是一个快、轻、读多写零的搜索 worker。

不是策略 agent，也不是执行 agent。

## 3. `Plan`：只读架构规划 agent

`Plan` 和 `Explore` 很像，但又不是同一个东西。

它延续了很多只读约束：

- 禁写
- 禁 agent 继续扩散
- 只做 read-only exploration

但它把任务目标换成了：

- 理解需求
- 找代码路径
- 做设计方案
- 列 implementation critical files

所以我会把它理解成：

> Explore 负责找，Plan 负责想。

它们的区别不是有没有搜索能力，而是最后输出什么。

Explore 要的是“我发现了什么”。

Plan 要的是“基于这些发现，我建议怎么做”。

这说明 Claude Code 官方在定义角色时，已经有了非常明确的工作流拆分：

- 搜索
- 规划

不是一股脑塞给一个大 agent。

## 4. `verification`：对抗式验证 agent

这个 agent 可能是几类 built-in 里性格最强的一种。

它的 prompt 几乎是在反训练模型那种“看起来差不多就给过”的本能。

最核心的定位一句话就够：

> 你的工作不是确认实现能用，而是试着把它弄坏。

它的几个关键特征非常明显：

- `background: true`
- `color: 'red'`
- 只读项目目录，但允许在 `/tmp` 写临时测试脚本
- 强制跑命令、贴输出、给 PASS/FAIL/PARTIAL
- `criticalSystemReminder_EXPERIMENTAL` 再加一道硬提醒

这说明 verification agent 已经不是普通提示词强化，而是：

> 试图把“验证人格”做成一个系统级角色。

而且它和 Explore / Plan 最大的不同，是它不是“找信息”，也不是“做设计”，而是：

> 主动找失败证据。

这个角色在 Claude Code 体系里很重要，因为它开始补 LLM 最容易失真的那一段：

- 过度相信实现
- 不愿意真跑验证
- 容易被 happy path 诱导

## 5. `claude-code-guide`：文档/产品说明 agent

这个 agent 很像一个官方产品顾问。

它的职责不是读仓库做实现，而是帮用户回答：

- Claude Code 怎么用
- Claude Agent SDK 怎么用
- Claude API 怎么用

它会主动用：

- `WebFetch`
- `WebSearch`
- 本地搜索工具

去查官方 docs map、用户配置、已装的 skill / agent / MCP server。

最有意思的是它的 system prompt 是动态的，会把这些上下文拼进去：

- custom skills
- custom agents
- MCP servers
- plugin commands
- 用户 settings.json

所以这个 agent 不是单纯“会看文档”，而是：

> 带着用户当前环境状态去回答 Claude 产品使用问题。

这和前面几个“代码工作流 agent”又完全不是一个方向。

---

## built-in agents 真正体现出来的，不是角色名字，而是角色边界设计

我觉得这篇最值得记的，不是哪几个 agent 名字，而是官方到底怎么切角色边界。

大致能看到这样一套分层：

### 通用执行层
- `general-purpose`

### 只读探索层
- `Explore`
- `Plan`

### 验证/质控层
- `verification`

### 产品知识层
- `claude-code-guide`

这套分层说明 Claude Code 的 built-in agent 体系不是“专家库”，而是：

> 把不同工作模式做成不同受控执行模板。

这和很多人想象中的“多 agent = 多身份人格”不太一样。

在这里，官方更在意的是：

- 你能不能写
- 你能不能继续派人
- 你该不该快
- 你输出是报告、计划还是判决
- 你默认前台跑还是后台跑

这才是真正的角色差异。

---

## `builtInAgents.ts` 和前一篇 `loadAgentsDir.ts` 的关系

这两篇接起来看很顺。

### `loadAgentsDir.ts`
回答的是：
- agent 定义系统怎么统一
- 多来源定义怎么汇总
- 覆盖优先级怎么裁决

### `builtInAgents.ts`
回答的是：
- 官方默认内建哪些 agent
- 哪些 built-in 会因为 feature / 环境被动态开关
- 官方到底怎么设计角色模板

所以这篇其实是上一篇的一个具体展开：

> 上一篇讲“定义系统”，这一篇讲“官方默认定义了什么”。

---

## 这篇我最想记住的 5 个点

### 1. `builtInAgents.ts` 不是死列表，而是 built-in 角色装配器
它按环境和 gate 决定最终挂哪些官方角色。

### 2. 官方内建 agent 是按工作模式切的，不是按技术栈切的
这点非常关键。

### 3. 角色差异主要体现在系统约束，不只是在 prompt 文案
尤其是 tools、background、model、permission、omitClaudeMd 这些位。

### 4. `verification` 说明官方已经开始把“对抗式验证人格”产品化
这不是普通的“再测一下”。

### 5. `claude-code-guide` 说明 built-in agent 不只服务代码执行，也服务产品使用理解
built-in agent 体系比“写代码助手”要宽得多。

---

## 我现在对 `builtInAgents.ts` 的一句话定义

> `builtInAgents.ts` 是 Claude Code 官方内建角色模板的装配表：它根据 feature gate、入口类型和运行环境，决定当前会话应加载哪些 built-in agents，并把通用执行、只读探索、规划、验证和产品说明这些工作模式组织成默认角色体系。

---
