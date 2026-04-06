---
title: 卷三｜工具系统怎么把模型意图落成执行
status: draft
updated: 2026-04-07
---

# 卷三｜工具系统怎么把模型意图落成执行

卷二已经回答了：

- 一次 agent turn 怎么跑起来
- 系统什么时候从回答路径切到执行路径
- 结果怎样回到当前 turn

卷三接着回答的是另一层问题：

> **模型决定调用能力之后，runtime 怎么把这个意图真正落成现实执行？**

这一卷不是工具目录，也不是旧工具文章的重排。它真正要建立的是一张**执行层稳定运行图**：

- `tool_use` 怎样成为正式调用
- orchestration 怎样接住这次调用
- Tool 为什么是统一执行接口
- 不同执行对象怎样碰现实世界
- `tool_result` 又怎样回到主循环

## 目录

1. [卷三 01｜为什么模型意图不能直接变成现实动作](./01-why-model-intent-cannot-directly-become-real-world-action.md)
2. [卷三 02｜执行主线总图：`tool_use -> orchestration -> execution -> tool_result`](./02-tool-execution-mainline-overview.md)
3. [卷三 03｜Tool 为什么是 runtime 的正式执行接口](./03-why-tool-is-the-formal-runtime-execution-interface.md)
4. [卷三 04｜orchestration 怎么接住一次 `tool_use`](./04-how-orchestration-handles-a-tool-use.md)
5. [卷三 05｜BashTool 为什么像执行层的通用执行器](./05-why-bashtool-feels-like-the-general-executor.md)
6. [卷三 06｜FileReadTool 怎么把现实材料接进当前判断](./06-how-filereadtool-brings-real-material-into-current-judgment.md)
7. [卷三 07｜FileEdit / FileWrite 怎么把当前判断落回现实文件](./07-how-fileedit-and-filewrite-apply-judgment-back-to-files.md)
8. [卷三 08｜GrepTool 怎么在现实材料里找东西](./08-how-greptool-finds-things-in-real-material.md)
9. [卷三 09｜ToolSearchTool 怎么在能力面里找该用什么工具](./09-how-toolsearchtool-finds-what-tool-to-use.md)
10. [卷三 10｜为什么执行层不只接本地工具：SkillTool / AgentTool 的位置](./10-why-execution-layer-does-not-only-handle-local-tools.md)
11. [卷三 11｜把整条执行层重新压成一张稳定运行图](./11-stable-execution-layer-map.md)

## 这一卷不重点展开什么

- 不主讲长期上下文治理与持续工作
- 不主讲技能 / 代理 / MCP 的扩展平台结构
- 不主讲权限、命令入口与控制层整合

这些问题会分别留给：
- 卷四：上下文与状态怎么维持系统持续工作
- 卷五：外部扩展与多代理能力
- 卷六：命令、工作流与产品层整合
