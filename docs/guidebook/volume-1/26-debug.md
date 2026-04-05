---
title: 卷一 26｜debug 是面向当前 session 的现场诊断 skill
date: 2026-04-04
tags:
  - Claude Code
  - 源码共读
  - skill
  - debug
  - diagnostics
source_files:
  - /Users/haha/.openclaw/workspace/cc/src/skills/bundled/debug.ts
status: done
source_url: https://feishu.cn/docx/XERid4iZEoCeOnx7aXXc89AlnZr
---

# 卷一 26｜debug 是面向当前 session 的现场诊断 skill

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Skill 12/16
- **上一篇**：[上一篇：verify 是 Claude Code 对验证即运行时观察的官方定义](./25-verify.md)
- **下一篇**：[下一篇：skills 篇结语：skill 不是提示词而是能力单元](./27-skills-conclusion.md)

这一篇继续沿着官方 skill 范式往下看。和 verify 对照着读，会更容易看出 Claude Code 对 skill 的期望边界。

---

## 这篇看什么

前一篇拆的是 `verify`。

`verify` 很像一份工程价值观文件：它在定义“什么才算验证”。

这次看的 `debug`，气质完全不一样。

它不是一份长篇静态方法论，也不是一份外置 `SKILL.md` 模板。

它是一个更像“现场急救包”的 bundled skill：

- 面向**当前 session**
- 优先读**当前 debug log**
- 动态决定这次 prompt 要长什么样
- 如果这 session 之前没开 debug logging，先把 logging 打开
- 然后再让模型围绕当前现场去诊断

所以我现在对它的最短判断是：

> `debug` 不是通用故障排查文档，而是一个面向当前会话现场、围绕 session debug log 动态生成的诊断 skill。

这句话很重要。

因为它说明 Claude Code 官方对 debug 的理解，不是：

- 给模型一套通用 troubleshooting checklist 就完了

而是：

> **先把当前现场的可观测信息抓进来，再让模型诊断。**

这和 `verify` 那种“到运行时表面上观察”的价值观，其实是同一路的。

一个强调：
- 验证要看 runtime 行为

另一个强调：
- 调试要先看 runtime 日志

都在逼模型不要空想。

---

## 先给主结论

### 1. `debug` 的核心不是“解释报错”，而是“把当前 session 变成可诊断现场”

这个 skill 最值钱的地方，不是 prompt 文案，而是它在 prompt 之前先做的那几步动作：

- `enableDebugLogging()`
- `getDebugLogPath()`
- `stat/open/read` 只 tail 末尾一段
- 提示你去 grep 全文件里的 `[ERROR]` / `[WARN]`

这说明官方对 debug 的理解不是：

- 用户说哪里坏了，你就凭经验解释一下

而是：

> 先把当前 session 转成一个有日志、有路径、有最近上下文的可诊断现场。

也就是说，这个 skill 真正做的第一件事，不是分析，而是**把诊断输入准备好**。

### 2. `debug` 是“动态 prompt skill”，不是“静态 skill 文档”

`verify` 那类 skill，有一个完整外置 `SKILL.md`，正文是稳定的。

但 `debug` 不一样。

它的 prompt 是运行时拼出来的，而且跟当前 session 的状态强绑定：

- 当前是不是已经在记 debug log
- debug log 文件路径是什么
- 最近 20 行是什么
- 用户有没有给 issue description
- 当前 settings 文件在哪里

所以它不是“预写一份通用诊断说明书”，而是：

> 每次调用时，围绕当前 session 的真实状态动态长出 prompt。

这其实是 Claude Code skill 体系里另一种很值得看的写法。

### 3. 这份 skill 暗含了一个很强的诊断哲学：先从日志、warning、error 和配置入口出发

你会发现它给模型的指令非常克制，核心就几条：

1. 看用户怎么描述问题
2. 看 debug log 末尾格式
3. grep 全文件里的 `[ERROR]` / `[WARN]`
4. 必要时拉 Claude Code Guide subagent 去理解相关 feature
5. 用 plain language 解释
6. 给 concrete fixes / next steps

