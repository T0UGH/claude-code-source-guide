---
title: 卷五写作卡片
status: draft
updated: 2026-04-11
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

> 这一组的新目标不是把旧 skills 文章拆开重排，而是用 **5 个连续问题** 帮读者同时得到两层收获：
> 
> 1. **源码心智模型**：看清 skill 在 Claude Code 里到底是什么、怎么成立、怎么运行。
> 2. **使用反哺**：读完以后，读者会更会判断什么时候该写 skill、怎么写 skill、什么时候不该用 skill。
>
> 五篇固定坡度：
>
> 1. **它是什么，不是什么**
> 2. **它为什么值钱**
> 3. **它怎么运行**
> 4. **它怎样才算写对**
> 5. **它和其它扩展对象怎么分工**
>
> **源码锚点说明**：本组卡片里出现的 `cc/src/...` 路径，默认指向 Claude Code 上游源码镜像中的真实文件锚点，**不要求当前 `claude-code-source-guide` 仓库本地存在同路径源码**。如果本仓库无法直接核对源码，执行时应优先回收旧文中的 `source_files`、已完成文章中的源码证据链，以及写作卡片明确指定的函数 / 文件名，不得因为本地缺少 `cc/src` 就把文章写成无源码支撑的概念文。

## 04｜Skill 不是长 prompt，而是 Claude Code 的方法单元
- **这篇主问题**：为什么 skill 不能被理解成“更长、更规范一点的 prompt”。
- **这篇对读者的直接收益**：读完以后，读者应立即放弃“把 skill 当提示词收藏夹”的心智模型，开始把 skill 理解成“可复用方法单元”。
- **文章角色**：破误解篇。必须下刀够快，先劈开 skill ≠ prompt，后面四篇才站得住。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/21-skill-frontmatter-fields.md`
  - `docs/guidebook/volume-1/15-skilltool-bridge.md`
  - `docs/guidebook/volume-1/27-skills-conclusion.md`
- **必读源码文件**：
  - `cc/src/skills/loadSkillsDir.ts`
  - `cc/src/tools/SkillTool/SkillTool.ts`
  - `cc/src/commands.ts` 或 `cc/src/commands/`
- **主证据链**：`SKILL.md` 不会以裸文本直接运行 → frontmatter 会先被解析成 runtime 字段 → skill 会被编译成 `type: 'prompt'` 的 command-like 对象 → SkillTool 负责统一调用面 → 所以变化的不是字数，而是系统地位。
- **必须有的 mermaid 主图**：`SKILL.md → frontmatter 解析 → Command 对象 → SkillTool 调用面` 的转化图。
- **必须讲出来的 3 个硬点**：
  1. skill 至少同时具有 **定义层 / 发现层 / 调用层**，不是纯内容层。
  2. frontmatter 不是排版信息，而是运行时声明。
  3. SkillTool 不是“读文档器”，而是方法单元的统一调用面。
- **绝对不能写成什么**：
  - “skill 和 prompt 都很重要”的和稀泥文
  - 字段说明书
  - 空泛的“Claude Code 很先进”概念文
- **禁止偷吃的相邻篇职责**：
  - 不展开 skill 为什么会显著提升使用体验（那是 05）
  - 不把 inline / fork 执行链写完（那是 06）
  - 不讲好坏 skill 判准（那是 07）
- **标题下导语必须立住的一句话**：
  - **prompt 是一次性输入，skill 是 Claude Code 可发现、可调用、可复用的方法单元。**

## 05｜为什么 Skill 能让 Claude Code 从“会做”变成“稳定会做”
- **这篇主问题**：Claude Code 明明已经会对话、会调工具了，为什么还需要 skill 这一层。
- **这篇对读者的直接收益**：读完以后，读者应会判断“什么值得 skill 化”，知道 skill 的价值在于把偶然成功的方法沉淀成稳定可复用的方法。
- **文章角色**：价值锚点篇。它要把 skills 组立成“能力定制重轴”，不是“提示词复用组”。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/24-skillify.md`
  - `docs/guidebook/volume-1/23-good-runtime-skill.md`
  - `docs/guidebook/volume-1/27-skills-conclusion.md`
