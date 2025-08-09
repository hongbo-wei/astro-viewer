# 像素到天球坐标（RA/Dec）转换与相关公式说明

## 1. 像素2D到3D球面投射

- 主要负责文件：
  - `src/utils/raycastUtils.ts`：包含 pixelToRaDec 等像素到球面坐标转换函数。
  - `src/components/CelestialSphere/index.tsx`：实现 Three.js 射线投射、球面交互。
  - `src/components/SelectionBox/index.tsx`：选区像素坐标到 RA/Dec 的批量转换与范围限制。

### 1.1 基本流程

1. 获取鼠标在图像容器内的像素坐标 (x, y)。
2. 将像素坐标归一化到 WebGL 标准坐标系 [-1, 1]：

  ```ts
  x_ndc = (x / width) * 2 - 1
  y_ndc = -((y / height) * 2 - 1)
  ```
  > 解释：这是WebGL/OpenGL标准的屏幕像素到归一化设备坐标（NDC）的转换公式。NDC范围为[-1, 1]，是三维图形渲染的业界通用做法。

3. 使用 Three.js 的 Raycaster 从相机 (camera) 发射射线，计算与球体 (celestial sphere) 的交点。
4. 得到交点的三维坐标 (x, y, z)，再转换为球面坐标 (θ, φ)。

### 1.2 公式

- 球面坐标转换：

  ```ts
  r = sqrt(x^2 + y^2 + z^2)
  θ = arccos(z / r)
  φ = atan2(y, x)
  ```
  > 解释：这是经典的三维笛卡尔坐标到球面坐标（半径r，极角θ，方位角φ）的转换公式，广泛用于物理、天文和计算机图形学。

- 赤经 (RA) 和赤纬 (Dec)：


  ```ts
  RA = φ * 180 / π
  if (RA < 0) RA += 360 // 保证RA在0~360度之间
  Dec = 90 - θ * 180 / π
  ```

  > 解释：这是天文学中将球面坐标（θ, φ）转换为赤道坐标系（RA, Dec）的标准公式。RA（赤经）为球面方位角，Dec（赤纬）为极角与天球赤道的夹角。RA 应始终保证在 0~360 度范围内，因此需加上 `if (RA < 0) RA += 360`。赤经RA有时用小时制，`RA_hours = φ × (180° / π) / 15`。此公式为业界标准。

## 2. WCS（World Coordinate System）转换规则

- 主要负责文件：
  - `src/utils/wcs.ts`（如有）：实现 FITS WCS 头信息解析与像素-天球坐标转换。
  - `src/utils/coordinateUtils.ts`：可能包含通用坐标变换工具。

- 公式（线性近似）：

  ```ts
  Δx = x - CRPIX1
  Δy = y - CRPIX2
  RA  = CRVAL1 + CD1_1 * Δx + CD1_2 * Δy
  Dec = CRVAL2 + CD2_1 * Δx + CD2_2 * Δy
  ```
  > 解释：这是FITS（Flexible Image Transport System）天文图像文件的WCS（世界坐标系统）线性近似转换公式。它将像素坐标通过线性变换映射到天球坐标（RA/Dec）。该公式为天文数据处理的国际标准，详见FITS/WCS官方文档和astropy.wcs实现。

## 3. 代码实现要点

- 主要负责文件：
  - `src/utils/raycastUtils.ts`：pixelToRaDec 实现。
  - `src/components/SelectionBox/index.tsx`：选区与范围限制逻辑。
  - `src/components/CelestialSphere/index.tsx`：交互式天球渲染与坐标获取。

## 4. 望远镜波段/滤镜与角度范围

- 主要负责文件：
  - `src/views/AstroImageViewer/index.tsx`：定义和管理各望远镜的波段/滤镜选项、角度范围（如 initialEuclidFilters、TELESCOPE_RANGES）。
  - `src/components/CelestialSphere/index.tsx`：渲染望远镜覆盖区域。
  - `src/components/MOC/index.tsx`：加载和传递 MOC 区域数据。

- 波段/滤镜和角度范围是由查询数据库后记录、计算出来的。建议后期通过数据库/接口动态获取，相关代码应在上述文件实现。

## 5. 数据查询与实际选项

- 主要负责文件：
  - `src/views/AstroImageViewer/index.tsx`：负责调用后端接口获取实际可选项。
  - `src/utils/axios.ts`：如有，负责 API 请求封装。
