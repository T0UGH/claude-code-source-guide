---
title: 卷四｜外部能力和扩展点是怎么接进来的
date: 2026-04-06
status: draft
---

# 卷四｜外部能力和扩展点是怎么接进来的

前面三卷主要在讲 Claude Code 的内部运行：
- runtime 底座怎么搭
- 一条请求怎么跑完整个系统
- 长上下文与恢复怎么成立

卷四开始处理另一件同样关键的事：

> **Claude Code 为什么不只是一个封闭 runtime，而是能不断长出外部能力、运行时插入点和统一扩展平台。**

这一卷的主线不是单个工具或单个配置，而是三类扩展能力面：
- MCP
- hooks
- plugin

读这一卷的核心收获，是看清 Claude Code 并不是“事后拼几个扩展点”，而是在架构上给外部能力留了正式入口、治理层和生态层。

---

## 这一卷在讲什么

卷四主要分成三段：

### 1. MCP 主线
- 外部 MCP server 如何接进 runtime
- MCP tool 怎样进入调用链
- auth 为什么是正式状态机
- 外部能力为什么还要再过统一权限闸门

### 2. hooks 主线
- hooks 怎样被系统正式接住
- PreToolUse / PostToolUse 怎样进入工具执行主链
- SessionStart / Stop hooks 怎样进入会话生命周期
- 为什么 hooks 本质上不是“几个回调”，而是 runtime 编排层

### 3. plugin 主线
- plugin 在 Claude Code 里到底提供什么能力面
- pluginLoader 怎样装配运行时能力包
- 插件的不同能力怎样挂进系统
- validate / schema / policy 为什么说明 plugin 是正式能力包
- CLI / install / marketplace 怎样把 plugin 做成产品级生态对象

这三段合起来，才会真正理解 Claude Code 的“扩展能力”不是松散补丁，而是一套统一扩展体系。

---

## 为什么这一卷重要

如果没有卷四，Claude Code 很容易被低估成：
- 会调一些内建 tool
- 会跑几个 agent
- 偶尔接点外部能力

但源码真正表现出来的是另一种形态：

- 外部能力可以通过 MCP 正式接入
- 运行时行为可以通过 hooks 被系统性改写、阻断、补充
- 更复杂的能力包可以通过 plugin 进入装配、治理和分发链

这一卷的重要性就在于：

> **它解释了 Claude Code 为什么不是一个“功能写死的 CLI”，而更像一个可扩展的 agent runtime 平台。**

---

## 前置阅读建议

建议先读：

- [卷一 15｜SkillTool 是把 skill 接进 runtime 的桥](../volume-1/15-skilltool-bridge.md)
- [卷二 04｜query(...) 是怎么驱动模型、工具、消息主循环的](../volume-2/04-query-main-loop.md)
- [卷三 14｜sessionRestore 是把恢复包真正接回当前 runtime 的落地层](../volume-3/14-session-restore.md)

如果想更顺一点，再补：
- [卷一 10｜AgentTool 不是再开一个 agent 这么简单](../volume-1/10-agenttool.md)
- [卷一 31｜prompt 是 AgentTool 给模型看的使用说明层](../volume-1/31-prompt-as-instruction-layer.md)

因为卷四谈的是“外部能力怎样进入系统”，不补前面这些，很容易只看见扩展点，看不清它们到底接到了 runtime 的哪一层。

---

## 建议阅读顺序

### 第一段：MCP 主线
1. [卷四 01｜Claude Code 是怎么把 MCP 外部能力接进 runtime 的](./01-mcp-runtime-entry.md)  
   先立 MCP 在 runtime 中的位置。
2. [卷四 02｜MCPTool 调用链：外部 tool 是怎么被包装、调用、重试和治理结果的](./02-mcptool-call-chain.md)  
   再看外部 tool 如何进入真正调用链。
3. [卷四 03｜为什么在 Claude Code 里 CLI 加 skill 往往比铺太多 MCP 更实用](./03-cli-plus-skill-vs-many-mcp.md)  
   回到能力边界判断。