- **必读源码文件**：
  - `cc/src/skills/bundled/skillify.ts`
  - `cc/src/skills/loadSkillsDir.ts`
  - `cc/src/tools/SkillTool/SkillTool.ts`
- **主证据链**：没有 skill 时，高质量协作往往依赖用户重复交代 + 上下文刚好完整 + 模型这次刚好没跑偏 → `skillify` 证明官方真正想沉淀的是 `repeatable process`，包括 inputs / steps / success criteria / tools / agents / checkpoint → skill 的真正价值是把“这次做对了”变成“以后还能稳定做对”。
- **必须有的 mermaid 主图**：`临场成功协作 → 抽取 repeatable process → 变成 reusable skill → 回到后续任务复用` 的闭环图。
- **必须讲出来的 4 个硬点**：
  1. skill 承接的是 **方法**，不是某次答案。
  2. `skillify` 最值钱的不是自动生成文件，而是定义了“什么样的流程才值得沉淀”。
  3. skill 让用户偏好、流程、成功标准、人工 checkpoint 变成未来可调用对象。
  4. 这一层会直接改变 Claude Code 的稳定性，而不仅是便利性。
- **绝对不能写成什么**：
  - 抒情式“用户经验很重要”
  - 只讲角色结构，不解释它为什么对稳定性有价值
  - 把 05 写成 04 的另一版“skill 不是 prompt”
- **禁止偷吃的相邻篇职责**：
  - 不详细走 SkillTool 调用链（那是 06）
  - 不把好 skill 判准讲成 checklist（那是 07）
  - 不把 skill / tool / agent 边界讲完（那是 08）
- **标题下导语必须立住的一句话**：
  - **skill 的作用不是多加一个能力点，而是把 Claude Code 从“有时会做”推进到“能稳定复用地做”。**
- **推荐 section skeleton（起稿顺序）**：
  1. **导语：为什么 Claude Code 明明已经会调工具，还会反复出现“这次做对了、下次又飘”的问题**
     - 开门先点真实使用痛点：Claude Code 不是不会做，而是很多高质量协作依赖临场上下文、用户重复交代和模型当场状态。
     - 这一段的任务不是解释 skill 机制，而是先让读者承认“稳定复用”本身就是问题。
  2. **没有 skill 时，Claude Code 的高质量协作为什么容易停留在一次性成功**
     - 展开三类脆弱来源：
       - 用户偏好要反复重说
       - 流程顺序和成功标准留在当前会话里
       - 角色分工只存在于当场协作，不会自动继承
     - 这里要落一条判断：没有 skill 时，Claude Code 当然也能做成很多事，但这种“会做”常常不稳定。
  3. **`skillify` 为什么是这一篇最关键的源码证据**
     - 直接切进 `skillify.ts` 的定位：它不是在“保存 prompt”，而是在捕捉 `repeatable process`。
     - 明确列出它关心的东西：inputs、steps、success criteria、tools、agents、human checkpoint。
     - 这里要点出：官方自己已经把 skill 定义成“把一次成功协作抽成未来可重跑的方法单元”。
  4. **skill 接进系统的，首先不是答案，而是方法**
     - 这一节专讲“答案”和“方法”的差别：
       - 答案是一次性交付
       - 方法是可复用组织
     - 必须把“用户真正想保留下来的，通常不是某次输出，而是判断顺序、约束边界、完成标准”写透。
  5. **skill 为什么会直接改变 Claude Code 的稳定性，而不只是便利性**
     - 这一节要把价值抬高：
       - 它不是省几句 prompt
       - 而是让未来任务更容易命中正确方法、更少漂移、更少重复沟通
     - 建议用“有 skill / 无 skill”的对照表写，效果会更清楚。
  6. **经验、流程、角色结构，分别是怎么被压进 skill 的**
     - 分三小段讲：
       - 经验：哪些判断先做、哪些坑先避开
       - 流程：先后顺序、例外处理、成功标准
       - 角色结构：什么该留在主线程，什么该交给独立执行者
     - 这里可以自然把后面 agent 主轴的坡度铺出来，但只能点到为止。
  7. **为什么这一篇必须把 skill 立成“能力定制重轴”**
     - 回到卷五位置说明：如果这一篇立不住，skills 组就会被读成“提示词复用组”。
     - 要明确说出：skill 让用户自己的做事方式第一次以对象形式进入系统能力面。
  8. **收口：Claude Code 不是因为多了 skill 才能做事，而是因为有了 skill 才更可能稳定把事做对**
     - 结尾不要再回机制细节，而是把使用收益收稳。
