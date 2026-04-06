---
title: 卷三写作卡片
status: draft
updated: 2026-04-06
---

# 卷三写作卡片

> 用途：作为新卷三的内部写作卡片。先按新卷主问题搭骨架，再从旧文抽素材，禁止让旧文反向决定新文章结构。

---

## 01｜为什么模型意图不能直接变成现实动作

### 主问题
为什么 Claude Code 不能让模型意图直接落成现实动作，而必须存在一个 tool runtime 作为中间层？

### 核心判断句
**模型意图不能直接落成现实动作；Claude Code 必须通过 tool runtime 把结构化意图翻译成可控、可执行、可回流的现实操作。**

### 这篇必须完成的任务
- 作为卷三总起篇，先立执行层存在理由
- 把卷三和卷二区分开：卷二讲何时切到执行路径，卷三讲进入执行路径后怎么真正做事
- 让读者先理解“为什么需要这一层”，再进入工具家族

### 这篇不讲什么
- 不直接进入工具图鉴
- 不提前细讲 Bash / File / Search
- 不展开权限系统

### Mermaid 主图
1. 为什么模型意图不能直接变成现实动作
2. tool runtime 作为中间层的位置图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/02-tool-system-overview.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-2/05-how-the-system-decides-to-act.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-2/06-how-results-return-to-the-current-turn.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/messages.ts`
- `/Users/haha/.openclaw/workspace/cc/src/constants/messages.ts`

### 对后文的导流
- 第 2 篇进入执行主线总图
- 第 3 篇进入 Tool 抽象本体

---

## 02｜执行主线总图：`tool_use -> orchestration -> execution -> tool_result`

### 主问题
一次能力调用在执行层里到底怎么跑，`tool_use` 到 `tool_result` 之间的正式执行链是什么？

### 核心判断句
**Claude Code 的执行层不是“工具被调一下”，而是一条从 `tool_use` 到 orchestration，再到 execution，最后回到 `tool_result` 的正式执行链。**

### 这篇必须完成的任务
- 建立卷三主线总图
- 把读者从“会调工具”提升到“执行链如何成立”
- 为后面的 Tool 抽象和 orchestration 铺路

### 这篇不讲什么
- 不深讲单个工具内部行为
- 不提前展开权限系统
- 不把结果回流讲成卷四的上下文问题

### Mermaid 主图
1. `tool_use -> orchestration -> execution -> tool_result`
2. 执行层主线总图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/09-how-tools-enter-runtime.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/01-from-query-to-tool-call.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/volume-2/06-how-results-return-to-the-current-turn.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`
- `/Users/haha/.openclaw/workspace/cc/src/utils/messages.ts`
- `/Users/haha/.openclaw/workspace/cc/src/constants/messages.ts`

### 对后文的导流
- 第 3 篇进入 Tool 抽象
- 第 4 篇进入 orchestration

---

## 03｜Tool 为什么是 runtime 的正式执行接口

### 主问题
Tool 到底是什么对象，为什么 runtime 要把不同执行能力收成统一接口？

### 核心判断句
**Tool 不是零散函数集合，而是 Claude Code 把不同执行能力收进同一执行层的正式接口对象。**

### 这篇必须完成的任务
- 把 Tool 立为正式执行对象
- 解释为什么不同能力能被同一层接住
- 为后面 Bash / File / Search 样本建立统一观察框架

### 这篇不讲什么
- 不展开某个具体工具正文
- 不展开 skill / agent 扩展机制
- 不把这篇写成 types/API 清单

