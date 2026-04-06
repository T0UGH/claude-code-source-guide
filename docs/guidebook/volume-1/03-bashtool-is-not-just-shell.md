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

这一篇开始进入具体工具。先看 BashTool，不是因为它最常见，而是因为它最能暴露 Claude Code 对“执行命令”这件事的真实理解：权限、上下文、展示、后台化和结果回传，全都在这里缠在一起。

如果前面几篇解决的是：

- tool 是什么
- 主循环怎么把请求送进工具系统
- `query -> runTools -> runToolUse -> tool.call` 这条链怎么接上

那这一篇要回答的问题就是：**当 Claude Code 说“执行一条 bash 命令”时，它到底在执行什么。**

先把结论摆前面：

> **BashTool 不是“包一层 shell 执行器”，而是 Claude Code 里最像 runtime 内核的工具之一。**

因为它处理的从来不只是“把命令扔给 shell”，而是同时处理：

- 这条命令是不是只读
- 它能不能并发
- 它该不该先进权限流
- 它要不要进 sandbox
- 它是不是该后台跑
- 它的输出该怎么压缩、持久化、展示、再喂回模型

所以这篇不要把 BashTool 看成一个命令执行器，而要把它看成 Claude Code 管理“命令型动作”的总闸门。

---

## 这篇看什么

这篇主要看：

- `src/tools/BashTool/BashTool.tsx`

顺手会带到几块和它强绑定的上下文：

- `readOnlyValidation.ts`
- `bashPermissions.ts`
- `shouldUseSandbox.ts`
- `UI.tsx`

原因很简单：`BashTool.tsx` 像主干，但很多真正决定运行策略的判断，并不都写死在这一个文件里。你如果只把它当作一个 `exec(command)` 包装层，会一直低估它在整个运行时里的位置。

---

## 先给三个判断

### 1. BashTool 的设计目标不是“能跑命令”

如果目标只是“执行 shell”，一个很薄的 `exec(command)` 就够了。

但 BashTool 解决的是另一层问题：**Claude Code 怎么把 bash 这种高自由度、强副作用、输出不稳定的能力，收编进一个 agent runtime。**

所以它关心的不是“命令有没有执行成功”这么单薄，而是：

- 哪些命令可以被当成只读
- 哪些命令可以并发
- 哪些命令该折叠展示
- 哪些命令成功时本来就不会有输出
- 哪些命令跑久了应该自动转后台
- 哪些输出太大，不该直接塞进模型上下文
- 哪些 stdout 其实根本不是文本，而是图片

这个视角一立住，后面很多细节就顺了：BashTool 的核心不是 shell，而是**执行策略**。

### 2. BashTool 的很多运行策略，轴心都在“只读判断”上

原稿里最值得保住的一句判断，我觉得就是这个意思：**`isReadOnly()` 不是装饰方法，而是 BashTool 的轴心。**

关键代码大意是：

```ts
isConcurrencySafe(input) {
  return this.isReadOnly?.(input) ?? false;
}
```

以及：

```ts
isReadOnly(input) {
  const compoundCommandHasCd = commandHasAnyCd(input.command)
  const result = checkReadOnlyConstraints(input, compoundCommandHasCd)
  return result.behavior === 'allow'
}
```

这两段连起来，意思很明确：

> **Bash 命令能不能更激进地并发，先看它是不是被判定为只读。**

也就是说，Claude Code 没有为“并发安全”再单独维护一套巨大的规则系统，而是复用了只读判断的结果。于是逻辑统一成了一条主线：

- 只读 bash → 可以更积极并发
- 非只读 bash → 谨慎、串行、更多约束

这也解释了为什么 `readOnlyValidation.ts` 会很大。它不是边角料，而是在给 BashTool 后面的一串运行决策提供地基。

### 3. BashTool 的输出也不是“stdout/stderr 包一层”

看它的输出 schema，大概就能明白这已经不是传统 shell wrapper 了。

除了常见的：

- `stdout`
- `stderr`
- `interrupted`

它还会带上：

- `backgroundTaskId`
- `backgroundedByUser`
- `assistantAutoBackgrounded`
- `isImage`
- `structuredContent`
- `persistedOutputPath`
- `persistedOutputSize`
- `returnCodeInterpretation`
- `noOutputExpected`

这说明 BashTool 返回给上层的不是“命令原始结果”，而是：

> **命令结果 + 运行时状态 + UI 所需语义 + 下一轮模型继续工作的线索。**