- **建议本篇至少出现的 2 个对照表 / 小图**：
  - `无 skill 的一次性成功` vs `有 skill 的稳定复用`
  - `答案 / 方法 / 执行者` 三层对照小表

## 06｜Skill 在源码里怎么跑起来：从 SKILL.md 到 inline / fork
- **这篇主问题**：skill 在 Claude Code runtime 里到底怎样被发现、展开、执行，并最终回流当前 turn。
- **这篇对读者的直接收益**：读完以后，读者应真正理解 inline / fork 的差别，知道为什么 skill 设计会影响工具权限、模型、effort、工作路径。
- **文章角色**：机制主链篇。它必须提供这组里最硬的一条源码执行链。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/16-loadskillsdir.md`
  - `docs/guidebook/volume-1/17-skilltool-execution-entry.md`
  - `docs/guidebook/volume-1/18-forkedagent.md`
  - `docs/guidebook/volume-1/19-runagent-skill-mainline.md`
- **必读源码文件**：
  - `cc/src/skills/loadSkillsDir.ts`
  - `cc/src/tools/SkillTool/SkillTool.ts`
  - `cc/src/utils/processUserInput/processSlashCommand.tsx`
  - `cc/src/utils/forkedAgent.ts`
  - `cc/src/tools/AgentTool/runAgent.ts`
- **主证据链**：`loadSkillsDir` 先把 skill 编译成 command 对象 → `getSkillToolCommands(...)` 决定哪些 skill 能进模型可见能力面 → assistant 调用 SkillTool → `findCommand(...)` 定位 skill → 若 inline，走 `processPromptSlashCommand(...)` 并把消息 / allowedTools / model / effort 回注当前 turn → 若 fork，走 `executeForkedSkill(...)` / `prepareForkedCommandContext(...)`，最终接到 `runAgent(...)` → 结果回流当前线程。
- **必须有的 mermaid 主图**：`发现 → 调用 → inline/fork 分流 → runAgent 连接 → 回流 turn` 的完整主链图。
- **必须讲出来的 5 个硬点**：
  1. skill 先是对象，后才可能进入执行链。
  2. 发现层不是附属效果，而是前置筛选步骤。
  3. inline skill 会改当前线程的工作方式，不只是塞一段文本。
  4. fork skill 不是另起神秘黑盒，而是把工作包交给 agent runtime。
  5. skills runtime 和 agent runtime 在 fork 路径上是正式接上的。
- **绝对不能写成什么**：
  - 单纯的源码漫游记录
  - “把函数按调用顺序抄一遍”的散步文
  - 没有 inline / fork 对照关系的链路文
- **禁止偷吃的相邻篇职责**：
  - 不把“好 skill 的标准”写成主角（那是 07）
  - 不把 skill / tool / agent 边界展开成总论（那是 08）
- **标题下导语必须立住的一句话**：
  - **skill 的强，不在于能展开文本，而在于它能组织执行。**

## 07｜什么样的 Skill 才真的好用：从 runtime 约束反推设计原则
- **这篇主问题**：什么样的 skill 才算好 skill，能被系统稳定发现、稳定执行、稳定不变形。
- **这篇对读者的直接收益**：读完以后，读者应会写、会改、会挑 skill，也能判断一个第三方 skill 为什么“总想不起来 / 总跑飘 / 总抢活”。
- **文章角色**：判准篇。它必须像架构评审，而不是像写作建议合集。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/23-good-runtime-skill.md`
  - `docs/guidebook/volume-1/24-skillify.md`
  - `docs/guidebook/volume-1/21-skill-frontmatter-fields.md`
  - `docs/guidebook/volume-1/29-when-to-use-vs-description.md`
