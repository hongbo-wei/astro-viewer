import * as THREE from 'three'

import { createSphereCoordinates } from './coordinateUtils'

/**
 * 根据像素点、容器rect、相机和球体mesh，返回球面交点的RA/Dec
 * @param x 像素x
 * @param y 像素y
 * @param containerRect DOMRect
 * @param camera THREE.PerspectiveCamera
 * @param sphere THREE.Mesh
 * @returns { ra: number, dec: number } | null
 */
export function getRaDecByRaycast(
  x: number,
  y: number,
  containerRect: DOMRect,
  camera: THREE.PerspectiveCamera,
  sphere: THREE.Mesh,
): { ra: number; dec: number } | null {
  // 将像素坐标标准化到-1到1
  const mouse = new THREE.Vector2()
  mouse.x = ((x - containerRect.left) / containerRect.width) * 2 - 1
  mouse.y = -((y - containerRect.top) / containerRect.height) * 2 + 1

  // 创建射线投射器
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)

  // 检测与球体的交点
  const intersects = raycaster.intersectObject(sphere)
  if (intersects.length > 0 && intersects[0]) {
    const intersectionPoint = intersects[0].point
    const sphereCoords = createSphereCoordinates(intersectionPoint)
    if (
      sphereCoords &&
      typeof sphereCoords.ra === 'number' &&
      typeof sphereCoords.dec === 'number'
    ) {
      return { ra: sphereCoords.ra, dec: sphereCoords.dec }
    }
  }
  return null
}

/**
 * 统一像素转 RA/Dec 工具函数
 * @param x 像素x（相对于 container 左上角）
 * @param y 像素y（相对于 container 左上角）
 * @param containerRef 容器 ref（如 mainImageRef 或 mountRef）
 * @param camera THREE.PerspectiveCamera
 * @param sphere THREE.Mesh
 * @returns { ra: number, dec: number } | null
 */
export function pixelToRaDec(
  x: number,
  y: number,
  containerRef: React.RefObject<HTMLElement>,
  camera: THREE.PerspectiveCamera,
  sphere: THREE.Mesh,
): { ra: number; dec: number } | null {
  if (!containerRef.current) return null
  const rect = containerRef.current.getBoundingClientRect()
  return getRaDecByRaycast(x, y, rect, camera, sphere)
}