### Mermaid 主图
1. Tool 抽象分层图
2. Tool 与具体工具样本关系图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/02-tool-system-overview.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/09-how-tools-enter-runtime.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/`
- `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`

### 对后文的导流
- 第 4 篇进入 orchestration
- 第 5~9 篇作为具体工具家族样本落地

---

## 04｜orchestration 怎么接住一次 `tool_use`

### 主问题
一次 `tool_use` 进入 runtime 后，系统怎样识别、分发、调度，并把它接进统一执行链？

### 核心判断句
**orchestration 的职责不是替工具跑代码，而是把一次 `tool_use` 准确接住、分发给合适执行对象，并把这次执行纳入统一运行链。**

### 这篇必须完成的任务
- 解释 orchestration 在执行层里的位置
- 把 Tool 抽象和具体工具家族接起来
- 为 Bash / File / Search 的具体样本做桥接

### 这篇不讲什么
- 不展开单个工具内部细节
- 不主讲权限制度
- 不主讲 SkillTool / AgentTool 主链

### Mermaid 主图
1. `tool_use` 被 orchestration 接住的流程图
2. 分发到具体执行对象的桥接图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/09-how-tools-enter-runtime.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-2/01-from-query-to-tool-call.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/`

### 对后文的导流
- 第 5~9 篇进入本地工具家族样本

---

## 05｜BashTool 为什么像执行层的通用执行器

### 主问题
为什么 BashTool 在执行层里地位特殊，它为什么不是“普通 shell 包装”？

### 核心判断句
**BashTool 不是给模型一个 shell，而是执行层里最像通用执行器的正式能力对象。**

### 这篇必须完成的任务
- 立住 BashTool 的执行层地位
- 解释它为什么更像通用执行器
- 让读者看到本地工具家族里的旗舰样本

### 这篇不讲什么
- 不主讲权限制度
- 不把整篇写成命令安全篇
- 不讲卷六的控制层问题

### Mermaid 主图
1. BashTool 在执行层中的位置图
2. BashTool 执行链示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/03-bashtool-is-not-just-shell.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/02-tool-system-overview.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/BashTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/BashTool/prompt.ts`

### 对后文的导流
- 第 6~7 篇进入文件工具家族

---

## 06｜FileReadTool 怎么把现实材料接进当前判断

### 主问题
为什么读取文件不是附属动作，FileReadTool 怎样把现实材料正式接进当前判断？

### 核心判断句
**FileReadTool 的价值不只是“读文件”，而是把现实材料正式接入当前判断，让执行层拿到可继续工作的真实上下文。**

### 这篇必须完成的任务
- 立住 FileRead 的执行层作用
- 解释“读现实材料”在执行链中的位置
- 和 FileEdit / FileWrite 拉开边界

### 这篇不讲什么
- 不和 FileEdit / FileWrite 混成一篇
- 不讲长期上下文治理
- 不抢卷四的上下文职责

### Mermaid 主图
1. FileReadTool 接入现实材料图
2. 现实材料进入当前判断的桥接图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/04-filereadtool.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/FileReadTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/FileReadTool/prompt.ts`

### 对后文的导流
- 第 7 篇进入修改与落盘工具

---

## 07｜FileEdit / FileWrite 怎么把当前判断落回现实文件

### 主问题
修改文件与写入文件为什么属于执行层的另一半语义，当前判断怎样真正落回现实文件系统？

### 核心判断句
**FileEdit / FileWrite 的核心不是“改几个字符”，而是把当前判断正式落回现实文件，让执行层真正改变工作对象。**

### 这篇必须完成的任务
- 解释修改与落盘为何是另一半执行语义
- 和 FileRead 形成清晰配对
- 让读者看到执行层如何真正改变现实对象

### 这篇不讲什么
- 不回头重讲 FileRead
- 不写成参数说明书
- 不展开权限线

### Mermaid 主图
1. FileEdit / FileWrite 落盘图
2. 当前判断落回现实文件示意图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/05-fileedittool.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/06-filewritetool.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/FileEditTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/FileWriteTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/FileEditTool/prompt.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/FileWriteTool/prompt.ts`

### 对后文的导流
- 第 8~9 篇进入搜索工具家族

---

## 08｜GrepTool 怎么在现实材料里找东西

### 主问题
GrepTool 解决的到底是什么问题，为什么它属于现实材料检索，而不是能力发现？

### 核心判断句
**GrepTool 的作用不是泛泛“搜索”，而是在现实材料里做高效定位，缩短执行层从问题到证据的距离。**

### 这篇必须完成的任务
- 立住 GrepTool 的现实材料检索定位
- 和 ToolSearchTool 拉开边界
- 解释它在执行层里的价值

### 这篇不讲什么
- 不和 ToolSearchTool 混成一篇
- 不写成能力选择篇

### Mermaid 主图
1. GrepTool 在材料检索中的位置图
2. 从问题到证据的定位链图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/07-greptool.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/GrepTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/GrepTool/prompt.ts`

