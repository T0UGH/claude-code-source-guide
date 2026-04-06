---
title: 卷一 03｜BashTool 不是跑 shell 这么简单
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 03｜BashTool 不是跑 shell 这么简单

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 3/9
- **上一篇**：[上一篇：Tool 体系总览](./02-tool-system-overview.md)
- **下一篇**：[下一篇：FileReadTool 统一读取入口](./04-filereadtool.md)

这一篇开始进入具体工具。BashTool 值得先看，不是因为它最常见，而是因为它最能暴露 Claude Code 对“执行命令”这件事的真实处理方式：权限、上下文、展示和后续编排都在这里拧在一起。

---

## 这篇看什么

这篇看的是：

- `src/tools/BashTool/BashTool.tsx`
- 顺手带一点 `UI.tsx`、`readOnlyValidation.ts` 的上下文

如果前面几篇解决的是：

- tool 是什么
- 主循环怎么把请求送进工具系统
- `query -> runTools -> runToolUse -> tool.call` 这条链怎么接上

那这一篇开始看一个真正的具体工具：BashTool 本身是怎么实现的。

我看完最大的感觉是：

> BashTool 不是“包一层 shell 执行器”，而是 Claude Code 里最像 runtime 内核的工具之一。

它把很多东西揉在了一起：

- 命令执行
- 只读判断
- 权限检查
- sandbox 决策
- 自动后台化
- 输出压缩与持久化
- 图片输出识别
- UI 展示

所以 BashTool 不只是一个 tool，它其实有点像 Claude Code 执行世界的基础设施。

---

## 先给结论

### 1. BashTool 的设计目标不是“能跑命令”

如果只是为了能跑命令，一个很小的 `exec(command)` 就够了。

但 BashTool 这里做的事情远多于这个。

它真正解决的是：

- 什么 bash 可以被当成只读操作
- 什么 bash 可以并发跑
- 什么 bash 可以折叠显示
- 什么 bash 应该后台跑
- 什么 bash 输出太大，不能直接塞回模型
- 什么 bash 输出其实是图片

所以它不是 shell wrapper，而是一整套带判断、带策略、带 UI 的执行模型。

### 2. BashTool 的并发安全，直接建立在“只读性”上

这一句很关键：

```ts
isConcurrencySafe(input) {
  return this.isReadOnly?.(input) ?? false;
}
```

这基本等于在说：

> Bash 命令能不能并发，不靠命令名白名单，先看它是不是只读。

这个设计挺漂亮。

Claude Code 没有把“并发安全”另起一套复杂规则，而是直接复用“只读判断”的结果。这样一来逻辑就很统一：

- 只读 bash → 可以更激进地并发
- 非只读 bash → 串行、谨慎处理

这也解释了为什么 `runTools(...)` 里会优先看 `isConcurrencySafe()`。

### 3. BashTool 的 `isReadOnly()` 很重要，不是装饰方法

关键代码：

```ts
isReadOnly(input) {
  const compoundCommandHasCd = commandHasAnyCd(input.command)
  const result = checkReadOnlyConstraints(input, compoundCommandHasCd)
  return result.behavior === 'allow'
}
```

也就是说，Claude Code 并不是简单拿命令前缀判断“是不是只读”，而是会走一整套 `checkReadOnlyConstraints(...)`。

这也是为什么 `readOnlyValidation.ts` 会那么大。

因为 BashTool 的运行策略，很多地方都建立在“只读判断”之上：

- 并发不并发
- 权限怎么走
- 有没有可能放宽执行条件

这块不是边角料，是 BashTool 的轴心。

---

## BashTool 的输入和输出长什么样

### 输入 schema 比想象中更丰富

BashTool 的输入不只是 `command`。

它至少包括：

- `command`
- `timeout`
- `description`
- `run_in_background`
- `dangerouslyDisableSandbox`
- `_simulatedSedEdit`（内部字段）

这里最值得注意的是两个字段。

#### `description`
这个不是摆设。

源码里专门要求它写成清楚的、主动语态的描述，还明确说不要用 `complex`、`risk` 这种词。

这说明 Claude Code 并不满足于“模型给我个 command 就行”，它希望 command 在 UI 里也能有更像人话的摘要。

#### `_simulatedSedEdit`
这个字段不暴露给模型，只在内部 schema 里有。

注释写得很直白：

- 这是给 sed 编辑预览之后真正落盘用的
- 不能让模型直接传这个字段
- 否则就等于绕过 permission preview 和 sandbox

这一点很能说明 BashTool 的安全边界不是“外面再包一层”，而是直接做进 schema 设计里。

### 输出 schema 也不只是 stdout / stderr

它的输出包括：

- `stdout`
- `stderr`
- `interrupted`
- `isImage`
- `backgroundTaskId`
- `backgroundedByUser`
- `assistantAutoBackgrounded`
- `dangerouslyDisableSandbox`
- `returnCodeInterpretation`
- `noOutputExpected`
- `structuredContent`
- `persistedOutputPath`
- `persistedOutputSize`

看到这里，基本就能确认一件事：

> BashTool 的输出不是“命令结果”，而是“命令结果 + runtime 状态 + UI 所需元信息”。

这和普通 CLI wrapper 已经不是一个层级的东西了。

---

## BashTool 里最有意思的几块设计

### 1. 它会判断 bash 命令是不是“搜索 / 读取 / 列表”类

源码里有：

```ts
isSearchOrReadBashCommand(command)
```

它把 bash 命令分成：

- search：`grep` / `find` / `rg`
- read：`cat` / `head` / `tail` / `jq` / `awk`
- list：`ls` / `tree` / `du`

这不是为了安全，而是为了 UI。

因为这些命令在界面里通常应该折叠显示，而不是像 edit 那样完整展开。

