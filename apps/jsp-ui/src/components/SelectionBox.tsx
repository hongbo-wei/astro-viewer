import React from 'react'

/**
 * SelectionBox 选区组件
 * - 支持选区像素坐标到球面坐标（RA/Dec）转换
 * - 支持 RA/Dec 范围限制（如 RA≤2°，Dec≤1°），超限自动截断选区
 * - 通过 onChange 回调返回四角坐标和 warning（是否发生截断）
 *
 * Props:
 *   start/end: 选区起止像素坐标
 *   containerRect: 容器 DOMRect，用于归一化坐标
 *   sphereToRaDec: 像素归一化坐标转 RA/Dec 的函数
 *   raLimit/decLimit: 限制最大 RA/Dec 范围（单位：度）
 *   onChange: (corners, warning) => void，返回四角 RA/Dec 和是否截断
 */

interface SelectionBoxProps {
  start: { x: number; y: number }
  end: { x: number; y: number }
  className?: string
  containerRect: DOMRect
  sphereToRaDec: (x: number, y: number, z: number) => { ra: number; dec: number }
  onChange?: (corners: { ra: number; dec: number }[], warning: boolean) => void
  raLimit?: number
  decLimit?: number
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ start, end, className, containerRect, sphereToRaDec, onChange, raLimit, decLimit }) => {
  const left = Math.min(start.x, end.x)
  const top = Math.min(start.y, end.y)
  const width = Math.abs(end.x - start.x)
  const height = Math.abs(end.y - start.y)

  // 坐标转换与范围限制逻辑
  // 允许选区在整个containerRect范围内画框，超出球面时返回null
  React.useEffect(() => {
    if (!containerRect || !sphereToRaDec) return
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2
    const radius = Math.min(centerX, centerY)
    const minX = left
    const maxX = left + width
    const minY = top
    const maxY = top + height
    // 转为球面归一化坐标
    // 横纵分别归一化，允许画框覆盖整个containerRect
    const norm = (x: number, y: number): [number, number] => [
      (x - centerX) / centerX,
      -(y - centerY) / centerY
    ]
    // 四角球面坐标转 RA/Dec，超出球面返回null
    const convert = (x: number, y: number): { ra: number; dec: number } | null => {
      const [nx, ny] = norm(x, y)
      if (typeof nx !== 'number' || typeof ny !== 'number') return null
      if (nx * nx + ny * ny > 1) return null
      const z = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
      return sphereToRaDec(nx, ny, z)
    }
    // 健壮性处理：如有角点为null，fallback为start点的球面坐标
    const fallback = convert(start.x, start.y) || { ra: 0, dec: 0 }
    let corners: Array<{ ra: number; dec: number }> = [
      convert(minX, minY) || fallback, // Top-left
      convert(maxX, minY) || fallback, // Top-right
      convert(maxX, maxY) || fallback, // Bottom-right
      convert(minX, maxY) || fallback, // Bottom-left
    ]
    let warning = false
    let limitedCorners = corners
    if (
      typeof raLimit === 'number' || typeof decLimit === 'number'
    ) {
      // 以初始点为中心，限制RA/Dec范围
      const startCorner = convert(start.x, start.y)
      if (startCorner) {
        let centerRA = startCorner.ra
        let centerDec = startCorner.dec
        const normRA = (ra: number) => (ra < 0 ? ra + 360 : ra)
        centerRA = normRA(centerRA)
        let raMin = centerRA - (raLimit ?? 9999)
        let raMax = centerRA + (raLimit ?? 9999)
        if (raMin < 0) raMin += 360
        if (raMax >= 360) raMax -= 360
        let decMin = centerDec - (decLimit ?? 9999)
        let decMax = centerDec + (decLimit ?? 9999)
        limitedCorners = corners.map((c) => {
          let ra = normRA(c.ra)
          let dec = c.dec
          let inRaRange = false
          if (raMin < raMax) {
            inRaRange = ra >= raMin && ra <= raMax
          } else {
            inRaRange = ra >= raMin || ra <= raMax
          }
          let inDecRange = dec >= decMin && dec <= decMax
          if (!inRaRange || !inDecRange) {
            warning = true
            if (!inRaRange) {
              if (raMin < raMax) {
                ra = ra < raMin ? raMin : ra > raMax ? raMax : ra
              } else {
                if (ra > raMax && ra < raMin) {
                  const dMin = (raMin - ra + 360) % 360
                  const dMax = (ra - raMax + 360) % 360
                  ra = dMin < dMax ? raMin : raMax
                }
              }
            }
            if (!inDecRange) {
              dec = dec < decMin ? decMin : dec > decMax ? decMax : dec
            }
          }
          if (c.ra < 0) ra -= 360
          return { ra, dec }
        })
      }
    }
    if (onChange) onChange(limitedCorners, warning)
  }, [left, top, width, height, containerRect, sphereToRaDec, onChange, raLimit, decLimit])

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        pointerEvents: 'none',
      }}
    />
  )
}

export default SelectionBox
