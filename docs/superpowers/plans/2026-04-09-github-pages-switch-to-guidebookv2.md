# GitHub Pages Switch To Guidebookv2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让公开站点默认展示 `guidebookv2` 的七卷结构与首页入口。

**Architecture:** 保持现有 MkDocs 配置和文档文件结构不动，只改站点信息架构。核心变更集中在 `mkdocs.yml` 的导航映射，以及 `docs/index.md` 的首页引导链接。

**Tech Stack:** MkDocs, Material for MkDocs, Markdown

---

### Task 1: 切换 MkDocs 主导航到 v2

**Files:**
- Modify: `mkdocs.yml`

- [ ] **Step 1: 更新 `nav` 为 `guidebookv2` 七卷结构**
- [ ] **Step 2: 检查 `exclude_docs` 不会误排除 `guidebookv2` 正文**
- [ ] **Step 3: 保存配置并准备本地构建验证**

### Task 2: 切换首页入口到 v2

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: 把首页主入口改为 `guidebookv2/index.md`**
- [ ] **Step 2: 把卷级链接改为 v2 七卷结构**
- [ ] **Step 3: 保留简洁说明，避免旧版导流继续出现在首页**

### Task 3: 本地验证与提交

**Files:**
- Modify: `mkdocs.yml`
- Modify: `docs/index.md`

- [ ] **Step 1: 运行 `mkdocs build` 验证站点可构建**
- [ ] **Step 2: 用 `git diff --stat` 与 `git status` 检查改动范围**
- [ ] **Step 3: 提交变更**