### 对后文的导流
- 第 9 篇进入能力发现工具

---

## 09｜ToolSearchTool 怎么在能力面里找该用什么工具

### 主问题
ToolSearchTool 为什么不是普通搜索，runtime 怎样把“该用什么能力”也变成可执行的一环？

### 核心判断句
**ToolSearchTool 搜索的不是现实材料，而是执行能力面；它解决的是“接下来该调用什么工具”，而不是“材料里有什么”。**

### 这篇必须完成的任务
- 立住 ToolSearch 的能力发现定位
- 和 GrepTool 清晰分开
- 解释执行层不仅要找材料，也要找能力

### 这篇不讲什么
- 不回头重讲 GrepTool
- 不提前讲 SkillTool / AgentTool

### Mermaid 主图
1. ToolSearchTool 在能力发现中的位置图
2. 执行层“找能力”流程图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/08-toolsearchtool.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/ToolSearchTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/ToolSearchTool/prompt.ts`

### 对后文的导流
- 第 10 篇进入非本地执行对象补全

---

## 10｜为什么执行层不只接本地工具：SkillTool / AgentTool 的位置

### 主问题
为什么执行层不只等于 Bash / File / Search，SkillTool / AgentTool 为什么也算执行对象的一种？

### 核心判断句
**Claude Code 的执行层不只接本地工具，也可以把模型意图转交给 skill / agent 这样的更高阶执行对象；执行层真正统一的是“可被 runtime 接住的执行对象”。**

### 这篇必须完成的任务
- 补全卷三执行对象地图
- 说明 SkillTool / AgentTool 在卷三的位置
- 和卷五拉开边界

### 这篇不讲什么
- 不展开 skill frontmatter / runtime interface 细节
- 不展开 agent / subagent / team runtime 主链
- 不展开扩展平台结构

### Mermaid 主图
1. 本地工具与非本地执行对象并列图
2. SkillTool / AgentTool 在执行层中的位置图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/10-agenttool.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/15-skilltool-bridge.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/17-skilltool-execution-entry.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/AgentTool/prompt.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/`
- `/Users/haha/.openclaw/workspace/cc/src/tools/SkillTool/prompt.ts`

### 对后文的导流
- 卷五继续讲扩展与多代理能力
- 第 11 篇卷尾回收执行层总图

---

## 11｜把整条执行层重新压成一张稳定运行图

### 主问题
卷三前十篇共同建立了什么，读者最后该怎样把执行层压成一张稳定图？

### 核心判断句
**卷三真正建立的，不是若干工具说明书，而是一张执行层稳定运行图：模型意图如何进入 tool runtime，被 orchestration 接住，落成不同类型的执行对象，再把结果接回主循环。**

### 这篇必须完成的任务
- 回收前十篇职责
- 把执行层压成稳定运行图
- 导向卷四 / 卷五 / 卷六

### 这篇不讲什么
- 不重新展开每个工具家族正文
- 不抢后续各卷主展开职责

### Mermaid 主图
1. 卷三执行层稳定运行总图
2. 卷三 -> 卷四 / 卷五 / 卷六 导流图

### 需要参考的老文档（绝对路径）
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/02-tool-system-overview.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebook/volume-1/09-how-tools-enter-runtime.md`
- `/Users/haha/.openclaw/workspace/claude-code-source-guide/docs/guidebookv2/README.md`

### 需要参考的源代码文件（绝对路径）
- `/Users/haha/.openclaw/workspace/cc/src/QueryEngine.ts`
- `/Users/haha/.openclaw/workspace/cc/src/tools/`
- `/Users/haha/.openclaw/workspace/cc/src/utils/messages.ts`

### 对后文的导流
- 卷四：上下文与状态怎么维持系统持续工作
- 卷五：外部扩展与多代理能力
- 卷六：命令、工作流与产品层整合
