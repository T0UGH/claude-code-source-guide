# 卷六架构设计草案 v1

日期：2026-04-08  
状态：approved in chat  
类型：guidebookv2 卷级结构设计

## 1. 卷六定位

卷六定为：

> **卷六：多 agent 协作运行时**

它承接卷五已经建立起来的事实：

- Claude Code 不只会执行
- 不只会持续工作
- 也不只会继续长能力

卷五已经把系统如何长出：

- skills
- MCP
- Agent 主轴
- hooks
- plugins

讲清楚了。

但卷五之后，一个更硬的问题会继续出现：

> **当系统已经能长出更多执行者时，这些执行者之间的协作，为什么不只是“多开几个 agent”，而会进一步长成一层独立运行时？**

这就是卷六的主问题。

因此，卷六不是 team 功能目录，也不是多 agent feature 清单，而是：

> **Claude Code 的多 agent 协作层，是怎样从单执行者系统继续长成协作运行时的。**

---

## 2. 卷六读完后，读者必须留下什么

卷六最重要的目标，不是让读者记住 team、teammate、mailbox、idle、shutdown 这些名字，而是让读者脑中留下：

> **Claude Code 的多 agent 能力，本质上是一层协作 runtime。**

也就是说，读完卷六之后，读者至少要能复述：

- 为什么多 agent 协作不是“多开几个 agent”
- 为什么 team 是正式对象，而不是 UI 层概念
- 为什么 teammate runtime 不只是 worker wrapper，而是真正的运行体
- 为什么 mailbox / idle / shutdown 不是边角协议，而是协作闭环成立的关键部件
- 为什么 Local / Remote / Teammate 这些承载体必须被分层理解
- 为什么 Claude Code 的 team 系统最终更像一个 swarm runtime

---

## 3. 卷六的组织原则

### 3.1 先立“协作 runtime”总问题，再回到旧主线拆解

卷六第一篇不应该一上来就讲 TeamCreateTool、mailbox 或 InProcessTeammateTask。

更好的开法是先回答：

> **为什么说 Claude Code 的多 agent 能力本质上是一层协作 runtime，而不是多开几个 agent？**

只有这个总问题先立住，后面的 team / teammate / mailbox / swarm 才不会退化成一组并列机制说明。

### 3.2 先总后分

卷六整体采用：

- 先立“多 agent 协作是一层独立运行时”
- 再回到旧卷六那条硬主线，逐步拆开 team、teammate、mailbox 和边界
- 最后收束为 swarm 判断

也就是说，卷六不是旧卷六文章顺序的简单搬运，而是在旧主线前面补一个更强的总起。

### 3.3 卷六规模控制在 7 篇

当前聊天中已经确认：

> **新版卷六按 7 篇处理。**

结构是：

1. 总起篇：为什么说 Claude Code 的多 agent 能力本质上是一层协作 runtime
2. team / teammate runtime 在系统中的位置
3. team lifecycle
4. in-process teammate runtime
5. mailbox / idle / shutdown
6. local / remote / teammate 边界
7. swarm 收束篇

这个规模的意义是：

- 保住旧卷六已有的硬骨架
- 不人为膨胀成大卷
- 通过总起篇把这一卷从“机制说明”提升到“协作运行时卷”

### 3.4 卷六主线必须守住“协作层”，不提前吃卷七

卷六讲的是：

- 协作运行时
- team / teammate 对象
- 协作协议
- 多执行者结构

它**不负责**详细讲：

- slash commands
- runtime 命令入口
- skill frontmatter / runtime interface
- command / tool / skill / agent 的产品层总边界
- Claude Code 为什么最终呈现为今天这个产品

这些内容应留给：

> **卷七：命令、工作流与产品层整合。**

### 3.5 卷尾必须收成 swarm 判断

卷六最后不能只停在“team 机制很多”，也不能只停在“teammate 能运行”。

卷尾必须收束为：

> **为什么说 Claude Code 的 team 系统本质上是一个带 leader、mailbox 和 task runtime 的 swarm。**

这句收束，是卷六最重要的辨识度来源。

---

## 4. 建议篇幅与粒度

卷六当前按中卷处理。

它不需要像卷五那样铺到 20+ 篇，因为：

- 卷六的对象族谱没有卷五那么发散
- 旧卷六已经有一条相对稳定的 6 篇主线
- 目前最需要补的是卷级总起，而不是大规模再拆枝叶

因此新版卷六最稳的做法是：

- 保留旧卷六 6 篇主线
- 在前面补 1 篇总起
- 合计 7 篇

---

