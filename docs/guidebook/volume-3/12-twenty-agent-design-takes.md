---
title: 卷三 12｜从 59 篇里归纳 20 条 agent 层设计
date: 2026-04-06
tags:
  - Claude Code
  - 源码共读
---

# 卷三 12｜从 59 篇里归纳 20 条 agent 层设计

## 导读

- **所属卷**：卷三：长上下文与会话恢复
- **卷内位置**：卷三 12/15
- **上一篇**：[上一篇：上下文管理四种形态并排例子](./11-four-context-forms-side-by-side.md)
- **下一篇**：[下一篇：conversationRecovery 是 resume 把会话重新接回 runtime 的恢复入口](./13-conversation-recovery.md)

这一篇更像卷三里的总结与提升。它不再继续拆单个实现，而是把前面的上下文管理例子往 agent 设计原则上提升。

---

## 这篇看什么

前面那 59 篇共读，已经把 Claude Code 的几条主线基本拆开了：

- tool 怎么定义、怎么接进主循环
- skill 怎么被发现、怎么进入 runtime
- agent 怎么被装配、分叉、隔离、清理
- QueryEngine 怎么把一次输入组织成完整 turn
- 长上下文怎么被剪枝、折叠、压缩后继续运行

但如果你不是跟着一篇篇看过来，而是想直接问：

> **如果让我从 Claude Code 里抽 agent 层设计，最值得学的到底是哪 20 条？**

那确实需要一篇“总收口”。

这篇就只做这件事：

- 不再按文件讲
- 不再按时间顺序讲
- 而是按 **设计抽象** 来讲

目标读者也刻意限定成：

> **没看过源码，但有编程基础的人。**

所以这里尽量少用“源码行话”，多用工程语言。

---

## 先给主结论

如果只先记一句话，我会先给这个版本：

> **Claude Code 的 agent 层厉害的地方，不是“它支持多 agent”，而是它把 agent 当成一等运行时对象来设计：有定义层、有装配层、有权限边界、有工具边界、有上下文边界、有持久化和恢复链，也有明确的减负和清理机制。**

再说得更白一点：

> **它不是“模型会调用几个功能”这么简单，而是在把一个 LLM 包装成一个可持续运行、可委派、可恢复、可约束、可审计的工作系统。**

如果把前面 59 篇压成 20 条，我最想保住的设计，不是某个函数技巧，而是下面这些架构判断。

---

# 一、先把总地图立住：Claude Code 的 agent 层到底分几层

先别急着看 20 条。先把地图立住，不然后面容易混。

我现在更愿意把 Claude Code 的 agent 层拆成 6 层：

1. **定义层**：agent / skill / tool 各自怎么声明
2. **发现层**：当前有哪些能力可被模型感知到
3. **装配层**：把声明翻译成这次真的能跑的 runtime
4. **执行层**：query 主循环怎么推进一轮工作
5. **治理层**：权限、上下文、缓存、压缩、恢复怎么收口
6. **生命周期层**：启动、记录、恢复、清理怎么闭环

这一点其实很重要。

因为很多 agent 系统只做了两层：

- prompt
- 调用工具

Claude Code 明显不是。

它已经是：

- **声明式能力系统**
- **运行时装配系统**
- **受控执行系统**
- **上下文治理系统**

叠在一起。

后面这 20 条，基本都能落回这 6 层地图里。

---

# 二、20 条最值得学的 agent 层设计

## 1. 不把 agent 当 prompt，而把它当“可运行对象”

这是我觉得最根上的一条。

很多系统里的 agent，本质还是：

- 一段 system prompt
- 加一组工具
- 起个名字

Claude Code 不是这么看。

在它这里，agent 至少同时带着这些东西：

- 身份
- model
- permission mode
- 工具池
- skills
- MCP servers
- transcript
- hooks
- maxTurns
- worktree / isolation
- 生命周期清理责任

也就是说，agent 不是“人设文本”，而是：

> **一个带配置、带状态、带边界、带审计痕迹的运行实体。**

