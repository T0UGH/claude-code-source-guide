---
title: 卷七写作卡片
status: draft
updated: 2026-04-09
---

# 卷七写作卡片

> 用途：作为新版卷七（命令、工作流与产品层整合）的**证据作战卡**。  
> 卷七不再只是讲 command 或产品感觉，而必须提前给每篇文章的：
>
> - 旧文章素材锚点
> - 源码锚点
> - 主证据链
> - mermaid 主图要求
> - 不能空讲的硬货
>
> **没有证据抓手的卡片，不允许直接派给 agent。**

---

## 一、卷七当前结构总览

当前确定：

- 合计：**8 篇**

顺序固定为：

> **控制层总起 → 命令入口 → 入口接入 runtime → interface → workflow control layer → 边界收口 → 产品形态 → 卷尾总收束**

---

## 二、卷七硬约束（绝对路径防油版）

1. **每篇至少 1 张 mermaid 主图。**
2. **每篇必须写明旧文章素材锚点。**
3. **每篇必须写明必读源码文件，而且默认写绝对路径，不准只写目录名糊弄。**
4. **每篇必须至少点名 3 个绝对路径源码文件。**
5. **每篇必须至少压出 1 条明确函数链 / 数据链 / 调用链。**
6. **每篇必须给出一条主证据链。**
7. **每篇必须写明“不能空讲的硬货”。**
8. **没有主证据链的卡片，不允许派给 agent。**
9. **没有主图方案的卡片，不允许派给 agent。**
10. **源码证据优先于方法论包装。**
11. **禁止把卷七写成命令索引、产品宣传文或全书抒情结尾。**
12. **旧文章只能做素材仓，不能反向决定新文章骨架。**
13. **卷七重点始终是控制层如何成立，不是具体功能清单如何罗列。**
14. **如果卡片里还只有目录级锚点，主会话必须先补到文件级绝对路径，才能派单。**
15. **像“workflow 相关文件”“prompt 相关目录”“待补”这类空锚点，视为无效锚点。**

---

## 三、卷七分组总卡

## 3.1 总起 / 入口组（01-03）

### 这一组要解决什么
先把卷七立成“控制层卷”，再解释 command 为什么是正式用户入口，以及命令入口怎样接进 runtime。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-1/20-processpromptslashcommand.md`
- `docs/guidebook/volume-1/31-prompt-as-instruction-layer.md`
- `docs/guidebookv2/volume-6/07-why-claude-code-team-is-a-swarm.md`

### 这一组最重要的源码入口（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processSlashCommand.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/utils/slashCommandParsing.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/handlePromptSubmit.ts`
- `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`
- `/Users/haha/.openclaw/workspace/cc/src/query.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/queryContext.ts`
- `/Users/haha/.openclaw/workspace/cc/src/commands.ts`
- `/Users/haha/.openclaw/workspace/cc/src/types/command.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/plugins/loadPluginCommands.ts`
- `/Users/haha/.openclaw/workspace/cc/src/context.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/api.ts`

### 这一组最容易跑偏成什么
- 快捷方式说明文
- 命令大全
- UI 功能介绍

---

## 3.2 interface / workflow / 边界组（04-06）

### 这一组要解决什么
把 frontmatter / interface 立成 runtime interface，把 verify / debug 等工作流动作立成 control layer，再从控制层视角收口 command / tool / skill / agent 边界。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-1/21-skill-frontmatter-fields.md`
- `docs/guidebook/volume-1/22-frontmatter-runtime-interface.md`
- `docs/guidebook/volume-1/25-verify.md`
- `docs/guidebook/volume-1/26-debug.md`
- `docs/guidebookv2/volume-5/08-boundaries-between-skill-tool-and-agent.md`
- `docs/guidebookv2/volume-5/18-boundaries-and-coordination-between-agent-skill-and-tool.md`

### 这一组最重要的源码入口（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/skills/loadSkillsDir.ts`
- `/Users/haha/.openclaw/workspace/cc/src/skills/bundledSkills.ts`
- `/Users/haha/.openclaw/workspace/cc/src/commands/skills/index.ts`
- `/Users/haha/.openclaw/workspace/cc/src/commands/skills/skills.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolExecution.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolHooks.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolOrchestration.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/tools/StreamingToolExecutor.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/forkSubagent.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/prompt.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts`

### 这一组最容易跑偏成什么
- 字段手册
- 工作流清单
- 术语对照表

---

## 3.3 产品形态 / 收束组（07-08）

### 这一组要解决什么
回答 Claude Code 为什么会长成今天这个产品形态，并把用户入口、runtime interface、workflow control layer 重新压回同一张产品图。

### 这一组主要回收哪些旧文章
- `docs/guidebookv2/volume-6/07-why-claude-code-team-is-a-swarm.md`
- `docs/guidebookv2/volume-5/25-why-these-extension-objects-converge-into-a-platform-layer.md`
- `docs/guidebook/volume-4/15-plugin-conclusion.md`

