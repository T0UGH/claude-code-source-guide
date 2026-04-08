---
title: 卷七 03｜命令入口是怎样接进 runtime 的
date: 2026-04-09
tags:
  - Claude Code
  - commands
  - runtime
  - query
source_files:
  - cc/src/utils/processUserInput/processUserInput.ts
  - cc/src/utils/processUserInput/processSlashCommand.tsx
  - cc/src/utils/handlePromptSubmit.ts
  - cc/src/QueryEngine.ts
  - cc/src/query.ts
  - cc/src/utils/queryContext.ts
  - cc/src/utils/api.ts
status: draft
---

# 卷七 03｜命令入口是怎样接进 runtime 的

## 这篇真正要回答的问题

上一篇已经把一个判断立住了：slash command / prompt command 不是普通快捷方式，而是正式用户入口。

但“是入口”还不够。卷七第 03 篇要继续往下压一层，回答这个更硬的问题：

> **命令被识别之后，到底是怎样接进 Claude Code 当前这一轮 runtime 的？**

这里最容易写歪的地方，是把文章写成命令说明书，或者写成“输入先被解析，再发给模型”的泛泛流程文。

真正的源码问题不是“有没有 parser”，而是：

> **一条以 `/` 开头的输入，怎样从输入层进入本轮 query 的消息装配、上下文装配和权限边界里，并实际改变后续运行。**

## 旧文素材与这次的源码重锚点

### 旧文素材锚点

- `docs/guidebook/volume-1/20-processpromptslashcommand.md`
- `docs/guidebook/volume-2/08-system-prompt-and-context.md`

### 这次真正压住正文的关键文件

主链文件：

- `cc/src/utils/processUserInput/processUserInput.ts`
- `cc/src/utils/processUserInput/processSlashCommand.tsx`
- `cc/src/utils/handlePromptSubmit.ts`
- `cc/src/QueryEngine.ts`
- `cc/src/query.ts`
- `cc/src/utils/api.ts`
- `cc/src/utils/queryContext.ts`

支撑文件：

- `cc/src/utils/slashCommandParsing.ts`
- `cc/src/commands.ts`
- `cc/src/types/command.ts`
- `cc/src/utils/plugins/loadPluginCommands.ts`
- `cc/src/context.ts`

这里要先说清一件事：这次重读源码时，**并没有看到旧稿里暗示的 `cc/src/prompt/` 主锚点**。当前代码里更贴近“prompt / context 装配”的真实位置，已经转到：

- `cc/src/utils/queryContext.ts`
- `cc/src/context.ts`
- `cc/src/utils/api.ts`
- `cc/src/query.ts`

也就是说，这篇不能再把“某个 prompt 目录”当主轴，而要把重心放回**命令怎样进入 query 装配链**。

## 先给结论

这篇最后要留下的，不是一个“命令处理流程图”，而是三个更硬的判断。

### 结论一：命令入口真正接入 runtime 的关口，不在识别，而在 `processSlashCommand` 之后那批结构化消息

`processUserInput.ts` 确实负责判断：

- 这是不是 slash command；
- 这条输入要不要走 command 分支；
- 如果走，就把它交给 `processSlashCommand(...)`。

但这一步还只是入口分流。

真正让命令接进 runtime 的，是 `processSlashCommand.tsx` 里 prompt command 分支最终产出的结果：

- 一条命令加载 metadata 消息；
- 一条真正承载命令展开内容的 meta user message；
- 命令正文继续抽出来的 attachment messages；
- 一条 `command_permissions` attachment；
- 以及伴随返回值带出的 `allowedTools`、`model`、`effort`。

所以命令进入 runtime 的关键，不是“被识别了”，而是：

> **它被翻成了当前 query 主链可以继续消费的一组结构化运行材料。**

### 结论二：命令不是作为“替换后的字符串”接进去的，而是作为消息、附件、权限和模型偏好的组合接进去的

`getMessagesForPromptSlashCommand(...)` 的返回值已经把这点写得很死：

- `messages`
- `allowedTools`
- `model`
- `effort`
- `shouldQuery: true`

如果它只是把 `/foo` 替换成一段普通文本，那根本没必要顺手带出：

- `command_permissions`
- `allowedTools`
- `model`
- `effort`

这些东西出现，就说明 command 进入 runtime 的方式不是“文本展开”，而是：

> **把命令语义拆进消息层、附件层、权限层和模型选择层，再交给 query。**

### 结论三：命令之所以算“进入 runtime”，是因为它会改写本轮 query 的装配结果和后续行为

命令展开之后不会停在输入处理层。