这一点特别重要。因为 Claude Code 要的不是“执行完了”，而是“执行完之后，系统下一步还能接着工作”。

---

## 先把 BashTool 看成四层职责，而不是一个工具文件

如果只从产品功能看，BashTool 至少同时承担四层职责。

### 1. 执行层：真的把命令跑起来

这部分当然存在，但它不是全部。

`call()` 里真正落到执行，不是直接 `exec(command)`，而是进 `runShellCommand(...)`，再通过 async generator 边拿进度边等最终结果。

这说明它从一开始就不是按“一次性返回结果”的思路设计的，而是按：

- 流式执行
- 进度上报
- 可中断/可切后台

这样的 runtime 形态设计的。

### 2. 安全层：决定这条命令该被怎样约束

BashTool 的安全边界不是执行前面随便包一层，而是直接写进输入、校验和权限路径里。

比如 `_simulatedSedEdit` 这个内部字段就很能说明问题：

- 它不暴露给模型
- 它是给 sed 预览之后真正落盘用的
- 如果允许模型直接传，就等于绕过 permission preview 和 sandbox

还有 `isReadOnly()`、`checkReadOnlyConstraints(...)`、权限检查、sandbox 决策，这些都说明 BashTool 的安全判断不是事后补丁，而是执行模型的一部分。

### 3. 调度层：决定命令怎么跑、跑多久、何时切后台

BashTool 很像 runtime 内核，一个重要原因是它不只管“执行”，还管“调度”。

比如它支持两类后台化：

#### 用户显式要求后台跑

```ts
run_in_background === true
```

这种很好理解。

#### assistant-mode 自动后台化

如果满足一组条件，比如：

- 开了 Kairos
- 在主线程
- 没禁用 background tasks
- 用户没有明确要求前台阻塞
- 命令已经跑得太久

它会自动把任务切去后台。

而且这里还有一个非常 runtime 的预算：

```ts
const ASSISTANT_BLOCKING_BUDGET_MS = 15_000;
```

15 秒。

这句话背后的产品判断非常明确：

> **主 agent 不应该为了等一条长命令而失去响应性。**

所以 BashTool 不只是执行 shell，它在替 Claude Code 维持 agent 的前台响应能力。

### 4. 展示层：把“执行结果”加工成模型和 UI 都能继续消费的对象

这也是很多人最容易低估的一层。

BashTool 不是把 stdout/stderr 原样交出去，而是会先做语义整理，再映射成 tool result block。

`mapToolResultToToolResultBlockParam()` 里至少会区分：

1. `structuredContent`
   - 有结构化内容就直接走结构化 block
2. `isImage`
   - stdout 如果其实是图片，就走 image block
3. `persistedOutputPath`
   - 输出太大时，不直接回全文，而是回 preview + 文件路径说明
4. `backgroundTaskId`
   - 告诉上层这是个后台任务，结果还在继续产生

这一步的本质不是“美化结果”，而是：

> **把底层执行结果翻译成下一轮模型真正能理解、能继续利用的形式。**

如果没有这层，agent 很容易只会“调用命令”，不会“基于命令结果继续工作”。

---

## 具体看几块最能说明问题的设计

### 1. 输入 schema 比“给我个 command”复杂得多

BashTool 的输入至少包括：

- `command`
- `timeout`
- `description`
- `run_in_background`
- `dangerouslyDisableSandbox`
- `_simulatedSedEdit`（内部字段）

这里最值得注意的不是字段数量，而是字段透露出来的产品意图。

#### `description` 不是摆设

源码要求它写成清楚、主动语态的摘要，还特意避免 `complex`、`risk` 这类词。

这说明 Claude Code 希望模型不只是“给命令”，而是同时给出一个适合展示、适合让人理解的动作描述。也就是说，BashTool 从 schema 层就已经在替 UI 争取可读性。

#### `_simulatedSedEdit` 说明安全边界直接做进了协议

这不是普通工具参数，而是一条内部执行分支的开关。它存在的目的，是保证用户在权限预览里看到的改动，和真正落盘的改动保持一致，而不是执行时再重新跑一次 sed，冒出新的差异。

这类字段很能说明问题：Claude Code 的安全不是靠“外面包个壳”，而是靠协议本身限制哪些路径能被模型直接触发。

### 2. BashTool 会给 UI 提供命令语义，而不只是执行结果

源码里有一类判断很像产品层逻辑，比如：