### 这一组最重要的源码入口（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processSlashCommand.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/query.ts`
- `/Users/haha/.openclaw/workspace/cc/src/skills/loadSkillsDir.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolExecution.ts`
- `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolOrchestration.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/prompt.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/plugins/loadPluginCommands.ts`

### 这一组最容易跑偏成什么
- 营销文
- 愿景文
- 全书哲学总结

---

## 四、单篇证据作战卡

## 01｜为什么 Claude Code 最终一定会长出一层控制层
- **这篇主问题**：为什么卷六之后还不能结束，系统还必须继续长出控制层。
- **必须回收的旧文章**：
  - `docs/guidebookv2/volume-6/07-why-claude-code-team-is-a-swarm.md`
  - `docs/guidebookv2/volume-5/25-why-these-extension-objects-converge-into-a-platform-layer.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/handlePromptSubmit.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/query.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolOrchestration.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- **最低点名链路**：用户入口进入 turn 处理 → query / tool orchestration / agent execution 被统一控制 → 控制层成为独立层。
- **主证据链**：对象层、协作层已经成立 → 用户怎样进入、接口怎样声明、工作流怎样被控制仍未统一解释 → 系统必须继续长出一层控制层。
- **必须有的 mermaid 主图**：对象层 / 协作层 / 控制层 三层分层图。
- **这篇绝对不能空讲的硬货**：必须明确“控制层”比前两卷多出来的责任是什么。
- **禁止偷吃的相邻篇职责**：不提前展开 slash commands / workflow 正文。

## 02｜slash commands / prompt commands 为什么不是普通快捷方式
- **这篇主问题**：为什么 command 不是普通快捷方式，而是正式用户入口。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/20-processpromptslashcommand.md`
  - `docs/guidebook/volume-1/31-prompt-as-instruction-layer.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/slashCommandParsing.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/commands.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/types/command.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/plugins/loadPluginCommands.ts`
- **最低点名链路**：用户输入 `/...` → slash parsing / command matching → 进入正式 command 对象分发。
- **主证据链**：slash / prompt command 不是 UI 便利层 → 它们决定用户怎样把意图送进 runtime。
- **必须有的 mermaid 主图**：用户输入 → command / prompt command → runtime 入口图。
- **这篇绝对不能空讲的硬货**：必须说明 command 为什么属于系统入口层，而不只是交互糖衣。
- **禁止偷吃的相邻篇职责**：不讲完整接入链，不讲 workflow control layer。

## 03｜命令入口是怎样接进 runtime 的
- **这篇主问题**：命令入口怎样从用户入口接进 runtime。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/20-processpromptslashcommand.md`
  - `docs/guidebook/volume-2/08-system-prompt-and-context.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processSlashCommand.tsx`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/handlePromptSubmit.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/query.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/queryContext.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/api.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/slashCommandParsing.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/commands.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/types/command.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/plugins/loadPluginCommands.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/context.ts`
- **最低点名链路**：`/command args` → `processUserInput.ts` 识别 → `processSlashCommand.tsx` / `findCommand(...)` → `getMessagesForPromptSlashCommand(...)` 产出 metadata / attachments / `command_permissions` / `allowedTools` / `model` / `effort` → `handlePromptSubmit.ts` / `QueryEngine.ts` 并入 turn → `query.ts` 经 `prependUserContext(...)`、`appendSystemContext(...)` 装配 → `callModel(...)`。
- **主证据链**：命令被识别 → 进入当前 turn / query 装配链 → 改变当前 runtime 行为。
- **必须有的 mermaid 主图**：命令入口接入 runtime 主链图。
- **这篇绝对不能空讲的硬货**：至少讲一条命令怎样进入运行主链，而且必须点名真实文件与函数。
- **禁止偷吃的相邻篇职责**：不把 interface 层讲完。

## 04｜skill frontmatter / command interface 为什么是运行时接口，不只是元数据
- **这篇主问题**：为什么 frontmatter / interface 属于 runtime interface，而不是附属说明。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/21-skill-frontmatter-fields.md`
  - `docs/guidebook/volume-1/22-frontmatter-runtime-interface.md`
  - `docs/guidebookv2/volume-5/07-what-makes-a-good-runtime-skill.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/skills/loadSkillsDir.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/skills/bundledSkills.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/commands/skills/index.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/commands/skills/skills.tsx`
  - `/Users/haha/.openclaw/workspace/cc/src/types/command.ts`
- **最低点名链路**：skill / command 的声明式字段进入加载、发现、匹配与执行语义，而不只是文档说明。
- **主证据链**：声明式字段与 interface 不只是说明 → 它们会进入发现、匹配、运行语义 → 因而属于 runtime interface。
- **必须有的 mermaid 主图**：元数据 vs runtime interface 对比图。
- **这篇绝对不能空讲的硬货**：必须压出至少一条字段进入运行语义的链。
- **禁止偷吃的相邻篇职责**：不写成字段手册，不讲 workflow 总体。

## 05｜工作流控制层是怎样在 Claude Code 里成立的
- **这篇主问题**：verify / debug / plan / orchestration 为什么不是散功能，而是 workflow control layer。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/25-verify.md`
  - `docs/guidebook/volume-1/26-debug.md`
  - `docs/guidebook/volume-1/31-prompt-as-instruction-layer.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/skills/bundled/verify.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/skills/bundled/debug.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/EnterPlanModeTool/EnterPlanModeTool.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolExecution.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolHooks.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolOrchestration.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/StreamingToolExecutor.ts`
