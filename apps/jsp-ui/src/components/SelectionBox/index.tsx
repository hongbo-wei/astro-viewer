import React from 'react'
import type * as THREE from 'three'

import { pixelToRaDec } from '@/utils/raycastUtils'

import styles from './index.module.scss'

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
  getRaDecByRaycast: (
    x: number,
    y: number,
    containerRect: DOMRect,
    camera: THREE.PerspectiveCamera,
    sphere: THREE.Mesh,
  ) => { ra: number; dec: number } | null
  camera: THREE.PerspectiveCamera
  sphere: THREE.Mesh
  onChange?: (corners: { ra: number; dec: number }[], warning: boolean) => void
  raLimit?: number
  decLimit?: number
}

const SelectionBox: React.FC<SelectionBoxProps> = ({
  start,
  end,
  className,
  containerRect,
  getRaDecByRaycast,
  camera,
  sphere,
  onChange,
  raLimit,
  decLimit,
}) => {
  const left = Math.min(start.x, end.x)
  const top = Math.min(start.y, end.y)
  const width = Math.abs(end.x - start.x)
  const height = Math.abs(end.y - start.y)

  // 用 useMemo 计算 corners/center，避免副作用死循环
  // 统一调用 pixelToRaDec，保证参数来源一致
  const containerRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    // 兼容原有 containerRect 传递方式，自动挂载 ref
    if (
      containerRect &&
      containerRect instanceof DOMRect &&
      containerRef.current == null
    ) {
      // 尝试通过 sphere.parentElement 查找 DOM
      if ((sphere as any)?.parent?.element) {
        containerRef.current = (sphere as any).parent.element as HTMLElement
      }
    }
  }, [containerRect, sphere])
  const convert = React.useCallback(
    (x: number, y: number) => {
      // 优先用传入的 containerRef
      if (containerRef.current) {
        return pixelToRaDec(x, y, containerRef, camera, sphere)
      }
      // 兼容老逻辑
      return getRaDecByRaycast(x, y, containerRect, camera, sphere)
    },
    [containerRef, camera, sphere, containerRect, getRaDecByRaycast],
  )
  const fallback = convert(start.x, start.y) || { ra: 0, dec: 0 }
  const minX = left
  const maxX = left + width
  const minY = top
  const maxY = top + height
  const rawCorners = [
    convert(minX, minY) || fallback, // Top-left
    convert(maxX, minY) || fallback, // Top-right
    convert(maxX, maxY) || fallback, // Bottom-right
    convert(minX, maxY) || fallback, // Bottom-left
  ]
  const centerX = (start.x + end.x) / 2
  const centerY = (start.y + end.y) / 2
  const centerRaDec = convert(centerX, centerY)
  // 限制范围逻辑
  let warning = false
  let limitedCorners = rawCorners
  if (typeof raLimit === 'number' || typeof decLimit === 'number') {
    const startCorner = convert(start.x, start.y)
    if (startCorner) {
      let centerRA = startCorner.ra
      const centerDec = startCorner.dec
      const normRA = (ra: number) => (ra < 0 ? ra + 360 : ra)
      centerRA = normRA(centerRA)
      let raMin = centerRA - (raLimit ?? 9999)
      let raMax = centerRA + (raLimit ?? 9999)
      if (raMin < 0) raMin += 360
      if (raMax >= 360) raMax -= 360
      const decMin = centerDec - (decLimit ?? 9999)
      const decMax = centerDec + (decLimit ?? 9999)
      limitedCorners = rawCorners.map((c) => {
        let ra = normRA(c.ra)
        let dec = c.dec
        let inRaRange = false
        if (raMin < raMax) {
          inRaRange = ra >= raMin && ra <= raMax
        } else {
          inRaRange = ra >= raMin || ra <= raMax
        }
        const inDecRange = dec >= decMin && dec <= decMax
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

  // 只在 limitedCorners/warning 变化时调用 onChange，避免死循环
  const prevRef = React.useRef<{ corners: any; warning: boolean }>()
  React.useEffect(() => {
    // 输出调试信息
    // console.log('[SelectionBox] 四角:', limitedCorners, '中心:', {
    //   x: centerX,
    //   y: centerY,
    //   raDec: centerRaDec,
    // })
    if (!onChange) return
    const prev = prevRef.current
    const cornersChanged =
      !prev || JSON.stringify(prev.corners) !== JSON.stringify(limitedCorners)
    const warningChanged = !prev || prev.warning !== warning
    if (cornersChanged || warningChanged) {
      onChange(limitedCorners, warning)
      prevRef.current = { corners: limitedCorners, warning }
    }
  }, [limitedCorners, warning, centerX, centerY, centerRaDec, onChange])

  return (
    <div
      className={
        className ? `${styles.selectionBox} ${className}` : styles.selectionBox
      }
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  )
}

export default SelectionBox