```ts
isSearchOrReadBashCommand(command)
```

它会把命令大致分成：

- search：`grep` / `find` / `rg`
- read：`cat` / `head` / `tail` / `jq` / `awk`
- list：`ls` / `tree` / `du`

这不是在做安全校验，而是在给 UI 提供语义标签。因为搜索、读文件、列目录，这几类命令在界面上的展示策略本来就不一样。

也就是说，BashTool 不只是“执行一个 bash”，它还在顺手告诉 UI：**这次调用更像什么动作。**

这一层值很大，因为它把“语义分类”留在最懂命令内容的地方，而不是让 UI 反过来硬猜。

### 3. 它知道“没输出”有时是正常成功，而不是空白失败

另一个很产品的小点，是：

```ts
isSilentBashCommand(command)
```

像下面这些命令，成功时本来就可能没有 stdout：

- `mv`
- `cp`
- `mkdir`
- `chmod`
- `touch`

这个判断的价值在于，Claude Code 可以把结果解释成 `Done`，而不是傻乎乎地展示 `(No output)`。

这是个细节，但也是 BashTool 不再只是执行器的证据：它在替系统判断**该怎样解释结果**。

### 4. 它会主动阻止某些 `sleep` 用法

`validateInput()` 里还有一个很有代表性的逻辑：

- 如果启用了 `MONITOR_TOOL`
- 用户又没有显式要求后台跑
- 命令里出现了阻塞型 `sleep N`

那就直接拦掉。

而且给出的引导也很明确：

- 长等待请用后台任务
- 看日志或轮询请用 Monitor tool
- 真要延迟，把时间控制在 2 秒内

这个设计特别能体现 Claude Code 的 runtime 心态：

> 它不满足于“命令合法就让你跑”，而是在反过来训练模型养成更适合 agent 系统的执行习惯。

所以这已经不是 shell discipline，而是 workflow discipline。

### 5. `call()` 开头先处理 simulated sed edit，说明它不是单一路径的 shell 执行器

原稿里提到的这段也很关键：

```ts
if (input._simulatedSedEdit) {
  return applySedEdit(...)
}
```

这说明 BashTool 里实际混着一条“看起来像 bash，实际是结构化写入”的分支。

原因也很务实：

- 用户预览的是某次 sed 编辑的结果
- 真执行时必须保证写入内容和预览完全一致
- 所以真正落盘不再重新运行 sed，而是直接应用预计算结果

这个设计背后的重点不是 sed，而是：**BashTool 的职责并不等于把字符串命令交给 shell。**当系统需要更稳的执行保证时，它会直接换成更受控的实现路径。

---

## 为什么说它最像 Claude Code 的“命令运行时”

到这里，其实已经能把前面的零散点收成一条主线：

### BashTool 真正管理的是这四件事

#### 1. 命令能不能被视作低风险

这对应只读判断、权限流、sandbox 决策。

#### 2. 命令该怎样被调度

这对应并发安全、前后台切换、阻塞预算、进度上报。

#### 3. 命令结果该怎样被整理

这对应静默命令、结构化结果、图片识别、大输出持久化。

#### 4. 整理后的结果怎样重新进入 agent 回路

这对应 tool result block 的映射、preview、路径提示、后台任务说明。

把这四件事连在一起看，你就会发现：

> **BashTool 看起来是在跑 bash，实际上是在替 Claude Code 管理“命令怎么跑、跑多久、怎么展示、结果怎么回给模型”。**

这也是为什么它更像基础设施，而不是普通工具实现。

---

## 我对 BashTool 的整体判断

如果要给 BashTool 下一个定义，我会这样说：

> **BashTool 是 Claude Code 里最重的基础设施型 tool。它表面上是 shell 执行器，实际上承担了执行策略、安全策略、UI 策略和输出整理四层职责。**

也正因为它承担得太多，所以 `BashTool.tsx` 不是“看完一个文件就结束”的那种入口文件。它更像主干，很多真正复杂的判断都下沉到了：

- `readOnlyValidation.ts`
- `bashPermissions.ts`
- `shouldUseSandbox.ts`
- `UI.tsx`

这不是目录膨胀的偶然，而是因为 BashTool 本身就已经接近 Claude Code 的命令运行时。

---

## 这一篇我最想记住的一句话

> BashTool 不是在替 Claude Code “执行一条 shell 命令”，而是在替它维持整套命令型动作的运行秩序。