在交互主线程里，`handlePromptSubmit.ts` 会把 `processUserInput(...)` 的结果取出来，再把：

- `result.messages`
- `result.allowedTools`
- `result.model`
- `result.effort`

一起送进 `onQuery(...)`。

在 SDK / 非交互路径里，`QueryEngine.ts` 做的是同一件事：

- 先 `processUserInput(...)`
- 再把产出的 messages push 进 `mutableMessages`
- 再把 `allowedTools` 写进 `toolPermissionContext.alwaysAllowRules.command`
- 然后进入 `query(...)`

再往下，`query.ts` 会把：

- 当前这批 messages
- `userContext`
- `systemContext`
- `systemPrompt`

一起装成真实模型调用所用的材料：

- `appendSystemContext(systemPrompt, systemContext)`
- `prependUserContext(messagesForQuery, userContext)`
- `deps.callModel(...)`

所以这篇最稳的结论应该写成：

> **命令入口接进 runtime，不是因为它在输入框里被识别过，而是因为它展开后的结构化结果进入了本轮 query 的消息装配、上下文装配和权限装配，并由此改变后续模型调用与工具边界。**

## mermaid 主图：命令入口接进 runtime 的真实主链

```mermaid
flowchart TD
    U[用户输入 /command args] --> A[processUserInput.ts
识别 slash command]
    A --> B[processSlashCommand.tsx
findCommand + 路由命令类型]
    B --> C[getMessagesForPromptSlashCommand
展开命令内容]
    C --> D[产出结构化结果
metadata message
meta content
attachments
command_permissions
allowedTools/model/effort]
    D --> E[handlePromptSubmit.ts / QueryEngine.ts
把 messages 与运行参数送进 query]
    E --> F[query.ts
prependUserContext + appendSystemContext]
    F --> G[callModel(...)]
    D --> H[toolPermissionContext.alwaysAllowRules.command]
    H --> I[后续工具边界改变]
    G --> J[本轮与后续行为被改写]
```

这张图里最重要的不是“函数先后顺序”，而是两次跨层切换：

1. **从输入识别层切到结构化展开层**
2. **从命令展开层切到 query 装配层**

卷七真正要讲的，就是这两个跨层切换怎样成立。

## 第一部分：命令入口先在 `processUserInput.ts` 被识别，但它还没有真正进入 runtime

`cc/src/utils/processUserInput/processUserInput.ts` 是这条链的第一站。

它做了几件事：

1. 处理普通输入与图片输入；
2. 决定要不要抽 attachments；
3. 判断这条输入是不是 slash command；
4. 如果是，就把它交给 `processSlashCommand(...)`。

其中关键判断很直接：

- `inputString.startsWith('/')`
- `parseSlashCommand(inputString)`
- `findCommand(parsed.commandName, context.options.commands)`

这说明命令入口首先是被当成**一种输入分流类型**处理的。

但这一层还不能算 runtime 主链本身。原因很简单：

- 在这里，系统只是确认“这是命令”；
- 它还没有说明“这个命令会以什么运行形状进入 query”。

所以 `processUserInput.ts` 的作用更准确地说是：

> **把 slash command 从普通文本提示里分流出来，并送去做运行级展开。**

这层很重要，但它只是前门，不是正文。

## 第二部分：真正把命令接进 runtime 的，是 `processSlashCommand.tsx` 里的结构化展开

命令入口真正变硬，是在 `cc/src/utils/processUserInput/processSlashCommand.tsx`。

### 1. 先识别命令对象，而不是只拆字符串

这里不是自己随手 split 一下命令名就结束，而是会：

- `findCommand(commandName, commands)`
- 检查命令类型是不是 `prompt`
- 再决定走本地命令、fork 命令还是 prompt command

而 `findCommand(...)` 对应的命令对象，本身来自命令注册体系：

- `cc/src/commands.ts`
- `cc/src/types/command.ts`
- `cc/src/utils/plugins/loadPluginCommands.ts`

这一步的意思是：

> **系统不是把 `/foo` 当自由文本关键字处理，而是把它识别成一个带运行属性的 command 对象。**

这些运行属性包括：

- `allowedTools`
- `model`
- `effort`
- `context`
- `getPromptForCommand(...)`

也就是说，命令在这一步已经不是“关键词”，而是“运行配置入口”。

### 2. prompt command 的正文不是直接塞回输入框，而是被展开成一批 message

`getMessagesForPromptSlashCommand(...)` 才是这篇最关键的函数。

它先做：

- `command.getPromptForCommand(args, context)`

拿到 command 展开的内容块；然后继续做三件事。

第一，构造命令加载 metadata：

