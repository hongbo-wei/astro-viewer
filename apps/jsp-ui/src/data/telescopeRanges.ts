// 望远镜覆盖范围数据
export interface TelescopeRange {
  ra: { min: number; max: number }
  dec: { min: number; max: number }
}

export const TELESCOPE_RANGES: Record<string, TelescopeRange> = {
  euclid: {
    ra: { min: 50.20331821281007, max: 277.8065766313761 },
    dec: { min: -51.76584951599634, max: 69.26502582362194 },
  },
  desi: {
    ra: { min: 0, max: 360 },
    dec: { min: -89.875, max: 35.875 },
  },
  twomass: {
    ra: { min: 0.000008, max: 359.999997 },
    dec: { min: -89.941531, max: 89.957809 },
  },
  wise: {
    ra: { min: 0.44150562027, max: 359.463365090262 },
    dec: { min: -89.20642421106, max: 89.206488975914 },
  },
  all: {
    ra: { min: 0, max: 359.999997 },
    dec: { min: -89.9415, max: 89.9578 },
  },
}

// 检查坐标是否在望远镜覆盖范围内
export function isWithinTelescopeRange(
  ra: number,
  dec: number,
  telescope: string,
): boolean {
  const range = TELESCOPE_RANGES[telescope.toLowerCase()]
  if (!range) return false

  return (
    ra >= range.ra.min &&
    ra <= range.ra.max &&
    dec >= range.dec.min &&
    dec <= range.dec.max
  )
}

// 获取选区与望远镜覆盖范围的交集
export function getSelectionIntersection(
  selectionBounds: {
    ra_min: number
    ra_max: number
    dec_min: number
    dec_max: number
  },
  telescope: string,
): { hasIntersection: boolean; intersectionArea?: number } {
  const range = TELESCOPE_RANGES[telescope.toLowerCase()]
  if (!range) return { hasIntersection: false }

  const ra_overlap = Math.max(
    0,
    Math.min(selectionBounds.ra_max, range.ra.max) -
      Math.max(selectionBounds.ra_min, range.ra.min),
  )
  const dec_overlap = Math.max(
    0,
    Math.min(selectionBounds.dec_max, range.dec.max) -
      Math.max(selectionBounds.dec_min, range.dec.min),
  )

  const hasIntersection = ra_overlap > 0 && dec_overlap > 0
  const intersectionArea = hasIntersection ? ra_overlap * dec_overlap : 0

  return { hasIntersection, intersectionArea }
}

// 获取选区与望远镜覆盖范围的重叠分析
export function getOverlapInfo(
  selectionBounds: {
    ra_min: number
    ra_max: number
    dec_min: number
    dec_max: number
  },
  selectedTelescopes: string[],
) {
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

// 获取多望远镜重叠区域
export function getMultiTelescopeOverlap(telescopes: string[]) {
  if (telescopes.length < 2) return null

  const validTelescopes = telescopes.filter(
    (t) => TELESCOPE_RANGES[t.toLowerCase()],
  )
  if (validTelescopes.length < 2) return null

  // 计算所有望远镜的交集
  const overlapRa = { min: -Infinity, max: Infinity }
  const overlapDec = { min: -Infinity, max: Infinity }

  validTelescopes.forEach((telescope) => {
    const range = TELESCOPE_RANGES[telescope.toLowerCase()]
    if (range) {
      overlapRa.min = Math.max(overlapRa.min, range.ra.min)
      overlapRa.max = Math.min(overlapRa.max, range.ra.max)
      overlapDec.min = Math.max(overlapDec.min, range.dec.min)
      overlapDec.max = Math.min(overlapDec.max, range.dec.max)
    }
  })

  // 检查是否有有效的重叠区域
  const hasOverlap =
    overlapRa.min < overlapRa.max && overlapDec.min < overlapDec.max

  return {
    hasOverlap,
    bounds: hasOverlap
      ? {
          ra: { min: overlapRa.min, max: overlapRa.max },
          dec: { min: overlapDec.min, max: overlapDec.max },
        }
      : null,
    area: hasOverlap
      ? (overlapRa.max - overlapRa.min) * (overlapDec.max - overlapDec.min)
      : 0,
  }
}

// 推荐最佳观测区域
export function getOptimalObservationArea(telescopes: string[]) {
  const overlapInfo = getMultiTelescopeOverlap(telescopes)

  if (!overlapInfo || !overlapInfo.hasOverlap || !overlapInfo.bounds) {
    // 如果没有重叠，返回覆盖范围最大的望远镜区域
    let maxArea = 0
    let bestTelescope = ''

    telescopes.forEach((telescope) => {
      const range = TELESCOPE_RANGES[telescope.toLowerCase()]
      if (range) {
        const area =
          (range.ra.max - range.ra.min) * (range.dec.max - range.dec.min)
        if (area > maxArea) {
          maxArea = area
          bestTelescope = telescope
        }
      }
    })

    return {
      type: 'single',
      telescope: bestTelescope,
      bounds: TELESCOPE_RANGES[bestTelescope.toLowerCase()],
      area: maxArea,
    }
  }

  return {
    type: 'overlap',
    telescopes,
    bounds: overlapInfo.bounds,
    area: overlapInfo.area,
  }
}

// 坐标转换工具
export const CoordinateUtils = {
  // 将RA/Dec转换为球面坐标系中的3D位置
  raDecToSphere: (
    ra: number,
    dec: number,
    bounds: {
      ra: { min: number; max: number }
      dec: { min: number; max: number }
    },
  ) => {
    // 标准化RA到0-2π范围
    const theta =
      ((ra - bounds.ra.min) / (bounds.ra.max - bounds.ra.min)) * 2 * Math.PI

    // 标准化Dec到0-π范围 (注意：Dec从-90到+90度)
    const phi =
      ((dec - bounds.dec.min) / (bounds.dec.max - bounds.dec.min)) * Math.PI

    // 转换为球面坐标 (半径为1的单位球)
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta),
    }
  },

  // 将球面3D位置转换回RA/Dec
  sphereToRaDec: (
    x: number,
    y: number,
    z: number,
    bounds: {
      ra: { min: number; max: number }
      dec: { min: number; max: number }
    },
  ) => {
    // 从3D坐标计算球面角度
    const phi = Math.acos(Math.max(-1, Math.min(1, y))) // 0到π
    const theta = Math.atan2(z, x) // -π到π，需要标准化到0-2π
    const normalizedTheta = theta < 0 ? theta + 2 * Math.PI : theta

    // 转换回RA/Dec度数
    const ra =
      bounds.ra.min +
      (normalizedTheta / (2 * Math.PI)) * (bounds.ra.max - bounds.ra.min)
    const dec =
      bounds.dec.min + (phi / Math.PI) * (bounds.dec.max - bounds.dec.min)

    return { ra, dec }
  },

  // 检查坐标是否在指定范围内
  isValidCoordinate: (ra: number, dec: number) => {
    return ra >= 0 && ra <= 360 && dec >= -90 && dec <= 90
  },
}