- **必读源码文件**：
  - `cc/src/skills/loadSkillsDir.ts`
  - `cc/src/tools/SkillTool/SkillTool.ts`
  - `cc/src/skills/bundled/skillify.ts`
- **主证据链**：发现层会筛掉描述模糊、触发语义不足的 skill → frontmatter 高影响字段会真实改变执行行为 → inline / fork 两条路径都要求正文具备 workflow 结构 → `skillify` 官方样板又反向给出 inputs / steps / success criteria / artifacts / checkpoint / rules 的骨架 → 因此“好 skill”首先是 runtime 上成立，其次才是文笔好看。
- **必须有的 mermaid 主图**：`发现稳定性 / 执行边界 / 工作流结构 / 完成判据 / 重复使用不变形` 的 runtime 分岔图。
- **必须给出的 5 条硬判准**：
  1. 职责单一稳定
  2. 发现稳定（`description` / `when_to_use` 有区分度）
  3. 运行影响克制（权限、fork、model、effort 只在必要时改）
  4. 正文是工作流，不是散文
  5. 完成判据明确，能稳定回流结果
- **绝对不能写成什么**：
  - “好 skill checklist” 空话文
  - 纯写作技巧文
  - 不敢说坏味道的温和总结文
- **必须点名的常见坏味道**：
  - 万能 skill
  - `description` / `when_to_use` 写虚
  - 无脑 `context: fork`
  - 权限和模型声明发胖
  - 正文只有理念没有动作
  - 没有 success criteria
- **禁止偷吃的相邻篇职责**：
  - 不展开 08 的对象边界总收束
- **标题下导语必须立住的一句话**：
  - **好 skill 不是写得最花的 prompt，而是能稳定被发现、稳定被执行、稳定不变形的方法单元。**

## 08｜什么时候该用 Skill，什么时候该用 tool / agent / MCP
- **这篇主问题**：实际工作里该怎样选抽象层；skill、tool、agent、MCP 分别该在什么问题上出场。
- **这篇对读者的直接收益**：读完以后，读者应少犯 3 种大错：把 tool 用成 workflow、把 skill 写成半成品 agent、把本该接 MCP 的能力硬写成 skill。
- **文章角色**：决策与边界收口篇。不是只给定义，而是给“以后怎么选”的判断框架。
- **必须回收的旧文章**：
  - `docs/guidebook/volume-1/30-skill-vs-agent.md`
  - `docs/guidebook/volume-1/15-skilltool-bridge.md`
  - `docs/guidebook/volume-1/10-agenttool.md`
  - `docs/guidebook/volume-4/01-mcp-runtime-entry.md`
  - `docs/guidebook/volume-4/03-cli-plus-skill-vs-many-mcp.md`
- **必读源码文件**：
  - `cc/src/tools/SkillTool/SkillTool.ts`
  - `cc/src/tools/AgentTool/runAgent.ts`
  - `cc/src/utils/forkedAgent.ts`
  - `cc/src/commands.ts` 或 `cc/src/commands/`
  - `cc/src/mcp/`
- **主证据链**：tool 直接暴露动作原语 → skill 暴露方法组织对象 → agent 负责执行者装配与分叉 → MCP 提供系统外能力源 / 资源系统入口 → 四者都能进入 runtime，但解决的不是同一类问题 → 所以选错抽象层，就会导致工作流发胖、职责串线、系统边界混乱。
- **必须有的 mermaid 主图**：`问题类型 → 该选 tool / skill / agent / MCP` 的决策分流图。
- **必须讲出来的 4 个硬点**：
  1. tool 解决“现在能做什么动作”
  2. skill 解决“这些动作该怎么组织成稳定方法”
  3. agent 解决“谁来承担这段工作、如何继续分叉与回流”
  4. MCP 解决“怎样从系统外接入能力源和资源系统”