这说明 Claude Code 官方希望模型 debug 时优先走这条链：

> **用户描述 → 日志模式 → 错误/警告 → 相关配置 → 必要时查内部机制 → 给修复建议**

这条链非常实战，也很工程化。

---

## 先把“完整技能内容”放进来

`debug` 不是外置 `SKILL.md`，所以这次我把它运行时拼出来的核心 prompt 结构完整整理进来。

先看注册壳的核心配置：

```ts
registerBundledSkill({
  name: 'debug',
  description:
    process.env.USER_TYPE === 'ant'
      ? 'Debug your current Claude Code session by reading the session debug log. Includes all event logging'
      : 'Enable debug logging for this session and help diagnose issues',
  allowedTools: ['Read', 'Grep', 'Glob'],
  argumentHint: '[issue description]',
  disableModelInvocation: true,
  userInvocable: true,
  async getPromptForCommand(args) {
    ...
  },
})
```

然后它在运行时大概会生成这样一份 prompt：

```md
# Debug Skill

Help the user debug an issue they're encountering in this current Claude Code session.

## Debug Logging Just Enabled

Debug logging was OFF for this session until now. Nothing prior to this /debug invocation was captured.

Tell the user that debug logging is now active at `<debugLogPath>`, ask them to reproduce the issue, then re-read the log. If they can't reproduce, they can also restart with `claude --debug` to capture logs from startup.

## Session Debug Log

The debug log for the current session is at: `<debugLogPath>`

Log size: <size>

### Last 20 lines

```
<tail of current debug log>
```

For additional context, grep for [ERROR] and [WARN] lines across the full file.

## Issue Description

<user-provided issue description or fallback text>

## Settings

Remember that settings are in:
* user - <userSettingsPath>
* project - <projectSettingsPath>
* local - <localSettingsPath>

## Instructions

1. Review the user's issue description
2. The last 20 lines show the debug file format. Look for [ERROR] and [WARN] entries, stack traces, and failure patterns across the file
3. Consider launching the Claude Code Guide subagent to understand the relevant Claude Code features
4. Explain what you found in plain language
5. Suggest concrete fixes or next steps
```

注意，这里最关键的不是文案本身，
而是：

> 这份技能内容每次都会带着当前 session 的真实上下文一起生成。

---

## 先把总图立住：`debug` 真正做的是三段事

```mermaid
flowchart TD
    A[/debug 被用户显式触发] --> B[确保当前 session 开启 debug logging]
    B --> C[读取当前 debug log 尾部]
    C --> D[把日志路径/最近日志/设置路径/用户问题拼进 prompt]
    D --> E[模型诊断当前 session]
    E --> F[解释问题 + 给下一步修复建议]
```

这个图能看出它和 `verify` 的明显差异。

`verify` 是：
- 去表面上观察变化

`debug` 是：
- 去当前现场里读取日志

一个偏运行结果验证，
一个偏现场诊断。

---

## 第一层：`disableModelInvocation: true` 再次说明官方不希望模型“自己觉得该 debug 就 debug”

这一点和 `skillify` 很像。

`debug` 也被设成：

- `disableModelInvocation: true`
- `userInvocable: true`

也就是说：

> 官方希望 `debug` 是用户显式触发的诊断动作，而不是模型在普通对话中自己悄悄调用的隐藏技能。

这个设计很合理。

因为 debug 这种事通常意味着：

- 问题已经出现
- 用户希望进入“诊断模式”
- 这时系统应该更明确、更可控

而不是让模型随手切到 debug skill，又给用户一种“你怎么突然去读日志了”的感觉。

所以这类高意图、强现场性的技能，被做成显式 user-invocable skill，我觉得非常对。

---

## 第二层：它先开 logging 再诊断，说明官方把“可观测性”放在分析前面

这段代码是整个 skill 最有味道的地方之一：

```ts
const wasAlreadyLogging = enableDebugLogging()
const debugLogPath = getDebugLogPath()
```

### 这里的含义很强

