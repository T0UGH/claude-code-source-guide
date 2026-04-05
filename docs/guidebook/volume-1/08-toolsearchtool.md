---
title: 卷一 08｜ToolSearchTool 是工具发现层
date: 2026-04-02
tags:
  - Claude Code
  - 源码共读
  - tools
  - discovery
source_url: https://feishu.cn/docx/B0FLd8cHiojX8uxcDbAcNkvynGg
status: done
---

# 卷一 08｜ToolSearchTool 是工具发现层

## 导读

- **所属卷**：卷一：运行时底座
- **卷内位置**：Tool 8/9
- **上一篇**：[上一篇：GrepTool 是结构化内容搜索原语](./07-greptool.md)
- **下一篇**：[下一篇：主循环里 tool 怎么被接住](./09-how-tools-enter-runtime.md)

这一篇把视角从“工具怎么执行”稍微转到“工具怎么被发现”。这一步很关键，因为 Claude Code 不只是有工具，还得让模型和 runtime 知道什么时候该找到哪一个工具。

---

## 这篇的主结论

> ToolSearchTool 不是在搜文本，而是在搜“下一步可调用的能力”，并把这些能力重新接回 Claude Code 的工具系统。

这也是它和 GrepTool、FileReadTool 这类工具最大的区别。

前者处理的是内容，后者处理的是能力发现。

---

## 我这篇重点记了什么

### 1. 它搜的不是所有 tool，而是 deferred tools

ToolSearchTool 并不是把当前所有工具无差别摊开来搜。

它关注的是：

- 还没有直接展开给模型
- 但在下一步可能值得启用
- 需要先被发现、再被接回运行时的那批能力

所以它本质上不是“工具总表全文检索”，而是一个更偏 runtime 的发现入口。

### 2. 它支持两种模式

#### 关键词搜索

最直观的模式就是按关键词找。

也就是让模型先表达“我想做什么”，再由 ToolSearchTool 去匹配可能相关的能力。

#### `select:<tool_name>` 直接选择

另一种更关键。

如果模型已经知道自己要哪个工具，不一定还要走模糊搜索，而是可以直接：

- `select:<tool_name>`

这说明 ToolSearchTool 既是“搜索入口”，也是“能力选择入口”。

换句话说，它不只是检索器，也承担了一部分 capability routing 的作用。

### 3. 返回结果不是字符串列表，而是 `tool_reference`

这个设计很重要。

如果它只返回工具名字符串，那它只是个辅助搜索器。

但它返回的是：

- `tool_reference`

这说明它输出的不是“可读提示”，而是后续可以重新接进工具系统的引用对象。

所以它的真正位置更像：

> 在发现层和执行层之间，产出一个可继续调用的中间表示。

### 4. 它会专门解析不同风格的工具名

这篇里一个很值的点，是它不是只按一种命名方式硬匹配。

它会特别处理：

- MCP fully-qualified tool name
- 普通 CamelCase tool name
- 普通 snake_case tool name

这说明 ToolSearchTool 面对的不是单一来源的工具集合，而是：

- Claude Code 自带工具
- MCP 暴露工具
- 不同命名风格的外部能力

它需要把这些差异揉平，才能把“发现”做成统一入口。

### 5. 评分不只看名字，还看更多语义信号

它不是简单 `contains(name, query)` 这种级别。

评分时还会参考：

- `searchHint`
- `prompt()/description`

这意味着它在匹配“工具是什么”之外，也在匹配：

- 这个工具适合解决什么问题
- 这个工具被设计成在什么情境下使用

也就是说，它在搜的是“可用能力语义”，不只是“名字相似度”。

### 6. description 还做了 memoize 缓存

这个小点很说明工程判断。

因为 description / prompt 这类信息如果每次搜索都现算，成本会越来越高。

所以它对 description 相关内容做了 memoize。

这说明 ToolSearchTool 并不是一个只偶尔调用的玩具入口，而是被当成可能频繁参与主循环判断的能力层组件来设计的。

### 7. 搜不到时，还会提示 MCP server 可能还在连接中

这个交互细节我觉得很好。

搜不到时，它不会只说“没有结果”。

它还会提醒：

- 有些 MCP server 可能还在连接中

这点的意义在于，它承认“工具集合并不总是静态完整”的现实。

也就是说，ToolSearchTool 面对的是一个动态工具池：

- 有些工具已经可见
- 有些工具还在初始化
- 有些工具可能稍后才接入

所以它不是在一个静态 registry 上做查询，而是在一个动态 runtime 上做发现。

---

## 我现在对 ToolSearchTool 的判断

如果前面几篇已经看到：

- `MCPTool`
- `SkillTool`
- `AgentTool`

那 ToolSearchTool 正好站在它们之前。

它不直接执行任务，而是先解决一个更前置的问题：

> 下一步到底该用哪种能力。

所以它更像工具系统的“发现层”。

不是动作原语，也不是委派原语，而是：

> 能力发现原语。

---

## 它和其他几层的关系

我现在更愿意把这几层这样串起来看：

### ToolSearchTool
负责：
- 从 deferred tools 里发现下一步可能该调用什么能力

### SkillTool
负责：
- 把方法论型能力接回 runtime

### MCPTool
负责：
- 把外部 server 暴露出来的能力接进 Claude Code

### AgentTool
负责：
- 把任务委派给另一个 agent 去执行

这样看就很清楚：

ToolSearchTool 本身不干活。

它负责的是：

- 找能力
- 选能力
- 把能力引用重新交回工具系统

它是运行时工具体系里的前置入口。

---

## 这一篇我最想记住的一句话

> ToolSearchTool 搜的不是文本，而是“下一步可调用的能力”。

---

## 下一步最顺怎么接

如果继续往下，我也同意最顺的是：

- `runAgent.ts`

因为现在：

- `MCPTool`
- `SkillTool`
- `ToolSearchTool`
- `AgentTool`

这几层已经都看到了。

下一步自然就是看：

> agent 到底怎么真正跑起来。

所以后面顺着 `runAgent.ts` 往下拆，会更容易把整个执行链闭上。