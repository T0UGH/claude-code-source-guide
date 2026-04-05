---
title: Claude Code 源码导读手册第一卷重排 brainstorm 纪要
date: 2026-04-05
tags:
  - Claude Code
  - guidebook
  - brainstorm
  - volume-1
status: draft
---

# Claude Code 源码导读手册第一卷重排 brainstorm 纪要

## 结论先写前面

这轮讨论后，第一卷的定位已经不再是“入门地图卷”或“总览杂糅卷”，而是：

> **第一卷 = Claude Code 的运行时底座卷**

它要回答的不是“Claude Code 大概是什么”，而是：

- tool 是什么
- agent 是怎么装起来的
- skill 是怎么接进 runtime 的
- prompt 最后怎么把这些能力组织成模型可用的说明层

因此第一卷的主顺序正式改成：

> **tool → agent → skill → prompt**

并且门槛设为：

> **中等门槛**

也就是说：
- 不是纯新手导览
- 可以保留技术密度
- 但结构必须非常顺
- 默认读者应该能一路读下来，而不是像研究日志那样跳来跳去

---

## 一、第一卷的新定位

原先的问题在于：第一卷混入了太多“全书入口”“早期总图”“探索期概览”和“并不真正服务 runtime 底座”的内容，导致它看起来像一个大杂烩。

这次重排之后，第一卷只承担一件事：

> **先把 Claude Code 的运行时底座搭清楚。**

这里的“底座”不是泛泛而谈，而是有明确层次：

1. **Tool 层**：Claude Code 的执行原语是什么，工具体系怎么组织，工具是怎么被 runtime 接住的。
2. **Agent 层**：agent 是怎么被调用、装配、定义、分叉和模板化的。
3. **Skill 层**：skill 怎么被定义、发现、接入、执行，并且什么样的 skill 才算真正能进 runtime。
4. **Prompt 层**：前面这些能力最后是怎么被组织成给模型看的说明层。

因此，第一卷不是“全书目录”，也不是“学习路线”，而是一卷真正的结构卷。

---

## 二、第一卷不再承担什么

为了让第一卷变干净，有几类内容明确不再由它承担：

### 1. 不再承担全书入口职责
- `00 学习路线` 删除
- guidebook 首页、阅读路径页、卷导读页会接管入口职责

### 2. 不再保留早期总图型遗留页
- `01 Skill总图` 删除
- `03 Skill / Fork / Agent / Review` 删除

这些文章带有明显的探索期痕迹，不再适合作为手册正文主链的一部分。

### 3. 不再提前进入主循环主链
- `09 从 query 到 tool-call 的连接处` 移到第二卷
- `18 主循环在编排一次完整 agent 回合` 移到第二卷

原因很明确：

> 第一卷讲底座，第二卷才讲 QueryEngine 主链。

如果主循环相关内容过早进入第一卷，会再次把边界打乱。

---

## 三、关于 `00-04` 的处理结论

这组文章逐篇讨论后的结论如下：

- `00 学习路线` → **删除**
- `01 Skill总图` → **删除**
- `02 Skill frontmatter 字段速查` → **保留**
- `03 Skill / Fork / Agent / Review` → **删除**
- `04 环境变量有效性校验` → **删除**

这里最关键的判断是：

> 前五篇里，最后只保留 `02`。

原因不是它历史最早，而是它仍然直接服务于 skill 这一层的运行时接口理解。

换句话说，保留标准不再是“它曾经是系列开头”，而是：

> **它现在对这本手册的结构有没有硬价值。**

---

## 四、Tool 段重排结论

### Tool 段的角色
Tool 段不是单纯列工具名，而是要把 Claude Code 的工具层讲成一个完整段落：

- 先从 tool 入口切入
- 再看 tool 体系结构
- 再进入具体工具原语
- 最后讲 tool 是怎么被 runtime 接住的

### Tool 段保留结果
保留：
- `05 Tool总图与BashTool入口`
- `07 Tool体系总览`
- `08 主循环里tool怎么被接住`
- `10 BashTool不是跑个shell这么简单`
- `11 FileReadTool统一读取入口`
- `12 FileEditTool是受控修改原语`
- `13 FileWriteTool是整文件覆盖原语`
- `14 GrepTool是结构化内容搜索原语`
- `17 ToolSearchTool是工具发现层`

删除：
- `06 Claude Code tools 总览`

这里的关键判断有两个：

