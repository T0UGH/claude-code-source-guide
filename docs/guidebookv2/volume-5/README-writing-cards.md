---
title: 卷五写作卡片
status: draft
updated: 2026-04-08
---

# 卷五写作卡片

> 用途：作为新版卷五的**证据作战卡**。  
> 不再只给卷级问题和文章职责，也必须提前给每篇文章的：
>
> - 旧文章素材锚点
> - 源码锚点
> - 主证据链
> - mermaid 主图要求
> - 不能空讲的硬货
>
> **没有证据抓手的卡片，不允许直接派给 agent。**

---

## 一、卷五当前结构总览

当前确定：

- 前段总论：**3 篇**
- skills：**5 篇**
- MCP：**3 篇**
- **Agent 主轴（含 subagent / fork worker）**：**7 篇**
- hooks：**3 篇**
- plugins：**3 篇**
- 卷尾收束：**1 篇**

**合计：25 篇**

对象主线顺序固定为：

> **skills → MCP → Agent 主轴 → hooks → plugins**

---

## 二、卷五硬约束（新增证据版）

1. **每篇至少 1 张 mermaid 主图。**
2. **每篇必须写明旧文章素材锚点。**
3. **每篇必须写明必读源码文件。**
4. **每篇必须给出一条主证据链。**
5. **每篇必须写明“不能空讲的硬货”。**
6. **没有主证据链的卡片，不允许派给 agent。**
7. **没有主图方案的卡片，不允许派给 agent。**
8. **旧文章只能做素材仓，不能反向决定新文章骨架。**
9. **源码证据优先于方法论包装。**
10. **禁止把文章写成“全是为什么、没有证据”的概念文。**

---

## 三、卷五分组总卡

## 3.1 总论组（01-03）

### 这一组要解决什么
先把卷五立成“扩展层 / 平台层如何成立”的卷，而不是对象百科。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-4/01-mcp-runtime-entry.md`
- `docs/guidebook/volume-4/06-hooks-runtime-entry.md`
- `docs/guidebook/volume-4/10-plugin-capability-surface.md`
- `docs/guidebook/volume-4/15-plugin-conclusion.md`
- `docs/guidebook/volume-1/10-agenttool.md`
- `docs/guidebook/volume-1/15-skilltool-bridge.md`

### 这一组最重要的源码入口
- `cc/src/tools/SkillTool/`
- `cc/src/tools/AgentTool/`
- `cc/src/mcp/`
- `cc/src/hooks/`
- `cc/src/plugins/`

### 这一组最容易跑偏成什么
- 扩展层宣传文
- “开放平台为什么重要”的空话文
- 对象总览词典

---

## 3.2 Skills 组（04-08）

### 这一组要解决什么
skills 不是长 prompt，也不是素材目录，而是把用户方法组织成 runtime 单元。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-1/15-skilltool-bridge.md`
- `docs/guidebook/volume-1/16-loadskillsdir.md`
- `docs/guidebook/volume-1/17-skilltool-execution-entry.md`
- `docs/guidebook/volume-1/21-skill-frontmatter-fields.md`
- `docs/guidebook/volume-1/23-good-runtime-skill.md`
- `docs/guidebook/volume-1/24-skillify.md`
- `docs/guidebook/volume-1/27-skills-conclusion.md`
- `docs/guidebook/volume-1/30-skill-vs-agent.md`

### 这一组最重要的源码入口
- `cc/src/tools/SkillTool/SkillTool.ts`
- `cc/src/tools/SkillTool/`
- `cc/src/commands/`
- `cc/src/skills/`
- `cc/src/agents/`

### 这一组最容易跑偏成什么
- skill 方法论散文
- frontmatter 规范说明书
- “好 skill checklist” 空话文

---

## 3.3 MCP 组（09-11）