- **必须给出的 4 个读者决策题**：
  - 什么时候直接调 tool 就够
  - 什么时候值得沉淀成 skill
  - 什么时候必须让 agent 承接
  - 什么时候根本不是 skill 问题，而是应该接 MCP
- **绝对不能写成什么**：
  - 只讲定义不讲选择情境
  - 只讲 skill / tool / agent，不把 MCP 放回卷五对象体系
  - 纯边界术语收口文
- **禁止偷吃的相邻篇职责**：
  - 不把 Agent 主轴正文细节提前讲完
  - 不把 MCP 组三篇提前写成详解
- **标题下导语必须立住的一句话**：
  - **tool 解决动作，skill 解决方法，agent 解决执行者，MCP 解决外部能力源；真正会用 Claude Code，关键不只是会调用，而是会选层。**

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

## 12｜Claude Code 里的 agent，跟 tool 不是一回事
- **这篇主问题**：为什么 Claude Code 里的 agent，不能被理解成更聪明一点、更复杂一点的 tool。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/10-agenttool.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/30-skill-vs-agent.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/02-tool-system-overview.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/`
- **主证据链**：tool 解决的是一次能力调用 → agent 解决的是把一个子任务交给另一个执行者去推进 → AgentTool 表面上挂在 tool 入口里，实际触发的是一个执行者单位，而不是一次普通工具动作。
- **必须有的 mermaid 主图**：tool vs agent 的对象层级对照图；一次 tool call 与一次 agent 委派的执行差异图。
- **这篇绝对不能空讲的硬货**：必须把“动作接口”和“执行者单位”切开，至少压回 `AgentTool.tsx` 的入口形态和 agent prompt / task 委派这一层，不能只写概念判断。
- **禁止偷吃的相邻篇职责**：不展开 built-in agents / loadAgentsDir 的对象名册，不提前讲 subagent / worker 的运行时分叉。

## 13｜Claude Code 一开始就准备了一组 agent
- **这篇主问题**：为什么 Claude Code 里的 agent 不是临时冒出来的角色，而是一开始就准备好的一组执行者对象。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/13-loadagentsdir.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/14-builtinagents.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/loadAgentsDir.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/agents/`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/agentToolUtils.ts`
- **主证据链**：系统先有 agent definitions / built-in agents / loadAgentsDir 这条装载链 → runtime 里先成立一份执行者名册 → 所以后面出现的不是“突然多了个角色”，而是系统本来就承认一组可加载执行者。
- **必须有的 mermaid 主图**：agent definitions → built-in agents → loadAgentsDir 的对象成立图；单 agent 幻觉 vs agent 名册现实图。
- **这篇绝对不能空讲的硬货**：必须把“不是一个，是一组”压回具体 definitions / built-ins / load 过程，至少点清 GENERAL / PLAN / EXPLORE / VERIFICATION 这一类模板为何重要。
- **禁止偷吃的相邻篇职责**：不把 runAgent 的运行时装配细节讲完，不把“为什么主 agent 还要继续拆活”提前解释掉。

## 14｜这组 agent 是怎么被拉进当前任务的
- **这篇主问题**：系统里已经准备好的这组 agent，是怎么在一次真实任务里被拉进当前运行主线的。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/11-runagent-assembly-line.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/19-runagent-skill-mainline.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/13-loadagentsdir.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/agentToolUtils.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/loadAgentsDir.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/AgentTool.tsx`
- **主证据链**：agent 名册先成立 → AgentTool / runAgent 在当前调用里选择并装配合适 agent → prompt、工具面、skills、权限、上下文一起进入这次运行 → 静态对象才真正变成当前任务里在场的执行者。
- **必须有的 mermaid 主图**：agent 名册进入当前任务的进场图；runAgent 把 prompt / tools / contexts / constraints 装进一次 agent 运行的主链图。
- **这篇绝对不能空讲的硬货**：必须讲出 runAgent 至少装了哪些关键部件，以及“系统里有一组 agent”和“这一轮任务里它们真的上场了”之间差在哪。
- **禁止偷吃的相邻篇职责**：不把主 agent 的负载问题讲成 15，不把 forkSubagent 的继承与分叉细节讲成 16。

