import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { borderRadius, gap, padding } from '@/constants/design/spacing'
import { fontWeights, textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import {
  createLargeUserData,
  sampleData,
  tableColumns,
  type User,
} from './__mocks__/sampleData'
import { Table } from './Table'
import type { TableProps } from './Table.types'

const meta = {
  title: 'UI/Data Display/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const columns = tableColumns.map(col => ({ ...col }))

/**
 * 선택 정보 표시용 컴포넌트
 */
function SelectionInfo<T extends { id: number; name: string; email: string }>({
  selectedIds,
  data,
}: {
  selectedIds: Set<string | number>
  data: T[]
}) {
  const selectedData = data.filter(item => selectedIds.has(item.id))

  return (
    <div
      className={cn(
        'flex flex-col border border-border bg-muted',
        borderRadius.lg,
        padding.cardSm,
        gap.tight,
      )}
    >
      <div className={cn(textCombinations.bodySm, fontWeights.medium, 'text-foreground')}>
        선택된 행: {selectedIds.size}개
      </div>
      {selectedIds.size > 0 && (
        <div className={cn('flex flex-col', gap.tight)}>
          <div className={cn(textCombinations.bodyXs, 'text-muted-foreground')}>
            선택된 ID: {Array.from(selectedIds).join(', ')}
          </div>
          <div className={cn(textCombinations.bodyXs, 'text-muted-foreground')}>
            선택된 데이터:
            <ul className={cn('list-disc', 'ml-4')}>
              {selectedData.map(item => (
                <li key={item.id}>
                  {item.name} ({item.email})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
  },
}

export const Empty: Story = {
  args: {
    columns,
    data: [],
    keyExtractor: row => row.id,
    emptyMessage: '표시할 데이터가 없습니다.',
  },
}

export const Striped: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    striped: true,
  },
}

export const Small: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    size: 'lg',
  },
}

/**
 * 선택 기능이 포함된 테이블 래퍼 컴포넌트
 */
function SelectableWrapper(args: TableProps<User>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  return (
    <div className={cn('flex flex-col', gap.default)}>
      <SelectionInfo selectedIds={selectedRows} data={sampleData} />
      <Table
        {...args}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
      />
    </div>
  )
}

export const Selectable: Story = {
  render: SelectableWrapper,
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
  },
}

/**
 * 정렬 기능이 포함된 테이블 래퍼 컴포넌트
 */
function SortableWrapper(args: TableProps<User>) {
  const [sortedData, setSortedData] = useState(args.data)

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    // setSortConfig({ key, direction }) // Future use for UI indicator

    const sorted = [...args.data].sort((a, b) => {
      const aVal = a[key as keyof User]
      const bVal = b[key as keyof User]

      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
    setSortedData(sorted)
  }

  const sortableColumns = columns.map(col => ({
    ...col,
    sortable: ['name', 'email', 'role'].includes(String(col.key)),
  }))

  return <Table {...args} columns={sortableColumns} data={sortedData} onSort={handleSort} />
}

export const Sortable: Story = {
  render: SortableWrapper,
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    sortable: true,
  },
}

/**
 * 고급 페이지네이션 기능이 포함된 테이블 래퍼 컴포넌트
 */
function EnhancedPaginationWrapper(args: TableProps<User>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  const largeData = createLargeUserData(100)
  const totalItems = largeData.length

  // 페이지네이션된 데이터 계산
  const startIndex = (currentPage - 1) * (pageSize || totalItems)
  const endIndex = startIndex + (pageSize || totalItems)
  const paginatedData = pageSize ? largeData.slice(startIndex, endIndex) : largeData

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number | null) => {
    setPageSize(newPageSize || totalItems)
    setCurrentPage(1) // 페이지 크기 변경 시 첫 페이지로 이동
  }

  return (
    <div className={cn('flex flex-col', gap.default)}>
      <SelectionInfo selectedIds={selectedRows} data={largeData} />
      <Table
        {...args}
        data={paginatedData}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        useEnhancedPagination={true}
        visiblePageCount={5}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
      />
    </div>
  )
}

// 고급 페이지네이션 스토리
export const EnhancedPagination: Story = {
  render: EnhancedPaginationWrapper,
  args: {
    columns,
    data: [],
    keyExtractor: row => row.id,
    emptyMessage: '표시할 데이터가 없습니다.',
  },
}

/**
 * 선택 + 정렬 기능이 포함된 테이블 래퍼 컴포넌트
 */
function SelectableWithSortableWrapper(args: TableProps<User>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [sortedData, setSortedData] = useState(args.data)

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    // setSortConfig({ key, direction }) // Future use for UI indicator

    const sorted = [...args.data].sort((a, b) => {
      const aVal = a[key as keyof User]
      const bVal = b[key as keyof User]

      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
    setSortedData(sorted)
  }

  const sortableColumns = columns.map(col => ({
    ...col,
    sortable: ['name', 'email', 'role'].includes(String(col.key)),
  }))

  return (
    <div className={cn('flex flex-col', gap.default)}>
      <SelectionInfo selectedIds={selectedRows} data={sortedData} />
      <Table
        {...args}
        columns={sortableColumns}
        data={sortedData}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
        onSort={handleSort}
      />
    </div>
  )
}

export const SelectableWithSortable: Story = {
  render: SelectableWithSortableWrapper,
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    sortable: true,
  },
}
