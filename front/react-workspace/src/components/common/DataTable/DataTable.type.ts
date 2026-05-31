import type { ReactNode } from 'react'

export type ColumnAlign = 'left' | 'center' | 'right'

export interface ColumnDef<T> {
  key: keyof T
  header: string
  width?: string
  align?: ColumnAlign
  render?: (value: T[keyof T], row: T) => ReactNode
}

export interface DataTablePagination {
  totalPages: number
  onPageChange: (page: number) => void
}

export interface DataTableProps<T extends object> {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  emptyMessage?: string
  pageSize?: number
  pagination?: DataTablePagination
  selectable?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
  ariaLabel?: string
}

export interface DataTableBodyProps<T extends object> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading: boolean
  isError: boolean
  pageSize: number
  selectable: boolean
  selectedRows: T[]
  onSelectionChange: (rows: T[]) => void
  onRetry?: () => void
  emptyMessage: string
  columnCount: number
}

export interface DataTableSkeletonProps {
  pageSize: number
  columnCount: number
}
