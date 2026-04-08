# 卷七架构设计草案 v1

日期：2026-04-09  
状态：approved in chat  
类型：guidebookv2 卷级结构设计

## 1. 卷七定位

卷七定为：

> **卷七：命令、工作流与产品层整合**

它承接卷六已经建立起来的事实：

- Claude Code 不只会执行
- 不只会持续工作
- 不只会继续长能力
- 不只会长成多 agent 协作运行时

卷七之后，读者自然会继续问：

> **用户入口、运行时接口、产品控制层，是怎样收成一个完整系统的？**

因此卷七不是命令索引，也不是产品宣传文，而是：

> **Claude Code 怎样把用户入口、runtime interface、workflow control layer 和产品形态收成一个统一控制层。**

---

## 2. 卷七读完后，读者必须留下什么

卷七最重要的目标，不是让读者记住 slash command、frontmatter、verify、debug、plan 这些名字，而是让读者脑中留下：

> **Claude Code 之所以呈现成今天这个产品，不是因为它功能很多，而是因为用户入口、运行时接口和工作流控制层已经被收成了一套统一控制层。**

也就是说，读完卷七之后，读者至少要能复述：

- 为什么卷六之后还不能停，系统还必须长出控制层
- 为什么 command 不是普通快捷方式，而是用户入口的一部分
- 为什么 command interface / skill frontmatter 不只是元数据，而是 runtime interface
- 为什么 verify / debug / plan 这些东西不是散功能，而是 workflow control layer 的动作
- 为什么 command、tool、skill、agent 的边界必须在卷七收口
- 为什么 Claude Code 最终呈现成今天这个产品

---

## 3. 卷七的组织原则

### 3.1 先立控制层问题，再拆命令 / interface / workflow / product

卷七第一篇不应该一上来就讲 slash command 列表，也不该直接讲产品形态。

更好的开法是先回答：

> **为什么 Claude Code 在卷六之后，还必须继续长出一层控制层？**

只有这个问题先立住，后面的 command、runtime interface、workflow control layer 与产品形态，才不会退化成散装功能说明。

### 3.2 先控制层，再入口，再 interface，再 workflow，再产品形态

卷七整体采用：

- 先立控制层
- 再看命令入口
- 再看命令如何接入 runtime
- 再看 runtime interface
- 再看 workflow control layer
- 再做四者边界收口
- 最后进入产品形态与卷尾收束

### 3.3 卷七按 8 篇处理

当前已经确认：

> **卷七按 8 篇处理。**

结构为：

1. 为什么 Claude Code 最终一定会长出一层控制层
2. slash commands / prompt commands 为什么不是普通快捷方式
3. 命令入口是怎样接进 runtime 的
4. skill frontmatter / command interface 为什么是运行时接口，不只是元数据
5. 工作流控制层是怎样在 Claude Code 里成立的
6. command、tool、skill、agent 的边界为什么最终要在卷七收口
7. 为什么说 Claude Code 的产品形态，本质上是 runtime 被包装给用户的方式
8. 为什么用户入口、运行时接口和工作流控制层最终会收成今天这个产品

### 3.4 卷七主线必须守住“控制层”，不回头重写卷三 / 卷五 / 卷六

卷七讲的是：

- 用户入口
- runtime interface
- workflow control layer
- 产品形态

它**不负责**重写：

- 卷三工具执行层
- 卷五扩展对象层
- 卷六协作运行时层

这些层只能被回收，不能被整卷重写。

### 3.5 卷尾必须收成产品控制层判断，而不是全书哲学总结

卷七最后不能写成“Claude Code 真厉害”的总结文，也不能拔高成全书抒情结尾。

卷尾必须收束为：

> **为什么用户入口、运行时接口和工作流控制层，最终会收成今天这个产品。**

---

## 4. 当前确定的 8 篇结构

## 01｜为什么 Claude Code 最终一定会长出一层控制层

### 这篇要解决的问题
- 为什么卷六之后还不能结束
- 为什么系统必须继续长出控制层
- 为什么控制层不是附属 UI，而是 runtime 继续长出的结构层

### 这篇的卷内作用
- 卷七总起篇
- 从卷六导向卷七的桥接篇

---

## 02｜slash commands / prompt commands 为什么不是普通快捷方式

### 这篇要解决的问题
- 为什么 command 不是快捷方式
- 为什么它们属于正式用户入口

### 这篇的卷内作用
- 命令入口定位篇

---

## 03｜命令入口是怎样接进 runtime 的

### 这篇要解决的问题
- 命令怎样从入口进入主系统
- command 如何进入 runtime 主链

### 这篇的卷内作用
- 入口接入篇

---

## 04｜skill frontmatter / command interface 为什么是运行时接口，不只是元数据

### 这篇要解决的问题
- 为什么 frontmatter / interface 不是附属说明
- 为什么声明式接口属于 runtime

### 这篇的卷内作用
- interface 定位篇

---

## 05｜工作流控制层是怎样在 Claude Code 里成立的

### 这篇要解决的问题
- verify / debug / plan / orchestration 为什么不是散功能
- workflow control layer 怎样成立

### 这篇的卷内作用
- 卷七中段主干篇

---

## 06｜command、tool、skill、agent 的边界为什么最终要在卷七收口

### 这篇要解决的问题
- 为什么这四者的边界必须站在控制层视角重切
- 为什么这个问题应在卷七收口

### 这篇的卷内作用
- 边界总收口篇

---

## 07｜为什么说 Claude Code 的产品形态，本质上是 runtime 被包装给用户的方式

### 这篇要解决的问题
- 为什么 Claude Code 最终会长成今天这个产品
- 产品形态和 runtime 之间是什么关系

### 这篇的卷内作用
- 产品形态定位篇

---

## 08｜为什么用户入口、运行时接口和工作流控制层最终会收成今天这个产品

### 这篇要解决的问题
- 为什么卷七最终不是命令说明书，而是产品控制层判断
- 为什么这三层最后会收成今天这个产品

### 这篇的卷内作用
- 卷七总收束篇

---

## 5. 与前后卷的边界

### 5.1 和卷六的边界

卷六已经讲过：

- 多 agent 协作 runtime 怎样成立
- team / teammate / mailbox / swarm 怎样成为协作层

卷七不再回答“协作层如何成立”，而继续回答：

- 这些能力最终怎样被暴露给用户
- 为什么入口、接口和 workflow 会再长出控制层

### 5.2 卷七自身的收束位置

卷七不做全书哲学总结，只完成自己这一卷的判断：

- 用户入口
- runtime interface
- workflow control layer
- 产品形态

怎样收成一个完整系统。
