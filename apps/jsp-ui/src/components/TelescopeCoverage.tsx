// 望远镜覆盖范围可视化组件
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { TELESCOPE_RANGES } from '../data/telescopeRanges'

interface TelescopeCoverageProps {
  scene: THREE.Scene
  selectedTelescopes: string[]
  onCoverageUpdate?: (coverage: any) => void
}

// 望远镜主题色配置
const TELESCOPE_COLORS = {
  euclid: 0x4a90e2, // 蓝色
  desi: 0x50e3c2, // 青色
  twomass: 0xf5a623, // 橙色
  wise: 0xd0021b, // 红色
  all: 0xffffff, // 白色
}

// 透明度配置
const COVERAGE_OPACITY = 0.15
const SELECTION_OPACITY = 0.3

export const TelescopeCoverage: React.FC<TelescopeCoverageProps> = ({
  scene,
  selectedTelescopes,
  onCoverageUpdate,
}) => {
  const coverageGroupRef = useRef<THREE.Group>(new THREE.Group())
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map())

  // 创建覆盖范围几何体
  const createCoverageGeometry = (telescope: string) => {
    const range = TELESCOPE_RANGES[telescope.toLowerCase()]
    if (!range) return null

    // 将RA/Dec范围转换为球面坐标
    const raMin = (range.ra.min * Math.PI) / 180
    const raMax = (range.ra.max * Math.PI) / 180
    const decMin = (range.dec.min * Math.PI) / 180
    const decMax = (range.dec.max * Math.PI) / 180

    // 创建球面扇形几何体
    const geometry = new THREE.SphereGeometry(
      0.998, // 略小于天球半径，避免Z-fighting
      64,
      32,
      raMin,
      raMax - raMin,
      Math.PI / 2 - decMax,
      decMax - decMin,
    )

    return geometry
  }

  // 创建覆盖范围材质
  const createCoverageMaterial = (telescope: string, isSelected: boolean) => {
    const color =
      TELESCOPE_COLORS[
        telescope.toLowerCase() as keyof typeof TELESCOPE_COLORS
      ] || 0xffffff
    const opacity = isSelected ? SELECTION_OPACITY : COVERAGE_OPACITY

    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.BackSide, // 内表面渲染
      depthWrite: false, // 避免透明度问题
      blending: THREE.AdditiveBlending, // 加法混合，重叠区域会更亮
    })
  }

  // 更新覆盖范围显示
  useEffect(() => {
    // 清除现有的覆盖范围
    coverageGroupRef.current.clear()
    meshesRef.current.clear()

    // 为每个望远镜创建覆盖范围
    Object.keys(TELESCOPE_RANGES).forEach((telescope) => {
      if (telescope === 'all') return // 跳过综合范围

      const geometry = createCoverageGeometry(telescope)
      if (!geometry) return

      const isSelected = selectedTelescopes.includes(telescope)
      const material = createCoverageMaterial(telescope, isSelected)
      const mesh = new THREE.Mesh(geometry, material)

      // 设置渲染顺序，确保透明度正确
      mesh.renderOrder = isSelected ? 2 : 1

      meshesRef.current.set(telescope, mesh)
      coverageGroupRef.current.add(mesh)
    })

    // 将覆盖范围组添加到场景
    scene.add(coverageGroupRef.current)

    // 通知父组件覆盖范围更新
    if (onCoverageUpdate) {
      onCoverageUpdate({
        telescopes: selectedTelescopes,
        coverage: Array.from(meshesRef.current.keys()),
      })
    }

    // 清理函数
    return () => {
      coverageGroupRef.current.clear()
      meshesRef.current.forEach((mesh) => {
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose())
        } else {
          mesh.material.dispose()
        }
      })
      meshesRef.current.clear()
    }
  }, [scene, selectedTelescopes])

  return null // 这是一个逻辑组件，不渲染任何DOM
}

// 辅助函数：检查点是否在望远镜覆盖范围内
export const isPointInCoverage = (
  ra: number,
  dec: number,
  telescope: string,
): boolean => {
  const range = TELESCOPE_RANGES[telescope.toLowerCase()]
  if (!range) return false

  return (
    ra >= range.ra.min &&
    ra <= range.ra.max &&
    dec >= range.dec.min &&
    dec <= range.dec.max
  )
}

// 辅助函数：获取选区与望远镜覆盖范围的重叠信息
export const getOverlapInfo = (
  selectionBounds: {
    ra_min: number
    ra_max: number
    dec_min: number
    dec_max: number
  },
  selectedTelescopes: string[],
) => {
  const overlaps: Record<string, { hasOverlap: boolean; coverage: number }> = {}

  selectedTelescopes.forEach((telescope) => {
    const range = TELESCOPE_RANGES[telescope.toLowerCase()]
    if (!range) {
      overlaps[telescope] = { hasOverlap: false, coverage: 0 }
      return
    }

    // 计算重叠区域
    const raOverlap = Math.max(
      0,
      Math.min(selectionBounds.ra_max, range.ra.max) -
        Math.max(selectionBounds.ra_min, range.ra.min),
    )
    const decOverlap = Math.max(
      0,
      Math.min(selectionBounds.dec_max, range.dec.max) -
        Math.max(selectionBounds.dec_min, range.dec.min),
    )

    const hasOverlap = raOverlap > 0 && decOverlap > 0
    const selectionArea =
      (selectionBounds.ra_max - selectionBounds.ra_min) *
      (selectionBounds.dec_max - selectionBounds.dec_min)
    const overlapArea = raOverlap * decOverlap
    const coverage = selectionArea > 0 ? (overlapArea / selectionArea) * 100 : 0

    overlaps[telescope] = { hasOverlap, coverage }
  })

  return overlaps
}

export default TelescopeCoverage
