---
title: 卷五写作卡片
status: draft
updated: 2026-04-07
---

# 卷五写作卡片

> 用途：作为新卷五的内部写作卡片。先按“扩展能力总图”搭骨架，再从旧文和源码里抽素材，禁止让旧文反向决定新文章结构。

---

## 卷五当前结构总览

当前确定：

- 前段总论：**3 篇**
- skills：**5 篇**
- MCP：**3 篇**
- agents：**4 篇**
- subagents：**3 篇**
- hooks：**3 篇**
- plugins：**3 篇**
- 卷尾收束：**1 篇**

**合计：25 篇**

对象主线顺序固定为：

> **skills → MCP → agents → subagents → hooks → plugins**

---

## 01｜为什么复杂场景会逼 Claude Code 长出扩展层

### 主问题
为什么一旦进入真实、复杂、变化快的工作场景，Claude Code 就不能只靠一组内置能力工作，而必须长出扩展层？

### 核心判断句
**复杂场景不是 Claude Code 的边缘案例，而是它必须适应的常态；扩展层正是在这里变成必要能力。**

### 这篇必须完成的任务
- 作为卷五总起篇，先立“复杂场景为什么逼出扩展层”这个总问题
- 把卷五和卷三、卷四区分开：卷三讲怎么执行，卷四讲怎么持续工作，卷五讲怎么长出适应复杂场景的能力
- 让读者先理解：扩展层不是锦上添花，而是平台化的必要结果

### 这篇不讲什么
- 不先做对象百科
- 不提前比较所有扩展机制
- 不写成产品宣传文

### Mermaid 主图
1. 内置能力系统 vs 面向复杂场景的扩展型系统对照图
2. 从复杂场景压力到扩展层出现的因果图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/index.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/02-tool-system-overview.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-3/11-stable-execution-layer-map.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-4/08-restore-and-session-recovery-how-the-system-resumes-work.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/`
- `/Users/haha/.openclaw/workspace/cc/src/hooks/toolPermission/`

### 对后文的导流
- 第 2 篇进入“为什么把扩展权交给用户”
- 第 3 篇进入扩展对象总地图

---

## 02｜为什么 Claude Code 选择把扩展权交给用户

### 主问题
面对复杂场景，为什么 Claude Code 选择把扩展权交给用户，而不是只靠产品团队不断内置更多能力？

### 核心判断句
**Claude Code 的强，不在于它预装了多少能力，而在于它把扩展权交给了用户，让系统能够贴着真实工作继续生长。**

### 这篇必须完成的任务
- 解释“把扩展权交给用户”为什么是 Claude Code 的关键设计选择
- 把“复杂场景压力”推进成“平台化选择”
- 为后文的 skills / MCP / agents / hooks / plugins 铺统一前提

### 这篇不讲什么
- 不写成开放平台宣言
- 不抢对象总地图那篇的角色
- 不提前深讲命令入口和产品界面

### Mermaid 主图
1. 产品内建能力路线 vs 用户掌握扩展权路线对照图
2. 用户工作方式、能力源、执行者结构进入系统的总示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/19-runagent-skill-mainline.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/SkillTool.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ConfigTool/ConfigTool.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/config.ts`

### 对后文的导流
- 第 3 篇进入扩展对象总地图
- skills 组与 agents 组将承接这篇的双核心判断

---

## 03｜skills / MCP / agents / subagents / hooks / plugins 是怎样接入 Claude Code 的

### 主问题
卷五涉及的主要扩展对象分别是什么，它们在 runtime 里大致处于什么位置，又为什么不能被当成一个“扩展大桶”？

### 核心判断句
**skills / MCP / agents / subagents / hooks / plugins 不是并排功能点，而是一组以不同方式接入 runtime、共同构成扩展层的平台对象。**

### 这篇必须完成的任务
- 给卷五后半段建立统一总地图
- 以 runtime 接入关系为骨架，但保证对象分工可辨识
- 防止卷五后文退化成几个对象的平铺介绍

### 这篇不讲什么
- 不把每个对象正文讲完
- 不展开命令层与产品入口
- 不写成术语词典

