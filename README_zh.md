# Astro Viewer

一个基于 React, Three.js 和 TypeScript 的天文数据多波段融合联合巡天数据处理（JSP）可视化应用。

- 定义
  - 将来自多个望远镜/波段的观测图像（通常是 FITS 格式）对齐并融合成一幅更完整、更高质量的天文图像，以突出不同数据源的互补信息（空间分辨率、波段、曝光时间等）。
- 输入 / 输出
  - 输入：FITS 文件（或经转换的 JSON/PNG），带天文坐标/元数据（WCS、曝光、滤镜等）。参见项目中的转换脚本 convert_fits_json.py。
  - 输出：可用于显示的 PNG / 多层画布，或用于后续处理的融合数据。
- 核心流程（常见步骤）
  1. 数据摄取：从后端/API 或存储获取 FITS 路径（项目 README 中的架构说明参见 README.md）。
  2. 校准与配准：使用 WCS 信息进行重投影（reproject）、亚像素对齐与星点匹配。
  3. PSF/亮度归一化：匹配不同望远镜的点扩散函数与亮度尺度。
  4. 融合算法：多尺度或基于权重的融合（你工程中提到的 JSP 融合算法在架构图中有体现，见 README.md）。
  5. 可视化渲染：在前端用 Canvas / WebGL（Three.js）展示，支持图层、色彩映射、缩放与漫游。
- 交互与配置
  - 允许用户调节望远镜参数（权重、伽玛/对比、伪彩色映射）、选择要融合的波段、开/关源检测或伪彩叠加等。
- 架构（与你仓库对应）
  - 前端：JSP UI（React + Vite），入口文件 index.html，配置见 vite.config.ts。
  - 后端/API（设想）：提供 FITS 路径、执行服务器端融合或格式转换（FITS -> PNG/JSON）。
  - 存储：FITS 和融合结果的对象存储或文件系统。

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
