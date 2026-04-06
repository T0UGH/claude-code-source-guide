---
title: 卷一 07｜GrepTool 是结构化内容搜索原语
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
---

# 卷一 07｜GrepTool 是结构化内容搜索原语

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 7/9
- **上一篇**：[上一篇：FileWriteTool 是整文件覆盖原语](./06-filewritetool.md)
- **下一篇**：[下一篇：ToolSearchTool 是工具发现层](./08-toolsearchtool.md)

这一篇把工具层里的搜索原语补齐。读到这里，Claude Code 对文件系统的几类核心动作——读、改、写、搜——基本就凑齐了。

---

## 这篇看什么

这篇看的是：

- `src/tools/GrepTool/GrepTool.ts`

如果 FileReadTool 解决的是“把某个文件稳定读进来”，那 GrepTool 解决的是另一类高频问题：

> 当你还不知道该读哪个文件，或者只想先缩小范围时，怎么在代码库里高效搜内容。

我看完最大的感觉是：

> GrepTool 不是简单把 `rg` 暴露给模型，而是把“内容搜索”重新包装成了一种对模型更友好的查询接口。

它保留了 ripgrep 的强大，又加了很多 Claude Code 自己的约束和整理。

---

## 先给结论

### 1. GrepTool 的核心不是“执行搜索命令”，而是“把搜索结果整理成模型能消费的结构”

表面上看，它确实是调 `ripGrep(args, path, signal)`。

但如果只把它理解成“跑了个 rg”，会低估这个工具。

GrepTool 真正做的事包括：

- 把搜索需求变成结构化参数
- 控制默认输出模式
- 自动加一堆排除项，减少噪音
- 对结果做分页、排序、相对路径化
- 根据不同模式返回不同结构

所以它不是 shell 层搜索，而是：

> Claude Code 里的内容搜索原语。

### 2. 它一开始就承认：搜索结果不只有一种形态

GrepTool 有三个明确的 output mode：

- `content`
- `files_with_matches`
- `count`

这点很重要。

因为很多系统里的搜索工具只有一种默认输出：

- 把命中行全吐出来

但 Claude Code 显然知道，对模型来说这经常不是最优的。

有时你只想知道：
- 哪些文件命中了

有时你只想知道：
- 一共有多少处命中

有时你才真的需要：
- 把命中的上下文行读出来

所以 GrepTool 从设计上就已经把“搜索”和“阅读”分开了。

这比 Bash 里直接 `rg pattern` 再让模型自己猜，稳很多。

### 3. 默认 mode 不是 content，而是 `files_with_matches`

这点特别有意思。

默认值是：

```ts
output_mode = 'files_with_matches'
```

也就是说，Claude Code 的默认策略不是“先把一堆命中行都给模型”，而是：

> 先告诉模型哪些文件相关。

这其实非常对。

因为很多任务里，第一步只需要定位：

- 哪几个文件可能要看
- 哪个文件最值得下一步 Read

如果一上来就把几百行搜索结果塞进上下文，很容易把模型淹掉。

所以默认 `files_with_matches`，本质上是在鼓励一种更经济的工作流：

1. 先搜文件
2. 再读文件
3. 再决定要不要改

这和前面 Read / Edit / Write 的节奏是连起来的。

---

## 它最有意思的几块设计

### 1. 输入 schema 很像“结构化 rg”

它暴露出来的参数其实很全：

- `pattern`
- `path`
- `glob`
- `output_mode`
- `-A / -B / -C / context`
- `-n`
- `-i`
- `type`
- `head_limit`
- `offset`
- `multiline`

但这个 schema 不是为了模仿命令行，而是为了把搜索操作拆成模型更容易控制的维度。

比如：

- `head_limit`
- `offset`

这两个其实特别像分页参数，而不是 shell 参数。

这说明 GrepTool 的设计方向不是“让模型学会写 rg”，而是：

> 让模型用结构化方式表达搜索意图。

### 2. 它默认就会帮你降噪

GrepTool 一上来就加了几类排除。

#### 排除版本控制目录
- `.git`
- `.svn`
- `.hg`
- `.bzr`
- `.jj`
- `.sl`

#### 应用权限系统里的 ignore patterns
通过：
- `getFileReadIgnorePatterns(...)`
- `normalizePatternsToPath(...)`

#### 排除 orphaned plugin version directories
通过：
- `getGlobExclusionsForPluginCache(...)`

这说明 GrepTool 不是“原样跑搜索”，而是非常明确地在做一件事：

> 把搜索结果里的低价值噪音先砍掉。

这也是为什么它比 Bash + rg 更适合当模型工具。

如果不做这层，模型经常会被：
- `.git`
- 缓存目录
- 临时插件版本目录
这种垃圾结果带偏。

### 3. 默认有 head limit，而且 0 才表示无限制

这段很值：

- 默认 `DEFAULT_HEAD_LIMIT = 250`
- 明确规定 `head_limit = 0` 才表示 unlimited

也就是说，GrepTool 默认不相信“大结果集全塞给模型”这件事是好主意。