### Mermaid 主图
1. 扩展对象进入 Claude Code runtime 的分层地图
2. 对象分工图：能力定制 / 外部能力源 / 执行者扩展 / 接缝层 / 扩展封装

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/10-agenttool.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/12-forksubagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/SkillTool.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/MCPTool/`
- `/Users/haha/.openclaw/workspace/cc/src/hooks/`

### 对后文的导流
- 先进入 skills 组
- 再进入 MCP 组与 agents 组

---

# Skills 组（04-08）

## 04｜为什么 skills 不是“长 prompt”那么简单

### 主问题
为什么 skills 不能被理解成“更长一点的 prompt”或“好复用一点的文本片段”？

### 核心判断句
**skills 不是提示词长度问题，而是 Claude Code 把用户能力组织成运行时单元的一种方式。**

### 这篇必须完成的任务
- 先打掉对 skills 的最常见误解
- 立住 skills 的系统地位
- 给后续 4 篇铺一个稳的起点

### 这篇不讲什么
- 不提前展开 skill 运行链细节
- 不把这篇写成好坏 skill 规范文
- 不把 agent 边界吃掉

### Mermaid 主图
1. 长 prompt vs skill 的差异图
2. prompt / skill / tool 的位置对照图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/23-good-runtime-skill.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/24-skillify.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/SkillTool.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`

### 对后文的导流
- 第 05 篇进入用户经验如何接进系统
- 第 06 篇进入 SkillTool runtime 链

---

## 05｜skills 是怎样把用户经验、流程和角色结构接进 Claude Code 的

### 主问题
skills 怎样把用户自己的经验、流程、角色结构和工作方式接进 Claude Code？

### 核心判断句
**skills 最重要的价值，不是让 prompt 可复用，而是让用户自己的工作方法可以稳定进入系统。**

### 这篇必须完成的任务
- 解释 skills 为什么是能力定制重轴
- 把“用户工作方式进入系统”讲清楚
- 为最佳实践篇和边界篇铺路

### 这篇不讲什么
- 不写成方法论散文
- 不提前深讲 frontmatter 字段
- 不抢 agent 主线

### Mermaid 主图
1. 用户经验 → skill → runtime 的转化图
2. skill 承载流程 / 角色 / 规范的示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/24-skillify.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/28-skill-name-description.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/29-when-to-use-vs-description.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`
- `/Users/haha/.openclaw/workspace/cc/src/constants/systemPromptSections.ts`

### 对后文的导流
- 第 06 篇进入 SkillTool 如何接链
- 第 07 篇进入 runtime skill 质量判断

---

## 06｜SkillTool / skills runtime 是怎样接进执行链的

### 主问题
SkillTool 和 skills runtime 是怎样真正接进 Claude Code 执行链的，而不是挂在系统外面？

### 核心判断句
**skill 不是外挂文档，而是能够被 runtime 正式识别、加载和推进的执行组织单元。**

### 这篇必须完成的任务
- 从卷三接过执行层关系
- 解释 SkillTool 的 runtime 位置
- 让读者看见 skill 是如何进入工作主链的

### 这篇不讲什么
- 不把所有 skill 设计原则都塞进来
- 不转去讲命令入口
- 不提前吃掉卷六的 interface 问题

### Mermaid 主图
1. SkillTool 进入执行链示意图
2. skill 从发现到执行的路径图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/16-loadskillsdir.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/17-skilltool-execution-entry.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/SkillTool.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`

### 对后文的导流
- 第 07 篇进入“好 runtime skill”
- 第 08 篇进入 skill / tool / agent 边界

---

## 07｜什么样的 skill 才算好的 runtime skill

### 主问题
什么样的 skill 只是提示词包装，什么样的 skill 才能真正稳定进入 Claude Code 的工作流？

### 核心判断句
**好的 runtime skill，不只是写得漂亮，而是能稳定承担职责、守住边界，并在工作流里持续发挥作用。**

### 这篇必须完成的任务
- 把“最佳实践”从写法建议提升为系统质量判断
- 解释什么样的 skill 真正适合 runtime
- 承接旧卷里的 good-runtime-skill / skillify 材料

### 这篇不讲什么
- 不写成 checklist 堆砌
- 不把卷六的 frontmatter interface 讲成主角
- 不替 agent 组回答执行者问题