这个转变非常关键。

因为一旦你把 agent 当成运行对象，后面很多设计自然就出来了：

- 为什么要有 `agentId`
- 为什么要有 transcript sidechain
- 为什么要有专属清理逻辑
- 为什么权限不能直接继承父会话

---

## 2. 把“定义”和“运行”拆开，中间插一层装配线

Claude Code 很稳定的一条思路是：

> **定义不是运行，定义必须先被翻译成运行时现实。**

`loadAgentsDir.ts`、`loadSkillsDir.ts` 这些文件，负责的是：

- 从 markdown / built-in / plugin / config 里把定义读出来

但这还只是声明。

真正让它跑起来的是另一层：

- `runAgent.ts`
- `SkillTool.tsx`
- `QueryEngine`

也就是说，它没有偷懒成：

- 读到 frontmatter
- 直接执行

而是明确插了一层：

> **assembly / runtime translation**

这层的价值特别大。

因为它让你能在“声明”和“执行”之间插入大量工程控制：

- 权限重写
- 工具过滤
- skill 预载
- MCP 初始化
- transcript 注册
- app state 改写

如果你以后自己做 agent 框架，我会非常建议保留这层。没有这层，系统很快会乱。

---

## 3. skill、agent、tool 三者明确分工，而不是都叫“能力”

Claude Code 这点做得很清楚。

它不是把所有东西糊成一种抽象。

### tool 更像什么
- 具体动作原语
- 读文件、改文件、搜内容、跑命令、发请求

### skill 更像什么
- 可复用的方法模块
- 告诉模型“什么时候该这样做、按什么步骤做”

### agent 更像什么
- 真正承接一段工作的执行主体
- 带权限、上下文、工具池和生命周期

所以它不是：

- 三种不同名字的“功能”

而是：

> **tool 管动作，skill 管方法，agent 管工作。**

这条分工特别值得抄。

因为很多多 agent 系统后面越来越乱，本质就是没把这三层拆开。

---

## 4. frontmatter 不是注释，而是运行时接口

这一条在 skill 和 agent 两条线里都很明显。

Claude Code 对 frontmatter 的态度非常工程化。

它不是把 frontmatter 当：

- 文档 metadata
- 方便人看的标签

而是把它当：

> **runtime contract。**

比如这些字段，不是在“描述自己”，而是在决定运行行为：

- `description`
- `when_to_use`
- `tools`
- `disallowedTools`
- `skills`
- `mcpServers`
- `hooks`
- `model`
- `permissionMode`

这背后有个很好的设计判断：

> **让“能力声明”尽量靠近文本，同时让这份声明又能被 runtime 严格消费。**

这样既保留了可编辑性，也保留了系统性。

---

## 5. 让模型先感知“能力目录”，再按需展开正文

这一条对 prompt 设计很重要。

Claude Code 没有一上来就把所有 skill 正文全文塞给模型。

它先让模型感知到的是一种较轻的“能力索引层”：

- skill 的名字
- skill 的 description
- skill 的 when_to_use
- tool 的可发现信息

当模型判断“这东西值得用”时，再进一步展开。

这意味着它在做两件事：

1. **先做发现，不先做灌输**
2. **先给目录，不先给全文**

这特别像一个成熟系统，而不是把所有提示词全堆进去。

好处很实际：

- prompt 不会一开始就爆炸
- cache 更稳定
- 发现与执行可以分层优化

---

## 6. 不把主循环设计成“回复生成器”，而设计成“turn 编排器”

如果只看表面，你会以为 Claude Code 只是：

- 接用户输入
- 调一次模型
- 回一段文本

但 `QueryEngine + query(...)` 这条线说明，它真正组织的是：

> **一轮 turn。**

一轮 turn 包括：

- 输入处理
- prompt/context 装配
- 模型采样
- tool_use 检测
- tool_result 回流
- 是否 follow-up
- 是否继续下一轮
- 最终收口

这就意味着 Claude Code 的主循环不是 chat completion 的薄封装，
而是一个：

