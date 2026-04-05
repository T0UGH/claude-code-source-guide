---
title: Claude Code 源码导读手册旧编号到新结构映射表（v2）
date: 2026-04-05
tags:
  - Claude Code
  - guidebook
  - mapping
  - draft
status: draft
source_files:
  - /Users/haha/workspace/knowledge-vault/03-Research/Claude Code/2026-04-Claude-Code源码导读手册-GitHub项目与GitHub-Pages设计稿.md
  - /Users/haha/workspace/knowledge-vault/03-Research/Claude Code/2026-04-Claude-Code源码导读手册-Phase1内容重组实施计划.md
  - /Users/haha/workspace/knowledge-vault/03-Research/Claude Code/guidebook/2026-04-05-第一卷重排-brainstorm纪要.md
---

# Claude Code 源码导读手册旧编号到新结构映射表（v2）

## 这版和初稿最大的变化

这版不是简单微调，而是根据一次专门的 brainstorm，**重新定义了第一卷**。

现在第一卷不再叫“基本地图”，也不再承担“学习路线”或“全书入口”的职责，而是明确改成：

> **第一卷 = Claude Code 的运行时底座卷**

它的顺序不是按早期写作顺序，也不是按泛概念总览，而是按：

> **tool → agent → skill → prompt**

因此这版 v2 做了几件关键调整：

1. 删除第一卷里一批早期总图/学习路线类文章
2. 把 `09`、`18` 这类已经明显进入主循环的文章挪到第二卷
3. 明确保留完整 skill 线，因为 skill 在 Claude Code 里比较重要
4. 第一卷卷首正文从 `05` 起，不再从 `00` 起

---

## 输入集边界

本映射表的输入集是：
- `cc源码共读笔记/` 下的 **00-90 正文共 91 篇**

明确不计入正文输入集的文件：
- `README.md`
- `目录-00到90完整总表.md`
- 其他索引/目录类文件

---

## 字段说明

- **原编号**：旧系列编号
- **原标题简称**：为了映射表可读性做的短标题
- **新卷**：进入 guidebook 后所属卷
- **卷内顺序**：该卷里的阅读顺序
- **角色**：`主链` / `补充` / `卷末总结` / `删除`
- **处理动作**：`保留` / `轻修` / `弱去重` / `补充阅读` / `移卷` / `删除`
- **备注**：桥接、前置、后续会展开等说明

---

## 卷一：Claude Code 的运行时底座

> 顺序原则：**tool → agent → skill → prompt**

