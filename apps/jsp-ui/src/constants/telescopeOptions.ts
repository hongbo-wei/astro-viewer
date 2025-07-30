// 望远镜和滤镜初始配置
import { FilterOption, TelescopeOption } from '@/types/astro'

export const initialTelescopes: TelescopeOption[] = [
  { key: 'twomass', label: '2MASS', selected: false },
  { key: 'desi', label: 'DESI', selected: false },
  { key: 'euclid', label: 'Euclid', selected: false },
  { key: 'wise', label: 'WISE', selected: false },
]

export const initialTwoMassFilters: FilterOption[] = [
  { key: 'h', label: 'h', checked: false },
  { key: 'j', label: 'j', checked: false },
  { key: 'k', label: 'k', checked: false },
]

export const initialDesiFilters: FilterOption[] = [
  { key: 'W1', label: 'W1', checked: false },
  { key: 'W2', label: 'W2', checked: false },
  { key: 'W3', label: 'W3', checked: false },
  { key: 'W4', label: 'W4', checked: false },
  { key: 'g', label: 'g', checked: false },
  { key: 'i', label: 'i', checked: false },
  { key: 'r', label: 'r', checked: false },
  { key: 'z', label: 'z', checked: false },
]

export const initialEuclidFilters: FilterOption[] = [
  { key: 'DECAM_g', label: 'DECAM_g', checked: false },
  { key: 'DECAM_i', label: 'DECAM_i', checked: false },
  { key: 'DECAM_r', label: 'DECAM_r', checked: false },
  { key: 'DECAM_z', label: 'DECAM_z', checked: false },
  { key: 'HSC_g', label: 'HSC_g', checked: false },
  { key: 'HSC_z', label: 'HSC_z', checked: false },
  { key: 'MEGACAM_r', label: 'MEGACAM_r', checked: false },
  { key: 'MEGACAM_u', label: 'MEGACAM_u', checked: false },
  { key: 'NIR_H', label: 'NIR_H', checked: false },
  { key: 'NIR_J', label: 'NIR_J', checked: false },
  { key: 'NIR_Y', label: 'NIR_Y', checked: false },
  { key: 'PANSTARRS_i', label: 'PANSTARRS_i', checked: false },
]

export const initialWiseFilters: FilterOption[] = [
  { key: '1', label: '1', checked: false },
  { key: '2', label: '2', checked: false },
  { key: '3', label: '3', checked: false },
  { key: '4', label: '4', checked: false },
]