> **多阶段、多分叉、可持续推进的任务回路。**

这也是为什么它能自然长出 tool、subagent、compact、resume 这些能力。

---

## 7. 输入先分类，再处理；不是所有输入都当普通文本

`processUserInput(...)` 这条线传达了一个很重要的设计态度：

> **输入处理首先是路由问题，不是理解问题。**

也就是说，系统先问：

- 这是普通文本？
- slash 命令？
- 附件？
- 文件引用？
- 其它特殊 block？

分清路之后，才进入各自处理链。

这条设计看起来普通，但很关键。

因为一旦把所有输入都压成自然语言理解，系统会越来越难维护。

Claude Code 选的是更稳的做法：

- **先结构分流，再语义执行。**

这也是它 later-stage 还能继续长功能的原因。

---

## 8. attachment 不是“附件文件”，而是“外生上下文对象”

这是我觉得特别值得学的一条。

Claude Code 对 attachment 的理解，不是 IM 式的“上传个文件”。

它更像：

> **把用户输入之外、但与当前工作有关的上下文，结构化抽出来。**

所以 attachment 体系里装的，不只是文件，还可以是：

- 文件内容
- agent 相关上下文
- MCP 信息
- 提醒类上下文

这个设计很好，因为它在做一件事：

> **把“用户说的话”和“系统补给的上下文”拆开。**

一旦拆开，后面消息规范化、缓存、恢复都会简单很多。

---

## 9. 工具不是函数集合，而是受控原语集合

读完 tools 那一组后，我很强的感受是：

Claude Code 不是把工具当 API wrapper，
而是把工具当：

> **一组经过边界设计的动作原语。**

比如：

- `FileReadTool` 是统一读取入口
- `FileEditTool` 是受控精确修改原语
- `FileWriteTool` 是整文件覆盖原语
- `GrepTool` 是结构化搜索原语
- `BashTool` 不是“能跑命令”而已

这个“原语化”很重要。

因为 agent 框架最后能不能稳定，常常不取决于模型多聪明，而取决于：

- 你给模型的动作是不是语义清楚
- 边界是不是收紧
- 结果是不是结构化

Claude Code 在这方面非常自觉。

---

## 10. agent 启动前先净化继承上下文，而不是无脑 fork 父状态

`runAgent.ts` 里我特别喜欢的一点，就是它对“继承父上下文”非常谨慎。

比如它会处理：

- incomplete tool calls 过滤
- file state cache 克隆
- forkContextMessages 的整理

这背后的判断很成熟：

> **父上下文不是天然安全可复用的，必须先净化，才能给子 agent 继承。**

这条原则非常值得学。

因为很多系统里 subagent 一出问题，都是因为把父会话的半成品状态直接扔过去了。

Claude Code 明显知道这个坑，所以会先把：

- 残缺 tool_use / tool_result 配对
- 缓存共享边界
- 初始消息集合

先收拾干净。

---

## 11. 权限不是全局开关，而是分层叠加的视图

这条是 agent 系统能不能进生产的关键。

Claude Code 没有把权限设计成一个简单全局 bool。

它更像：

- CLI 级显式允许
- session 级允许规则
- agent 自己的 permission mode
- async / sync 运行模式差异
- shouldAvoidPermissionPrompts 等额外交互约束

尤其值得注意的是：

> **子 agent 可以有自己的权限人格，但不会无条件推翻父级更高约束。**

这就是成熟。

它不是“权限全继承”，也不是“子 agent 自己说了算”，
而是叠层视图。

如果你以后做多 agent 系统，这条很值得抄：

- **权限要可覆盖，但覆盖必须有层级边界。**

---

## 12. 工具池不是默认全集继承，而是按 agent 类型再裁一遍

这条和上一条权限设计是配套的。

Claude Code 明显不相信：

- 父会话有啥工具，子 agent 就都该有

它会经过：

- built-in / custom 的规则
- disallowed tools
- wildcard 展开
- async agent 特殊限制
- MCP 工具例外规则