| 原编号 | 原标题简称 | 新卷 | 卷内顺序 | 角色 | 处理动作 | 备注 |
|---|---|---|---:|---|---|---|
| 00 | 学习路线 | 移出主手册 | - | 删除 | 删除 | guidebook 将自行承担入口职责 |
| 01 | Skill 总图 | 移出主手册 | - | 删除 | 删除 | 早期总图型文章，不再保留 |
| 02 | Skill frontmatter 字段速查 | 卷一 | 15 | 主链 | 保留 | skill 接口字段层，放入 skill 段 |
| 03 | Skill / Fork / Agent / Review | 移出主手册 | - | 删除 | 删除 | 早期探索关系图，不再保留 |
| 04 | 环境变量有效性校验 | 移出主手册 | - | 删除 | 删除 | 过细，不进入主手册主链 |
| 05 | Tool 总图与 BashTool 入口 | 卷一 | 1 | 主链 | 轻修 | 第一卷正文入口 |
| 06 | Claude Code tools 总览 | 移出主手册 | - | 删除 | 删除 | 与 07 重叠，二选一后删除 |
| 07 | Tool 体系总览 | 卷一 | 2 | 主链 | 保留 | tool 段总览篇 |
| 08 | 主循环里 tool 怎么被接住 | 卷一 | 9 | 主链 | 轻修 | tool 段收束篇，讲 tool 如何接入 runtime |
| 09 | 从 query 到 tool-call 的连接处 | 卷二 | 1 | 主链 | 移卷 | 已进入 query 主链，移到第二卷 |
| 10 | BashTool 为什么不只是跑 shell | 卷一 | 3 | 主链 | 保留 | tool 核心原语 |
| 11 | FileReadTool | 卷一 | 4 | 主链 | 保留 | tool 核心原语 |
| 12 | FileEditTool | 卷一 | 5 | 主链 | 保留 | tool 核心原语 |
| 13 | FileWriteTool | 卷一 | 6 | 主链 | 保留 | tool 核心原语 |
| 14 | GrepTool | 卷一 | 7 | 主链 | 保留 | tool 核心原语 |
| 15 | AgentTool | 卷一 | 10 | 主链 | 保留 | agent 段开头 |
| 16 | SkillTool | 卷一 | 11 | 主链 | 保留 | skill 进入 runtime 的桥 |
| 17 | ToolSearchTool | 卷一 | 8 | 主链 | 保留 | 工具发现层，仍留在 tool 段 |
| 18 | 主循环完整 agent 回合 | 卷二 | 2 | 主链 | 移卷 | 已进入主循环视角，移到第二卷 |
| 19 | runAgent 装配线 | 卷一 | 12 | 主链 | 保留 | agent 段核心文章 |
| 20 | forkSubagent | 卷一 | 13 | 主链 | 保留 | agent runtime 分叉能力 |
| 21 | loadAgentsDir | 卷一 | 14 | 主链 | 保留 | agent 定义层总入口 |
| 22 | builtInAgents | 卷一 | 15 | 主链 | 保留 | 帮助理解 agent 模板层 |
| 23 | prompt 使用说明层 | 卷一 | 32 | 主链 | 保留 | 第一卷卷尾收束篇 |
| 24 | loadSkillsDir | 卷一 | 16 | 主链 | 保留 | skill 定义层总入口 |
| 25 | SkillTool 执行入口 | 卷一 | 17 | 主链 | 保留 | skill 执行层总入口 |
| 26 | forkedAgent 胶水层 | 卷一 | 18 | 主链 | 保留 | skill 接入 agent 的胶水层 |
| 27 | runAgent 接 skill 主干 | 卷一 | 19 | 主链 | 保留 | skill 接进 agent 执行主干 |
| 28 | processPromptSlashCommand | 卷一 | 20 | 主链 | 保留 | skill-inline 路径展开层 |
| 29 | frontmatter 是运行时接口 | 卷一 | 21 | 主链 | 保留 | skill 接口意义层 |
| 30 | 什么样的 SKILL 才是好 skill | 卷一 | 22 | 主链 | 保留 | skill 成立标准 |
| 31 | skillify | 卷一 | 23 | 主链 | 保留 | 官方样板 |
| 32 | verify | 卷一 | 24 | 主链 | 保留 | 官方验证范式 |
| 33 | debug | 卷一 | 25 | 主链 | 保留 | 官方 debug 范式 |
| 34 | skills 篇结语 | 卷一 | 26 | 主链 | 保留 | skill 段收口 |
| 35 | name 和 description 何时让 LLM 感知到 | 卷一 | 27 | 主链 | 保留 | skill 发现机制 |
| 36 | when_to_use 和 description 哪个更关键 | 卷一 | 28 | 主链 | 保留 | 继续解释发现机制 |
| 37 | skill 和 agent 怎么分工 | 卷一 | 29 | 主链 | 保留 | skill 段后部的分工澄清 |

### 卷一分段视图

#### Tool
- 05
- 07
- 10
- 11
- 12
- 13
- 14
- 17
- 08

#### Agent
- 15
- 19
- 20
- 21
- 22

#### Skill
- 16
- 24
- 25
- 26
- 27
- 28
- 02
- 29
- 30
- 31
- 32
- 33
- 34
- 35
- 36
- 37

#### Prompt
- 23

---

## 卷二：一条请求是怎么跑完整个系统的

| 原编号 | 原标题简称 | 新卷 | 卷内顺序 | 角色 | 处理动作 | 备注 |
|---|---|---|---:|---|---|---|
| 09 | 从 query 到 tool-call 的连接处 | 卷二 | 1 | 主链 | 移卷 | 从第一卷移入，作为 query 主链前置 |
| 18 | 主循环完整 agent 回合 | 卷二 | 2 | 主链 | 移卷 | 从第一卷移入，补足回合视角 |
| 38 | QueryEngine 总入口 | 卷二 | 3 | 主链 | 保留 | 主链正式起点 |
| 39 | query 主循环 | 卷二 | 4 | 主链 | 保留 | 核心阅读篇 |
| 40 | processUserInput | 卷二 | 5 | 主链 | 保留 | 请求入口分流 |
| 41 | getAttachmentMessages | 卷二 | 6 | 主链 | 保留 | 附件与结构化消息处理 |
| 42 | messages.ts | 卷二 | 7 | 主链 | 保留 | API 请求规范化 |
| 43 | system prompt 和 context 怎么并进请求 | 卷二 | 8 | 主链 | 保留 | prompt 拼装核心 |
| 44 | 旧消息压缩切边投影继续工作 | 卷二 | 9 | 主链 | 轻修 | 标注卷三会展开 |
| 45 | context collapse 为什么是读时投影 | 卷二 | 10 | 主链 | 轻修 | 标注卷三会展开 |
| 46 | 用新会话例子串起 QueryEngine 主链 | 卷二 | 11 | 主链 | 保留 | 作为串联案例 |
| 47 | 用新会话例子通俗解释主链 | 卷二 | 12 | 补充 | 补充阅读 | 更适合作为入门替代读物 |
| 48 | system prompt / 用户上下文 / 系统上下文分别是什么 | 卷二 | 13 | 主链 | 保留 | 主链概念收口 |

