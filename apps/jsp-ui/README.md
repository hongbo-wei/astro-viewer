# Astro Visualizer - JSP UI

这是 Astro Visualizer 项目的前端子项目，基于 React、TypeScript 和 Vite 构建，旨在提供天文数据的可视化界面。

## 目录结构

```
apps/jsp-ui/
├── public/                # 静态资源
├── src/                   # 源代码
│   ├── components/        # 通用组件
│   ├── constants/         # 常量定义
│   ├── data/              # 示例数据
│   ├── hooks/             # 自定义 hooks
│   ├── routes/            # 路由配置
│   ├── services/          # 数据服务
│   ├── theme/             # 主题相关
│   ├── types/             # 类型定义
│   ├── utils/             # 工具函数
│   └── views/             # 页面视图
├── index.html             # 入口 HTML
├── package.json           # 项目依赖与脚本
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── ...
```

## 快速开始

请安装 pnpm@v8.15.4
安装 `npm install -g pnpm`

1. **安装依赖**

```bash
pnpm install
```

2. **启动开发服务器**

```bash
pnpm run dev
```

3. **访问应用**

打开浏览器访问 [http://localhost:5173](http://localhost:5173)（端口号以实际输出为准）。

## 主要依赖
- React
- TypeScript
- Vite
- Three.js（用于三维可视化）

## 项目脚本
- `npm run dev` 启动开发服务器
- `npm run build` 打包生产环境代码
- `npm run preview` 预览打包后的应用


## 系统架构图

```mermaid
flowchart LR
  User[用户浏览器] -->|HTTP/HTTPS| JSPUI[前端 JSP UI]
  JSPUI -->|REST API| Backend[后端服务]
  Backend -->|数据库访问| DB[(数据库)]
  Backend -->|文件存储| Storage[(天文数据存储)]
```

> 上图展示了 Astro Visualizer 的主要架构：用户通过浏览器访问前端（JSP UI），前端通过 API 与后端服务通信，后端负责数据处理与存储。

## 相关文档
- `docs/WCS_UPGRADE_GUIDE.md`：WCS 升级指南

## 贡献
欢迎提交 issue 和 PR 参与项目建设。

---

> 本项目为天文数据可视化平台的前端部分，后端与数据服务请参考主仓库说明。