最后才得到这个 agent 真正能用的工具池。

背后的好处是：

> **同一个 agent 框架，可以承载不同危险等级、不同角色定位的执行体。**

这比“统一大工具箱”稳得多。

尤其 async agent 默认更窄这一点，非常像真的做过后台 worker 系统的人写出来的。

---

## 13. agent 既能继承父能力，也能带自己的能力接入口

这点在 MCP 上特别明显。

Claude Code 的 agent 不只是复用父会话已有工具。

它还能在 agent frontmatter 里自己声明：

- `mcpServers`

然后启动时接入，结束时清理。

这意味着 agent 不是只能共享宿主环境，
而是可以：

> **带着自己的外部能力接口出生。**

这会让 agent 更接近“角色实例”，而不是 prompt 变体。

对架构来说，这非常值钱。

因为它把能力接入从“系统全局配置”推进到了“agent 可声明能力面”。

---

## 14. skill 不只是给模型看的提示，而是 runtime 可观察、可授权的能力单元

`SkillTool` 这条线的价值就在这。

Claude Code 不是把 skill 当成一段“偷偷塞进 prompt 的说明文字”。

它把 skill 正式纳入：

- 工具系统
- 发现系统
- 授权系统
- transcript / 运行轨迹系统

所以更准确的说法不是：

- “模型会用 skill”

而是：

> **runtime 允许模型以一种受控方式调用 skill。**

这对 agent 设计特别重要。

因为它让“方法论复用”不再是松散 prompt 工程，而是系统级能力。

---

## 15. 把 fork 设计成“上下文分叉 worker”，而不是再开一个自由 agent

`forkSubagent` 那篇里我最大的感受是：

Claude Code 对 fork 的定义非常克制。

它不是：

- 复制一个新的完整 agent 出去自由发挥

而更像：

> **在同一任务语境里，分出一个受约束 worker。**

这条判断特别重要。

因为它避免了很多多 agent 系统常见的问题：

- 分叉出去之后角色失控
- 上下文越跑越散
- cache 完全废掉
- 最后只是“多开了几个 chat”

Claude Code 更看重的是：

- prompt cache 友好
- 任务局部并行
- 上下文有亲缘关系
- worker 边界清楚

我觉得这是很成熟的 fork 观。

---

## 16. transcript 不是日志附属品，而是运行时主链的一部分

Claude Code 对 transcript 的态度非常认真。

它不是最后顺手记个日志。

而是从运行开始就持续记录：

- 主线程 transcript
- subagent sidechain transcript
- metadata
- 可恢复状态

这背后的判断是：

> **一个 agent 系统要想可恢复、可审计、可继续，就必须把执行轨迹当一等数据。**

这点太重要了。

因为很多 agent 框架的问题不在“不会跑”，而在：

- 跑完说不清发生了什么
- 中断后接不上
- 子 agent 做过什么不可追

Claude Code 在 transcript 这块明显是按“系统本体”来做的，不是按 debug 附件来做的。

---

## 17. 历史消息不是原封不动送模，而是先变成“模型视图”

这是 QueryEngine 和 context 管理线合起来后特别清楚的一点。

Claude Code 内部持有的历史，不等于每轮真送给模型的历史。

中间会经过一整套变换：

- normalize
- budget
- snip
- microcompact
- collapse
- compact

最终得到的是：

> **messagesForQuery / model-facing view**

这条设计非常成熟。

因为它承认了一个现实：

- 存档视图
- UI 视图
- 模型工作视图

不应该强行是同一份东西。

只要你把这三者绑死，长会话后面一定很痛苦。

Claude Code 选择拆开，这就是为什么它能把“保留完整历史”和“继续让模型工作”同时做到还不错。

---

## 18. 上下文治理不是一个大压缩按钮，而是一条分层流水线

如果只看名字，很容易把这几样都叫“压缩”：

- tool result budget
- snip
- microcompact
- context collapse
- compact

但 Claude Code 做得最好的地方恰恰是：

> **它没有只有一个压缩动作，而是做了分层治理链。**