### Mermaid 主图
1. 弱 skill vs 强 runtime skill 对照图
2. 好 skill 的职责 / 边界 / 触发 / 输出结构图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/23-good-runtime-skill.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/24-skillify.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`
- `/Users/haha/.openclaw/workspace/cc/src/prompts/`

### 对后文的导流
- 第 08 篇进入 skill / tool / agent 边界
- MCP 组与 agents 组自然接手

---

## 08｜skill、tool、agent 三者的边界到底是什么

### 主问题
skill、tool、agent 为什么不能混成一个“扩展对象”大桶，它们各自处于什么层级？

### 核心判断句
**skill、tool、agent 分别承担的是能力组织、执行能力和执行者结构，不是三种随便互换的名字。**

### 这篇必须完成的任务
- 给 skills 组做边界收口
- 为 MCP / agents 组铺更稳的坡度
- 防止卷五后半对象相互吃掉

### 这篇不讲什么
- 不抢 agents 正文
- 不重写卷三的工具主链
- 不写成术语手册

### Mermaid 主图
1. skill / tool / agent 三层边界图
2. skill 调用 / tool 执行 / agent 委派关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/10-agenttool.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/`

### 对后文的导流
- MCP 组开始
- agents 组开始

---

# MCP 组（09-11）

## 09｜为什么 MCP 不是“多了一批远程工具”

### 主问题
为什么 MCP 不能只被理解成“多接了一批远程工具”？

### 核心判断句
**MCP 的意义不只是远程工具扩容，而是让 Claude Code 拥有稳定接入系统外能力源的通道。**

### 这篇必须完成的任务
- 打掉对 MCP 的浅理解
- 把它从工具目录抬到能力源接入层
- 为第 10、11 篇铺路

### 这篇不讲什么
- 不写成协议教程
- 不把所有资源类型提前讲完
- 不和 plugins 混掉

### Mermaid 主图
1. 远程工具视角 vs 能力源视角对照图
2. MCP 在平台层的位置图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/index.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/MCPTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ReadMcpResourceTool/`

### 对后文的导流
- 第 10 篇进入外部能力源接入链
- 第 11 篇进入对象边界

---

## 10｜Claude Code 是怎样通过 MCP 接入外部能力源和资源系统的

### 主问题
Claude Code 是怎样通过 MCP 把系统外能力源和资源系统接进 runtime 的？

### 核心判断句
**MCP 真正重要的地方，不在“连上去”，而在它让系统外部能力可以被稳定编入 runtime。**

### 这篇必须完成的任务
- 讲清楚 MCP 的接入位置
- 解释能力源 / 资源系统 / runtime 的关系
- 让读者看到它为什么属于卷五主线

### 这篇不讲什么
- 不细讲所有协议实现
- 不吃掉 hooks / plugins 的职责
- 不写成接入教程

### Mermaid 主图
1. Claude Code ↔ MCP ↔ 外部能力源接入图
2. MCP 在 runtime 中的接入路径图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/MCPTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ListMcpResourcesTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ConfigTool/ConfigTool.ts`

### 对后文的导流
- 第 11 篇进入 MCP 与其它扩展对象的边界
- agents 组开始

---

## 11｜MCP 和 skills / hooks / plugins 分别是什么关系

### 主问题
MCP 和 skills、hooks、plugins 各自处于什么层级，为什么不能被混成同一类扩展？

### 核心判断句
**MCP 解决的是外部能力源接入，不等于工作方法封装，也不等于运行时接缝或平台扩展封装。**

### 这篇必须完成的任务
- 给 MCP 组收边界
- 防止 MCP 吃掉后面的 hooks / plugins
- 让卷五对象分工更稳

### 这篇不讲什么
- 不重复第 09、10 篇主文
- 不抢 plugins 组的成熟封装问题
- 不写成对象字典

### Mermaid 主图
1. MCP / skills / hooks / plugins 边界图
2. 外部能力源 / 方法封装 / 接缝 / 封装形态四象限图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/MCPTool/`
- `/Users/haha/.openclaw/workspace/cc/src/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/plugins/`

### 对后文的导流
- agents 组开始
- hooks / plugins 组预埋边界

---

# Agents 组（12-15）

## 12｜为什么 agent 不是“另一个工具”

### 主问题
为什么在卷五里，agent 不能被当成“特殊一点的工具”来理解？

### 核心判断句
**agent 不是另一个工具，而是 Claude Code 开始长出更多执行者时出现的结构性对象。**

### 这篇必须完成的任务
- 打掉对 agent 的常见误解
- 先立执行者层这个概念
- 为后面 3 篇 agents 正文铺路

### 这篇不讲什么
- 不提前把 subagent 全讲完
- 不重讲卷三工具主链
- 不写成 agent 目录导览

### Mermaid 主图
1. 工具 vs 执行者对照图
2. agent 在平台层中的位置图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/10-agenttool.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`

