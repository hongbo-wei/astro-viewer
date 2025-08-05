以下是针对“Astro Visualizer - JSP UI”前端项目的详细技术规格文档（Technical Specification），适用于规范驱动开发（Spec-Driven Development）：

---

## 术语说明

- **JSP**：Joint Survey Processing，联合巡天处理。本文档中所有“JSP”均指“Joint Survey Processing”。

---

# Astro Visualizer - JSP UI 技术规格文档

## 1. 项目简介

### 1.1 功能

Astro Visualizer - JSP UI 是一个基于 React、TypeScript 和 Vite 的天文数据可视化前端项目。其核心功能包括：

- 3D 展示天区（Celestial Sphere）
- 用户可交互选择天区进行 JSP（天区选择与投影）
- 显示通过 JSP 选区的天文图像
- 支持天文数据的可视化与交互分析

### 1.2 目标用户

- 天文学研究人员
- 天文数据分析师
- 科研院所/高校天文相关专业师生
- 需要进行天区可视化与交互分析的开发者

### 1.3 使用场景

- 天文观测数据的可视化与分析
- 天区选择与投影（JSP）辅助科学研究
- 天文教学与演示
- 天文数据产品的前端展示

---

## 2. 页面结构与路由设计

| 页面/模块          | 路由 URL       | 说明                 |
| ------------------ | -------------- | -------------------- |
| 首页               | `/`            | 项目入口，天区3D展示 |
| Astro Image Viewer | `/astro-viwer` | JSP后图像展示与交互  |
| 错误页面           | `*`            | 404/错误处理         |

> 路由配置建议使用 React Router 进行集中管理，支持嵌套路由和懒加载。

---

## 3. 页面功能说明

### 3.1 首页（Celestial Sphere）

- **输入**：无（或通过 URL 参数指定初始天区）
- **输出**：3D 天区球体，星表、坐标网格等
- **交互逻辑**：
  - 鼠标拖拽旋转天球
  - 滚轮缩放
  - 框选/点击选择天区，进入 JSP 流程
  - 选区高亮显示

### 3.2 Astro Image Viewer

- **输入**：选区参数（天区坐标、投影参数等）
- **输出**：JSP 结果图像，叠加坐标网格/天体标注
- **交互逻辑**：
  - 图像缩放、平移
  - 鼠标悬停显示像素/天体信息
  - 支持导出图像

### 3.3 Example 页面

- **输入**：示例数据
- **输出**：功能演示、交互说明
- **交互逻辑**：与主流程一致，便于用户体验（包括 JSP 流程）

### 3.4 错误页面

- **输入**：错误信息
- **输出**：错误提示、返回首页按钮

---

## 4. 外部库与依赖

- **前端框架**：React, React Router
- **构建工具**：Vite
- **类型系统**：TypeScript
- **3D 可视化**：Three.js
- **样式**：Sass/SCSS
- **HTTP 请求**：axios
- **状态管理/辅助 Hooks**：自定义 hooks（如 useSelector）
- **后端接口**：RESTful API（与后端服务通信）

---

## 5. 数据交互规范

### 5.1 API 接口设计

#### 5.1.1 获取天区数据

**URL**：`POST localhost:3001/api/log`
**参数**：

- `telescopesAndFilters` (array): 望远镜及其滤镜/波段配置
  - `telescope` (string): 望远镜名称
  - `db` (string): 数据库名称
  - `column` (string): 滤镜/波段所在列名
  - `filters` (array): 滤镜/波段列表
- `coordinations` (array): 选区坐标点（ra/dec）
  - `ra` (float): 赤经
  - `dec` (float): 赤纬

详细参数示例：

```json
{
  "telescopesAndFilters": [
    {
      "telescope": "2MASS",
      "db": "twomass_allsky_images",
      "column": "filter",
      "filters": ["h"]
    },
    {
      "telescope": "DESI",
      "db": "survey_bricks_dr10_south_external",
      "column": "band",
      "filters": ["W1"]
    },
    {
      "telescope": "Euclid",
      "db": "sedm_mosaic_product",
      "column": "filter_name",
      "filters": ["DECAM_g", "MEGACAM_r"]
    },
    {
      "telescope": "WISE",
      "db": "wise_wise_allwise_p3am_cdd",
      "column": "band",
      "filters": ["1"]
    }
  ],
  "coordinations": [
    { "ra": 16.763091504406475, "dec": 31.238707489166874 },
    { "ra": 18.763091504406475, "dec": 30.481618203879762 },
    { "ra": 18.763091504406475, "dec": 30.238707489166874 },
    { "ra": 16.607310030651888, "dec": 30.238707489166874 }
  ]
}
```

#### 5.1.3 获取图像详情

- **URL**：`GET /api/image/:id`
- **响应**：
  ```json
  {
    "id": "string",
    "url": "string",
    "wcs": { ... },
    "objects": [{ ... }]
  }
  ```

### 5.2 参数与响应格式

- 所有 API 使用 JSON 格式
- 错误响应统一格式：
  ```json
  {
    "error": "Error message",
    "code": 400
  }
  ```

---

## 6. 模块划分建议（组件化结构）

- **components/**
  - `CelestialSphere/`：3D 天区球体组件
  - `SelectionBox/`：天区选择框组件
- **views/**
  - `AstroImageViewer/`：JSP 图像展示页面
  - `Example/`：示例页面
  - `Layout/`：整体布局、Header、Menu
- **services/**
  - `mockDataService.ts`：模拟/实际数据服务
- **utils/**
  - `coordinateUtils.ts`：天文坐标转换
  - `raycastUtils.ts`：3D 选区射线检测
  - `axios.ts`：HTTP 请求封装
- **hooks/**：自定义 hooks（如 useSelector）
- **constants/**、**types/**：常量与类型定义

> 建议所有页面和核心交互均以组件化方式实现，便于复用和维护。

---

## 7. 可拓展性设计

- **数据源扩展**：API 层抽象，支持切换/新增天文数据源（如 Gaia、SDSS、LAMOST 等）
- **图表/可视化扩展**：组件化设计，便于新增如光谱图、时序图等可视化模块
- **投影算法扩展**：JSP 投影参数与算法可配置，支持多种天区投影方式
- **国际化支持**：预留 i18n 方案，便于多语言切换
- **插件机制**：可考虑引入插件机制，支持第三方功能扩展
- **移动端适配**：响应式布局，便于未来支持移动端访问

---

## 8. 其他建议

- 代码风格统一，建议采用 ESLint + Prettier
- 单元测试与端到端测试（如 Jest、Cypress）
- 完善的开发文档与接口文档
- 版本管理与持续集成（CI/CD）