大致可以这么理解：

- **budget**：先控制不能太大
- **snip**：先轻量剪一点
- **microcompact**：优先减掉高成本旧 tool results
- **collapse**：把旧历史折成读时摘要代表
- **compact**：真的不行了再重建新上下文骨架

这条治理链特别值得学。

因为它让系统不会过早走重操作，也不会等到彻底炸了才处理。

一句话说：

> **它在做渐进式上下文治理，不是在做一次性大手术。**

---

## 19. “恢复”不是读日志回放，而是重建运行现场

`sessionStorage`、resume、compact boundary 这条线说明：

Claude Code 的恢复不是简单意义上的：

- 从文件里读出旧聊天
- 再发回模型

它在恢复的是更完整的运行现场，包括：

- transcript 本体
- compact 之后的边界
- summary / replacement 结构
- session 级状态
- sidechain 信息

换句话说，它想恢复的是：

> **这条工作流进行到哪、系统脑子现在是什么形态。**

而不是“上次说到哪句”。

这就是 agent 系统和普通聊天系统最本质的差别之一。

---

## 20. 生命周期必须闭环：启动时装配，结束时彻底清理

最后这一条非常工程，但也非常重要。

`runAgent.ts` 的 `finally` 说明，Claude Code 对清理非常认真。

会收的东西包括：

- MCP client
- hooks
- prompt cache tracking
- cloned file state
- 初始消息引用
- perfetto / tracing 注册
- transcript 映射
- todos
- background bash tasks
- monitor 任务

这说明它不是“跑起来就行”，而是非常清楚：

> **agent 是有生命周期成本的；不清理，系统一定烂。**

这一点很多人做 agent 系统时最容易轻视。

但如果想长期稳定运行，这条不是加分项，而是必需项。

---

# 三、把这 20 条再压成 5 个“大设计原则”

如果 20 条你觉得还是多，我再压成 5 个更大的原则。

## 原则 1：一切能力都要分层

- tool 不等于 skill
- skill 不等于 agent
- transcript 不等于 model-facing view
- 定义层不等于执行层

Claude Code 最大的优点之一，就是它不爱把抽象揉成一团。

---

## 原则 2：一切运行都要有边界

- 权限边界
- 工具边界
- 上下文边界
- 生命周期边界
- 子 agent 与父会话边界

它一直在做的事，就是给“模型能做什么”加边界，而不是只加能力。

---

## 原则 3：一切复杂度都尽量前移成结构

- frontmatter 是结构
- input routing 是结构
- attachment 是结构
- transcript 是结构
- compact boundary 也是结构

这能把后面大量不稳定的 prompt 难题，提前变成工程问题。

---

## 原则 4：一切长会话问题，都不要只靠模型记忆硬扛

Claude Code 很明显不相信：

- 模型自己会一直记住
- 把上下文一直堆着就行

所以它才会发展出：

- snip
- collapse
- compact
- session restore
- prompt cache

这是一个很成熟的现实主义判断。

---

## 原则 5：一切“能跑”都不算完成，必须能恢复、能观察、能清理

这是 Claude Code 很“工程系统”而不是“prompt 系统”的地方。

只会跑，不够。

还得：

- 可追踪
- 可恢复
- 可约束
- 可清理

这也是我觉得它真正值得学的原因。

---

# 四、给没看过源码但有编程基础的人：怎么理解 Claude Code 的 agent 层

如果你是程序员，但没读过源码，我建议你把 Claude Code 想成下面这个类比。

## 不要把它想成聊天机器人

更接近：

- 一个带状态的任务执行内核
- 外面包了一层能力声明系统
- 中间有运行时装配线
- 下面有一组受控原语
- 后面再挂一条上下文治理和恢复链

所以它像什么？

我觉得最像：

> **“会话版的、带 LLM 的轻量任务操作系统”。**

当然它不是操作系统，
但这个类比能帮你理解为什么它会有这些设计：

- 身份
- 权限
- 工具
- 调度
- 子 worker
- 状态持久化
- 内存治理
- 恢复
- 清理

