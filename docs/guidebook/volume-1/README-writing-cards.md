---
title: 卷一写作卡片
status: draft
updated: 2026-04-06
---

# 卷一写作卡片

> 用途：作为新卷一的内部写作卡片。每篇先定主问题、核心判断、主图、边界，再起正文。

---

## 01｜Claude Code 到底是什么系统

### 主问题
Claude Code 到底是什么系统，为什么不能把它仅仅理解成“会聊天的 CLI”或“能调工具的命令行产品”？

### 核心判断句
**Claude Code 不是一个聊天壳，而是一套把模型、运行时、执行能力、上下文和扩展能力编织在一起的 agent runtime。**

### 这篇必须完成的任务
- 先立全书入口姿势
- 先打掉“聊天壳 / 功能堆”的错误直觉
- 先把 Claude Code 作为 runtime 的整体定位摆正
- 顺手解释这本书为什么按系统地图来读，而不是按源码目录逛

### 这篇不讲什么
- 不深挖 QueryEngine 调用链
- 不深挖具体工具实现
- 不展开权限、MCP、team runtime 的实现细节

### Mermaid 主图
1. Claude Code 系统总图
2. 全书阅读导航图（简版）

### 对后文的导流
- 把“系统整体定位”导向第 2 篇的对象地图
- 让读者接受：后面所有卷都是在继续拆同一个 runtime

---

## 02｜Claude Code 由哪些核心对象组成

### 主问题
Claude Code 里最关键的对象分别是什么，它们彼此如何协作，为什么后面所有实现细节都应该回收到这张对象地图里理解？

### 核心判断句
**Claude Code 不是一条单线系统，而是多类对象协同工作的运行时；后面所有细节，本质上都可以回收进这张对象地图里理解。**

### 这篇必须完成的任务
- 把 prompt / command / tool / agent / skill / context / session / runtime 这些对象认全
- 给出对象边界，而不是功能堆叠
- 建立对象之间的上下级关系、协作关系、依赖关系
- 替后面几卷做对象级导流

### 这篇不讲什么
- 不讲对象的详细源码实现
- 不讲字段级定义
- 不把对象边界文写成功能教程

### Mermaid 主图
1. 核心对象关系图
2. 对象分层图（用户层 / runtime 层 / capability 层 / extension 层）

### 对后文的导流
- 第 3 篇从对象切到动态主线
- 后面每一卷都可以回指这张对象地图

---

## 03｜一次请求是怎么跑成一次 Agent Turn 的

### 主问题
用户输入之后，Claude Code 的一次 agent turn 大致如何展开，为什么它的基本运行单位不是“回一句话”，而是一轮可以持续下去的 agent turn？

### 核心判断句
**Claude Code 的基本运行单位不是“单条回复”，而是一轮可持续展开的 agent turn。**

### 这篇必须完成的任务
- 给出一次请求的总流程图
- 让读者看到 user input / query / tool_use / tool_result / continuation 的闭环
- 说明“主循环”为什么会成为全书的动态主线
- 把复杂实现压到后续卷去，不在这里展开

### 这篇不讲什么
- 不细拆 QueryEngine 源码
- 不展开各类输入分流细节
- 不逐层解释 tool execution 内部实现

### Mermaid 主图
1. Agent turn 总流程图
2. 输入 → query → tool_use → tool_result → continuation 闭环图

### 对后文的导流
- 直接导向卷二
- 同时为第 4 篇“执行能力层”做铺垫

---

## 04｜Claude Code 怎么把模型意图落成执行能力

### 主问题
模型产出的结构化意图，Claude Code 是怎样通过 tool runtime 把它落成真实执行动作的？

### 核心判断句
**Claude Code 的执行能力层，是 runtime 把模型意图翻译成现实动作的关键接口层，而 tool 是这层里的正式执行对象。**

### 这篇必须完成的任务
- 从全景角度解释 tool 在系统中的位置
- 讲清 `tool_use -> orchestration -> execution -> tool.call -> tool_result` 这条总链
- 解释为什么模型不是直接“调函数”
- 给后面的工具系统卷搭桥

### 这篇不讲什么
- 不深挖 BashTool / FileReadTool / FileEditTool 细节
- 不展开权限系统的制度性分析
- 不把工具层写成局部源码导读

### Mermaid 主图
1. `tool_use -> orchestration -> execution -> tool.call -> tool_result` 总图
2. Tool 抽象层与具体工具样本关系图

### 对后文的导流
- 导向卷三工具系统
- 和第 3 篇动态主线形成“总流程 / 执行层”配对

---

## 05｜Claude Code 怎么维持上下文、状态与持续工作

### 主问题
Claude Code 为什么不是“一问一答后就重启”，它是如何依靠上下文、状态和压缩机制维持长期工作的？

### 核心判断句
**Claude Code 真正难的，不只是调用能力，而是怎样长期工作而不失控；上下文与状态管理是这套系统的生命线。**

### 这篇必须完成的任务
- 解释 message / context / system prompt / session 的大概位置
- 讲清为什么 collapse / compact / restore 会存在
- 让读者理解“持续工作能力”是系统性问题，不是附属 feature
- 为上下文卷做总览导流

### 这篇不讲什么
- 不细讲 compact / microcompact / snip 的实现差异
- 不深挖 session restore 的具体源码
- 不把这一篇写成状态管理细节清单

### Mermaid 主图
1. Context 生命周期图
2. messages / prompt / compact / restore 关系图

### 对后文的导流
- 导向卷四
- 和第 3 篇、第 4 篇一起构成“会跑 + 能执行 + 能持续”的三层主理解链

---

## 06｜Claude Code 怎么长出更多能力

### 主问题
Claude Code 为什么不是一个封闭系统，skill / agent / subagent / MCP / plugin 这些能力分别在系统里的什么位置？

### 核心判断句
**Claude Code 不是一个固化产品，而是一套能够持续吸纳新能力的可扩展 runtime；后面几卷，本质上都在继续拆它怎样长能力、怎样控制能力。**

### 这篇必须完成的任务
- 给出扩展能力地图
- 讲清 skill / agent / subagent / MCP / plugin 的位置差异
- 说明 Claude Code 为什么能不断长出新能力
- 作为卷一收尾，把后面几卷顺手导航出去

### 这篇不讲什么
- 不细讲 skill frontmatter
- 不展开 runAgent / team runtime 生命周期
- 不展开 MCP auth / plugin loader 细节

### Mermaid 主图
1. 扩展能力地图
2. skill / agent / subagent / MCP / plugin 关系图
3. 全书阅读导航图（完整版）

### 对后文的导流
- 导向卷五、卷六
- 作为卷一收束，形成“从系统是什么，到系统怎么继续长能力”的完整弧线

---

## 卷一整体边界提醒

### 卷一要做的
- 立系统地图
- 立对象边界
- 立动态主线
- 立执行能力层
- 立状态持续层
- 立扩展能力地图

### 卷一不要做的
- 变成工具细节卷
- 变成主循环细节卷
- 变成 skill / MCP / plugin 细节卷
- 变成旧文章的拼接修补版

### 卷一的总承诺
**卷一不是先把某个局部讲深，而是先让后面的每一卷都变得更容易被理解。**