## 5. 当前确定的 7 篇结构

## 01｜为什么说 Claude Code 的多 agent 能力本质上是一层协作 runtime

### 这篇要解决的问题
- 为什么多 agent 协作不是“多开几个 agent”
- 为什么协作能力会进一步长成一层独立运行时
- 为什么卷六不能直接从 team 机制展开，而必须先立 runtime 层判断

### 这篇的卷内作用
- 卷六总起篇
- 从卷五导向卷六的桥接篇

### 这篇最该留下的判断
> Claude Code 的多 agent 能力，不是“执行者数量增加”这么简单，而是系统已经长出一层新的协作 runtime。

### 这篇不讲什么
- 不提前把 team lifecycle 讲完
- 不抢 mailbox / shutdown 正文
- 不提前吃卷七的产品入口问题

---

## 02｜team / teammate runtime 在系统中的位置

### 这篇要解决的问题
- team / teammate runtime 在整个系统里的位置是什么
- 它和前面卷里的 Agent 主轴是什么关系
- 为什么它不是额外附着的功能点

### 这篇的卷内作用
- 旧卷六主线的第一篇
- 协作运行时结构定位篇

---

## 03｜team lifecycle

### 这篇要解决的问题
- team 作为正式对象怎样被创建、注册、清理
- TeamCreate / TeamDelete 之类的生命周期操作为什么重要

### 这篇的卷内作用
- 协作对象生命周期篇
- 把 team 从概念推进成正式对象

---

## 04｜in-process teammate runtime

### 这篇要解决的问题
- teammate runtime 真正怎样跑起来
- InProcessTeammateTask 在整套协作运行时里是什么位置

### 这篇的卷内作用
- 协作运行时真正落地篇
- 卷六执行层核心篇

---

## 05｜mailbox / idle / shutdown

### 这篇要解决的问题
- teammate 之间怎样通信
- 为什么 idle / shutdown 不是边角机制，而是协作协议的一部分

### 这篇的卷内作用
- 协作协议篇
- 协作闭环成立的关键篇

---

## 06｜local / remote / teammate 边界

### 这篇要解决的问题
- LocalAgentTask、RemoteAgentTask 和 teammate runtime 各自服务什么场景
- 为什么这些承载体不能混成同一种东西

### 这篇的卷内作用
- 协作层边界收束篇
- 为 swarm 收束篇铺路

---

## 07｜为什么说 Claude Code 的 team 系统本质上是一个 swarm

### 这篇要解决的问题
- 为什么卷六最终不能只停在 team 功能说明上
- 为什么这些对象、协议和运行体合起来更像 swarm runtime

### 这篇的卷内作用
- 卷六收束篇
- 协作运行时总判断篇

### 这篇最该留下的判断
> Claude Code 的 team 系统，不是几个 teammate feature 的堆叠，而是一套带 leader、mailbox 和 task runtime 的 swarm。

---

## 6. 与前后卷的边界

### 6.1 和卷五的边界

卷五已经讲过：

- 系统怎样长出更多能力
- skills / MCP / Agent 主轴 / hooks / plugins 怎样进入 runtime
- agent / subagent 怎样作为执行者主线成立

卷六不重复讲“能力怎样长出来”，而是继续回答：

- 当执行者已经长出来之后，协作层怎样进一步成立
- team / teammate / mailbox / shutdown 怎样构成新的运行时层

### 6.2 和卷七的边界

卷七才详细展开：

- slash commands
- runtime 命令入口
- skill frontmatter / runtime interface
- command / tool / skill / agent 的边界
- 产品层为什么呈现成今天这个样子

所以卷六必须避免：

- 提前把命令入口讲成正题
- 提前把产品控制层讲成卷六主线
- 提前把产品形态收束做完

卷六的重点始终是：

> **协作运行时如何成立。**

---

## 7. 当前最稳的结构判断

截至目前，聊天中已经确认的卷六判断如下：

- 卷六正式改回：**多 agent 协作运行时**
- 开篇总问题：**为什么说 Claude Code 的多 agent 能力本质上是一层协作 runtime**
- 组织方式：**先总后分**
- 篇幅：**7 篇**
- 核心主线：保留旧卷六的 team / teammate / mailbox / swarm 主线
- 卷尾主收口：**为什么说 Claude Code 的 team 系统本质上是一个 swarm**
- “命令、工作流与产品层整合”从卷六后移为：**卷七**

这套判断已经足够支持下一步：

- 写卷六 `README-writing-cards.md`
- 补卷六 `README-production-order.md`
- 再进入具体产文顺序安排
