import { useState } from 'react'

import { CheckBox } from '@/components/common/CheckBox'
import { Table, TableCell, TableRow } from '@/components/common/Table'

import styles from './DataTable.module.css'
import type { DataTableProps } from './DataTable.type'
import { DataTableBody } from './DataTableBody'
import { DataTablePaginationFooter } from './DataTablePaginationFooter'

/**
 * DataTable 컴포넌트
 *
 * `Table` · `Pagination` 공통 컴포넌트를 조합하여 로딩·에러·빈 데이터·페이지네이션 상태를
 * 통합 관리하는 래퍼 컴포넌트입니다. 호출부는 `data`와 `columns`만 전달하면 일관된 UI를 얻습니다.
 *
 * - **로딩**: 헤더 유지, tbody를 `pageSize`개 스켈레톤 행으로 대체
 * - **에러**: `isError`가 `isLoading`보다 우선. `onRetry` 전달 시 [다시 시도] 버튼 표시
 * - **빈 데이터**: `emptyMessage` 표시 (기본값 "데이터가 없습니다.")
 * - **페이지네이션**: `pagination` prop 전달 시 Pagination 렌더, `currentPage` 내부 관리
 * - **행 선택**: `selectable` 활성화 시 체크박스 컬럼 추가, 헤더로 전체 선택/해제
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={posts}
 *   columns={[
 *     { key: 'title', header: '제목', align: 'left' },
 *     { key: 'status', header: '상태' },
 *     { key: 'createdAt', header: '등록일', render: (v) => formatDate(v as string) },
 *   ]}
 *   isLoading={isLoading}
 *   isError={isError}
 *   onRetry={refetch}
 *   pagination={{ totalPages: meta.totalPages, onPageChange: setPage }}
 * />
 * ```
 */
export function DataTable<T extends object>({
  data,
  columns,
  isLoading = false,
  isError = false,
  onRetry,
  emptyMessage = '데이터가 없습니다.',
  pageSize = 10,
  pagination,
  selectable = false,
  onSelectionChange,
  ariaLabel,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<T[]>([])

  const allSelected = data.length > 0 && selectedRows.length === data.length

  const handleSelectAll = () => {
    const next = allSelected ? [] : [...data]
    setSelectedRows(next)
    onSelectionChange?.(next)
  }

  const handleSelectionChange = (rows: T[]) => {
    setSelectedRows(rows)
    onSelectionChange?.(rows)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedRows([])
    onSelectionChange?.([])
    pagination?.onPageChange(page)
  }

  const columnCount = columns.length + (selectable ? 1 : 0)
  const hasWidths = selectable || columns.some(col => col.width)

  return (
    <div className={styles.wrapper}>
      <Table ariaLabel={ariaLabel} roundedBottom={!pagination}>
        {hasWidths && (
          <colgroup>
            {selectable && <col style={{ width: 'var(--spacing-12)' }} />}
            {columns.map(col => (
              <col key={String(col.key)} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
        )}
        <thead>
          <TableRow>
            {selectable && (
              <TableCell as='th' scope='col' align='center'>
                <CheckBox checked={allSelected} onChange={handleSelectAll} aria-label='전체 선택' />
              </TableCell>
            )}
            {columns.map(col => (
              <TableCell key={String(col.key)} as='th' scope='col' align={col.align ?? 'center'}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </thead>
        <DataTableBody
          columns={columns}
          data={data}
          isLoading={isLoading}
          isError={isError}
          pageSize={pageSize}
          selectable={selectable}
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          onRetry={onRetry}
          emptyMessage={emptyMessage}
          columnCount={columnCount}
        />
      </Table>
      {pagination && (
        <DataTablePaginationFooter
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.totalItems}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}