### 1. `05` 作为第一卷正文入口保留
虽然第一卷不新增卷首桥接页，但正文入口可以直接从 `05` 起手。

这意味着：
- 第一卷不再从学习路线或概念总图起手
- 而是直接从 tool 层切入 runtime 底座

### 2. `06/07` 二选一，最后保留 `07`
理由是：
- `06` 和 `07` 存在明显重叠
- 第一卷不该“总览叠总览”
- 相比 `tools 总览`，`Tool 体系总览`更贴合“底座卷”的结构定位

### 3. `08` 仍留在第一卷
这一点很重要。

虽然 `08` 已经带有 runtime 接入感，但仍被定义为：

> tool 段的收束篇

也就是：工具不只是有哪些工具，还要讲到这些工具如何真正被运行时接住。

### 4. `09` 移到第二卷
与 `08` 不同，`09` 已明显进入 query 主链，因此归第二卷更合适。

---

## 五、Agent 段重排结论

### Agent 段的角色
Agent 段要回答的是：

- agent 是怎么被调用的
- agent 是怎么被装成运行体的
- agent 是怎么分叉出 worker 的
- agent 定义层长什么样
- 内建 agent 模板起什么作用

### Agent 段保留结果
保留：
- `15 AgentTool不是再开一个agent这么简单`
- `19 runAgent是把agent组装成可运行体的装配线`
- `20 forkSubagent是在同一上下文里分叉出worker`
- `21 loadAgentsDir是agent定义层的总入口`
- `22 builtInAgents是官方内建角色模板总表`

移到第二卷：
- `18 主循环在编排一次完整agent回合`

### 关键判断

#### 1. `15` 放在 agent 段开头
这让第一卷的读感更顺：
- tool 段讲完执行原语
- agent 段一上来就回答 agent 是怎么调用这些东西的

#### 2. `19` 是 agent 段中心轴
`runAgent` 不是主循环篇，而是运行时底座里最关键的 agent 装配文之一。

#### 3. `20` 留在第一卷
`forkSubagent` 虽然动态，但本质上仍是 agent runtime 的结构能力，而不是主循环章节。

#### 4. `21` 和 `22` 都留
这里没有把 `22` 降成补充，因为这轮讨论倾向于：

> built-in agents 不是纯示例，而是帮助读者真正理解 agent 定义层的一部分。

---

## 六、Skill 段重排结论

### Skill 段的角色
这轮讨论里，关于 skill 的判断最明确：

> **skill 线全部保留，因为它比较重要。**

这句话可以直接视为 skill 段的总原则。

因此，第一卷的 skill 段不只是“skill 怎么接进去”，而是完整保留：

- 定义层
- 发现层
- 接口层
- 执行层
- 样板层
- 官方范式层
- 总结层

### Skill 段保留结果
保留：
- `02 Skill frontmatter 字段速查`
- `16 SkillTool是把skill接进runtime的桥`
- `24 loadSkillsDir是skill定义层的总入口`
- `25 SkillTool是skill进入执行层的总入口`
- `26 forkedAgent是skill接入agent执行层的胶水层`
- `27 runAgent是skill接进agent执行层的主干`
- `28 processPromptSlashCommand是skill-inline路径的展开层`
- `29 frontmatter不是注释而是skill的运行时接口`
- `30 什么样的SKILL才是真正能进runtime的好skill`
- `31 skillify是ClaudeCode对好skill写法的官方样板`
- `32 verify是ClaudeCode对验证即运行时观察的官方定义`
- `33 debug是面向当前session的现场诊断skill`
- `34 skills篇结语-skill不是提示词而是能力单元`
- `35 skill的name和description是什么时候让LLM感知到的`
- `36 when_to_use和description哪个对skill发现更关键`
- `37 skill和agent是怎么分工的`

### Skill 段内部逻辑
Skill 段其实可以拆成几层阅读意图：

#### 1. skill 怎么被接进 runtime
- `16`
- `24`
- `25`
- `26`
- `27`
- `28`

#### 2. skill 的接口是什么
- `02`
- `29`

这里 `02` 和 `29` 都保留，但后续需要弱去重：
- `02` 更偏字段层
- `29` 更偏运行时意义层

#### 3. 什么样的 skill 才算成立
- `30`
- `31`
- `32`
- `33`
- `34`

这一串等于是：
- 原则
- 官方样板
- 验证范式
- 调试范式
- skills 收口

#### 4. skill 怎么被模型发现与理解
- `35`
- `36`
- `37`

