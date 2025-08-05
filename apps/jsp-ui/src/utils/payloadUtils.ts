// 构造payload等工具函数
import { TELESCOPE_FILTER_DB_MAP } from '@/constants/telescopeDbMap'
import { RetrievePayload, TelescopeOption } from '@/types/astro'

export function prepareRetrievePayload(
  telescopes: TelescopeOption[],
  twoMassFilters: any[],
  desiFilters: any[],
  euclidFilters: any[],
  wiseFilters: any[],
  lastSelectionCorners: Array<{ ra: number; dec: number }>,
): RetrievePayload {
  const getSelectedFilters = () => ({
    '2MASS': twoMassFilters.filter((f) => f.checked).map((f) => f.key),
    DESI: desiFilters.filter((f) => f.checked).map((f) => f.key),
    Euclid: euclidFilters.filter((f) => f.checked).map((f) => f.key),
    WISE: wiseFilters.filter((f) => f.checked).map((f) => f.key),
  })
  const selectedTelescopes = telescopes
    .filter((t) => t.selected)
    .map((t) => t.label)
  const selectedFilters = getSelectedFilters()
  const coordinations =
    lastSelectionCorners.length > 0 ? lastSelectionCorners : []
  const telescopesAndFilters = selectedTelescopes.map((telescope) => {
    const map = TELESCOPE_FILTER_DB_MAP[telescope]
    return {
      telescope,
      db: map?.db,
      column: map?.column,
      filters: selectedFilters[telescope] || [],
    }
  })
  return {
    telescopesAndFilters,
    coordinations,
  }
}
