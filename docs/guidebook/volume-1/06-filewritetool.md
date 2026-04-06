---
title: 卷一 06｜FileWriteTool 是整文件覆盖原语
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 06｜FileWriteTool 是整文件覆盖原语

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 6/9
- **上一篇**：[上一篇：FileEditTool 是受控修改原语](./05-fileedittool.md)
- **下一篇**：[下一篇：GrepTool 是结构化内容搜索原语](./07-greptool.md)

这一篇继续补齐文件写入侧。和 FileEditTool 放在一起看，能更清楚地看到 Claude Code 是怎么区分“局部受控修改”和“整文件覆盖”这两类动作的。

---

## 这篇看什么

这篇看的是：

- `src/tools/FileWriteTool/FileWriteTool.ts`

如果 FileEditTool 解决的是“如何基于上下文做局部替换”，那 FileWriteTool 解决的就是另一类问题：

> 当模型已经明确知道最终文件应该长什么样时，怎么把整份内容稳稳写下去。

所以 FileWriteTool 和 FileEditTool 虽然都属于“写文件”，但定位其实不一样：

- FileEditTool：局部改动原语
- FileWriteTool：整文件覆盖原语

我看完之后最大的感觉是：

> FileWriteTool 不是 FileEditTool 的简化版，而是 Claude Code 明确保留的另一种写入语义。

---

## 先给结论

### 1. FileWriteTool 的核心语义就是“我已经知道最终全文”

它的输入非常简单：

- `file_path`
- `content`

没有 `old_string`，也没有 `replace_all`。

这意味着它和 FileEditTool 的心智模型完全不同。

FileEditTool 是：
- 我知道要改哪一段
- 我想在原文件基础上改

FileWriteTool 是：
- 我知道最终文件全文应该是什么
- 直接把它写成这个样子

这条边界挺重要。

因为 Claude Code 并没有强迫所有写入都走 edit。它承认有些场景下，整文件重写反而更自然：

- 新建文件
- 生成配置文件
- 生成脚本
- 重写短文件
- 根据模板直接产出完整内容

### 2. 它虽然是“整文件覆盖”，但仍然要求先读再写（针对已存在文件）

这点和 FileEditTool 很像。

在 `validateInput()` 里，如果文件已经存在，就会检查：

- 这个文件有没有出现在 `readFileState` 里
- 之前是不是 full read
- 文件在 read 之后有没有被改过

也就是说，Claude Code 并没有因为这是 Write tool 就允许模型“闭眼覆盖”。

它还是坚持一个原则：

> 只要是覆盖已有文件，就最好建立在已读上下文之上。

这一点非常对。

否则 FileWriteTool 很容易变成最危险的那个工具。

### 3. 它是 create / update 二合一的 tool

从 output schema 就能看出来：

- `type: 'create' | 'update'`

也就是说，FileWriteTool 既负责：

- 新建文件
- 也负责覆盖已有文件

这和 FileEditTool 不一样。FileEditTool 更偏“已存在文件上的受控改动”，而 FileWriteTool 天生就带“创建新文件”的能力。

这也是为什么它在 validate 阶段对“文件不存在”是直接允许的。

---

## FileWriteTool 最有意思的几块设计

### 1. schema 很简单，但运行逻辑一点不简单

输入 schema 简洁得几乎有点朴素：

```ts
{
  file_path: string,
  content: string,
}
```

但它背后的运行逻辑并不轻。

它照样做了这些事：

- path normalize
- deny rule 检查
- UNC path 安全处理
- 旧文件是否已读校验
- stale check
- 创建父目录
- file history 备份
- LSP / VS Code 同步
- readFileState 刷新
- git diff 获取
- patch 生成用于展示

所以这个工具给人的感觉很像：

> 接口很简单，落地很重。

这是个好设计。对模型简单，对 runtime 严格。

### 2. 如果文件已存在，它依然做 stale check

它的逻辑是：

- 先 `stat` 一次，拿 mtime
- 如果文件存在，就要求之前必须 read 过
- 如果当前 mtime 比 read 时记录的新，就拒绝继续写

这一点和 FileEditTool 很一致。

也就是说，Claude Code 不允许模型拿一份旧上下文，直接把整文件覆盖掉。

从系统设计上看，这其实是在给 FileWriteTool 装刹车。

因为 FileWriteTool 一旦误用，伤害面比 EditTool 大得多。

### 3. `call()` 里先建目录，再进原子写入区

有一个很工程化的细节：

```ts
await getFsImplementation().mkdir(dir)
```

而且注释专门强调：

