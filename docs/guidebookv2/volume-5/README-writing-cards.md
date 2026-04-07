---
title: 卷五写作卡片
status: draft
updated: 2026-04-07
---

# 卷五写作卡片

> 用途：作为新卷五的内部写作卡片。先按“扩展能力总图”搭骨架，再从旧文和源码里抽素材，禁止让旧文反向决定新文章结构。

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

## 04+｜对象主线（按对象展开，具体篇幅后续细化）

> 当前确认顺序：**skills → MCP → agents → subagents → hooks → plugins**

---

## Skills 组｜把用户的经验、流程和角色结构接进 Claude Code

### 这组主问题
skills 为什么不是“长 prompt”或“方便复用的文本片段”，而是 Claude Code 把用户经验、流程和角色结构接进系统的重要方式？

### 这组核心判断句
**skills 不是附着在 Claude Code 外面的提示词包装，而是用户把能力定制、工作方法和角色结构接进 runtime 的关键组织单元。**

### 这组必须完成的任务
- 立住 skills 在卷五里的第一重轴地位
- 解释 skills 和 prompt、tool、agent 之间的边界
- 说明 skills 怎样成为“用户工作方式进入系统”的主要入口之一

### 这组不讲什么
- 不提前把卷六的命令入口讲成正题
- 不把 skills 简化成 frontmatter 字段说明
- 不把这组写成技能开发教程

### Mermaid 主图
1. 从用户经验到 skill 再到 runtime 接入的流程图
2. skill 与 prompt / tool / agent 的边界关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/16-loadskillsdir.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/17-skilltool-execution-entry.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/23-good-runtime-skill.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/24-skillify.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/28-skill-name-description.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/29-when-to-use-vs-description.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/SkillTool.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`
- `/Users/haha/.openclaw/workspace/cc/src/prompts/`
- `/Users/haha/.openclaw/workspace/cc/src/constants/systemPromptSections.ts`

### 对后文的导流
- MCP 组：从“把工作方式接进来”走向“把外部能力源接进来”
- agents 组：从“能力定制”走向“执行者扩展”

---

## MCP 组｜Claude Code 怎样把系统外能力源接进来

### 这组主问题
MCP 为什么不是“多了一批远程工具”，而是 Claude Code 接入系统外能力源、资源系统和环境服务的关键机制？

### 这组核心判断句
**MCP 的意义不只是让 Claude Code 连到外部工具，而是让系统开始拥有稳定接入外部能力源与资源系统的通道。**

### 这组必须完成的任务
- 立住 MCP 的卷五位置：外部能力源接入主线
- 把 MCP 和 skills、hooks、plugins 区分开
- 说明“工具接入”和“能力源接入”为什么不是同一层问题

### 这组不讲什么
- 不把 MCP 写成协议教程
- 不展开所有供应商生态细节
- 不提前把 plugins 讲完

### Mermaid 主图
1. Claude Code 与外部能力源 / 资源系统的接入图
2. MCP 与本地扩展对象的对照图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/index.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/MCPTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ReadMcpResourceTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ListMcpResourcesTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ConfigTool/ConfigTool.ts`

### 对后文的导流
- agents 组：从能力源扩展进入执行者扩展
- hooks / plugins 组：从接入通道走向平台接缝和封装形态

---

## Agents 组｜Claude Code 怎样长出更多执行者

### 这组主问题
agent 在卷五里为什么不是“另一个工具”，而是 Claude Code 从单执行者走向更多执行者体系的关键结构？

### 这组核心判断句
**agents 不是工具目录里的一个特例，而是 Claude Code 把执行能力继续外化、角色化和分工化后的执行者扩展层。**

### 这组必须完成的任务
- 立住 agents 在卷五里的第二重轴地位
- 解释 agent 与 tool、skill、subagent 的边界
- 说明 agent 怎样承接角色化、委派化和多执行者协作的可能性

### 这组不讲什么
- 不把 agent 简化成“更聪明的 tool”
- 不把 subagent 全提前讲完
- 不写成多 agent 应用案例大全