也就是说，BashTool 不只是“执行 bash”，它还负责告诉 UI：

- 这次 bash 更像搜索
- 更像读文件
- 还是更像列目录

这类语义标注很值。它让 UI 不用靠猜。

### 2. 它会判断“这个命令成功时本来就应该没输出”

源码里还有：

```ts
isSilentBashCommand(command)
```

比如：

- `mv`
- `cp`
- `mkdir`
- `chmod`
- `touch`

这些命令成功时没 stdout 很正常。

这意味着 Claude Code 在结果展示时，可以把“没输出”解释成 `Done`，而不是让用户看到一个傻乎乎的 `(No output)`。

这个点很小，但很产品。

### 3. 它会主动阻止某些 `sleep` 用法

`validateInput()` 里有个有意思的逻辑：

- 如果启用了 `MONITOR_TOOL`
- 用户又没有显式后台跑
- 命令里出现了阻塞型 `sleep N`

那就直接拦掉。

返回的 message 也很明确：

- 长等待请用后台任务
- 看日志/轮询请用 Monitor tool
- 真要延迟，控制在 2 秒内

这一点特别像 Claude Code 的产品判断：

> 它不是只问“你能不能跑这个命令”，而是在逼模型养成一种更适合 agent runtime 的执行习惯。

这就不是 shell 了，这是 workflow discipline。

### 4. `call()` 一开头就先处理 simulated sed edit

```ts
if (input._simulatedSedEdit) {
  return applySedEdit(...)
}
```

这说明 BashTool 里其实混进了一条“看起来像 bash，实际上直接走结构化文件写入”的分支。

原因也很务实：

- 用户在 permission dialog 里预览的是某次 sed 编辑的结果
- 真正执行时，必须保证写入内容和预览完全一致
- 所以不再重新跑 sed，而是直接应用预计算结果

这个设计很稳。它避免了“用户看到的 diff”和“真正执行时的 diff”不一致。

### 5. 真正的命令执行在 `runShellCommand()`

`call()` 不是直接 `exec(command)`，而是进：

```ts
runShellCommand(...)
```

然后通过 async generator 一边拿 progress，一边等最终结果。

这里能看出 BashTool 的另一个特点：

> 它从一开始就不是按“一次性返回结果”设计的，而是按“流式执行 + 进度反馈”设计的。

这也解释了为什么前面 `toolExecution.ts` 里会有那么多 progress message 逻辑。

---

## BashTool 最像“产品逻辑”的地方

### 1. 自动后台化

源码里有两种后台化。

#### 用户显式要求
```ts
run_in_background === true
```

这种就直接后台跑。

#### assistant-mode 自动后台化
如果：

- 开了 Kairos
- 是主线程
- 没禁用 background tasks
- 不是用户显式要求前台跑
- 命令跑太久

就会自动 background。

而且还有一个明确预算：

```ts
const ASSISTANT_BLOCKING_BUDGET_MS = 15_000;
```

15 秒。

这意味着 Claude Code 对主 agent 的态度不是“你等 bash 跑完”，而是：

> 主 agent 要保持响应性，长任务自己滚去后台。

这太像一个真正的 agent runtime 了，不像普通终端工具。

### 2. 大输出不会直接塞回模型

如果输出太大，BashTool 会：

- 把完整输出落到磁盘
- 返回 preview
- 把路径告诉模型，让它需要时自己再读

对应字段是：

- `persistedOutputPath`
- `persistedOutputSize`

这点也很关键。

因为 Claude Code 很清楚：

- bash 输出经常巨大
- 直接塞回模型既浪费 token，也容易炸上下文

所以它的处理不是“截断就完了”，而是：

> 把大输出变成可回读的外部对象。

这已经有点像操作系统里的临时文件设计了。

### 3. 它还会处理图片输出

如果 stdout 其实是图片数据，BashTool 会识别：

- `isImageOutput(...)`
- 必要时 `resizeShellImageOutput(...)`

最后 `mapToolResultToToolResultBlockParam()` 里会尝试把它包装成 image block，而不是普通文本。

也就是说，BashTool 其实不是“文本终端工具”，它已经是一种更宽的 I/O 通道了。

---

## `mapToolResultToToolResultBlockParam()` 很值得注意

这部分我觉得特别关键，因为它把 BashTool 的内部结果翻译成模型能接的 API block。

这里至少处理了几种情况：

1. `structuredContent`
   - 有结构化内容时，直接返回结构化 block

2. `isImage`
   - 把 stdout 当图片 block 发回去

3. `persistedOutputPath`
   - 输出太大时，不直接回全文，而是回 preview + 文件路径说明

4. `backgroundTaskId`
   - 后台任务会附带说明文字，告诉模型任务还在跑、输出写去哪了

这里其实能看出 Claude Code 的一个很成熟的做法：

> tool result 不是“原样返回执行结果”，而是“加工成适合下一轮模型理解的形式”。

这一步如果做不好，agent 会很笨。

---

## 我对 BashTool 的整体判断

如果让我现在给 BashTool 下一个定义，我会这么说：

> BashTool 是 Claude Code 里最重的基础设施型 tool。它表面上是 shell 执行器，实际上承担了执行策略、安全策略、UI 策略和输出整理四层职责。

也正因为它承担得太多，所以 BashTool 不是一个文件就能看完的东西。`BashTool.tsx` 更像主干，很多真正复杂的判断都下沉到了：

- `readOnlyValidation.ts`
- `bashPermissions.ts`
- `UI.tsx`
- `shouldUseSandbox.ts`

这也是为什么 BashTool 目录会这么肥。

---

## 这一篇我最想记住的一句话

> BashTool 看起来是在跑 bash，实际上是在替 Claude Code 管理“命令怎么跑、跑多久、怎么展示、结果怎么回给模型”。

---
