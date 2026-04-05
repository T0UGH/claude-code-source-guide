---
title: 卷一 04｜FileReadTool 统一读取入口
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 04｜FileReadTool 统一读取入口

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 4/9
- **上一篇**：[上一篇：BashTool 不是跑 shell 这么简单](./03-bashtool-is-not-just-shell.md)
- **下一篇**：[下一篇：FileEditTool 是受控修改原语](./05-fileedittool.md)

这一篇看读取原语。它的价值不只是“读文件”，而是让你看清 Claude Code 怎么把最基础的文件读取动作包装成稳定的工具接口。

---

## 这篇看什么

这篇看的是：

- `src/tools/FileReadTool/FileReadTool.ts`

如果 BashTool 更像 Claude Code 的执行内核之一，那 FileReadTool 更像另一种基础设施：

> 把“读取文件”这件事做成稳定、结构化、跨类型的统一入口。

它不只是读 `.ts`、`.md` 这种文本文件，还顺手覆盖了：

- 图片
- PDF
- notebook
- session memory / transcript 一类特殊文件

所以 FileReadTool 的定位不是 `cat` 的替代品，而是 Claude Code 给模型提供的标准化读取能力。

---

## 先给结论

### 1. FileReadTool 的目标不是“尽量把文件内容都读出来”

这点很关键。

它的设计目标更像是：

- 能读文本，但要控制 token 和大小
- 能读图片，但要控制分辨率和 token 预算
- 能读 PDF，但要控制页数和提取方式
- 能读 notebook，但不把 notebook 当普通文本生啃
- 能避免重复读取同一份没变化的文件

也就是说，FileReadTool 关心的不是“我能不能把文件打开”，而是：

> 把不同类型的文件，以模型最能消化的方式读进来。

### 2. 它是“按文件类型分流”的 tool

FileReadTool 不是一个统一 `readFile()` 跑到底的设计。

它在 `callInner()` 里一上来就按类型分流：

- notebook → `readNotebook()`
- image → `readImageWithTokenBudget()`
- PDF → `readPDF()` / `extractPDFPages()`
- text → `readFileInRange()`

这说明 Claude Code 并没有把“读文件”理解成一种动作，而是理解成一组相关但不同的读取策略。

这一点非常对。

因为对模型来说：

- 读文本
- 读 notebook
- 读 PDF
- 读图片

根本不是一回事。

### 3. 它是少数明确把“去重”做到工具层里的 tool

FileReadTool 有一段很值的逻辑：

- 如果已经读过同一个文件
- 而且 offset / limit 一样
- 而且磁盘上的 mtime 没变

那就不再把整份内容重新塞进上下文，而是返回：

- `file_unchanged`
- 对应 `FILE_UNCHANGED_STUB`

这说明 Claude Code 已经很明确地在工具层做一件事：

> 避免重复读同一份没变的内容，浪费上下文和 token。

这不是小优化，这是实际 agent 体验里很有价值的一层。

---

## FileReadTool 的输入和输出长什么样

### 输入非常克制

输入只有四个字段：

- `file_path`
- `offset`
- `limit`
- `pages`

这个设计很干净。

它没有往 schema 里塞一堆“模式开关”，而是把复杂性尽量留在内部逻辑里。对模型来说，最主要就是：

- 读哪个文件
- 从哪一行开始
- 读多少行
- 如果是 PDF，要读哪些页

### 输出不是单一文本，而是判别式 union

它的 output schema 是一个 `discriminatedUnion('type', ...)`，包括：

- `text`
- `image`
- `notebook`
- `pdf`
- `parts`
- `file_unchanged`

这非常重要。

因为它意味着 FileReadTool 返回的不是一个统一字符串，而是带类型的读取结果。

也就是说，Claude Code 一开始就承认：

> 文件读取结果本来就不是一种东西，别硬捏成一坨字符串。

这个设计很靠谱。

---

## 它最有意思的几块设计

### 1. `isConcurrencySafe()` 和 `isReadOnly()` 都是直接 true

这个比较直白：

```ts
isConcurrencySafe() {
  return true
}

isReadOnly() {
  return true
}
```

也就是说，FileReadTool 在 Claude Code 里被明确当成：

- 可并发
- 只读

这和 BashTool 形成一个很强的对比。

BashTool 要费劲判断“是不是只读”，FileReadTool 则从定义上就明确了自己的语义边界。

这也说明 Claude Code 倾向于把高频、安全、语义明确的动作做成专门 tool，而不是全部丢给 Bash。

### 2. `backfillObservableInput()` 会把路径规范化

有这一段：

```ts
if (typeof input.file_path === 'string') {
  input.file_path = expandPath(input.file_path)
}
```

注释写得很直接：

- hook 文档里要求 `file_path` 是绝对路径
- 所以这里会统一展开路径
- 防止用 `~` 或相对路径绕过 hook allowlist

这个细节很值。

因为它说明 FileReadTool 不是“收到路径就读”，而是很在意：

- hooks 看到的路径是不是标准化的
- permission matching 用的是不是统一表示

这类小地方很能看出 Claude Code 的工程成熟度。

### 3. `validateInput()` 做了很多前置拦截

FileReadTool 的 `validateInput()` 很丰富，远不只是“文件存不存在”。

它会先做几类检查：

#### PDF 页码是否合法
- pages 格式对不对
- 一次请求是不是超过最大页数

#### deny rule 检查
- 如果路径命中 read deny 规则，直接拒绝