### 这一组要解决什么
MCP 不是多一批远程工具，而是系统外能力源与资源系统的稳定接入层。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-4/01-mcp-runtime-entry.md`
- `docs/guidebook/volume-4/02-mcptool-call-chain.md`
- `docs/guidebook/volume-4/03-cli-plus-skill-vs-many-mcp.md`
- `docs/guidebook/volume-4/04-mcp-auth-state-machine.md`
- `docs/guidebook/volume-4/05-mcp-permission-boundary.md`

### 这一组最重要的源码入口
- `cc/src/mcp/`
- `cc/src/tools/MCPTool/`
- `cc/src/resources/`

### 这一组最容易跑偏成什么
- MCP 协议教程
- “远程工具很多真方便”的概念文
- 和 plugins / hooks 混桶

---

## 3.4 Agent 主轴（12-18）

### 这一组要解决什么
agent / subagent / fork worker 不是平级对象堆，而是一条执行者主线。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-1/10-agenttool.md`
- `docs/guidebook/volume-1/11-runagent-assembly-line.md`
- `docs/guidebook/volume-1/12-forksubagent.md`
- `docs/guidebook/volume-1/13-loadagentsdir.md`
- `docs/guidebook/volume-1/14-builtinagents.md`
- `docs/guidebook/volume-1/18-forkedagent.md`
- `docs/guidebook/volume-1/19-runagent-skill-mainline.md`
- `docs/guidebook/volume-1/30-skill-vs-agent.md`
- `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`

### 这一组最重要的源码入口
- `cc/src/tools/AgentTool/AgentTool.tsx`
- `cc/src/tools/AgentTool/runAgent.ts`
- `cc/src/tools/AgentTool/forkSubagent.ts`
- `cc/src/tools/AgentTool/loadAgentsDir.ts`
- `cc/src/agents/`

### 这一组最容易跑偏成什么
- agent 哲学文
- “多执行者很厉害”的空话文
- 把 subagent 重新拆成另一组平级对象

---

## 3.5 Hooks 组（19-21）

### 这一组要解决什么
hooks 不是零散回调，而是 runtime 留出的结构化接缝。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-4/06-hooks-runtime-entry.md`
- `docs/guidebook/volume-4/07-pretooluse-posttooluse-hooks.md`
- `docs/guidebook/volume-4/08-sessionstart-stop-hooks.md`
- `docs/guidebook/volume-4/09-hooks-conclusion.md`

### 这一组最重要的源码入口
- `cc/src/hooks/`
- `cc/src/events/`
- `cc/src/runtime/`

### 这一组最容易跑偏成什么
- hook 类型索引
- 配置文档翻译版
- “平台可扩展性”空话文

---

## 3.6 Plugins 组（22-24）

### 这一组要解决什么
plugins 不是兜底概念，而是更完整的扩展封装层。

### 这一组主要回收哪些旧文章
- `docs/guidebook/volume-4/10-plugin-capability-surface.md`
- `docs/guidebook/volume-4/11-plugin-loader.md`
- `docs/guidebook/volume-4/12-plugin-attachment-points.md`
- `docs/guidebook/volume-4/13-plugin-validate-schema-policy.md`
- `docs/guidebook/volume-4/14-plugin-cli-install-marketplace.md`
- `docs/guidebook/volume-4/15-plugin-conclusion.md`

### 这一组最重要的源码入口
- `cc/src/plugins/`
- `cc/src/plugin-loader/`
- `cc/src/plugin-schema/`
- `cc/src/plugin-marketplace/`

### 这一组最容易跑偏成什么
- 生态宣传文
- 安装教程文
- 把 plugins 写成所有扩展对象的统称

---

## 四、单篇证据作战卡

## 01｜为什么复杂场景会逼 Claude Code 长出扩展层
- **这篇主问题**：复杂场景为什么会逼出扩展层，而不是靠内建能力无限堆功能解决。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/01-mcp-runtime-entry.md`
  - `docs/guidebook/volume-4/06-hooks-runtime-entry.md`
  - `docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `cc/src/tools/SkillTool/`
  - `cc/src/tools/AgentTool/`
  - `cc/src/mcp/`
  - `cc/src/hooks/`
  - `cc/src/plugins/`
- **主证据链**：本地能力不足以覆盖复杂场景 → runtime 引入方法组织 / 外部能力源 / 更多执行者 / 接缝 / 封装层 → 扩展层成为系统层。
- **必须有的 mermaid 主图**：卷五扩展层总图（skills / MCP / agents / hooks / plugins 怎样共同长出平台层）。
- **这篇绝对不能空讲的硬货**：必须明确点出卷五后半要讲的 5 类对象，以及它们各自代表什么系统压力。
- **禁止偷吃的相邻篇职责**：不能提前讲完整对象边界，不能把 03 的总地图正文写完。

## 02｜为什么 Claude Code 选择把扩展权交给用户
- **这篇主问题**：为什么 Claude Code 没走“官方无限内建”的路，而是把扩展权交给用户。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/03-cli-plus-skill-vs-many-mcp.md`
  - `docs/guidebook/volume-4/15-plugin-conclusion.md`
  - `docs/guidebook/volume-1/27-skills-conclusion.md`