### 对后文的导流
- 第 13 篇进入“更多执行者”
- 第 15 篇边界篇收束

---

## 13｜Claude Code 是怎样长出更多执行者的

### 主问题
Claude Code 是怎样从单执行者走向更多执行者体系的？

### 核心判断句
**agent 的出现意味着系统开始把执行能力进一步外化成多个可分工的执行者。**

### 这篇必须完成的任务
- 解释 agents 为什么是执行者扩展重轴
- 讲清“更多执行者”这件事如何成立
- 让读者看见卷五的多代理坡度

### 这篇不讲什么
- 不细讲 subagent 组织细节
- 不写成应用案例堆积
- 不提前吃掉 hooks / plugins

### Mermaid 主图
1. 单执行者 → 多执行者演化图
2. agent runtime 扩展示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/11-runagent-assembly-line.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/13-loadagentsdir.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/14-builtinagents.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/LocalAgentTask/`

### 对后文的导流
- 第 14 篇进入角色化和分工化
- subagents 组开始前的铺垫

---

## 14｜agent 的角色化、分工化和委派化是怎么成立的

### 主问题
agent 为什么会走向角色化、分工化和委派化，而不只是“多开几个执行者”？

### 核心判断句
**agent 真正带来的不是数量增加，而是执行能力开始出现角色、分工和委派结构。**

### 这篇必须完成的任务
- 讲清 agent 的组织意义
- 解释为什么它会自然通向 subagent
- 为下一篇边界篇和 subagents 组铺路

### 这篇不讲什么
- 不直接把 subagent 正文讲完
- 不写成“多 agent 最佳实践”大全
- 不与 skill 边界篇重复

### Mermaid 主图
1. agent 角色化 / 分工化 / 委派化结构图
2. agent 到 subagent 的过渡图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/19-runagent-skill-mainline.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/RemoteAgentTask/`

### 对后文的导流
- 第 15 篇进入边界篇
- subagents 组开始

---

## 15｜agent、skill、tool 之间的边界和协作关系

### 主问题
agent、skill、tool 各自是什么层级，它们在系统里怎样协作？

### 核心判断句
**tool 是执行能力，skill 是能力组织，agent 是执行者结构；三者相关，但绝不是同一类对象。**

### 这篇必须完成的任务
- 给 agents 组做边界收口
- 把 agent 与 skills、tools 切清楚
- 给 subagents 组提供更稳起点

### 这篇不讲什么
- 不重讲 skills 组正文
- 不提前把 subagent 边界讲完
- 不写成术语百科

### Mermaid 主图
1. tool / skill / agent 分层协作图
2. agent 调 skill、skill 组织 tool 的关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/10-agenttool.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`

### 对后文的导流
- subagents 组开始

---

# Subagents 组（16-18）

## 16｜为什么主 agent 还要派生 subagent

### 主问题
既然 agent 已经成立了，为什么主 agent 还要再派生 subagent？

### 核心判断句
**subagent 不是可有可无的附属能力，而是主执行者面对复杂任务时进一步展开协作结构的必要结果。**

### 这篇必须完成的任务
- 解释 subagent 为什么必须独立成组
- 回答“已经有 agent 了为什么还不够”
- 立住 subagent 的必要性

### 这篇不讲什么
- 不提前把协作结构细节讲完
- 不写成并行执行技巧文
- 不抢信息回流篇

### Mermaid 主图
1. 主 agent 为什么还要再派生子执行者的因果图
2. 单 agent 与 agent+subagent 对照图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/12-forksubagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/forkSubagent.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`

### 对后文的导流
- 第 17 篇进入协作结构
- 第 18 篇进入边界和回流

---

## 17｜subagent 是怎样把执行者体系展开成协作结构的

### 主问题
subagent 是怎样把多执行者体系进一步展开成主从分工和协作结构的？

### 核心判断句
**subagent 的真正价值，不是再多一个执行者，而是把执行者体系组织成可协作、可拆分、可回收的结构。**

### 这篇必须完成的任务
- 讲清 subagent 组的主问题
- 解释主从协作和任务拆分
- 让这组不只是概念补充

### 这篇不讲什么
- 不细讲所有回流细节
- 不抢 hooks 组的接缝层问题
- 不写成调度器实现笔记

