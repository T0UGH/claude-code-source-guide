---
title: 卷五｜外部扩展与多代理能力
status: draft
updated: 2026-04-09
---

# 卷五｜外部扩展与多代理能力

卷五要回答的是：

> **Claude Code 怎么长出更多能力，并把系统外部的能力源接进来。**

这一卷的主线不是对象名词堆放，而是扩展层怎样成立、怎样进入运行时、最后怎样收成平台能力。

## 目录

### 总论
1. [卷五 01｜为什么复杂场景会逼 Claude Code 长出扩展层](./01-why-complex-scenarios-force-claude-code-to-grow-an-extension-layer.md)
2. [卷五 02｜为什么 Claude Code 选择把扩展权交给用户](./02-why-claude-code-chooses-to-hand-extension-power-to-users.md)
3. [卷五 03｜skills / MCP / agents / subagents / hooks / plugins 怎么进入 Claude Code](./03-how-skills-mcp-agents-subagents-hooks-and-plugins-enter-claude-code.md)

### Skills
4. [卷五 04｜为什么 skill 不只是长 prompt](./04-why-skills-are-more-than-long-prompts.md)
5. [卷五 05｜skill 怎么把用户体验、工作流和角色带进 Claude Code](./05-how-skills-bring-user-experience-workflows-and-roles-into-claude-code.md)
6. [卷五 06｜SkillTool 与 skills runtime 怎么接入执行链](./06-how-skilltool-and-skills-runtime-enter-the-execution-chain.md)
7. [卷五 07｜什么样的 skill 才是好 runtime skill](./07-what-makes-a-good-runtime-skill.md)
8. [卷五 08｜skill、tool、agent 的边界](./08-boundaries-between-skill-tool-and-agent.md)

### MCP
9. [卷五 09｜为什么 MCP 不只是更多远程工具](./09-why-mcp-is-not-just-more-remote-tools.md)
10. [卷五 10｜Claude Code 怎么用 MCP 接外部能力与资源系统](./10-how-claude-code-uses-mcp-to-connect-external-capabilities-and-resource-systems.md)
11. [卷五 11｜MCP 与 skills、hooks、plugins 的关系](./11-how-mcp-relates-to-skills-hooks-and-plugins.md)

### Agent / Subagent / Hooks / Plugins
12. [卷五 12｜为什么 agent 不只是另一个工具](./12-why-agent-is-not-just-another-tool.md)
13. [卷五 13｜Claude Code 怎么长出更多执行者](./13-how-claude-code-grows-more-executors.md)
14. [卷五 14｜为什么 runAgent 像 agent runtime 装配线](./14-why-runagent-feels-like-an-agent-runtime-assembly-line.md)
15. [卷五 15｜为什么主 agent 需要 spawn subagents](./15-why-the-main-agent-needs-to-spawn-subagents.md)
16. [卷五 16｜为什么 forkSubagent 不只是启动另一个 agent](./16-why-forksubagent-is-not-just-starting-another-agent.md)
17. [卷五 17｜主 agent 与 worker agent 的边界和信息流](./17-boundaries-and-information-flow-between-main-agent-and-worker-agent.md)
18. [卷五 18｜为什么 hooks 不只是挂几个脚本，而是正式 runtime 机制](./18-why-hooks-are-more-than-just-some-scripts.md)
19. [卷五 19｜hooks 在 Claude Code runtime 里扮演什么角色](./19-what-role-hooks-play-in-claude-code-runtime.md)
20. [卷五 20｜不同 hooks 各自拦截、连接和修改什么](./20-what-different-hooks-intercept-connect-and-modify-in-claude-code.md)
21. [卷五 21｜为什么有了 skills、MCP、hooks 之后仍然需要 plugins](./21-why-plugins-are-still-needed-after-skills-mcp-and-hooks.md)
22. [卷五 22｜plugins 相对其他扩展对象占在哪一层](./22-what-layer-plugins-occupy-relative-to-other-extension-objects.md)
23. [卷五 23｜为什么 plugins 最后会长成一层平台边界](./23-why-plugins-represent-a-more-complete-form-of-packaging-distribution-and-reuse.md)
24. [卷五 24｜为什么这些扩展对象最终收束成平台层](./24-why-these-extension-objects-converge-into-a-platform-layer.md)