这是一个非常 agent 化的设计。

因为搜索结果这种东西，最容易在大仓库里炸上下文。

更重要的是，它不是简单 hard cap，而是配了：

- `offset`
- `head_limit`

于是搜索可以被当成一个可分页的数据源。

这点很妙。

你会发现 Claude Code 很多工具都在做同一件事：

> 把“可能很大的一次性输出”，改造成“可分页、可继续查询”的交互。

FileReadTool 是这样，GrepTool 也是这样。

### 4. content mode 会把绝对路径转成相对路径

在 content mode 里，结果是 ripgrep 的命中行。

GrepTool 会在返回前把：

- `/absolute/path:line`

转成：

- `relative/path:line`

这看起来只是省几个字符，但其实很值。

因为在大项目里，绝对路径非常耗 token，而且信息增益不高。

这说明 GrepTool 的实现者是把 token 成本当成一等公民考虑的。

### 5. `files_with_matches` 模式下，结果还会按 mtime 排序

这一点我很喜欢。

对 `files_with_matches` 模式，代码不是直接返回 rg 结果，而是：

1. 先 `stat` 每个文件
2. 按修改时间倒序排序
3. 再做 head_limit / offset
4. 最后转成相对路径

这背后的产品假设很明确：

> 最近改过的文件，更可能和当前任务相关。

这个假设不永远对，但大多数 coding agent 场景下很合理。

也就是说，GrepTool 不只是搜索，还在帮模型做一点弱排序。

这一步很值，因为模型通常不擅长从几十个文件路径里自己猜谁更重要。

### 6. `count` 模式很适合做探针，而不是直接阅读

`count` 模式下，GrepTool 会输出：

- 每个文件的命中数
- 总命中数
- 命中文件数

这对模型来说很有用。

因为有些时候你不是想立刻读内容，而是想先判断：

- 这个模式是不是普遍存在
- 命中规模大不大
- 是 2 个文件还是 200 个文件

这种模式其实更像一个“分布探针”。

Claude Code 把它做成正式 mode，我觉得很合理。

---

## `validateInput()` 和权限逻辑也很克制

### 1. 如果传了 path，会先确认 path 存在
这很基本，但它没有止步于“路径不存在”。

它还会：
- 给 `cwd` 提示
- 用 `suggestPathUnderCwd()` 给可能的替代路径

这和 FileReadTool / FileEditTool 的风格很一致：

> 错误不只要报错，还要尽量可用。

### 2. 它也是显式只读、可并发

```ts
isConcurrencySafe() { return true }
isReadOnly() { return true }
```

这一点也说明了 GrepTool 在 runtime 里属于高安全等级工具。

和 BashTool 对比会很明显：

- GrepTool：定义上就只读，天然并发友好
- BashTool：要努力分析它是不是只读

这其实就是专用 tool 的价值。

---

## GrepTool 和 FileReadTool 是一前一后的关系

我觉得这俩应该放在一起理解。

### GrepTool 负责：
- 在不知道具体目标文件时先缩小范围
- 找文件
- 找命中行
- 找分布

### FileReadTool 负责：
- 对选中的文件做稳定读取
- 把具体内容送进上下文

所以很自然的工作流其实是：

1. Grep 先搜
2. Read 再读
3. Edit / Write 再改

这比“上来就全库乱读”要经济太多。

也就是说，GrepTool 不只是一个独立能力，它是 Claude Code 整个文件工作流的前置雷达。

---

## `mapToolResultToToolResultBlockParam()` 很讲究模式差异

它没有把三种 mode 混成一种话术，而是分开处理：

### content
- 直接回内容
- 如果有限制，会附 `pagination = limit/offset`

### count
- 回每个文件的计数
- 再附上总命中数和文件数摘要

### files_with_matches
- 直接回文件列表
- 如果有限制，也会补 limit / offset 信息

这一点很成熟。

因为分页信息不是“内部实现细节”，对模型来说其实很关键：

- 它需要知道结果是不是被截断了
- 如果被截断，下一步要怎么翻页

这类信息如果不显式返回，模型后续行为会差很多。

---

## 我对 GrepTool 的整体判断

如果让我现在给 GrepTool 下一个定义，我会这么说：

> GrepTool 是 Claude Code 的结构化内容搜索原语。它不是把 ripgrep 原样暴露出来，而是把搜索改造成一种可分页、可降噪、可分模式的查询接口。

它和 Bash + rg 的差别，不在“能不能搜”，而在：

- 默认输出更稳
- 结果更节制
- 更适合接后续 Read
- 更适合大仓库场景
- 更适合模型逐步推进，而不是一次吞太多

所以它是一个很典型的 Claude Code 风格工具：

- 把已有底层能力拿来
- 但不直接裸露给模型
- 中间加一层很强的 runtime 语义整理

---

## 这一篇我最想记住的一句话

> GrepTool 的价值不只是“能搜”，而是它把搜索变成了一种对模型更友好的、可分页的、低噪音的查询接口。

---
