# Repo Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize `claude-code-source-guide` as a minimal content-first repository with README, basic docs directories, `.gitignore`, and two migrated seed documents.

**Architecture:** Keep the repository content-only for now. Store guidebook-facing material under `docs/guidebook/`, process notes under `docs/notes/`, and planning/spec artifacts under `docs/superpowers/` so later migration to a docs site remains simple.

**Tech Stack:** Git, Markdown, GitHub, gh CLI

---

### Task 1: Create minimal repository skeleton

**Files:**
- Create: `README.md`
- Create: `.gitignore`
- Create: `docs/guidebook/.gitkeep`
- Create: `docs/notes/.gitkeep`

- [ ] **Step 1: Write README.md**

```md
# Claude Code Source Guide

A content-first repository for a public-facing Claude Code source reading / source guide project.

## Current Stage

This repository is currently in the content structuring phase.

Current focus:
- reorganizing the guidebook structure
- refining volume outlines
- moving key draft documents out of the Obsidian vault into a standalone repo

## Repository Structure

- `docs/guidebook/` — guidebook-facing content
- `docs/notes/` — brainstorm notes, working notes, and restructuring memos
- `docs/superpowers/` — specs and plans used during repo setup

## Next Steps

1. Migrate the seed guidebook documents
2. Write the volume-one guide page
3. Draft the guidebook homepage
4. Decide the future GitHub Pages stack
```

- [ ] **Step 2: Write .gitignore**

```gitignore
.DS_Store
.obsidian/
*.swp
*.swo
```

- [ ] **Step 3: Create docs placeholder files**

Run:
```bash
mkdir -p docs/guidebook docs/notes
: > docs/guidebook/.gitkeep
: > docs/notes/.gitkeep
```
Expected: directories exist with placeholder files

- [ ] **Step 4: Commit skeleton**

```bash
git add README.md .gitignore docs/guidebook/.gitkeep docs/notes/.gitkeep
git commit -m "init repository skeleton"
```

### Task 2: Migrate seed documents from knowledge-vault

**Files:**
- Create: `docs/guidebook/00-mapping-table-v2.md`
- Create: `docs/notes/2026-04-05-volume-one-restructure-brainstorm.md`
- Source: `/Users/haha/workspace/knowledge-vault/03-Research/Claude Code/guidebook/00-旧编号到新结构映射表.md`
- Source: `/Users/haha/workspace/knowledge-vault/03-Research/Claude Code/guidebook/2026-04-05-第一卷重排-brainstorm纪要.md`

- [ ] **Step 1: Copy mapping table into docs/guidebook**

Run:
```bash
cp '/Users/haha/workspace/knowledge-vault/03-Research/Claude Code/guidebook/00-旧编号到新结构映射表.md' 'docs/guidebook/00-mapping-table-v2.md'
```
Expected: target file exists

- [ ] **Step 2: Copy brainstorm note into docs/notes**

Run:
```bash
cp '/Users/haha/workspace/knowledge-vault/03-Research/Claude Code/guidebook/2026-04-05-第一卷重排-brainstorm纪要.md' 'docs/notes/2026-04-05-volume-one-restructure-brainstorm.md'
```
Expected: target file exists

- [ ] **Step 3: Verify copied files**

Run:
```bash
ls -la docs/guidebook docs/notes
```
Expected: both markdown files are present

- [ ] **Step 4: Commit migrated docs**

```bash
git add docs/guidebook/00-mapping-table-v2.md docs/notes/2026-04-05-volume-one-restructure-brainstorm.md
git commit -m "add seed guidebook documents"
```

### Task 3: Push initialized repository

**Files:**
- Modify: repository git history only

- [ ] **Step 1: Check repository status**

Run:
```bash
git status --short
```
Expected: clean working tree

- [ ] **Step 2: Push commits**

Run:
```bash
git push
```
Expected: branch `main` updates on origin

- [ ] **Step 3: Verify remote state**

Run:
```bash
git log --oneline -3
```
Expected: shows the spec commit plus initialization commits
```