- **最低点名链路**：verify / debug / plan 不是孤立功能 → 它们通过 tool orchestration / hook / plan mode 改变执行路径与回路。
- **主证据链**：verify / debug / plan 这些动作不是并列功能 → 它们在 runtime 里承担控制、检查、回路修正与推进职责 → 一起构成 workflow control layer。
- **必须有的 mermaid 主图**：workflow control layer 结构图。
- **这篇绝对不能空讲的硬货**：必须说明“控制动作”和“执行动作”的差异，而且至少点名一条控制动作改写执行回路的链。
- **禁止偷吃的相邻篇职责**：不把四者边界总收口提前讲完。

## 06｜command、tool、skill、agent 的边界为什么最终要在卷七收口
- **这篇主问题**：为什么 command、tool、skill、agent 的边界必须在卷七收口。
- **必须回收的旧文章**：
  - `docs/guidebookv2/volume-5/08-boundaries-between-skill-tool-and-agent.md`
  - `docs/guidebookv2/volume-5/18-boundaries-and-coordination-between-agent-skill-and-tool.md`
  - `docs/guidebook/volume-1/20-processpromptslashcommand.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processSlashCommand.tsx`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolExecution.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/skills/loadSkillsDir.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/forkSubagent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/prompt.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts`
- **最低点名链路**：command 负责入口分发，tool 负责动作执行，skill 负责运行时接口 / 经验包装，agent 负责独立执行者；必须用源码职责而不是名词解释来分层。
- **主证据链**：前三卷分别立过对象边界 → 到卷七，必须站在控制层视角重新切 command / tool / skill / agent 的关系。
- **必须有的 mermaid 主图**：command / tool / skill / agent 边界总图。
- **这篇绝对不能空讲的硬货**：必须给出站在控制层视角的重新分层，而不是复读卷三 / 卷五。
- **禁止偷吃的相邻篇职责**：不提前写完产品形态。

## 07｜为什么说 Claude Code 的产品形态，本质上是 runtime 被包装给用户的方式
- **这篇主问题**：为什么 Claude Code 会长成今天这个产品形态。
- **必须回收的旧文章**：
  - `docs/guidebookv2/volume-6/07-why-claude-code-team-is-a-swarm.md`
  - `docs/guidebookv2/volume-5/25-why-these-extension-objects-converge-into-a-platform-layer.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/query.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/skills/loadSkillsDir.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolExecution.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolOrchestration.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/prompt.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/plugins/loadPluginCommands.ts`
- **最低点名链路**：入口、接口、工作流、agent 能力怎样在同一个产品面上被暴露给用户。
- **主证据链**：runtime 已经具备对象层 / 协作层 / 控制层 → 产品形态不是额外包装，而是这些层被组织后暴露给用户的方式。
- **必须有的 mermaid 主图**：runtime 到产品形态的包装图。
- **这篇绝对不能空讲的硬货**：必须解释“包装”具体包装了什么，而不是空喊产品化。
- **禁止偷吃的相邻篇职责**：不提前写完卷尾总收束。

## 08｜为什么用户入口、运行时接口和工作流控制层最终会收成今天这个产品
- **这篇主问题**：为什么卷七最终会收成今天这个产品。
- **必须回收的旧文章**：
  - 卷七前 7 篇
  - `docs/guidebookv2/volume-6/07-why-claude-code-team-is-a-swarm.md`
- **必读源码文件（绝对路径）**：
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/query.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/skills/loadSkillsDir.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolOrchestration.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/prompt.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/builtInAgents.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/plugins/loadPluginCommands.ts`
- **最低点名链路**：用户入口 + runtime interface + workflow control layer 如何在同一产品面上闭合。
- **主证据链**：用户入口 + runtime interface + workflow control layer 一起闭合 → 收成今天这个产品。
- **必须有的 mermaid 主图**：卷七产品控制层总收束图。
- **这篇绝对不能空讲的硬货**：必须把入口、接口、控制层压回同一张产品图。
- **禁止偷吃的相邻篇职责**：不写成营销文或全书抒情总结。

---

## 五、当前执行提醒

1. **派单前必须先检查该篇是否已具备旧文锚点、绝对路径源码锚点、主证据链、主图方案。**
2. **如果某篇卡片还不能支撑 agent 找到原始素材，禁止直接起稿。**
3. **卷七天然更容易长成“命令说明书”或“产品感觉文”，主会话必须优先检查有没有把判断压回控制层链路。**
4. **任何一篇如果写成“产品上看很合理，但源码抓手很少”的稿子，应直接判为卡片输入不足或执行跑偏。**
5. **卷七默认目标不是“把控制层讲圆”，而是“把控制层怎样成立讲得有结构证据感”。**
6. **卷七正式正文还剩最后一轮：07 → 08；在这之前，禁止再用目录级源码锚点派单。**
