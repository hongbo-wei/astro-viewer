# WCS (World Coordinate System) 升级指南

## 当前状态

- ✅ 已实现基本的WCS坐标转换功能
- ✅ 使用标准的天文坐标系统
- ✅ 支持球面坐标到RA/Dec的转换
- ✅ 添加了坐标验证功能

## 推荐的专业WCS库

### 1. JS9 (强烈推荐)

**权威性**: 由哈佛-史密森天体物理中心开发
**最新版本**: 3.9.0 (2024年12月)
**优势**:

- 完整的FITS文件支持
- 标准的WCS实现
- 多种投影类型 (TAN, SIN, ARC, etc.)
- 内置的坐标转换功能
- 遵循IAU标准

```bash
# 安装
npm install js9

# 使用示例
import JS9 from 'js9'

// 创建显示实例
const display = new JS9.Display()

// 坐标转换
const worldCoords = display.PixToWCS(x, y)
const pixelCoords = display.WCSToPixel(ra, dec)
```

### 2. JSFitsIO (FITS专用)

**用途**: 读取FITS文件头中的WCS信息
**最新版本**: 1.1.15 (2024年5月)
**优势**:

- 专门处理FITS格式
- 提取WCS头信息
- 支持多种FITS扩展

```bash
# 安装
npm install jsfitsio

# 使用示例
import { FitsFile } from 'jsfitsio'

// 读取FITS文件
const fits = new FitsFile(buffer)
const wcsInfo = fits.getWCS()
```

### 3. Astronomy-Bundle (天文计算)

**用途**: 通用天文计算
**最新版本**: 7.7.7 (2024年4月)
**优势**:

- 基于Jean Meeus的《天文算法》
- 支持多种天文坐标系统
- 包含时间转换功能

## 升级建议

### 阶段1: 立即改进

1. ✅ 使用标准的球面坐标转换
2. ✅ 添加坐标验证
3. ✅ 改进错误处理

### 阶段2: 集成专业库 (推荐)

1. **安装JS9**:

   ```bash
   npm install js9
   ```

2. **替换现有的坐标转换**:

   ```typescript
   // 替换现有的 sphereToRaDecStandard
   import JS9 from 'js9'

   const display = new JS9.Display()
   const coords = display.PixToWCS(x, y)
   ```

3. **添加FITS支持**:
   ```typescript
   // 支持从FITS文件读取WCS信息
   display.LoadFITS(fitsData)
   ```

### 阶段3: 高级功能

1. **多投影类型支持**
2. **时间坐标系统**
3. **光谱坐标系统**
4. **误差传播**

## 投影类型支持

### 当前实现

- 仅支持简单的球面投影

### 标准WCS投影 (推荐使用JS9)

1. **TAN** (Gnomonic) - 最常用
2. **SIN** (Orthographic) - 射电天文学
3. **ARC** (Zenithal equidistant) - 全天图
4. **STG** (Stereographic) - 极地投影
5. **CAR** (Plate carrée) - 简单柱面投影

## 坐标系统

### 当前支持

- 赤道坐标系 (RA/Dec)

### 扩展支持 (使用专业库)

1. **银河坐标系** (l, b)
2. **黄道坐标系** (λ, β)
3. **地平坐标系** (Az, Alt)
4. **超银河坐标系** (SGL, SGB)

## 实施优先级

### 高优先级

1. **集成JS9** - 获得最权威的WCS支持
2. **FITS文件支持** - 从真实的天文数据中读取WCS

### 中优先级

1. **多投影类型** - 支持不同的观测需求
2. **坐标系统转换** - 支持多种天文坐标系统

### 低优先级

1. **时间坐标** - 支持时间变化的观测
2. **光谱坐标** - 支持光谱数据

## 代码示例

### 使用JS9的标准WCS转换

```typescript
import JS9 from 'js9'

class AstronomicalWCS {
  private display: any

  constructor() {
    this.display = new JS9.Display()
  }

  // 加载FITS文件并获取WCS信息
  loadFITS(fitsData: ArrayBuffer) {
    this.display.LoadFITS(fitsData)
    return this.display.getWCS()
  }

  // 标准的坐标转换
  pixelToWorld(x: number, y: number) {
    return this.display.PixToWCS(x, y)
  }

  worldToPixel(ra: number, dec: number) {
    return this.display.WCSToPixel(ra, dec)
  }
}
```

## 总结

**当前实现**: 基本功能已满足演示需求
**推荐升级**: 使用JS9获得完整的专业WCS支持
**长期目标**: 支持完整的天文数据处理流程

使用专业的WCS库不仅能提高精度，还能确保与国际天文标准的兼容性。