- **必读源码文件**：
  - `cc/src/skills/`
  - `cc/src/mcp/`
  - `cc/src/plugins/`
- **主证据链**：复杂场景差异巨大 → 官方预装能力不可能覆盖 → runtime 提供开放接入点 → 用户扩展权成为平台化选择。
- **必须有的 mermaid 主图**：从“内建能力模型”到“用户扩展权模型”的分岔图。
- **这篇绝对不能空讲的硬货**：必须说明“用户扩展权”落在什么对象上，而不是抽象开放性口号。
- **禁止偷吃的相邻篇职责**：不能把 03 的总地图细讲完，不能展开具体对象正文。

## 03｜skills / MCP / agents / subagents / hooks / plugins 是怎样接入 Claude Code 的
- **这篇主问题**：这些对象怎样接入 runtime，为什么不能混成一个扩展大桶。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/15-skilltool-bridge.md`
  - `docs/guidebook/volume-1/10-agenttool.md`
  - `docs/guidebook/volume-4/01-mcp-runtime-entry.md`
  - `docs/guidebook/volume-4/06-hooks-runtime-entry.md`
  - `docs/guidebook/volume-4/10-plugin-capability-surface.md`
- **必读源码文件**：
  - `cc/src/tools/SkillTool/`
  - `cc/src/tools/AgentTool/`
  - `cc/src/mcp/`
  - `cc/src/hooks/`
  - `cc/src/plugins/`
- **主证据链**：不同对象以不同路径进入 runtime → 方法组织、能力源、执行者、接缝、封装层分工不同 → 才共同构成平台对象谱系。
- **必须有的 mermaid 主图**：卷五对象接入总地图。
- **这篇绝对不能空讲的硬货**：至少把 5 类对象放回统一 runtime 关系图里，并点清 each one 的接入位置。
- **禁止偷吃的相邻篇职责**：不把 skills / MCP / Agent 主轴正文讲完。

---

# Skills 组（04-08）

## 04｜为什么 skills 不是“长 prompt”那么简单
- **这篇主问题**：为什么 skill 不是长一点的 prompt。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/21-skill-frontmatter-fields.md`
  - `docs/guidebook/volume-1/23-good-runtime-skill.md`
  - `docs/guidebook/volume-1/27-skills-conclusion.md`
- **必读源码文件**：
  - `cc/src/skills/`
  - `cc/src/tools/SkillTool/SkillTool.ts`
- **主证据链**：skill 有定义层 → 有 runtime 字段与语义 → 可被发现、加载、调用 → 不是纯文本 prompt 补丁。
- **必须有的 mermaid 主图**：skill 从 markdown 定义到 runtime 对象的转化图。
- **这篇绝对不能空讲的硬货**：必须明确 skill 至少有定义层、发现层、调用层三个层次。
- **禁止偷吃的相邻篇职责**：不提前讲完 SkillTool 执行链，不提前吃 06。

