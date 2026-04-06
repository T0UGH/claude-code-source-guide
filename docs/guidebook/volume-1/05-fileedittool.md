---
title: 卷一 05｜FileEditTool 是受控修改原语
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 05｜FileEditTool 是受控修改原语

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 5/9
- **上一篇**：[上一篇：FileReadTool 统一读取入口](./04-filereadtool.md)
- **下一篇**：[下一篇：FileWriteTool 是整文件覆盖原语](./06-filewritetool.md)

这一篇从读取走到修改。重点不是编辑功能本身，而是“受控修改”这个思路：Claude Code 怎么把文件编辑收敛成一种可治理的原语。

---

## 这篇看什么

这篇看的是：

- `src/tools/FileEditTool/FileEditTool.ts`

如果 FileReadTool 解决的是“怎么稳定地读”，那 FileEditTool 解决的是另一个更敏感的问题：

> 怎么改文件，既让模型好用，又别把文件改坏。

我看完最大的感觉是：

> FileEditTool 不是“字符串替换工具”，而是 Claude Code 给模型提供的受控修改原语。

它做的事比表面看到的 `old_string -> new_string` 多得多：

- 路径规范化
- 权限检查
- 文件是否先读过
- 文件在读完后有没有被别人改过
- old_string 是否唯一
- 是否应该 replace_all
- 引号风格是否要保留
- notebook 是否应该交给别的 tool
- settings 文件能不能这么改
- 改完后 LSP / VS Code / file history 要不要同步

所以它本质上是 Claude Code 的“安全编辑接口”，不是简单 patch helper。

---

## 先给结论

### 1. FileEditTool 的核心不是“把字符串替换掉”

如果只是做字符串替换，几行代码就够了。

但 FileEditTool 的真正职责更像是：

- 保证修改发生在一个模型已经读过的文件上
- 保证修改发生在它以为的那个文件版本上
- 保证修改目标是明确的，不是模糊命中多个位置
- 保证结果能被 LSP、VS Code、file history、后续 readFileState 正确接住

也就是说，它的设计目标不是“改成功”，而是：

> 在 agent 运行时里，尽可能可靠地改成功。

### 2. 它要求“先读再改”

这点是 FileEditTool 最关键的原则之一。

在 `validateInput()` 里有这一段：

- 如果这个文件没有出现在 `readFileState` 里
- 或者之前读的是 partial view

那就直接拒绝：

> `File has not been read yet. Read it first before writing to it.`

这个规则非常重要。

它在强迫模型遵守一种顺序：

1. 先读
2. 理解上下文
3. 再改

而不是“凭猜测直接写”。

从 Claude Code 的角度看，这不是限制，而是让编辑行为更稳定的基本纪律。

### 3. 它本质上是“基于上下文的精确替换”，不是 AST 编辑器

FileEditTool 的输入核心还是：

- `file_path`
- `old_string`
- `new_string`
- `replace_all`

也就是说，它没走 AST，也没走结构化代码改写，而是选择了一条很 Claude Code 的路：

> 给模型一个相对好理解、又比整文件重写更安全的局部替换接口。

这条路不完美，但很实用。

因为对大模型来说：

- 整文件写入太重
- Bash/sed 太危险
- AST 编辑太复杂，适配成本高

而 `old_string -> new_string` 在很多实际代码场景里已经够用，而且更容易做校验。

---

## FileEditTool 最有意思的几块设计

### 1. `validateInput()` 很重，而且合理

FileEditTool 的 `validateInput()` 基本不是“输入检查”，而是半个编辑前安全网。

它至少会检查这些：

#### old_string 和 new_string 是否完全一样
如果一样，直接拒绝。

#### 路径是否命中 deny rule
如果 permission settings 禁止编辑这个路径，直接拒绝。

#### UNC 路径特殊处理
和 FileReadTool 一样，避免过早触发远程路径带来的安全问题。

#### 文件是否过大
超过 1 GiB 直接不让改，避免 OOM。

#### 文件是否存在
- 不存在但 `old_string === ''`：允许，视为新建文件
- 不存在且 `old_string !== ''`：拒绝，并尽量给相似路径提示

#### 文件是否是 notebook
如果是 `.ipynb`，直接要求你改用 `NotebookEditTool`。

#### 文件是否已经 read 过
如果没读过，不让改。

#### 文件读完后有没有变化
如果文件自从上次 read 后已经被别人改过，要求你重新 read。

#### `old_string` 是否真的存在
找不到就拒绝。

#### `old_string` 是否命中多个位置但 `replace_all=false`
如果命中多个位置，又没显式允许 replace_all，就拒绝。

#### settings 文件是否允许这么改
交给 `validateInputForSettingsFileEdit(...)` 做额外校验。

这一整套逻辑看下来，你会发现它的精神其实很统一：

> 尽量把“模糊编辑”和“基于过期上下文的编辑”挡在执行前。

这正是 Claude Code 这种 agent 工具最该做的事。

### 2. 它会处理“文件被改了，但内容其实没变”的情况

有一段判断很实用：

- 如果文件的 mtime 比上次 read 新
- 理论上应该视为“文件变了”