如果当前 session 之前没开 debug logging，`/debug` 一调起来，它会先开。

然后它会根据是否是“刚打开”来决定 prompt 里要不要加这段提示：

- 之前没开
- 现在才开始捕获
- 之前的问题没被记下来
- 请用户复现一下，再回来读日志
- 如果连启动阶段都要抓，可以用 `claude --debug`

这其实非常成熟。

因为它没有假装自己已经拥有全部诊断信息。

相反，它明确承认：

> 如果当前 session 之前没有日志，那就先把可观测性建起来，再谈诊断。

这和很多“先猜一波原因”的 debug 助手完全不是一个思路。

---

## 第三层：它只 tail 最后 20 行，而且只读最后 64KB，这说明官方非常清楚 debug log 是个长期增长资产

这段实现我很喜欢，因为它很工程：

- `TAIL_READ_BYTES = 64 * 1024`
- `DEFAULT_DEBUG_LINES_READ = 20`
- 只读文件尾部
- 再截最后 20 行

### 这说明什么

说明 Claude Code 官方很清楚：

- debug log 是会无限长大的
- 不能每次 `/debug` 都把整份日志读进来
- 否则 RSS、token、响应速度都会被拖垮

所以它采取的策略不是：

- 一股脑把日志全塞进 prompt

而是：

> 先给模型看“最近现场”，再告诉它去 grep `[ERROR]` / `[WARN]` across full file。

这是个非常漂亮的分层：

- prompt 里只放最小可感知上下文
- 更完整的调查通过工具再去做

这其实也是一种“好 skill 写法”示范：

> prompt 不要试图自己带全世界，应该只带最小入口，然后引导模型再去拿证据。

---

## 第四层：`debug` 的 allowed tools 很克制，也很说明它的定位

它只给了：

- `Read`
- `Grep`
- `Glob`

没有：

- `Edit`
- `Write`
- `Bash`

这很有意思。

因为这说明官方对 `debug` 的定位不是：

- 一上来就让模型帮你乱改
- 或者直接跑一堆修复命令

它先把 skill 定位成：

> **诊断 skill，不是修复 skill。**

也就是说，这个技能的第一职责是：

- 看日志
- 找模式
- 解释问题
- 给下一步建议

而不是直接修系统。

这其实很稳。

因为很多时候 debug 最怕的不是“不会修”，而是：

- 现场还没搞清楚，就先改了一堆东西

而 `debug` 这套权限边界，本身就在防这种事情。

---

## 第五层：它把 settings 路径显式塞进 prompt，说明官方认为“配置错误”是 Claude Code 故障的高频来源

这一段非常实用：

```ts
Remember that settings are in:
* user - ...
* project - ...
* local - ...
```

这说明官方对 debug 的实际经验大概是：

- 很多问题最终都会和 settings source 有关
- 用户 / 项目 / 本地 三层配置之间的覆盖关系，很容易造成问题

所以 `debug` skill 直接把这些路径喂给模型，避免模型只在日志里打转，却忘了去查设置来源。

### 这其实透露了 Claude Code 的一类“真实问题分布”

如果一个 skill 专门把 settings path 放进 prompt，
说明这不是偶发需要，而是高频需要。

也就是说，官方大概率已经见过很多问题都出在：

- user settings
- project settings
- local settings
- source precedence
- 某个项目局部配置覆盖了全局行为

这个小细节很说明问题。

---

## 第六层：它甚至建议必要时拉 `Claude Code Guide` subagent，说明官方承认“日志本身不足以解释 feature 语义”

prompt 里有一步是：

- Consider launching the Claude Code Guide subagent to understand the relevant Claude Code features

这条很妙。

因为它相当于承认：

> debug log 可以告诉你“发生了什么”，但不一定告诉你“某个 feature 按设计本来应该怎么工作”。

所以当问题涉及：

- 某个 Claude Code feature 的设计语义
- 某个内建机制的预期行为

就可以拉 guide agent 来补“产品/系统理解”。

这说明官方对 debug 的理解不是单一路径：