### Mermaid 主图
1. 单执行者系统到多执行者系统的演化图
2. agent 与 tool / skill / subagent 的边界图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/10-agenttool.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/11-runagent-assembly-line.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/13-loadagentsdir.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/14-builtinagents.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/19-runagent-skill-mainline.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/LocalAgentTask/`

### 对后文的导流
- subagents 组：从“更多执行者”进入“协作结构”
- hooks / plugins：从执行者扩展进入平台接缝和封装层

---

## Subagents 组｜主 agent 为什么还要再派生子执行者

### 这组主问题
当 agent 已经成立后，为什么 Claude Code 还需要 subagent，主 agent 与 subagent 又是怎样形成协作结构的？

### 这组核心判断句
**subagents 不是 agents 的脚注，而是 Claude Code 把执行者体系进一步展开成分工协作结构的关键一步。**

### 这组必须完成的任务
- 解释 subagent 为什么独立成组
- 说明主 agent 与 subagent 的层级关系、职责关系和协作意义
- 让读者看见 Claude Code 为什么不止是“多几个 agent”

### 这组不讲什么
- 不把 subagent 写成并行调度教程
- 不抢卷六的工作流入口问题
- 不把这组写成单一实现细节篇

### Mermaid 主图
1. agent → subagent 的分工展开图
2. 主 agent / subagent 协作结构图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/12-forksubagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/19-runagent-skill-mainline.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tasks/RemoteAgentTask/`
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`

### 对后文的导流
- hooks 组：从执行者协作结构进入运行时接缝层
- 卷尾总图：把协作结构放回平台层地图

---

## Hooks 组｜运行时在哪些接缝点允许被注入和干预

### 这组主问题
hooks 为什么属于卷五正式成员，而不是“边角配置项”？Claude Code 的 runtime 又为什么需要这样的接缝层？

### 这组核心判断句
**hooks 的意义不只是插一个自定义动作，而是为 Claude Code 留出可观察、可注入、可干预的运行时接缝层。**

### 这组必须完成的任务
- 立住 hooks 作为“接缝层”的卷五位置
- 解释 hooks 和 skills、plugins 的差异
- 说明为什么平台化不仅需要能力对象，也需要运行时接缝

### 这组不讲什么
- 不把 hooks 写成配置参数说明书
- 不与 plugins 混讲
- 不抢控制层和命令层问题

### Mermaid 主图
1. Claude Code runtime 接缝点示意图
2. hooks 与 skills / plugins 的关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/hooks/`
- `/Users/haha/.openclaw/workspace/cc/src/config.ts`
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`

### 对后文的导流
- plugins 组：从接缝点进入更完整的扩展封装
- 卷尾总图：把 hooks 放回平台层地图

---

## Plugins 组｜为什么平台层还需要更完整的扩展封装形态

### 这组主问题
如果已经有了 skills、MCP、hooks，为什么 Claude Code 还需要 plugins 这样更完整的平台扩展封装形态？

### 这组核心判断句
**plugins 不是几个零散扩展点的别名，而是平台层走向更完整封装、分发和复用时需要的扩展形态。**

### 这组必须完成的任务
- 解释 plugins 在卷五里的独立地位
- 把 plugins 与 hooks、skills、MCP 区分开
- 说明平台层为什么需要“更完整的扩展封装”

### 这组不讲什么
- 不把 plugins 写成生态宣传文
- 不和 hooks 混成一篇
- 不提前把卷六的产品整合问题写完

### Mermaid 主图
1. 零散扩展点 vs 平台扩展封装对照图
2. plugins 与其它扩展对象的关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/plugins/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ConfigTool/ConfigTool.ts`

### 对后文的导流
- 卷尾总图：回到统一平台层结构
- 卷六：自然进入命令入口、控制层与产品整合

---

## 卷尾｜为什么这些扩展对象最终会收成一层平台能力

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
4. **MCP / subagents 大概率也不会轻，但拆几篇后续再定。**
5. **hooks / plugins 分开讲，不合并。**
6. **卷五重点始终是扩展层如何成立，不是命令入口如何暴露。**
7. **卷五的对象必须放回 runtime 关系里讲，不能平铺成功能清单。**
8. **先按 skeleton-first 写作：先职责、再边界、再骨架、最后回收旧文素材。**