---

## 卷三：长上下文与会话恢复

| 原编号 | 原标题简称 | 新卷 | 卷内顺序 | 角色 | 处理动作 | 备注 |
|---|---|---|---:|---|---|---|
| 49 | 主循环术语表 | 卷三 | 1 | 主链 | 轻修 | 作为本卷术语入口 |
| 50 | 主循环时序图版 | 卷三 | 2 | 主链 | 保留 | 结构理解辅助 |
| 51 | 长上下文每轮都重算吗 | 卷三 | 3 | 主链 | 保留 | 进入上下文治理问题 |
| 52 | sessionStorage | 卷三 | 4 | 主链 | 保留 | 会话状态落盘与恢复汇合点 |
| 53 | compact | 卷三 | 5 | 主链 | 保留 | 长会话压缩主机制 |
| 54 | microCompact | 卷三 | 6 | 主链 | 保留 | 另一层治理机制 |
| 55 | compact vs microCompact | 卷三 | 7 | 主链 | 保留 | 两类机制对照 |
| 56 | snip | 卷三 | 8 | 主链 | 保留 | 轻量剪枝层 |
| 57 | cache_edits 与 content replacement | 卷三 | 9 | 主链 | 保留 | 编辑缓存机制 |
| 58 | snip 到底裁了什么 | 卷三 | 10 | 主链 | 保留 | 继续展开 snip |
| 59 | 上下文管理四种形态并排例子 | 卷三 | 11 | 主链 | 保留 | 结构对照篇 |
| 60 | 从 59 篇归纳 20 条 agent 层设计 | 卷三 | 12 | 卷末总结 | 保留 | 更适合做本卷总结 |
| 61 | conversationRecovery | 卷三 | 13 | 主链 | 保留 | resume 恢复入口 |
| 62 | sessionRestore | 卷三 | 14 | 主链 | 保留 | 把恢复包接回 runtime |
| 63 | session 线收尾 | 卷三 | 15 | 主链 | 保留 | 本卷收口 |

---

## 卷四：外部能力和扩展点是怎么接进来的

| 原编号 | 原标题简称 | 新卷 | 卷内顺序 | 角色 | 处理动作 | 备注 |
|---|---|---|---:|---|---|---|
| 64 | MCP 接入 runtime | 卷四 | 1 | 主链 | 保留 | 外部能力主线开始 |
| 65 | MCPTool 调用链 | 卷四 | 2 | 主链 | 保留 | 外部 tool 包装调用 |
| 66 | CLI + skill 为什么常比铺太多 MCP 更实用 | 卷四 | 3 | 主链 | 保留 | 能力边界判断 |
| 67 | MCP 认证状态机 | 卷四 | 4 | 主链 | 保留 | needs-auth 是正式能力层 |
| 68 | MCP 权限边界 | 卷四 | 5 | 主链 | 保留 | 外部能力统一闸门 |
| 69 | hooks 总入口 | 卷四 | 6 | 主链 | 保留 | hooks 主线开始 |
| 70 | PreToolUse 与 PostToolUse hooks | 卷四 | 7 | 主链 | 保留 | 工具执行钩子 |
| 71 | SessionStart 与 Stop hooks | 卷四 | 8 | 主链 | 保留 | 生命周期钩子 |
| 72 | hooks 收尾 | 卷四 | 9 | 主链 | 保留 | hooks 本质收口 |
| 73 | plugin 能力面 | 卷四 | 10 | 主链 | 保留 | plugin 主线开始 |
| 74 | pluginLoader | 卷四 | 11 | 主链 | 保留 | 插件装配层 |
| 75 | plugin 各能力接入面 | 卷四 | 12 | 主链 | 保留 | 插件挂接结构 |
| 76 | validate / schema / policy | 卷四 | 13 | 主链 | 保留 | plugin 不是松散目录 |
| 77 | plugin CLI / install / marketplace | 卷四 | 14 | 主链 | 保留 | 生态对象化 |
| 78 | plugin 收口 | 卷四 | 15 | 主链 | 保留 | 卷四收尾 |

---

## 卷五：执行边界与安全控制