#### UNC path 特殊处理
- 避免在权限确认前就碰远程路径，减少安全风险

#### 二进制扩展名检查
- 普通二进制文件直接拒绝
- 但 PDF、图片例外，因为这个 tool 对它们有专门处理

#### 设备文件检查
- 比如 `/dev/zero`、`/dev/random`、`/dev/stdin`
- 这些不是“不推荐读”，而是根本会挂住或无限输出

这一层很像一个“读文件防呆层”。

也就是说，FileReadTool 不是让模型随便读，而是在读之前就把那些很蠢、很危险、很容易卡住系统的路径先拦掉。

### 4. 它会尝试修正 macOS 截图路径

这一段我挺喜欢。

macOS 某些版本的截图文件名，在 `AM/PM` 前面可能是普通空格，也可能是窄空格（U+202F）。

FileReadTool 专门写了 `getAlternateScreenshotPath()` 去兜这个坑。

这很像一个真实产品会做的事，而不是纯工程演示项目。

它说明 Claude Code 的实现者不是只关心“代码优雅”，也关心用户机器上那些烦人的实际问题。

### 5. 它会自动触发 skill 发现

读文件时，如果不是 simple mode，它还会：

- `discoverSkillDirsForPaths(...)`
- `addSkillDirectories(...)`
- `activateConditionalSkillsForPaths(...)`

这说明 FileReadTool 不只是“读完把内容给模型”，它还是 skill 发现链路的一部分。

也就是说，Claude Code 在读某个路径时，可能顺手激活和这个路径相关的 skill。

这个设计挺妙的：

> 读取文件，不只是补内容，也可能补能力。

---

## `call()` 里最值的一段：去重读取

我觉得 FileReadTool 最有代表性的工程点，就是这段 dedup 逻辑。

它会看：

- 这个文件之前是不是读过
- 读的是不是同一个 offset / limit
- 文件有没有改过

如果都没变，就直接返回：

```ts
{
  type: 'file_unchanged',
  file: { filePath }
}
```

这背后的思路很清楚：

- 之前的 read 结果已经在上下文里了
- 再把整份文件重复塞一遍没有价值
- 还会白白消耗 cache_creation tokens

这个设计非常 agent 化。

普通工具实现往往只管“能不能执行成功”，FileReadTool 开始关心“对整个会话上下文是不是划算”。

---

## `mapToolResultToToolResultBlockParam()` 也很成熟

这里能看到 FileReadTool 对不同输出类型的处理完全不一样。

### 文本
- 会加行号
- 可能加 memory freshness note
- 可能加 cyber risk mitigation reminder

### 图片
- 直接返回 image block

### notebook
- 走 notebook 专门的映射函数

### PDF
- 不直接把全文硬塞回去，而是返回 PDF 读取说明

### `file_unchanged`
- 返回一个固定 stub

这说明 FileReadTool 的结果映射不是“统一 stringify”，而是每种媒介走各自最合理的表示方式。

这点其实和 BashTool 很像：

> tool 的输出不是为了忠实还原底层 I/O，而是为了给下一轮模型提供最合适的上下文表示。

---

## 这个 tool 最像产品的地方

如果我要挑 FileReadTool 里最像产品判断的地方，不是 PDF，也不是图片，而是这三个：

### 1. 重复读取不重复塞内容
很省上下文，而且逻辑上也说得通。

### 2. 读不到文件时会给相似路径提示
- `findSimilarFile()`
- `suggestPathUnderCwd()`

也就是说，它不是简单抛一个 ENOENT，而是尽量把错误变成人能用的反馈。

### 3. notebook / PDF / image 都不硬当文本处理
这会让模型读起来稳定很多，也避免上下文被一堆低质量原始数据污染。

这几个点合起来，能明显感觉到：

> FileReadTool 不是一个“工程上可用”的读取器，而是一个“给 agent 用、给模型用、给真实用户体验服务”的读取器。

---

## 我对 FileReadTool 的整体判断

如果让我现在给 FileReadTool 下一个定义，我会这么说：

> FileReadTool 是 Claude Code 里最典型的“高频、稳定、语义明确”的基础 tool。它把多种文件读取统一进一个接口，同时尽量避免无意义的上下文浪费。

它和 BashTool 的对比也很有意思：

- BashTool：能力广，但很重，要做很多执行策略判断
- FileReadTool：能力窄得多，但边界清楚，所以可以非常稳定、非常激进地优化体验

这也说明 Claude Code 的总体思路不是“一个万能工具打天下”，而是：

- 有 Bash 这种重武器
- 也有 FileRead 这种专用高频工具

两者配合，模型会更稳。

---

## 这一篇我最想记住的一句话

> FileReadTool 不只是“把文件读出来”，而是在替 Claude Code 决定：什么内容值得读、怎么读最合适、以及哪些重复内容根本不该再塞进上下文。

---

## 下一步最顺怎么接

我觉得后面有两条很自然的线。

### 路线 A：接 `FileEditTool`

这样能把“读”和“改”这两个最核心的本地文件能力拼起来。

### 路线 B：接 `UI.tsx`

如果你想看 FileReadTool 为什么在界面上显示得这么克制、为什么不直接把全文渲染出来，可以读它的 UI。

如果按整体共读顺序，我更建议下一步直接接 `FileEditTool`。因为 read / edit 这两个放在一起看，Claude Code 的本地文件操作模型会一下子清楚很多。