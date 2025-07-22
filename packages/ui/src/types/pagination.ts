export type PageOrder = 'asc' | 'desc'

// 请求api参数
export interface PaginationParams {
  pageNum: number
  pageSize?: number
  order?: PageOrder
  orderBy?: string
}

export interface RequiredPagination {
  current: number
  total: number
  pageSize: number
}

const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
  order: 'desc' as PageOrder,
  orderBy: '',
}

export interface PaginationRes {
  totalSize: number // 好像没用到
  totalPage: number
  pageSize: number
  pageNum: number
}
export { defaultPagination }