## 05｜skills 是怎样把用户经验、流程和角色结构接进 Claude Code 的
- **这篇主问题**：用户工作方式怎样通过 skills 进入系统。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/24-skillify.md`
  - `docs/guidebook/volume-1/23-good-runtime-skill.md`
  - `docs/guidebook/volume-1/27-skills-conclusion.md`
- **必读源码文件**：
  - `cc/src/skills/`
  - `cc/src/commands/`
  - `cc/src/tools/SkillTool/`
- **主证据链**：用户经验 / 流程 / 角色结构 → 被写成 skill 定义 → 进入能力面 → 成为可调用的方法组织单元。
- **必须有的 mermaid 主图**：用户方法进入系统的转化图。
- **这篇绝对不能空讲的硬货**：必须说明 skill 进入的是“方法组织层”，不是底层动作原语层。
- **禁止偷吃的相邻篇职责**：不把 06 的 SkillTool 主链写完，不把 08 的边界写完。

## 06｜SkillTool / skills runtime 是怎样接进执行链的
- **这篇主问题**：SkillTool / skills runtime 怎样真正接进执行链。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/15-skilltool-bridge.md`
  - `docs/guidebook/volume-1/17-skilltool-execution-entry.md`
  - `docs/guidebook/volume-1/16-loadskillsdir.md`
- **必读源码文件**：
  - `cc/src/tools/SkillTool/SkillTool.ts`
  - `cc/src/tools/SkillTool/`
  - `cc/src/commands/`
  - `cc/src/tools/AgentTool/runAgent.ts`
- **主证据链**：skill 被发现 → 进入能力面 → assistant 调用 SkillTool → SkillTool 匹配 skill → inline / fork 分流 → 结果回流当前 turn。
- **必须有的 mermaid 主图**：SkillTool 接入执行链主图。
- **这篇绝对不能空讲的硬货**：必须讲出 inline / fork 两条路径，必须讲出 SkillTool 和 AgentTool / runAgent 的连接。
- **禁止偷吃的相邻篇职责**：不把“好 skill 的标准”写成主角，不把 agent 边界讲完。

## 07｜什么样的 skill 才算好的 runtime skill
- **这篇主问题**：什么样的 skill 才能稳定进入 Claude Code 工作流。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/23-good-runtime-skill.md`
  - `docs/guidebook/volume-1/24-skillify.md`
  - `docs/guidebook/volume-1/21-skill-frontmatter-fields.md`
- **必读源码文件**：
  - `cc/src/skills/`
  - `cc/src/tools/SkillTool/`
- **主证据链**：skill 定义方式 → 运行时可发现性 → 执行边界与职责清晰度 → 持续可用性。
- **必须有的 mermaid 主图**：坏 skill / 好 skill 的 runtime 分岔图。
- **这篇绝对不能空讲的硬货**：必须给出 runtime 视角下的好 skill 判准，不得只是写作 checklist。
- **禁止偷吃的相邻篇职责**：不把 08 的对象边界正文讲完。

## 08｜skill、tool、agent 三者的边界到底是什么
- **这篇主问题**：skill / tool / agent 各自是什么层级。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/30-skill-vs-agent.md`
  - `docs/guidebook/volume-1/15-skilltool-bridge.md`
  - `docs/guidebook/volume-1/10-agenttool.md`
- **必读源码文件**：
  - `cc/src/tools/SkillTool/`
  - `cc/src/tools/AgentTool/`
  - `cc/src/tools/`
- **主证据链**：tool 负责动作执行 → skill 负责方法组织 → agent 负责执行者结构 → 三者在 runtime 协作但不等价。
- **必须有的 mermaid 主图**：skill / tool / agent 三层边界图。
- **这篇绝对不能空讲的硬货**：必须明确三者分别解决什么问题，不能只写抽象边界话术。
- **禁止偷吃的相邻篇职责**：不把 Agent 主轴正文细讲完。

---

# MCP 组（09-11）

