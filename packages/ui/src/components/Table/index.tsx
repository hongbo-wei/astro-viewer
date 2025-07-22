import { TableProps, Table as AntTable, TablePaginationConfig } from 'antd'
import type { PaginationProps } from 'antd'
import { useState, useRef, useEffect, useMemo } from 'react'

import { PageOrder, PaginationParams } from '../../types/pagination'

interface Props extends TableProps {
  calcScroll?: boolean
}

const defaultPaginationConfig: TablePaginationConfig = {
  // hideOnSinglePage: true,
  showSizeChanger: true, // 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
}

function Table<DataType>({
  pagination,
  columns,
  dataSource,
  onChange,
  scroll,
  calcScroll,
  ...props
}: Props) {
  const [scrollConfig, setScrollConfig] = useState(scroll || {})
  const tableRef = useRef<any>(null)

  const tHeaderBottom = useMemo(() => {
    if (!tableRef.current) {
      return false
    }
    const tHeaderEl: Element =
      tableRef.current.nativeElement.querySelector('.ant-table-thead')
    return tHeaderEl?.getBoundingClientRect()?.bottom
    /* eslint-disable */
  }, [tableRef.current])

  useEffect(() => {
    if (calcScroll && tHeaderBottom && scroll) {
      setScrollConfig({
        ...scrollConfig,
        y: `calc(100vh - ${scroll.y}px - ${tHeaderBottom}px)`,
      })
    }
    /* eslint-disable */
  }, [tHeaderBottom, scroll?.y])

  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    if (onChange) {
      onChange(pagination, filters, sorter, extra)
    }
  }

  return (
    <AntTable
      ref={tableRef}
      dataSource={dataSource}
      columns={columns}
      pagination={
        pagination && {...defaultPaginationConfig, ...pagination}
      }
      onChange={handleChange}
      scroll={scrollConfig}
      {...props}
    />
  )
}

export default Table

const usePagination = (pageInitProps?: PaginationProps & Partial< PaginationParams>) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: pageInitProps?.current || 1,
    pageSize: pageInitProps?.pageSize || 10,
    total: pageInitProps?.total || 10
  })
  const [pageReqParams, setPageReqParams] = useState<PaginationParams>({
    pageNum: pagination?.current || 1,
    pageSize: pagination?.pageSize || 10,
    order: pageInitProps?.order,
    orderBy: pageInitProps?.orderBy,
  })
  // @ts-ignore
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current, pageSize } = pagination as {
      current: number
      pageSize: number
    }
    const { field, order } = sorter 
    const params = {
      pageSize: pageSize,
      pageNum: current,
      order: (order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : order) as PageOrder,
      orderBy: field,
    }
    setPageReqParams(params)
  }
  return {
    pagination,
    pageReqParams,
    setPageReqParams,
    setPagination,
    handleTableChange,
  }
}
export { usePagination }
