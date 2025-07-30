// 通用类型定义
export interface FilterOption {
  key: string
  label: string
  checked: boolean
}

export interface TelescopeOption {
  key: string
  label: string
  selected: boolean
}

export interface RetrievedItem {
  id: string
  name: string
}

export interface RetrievedImage {
  id: string
  url: string
  title: string
}

export interface RetrievePayload {
  telescopesAndFilters: Array<{
    telescope: string
    db?: string
    column?: string
    filters: string[]
  }>
  coordinations: Array<{ ra: number; dec: number }>
}