## 09｜为什么 MCP 不是“多了一批远程工具”
- **这篇主问题**：为什么 MCP 不能只理解成远程工具扩容。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/01-mcp-runtime-entry.md`
  - `docs/guidebook/volume-4/02-mcptool-call-chain.md`
  - `docs/guidebook/volume-4/05-mcp-permission-boundary.md`
- **必读源码文件**：
  - `cc/src/mcp/`
  - `cc/src/tools/MCPTool/`
- **主证据链**：MCP 暴露的不只是远程动作 → 它还暴露资源与能力源 → runtime 通过统一入口接入系统外部。
- **必须有的 mermaid 主图**：远程工具模型 vs 能力源接入模型对比图。
- **这篇绝对不能空讲的硬货**：必须说清楚“能力源 / 资源系统”为什么比“远程工具”更高一级。
- **禁止偷吃的相邻篇职责**：不把 10 的完整接入链讲完。

## 10｜Claude Code 是怎样通过 MCP 接入外部能力源和资源系统的
- **这篇主问题**：Claude Code 怎样通过 MCP 接入外部能力源和资源系统。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/01-mcp-runtime-entry.md`
  - `docs/guidebook/volume-4/02-mcptool-call-chain.md`
  - `docs/guidebook/volume-4/04-mcp-auth-state-machine.md`
- **必读源码文件**：
  - `cc/src/mcp/`
  - `cc/src/tools/MCPTool/`
  - `cc/src/resources/`
- **主证据链**：外部 server / resource 暴露能力 → MCP 接入层接住 → 当前能力面可见 → assistant 调用 / 资源读取进入执行链。
- **必须有的 mermaid 主图**：MCP 接入外部能力源主链图。
- **这篇绝对不能空讲的硬货**：必须给出一条 MCP call chain，不能只写抽象“接入系统外能力”。
- **禁止偷吃的相邻篇职责**：不把 11 的对象边界正文讲完。

## 11｜MCP 和 skills / hooks / plugins 分别是什么关系
- **这篇主问题**：MCP 和 skills / hooks / plugins 各处于什么层级。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/03-cli-plus-skill-vs-many-mcp.md`
  - `docs/guidebook/volume-4/05-mcp-permission-boundary.md`
  - `docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `cc/src/mcp/`
  - `cc/src/hooks/`
  - `cc/src/plugins/`
  - `cc/src/skills/`
- **主证据链**：MCP 解决外部能力源接入 → skills 解决方法组织 → hooks 解决运行时接缝 → plugins 解决封装层。
- **必须有的 mermaid 主图**：MCP / skills / hooks / plugins 边界图。
- **这篇绝对不能空讲的硬货**：必须把“外部能力源接入”与“方法组织 / 接缝 / 封装层”切干净。
- **禁止偷吃的相邻篇职责**：不把 hooks / plugins 正文展开完。

---

# Agent 主轴（12-18）

## 12｜为什么 agent 不是“另一个工具”
- **这篇主问题**：为什么 agent 不能被理解成特殊一点的工具。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/10-agenttool.md`
  - `docs/guidebook/volume-1/30-skill-vs-agent.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/AgentTool.tsx`
  - `cc/src/tools/AgentTool/`
- **主证据链**：tool 执行动作 → agent 组织执行者 → AgentTool 触发的是一个执行体，而不是一次工具动作。
- **必须有的 mermaid 主图**：tool vs agent 的执行对象差异图。
- **这篇绝对不能空讲的硬货**：必须讲清 agent 为什么是一种执行者结构，而不是高阶工具名词。
- **禁止偷吃的相邻篇职责**：不把 subagent / fork worker 后半段讲完。

## 13｜Claude Code 是怎样长出更多执行者的
- **这篇主问题**：Claude Code 怎样从单执行者走向更多执行者体系。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/10-agenttool.md`
  - `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
  - `docs/guidebook/volume-1/14-builtinagents.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/`
  - `cc/src/agents/`
- **主证据链**：主线程执行压力上升 → 引入 agent 承担独立工作包 → runtime 开始长出更多执行者。
- **必须有的 mermaid 主图**：从单执行者到多执行者的扩张图。
- **这篇绝对不能空讲的硬货**：必须把“更多执行者”落回具体对象，不许只讲抽象协作。
- **禁止偷吃的相邻篇职责**：不把 runAgent 和 forkSubagent 细节讲完。

## 14｜runAgent 为什么像一条 agent runtime 装配线
- **这篇主问题**：runAgent 在 agent 主轴里到底扮演什么角色。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/11-runagent-assembly-line.md`
  - `docs/guidebook/volume-1/19-runagent-skill-mainline.md`
  - `docs/guidebook/volume-1/13-loadagentsdir.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/runAgent.ts`
  - `cc/src/tools/AgentTool/agentToolUtils.ts`
  - `cc/src/tools/AgentTool/loadAgentsDir.ts`
  - `cc/src/tools/AgentTool/AgentTool.tsx`
