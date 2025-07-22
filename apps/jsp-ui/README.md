# JSP-UI - Astronomical Image Viewer

A modern web application for interactive astronomical data exploration featuring 3D celestial sphere visualization, multi-telescope data integration, and real-time coordinate-based image processing.

## ✨ Key Features

### 🌐 3D Celestial Sphere Visualization
- **Interactive 3D Universe**: Navigate through a Three.js-powered celestial sphere from the inside
- **Real-time Raycast Detection**: Precise selection using 3D mouse interaction
- **Coordinate System Integration**: Seamless conversion between pixel, 3D sphere, and RA/Dec coordinates
- **Smooth Camera Controls**: OrbitControls with constrained movement within the sphere

### 🔭 Multi-Telescope Data Integration
- **Comprehensive Telescope Support**: Euclid, WISE, DESI, and 2MASS telescopes
- **Dynamic Filter Management**: Each telescope shows its specific available filters
- **Simultaneous Multi-telescope Selection**: Query multiple data sources concurrently
- **Coordinated Data Retrieval**: Unified interface for diverse astronomical surveys

### 🎯 Advanced Selection & Processing
- **Interactive Region Selection**: Click and drag to define regions of interest on the 3D sphere
- **Precise Coordinate Conversion**: Accurate transformation from screen coordinates to astronomical coordinates
- **FITS Data Processing**: Automatic conversion of FITS files to web-compatible formats

### 🔍 Enhanced User Experience
- **Real-time Zoom View**: 5x magnified view with crosshair positioning
- **Responsive Design**: Adaptive layout for desktop, tablet, and mobile devices
- **Interactive Image Gallery**: Browse and analyze retrieved astronomical images
- **Intuitive Controls**: User-friendly interface with contextual help

## 💡 Technical Highlights

### Advanced 3D Visualization
- **Hardware-accelerated WebGL**: High-performance 3D rendering with optimized shaders
- **Precision Raycasting**: Accurate 3D mouse interaction for celestial object selection
- **Constrained Camera Movement**: Smooth navigation locked within the celestial sphere
- **Responsive Rendering**: Adaptive quality based on device capabilities

### Coordinate System Mastery
- **Multi-system Integration**: Seamless conversion between pixel, 3D Cartesian, and celestial coordinates
- **Real-time Transformation**: Live RA/Dec coordinate updates during interaction
- **Boundary Validation**: Intelligent constraint checking for valid celestial regions
- **Precision Algorithms**: Custom mathematical functions for accurate coordinate conversion

### Performance Optimizations
- **Efficient Rendering**: Optimized Three.js scene management and texture handling
- **Smart Caching**: Intelligent data caching for improved response times
- **Lazy Loading**: Progressive loading of large astronomical datasets
- **Memory Management**: Proper cleanup of WebGL resources and event listeners

### User Experience Innovation
- **Intuitive 3D Navigation**: Natural interaction paradigms for 3D celestial exploration
- **Real-time Feedback**: Immediate visual confirmation of user actions
- **Contextual Help**: Built-in guidance for complex astronomical operations
- **Responsive Design**: Seamless experience across all device types

## 🔧 Development Workflow

### Monorepo Architecture
This application is part of the Joint Survey Processing (JSP) frontend monorepo:
- **Package Management**: pnpm workspaces for efficient dependency management
- **Build System**: Turbo for optimized build orchestration
- **Code Quality**: Shared ESLint and TypeScript configurations
- **Component Library**: Reusable UI components across projects

### Code Quality & Standards
- **TypeScript First**: Full type safety throughout the application
- **Component Testing**: Comprehensive testing for critical UI components
- **Code Formatting**: Automated formatting with Prettier
- **Git Hooks**: Pre-commit quality checks and validation

### Performance Monitoring
- **Build Analysis**: Bundle size optimization and analysis
- **Runtime Performance**: Three.js performance profiling
- **Memory Usage**: WebGL resource monitoring
- **User Experience**: Core Web Vitals tracking

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **pnpm** v8.15.4 (recommended package manager)