4. [卷四 04｜MCP 认证状态机：为什么 needs-auth 不是补丁，而是正式能力层](./04-mcp-auth-state-machine.md)  
   看 auth 如何变成正式状态机。
5. [卷四 05｜MCP 权限边界：为什么外部能力进来以后还要再过统一闸门](./05-mcp-permission-boundary.md)  
   收住 MCP 的安全边界。

### 第二段：hooks 主线
6. [卷四 06｜hooks 总入口：Claude Code 是怎么把 hook 接进 runtime 的](./06-hooks-runtime-entry.md)  
   先把 hooks 放回 runtime 看总入口。
7. [卷四 07｜PreToolUse 与 PostToolUse hook 是怎么进入工具执行主链的](./07-pretooluse-posttooluse-hooks.md)  
   看 hooks 怎样进入工具链。
8. [卷四 08｜SessionStart 与 Stop hooks 是怎么进入会话生命周期的](./08-sessionstart-stop-hooks.md)  
   看 hooks 怎样进入生命周期。
9. [卷四 09｜hooks 主线收尾：为什么 Claude Code 的 hooks 本质上是 runtime 编排层](./09-hooks-conclusion.md)  
   把 hooks 提升到编排层视角。

### 第三段：plugin 主线
10. [卷四 10｜Claude Code 的 plugin 系统到底在提供什么能力面](./10-plugin-capability-surface.md)  
    先立 plugin 能力面。
11. [卷四 11｜pluginLoader 是怎么把插件装配成运行时能力包的](./11-plugin-loader.md)  
    再看装配层。
12. [卷四 12｜plugin 的各能力接入面是怎么挂上去的](./12-plugin-attachment-points.md)  
    看插件能力如何挂进 runtime。
13. [卷四 13｜validate / schema / policy 为什么说明 plugin 不是随便加载的目录，而是正式能力包](./13-plugin-validate-schema-policy.md)  
    看约束层与正式性。
14. [卷四 14｜plugin CLI / install / marketplace 是怎么把 plugin 变成产品级生态对象的](./14-plugin-cli-install-marketplace.md)  
    看生态对象化。
15. [卷四 15｜为什么说 Claude Code 的 plugin 本质上是统一扩展平台，而不是几个零散扩展点](./15-plugin-conclusion.md)  
    把整条 plugin 线收成平台级判断。

---

## 如果你只想先抓主线

先读这 6 篇：

1. [01｜Claude Code 是怎么把 MCP 外部能力接进 runtime 的](./01-mcp-runtime-entry.md)
2. [05｜MCP 权限边界：为什么外部能力进来以后还要再过统一闸门](./05-mcp-permission-boundary.md)
3. [06｜hooks 总入口：Claude Code 是怎么把 hook 接进 runtime 的](./06-hooks-runtime-entry.md)
4. [09｜hooks 主线收尾：为什么 Claude Code 的 hooks 本质上是 runtime 编排层](./09-hooks-conclusion.md)
5. [10｜Claude Code 的 plugin 系统到底在提供什么能力面](./10-plugin-capability-surface.md)
6. [15｜为什么说 Claude Code 的 plugin 本质上是统一扩展平台，而不是几个零散扩展点](./15-plugin-conclusion.md)

这几篇读顺了，卷四最核心的骨架就立住了：
- 外部能力如何接入
- hooks 如何编排 runtime
- plugin 如何把扩展做成正式平台

---

## 读完这一卷你会得到什么

如果卷四读顺了，你应该会更清楚地知道：

- Claude Code 的外部能力接入不是临时补丁，而是正式 runtime 能力面
- MCP、hooks、plugin 三者不是一类东西，但又被系统性地收进了一套扩展体系
- hooks 为什么不能只理解成回调，而要理解成运行时编排层
- plugin 为什么已经不只是一个“本地扩展目录”，而是统一能力包、治理包和生态对象

一句话说：

> **卷四读完，Claude Code 的扩展能力就不再像一堆外挂接口，而会显出一个统一扩展平台的轮廓。**
