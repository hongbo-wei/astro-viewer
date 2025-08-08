# Astro Viewer

一个基于 React 和 TypeScript 的天文数据可视化应用。

## 环境要求

### Node.js

推荐使用 Node.js >= 18

### 包管理器

使用 pnpm 作为包管理器：

```bash
npm install -g pnpm
```

### Turbo

安装 Turbo 以支持 monorepo 管理：

```bash
pnpm install turbo --global
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 或者单独启动 JSP-UI 应用
cd apps/jsp-ui
pnpm dev
```

## 项目结构

这是一个基于 Turborepo 的 monorepo 项目，包含以下部分：

### 应用 (Apps)

- `jsp-ui`: 主要的天文数据可视化应用，基于 React + TypeScript + Vite

### 包 (Packages)

- `@zj-astro/ui`: 共享的 React 组件库
- `@repo/eslint-config`: ESLint 配置
- `@repo/typescript-config`: TypeScript 配置
- `operators`: 操作相关的工具包

## 开发工具

项目已配置以下开发工具：

- [TypeScript](https://www.typescriptlang.org/) - 静态类型检查
- [ESLint](https://eslint.org/) - 代码规范检查
- [Prettier](https://prettier.io) - 代码格式化

## 开发命令

```bash
# 开发模式 - 启动所有应用
pnpm dev

# 仅启动特定应用
turbo dev --filter=jsp-ui

# 构建所有应用
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 依赖管理

> ⚠️ 请使用 pnpm 管理依赖，不要使用 npm 或 yarn

```bash
# 安装所有依赖
pnpm install

# 为特定应用添加依赖
pnpm add <package-name> --filter jsp-ui

# 为根项目添加依赖
pnpm add <package-name> -w
```