- `formatCommandLoadingMetadata(command, args)`
- `createUserMessage({ content: metadata, uuid })`

第二，构造真正让模型看到的 meta 内容：

- `createUserMessage({ content: mainMessageContent, isMeta: true })`

第三，从命令内容里继续抽附件与权限：

- `getAttachmentMessages(...)`
- `createAttachmentMessage({ type: 'command_permissions', ... })`

最后返回：

- `messages`
- `shouldQuery: true`
- `allowedTools`
- `model`
- `effort`

这套返回值已经清楚到几乎没什么可争的了：

> **命令进入 runtime，不是把一段 prompt 文本贴回用户消息里，而是把命令展开为一批将被 query 直接消费的消息与运行参数。**

### 3. `command_permissions` 这类 attachment 说明命令已经碰到执行边界，而不是停留在表达层

旧稿里最容易写虚的一点，是把命令说成“只是补充了上下文”。

但 `processSlashCommand.tsx` 里直接创建了：

- `type: 'command_permissions'`
- `allowedTools: additionalAllowedTools`
- `model: command.model`

这不是普通上下文文本会有的东西。

它说明命令展开时，系统已经在同步交付：

- 这条命令额外放开了哪些工具；
- 这条命令希望切到哪个模型；
- 这次运行的 effort 应该怎么设。

所以命令在这里改写的，不只是“让模型多知道一点背景”，而是：

> **直接把一部分运行约束带进本轮。**

## 第三部分：命令展开之后，不是“放进聊天记录”，而是被 `handlePromptSubmit` / `QueryEngine` 推进到 query

如果没有下一步，这批结构化结果仍然只是“处理结果”，还不算真正进入 runtime 主链。

真正把它送进去的，是提交层。

### 1. 交互路径：`handlePromptSubmit.ts`

在交互式 REPL 路径里，`cc/src/utils/handlePromptSubmit.ts` 会：

1. 调用 `processUserInput(...)`
2. 收到 `result.messages`、`result.allowedTools`、`result.model`、`result.effort`
3. 把这些结果汇总成 `newMessages`
4. 调用 `onQuery(...)`

而 `onQuery(...)` 收到的参数里，已经包括：

- 新消息
- `allowedTools`
- 命令要求的模型覆盖
- effort

这一步的意义是：

> **命令展开结果不只是被记下来，而是被正式提升为本轮 query 的输入。**

### 2. SDK / 非交互路径：`QueryEngine.ts`

在 `cc/src/QueryEngine.ts` 里，这条链更明显。

它先用 `fetchSystemPromptParts(...)` 取到：

- `defaultSystemPrompt`
- `userContext`
- `systemContext`

再跑：

- `processUserInput(...)`

拿到 `messagesFromUserInput` 和 `allowedTools` 后，它会做两件关键动作：

第一，把新的 messages 推入当前会话消息流：

- `this.mutableMessages.push(...messagesFromUserInput)`

第二，把 command 的工具权限写进运行时权限上下文：

- `toolPermissionContext.alwaysAllowRules.command = allowedTools`

这里已经非常接近“后续行为改变”了，因为从这一步开始，命令带出的 `allowedTools` 不再只是信息，而是进入了权限判定状态。

所以如果要找“命令如何改变后续运行”的硬证据，`QueryEngine.ts` 这一段比泛泛谈 prompt 更硬。

## 第四部分：`query.ts` 才是命令真正接上 runtime 主链的地方

前面的所有动作，最终都要落到 `cc/src/query.ts`。

这是本篇最该压住的中心文件。

### 1. query 接收的不是原始用户输入，而是已经处理过的消息与上下文材料

`query(...)` 的参数定义里直接写着：

- `messages`
- `systemPrompt`
- `userContext`
- `systemContext`
- `toolUseContext`

也就是说，进入 query 的从来不是“原始文本输入”本身，而是**已经被装配好的运行材料**。

只要命令展开结果被塞进 `messages`，它就已经不在输入层，而在 runtime 的预备区了。

### 2. query 在真正发请求前，会再做一次上下文装配

`query.ts` 内部发起模型调用时，用的是：

- `appendSystemContext(systemPrompt, systemContext)`
- `prependUserContext(messagesForQuery, userContext)`
- `deps.callModel(...)`

`cc/src/utils/api.ts` 里的两个函数含义非常直接：

- `appendSystemContext(...)`：把系统级 context 追加到 system prompt
- `prependUserContext(...)`：把 user context 包成一条 `isMeta: true` 的提醒消息，插到 messages 前面

所以本轮 query 真正送给模型的不是“命令展开文本 + 原聊天记录”，而是一个分层装配结果：

