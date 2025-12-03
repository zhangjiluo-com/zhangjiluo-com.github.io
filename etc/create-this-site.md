# 创建此站

## 添加 readme.md 说明文档

## 初始化前端项目

```shell
pnpm init
```

## 添加依赖包

```shell
pnpm add -D vitepress@next
pnpm add vue
```

## 初始化 vitpress

```shell
pnpm vitepress init
```

## 忽略 Vitepress 的构建缓存

```.gitignore
.vitepress/dist
.vitepress/cache
```

## 启用 GitHub Pages

在项目 Settings > Pages > Build and deployment > Source 中选择 GitHub Actions

## 添加 GitHub Actions

在项目的 .github/workflows 目录中创建一个名为 github-pages-deploy.yml 的文件，其中包含这样的内容：

```yaml
name: Deploy GitHub Pages

on:
  # 在 `main` 分支的推送上运行
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v5
        # with:
        #   fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      - name: 安装 pnpm
        uses: pnpm/action-setup@v4
      - name: 安装 Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: pnpm
      - name: 配置 GitHub Pages
        uses: actions/configure-pages@v4
      - name: 安装依赖
        run: pnpm install
      - name: 构建项目
        run: pnpm run build
      - name: 上传制品
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: 部署
    steps:
      - name: 部署 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