## 15｜为什么主 agent 还要继续把活拆出去
- **这篇主问题**：既然系统已经有 agent 了，为什么主 agent 在运行时还不能自己做完，还要继续把局部工作拆给 subagent / worker。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/12-forksubagent.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/forkSubagent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/agents/`
- **主证据链**：agent 名册解决的是“系统里有哪些执行者” → 但真实任务里还会出现局部探索、验证、旁路试错、上下文隔离这些负担 → 主 agent 不能无限吞下所有局部工作 → 于是 subagent / worker 变成运行时继续拆活的结果。
- **必须有的 mermaid 主图**：主 agent 负载增长到必须拆活的因果图；全局主线 vs 局部子任务分流图。
- **这篇绝对不能空讲的硬货**：必须解释“为什么已经有一组 agent 还不够”，并把答案压回至少一种真实负载场景：探索、验证、局部执行或上下文隔离。
- **禁止偷吃的相邻篇职责**：不把 forkSubagent 的继承结构细讲完，不把结果回流与收口机制提前讲完。

## 16｜subagent 不是另起一个指挥部
- **这篇主问题**：fork 出来的 subagent，到底为什么不是再起一个平级总控，而更像主 agent 切出去的一段执行分支。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/12-forksubagent.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/11-runagent-assembly-line.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/forkSubagent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/agentToolUtils.ts`
- **主证据链**：主 agent 决定拆出局部任务 → forkSubagent 继承当前任务的一部分上下文、约束与目标 → 子分支只在局部边界内推进 → 所以它不是再起一个平级老板，而是带边界的执行支路。
- **必须有的 mermaid 主图**：forkSubagent 的继承与裁切图；主 agent / subagent 的上下文与权限边界图。
- **这篇绝对不能空讲的硬货**：必须点清继承什么、不继承什么，尤其是目标范围、上下文面、工具面或约束边界里至少两项，不能只说一句“更像 worker”。
- **禁止偷吃的相邻篇职责**：不把主 agent / subagent 的最终收口关系讲成 17，不把三者边界总收束讲成 18。

## 17｜拆出去的活，最后怎么回到主线
- **这篇主问题**：主 agent 把活拆给 subagent / worker 之后，结果、状态和判断是怎样重新回到主线里的。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/18-forkedagent.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/11-runagent-assembly-line.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/forkSubagent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/runAgent.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/agents/`
- **主证据链**：主 agent 派出局部任务 → subagent 在边界内完成探索 / 验证 / 局部执行 → 结果回到主 agent 的当前判断面 → 主线程据此继续决策与收口 → 多执行者结构才不会把主线拆散。
- **必须有的 mermaid 主图**：主 agent → subagent → 主 agent 的回流闭环图；局部执行结果如何回到主线判断面的示意图。
- **这篇绝对不能空讲的硬货**：必须把“谁负责全局目标、谁负责局部任务、结果怎样回流”压成一条结构链，不能只写协作价值或分工口号。
- **禁止偷吃的相邻篇职责**：不把 18 的 agent / skill / tool 总边界写完。

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

## 19｜Claude Code 的 hooks，为什么不是挂几个脚本这么简单
- **这篇主问题**：为什么 Claude Code 里的 hooks 不能被理解成顺手挂几段自动化脚本，而必须被看成正式 runtime 机制。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/06-hooks-runtime-entry.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/09-hooks-conclusion.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/types/hooks.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/hooks.ts`
- **主证据链**：hooks 不是“哪里都能随便塞脚本” → `types/hooks.ts` 先把事件空间和返回语义收紧 → `utils/hooks.ts` 再把 hook 执行与结果聚合成正式 runtime 行为 → hook 的影响结果随后回流给 query / tool / lifecycle 消费链 → 所以它不是附属脚本系统，而是受边界约束的运行时干预层。
- **必须有的 mermaid 主图**：事件定义 → hook 执行 → 结果回流 runtime 的机制图。
- **这篇绝对不能空讲的硬货**：必须把“事件怎么定义、返回值有什么语义、结果怎么回流 runtime”这三件事压清楚，不展开工具链和生命周期链正文。
- **禁止偷吃的相邻篇职责**：不把工具执行链细节讲成 20，不把会话生命周期链细节讲成 21。