- **主证据链**：agent 定义加载 → 上下文与工具面装配 → 权限 / skills / MCP / hooks 接入 → query 主循环启动。
- **必须有的 mermaid 主图**：runAgent 装配主链图。
- **这篇绝对不能空讲的硬货**：必须讲出 runAgent 至少装了哪些关键部件，不能只说“像装配线”。
- **禁止偷吃的相邻篇职责**：不把 15-17 的 worker 分叉与回流讲完。

## 15｜为什么主 agent 还要派生 subagent
- **这篇主问题**：已经有 agent 了，为什么还需要 subagent / worker。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/12-forksubagent.md`
  - `docs/guidebook/volume-1/18-forkedagent.md`
  - `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/forkSubagent.ts`
  - `cc/src/tools/AgentTool/runAgent.ts`
- **主证据链**：主 agent 不能无限吞任务 → 需要切出受控 worker → subagent 成为主线后半段必要结果。
- **必须有的 mermaid 主图**：主 agent 到 worker 分叉必要性图。
- **这篇绝对不能空讲的硬货**：必须解释“已有 agent 为什么还不够”。
- **禁止偷吃的相邻篇职责**：不把 fork 特殊继承细节写完，不把回流篇写完。

## 16｜forkSubagent 为什么不是“再开一个 agent”
- **这篇主问题**：forkSubagent 和普通 agent 调用差在哪。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/12-forksubagent.md`
  - `docs/guidebook/volume-1/18-forkedagent.md`
  - `docs/guidebook/volume-1/11-runagent-assembly-line.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/forkSubagent.ts`
  - `cc/src/tools/AgentTool/runAgent.ts`
- **主证据链**：当前上下文切分 → 继承 prompt / 工具面 / 约束 → worker 分支运行 → 不是重新创建平级匿名 agent。
- **必须有的 mermaid 主图**：forkSubagent 继承与分叉图。
- **这篇绝对不能空讲的硬货**：必须讲继承什么、不继承什么，不能只说“更像 worker”。
- **禁止偷吃的相邻篇职责**：不把 17 的职责边界与信息回流写完。

## 17｜主 agent / worker agent 的职责边界与信息回流
- **这篇主问题**：主 agent 与 worker agent 的职责边界是什么，结果怎样回流。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/18-forkedagent.md`
  - `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/forkSubagent.ts`
  - `cc/src/tools/AgentTool/runAgent.ts`
  - `cc/src/agents/`
- **主证据链**：主 agent 派工 → worker 执行特定子任务 → 结果 / 状态回流 → 主线程重新收口。
- **必须有的 mermaid 主图**：主 agent / worker agent 边界与回流图。
- **这篇绝对不能空讲的硬货**：必须把“职责边界”和“信息回流”落成结构，不许只讲协作价值。
- **禁止偷吃的相邻篇职责**：不把 18 的三者边界总收束写完。

## 18｜agent、skill、tool 之间的边界和协作关系
- **这篇主问题**：agent、skill、tool 各自是什么层级，它们怎样协作。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/30-skill-vs-agent.md`
  - `docs/guidebook/volume-1/10-agenttool.md`
  - `docs/guidebook/volume-1/15-skilltool-bridge.md`