也就是说，skill 段不仅讲接入，还讲发现和分工。

---

## 七、Prompt 段处理结论

关于 prompt，这轮讨论的结论很稳定：

> `23 prompt是AgentTool给模型看的使用说明层` 放在第一卷最后收尾。

原因是：
- 它既不完全属于 tool
- 也不完全等于 agent
- 更不适合塞进 skill 中段

把它放在第一卷最后，刚好可以承担一个非常自然的收束职责：

> 当前面这些能力层都讲完之后，prompt 负责解释 Claude Code 最后是如何把这些能力翻译成模型可理解的说明层。

---

## 八、第一卷 v2 骨架

按照这轮 brainstorm 的结论，第一卷 v2 可以先定成下面这个骨架。

### Part 1：Tool
- 05 Tool总图与BashTool入口
- 07 Tool体系总览
- 10 BashTool不是跑个shell这么简单
- 11 FileReadTool统一读取入口
- 12 FileEditTool是受控修改原语
- 13 FileWriteTool是整文件覆盖原语
- 14 GrepTool是结构化内容搜索原语
- 17 ToolSearchTool是工具发现层
- 08 主循环里tool怎么被接住

### Part 2：Agent
- 15 AgentTool不是再开一个agent这么简单
- 19 runAgent是把agent组装成可运行体的装配线
- 20 forkSubagent是在同一上下文里分叉出worker
- 21 loadAgentsDir是agent定义层的总入口
- 22 builtInAgents是官方内建角色模板总表

### Part 3：Skill
- 16 SkillTool是把skill接进runtime的桥
- 24 loadSkillsDir是skill定义层的总入口
- 25 SkillTool是skill进入执行层的总入口
- 26 forkedAgent是skill接入agent执行层的胶水层
- 27 runAgent是skill接进agent执行层的主干
- 28 processPromptSlashCommand是skill-inline路径的展开层
- 02 Skill frontmatter 字段速查
- 29 frontmatter不是注释而是skill的运行时接口
- 30 什么样的SKILL才是真正能进runtime的好skill
- 31 skillify是ClaudeCode对好skill写法的官方样板
- 32 verify是ClaudeCode对验证即运行时观察的官方定义
- 33 debug是面向当前session的现场诊断skill
- 34 skills篇结语-skill不是提示词而是能力单元
- 35 skill的name和description是什么时候让LLM感知到的
- 36 when_to_use和description哪个对skill发现更关键
- 37 skill和agent是怎么分工的

### Part 4：Prompt 收尾
- 23 prompt是AgentTool给模型看的使用说明层

---

## 九、从第一卷移出的内容

### 删除
- `00 学习路线`
- `01 Skill总图`
- `03 Skill / Fork / Agent / Review`
- `04 环境变量有效性校验`
- `06 Claude Code tools 总览`

### 移到第二卷
- `09 从query到tool-call的连接处`
- `18 主循环在编排一次完整agent回合`

这一步很关键，因为它重新画清了卷与卷之间的边界：

- 第一卷不再做全书入口
- 第一卷不再提前解释 query 主链
- 第二卷才正式进入 QueryEngine 这条线

---

## 十、还需要后续处理的地方

虽然骨架已经清楚了，但后面仍然需要做两类编辑动作：

### 1. skill 段可能要做弱去重
尤其是：
- `02` 与 `29`
- `16` 与 `25`
- `19` 与 `27`
- `30-34`
- `35-37`

这些并不是要删，而是要进一步明确它们各自的职责，不然第一卷 skill 段会显得过密。

### 2. Tool 段内部顺序还可以再细调
目前 `08` 放在 tool 段末尾是合理的，但具体是否：
- 放在 `17` 之后
- 还是放在 `14` 之后

后续还可以再根据通读手感微调。

### 3. 第一卷可能需要内部小标题化
即使不新增桥接页，也建议在卷导读或卷目录中明确分成：
- Tool
- Agent
- Skill
- Prompt

否则 GitHub Pages 导航看起来可能会过长。

---

## 十一、一句话定义第一卷 v2

如果把这轮 brainstorm 的结论压成一句话，可以写成：

> 第一卷不再是“Claude Code 是什么”的泛入口，而是按 tool → agent → skill → prompt 的顺序，把 Claude Code 的运行时底座重新讲清楚；早期学习路线、总图和无硬价值的探索稿删除，主循环相关内容后移到第二卷，skill 线完整保留，因为它是 Claude Code 底座里比较重要的一层。
