import { Button } from '@/components/common/Button'
import { CheckBox } from '@/components/common/CheckBox'
import { TableCell, TableRow } from '@/components/common/Table'

import styles from './DataTable.module.css'
import type { DataTableBodyProps } from './DataTable.type'
import { DataTableSkeleton } from './DataTableSkeleton'

export function DataTableBody<T extends object>({
  columns,
  data,
  isLoading,
  isError,
  pageSize,
  selectable,
  selectedRows,
  onSelectionChange,
  onRetry,
  emptyMessage,
  columnCount,
}: DataTableBodyProps<T>) {
  if (isError) {
    return (
      <tbody>
        <TableRow>
          <TableCell colSpan={columnCount}>
            <div className={styles.stateContainer}>
              <span className={styles.stateMessage}>데이터를 불러오지 못했습니다.</span>
              {onRetry && (
                <Button variant='accent' size='sm' onClick={onRetry}>
                  다시 시도
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      </tbody>
    )
  }

  if (isLoading) {
    return <DataTableSkeleton pageSize={pageSize} columnCount={columnCount} />
  }

  if (data.length === 0) {
    return (
      <tbody>
        <TableRow>
          <TableCell colSpan={columnCount}>
            <div className={styles.stateContainer}>
              <span className={styles.stateMessage}>{emptyMessage}</span>
            </div>
          </TableCell>
        </TableRow>
      </tbody>
    )
  }

  const handleRowToggle = (row: T) => {
    const isSelected = selectedRows.includes(row)
    const next = isSelected ? selectedRows.filter(r => r !== row) : [...selectedRows, row]
    onSelectionChange(next)
  }

  return (
    <tbody>
      {data.map((row, rowIdx) => {
        const isSelected = selectedRows.includes(row)
        return (
          <TableRow key={rowIdx} data-selected={isSelected ? 'true' : undefined}>
            {selectable && (
              <TableCell align='center'>
                <CheckBox
                  checked={isSelected}
                  onChange={() => handleRowToggle(row)}
                  aria-label={`${rowIdx + 1}번 행 선택`}
                />
              </TableCell>
            )}
            {columns.map(col => {
              const value = row[col.key]
              return (
                <TableCell key={String(col.key)} align={col.align ?? 'center'}>
                  {col.render ? col.render(value, row) : String(value ?? '')}
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </tbody>
  )
}