### Mermaid 主图
1. 主 agent / subagent 协作结构图
2. 任务拆分与协作链示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/12-forksubagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/19-runagent-skill-mainline.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/RemoteAgentTask/`

### 对后文的导流
- 第 18 篇进入职责边界与信息回流

---

## 18｜主 agent / subagent 的职责边界与信息回流

### 主问题
主 agent 和 subagent 的职责边界是什么，信息又怎样回流到主线里？

### 核心判断句
**subagent 之所以是协作结构而不是失控分叉，关键在于职责边界和信息回流被系统收得住。**

### 这篇必须完成的任务
- 给 subagents 组做收口
- 解释边界与回流为什么重要
- 把 subagent 放回可控协作结构里

### 这篇不讲什么
- 不写成日志追踪教程
- 不抢 hooks 组的事件接缝问题
- 不重讲 agents 总体价值

### Mermaid 主图
1. 主 agent / subagent 职责边界图
2. subagent 结果回流到主线的示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/19-runagent-skill-mainline.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`

### 对后文的导流
- hooks 组开始
- 卷尾总图预埋

---

# Hooks 组（19-21）

## 19｜为什么平台层不仅要有能力对象，还要有运行时接缝

### 主问题
为什么平台层除了 skills、MCP、agents 这些能力对象外，还必须有运行时接缝？

### 核心判断句
**平台化不只意味着对象变多，也意味着 runtime 必须留出可观察、可注入、可干预的接缝。**

### 这篇必须完成的任务
- 先立 hooks 存在理由
- 回答“为什么不是 skills / plugins 就够了”
- 给 hooks 组三篇开稳入口

### 这篇不讲什么
- 不提前分类讲完所有 hook
- 不把 hooks 写成配置项索引
- 不吃掉 plugins 组

### Mermaid 主图
1. 能力对象层 vs 运行时接缝层对照图
2. 为什么平台层需要 hooks 的因果图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/utils/hooks/`

### 对后文的导流
- 第 20 篇进入 hooks 的 runtime 角色
- 第 21 篇进入 hooks 分类细拆

---

## 20｜Claude Code 的 hooks 在 runtime 里到底扮演什么角色

### 主问题
hooks 在 Claude Code runtime 里到底扮演什么角色，它和 skills、plugins、commands 的关系又是什么？

### 核心判断句
**hooks 不只是额外插入动作，而是平台层留给运行时观察、注入和干预的结构化接缝。**

### 这篇必须完成的任务
- 讲 hooks 的系统位置
- 解释它和其它扩展对象的关系
- 为下一篇分类解释做铺垫

### 这篇不讲什么
- 不写成 hook 类型列表
- 不吃掉 plugins 封装层问题
- 不转去讲卷六命令入口

### Mermaid 主图
1. hooks 在 runtime 中的位置图
2. hooks / skills / plugins 关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/utils/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`

### 对后文的导流
- 第 21 篇进入各类 hooks 的解释
- plugins 组开始前的边界准备

---

## 21｜Claude Code 里的各类 hooks 分别在拦什么、接什么、改什么

### 主问题
Claude Code 里的不同 hooks 类型分别在拦什么、接什么、改什么，为什么不能被混成一个笼统概念？

### 核心判断句
**hooks 真正有价值的地方，不在“有 hook”，而在不同 hook 类型各自卡在不同接缝上、承担不同干预职责。**

### 这篇必须完成的任务
- 把每类 hooks 都解释一下
- 让 hooks 组不止停在总论
- 给卷五对象地图增加足够细度

### 这篇不讲什么
- 不写成 API 参考手册
- 不细讲每个配置字段
- 不替 plugins 组回答封装问题

### Mermaid 主图
1. hooks 类型分布图
2. 不同 hooks 拦截 / 注入 / 修改点位图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/utils/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/components/hooks/`

### 对后文的导流
- plugins 组开始
- 卷尾总图预埋

---

# Plugins 组（22-24）

## 22｜为什么有了 skills / MCP / hooks 之后，系统还需要 plugins

### 主问题
既然已经有了 skills、MCP、hooks，为什么 Claude Code 还需要 plugins？

### 核心判断句
**plugins 之所以存在，不是重复已有扩展对象，而是把更完整的扩展封装形态引入平台层。**

### 这篇必须完成的任务
- 立住 plugins 的存在理由
- 回答“为什么不是已有对象拼起来就够了”
- 给后两篇铺路

### 这篇不讲什么
- 不写成生态宣传文
- 不把所有对象边界重新讲一遍
- 不提前把封装 / 分发 / 复用全吃完

### Mermaid 主图
1. 已有扩展对象 vs plugins 的补位关系图
2. 为什么平台层还需要 plugins 的因果图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/plugins/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ConfigTool/ConfigTool.ts`

