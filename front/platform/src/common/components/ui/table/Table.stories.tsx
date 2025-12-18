import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Table } from './Table'

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const sampleData: User[] = [
  {
    id: 1,
    name: '김준호',
    email: 'kim@example.com',
    role: '관리자',
    status: 'active',
  },
  {
    id: 2,
    name: '이순신',
    email: 'lee@example.com',
    role: '사용자',
    status: 'active',
  },
  {
    id: 3,
    name: '박영희',
    email: 'park@example.com',
    role: '편집자',
    status: 'inactive',
  },
  {
    id: 4,
    name: '정민수',
    email: 'jung@example.com',
    role: '사용자',
    status: 'active',
  },
  {
    id: 5,
    name: '최지혜',
    email: 'choi@example.com',
    role: '관리자',
    status: 'inactive',
  },
]

const columns = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'name', header: '이름', width: '120px' },
  { key: 'email', header: '이메일' },
  { key: 'role', header: '역할', width: '100px' },
  { key: 'status', header: '상태', width: '100px' },
]

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

export const Selectable: Story = {
  render: args => {
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

    return (
      <Table
        {...args}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
      />
    )
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
  },
}

export const Sortable: Story = {
  render: args => {
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
      <Table
        {...args}
        columns={sortableColumns}
        data={sortedData}
        onSort={handleSort}
      />
    )
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    sortable: true,
  },
}

// 고급 페이지네이션 스토리
export const EnhancedPagination: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

    // 더미 데이터 생성 (100개)
    const largeData = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `사용자${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: ['관리자', '사용자', '편집자'][index % 3],
      status: index % 2 === 0 ? 'active' : 'inactive',
    }))
    const totalItems = largeData.length

    // 페이지네이션된 데이터 계산
    const startIndex = (currentPage - 1) * (pageSize || totalItems)
    const endIndex = startIndex + (pageSize || totalItems)
    const paginatedData = pageSize
      ? largeData.slice(startIndex, endIndex)
      : largeData

    const handlePageChange = (page: number) => {
      setCurrentPage(page)
    }

    const handlePageSizeChange = (newPageSize: number | null) => {
      setPageSize(newPageSize || totalItems)
      setCurrentPage(1) // 페이지 크기 변경 시 첫 페이지로 이동
    }

    return (
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
    )
  },
  args: {
    columns,
    data: [],
    keyExtractor: row => row.id,
    emptyMessage: '표시할 데이터가 없습니다.',
  },
}

export const SelectableWithSortable: Story = {
  render: args => {
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
      <Table
        {...args}
        columns={sortableColumns}
        data={sortedData}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
        onSort={handleSort}
      />
    )
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    sortable: true,
  },
}