### Installation

1. **Install pnpm globally**
   ```bash
   npm install -g pnpm
   ```

2. **Navigate to the project directory**
   ```bash
   cd apps/jsp-ui
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Start the development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally  
- `pnpm run lint` - Run ESLint for code quality checks
- `pnpm run check` - Run TypeScript type checking

### Project Structure Overview

```
apps/jsp-ui/
├── src/
│   ├── components/
│   │   ├── CelestialSphere/     # 3D visualization component
│   │   └── TelescopeCoverage.tsx # Telescope coverage display
│   ├── views/
│   │   └── AstroImageViewer/    # Main application view
│   ├── utils/
│   │   ├── axios.ts             # HTTP client setup
│   │   └── util.ts              # Utility functions
│   ├── types/                   # TypeScript type definitions
│   ├── hooks/                   # Custom React hooks
│   └── constants/               # Application constants
├── public/                      # Static assets
├── ppt/                         # Project presentations
└── Three.js学习指南.ipynb        # Three.js learning guide
```



## 启动本地 Node 服务

server.cjs 是本地 Node.js 服务脚本，通常用于：

- 提供本地 API/mock 数据接口，支持前端开发和调试
- 处理前端无法直接访问的文件（如 FITS 数据、跨域资源等）
- 作为前后端联调的本地后端服务

在项目根目录下执行以下命令启动服务：

```bash
node server.cjs
```

如需后台运行（不阻塞终端），可用：

```bash
node server.cjs &
```

项目页面在src/views目录下，可直接修改AstroImageViewer下index.tsx文件

## Creating a New App

To create a new app in this monorepo:

```bash
turbo gen workspace --copy
```

This will scaffold a new workspace by copying from an existing template.

## Project Structure

```
apps/jsp-ui/
├── src/
│   ├── views/
│   │   └── AstroImageViewer/
│   │       ├── index.tsx
│   │       └── index.module.scss
│   └── ...
├── package.json
└── README.md
```

## 📚 Learning Resources

### Project Documentation
- **System Architecture**: Detailed technical specifications in `SYSTEM_ARCHITECTURE.md`
- **Three.js Guide**: Interactive learning notebook in `Three.js学习指南.ipynb`
- **API Documentation**: Complete API reference for all components
- **Presentation Materials**: Project overview slides in `ppt/` directory

### Development Learning Path
1. **Three.js Fundamentals**: 3D graphics and WebGL basics
2. **Astronomical Coordinates**: RA/Dec system and conversions
3. **React + TypeScript**: Modern frontend development patterns
4. **Performance Optimization**: WebGL and React optimization techniques

## 🤝 Contributing

### Development Environment
- Ensure Node.js 18+ and pnpm v8.15.4 are installed
- Follow the existing code style and TypeScript conventions
- Run tests and linting before submitting changes
- Update documentation for new features

### Code Structure Guidelines
- Keep components focused and reusable
- Use TypeScript interfaces for all props and state
- Implement proper error handling and loading states
- Optimize for performance, especially in 3D rendering code

## FAQ: Console.log 输出在哪里？

- 前端（React/浏览器）代码中的 `console.log` 只会显示在浏览器开发者工具的 Console 面板，不会显示在 VS Code 的 TERMINAL。
- 只有后端（Node.js）代码中的 `console.log` 才会显示在 VS Code 的 TERMINAL。
- 如果你想让前端数据出现在 VS Code 终端，需要将数据通过 HTTP 请求发送到后端，由后端打印。

**示例：前端如何让数据出现在 VS Code 终端？**

1. 前端调用 API：
   ```js
   fetch('/api/log', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload)
   })
   ```
2. 后端收到后：
   ```js
   app.post('/api/log', (req, res) => {
     console.log('前端传来的数据:', req.body)
     res.sendStatus(200)
   })
   ```

这样你就能在 VS Code 终端看到前端传来的数据了。

## 📄 License

This project is part of the Joint Survey Processing (JSP) initiative for astronomical data visualization and analysis.

---

*Built with ❤️ for the astronomical community*
