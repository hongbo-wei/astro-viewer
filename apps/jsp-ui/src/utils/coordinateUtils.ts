/**
 * 统一的坐标转换工具
 * 避免重复代码，确保坐标转换的一致性
 */

import { sphereToRaDecStandard, validateCoordinates } from './wcs'

export interface SphereCoordinates {
  x: number
  y: number
  z: number
}

export interface ScreenCoordinates {
  x: number
  y: number
}

export interface RaDecCoordinates {
  ra: number
  dec: number
}

export interface SphereCoordinatesWithAngles extends SphereCoordinates {
  phi: number
  theta: number
  ra: number | null
  dec: number | null
}

/**
 * 球面坐标转换为屏幕坐标
 * 使用统一的投影公式
 */
export function sphereToScreen(
  sphereCoords: SphereCoordinates,
  containerWidth: number,
  containerHeight: number,
): ScreenCoordinates {
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  const radius = Math.min(centerX, centerY)

  return {
    x: centerX + sphereCoords.x * radius,
    y: centerY - sphereCoords.y * radius, // Y轴翻转保持一致
  }
}

/**
 * 屏幕坐标转换为球面坐标
 * 逆向转换
 */
export function screenToSphere(
  screenCoords: ScreenCoordinates,
  containerWidth: number,
  containerHeight: number,
): SphereCoordinates | null {
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  const radius = Math.min(centerX, centerY)

  // 标准化到-1到1范围
  const normalizedX = (screenCoords.x - centerX) / radius
  const normalizedY = -(screenCoords.y - centerY) / radius // 反转Y轴

  // 检查是否在球体内
  const distanceFromCenter = Math.sqrt(
    normalizedX * normalizedX + normalizedY * normalizedY,
  )
  if (distanceFromCenter > 1) return null // 在球体外

  // 计算球面上的Z坐标
  const normalizedZ = Math.sqrt(
    Math.max(0, 1 - normalizedX * normalizedX - normalizedY * normalizedY),
  )

  return { x: normalizedX, y: normalizedY, z: normalizedZ }
}

/**
 * 球面坐标转换为RA/Dec坐标
 * 使用标准WCS转换
 */
export function sphereToRaDec(
  sphereCoords: SphereCoordinates,
): RaDecCoordinates | null {
  const coords = sphereToRaDecStandard(
    sphereCoords.x,
    sphereCoords.y,
    sphereCoords.z,
  )
  if (!coords || !validateCoordinates(coords)) {
    // console.warn('生成的坐标无效:', coords)
    return null
  }
  return coords
}

/**
 * 计算球面角度坐标
 */
export function calculateSphereAngles(sphereCoords: SphereCoordinates): {
  phi: number
  theta: number
} {
  const phi = Math.acos(Math.max(-1, Math.min(1, sphereCoords.y))) // 0 到 π
  const theta = Math.atan2(sphereCoords.z, sphereCoords.x) // -π 到 π

  return { phi, theta }
}

/**
 * 创建完整的球面坐标信息
 */
export function createSphereCoordinates(intersectionPoint: {
  x: number
  y: number
  z: number
}): SphereCoordinatesWithAngles {
  // 标准化交点到单位球面
  const length = Math.sqrt(
    intersectionPoint.x ** 2 +
      intersectionPoint.y ** 2 +
      intersectionPoint.z ** 2,
  )
  const normalizedPoint = {
    x: intersectionPoint.x / length,
    y: intersectionPoint.y / length,
    z: intersectionPoint.z / length,
  }

  // 计算球面角度
  const { phi, theta } = calculateSphereAngles(normalizedPoint)

  // 转换为RA/Dec
  const raDec = sphereToRaDec(normalizedPoint)

  return {
    x: normalizedPoint.x,
    y: normalizedPoint.y,
    z: normalizedPoint.z,
    phi,
    theta,
    ra: raDec ? raDec.ra : null,
    dec: raDec ? raDec.dec : null,
  }
}

/**
 * 检查坐标是否在球体内
 */
export function isWithinSphere(
  screenCoords: ScreenCoordinates,
  containerWidth: number,
  containerHeight: number,
): boolean {
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  const radius = Math.min(centerX, centerY)

  const distanceFromCenter = Math.sqrt(
    (screenCoords.x - centerX) ** 2 + (screenCoords.y - centerY) ** 2,
  )

  return distanceFromCenter <= radius
}

/**
 * 调试信息格式化
 */
export function formatDebugInfo(
  sphereCoords: SphereCoordinatesWithAngles,
  screenCoords: ScreenCoordinates,
  containerInfo: { width: number; height: number },
): string {
  return `
坐标转换详情:
- 球面坐标: (${sphereCoords.x.toFixed(4)}, ${sphereCoords.y.toFixed(4)}, ${sphereCoords.z.toFixed(4)})
- 屏幕坐标: (${screenCoords.x.toFixed(1)}, ${screenCoords.y.toFixed(1)})
- RA/Dec: (${sphereCoords.ra !== null ? sphereCoords.ra.toFixed(3) : 'N/A'}°, ${sphereCoords.dec !== null ? sphereCoords.dec.toFixed(3) : 'N/A'}°)
- 球面角度: φ=${sphereCoords.phi.toFixed(4)}, θ=${sphereCoords.theta.toFixed(4)}
- 容器尺寸: ${containerInfo.width}×${containerInfo.height}
  `.trim()
}