### 对后文的导流
- 第 23 篇进入对象层级边界
- 第 24 篇进入封装 / 分发 / 复用

---

## 23｜plugins 和其它扩展对象分别处在什么层级

### 主问题
plugins 和 skills、hooks、MCP 分别处在什么层级，为什么不能把 plugins 当成“总兜底扩展”？

### 核心判断句
**plugins 不是兜底概念，它所代表的是更完整的扩展封装层级，而不是所有扩展对象的统称。**

### 这篇必须完成的任务
- 给 plugins 组立清边界
- 把它和 skills / hooks / MCP 区分开
- 让这组不止停在“也有 plugin”

### 这篇不讲什么
- 不重讲 hooks 接缝问题
- 不吃掉第 24 篇成熟封装问题
- 不写成对象字典

### Mermaid 主图
1. plugins / skills / hooks / MCP 分层边界图
2. 平台层对象层级图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/plugins/`
- `/Users/haha/.openclaw/workspace/cc/src/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/MCPTool/`

### 对后文的导流
- 第 24 篇进入封装 / 分发 / 复用意义
- 卷尾总图开始收束

---

## 24｜plugins 为什么代表更完整的封装、分发和复用形态

### 主问题
为什么说 plugins 代表的是更完整的封装、分发和复用形态，而不是另一种普通扩展对象？

### 核心判断句
**plugins 的重要性，在于它意味着平台层开始具备更成熟的扩展封装、分发和复用能力。**

### 这篇必须完成的任务
- 把 plugins 从“另一个对象”提升到“平台成熟度的一层表现”
- 解释封装 / 分发 / 复用的意义
- 为卷尾总图收口

### 这篇不讲什么
- 不写成生态路线图
- 不重复第 22、23 篇
- 不提前吃掉卷六产品整合问题

### Mermaid 主图
1. 零散扩展点 → 完整封装形态演化图
2. plugins 的封装 / 分发 / 复用结构图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/plugins/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ConfigTool/ConfigTool.ts`

### 对后文的导流
- 卷尾总图开始收束
- 卷六自然导流

---

## 25｜为什么这些扩展对象最终会收成一层平台能力

### 主问题
skills / MCP / agents / subagents / hooks / plugins 这些看似分散的对象，为什么最终会共同构成 Claude Code 的平台层？

### 核心判断句
**Claude Code 的强，不只在它会执行，而在它能把能力源、工作方式、执行者和接缝层接成长久可用的平台结构。**

### 这篇必须完成的任务
- 把卷五全部对象重新压回一张扩展能力总图
- 说明这些对象共同构成的不是“功能列表”，而是一层平台能力
- 自然导向卷六，但不抢卷六的控制层主问题

### 这篇不讲什么
- 不再逐个重讲对象正文
- 不写成用户操作指南
- 不提前把 slash commands / runtime 命令入口讲成正题

### Mermaid 主图
1. 卷五扩展能力总图
2. 卷五到卷六的导流边界图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-3/11-stable-execution-layer-map.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-4/08-restore-and-session-recovery-how-the-system-resumes-work.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/`

### 对后文的导流
- 卷六进入命令入口、控制层接口和产品整合

---

## 当前写作约束

1. **先画扩展能力总图，再写对象正文。**
2. **前 3 篇总论不能过厚，重点是立问题，不是提前吃掉后文。**
3. **skills / agents 是双核心，不能被写轻。**
4. **skills 组中的“好 runtime skill”单独成篇，作为质量判断篇。**
5. **agents 与 subagents 分开成组：前者讲执行者扩展，后者讲协作结构。**
6. **hooks / plugins 都升到 3 篇，并且 hooks 必须解释各类 hooks。**
7. **卷五重点始终是扩展层如何成立，不是命令入口如何暴露。**
8. **卷五的对象必须放回 runtime 关系里讲，不能平铺成功能清单。**
9. **先按 skeleton-first 写作：先职责、再边界、再骨架、最后回收旧文素材。**
