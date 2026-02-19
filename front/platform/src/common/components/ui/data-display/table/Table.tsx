import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from './Table.module.css'
import type { TableProps } from './Table.types'

// Module-level constants to prevent object creation on every render
const SIZE_CLASSES = {
  sm: styles.sizeSm,
  md: undefined,
  lg: styles.sizeLg,
} as const

const ALIGN_CLASSES = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
} as const

/**
 * Table 컴포넌트
 * 데이터를 테이블 형식으로 표시합니다.
 * 행 선택, 정렬 기능을 지원합니다. 페이지네이션은 navigation의 Pagination 컴포넌트를 별도로 조합하세요.
 */
export function Table<T>({
  columns,
  data,
  keyExtractor = (_: T, index: number) => index,
  selectable = false,
  selectedRows,
  onSelectRows,
  emptyMessage = '표시할 데이터가 없습니다.',
  size = 'md',
  striped = false,
  className,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null,
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(data.map((row, i) => keyExtractor(row, i)))
      onSelectRows?.(allKeys)
    } else {
      onSelectRows?.(new Set())
    }
  }

  const handleSelectRow = (key: string | number, checked: boolean) => {
    const newSet = new Set(selectedRows)
    if (checked) {
      newSet.add(key)
    } else {
      newSet.delete(key)
    }
    onSelectRows?.(newSet)
  }

  const handleSortClick = (columnKey: string) => {
    const newDirection =
      sortConfig?.key === columnKey && sortConfig?.direction === 'asc' ? 'desc' : 'asc'

    setSortConfig({ key: columnKey, direction: newDirection })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return data
    const { key, direction } = sortConfig
    return [...data].sort((a, b) => {
      const aVal = a[key as keyof T]
      const bVal = b[key as keyof T]
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const isAllSelected = useMemo(() => {
    return data.length > 0 && data.every((row, i) => selectedRows?.has(keyExtractor(row, i)))
  }, [data, selectedRows, keyExtractor])

  const sizeClass = SIZE_CLASSES[size]

  if (data.length === 0) {
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.wrapper}>
          <table className={cn(styles.table, sizeClass)}>
            <thead className={styles.thead}>
              <tr>
                {selectable && (
                  <th className={cn(styles.th, styles.checkboxCell)}>
                    <input
                      type='checkbox'
                      className={styles.checkbox}
                      disabled
                      aria-label='모든 행 선택'
                    />
                  </th>
                )}
                {columns.map(column => {
                  const alignClass = ALIGN_CLASSES[column.align || 'center']

                  return (
                    <th
                      key={String(column.key)}
                      className={cn(styles.th, alignClass)}
                      style={{ width: column.width }}
                    >
                      {column.header}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className={cn(styles.td, styles.emptyCell)}
                >
                  {emptyMessage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.wrapper}>
        <table className={cn(styles.table, sizeClass)}>
          <thead className={styles.thead}>
            <tr>
              {selectable && (
                <th className={cn(styles.th, styles.checkboxCell)}>
                  <input
                    type='checkbox'
                    className={styles.checkbox}
                    checked={isAllSelected}
                    onChange={e => handleSelectAll(e.target.checked)}
                    aria-label='모든 행 선택'
                  />
                </th>
              )}
              {columns.map(column => {
                const alignClass = ALIGN_CLASSES[column.align || 'center']

                const isSorted = column.sortable && sortConfig?.key === String(column.key)
                const ariaSort =
                  isSorted && sortConfig
                    ? sortConfig.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : column.sortable
                      ? 'none'
                      : undefined

                return (
                  <th
                    key={String(column.key)}
                    className={cn(styles.th, column.sortable && styles.thSortable, alignClass)}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSortClick(String(column.key))}
                    aria-sort={ariaSort}
                  >
                    <span className={styles.headerFlex}>
                      {column.header}
                      {isSorted && sortConfig && (
                        <span className={styles.sortIcon} aria-hidden='true'>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {sortedData.map((row, rowIndex) => {
              const rowKey = keyExtractor(row, rowIndex)
              const isSelected = selectedRows?.has(rowKey)

              return (
                <tr
                  key={rowKey}
                  className={cn(
                    styles.tr,
                    striped && styles.striped,
                    isSelected && styles.selected,
                  )}
                >
                  {selectable && (
                    <td className={cn(styles.td, styles.checkboxCell)}>
                      <input
                        type='checkbox'
                        className={styles.checkbox}
                        checked={isSelected || false}
                        onChange={e => handleSelectRow(rowKey, e.target.checked)}
                        aria-label={`${rowIndex + 1}번째 행 선택`}
                      />
                    </td>
                  )}
                  {columns.map(column => {
                    const alignClass = ALIGN_CLASSES[column.align || 'center']

                    return (
                      <td
                        key={`${rowKey}-${String(column.key)}`}
                        className={cn(styles.td, alignClass)}
                      >
                        {column.render
                          ? column.render(row[column.key as keyof T], row, rowIndex)
                          : String(row[column.key as keyof T] || '')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Table.displayName = 'Table'
