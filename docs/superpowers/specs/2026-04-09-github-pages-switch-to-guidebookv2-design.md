# GitHub Pages 切换到 guidebookv2 设计说明

**目标**：让公开站点默认以 `guidebookv2/` 为主导航与主入口，旧 `guidebook/` 文件继续保留在仓库中但不作为站点主导航。

## 设计结论

- 站点主导航由 `mkdocs.yml` 的 `nav` 改为指向 `docs/guidebookv2/`。
- 站点首页 `docs/index.md` 改为默认引导用户进入 `guidebookv2/index.md`，并按七卷列出入口。
- 旧 `docs/guidebook/` 内容保留，不删除，不作为主导航展示对象。
- 保持现有 MkDocs / Material 配置不变，只调整信息架构与入口链接。

## 涉及文件

- `mkdocs.yml`
- `docs/index.md`

## 验证标准

1. `mkdocs build` 成功。
2. 顶部导航与左侧导航默认指向 v2。
3. 首页不再把读者导向旧 `guidebook/`。
4. 旧文件仍保留在仓库中。
