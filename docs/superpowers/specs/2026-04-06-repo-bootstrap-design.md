---
title: claude-code-source-guide 仓库初始化设计
status: draft
date: 2026-04-06
---

# claude-code-source-guide 仓库初始化设计

## 目标

为 `claude-code-source-guide` 建立一个**最小可用**的内容仓库骨架，不预先绑定具体文档站技术栈，同时支持后续迁移到 GitHub Pages。

## 本阶段范围

本阶段只做以下事情：

1. 初始化基础目录
2. 写入仓库 README
3. 创建 `.gitignore`
4. 迁入两份种子文档
5. 完成首个 commit 并 push

## 不做的事情

1. 不选择 Docusaurus / MkDocs / Astro
2. 不引入前端工程脚手架
3. 不设计站点样式
4. 不开始大规模迁移 Obsidian 全量内容

## 采用方案

采用 **方案 A：最小可用初始化**。

目录结构：

```text
README.md
.gitignore
docs/
  guidebook/
  notes/
  superpowers/
    specs/
```

## 初始内容

### README.md
说明仓库目标、当前阶段、内容结构和下一步计划。

### docs/guidebook/
放导读手册相关内容，首批迁入：
- 映射表 v2

### docs/notes/
放讨论纪要、brainstorm、阶段性说明，首批迁入：
- 第一卷重排 brainstorm 纪要

### .gitignore
保持最小，只忽略常见系统文件与编辑器缓存。

## 为什么这样做

这个结构的好处是：

1. 内容先独立出来，不继续依附 Obsidian 仓库
2. 后续无论接哪种 GitHub Pages 技术栈，都还能平滑迁移
3. `guidebook` 和 `notes` 分开，导读正文与过程文档不混在一起
4. 现在就能开始持续写内容，不必等站点技术选型

## 成功标准

初始化完成后，应满足：

1. 仓库有清晰 README
2. 有 `docs/guidebook` 和 `docs/notes` 两个主要内容目录
3. 两份种子文档已迁入
4. 远端仓库已有首个 commit

## 当前决定

- 先做内容仓，不做站点仓
- 先迁两份核心文档，不批量搬运
- 目录命名采用英文，正文继续可以中文写作