## 20｜工具怎么跑，hooks 其实真的插得上手
- **这篇主问题**：为什么 `PreToolUse` / `PermissionRequest` / `PostToolUse` 这些 hooks 已经不是观察者，而是真的插进了工具执行决策链。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/07-pretooluse-posttooluse-hooks.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/06-hooks-runtime-entry.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/services/tools/toolExecution.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/hooks.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/cli/structuredIO.ts`
- **主证据链**：工具执行不是直接 `permission -> call -> result` 三步 → `runPreToolUseHooks(...)` 先改输入、补上下文、给权限判断甚至阻断继续 → `PermissionRequest` hook 与真实权限提示合流 → `PostToolUse / Failure` 再改写结果或补上下文 → hooks 因而进入工具执行决策链，而不只是执行前后通知。
- **必须有的 mermaid 主图**：tool execution pipeline 中 hooks 插入点总图。
- **这篇绝对不能空讲的硬货**：至少讲清三件事：谁能改输入、谁能参与 allow/deny/ask、谁能改结果回流。不能再重复证明 hooks 是正式 runtime 机制。
- **禁止偷吃的相邻篇职责**：不把 SessionStart / Stop / UserPromptSubmit 生命周期链提前讲完。

## 21｜一轮会话怎么起、怎么进、怎么收，hooks 其实都能插手
- **这篇主问题**：为什么 hooks 不只管工具，还能进入 `SessionStart`、`UserPromptSubmit`、`Stop / SubagentStop` 这些会话生命周期位置。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/08-sessionstart-stop-hooks.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/06-hooks-runtime-entry.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/09-hooks-conclusion.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/utils/sessionStart.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/processUserInput/processUserInput.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/query/stopHooks.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/query.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/utils/hooks.ts`
- **主证据链**：hooks 已经证明能进入工具执行 → 再往下看，它还能塑造会话起点、用户输入入口和 query 尾部 stop 判定 → `SessionStart` 能补初始上下文 / 首条消息 / watchPaths，`UserPromptSubmit` 能拦截输入，`Stop / SubagentStop` 能影响这一轮怎么收 → hooks 因而覆盖整条会话生命周期，不只是工具链回调。
- **必须有的 mermaid 主图**：SessionStart → UserPromptSubmit → query → Stop/SubagentStop 生命周期链图。
- **这篇绝对不能空讲的硬货**：必须把“起点—入口—收口”三段都压清楚，不再回头讲 hooks 为什么重要。
- **禁止偷吃的相邻篇职责**：不把 plugins 的更高一层封装问题提前写进来。

---

# Plugins 组（22-24）

