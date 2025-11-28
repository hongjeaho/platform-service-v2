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
    name: '최화란',
    email: 'choi@example.com',
    role: '관리자',
    status: 'active',
  },
]

const columns = [
  { key: 'name', header: '이름', width: '120px' },
  { key: 'email', header: '이메일', width: '200px' },
  { key: 'role', header: '역할', width: '100px', align: 'center' as const },
  {
    key: 'status',
    header: '상태',
    width: '100px',
    align: 'center' as const,
    render: (value: string) => (
      <span style={{ color: value === 'active' ? 'green' : 'red' }}>
        {value === 'active' ? '활성' : '비활성'}
      </span>
    ),
  },
]

/**
 * 기본 Table
 */
export const Default: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: (row) => row.id,
  },
}

/**
 * 크기 변형 - Small
 */
export const SmallSize: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 3),
    keyExtractor: (row) => row.id,
    size: 'sm',
  },
}

/**
 * 크기 변형 - Large
 */
export const LargeSize: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 3),
    keyExtractor: (row) => row.id,
    size: 'lg',
  },
}

/**
 * 스트라이프 스타일 (홀수 행 배경)
 */
export const Striped: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: (row) => row.id,
    striped: true,
  },
}

/**
 * 행 선택 기능
 */
export const Selectable: Story = {
  render: (args) => {
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Table
          {...args}
          selectable={true}
          selectedRows={selectedRows}
          onSelectRows={setSelectedRows}
        />
        <p>선택된 행: {selectedRows.size > 0 ? Array.from(selectedRows).join(', ') : '없음'}</p>
      </div>
    )
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: (row) => row.id,
  },
}

/**
 * 정렬 기능
 */
export const Sortable: Story = {
  render: (args) => {
    const [sortedData, setSortedData] = useState(sampleData)

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
      const sorted = [...sampleData].sort((a, b) => {
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
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: (row) => row.id,
    sortable: true,
  },
}

/**
 * 데이터 없음 상태
 */
export const Empty: Story = {
  args: {
    columns,
    data: [],
    keyExtractor: (row) => row.id,
    emptyMessage: '표시할 데이터가 없습니다.',
  },
}

/**
 * 커스텀 렌더링
 */
export const CustomRender: Story = {
  args: {
    columns: [
      { key: 'name', header: '이름', width: '120px' },
      { key: 'email', header: '이메일', width: '200px' },
      {
        key: 'role',
        header: '역할',
        width: '100px',
        align: 'center' as const,
        render: (value: string) => (
          <span
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              backgroundColor:
                value === '관리자'
                  ? '#fee2e2'
                  : value === '편집자'
                    ? '#fef3c7'
                    : '#dbeafe',
              color:
                value === '관리자'
                  ? '#991b1b'
                  : value === '편집자'
                    ? '#92400e'
                    : '#1e40af',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {value}
          </span>
        ),
      },
      {
        key: 'status',
        header: '상태',
        width: '100px',
        align: 'center' as const,
        render: (value: string) => (
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: value === 'active' ? '#10b981' : '#ef4444',
              marginRight: '0.5rem',
            }}
            aria-label={value === 'active' ? '활성' : '비활성'}
          />
        ),
      },
    ],
    data: sampleData,
    keyExtractor: (row) => row.id,
  },
}

/**
 * 행 선택과 스트라이프 스타일 함께
 */
export const SelectableAndStriped: Story = {
  render: (args) => {
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

    return (
      <Table
        {...args}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
        striped={true}
      />
    )
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: (row) => row.id,
  },
}

/**
 * 정렬과 행 선택 함께
 */
export const SortableAndSelectable: Story = {
  render: (args) => {
    const [sortedData, setSortedData] = useState(sampleData)
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
      const sorted = [...sampleData].sort((a, b) => {
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
    keyExtractor: (row) => row.id,
    sortable: true,
  },
}