| 原编号 | 原标题简称 | 新卷 | 卷内顺序 | 角色 | 处理动作 | 备注 |
|---|---|---|---:|---|---|---|
| 79 | 权限系统总图 | 卷五 | 1 | 主链 | 保留 | 卷五起点 |
| 80 | tool execution 和 permission decision | 卷五 | 2 | 主链 | 保留 | 权限主链 |
| 81 | BashTool 权限判断 | 卷五 | 3 | 主链 | 保留 | 复杂权限案例 |
| 82 | 路径权限 / allow-deny / settings | 卷五 | 4 | 主链 | 保留 | 长期授权体系 |
| 83 | policy limits | 卷五 | 5 | 主链 | 保留 | 组织级策略闸门 |
| 84 | 权限系统收口 | 卷五 | 6 | 主链 | 保留 | 卷五收尾 |

---

## 卷六：多 agent 协作运行时

| 原编号 | 原标题简称 | 新卷 | 卷内顺序 | 角色 | 处理动作 | 备注 |
|---|---|---|---:|---|---|---|
| 85 | team / teammate runtime 在系统中的位置 | 卷六 | 1 | 主链 | 保留 | 卷六起点 |
| 86 | TeamCreate / TeamDelete | 卷六 | 2 | 主链 | 保留 | team 生命周期 |
| 87 | InProcessTeammateTask | 卷六 | 3 | 主链 | 保留 | teammate 真正运行层 |
| 88 | mailbox + idle / shutdown 协议 | 卷六 | 4 | 主链 | 保留 | 通信和收尾协议 |
| 89 | Local / Remote / Teammate 边界 | 卷六 | 5 | 主链 | 保留 | 能力边界澄清 |
| 90 | team 系统本质上是 swarm | 卷六 | 6 | 主链 | 保留 | 全书收尾候选 |

---

## 需桥接说明的文章清单（v2）

这些文章建议在篇首补 80-180 字导语，明确它在整套手册中的位置。

- 05 Tool 总图与 BashTool 入口
- 08 主循环里 tool 怎么被接住
- 15 AgentTool
- 16 SkillTool
- 23 prompt 使用说明层
- 34 skills 篇结语
- 37 skill 和 agent 怎么分工
- 38 QueryEngine 总入口
- 44 旧消息压缩切边投影继续工作
- 45 context collapse 为什么是读时投影
- 49 主循环术语表
- 60 从 59 篇归纳 20 条 agent 层设计
- 79 权限系统总图
- 85 team / teammate runtime 在系统中的位置
- 90 team 系统本质上是 swarm

---

## 需弱去重的文章清单（v2）

这些文章不建议删篇，但建议在导语里明确分工，必要时删掉重复开场。

- 02 Skill frontmatter 字段速查
- 16 SkillTool
- 19 runAgent 装配线
- 25 SkillTool 执行入口
- 27 runAgent 接 skill 主干
- 29 frontmatter 是运行时接口
- 30 什么样的 SKILL 才是好 skill
- 31 skillify
- 32 verify
- 33 debug
- 35 name 和 description 何时让 LLM 感知到
- 36 when_to_use 和 description 哪个更关键
- 46 用新会话例子串起 QueryEngine 主链
- 47 用新会话例子通俗解释 QueryEngine 主链
- 53 compact
- 54 microCompact
- 55 compact vs microCompact
- 56 snip
- 58 snip 到底裁了什么

---

## 角色统计（v2）

### 删除
- 00
- 01
- 03
- 04
- 06

### 移到第二卷
- 09
- 18

### 主链
- 卷一：28 篇（含完整 skill 线与 prompt 收尾）
- 卷二：12 篇主链 + 1 篇补充
- 卷三：14 篇 + 1 篇卷末总结
- 卷四：15 篇
- 卷五：6 篇
- 卷六：6 篇

合计：
- 输入集 91 篇
- 删除 5 篇
- 移卷 2 篇
- 其余已完成归属

---

## 当前判断

这版 v2 已经把第一卷从“杂乱的前置集合”改成了一个结构更清楚的运行时底座卷。

它接下来可以直接支撑两项工作：

1. 写 **卷一导读页**
2. 按这套结构继续整理 **guidebook 首页** 和 **阅读路径页**

如果继续往下推进，最顺的顺序是：

- 先写 **卷一导读页**
- 再更新 **guidebook 首页**
- 再补 **阅读路径页**
- 最后回头做卷一内部弱去重

---

## 后续待确认项

1. 卷一 skill 段是否要在目录层继续细分成“接入 / 接口 / 范式 / 发现机制”四个小层
2. `02` 和 `29` 的边界怎么写得更清楚
3. `16` 和 `25` 的边界怎么写得更清楚
4. `19` 和 `27` 的边界怎么写得更清楚
5. 卷二是否要以 `09` 还是 `38` 作为更正式的正文起点

这几项不会阻碍继续推进卷一导读页。