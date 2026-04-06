---
title: 卷一 21｜Skill frontmatter 字段速查
date: 2026-04-01
tags:
  - claude-code
  - skill
  - frontmatter
  - reference
status: done
source_repo: https://github.com/T0UGH/cc
---

# 卷一 21｜Skill frontmatter 字段速查

这篇是卷一里少数偏参考手册的一页，目标不是展开方法论，而是把常见字段先摆平，方便后面查阅。

先记最重要的一句：

> **最小 skill format 的确只要 `name` 和 `description`。**
> 但从 `src/skills/loadSkillsDir.ts` 来看，Claude Code 实际支持的字段要比常见示例多得多。

所以别把两件事混在一起：

- 对外最常见的写法：很简
- runtime 真正支持的字段：范围更大

如果你想看这些字段为什么会真的影响运行时行为，下一篇再展开；这一篇先把字段表收清楚。

---

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Skill 7/16
- **上一篇**：[上一篇：processPromptSlashCommand 是 skill-inline 路径的展开层](./20-processpromptslashcommand.md)
- **下一篇**：[下一篇：frontmatter 不是注释而是 skill 的运行时接口](./22-frontmatter-runtime-interface.md)

这一篇放到这里读会更顺。到这一步，你已经知道 skill 会被系统怎么接、怎么跑，再回来看 frontmatter 字段，理解就不会停留在表面。

---

## 最小可用

### `name`
skill 的名字。

```yaml
name: 写日报
```

一般就是你最先会写的那个字段。

### `description`
一句话说明这个 skill 是干嘛的。

```yaml
description: 用来整理当天 AI 动态并输出日报草稿
```

虽然系统有 fallback 逻辑，但别省，直接写最稳。

---

## 我觉得最值得先学的字段

### `when_to_use`
告诉模型：什么时候该用这个 skill。

```yaml
when_to_use: 当用户让我整理当天 AI 新闻、GitHub 更新或生成日报时使用
```

这个字段很值。写得清楚，skill 更容易在对的时候被叫出来。

### `arguments`
定义 skill 接收哪些参数。

```yaml
arguments:
  - date
  - topic
```

适合那种“同一个 skill，但每次输入不一样”的场景。

### `argument-hint`
给参数一个提示写法。

```yaml
argument-hint: "<date> <topic>"
```

这个不复杂，就是提示调用格式。

### `allowed-tools`
限制这个 skill 能动哪些工具。

```yaml
allowed-tools:
  - Read
  - Grep
  - Write
```

这个很实用。你不想让某个 skill 乱跑工具，就把范围收住。

### `user-invocable`
控制这个 skill 能不能被用户直接调。

```yaml
user-invocable: true
```

或者：

```yaml
user-invocable: false
```

如果是内部 skill，或者你不想它直接暴露给用户，就可以关掉。

---

## 进阶字段

### `model`
给 skill 指定模型。

```yaml
model: sonnet
```

也可以写：

```yaml
model: inherit
```

`inherit` 的意思就是别覆盖当前模型。

### `effort`
指定 effort。

```yaml
effort: high
```

适合那种你明确希望它多想一层的 skill。

### `version`
给 skill 标个版本。

```yaml
version: 1.0.0
```

不是必须，但多人协作或者后面要演进时挺有用。

### `paths`
这是 conditional skill 的关键字段。

```yaml
paths:
  - "src/**"
  - "docs/**"
```

意思不是“拿这个路径去读文件”，而是：

> 只有当你碰到这些路径下的文件时，这个 skill 才会被激活。

这个字段很适合项目级 skill。

---

## 高级字段：先知道，不着急乱用

### `disable-model-invocation`

```yaml
disable-model-invocation: true
```

会影响 skill 的运行方式。先知道有这个开关就行。

### `context`

```yaml
context: fork
```

这里现在要记得更准确一点：

> `context: fork` 不是“轻量切个分支”，而是 **这个 skill 不在当前主对话里 inline 展开，而是起一个独立 subagent 去执行**。

也就是说：

- `inline`：把 skill 内容直接展开进当前对话
- `fork`：把这次 skill 扔给一个独立子 agent 跑，拥有单独上下文和 token budget

所以看到 `context: fork`，脑子里不要先想到“模式切换”，而要先想到：

> **这是执行形态切到 subagent 了。**

### `agent`

```yaml
agent: researcher
```

这个字段现在也可以说得更准：

> `agent` 不是普通 inline skill 的装饰字段，**它主要是给 `context: fork` skill 用的，用来指定 fork 出来的子 agent 类型。**

更直接一点：

- 如果 skill 是 inline，`agent` 基本没什么存在感
- 如果 skill 是 fork，`agent` 才真正决定“由哪类子 agent 来跑”
- 不写的话，会回退到默认 agent type（当前看到的是 `general-purpose`）

所以可以把它记成：

> **`context` 决定要不要另起一个子 agent。**  
> **`agent` 决定这个子 agent 用什么类型。**

### `hooks`

```yaml
hooks:
  pre:
    - echo "before"
  post:
    - echo "after"
```

这个会过 schema 校验，说明不是随便写什么都行。

### `shell`

```yaml
shell:
  enabled: true
```

和 skill 里的 shell 行为有关。这个先别乱碰，等把 skill runtime 再看深一点再说。

### 关于 `fork` 和 `agent` 的最短记忆版

如果以后只想 10 秒想起来，记这一组就够了：

- **skill**：任务方法 / SOP
- **context: fork**：这次不要在主线程 inline 做，起一个 subagent 去做
- **agent**：这个 subagent 用什么角色类型

一句话压缩就是：

> **`context` 决定“要不要分身去做”，`agent` 决定“分出去的是谁”。**

---

## 给自己一个简单分层

### 现在就建议用

```yaml
name
description
when_to_use
arguments
argument-hint
allowed-tools
user-invocable
```

### 熟一点再加

```yaml
paths
model
effort
version
```

### 先知道有就行

```yaml
disable-model-invocation
context
agent
hooks
shell
```

---

## 一个稳妥版模板

```md
---
name: 生成日报
description: 读取当天素材并整理成结构清晰的日报草稿
when_to_use: 当用户要求整理当天动态、生成日报、汇总更新时使用
arguments:
  - date
  - topic
argument-hint: "<date> <topic>"
allowed-tools:
  - Read
  - Grep
  - Write
user-invocable: true
---

请按下面流程工作：

1. 先读取输入资料
2. 提取核心更新点
3. 按主题整理
4. 输出中文日报草稿

如果传入了 `${date}`，优先围绕该日期整理。
如果传入了 `${topic}`，优先突出该主题。
```

---

## 最后留一句最好记的话

> **最小 skill format 只有 `name + description`。**
> **真正常用的 skill format，大概率还会再加 `when_to_use + arguments + allowed-tools`。**
> 其他字段，大多属于进阶玩法。