- 不是只有日志
- 也不是只有 feature 理解

而是：

> 日志是现场证据，guide agent 是机制解释器，两边结合才完整。

---

## 第七层：`debug` 其实在教模型一种很稳的诊断顺序

如果把这份 skill 再抽象一下，我觉得它在教模型一条非常稳的诊断链：

1. **先听用户怎么描述问题**
2. **再看最近日志长什么样**
3. **再去全量 grep 错误/警告/栈**
4. **再对照 settings source 看是不是配置问题**
5. **必要时补产品机制理解**
6. **最后用 plain language 解释 + 给 concrete next steps**

这条链我觉得非常好。

因为它避免了两种常见坏习惯：

### 坏习惯 1：只听用户口述，不看日志
会变成纯猜。

### 坏习惯 2：只看日志，不管用户实际感受到什么
会变成“日志导向型误诊”。

而 `debug` 把两边都放进来了：

- 用户问题描述
- 当前 session 真实 debug log

这就让诊断更稳。

---

## 第八层：和 `verify` 对照着看，会发现它们其实是一组“观察优先”的官方哲学

我觉得 `verify` 和 `debug` 放在一起看特别有意思。

### `verify` 说的是
- 去 runtime surface 观察变化是不是发生了
- 带证据
- 别拿 CI 和读代码代替验证

### `debug` 说的是
- 去当前 session 的 debug log 观察现场到底发生了什么
- 带日志和 warning/error 证据
- 别空想原因

也就是说，这两份 skill 虽然用途不同，但底层哲学几乎一样：

> **先观察，再判断。先拿现场证据，再下结论。**

这其实非常像一套成熟工程团队的文化，而不是单个 prompt 作者的偏好。

---

## 第九层：`debug` 也是一种很好的“动态 skill”样本

前面我们拆过几种 skill：

- 静态外置 `SKILL.md`（比如 `verify`）
- 官方写 skill 的模板化方法（比如 `skillify`）

而 `debug` 展示的是另一种很值得学的形态：

> **围绕当前运行时状态动态生成 prompt 的 skill。**

它很适合那种：

- 每次调用时上下文都不同
- 需要把当前 session 的现场状态注入 prompt
- 不能提前写死成一份固定文档

所以从 skill 写法方法论看，`debug` 也很值。

它在告诉你：

- 不是所有 skill 都该写成静态 `SKILL.md`
- 有些 skill 的本质就是“运行时 prompt assembler”

这个类型值得单独记住。

---

## 我现在对 `debug` 的一句话定义

如果只留一句最短的话，我会留这个：

> `debug` 是 Claude Code 面向当前 session 的现场诊断 skill：它先把会话日志与配置入口转成可观测现场，再让模型围绕真实日志模式、warning/error 和用户问题去解释故障并给出下一步建议。

这里最想保住的几个词是：

- **当前 session**
- **可观测现场**
- **日志模式**
- **下一步建议**

因为这几个词基本就是它的骨架。

---

## 这篇最值得记住的几个判断

### 判断 1：`debug` 的核心不是通用 troubleshooting，而是把当前 session 转成可诊断现场

### 判断 2：它是动态 prompt skill，不是静态 `SKILL.md` skill

### 判断 3：先开 logging 再诊断，说明官方把可观测性放在分析前面

### 判断 4：只 tail 最近 20 行 + 引导 grep 全文件，是一种很成熟的“最小上下文 + 工具扩展”设计

### 判断 5：它只给 `Read/Grep/Glob`，说明官方把 `debug` 明确定位成诊断 skill，而不是修复 skill

### 判断 6：和 `verify` 一起看，会发现 Claude Code 官方很强调“先观察，再判断”

---

## 下一步最顺怎么接

如果继续拆 bundled skills，我觉得现在最顺的还是：

- **`stuck`**

因为现在顺序会很漂亮：

- `verify`：怎么证明真的成了
- `debug`：怎么围绕现场诊断
- `stuck`：当 agent/流程真的卡住时，官方希望怎么恢复

这三篇会形成一个很完整的工程闭环。