但在 Windows 上，mtime 有时候会被云同步、杀毒软件之类搞脏。

所以 FileEditTool 还会再补一层：

- 如果上次是 full read
- 而且当前文件内容和当时 read 的内容完全一致
- 那就继续允许编辑

这个点很工程，也很接地气。

它说明 Claude Code 不只是机械地信时间戳，而是知道现实系统里时间戳并不总可靠。

### 3. 它会做 quote style 保留

这里有一个很 Claude Code 的小细节：

```ts
const actualNewString = preserveQuoteStyle(...)
```

意思是：

- 模型给你的 `old_string`
- 和文件里的真实字符串
- 可能会因为直引号、弯引号之类不完全一致

所以它会：

- 先 `findActualString(...)`
- 再 `preserveQuoteStyle(...)`

这能减少那种“模型明明改的是这段，但因为引号风格不同而改得很丑”的情况。

这个细节不大，但很像真实产品会补的坑。

### 4. 它不是直接改文件，而是先生成 patch

这一段很关键：

```ts
const { patch, updatedFile } = getPatchForEdit(...)
```

也就是说，FileEditTool 并不是直接 `replace()` 完就写盘，而是先生成一个结构化 patch，然后再写。

这一步的价值很大：

- 结果更容易展示
- 更容易做 diff
- 更容易统计改动行数
- 更方便后续审计或回显

这让 FileEditTool 输出的不只是“新文件内容”，而是“这次改动本身”。

这和 FileWriteTool 的整文件覆盖，会是两种完全不同的体验。

### 5. 改完之后，它会主动通知一堆系统

FileEditTool 很像一个“编辑事务提交器”。

改完之后，它不会只做一件 `writeTextContent()` 就收工，而是还会：

- 通知 LSP server：`changeFile()` / `saveFile()`
- 清理旧 diagnostics：`clearDeliveredDiagnosticsForFile()`
- 通知 VS Code 更新 diff 视图：`notifyVscodeFileUpdated()`
- 更新 `readFileState`
- 记录 `fileHistory`
- 记录 analytics
- 在某些场景下还计算 git diff

这部分特别能说明它的定位：

> FileEditTool 不只是文件写入器，而是 Claude Code 代码编辑体验的同步中心。

如果没有这一堆后续动作，编辑当然也能成功，但整个系统会变得很散：

- diagnostics 可能过时
- VS Code 看不到变更
- file history 没法回退
- 后续编辑的 stale-check 也不准

所以这些同步动作不是锦上添花，是编辑系统的一部分。

---

## FileEditTool 和 FileReadTool 放在一起看，很有意思

这两个工具其实是一对。

### FileReadTool 的原则
- 先把内容稳定地读进来
- 避免重复把同样内容塞进上下文
- 针对不同媒介走不同读取策略

### FileEditTool 的原则
- 必须基于读过的上下文来改
- 必须确认目标字符串存在且不歧义
- 必须确认文件没在中间被别人改掉

你把这两者放在一起，就能看到 Claude Code 本地文件操作的基本模型：

> read 负责把上下文变得可靠，edit 负责把修改变得可控。

这比“都用 Bash 搞定”要稳太多。

---

## `mapToolResultToToolResultBlockParam()` 很克制

这个函数的返回很简单：

- 如果是 `replace_all`
  - 告诉你所有命中项都改掉了
- 否则
  - 告诉你文件更新成功了
- 如果用户在批准时改过你的提案
  - 会补一句 `user modified your proposed changes before accepting them`

这里有意思的地方在于：

> FileEditTool 不把整份 diff 再原样塞回模型。

它更像是：

- 详细 diff 给 UI / tool result message 用
- 模型侧只拿一个简洁确认

这和 BashTool 那种经常要把大量输出传回去完全不一样。

这说明 FileEditTool 更偏结构化修改动作，而不是产生一堆文本输出。

---

## 这个 tool 最像产品判断的地方

如果我要挑 FileEditTool 里最像产品的地方，我会挑这三个：

### 1. 没读过就不让改
这几乎是 Claude Code 编辑系统最重要的纪律。

### 2. 命中多个位置但没显式 replace_all，就不让改
它宁可打断你，也不想让模型含糊地改错地方。

### 3. 改完自动把 LSP / diagnostics / VS Code / file history 全部同步起来
这让 FileEditTool 看起来不像一个孤立工具，而像整个编辑工作流里的中心节点。

---

## 我对 FileEditTool 的整体判断

如果让我现在给 FileEditTool 下一个定义，我会这么说：

> FileEditTool 是 Claude Code 的受控局部修改原语。它不追求“什么都能改”，而追求“在已经读过、上下文一致、目标明确的前提下，把文件稳稳改掉”。

这点非常重要。

因为 Claude Code 真正需要的，不是一个最自由的编辑器，而是一个：

- 模型能稳定用
- runtime 能验证
- UI 能解释
- 系统其余部分能跟上的修改接口

而 FileEditTool 基本就是按这个目标做出来的。

---

## 这一篇我最想记住的一句话

> FileEditTool 不是替模型“写文件”，而是在替 Claude Code 守住一个边界：修改必须建立在已读上下文、明确命中和未过期状态之上。

---
