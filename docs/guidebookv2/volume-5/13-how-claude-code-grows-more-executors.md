---
title: 卷五 13｜Claude Code 是怎样长出更多执行者的
date: 2026-04-08
tags: [Claude Code, agent, subagent, runtime]
---

# 卷五 13｜Claude Code 是怎样长出更多执行者的

## 这篇要回答的问题

Agent 主轴的锚点不是“某个 agent 多强”，而是：

> **Claude Code 为什么会从单执行者，长成一套能持续派生更多执行者的体系？**

这篇必须先把整条主线立成：**执行者扩展重轴**。

## 旧文与源码锚点

### 旧文素材锚点
- `docs/guidebook/volume-1/10-agenttool.md`
- `docs/guidebook/volume-3/12-twenty-agent-design-takes.md`
- `docs/guidebook/volume-1/14-builtinagents.md`

### 源码锚点
- `cc/src/tools/AgentTool/AgentTool.tsx`
- `cc/src/tools/AgentTool/loadAgentsDir.ts`
- `cc/src/tools/AgentTool/builtInAgents.ts`
- `cc/src/tools/AgentTool/built-in/generalPurposeAgent.ts`
- `cc/src/tools/AgentTool/built-in/exploreAgent.ts`
- `cc/src/tools/AgentTool/built-in/planAgent.ts`
- `cc/src/tools/AgentTool/built-in/verificationAgent.ts`

## 主图：Claude Code 怎样从单执行者走向多执行者

```mermaid
flowchart LR
    A[主线程单执行者] --> B[AgentTool 成为任务委派入口]
    B --> C[系统开始有 agent definitions]
    C --> D[built-in / user / project / plugin agents 并存]
    D --> E[不同执行者承担不同工作模式]
    E --> F[主 agent 继续派生 subagent / worker]
```

## 先给结论

- Claude Code 长出的不只是更多能力，而是**更多承担工作的执行者**。
- `agent / subagent / fork worker` 不是两组平级对象，而是**同一条执行者主线的前半段 / 后半段**。
- 第 13 篇不讲细节机制，只先把“更多执行者怎样成立”立住。

## 主证据链

复杂任务中的压力先表现为主线程负担过重 → 系统需要把某些工作交给别的承担者 → `AgentTool` 把任务委派做成正式入口 → `loadAgentsDir` / `builtInAgents` 把执行者做成可发现的 runtime 对象 → Claude Code 不再只有一个执行者，而开始拥有一组可分工的执行者。

## 为什么系统会需要“更多执行者”

### 第一，复杂任务的问题不只是不够会做，还可能是一条执行线不够用

当任务同时要求：

- 查材料
- 规划结构
- 修改文件
- 验证结果
- 保持总体目标

问题就不再只是“有没有工具”，而是“**要不要把工作交给不同承担者**”。

### 第二，光有 tools 和 skills，还不等于光有分工结构

- tool 解决动作
- skill 解决方法

但复杂任务继续往上走，还会碰到第三层问题：

- 哪些工作主线自己扛
- 哪些工作应该拆出去
- 结果回来之后由谁整合

这一层必须引入**执行者对象**。

## 源码证据：Claude Code 已经在组织执行者谱系

### 证据 1：`loadAgentsDir.ts` 把 agent 当正式定义对象加载

`loadAgentsDir.ts` 并不是只读一个 prompt 文件夹。它统一处理：

- built-in agents
- plugin agents
- user / project / policy agents

然后再得到 `activeAgents`。这说明 Claude Code 运行前，已经把“有哪些执行者可被系统感知”做成正式定义层。

### 证据 2：agent 的定义字段说明它们不是名字列表，而是工作模板

`BaseAgentDefinition` 里包含：

- tools / disallowedTools
- skills
- mcpServers
- hooks
- model / permissionMode / maxTurns
- background / isolation

这不是“人设列表”，而是**不同执行体的工作边界模板**。

### 证据 3：`builtInAgents.ts` 说明官方已经内建多种工作模式执行者

`builtInAgents.ts` 会按入口、feature gate、运行环境，把以下执行者装进系统：

- `GENERAL_PURPOSE_AGENT`
- `EXPLORE_AGENT`
- `PLAN_AGENT`
- `VERIFICATION_AGENT`
- 以及其它内建角色

也就是说，Claude Code 的“更多执行者”不是抽象口号，而已经落成：

- 通用执行者
- 只读探索执行者
- 规划执行者
- 验证执行者

这是实打实的对象增殖。

## 为什么第 13 篇必须先于 12 / 14 / 15-17 被写出来

因为 Agent 主轴后面的所有篇目，都默认这件事已经成立：

- 第 12 篇只是先打掉误解：agent 不是工具。
- 第 14 篇才展开：这些执行者怎样被 `runAgent` 装起来。
- 第 15-17 篇才进入后半段：主执行者怎样继续派生 worker。

如果没有第 13 篇，后面几篇都会变成零散局部机制；有了第 13 篇，后面才会落回同一条主线。

## 这条主线的前半段与后半段

### 前半段：更多执行者怎样成立
- 12：agent 不是工具
- 13：系统怎样长出更多执行者
- 14：`runAgent` 怎样把执行者装起来

### 后半段：执行者怎样继续分叉成 worker 协作
- 15：为什么主 agent 还要派 subagent
- 16：为什么 `forkSubagent` 更像 worker 分叉
- 17：主 agent / worker agent 的边界与回流

这里最重要的纪律是：**不要把 subagent 再拆成另一组对象。**

## 一句话收口

> Claude Code 长出的不只是更多能力，而是更多承担工作的执行者；`AgentTool`、agent definitions 和 built-in agents 让“谁来接这段工作”正式进入 runtime，于是 agent / subagent / worker 才能被写成同一条执行者主线。