- **必读源码文件**：
  - `cc/src/tools/AgentTool/`
  - `cc/src/tools/SkillTool/`
  - `cc/src/tools/`
- **主证据链**：tool 做动作 → skill 组织方法 → agent 组织执行者 → 三者组成 runtime 协作谱系。
- **必须有的 mermaid 主图**：agent / skill / tool 协作边界图。
- **这篇绝对不能空讲的硬货**：必须从执行者侧重新切一次边界，不能只复述第 08 篇。
- **禁止偷吃的相邻篇职责**：不提前吃 hooks 组 / 卷六问题。

---

# Hooks 组（19-21）

## 19｜为什么平台层不仅要有能力对象，还要有运行时接缝
- **这篇主问题**：为什么平台层除了能力对象外，还必须有运行时接缝。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/06-hooks-runtime-entry.md`
  - `docs/guidebook/volume-4/09-hooks-conclusion.md`
- **必读源码文件**：
  - `cc/src/hooks/`
  - `cc/src/runtime/`
- **主证据链**：能力对象能扩动作 / 方法 / 执行者 → 但 runtime 仍需要结构化注入点与观察点 → hooks 成立。
- **必须有的 mermaid 主图**：能力对象层 vs 运行时接缝层对比图。
- **这篇绝对不能空讲的硬货**：必须说明“为什么不是有 skills / MCP / plugins 就够了”。
- **禁止偷吃的相邻篇职责**：不把 hook 分类正文讲完。

## 20｜Claude Code 的 hooks 在 runtime 里到底扮演什么角色
- **这篇主问题**：hooks 在 Claude Code runtime 里到底扮演什么角色。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/06-hooks-runtime-entry.md`
  - `docs/guidebook/volume-4/07-pretooluse-posttooluse-hooks.md`
  - `docs/guidebook/volume-4/08-sessionstart-stop-hooks.md`
- **必读源码文件**：
  - `cc/src/hooks/`
  - `cc/src/events/`
  - `cc/src/runtime/`
- **主证据链**：runtime 暴露关键接缝 → hooks 在这些位置观察 / 注入 / 干预 → 平台具备结构化接缝层。
- **必须有的 mermaid 主图**：hooks 在 runtime 中的位置图。
- **这篇绝对不能空讲的硬货**：必须点清 hooks 卡在哪些 runtime 阶段。
- **禁止偷吃的相邻篇职责**：不把每类 hooks 细表全写完。

