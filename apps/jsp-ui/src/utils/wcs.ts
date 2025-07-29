/**
 * 世界坐标系统 (WCS) 工具库
 * 基于国际天文联盟（IAU）标准的坐标转换
 *
 * 推荐使用JS9库来获得最权威的WCS支持
 * JS9是由哈佛-史密森天体物理中心开发的专业天文图像显示库
 *
 * 使用方法：
 * 1. 安装JS9: npm install js9
 * 2. 使用JS9的WCS功能进行坐标转换
 */

// 临时实现 - 建议替换为JS9的WCS功能
export interface WCSCoordinates {
  ra: number // 赤经（度）
  dec: number // 赤纬（度）
}

export interface PixelCoordinates {
  x: number
  y: number
}

export interface WCSTransform {
  // WCS变换矩阵参数
  crpix1: number // 参考像素 X
  crpix2: number // 参考像素 Y
  crval1: number // 参考值 RA
  crval2: number // 参考值 Dec
  cd1_1: number // 变换矩阵元素
  cd1_2: number
  cd2_1: number
  cd2_2: number
  ctype1: string // 坐标类型 (如 'RA---TAN')
  ctype2: string // 坐标类型 (如 'DEC--TAN')

  // SIP正向畸变模型的核心参数
  a_order: number // SIP多项式阶数
  b_order: number // SIP多项式阶数

  // 每像素在 RA/DEC方向的角度大小, 单位度/像素
  cdelt1: number
  cdelt2: number
}

/**
 * 标准的WCS坐标转换类
 *
 * 注意：这是一个简化实现，用于演示
 * 生产环境建议使用JS9库的WCS功能
 */
export class StandardWCS {
  private transform: WCSTransform

  constructor(transform: WCSTransform) {
    this.transform = transform
  }

  /**
   * 将像素坐标转换为世界坐标（RA/Dec）
   * 使用标准的TAN（gnomonic）投影
   */
  pixelToWorld(pixel: PixelCoordinates): WCSCoordinates {
    const { crpix1, crpix2, crval1, crval2, cd1_1, cd1_2, cd2_1, cd2_2 } =
      this.transform

    // 计算相对于参考像素的偏移
    const dx = pixel.x - crpix1
    const dy = pixel.y - crpix2

    // 应用CD矩阵变换
    const xi = cd1_1 * dx + cd1_2 * dy
    const eta = cd2_1 * dx + cd2_2 * dy

    // 转换为弧度
    const xiRad = (xi * Math.PI) / 180
    const etaRad = (eta * Math.PI) / 180

    // TAN投影逆变换
    const crval1Rad = (crval1 * Math.PI) / 180
    const crval2Rad = (crval2 * Math.PI) / 180

    const rho = Math.sqrt(xiRad * xiRad + etaRad * etaRad)
    const c = Math.atan(rho)

    const sinc = Math.sin(c)
    const cosc = Math.cos(c)
    const sinDec0 = Math.sin(crval2Rad)
    const cosDec0 = Math.cos(crval2Rad)

    const dec = Math.asin(cosc * sinDec0 + (etaRad * sinc * cosDec0) / rho)
    const ra =
      crval1Rad +
      Math.atan2(xiRad * sinc, rho * cosDec0 * cosc - etaRad * sinDec0 * sinc)

    return {
      ra: ((ra * 180) / Math.PI + 360) % 360,
      dec: (dec * 180) / Math.PI,
    }
  }

  /**
   * 将世界坐标（RA/Dec）转换为像素坐标
   */
  worldToPixel(world: WCSCoordinates): PixelCoordinates {
    const { crpix1, crpix2, crval1, crval2, cd1_1, cd1_2, cd2_1, cd2_2 } =
      this.transform

    // 转换为弧度
    const raRad = (world.ra * Math.PI) / 180
    const decRad = (world.dec * Math.PI) / 180
    const crval1Rad = (crval1 * Math.PI) / 180
    const crval2Rad = (crval2 * Math.PI) / 180

    // TAN投影正变换
    const sinDec = Math.sin(decRad)
    const cosDec = Math.cos(decRad)
    const sinDec0 = Math.sin(crval2Rad)
    const cosDec0 = Math.cos(crval2Rad)
    const dra = raRad - crval1Rad
    const cosDra = Math.cos(dra)
    const sinDra = Math.sin(dra)

    const denominator = sinDec0 * sinDec + cosDec0 * cosDec * cosDra
    const xi = (cosDec * sinDra) / denominator
    const eta = (cosDec0 * sinDec - sinDec0 * cosDec * cosDra) / denominator

    // 转换为度
    const xiDeg = (xi * 180) / Math.PI
    const etaDeg = (eta * 180) / Math.PI

    // 应用CD矩阵逆变换
    const det = cd1_1 * cd2_2 - cd1_2 * cd2_1
    const dx = (cd2_2 * xiDeg - cd1_2 * etaDeg) / det
    const dy = (-cd2_1 * xiDeg + cd1_1 * etaDeg) / det

    return {
      x: dx + crpix1,
      y: dy + crpix2,
    }
  }
}