- 这个动作要放在原子 read-modify-write 区外面
- 不然中间一旦 yield，可能让并发编辑插进来

这说明 FileWriteTool 虽然表面是“直接写文件”，但作者脑子里想的是并发与原子性，不只是功能成功。

这种注释我很喜欢，因为它在明说：

> 这不是普通脚本逻辑，这是 runtime 级别的写入路径。

### 4. 它保留“模型给出的换行符”

这里有个很值的设计：

```ts
writeTextContent(fullFilePath, content, enc, 'LF')
```

源码里的注释意思很明确：

- Write 是全量内容替换
- 既然模型给出了明确内容，就应该尊重它写出来的换行
- 不应该像 EditTool 那样，去尽量保留旧文件的 line endings

这个点看着小，其实是在明确区分两种语义：

- EditTool：尽量保留原文件风格
- FileWriteTool：最终全文由新内容定义

也就是说，FileWriteTool 的哲学是：

> 既然你选择了 Write，而不是 Edit，那就意味着你接受“新内容整体接管旧内容”。

这条边界挺清晰。

### 5. 它也会主动同步整个编辑生态

和 FileEditTool 一样，写完后它不会只停在“文件落盘成功”。

还会继续做：

- `clearDeliveredDiagnosticsForFile()`
- `lspManager.changeFile()`
- `lspManager.saveFile()`
- `notifyVscodeFileUpdated()`
- 更新 `readFileState`
- 记录 `fileHistory`
- 记录 analytics
- 在 remote 场景下计算 git diff

这再次说明一件事：

> FileWriteTool 不是孤立的文件写入器，而是 Claude Code 编辑系统的一部分。

如果没有这一串同步动作，Write tool 虽然也能写成功，但整个代码工作流会很割裂。

---

## 它和 FileEditTool 的边界，值得单独记一下

这是这一篇最值得记住的地方。

### FileEditTool 适合：
- 我知道要改哪一段
- 想在原文件基础上局部修改
- 希望 runtime 帮我确认 old_string 命中情况
- 希望 patch 更聚焦

### FileWriteTool 适合：
- 我要新建文件
- 我已经知道最终全文
- 文件很短，整份重写比局部编辑更自然
- 我不想让模型在 old_string / replace_all 上绕来绕去

所以不是“Write 比 Edit 更暴力”这么简单。

更准确的说法是：

> Edit 处理“在旧文件上做精确手术”，Write 处理“用新全文替换旧全文”。

这两个都需要，而且都合理。

---

## `mapToolResultToToolResultBlockParam()` 很简洁

这个函数的返回比 BashTool、FileReadTool 都简单很多。

它只区分两种结果：

- `create` → `File created successfully at: ...`
- `update` → `The file ... has been updated successfully.`

这说明 FileWriteTool 的模型侧返回并不依赖大段文本输出。

真正重要的信息其实在 UI 和结构化 patch 里，而不是在模型结果文案里。

这一点也很符合它的定位：

- 它不是生成复杂输出的 tool
- 它是执行一个明确写入动作的 tool

所以结果消息只需要确认动作完成，不需要多废话。

---

## 这个 tool 最像产品判断的地方

如果让我挑 FileWriteTool 里最像产品判断的几个点，我会选这几个：

### 1. 已存在文件仍然要求先 read
这个让 Write tool 不至于变成盲写工具。

### 2. create / update 统一在一个 tool 里
这样模型心智更简单，不需要再拆一个 CreateFileTool。

### 3. 保留 Write 的“全量替换”语义，不偷偷继承旧文件 line endings
这个其实是在保护语义边界，不让工具行为悄悄漂移。

---

## 我对 FileWriteTool 的整体判断

如果让我现在给 FileWriteTool 下一个定义，我会这么说：

> FileWriteTool 是 Claude Code 的整文件覆盖原语。它适合新建文件，也适合当模型已经明确知道最终全文时做整体替换，但它仍然通过 readFileState 和 stale check 去防止盲写。

这点很重要。

因为很多系统里的 write tool 都过于粗暴：

- 能写
- 覆盖
- 完事

Claude Code 这里显然想做得更稳一些：

- 写入语义清楚
- 覆盖已有文件要谨慎
- 写完之后整个编辑生态要同步起来

所以它不是一个“低级写文件 API”，而是一个 agent 友好的整文件写入接口。

---

## 这一篇我最想记住的一句话

> FileWriteTool 代表的是“最终全文已经确定”的写入语义；它不是用来试探性修改文件的，而是用来把一个完整结果可靠地落盘。

---