- system prompt
- system context
- user context
- messagesForQuery

而命令展开出的 metadata、meta content、attachments、permission attachment，正是在这个装配结果内部参与运行。

这就是“命令接进 runtime”最准确的含义：

> **它不只是留在 transcript 中，而是参与了本轮 callModel 之前的正式装配。**

## 第五部分：至少压出一条完整主链——从识别到行为改变

按写作卡片要求，这篇至少要钉出一条完整链路。最稳的一条就是 prompt command 主链：

1. 用户输入 `/command args`
2. `processUserInput.ts` 发现输入以 `/` 开头，调用 `parseSlashCommand(...)`
3. `processUserInput.ts` 把命令分支交给 `processSlashCommand(...)`
4. `processSlashCommand.tsx` 用 `findCommand(...)` 找到真正的 command 对象
5. prompt command 进入 `getMessagesForPromptSlashCommand(...)`
6. `command.getPromptForCommand(...)` 产生命令展开内容
7. 系统把这份内容包装成：
   - 命令 metadata message
   - meta user message
   - attachment messages
   - `command_permissions` attachment
   - 返回值里的 `allowedTools` / `model` / `effort`
8. `handlePromptSubmit.ts` 或 `QueryEngine.ts` 把这些结果并入当前 turn 的 messages，并把权限信息推进运行上下文
9. `query.ts` 再把这些 messages 与 `userContext` / `systemContext` / `systemPrompt` 组合，调用 `callModel(...)`
10. 因为命令额外带入了 permissions / model / effort，它会继续改变：
    - 当前 query 能使用哪些工具
    - 当前 query 选用哪个模型
    - 当前 query 用什么 effort 运行

这一条链已经足够支持本篇最重要的判断：

> **命令入口不是被“翻译成一句话”送给模型，而是被转换成结构化运行材料，正式并入本轮 runtime 的消息、上下文和权限装配。**

## 第六部分：这篇最该克制的地方

源码重锚之后，这篇有几件事反而要少说。

### 1. 不要把命令入口说成“等于 prompt 层”

旧稿容易把命令入口和某个模糊的 prompt 层混成一件事。

但这次重读代码后更准确的说法是：

- 命令入口先发生在 `processUserInput.ts`
- 结构化展开发生在 `processSlashCommand.tsx`
- runtime 装配发生在 `handlePromptSubmit.ts` / `QueryEngine.ts` / `query.ts`

所以它不是单一的“prompt 层”，而是一条跨层接入链。

### 2. 不要把所有命令都讲成一条链

不是所有 `/xxx` 都会走完全相同的路径。

比如：

- 有些是 local command；
- 有些 prompt command 会 `context: 'fork'`，转去 sub-agent；
- 有些桥接场景还会走 remote-safe 判断。

因此这篇最稳的写法，是明确说：

> **本文压的是 prompt command 进入当前 query runtime 的主链，不是穷举全部命令分支。**

### 3. 不要把 `cc/src/prompt/` 继续写成主锚点

这次最硬的修正之一，就是把旧稿里那个模糊 prompt 锚点拿掉。

如果后面还要讲“系统怎样组织默认 system prompt”，可以另文再回到：

- `cc/src/utils/queryContext.ts`
- `cc/src/constants/prompts.ts`
- `cc/src/context.ts`

但这篇的重点不是 prompt 内容学，而是**命令怎样进入 query runtime**。

## 这一篇真正立住了什么

到这里，这篇真正留下的模型应该是：

- command 不是输入糖衣；
- command 也不只是“帮用户补全一句提示词”；
- command 的运行价值，在于它会被识别成 command 对象；
- 它会被展开成一批 query 可消费的结构化消息与附件；
- 它还会同步带入权限、模型和 effort；
- 最终这些东西进入 `query.ts` 的装配链，参与真实 `callModel(...)`。

所以“命令入口接进 runtime”最准确的一句话，不是“命令被解析后发送给模型”，而是：

> **命令先在输入层被识别，再在 `processSlashCommand.tsx` 中被展开为结构化运行材料，随后通过 `handlePromptSubmit.ts` / `QueryEngine.ts` 并入当前 turn，最后在 `query.ts` 的上下文装配里进入真实模型调用，并以权限、模型、effort 与消息内容一起改写后续运行。**

## 给下一篇留的入口

这一篇讲清之后，下一篇最自然的问题就出来了：

> **如果命令这种显式入口能以结构化方式接进 runtime，那 skill frontmatter / command interface 这些声明式字段，为什么也应该被看成 runtime interface，而不只是附属元数据？**

这正是卷七第 04 篇该接的位置。