/**
 * 创建默认的WCS变换
 * 这是一个示例，实际使用时应该从FITS文件头读取WCS信息
 */
export function createDefaultWCS(): StandardWCS {
  const transform: WCSTransform = {
    crpix1: 512, // 参考像素 X (图像中心)
    crpix2: 512, // 参考像素 Y (图像中心)
    crval1: 0, // 参考RA (度)
    crval2: 0, // 参考Dec (度)
    cd1_1: -0.0001, // 度/像素
    cd1_2: 0,
    cd2_1: 0,
    cd2_2: 0.0001, // 度/像素
    ctype1: 'RA---TAN',
    ctype2: 'DEC--TAN',
    a_order: 0, // SIP多项式阶数
    b_order: 0, // SIP多项式阶数
    cdelt1: 0.0001, // 每像素在 RA方向的
    cdelt2: 0.0001, // 每像素在 DEC方向的角度大小
  }

  return new StandardWCS(transform)
}

/**
 * 球面坐标转换为RA/Dec的标准实现
 * 使用标准的天文坐标系统
 */
export function sphereToRaDecStandard(
  x: number,
  y: number,
  z: number,
): WCSCoordinates | null {
  // 标准化到单位球面
  const length = Math.sqrt(x * x + y * y + z * z)
  if (!isFinite(length) || length === 0) return null
  const nx = x / length
  const ny = y / length
  const nz = z / length
  // 防止非法ny
  if (!isFinite(nx) || !isFinite(ny) || !isFinite(nz)) return null
  if (ny < -1 || ny > 1) return null

  // 使用标准的球坐标转换
  // 其中 Y 轴指向北极，X-Z 平面是赤道面
  const dec = Math.asin(ny)
  const ra = Math.atan2(nz, nx)

  return {
    ra: ((ra * 180) / Math.PI + 360) % 360,
    dec: (dec * 180) / Math.PI,
  }
}

/**
 * RA/Dec转换为球面坐标的标准实现
 */
export function raDecToSphereStandard(
  ra: number,
  dec: number,
): { x: number; y: number; z: number } {
  const raRad = (ra * Math.PI) / 180
  const decRad = (dec * Math.PI) / 180

  const cosDec = Math.cos(decRad)

  return {
    x: cosDec * Math.cos(raRad),
    y: Math.sin(decRad),
    z: cosDec * Math.sin(raRad),
  }
}

/**
 * 验证坐标是否有效
 */
export function validateCoordinates(coords: WCSCoordinates): boolean {
  return (
    coords.ra >= 0 && coords.ra < 360 && coords.dec >= -90 && coords.dec <= 90
  )
}

/**
 * 格式化坐标为标准的天文格式
 */
export function formatCoordinates(coords: WCSCoordinates): string {
  const raHours = coords.ra / 15 // 转换为小时
  const raH = Math.floor(raHours)
  const raM = Math.floor((raHours - raH) * 60)
  const raS = ((raHours - raH) * 60 - raM) * 60

  const decSign = coords.dec >= 0 ? '+' : '-'
  const decAbs = Math.abs(coords.dec)
  const decD = Math.floor(decAbs)
  const decM = Math.floor((decAbs - decD) * 60)
  const decS = ((decAbs - decD) * 60 - decM) * 60

  return `${raH.toString().padStart(2, '0')}h ${raM.toString().padStart(2, '0')}m ${raS.toFixed(2).padStart(5, '0')}s ${decSign}${decD.toString().padStart(2, '0')}° ${decM.toString().padStart(2, '0')}' ${decS.toFixed(1).padStart(4, '0')}"`
}

// 导出推荐的JS9使用说明
export const JS9_USAGE_GUIDE = `
使用JS9库获得最权威的WCS支持：

1. 安装JS9：
   npm install js9

2. 使用JS9的WCS功能：
   import JS9 from 'js9';
   
   // 创建JS9实例
   const js9 = new JS9.Display();
   
   // 加载FITS文件
   js9.Load('image.fits');
   
   // 像素坐标转换为世界坐标
   const worldCoords = js9.PixToWCS(x, y);
   
   // 世界坐标转换为像素坐标
   const pixelCoords = js9.WCSToPixel(ra, dec);

3. JS9的优势：
   - 完整的FITS文件支持
   - 标准的WCS实现
   - 多种投影类型支持
   - 哈佛-史密森天体物理中心维护
   - 遵循IAU标准

推荐在生产环境中使用JS9替代当前的简化实现。
`