如果用更传统的软件类比：

- `tool` 像 syscall / primitive
- `skill` 像可复用 playbook
- `agent` 像带权限和上下文的 worker process
- `QueryEngine` 像 request orchestrator
- `compact/collapse` 像内存治理 / working set management
- `sessionStorage` 像 checkpoint / recovery layer

这个类比不精确，但足够帮助你建立第一层心智模型。

---

# 术语补充 / 名词解释

## 1. agent
这里不要理解成“AI 人设”。

更准确地说，是：

- 一个可运行的工作实例
- 带权限、工具池、上下文和生命周期

## 2. skill
不要理解成“提示词模板”。

更准确地说，是：

- 一个可复用的方法模块
- 告诉系统什么时候该用、该怎么做

## 3. tool
不要理解成“SDK 函数”。

更准确地说，是：

- 给模型暴露的受控动作原语

## 4. QueryEngine
不要理解成“发请求的封装器”。

更准确地说，是：

- 组织一次完整 turn 的主控器

## 5. compact / collapse / snip
都和“让上下文变轻”有关，但不是一回事：

- `snip`：轻量剪掉一截模型视图
- `collapse`：把一段旧历史折成摘要代表
- `compact`：重建新的继续运行骨架

---

# 这一篇最想保住的判断

如果把整篇压成一句最关键的话，我会留：

> **Claude Code 最值得学的 agent 层设计，不是“多 agent”这件事本身，而是它把 agent 当成了一个真正的运行时系统问题来处理：能力要分层、上下文要治理、权限要分层叠加、子 worker 要受控分叉、执行轨迹要持久化、会话中断后要能恢复、生命周期结束时要能清干净。**

这句话里最重要的点有六个：

- agent 是运行时对象，不是 prompt 皮肤
- skill / agent / tool 分工明确
- QueryEngine 管的是 turn，不只是回复
- 长上下文靠治理链，不靠硬扛
- transcript / session restore 是主链，不是附属品
- 生命周期必须闭环

---

# 我现在对 Claude Code agent 层的最短总结

如果只留一句最短的话，我会留：

> **Claude Code 的 agent 层，本质上是在把 LLM 包装成一个可约束、可委派、可恢复、可清理的工作系统。**

---

# 这篇最值得记住的 20 条（一屏版）

1. agent 是运行对象，不是 prompt
2. 定义层和运行层必须分开
3. tool、skill、agent 要明确分工
4. frontmatter 是 runtime 接口
5. 先给能力目录，再按需展开
6. 主循环编排的是 turn，不是单次回复
7. 输入先分类，再处理
8. attachment 是结构化上下文对象
9. tool 是受控原语，不是函数集合
10. fork 前要先净化父上下文
11. 权限要分层叠加，不要一把梭
12. 工具池要按 agent 类型再过滤
13. agent 可以带自己的能力接入口
14. skill 要进入 runtime，而不只是进 prompt
15. fork 更像受控 worker 分叉，不是自由复制
16. transcript 是主链数据，不是日志附属品
17. 送模历史应是“模型视图”，不是原始历史
18. 上下文治理要做成分层流水线
19. 恢复是重建运行现场，不是聊天回放
20. 生命周期必须闭环清理

---

# 下一步最顺怎么接

如果继续沿这条线往下写，我觉得有两种很自然的延伸。

## 方向 A：再出一篇“20 条设计对应的源码落点索引”

也就是把这篇总结反查回：

- 每一条主要对应哪些文件
- 哪几篇共读最值得回看

这样更适合做学习导航。

## 方向 B：再出一篇“如果你自己做 agent 框架，Claude Code 这 20 条该怎么落地”

也就是把“源码共读结论”翻译成“系统设计建议”。

如果只选一个，我会更倾向 **方向 B**。

因为这篇已经完成了“读懂 Claude Code 的 agent 层”，下一步最自然就是：

> **怎么把这些设计判断迁移到你自己的 agent 系统里。**