## 22｜为什么前面这些扩展点加起来，还是不够
- **这篇主问题**：既然前面已经有了 skills、MCP、hooks、agent 这些扩展对象，为什么系统还是不满足于“很多扩展点并存”，还要再长出 plugins 这一层。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/10-plugin-capability-surface.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/types/plugin.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/plugins/`
  - `/Users/haha/.openclaw/workspace/cc/src/plugin-loader/`
- **主证据链**：前面的对象分别解决方法组织、外部能力源、运行时接缝、执行者结构 → 但它们仍然是分面接入，不是统一封装单位 → 没有统一封装单位，就会出现来源分散、启停分散、治理分散、分发分散的问题 → plugin 因而不是在加一个重复对象，而是在回答“多扩展点并存为什么还不够”。
- **必须有的 mermaid 主图**：分散扩展点并存 → 统一封装单位出现的升级图。
- **这篇绝对不能空讲的硬货**：必须说清没有统一封装单位时到底会散在哪里，不能提前把 plugin 的内部组成讲成主体答案。
- **禁止偷吃的相邻篇职责**：不把 plugin 到底是什么讲成 23，不把平台化收束讲成 24。
- **标题下导语必须立住的一句话**：
  - **前面已经有很多扩展点，不等于系统已经有了插件层。**

## 23｜plugin 到底是什么，它不是哪一种扩展点的壳
- **这篇主问题**：plugin 到底是什么，为什么它既不是 hooks 的壳、不是 marketplace 安装包、也不是某一种扩展点的同义词。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/10-plugin-capability-surface.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/12-plugin-attachment-points.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/types/plugin.ts`
  - `/Users/haha/.openclaw/workspace/cc/src/plugins/`
  - `/Users/haha/.openclaw/workspace/cc/src/hooks/`
  - `/Users/haha/.openclaw/workspace/cc/src/mcp/`
  - `/Users/haha/.openclaw/workspace/cc/src/skills/`
- **主证据链**：`LoadedPlugin` 从定义层就同时承载 commands / agents / skills / hooks / output styles / MCP / LSP / settings → hooks、skills、MCP 只是它能承载的组件面，而不是它的全部 → plugin 因而首先是统一运行时对象 / 统一能力承载对象，其次才可能进入安装与分发体系。
- **必须有的 mermaid 主图**：LoadedPlugin 统一承载多能力面的结构图。
- **这篇绝对不能空讲的硬货**：必须把“plugin 不是哪一种扩展点的壳”压回 `LoadedPlugin` 这种统一运行时对象，而不是只做概念分层。
- **禁止偷吃的相邻篇职责**：不把 pluginLoader / schema / marketplace 的平台化收束讲成 24。
- **标题下导语必须立住的一句话**：
  - **plugin 先是统一运行时对象，后面才轮到安装、治理和分发。**

## 24｜为什么 plugins 最后会长成一层平台边界
- **这篇主问题**：为什么围绕 plugin 这个统一对象，系统最后还会继续长出 loader、schema、policy、install、marketplace，直到它变成一层平台边界。
- **必须回收的旧文章**：
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/11-plugin-loader.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/13-plugin-validate-schema-policy.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/14-plugin-cli-install-marketplace.md`
  - `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-4/15-plugin-conclusion.md`
- **必读源码文件**：
  - `/Users/haha/.openclaw/workspace/cc/src/plugin-loader/`
  - `/Users/haha/.openclaw/workspace/cc/src/plugin-schema/`
  - `/Users/haha/.openclaw/workspace/cc/src/plugin-marketplace/`
  - `/Users/haha/.openclaw/workspace/cc/src/plugins/`
- **主证据链**：系统先有统一 `LoadedPlugin` 对象 → 再需要 `pluginLoader` 统一装配多来源插件 → 再需要 schema / validate / policy 守治理边界 → 再需要 install / update / marketplace 提供产品级分发链 → plugin 因而不再只是能力包，而开始承担整套扩展世界的平台边界。
- **必须有的 mermaid 主图**：plugin contract / loader / validate / policy / install / marketplace 的平台化总图。
- **这篇绝对不能空讲的硬货**：至少点出 `LoadedPlugin`、pluginLoader、schema/policy、install/marketplace 这四块是如何一起把 plugin 推成平台边界的。
- **禁止偷吃的相邻篇职责**：不把卷尾平台层总收束提前写成 25。
- **标题下导语必须立住的一句话**：
  - **plugin 不是停在能力包这一步，而是会继续长成治理和分发都围着它转的平台边界。**

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
