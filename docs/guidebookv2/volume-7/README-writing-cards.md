---
title: 卷七写作卡片
status: draft
updated: 2026-04-09
---

# 卷七写作卡片

> 用途：作为新版卷七（命令、工作流与产品层整合）的证据作战卡。

## 一、卷七当前结构总览

当前确定：

- 合计：**8 篇**

顺序固定为：

> **控制层总起 → 命令入口 → 入口接入 runtime → interface → workflow control layer → 边界收口 → 产品形态 → 卷尾总收束**

## 二、卷七硬约束

1. 每篇至少 1 张 mermaid 主图。
2. 每篇必须写明旧文章素材锚点。
3. 每篇必须写明必读源码文件。
4. 每篇必须给出一条主证据链。
5. 每篇必须写明“不能空讲的硬货”。
6. 没有主证据链的卡片，不允许派给 agent。
7. 源码证据优先于方法论包装。
8. 禁止把卷七写成命令索引、产品宣传文或全书抒情结尾。

## 三、卷七分组总卡

### 3.1 总起 / 入口组（01-03）
- 解决什么：控制层为什么存在，命令入口如何成立并接进 runtime。
- 最容易跑偏成什么：快捷方式说明文、命令大全、UI 功能介绍。

### 3.2 interface / workflow / 边界组（04-06）
- 解决什么：runtime interface、workflow control layer、四者边界如何成立。
- 最容易跑偏成什么：字段手册、工作流清单、术语对照表。

### 3.3 产品形态 / 收束组（07-08）
- 解决什么：Claude Code 为什么会长成今天这个产品，卷七如何总收束。
- 最容易跑偏成什么：营销文、愿景文、全书哲学总结。

## 四、单篇证据作战卡

## 01｜为什么 Claude Code 最终一定会长出一层控制层
- 这篇主问题：为什么卷六之后还不能结束，系统还必须继续长出控制层。
- 必须回收的旧文章：
  - `docs/guidebookv2/volume-6/07-why-claude-code-team-is-a-swarm.md`
- 必读源码文件：
  - `cc/src/commands/`
  - `cc/src/` 中命令入口相关链路
- 主证据链：对象层、协作层已经成立 → 用户入口、interface、workflow 仍未被统一解释 → 控制层成为必要结构。
- 必须有的 mermaid 主图：从对象层 / 协作层到控制层的分层图。
- 不能空讲的硬货：必须明确“控制层”到底多出来哪一层责任。
- 禁止偷吃的相邻篇职责：不提前展开 slash commands / workflow 正文。

## 02｜slash commands / prompt commands 为什么不是普通快捷方式
- 这篇主问题：为什么 command 不是普通快捷方式，而是正式用户入口。
- 必须回收的旧文章：
  - 相关旧 guidebook 中命令 / command 文章（待后续补精确锚点）
- 必读源码文件：
  - `cc/src/commands/`
- 主证据链：command 不是 UI 便利层 → 它决定用户如何进入 runtime。
- 必须有的 mermaid 主图：用户输入 → command 入口 → runtime 的入口图。
- 不能空讲的硬货：必须说明 command 为什么属于系统入口层。
- 禁止偷吃的相邻篇职责：不讲完整接入链，不讲 workflow control layer。

## 03｜命令入口是怎样接进 runtime 的
- 这篇主问题：命令入口怎样从用户入口接进 runtime。
- 必须回收的旧文章：
  - 相关旧 guidebook 中 command runtime 文章（待补）
- 必读源码文件：
  - `cc/src/commands/`
  - 命令入口接 runtime 的相关文件
- 主证据链：命令被识别 → 进入主链 → 改变当前 runtime 行为。
- 必须有的 mermaid 主图：命令入口接入 runtime 主链图。
- 不能空讲的硬货：至少讲一条命令如何进入运行主链。
- 禁止偷吃的相邻篇职责：不把 interface 层讲完。

## 04｜skill frontmatter / command interface 为什么是运行时接口，不只是元数据
- 这篇主问题：为什么 frontmatter / interface 属于 runtime interface，而不是附属说明。
- 必须回收的旧文章：
  - 卷五相关 frontmatter / skill 旧文
- 必读源码文件：
  - `cc/src/skills/`
  - `cc/src/commands/`
- 主证据链：声明式字段会进入运行语义 → frontmatter / interface 是运行时接口。
- 必须有的 mermaid 主图：元数据 vs runtime interface 对比图。
- 不能空讲的硬货：必须压出至少一条字段进入运行语义的链。
- 禁止偷吃的相邻篇职责：不写成字段手册，不讲 workflow 总体。

## 05｜工作流控制层是怎样在 Claude Code 里成立的
- 这篇主问题：verify / debug / plan / orchestration 为什么不是散功能，而是 workflow control layer。
- 必须回收的旧文章：
  - 相关 verify / debug / plan 旧文（待补）
- 必读源码文件：
  - workflow / orchestration 相关文件（待补精确锚点）
- 主证据链：多个控制动作不是并列功能 → 它们共同构成 workflow control layer。
- 必须有的 mermaid 主图：workflow control layer 结构图。
- 不能空讲的硬货：必须说明“控制动作”和“执行动作”的差异。
- 禁止偷吃的相邻篇职责：不把四者边界总收口提前讲完。

## 06｜command、tool、skill、agent 的边界为什么最终要在卷七收口
- 这篇主问题：为什么 command、tool、skill、agent 的边界必须在卷七收口。
- 必须回收的旧文章：
  - 卷三 / 卷五 / 卷六对应边界文
- 必读源码文件：
  - `cc/src/commands/`
  - `cc/src/tools/`
  - `cc/src/skills/`
  - `cc/src/tools/AgentTool/`
- 主证据链：前三卷各自立过对象边界 → 卷七必须站在控制层视角重新收口。
- 必须有的 mermaid 主图：command / tool / skill / agent 边界总图。
- 不能空讲的硬货：必须给出站在控制层视角的重新分层。
- 禁止偷吃的相邻篇职责：不提前写完产品形态。

## 07｜为什么说 Claude Code 的产品形态，本质上是 runtime 被包装给用户的方式
- 这篇主问题：为什么 Claude Code 会长成今天这个产品形态。
- 必须回收的旧文章：
  - 卷六收束篇
- 必读源码文件：
  - 用户入口、interface、workflow 暴露给产品的相关文件（待补）
- 主证据链：runtime 已经具备对象层 / 协作层 / 控制层 → 产品形态是这些层被包装给用户的方式。
- 必须有的 mermaid 主图：runtime 到产品形态的包装图。
- 不能空讲的硬货：必须解释“包装”具体包装了什么，而不是空喊产品化。
- 禁止偷吃的相邻篇职责：不提前写完卷尾总收束。

## 08｜为什么用户入口、运行时接口和工作流控制层最终会收成今天这个产品
- 这篇主问题：为什么卷七最终会收成今天这个产品。
- 必须回收的旧文章：
  - 卷七前 7 篇
- 必读源码文件：
  - `cc/src/commands/`
  - `cc/src/skills/`
  - workflow / product integration 相关文件（待补）
- 主证据链：用户入口 + runtime interface + workflow control layer 一起闭合 → 收成今天这个产品。
- 必须有的 mermaid 主图：卷七产品控制层总收束图。
- 不能空讲的硬货：必须把入口、接口、控制层压回同一张产品图。
- 禁止偷吃的相邻篇职责：不写成营销文或全书抒情总结。