## 21｜Claude Code 里的各类 hooks 分别在拦什么、接什么、改什么
- **这篇主问题**：不同 hooks 类型分别在拦什么、接什么、改什么。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/07-pretooluse-posttooluse-hooks.md`
  - `docs/guidebook/volume-4/08-sessionstart-stop-hooks.md`
  - `docs/guidebook/volume-4/09-hooks-conclusion.md`
- **必读源码文件**：
  - `cc/src/hooks/`
  - `cc/src/events/`
- **主证据链**：不同 hook 类型挂在不同事件接缝 → 拦截 / 注入 / 修改职责不同 → hooks 不是一个统一回调桶。
- **必须有的 mermaid 主图**：不同 hooks 类型落点图。
- **这篇绝对不能空讲的硬货**：至少把几类 hooks 的落点差异讲清楚。
- **禁止偷吃的相邻篇职责**：不把 plugins 封装问题提前写进来。

---

# Plugins 组（22-24）

## 22｜为什么有了 skills / MCP / hooks 之后，系统还需要 plugins
- **这篇主问题**：既然已有 skills / MCP / hooks，为什么还需要 plugins。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/10-plugin-capability-surface.md`
  - `docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `cc/src/plugins/`
  - `cc/src/plugin-loader/`
- **主证据链**：前面对象提供单点扩展能力 → plugins 提供更完整封装单位 → 系统进入更成熟扩展层。
- **必须有的 mermaid 主图**：skills / MCP / hooks 到 plugins 的封装升级图。
- **这篇绝对不能空讲的硬货**：必须说清 plugins 解决的不是重复功能，而是更完整封装。
- **禁止偷吃的相邻篇职责**：不把 23 / 24 的层级和成熟封装问题讲完。

## 23｜plugins 和其它扩展对象分别处在什么层级
- **这篇主问题**：plugins 和 skills / hooks / MCP 分别处在什么层级。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/10-plugin-capability-surface.md`
  - `docs/guidebook/volume-4/12-plugin-attachment-points.md`
  - `docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `cc/src/plugins/`
  - `cc/src/hooks/`
  - `cc/src/mcp/`
  - `cc/src/skills/`
- **主证据链**：skills / hooks / MCP 分别提供方法组织 / 接缝 / 外部能力源 → plugins 代表更高一级封装层。
- **必须有的 mermaid 主图**：plugins 与其它扩展对象层级图。
- **这篇绝对不能空讲的硬货**：必须把 plugins 从“兜底概念”里切出来。
- **禁止偷吃的相邻篇职责**：不把 24 的分发 / 复用成熟度讲完。

## 24｜plugins 为什么代表更完整的封装、分发和复用形态
- **这篇主问题**：为什么说 plugins 代表更完整的封装、分发和复用形态。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-4/11-plugin-loader.md`
  - `docs/guidebook/volume-4/13-plugin-validate-schema-policy.md`
  - `docs/guidebook/volume-4/14-plugin-cli-install-marketplace.md`
  - `docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `cc/src/plugins/`
  - `cc/src/plugin-loader/`
  - `cc/src/plugin-schema/`
  - `cc/src/plugin-marketplace/`
- **主证据链**：plugin 具备加载 / 校验 / 挂载 / 分发入口 → 扩展层从对象接入走向成熟封装、分发与复用。
- **必须有的 mermaid 主图**：plugin 封装 / 分发 / 复用闭环图。
- **这篇绝对不能空讲的硬货**：至少点出 loader、schema / policy、attachment、distribution 这些成熟度部件。
- **禁止偷吃的相邻篇职责**：不把卷尾平台层总收束提前写完。

---

## 25｜为什么这些扩展对象最终会收成一层平台能力
- **这篇主问题**：这些分散对象为什么最终会共同构成 Claude Code 的平台层。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/27-skills-conclusion.md`
  - `docs/guidebook/volume-4/09-hooks-conclusion.md`
  - `docs/guidebook/volume-4/15-plugin-conclusion.md`
  - `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
- **必读源码文件**：
  - `cc/src/tools/SkillTool/`
  - `cc/src/tools/AgentTool/`
  - `cc/src/mcp/`
  - `cc/src/hooks/`
  - `cc/src/plugins/`
- **主证据链**：方法组织、外部能力源、执行者结构、运行时接缝、封装层共同接入 runtime → 收束为平台能力层。
- **必须有的 mermaid 主图**：卷五平台层总收束图。
- **这篇绝对不能空讲的硬货**：必须把卷五全部对象重新压回一张图，而不是逐个重讲对象优点。
- **禁止偷吃的相邻篇职责**：不提前把卷六协作 runtime 问题讲成正文。

---

## 五、当前执行提醒

1. **派单前必须先检查该篇是否已具备旧文锚点、源码锚点、主证据链、主图方案。**
2. **如果某篇卡片还不能支撑 agent 找到原始素材，禁止直接起稿。**
3. **允许后续继续补强某些篇目的具体源码文件粒度，但当前版本已经必须优先于旧版卡片使用。**
4. **任何一篇如果写成“概念全对、证据很少”的稿子，应直接判为卡片输入不足或执行跑偏。**
5. **卷五文章默认目标不是“更像方法论文”，而是“更像有结构的源码导读”。**
