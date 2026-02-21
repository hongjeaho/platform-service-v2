import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { borderRadius, gap, padding } from '@/constants/design/spacing'
import { fontWeights, textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import { Pagination } from '@/common/components/ui/navigation/pagination'
import { createLargeUserData, sampleData, tableColumns, type User } from './__mocks__/sampleData'
import { Table } from './Table'
import type { TableProps } from './Table.types'

const meta = {
  title: 'UI/Data Display/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
데이터를 테이블 형식으로 표시하는 범용 컴포넌트입니다.

## 주요 기능

| 기능 | 활성화 방법 |
|------|------------|
| **행 선택** | \`selectable\` + \`selectedRows\` + \`onSelectRows\` |
| **컬럼 정렬** | \`column.sortable: true\` — 클릭 시 내부 자동 정렬 |

페이지네이션이 필요하면 \`Pagination\`(UI/Navigation) 컴포넌트를 테이블 하단에 조합하세요.

## 사용 예시

\`\`\`tsx
<Table
  columns={[
    { key: 'name', header: '이름', width: '120px', sortable: true },
    { key: 'email', header: '이메일' },
  ]}
  data={users}
  keyExtractor={row => row.id}
/>
\`\`\`

> **keyExtractor**: \`selectable\` 사용 시 페이지 단위 데이터와 함께 쓰면 고유 key를 반환하도록 명시하세요.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSelectRows: { action: 'onSelectRows' },
    keyExtractor: {
      control: false,
      description: '각 행의 unique key를 반환하는 함수. 생략 시 row index를 사용합니다.',
      table: { type: { summary: '(row: T, index: number) => string | number' } },
    },
    columns: { table: { disable: true } },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const columns = tableColumns.map(col => ({ ...col }))

/**
 * 선택 정보 표시용 컴포넌트
 */
function SelectionInfo<T extends { id: number; name: string; email: string }>({
  selectedData,
}: {
  selectedData: T[]
}) {
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
        선택된 행: {selectedData.length}개
      </div>
      {selectedData.length > 0 && (
        <div className={cn('flex flex-col', gap.tight)}>
          <div className={cn(textCombinations.bodyXs, 'text-muted-foreground')}>
            선택된 ID: {selectedData.map(item => item.id).join(', ')}
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
  parameters: {
    docs: {
      description: { story: '기본 테이블입니다. 데이터와 컬럼 정의만으로 렌더링됩니다.' },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
  },
}

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '데이터가 없을 때 표시되는 빈 상태입니다. `emptyMessage` prop으로 메시지를 변경할 수 있습니다.',
      },
    },
  },
  args: {
    columns,
    data: [],
    keyExtractor: row => row.id,
    emptyMessage: '표시할 데이터가 없습니다.',
  },
}

export const Striped: Story = {
  parameters: {
    docs: {
      description: {
        story: '`striped` prop을 활성화하면 홀수 행의 배경색이 달라져 가독성이 향상됩니다.',
      },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    striped: true,
  },
}

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story: '`size="sm"` 으로 셀 패딩과 폰트 크기를 줄인 컴팩트한 테이블입니다.',
      },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    size: 'sm',
  },
}

export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story: '`size="lg"` 로 셀 패딩과 폰트 크기를 키운 넓은 테이블입니다.',
      },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
    size: 'lg',
  },
}

/**
 * 행 선택 기능 데모용 래퍼.
 * selectedRows(Set)와 onSelectRows를 내부 state로 관리합니다.
 */
function SelectableWrapper(args: TableProps<User>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const selectedData = sampleData.filter(item => selectedRows.has(item.id))

  return (
    <div className={cn('flex flex-col', gap.default)}>
      <SelectionInfo selectedData={selectedData} />
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
  parameters: {
    docs: {
      description: {
        story:
          '`selectable` prop을 활성화한 테이블입니다. 헤더 체크박스로 전체 선택/해제가 가능하고, 선택된 행은 하이라이트됩니다. `selectedRows`(Set)와 `onSelectRows` 를 상위 컴포넌트에서 제어합니다.',
      },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
  },
}

/**
 * 컬럼 정렬 데모용 래퍼.
 * name·email·role 컬럼에 sortable: true를 설정합니다.
 * 외부 onSort 없이 Table 내부 정렬 로직이 동작합니다.
 */
function SortableWrapper(args: TableProps<User>) {
  const sortableColumns = columns.map(col => ({
    ...col,
    sortable: ['name', 'email', 'role'].includes(String(col.key)),
  }))

  return <Table {...args} columns={sortableColumns} />
}

export const Sortable: Story = {
  render: SortableWrapper,
  parameters: {
    docs: {
      description: {
        story:
          '컬럼 정의에 `sortable: true`를 지정하면 헤더 클릭 시 내부 정렬이 자동 적용됩니다. 외부 콜백 없이 동작하며, 이름·이메일·역할 컬럼을 클릭해 보세요.',
      },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
  },
}

/**
 * 행 선택 + 컬럼 정렬 동시 사용 데모용 래퍼.
 * 정렬 후에도 선택 상태(keyExtractor 기반)가 올바르게 유지되는지 확인할 수 있습니다.
 */
function SelectableWithSortableWrapper(args: TableProps<User>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  const sortableColumns = columns.map(col => ({
    ...col,
    sortable: ['name', 'email', 'role'].includes(String(col.key)),
  }))

  const selectedData = (args.data ?? []).filter(item => selectedRows.has(item.id))

  return (
    <div className={cn('flex flex-col', gap.default)}>
      <SelectionInfo selectedData={selectedData} />
      <Table
        {...args}
        columns={sortableColumns}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
      />
    </div>
  )
}

export const SelectableWithSortable: Story = {
  render: SelectableWithSortableWrapper,
  parameters: {
    docs: {
      description: {
        story:
          '행 선택과 컬럼 정렬을 동시에 사용하는 시나리오입니다. 이름·이메일·역할 컬럼 헤더를 클릭하면 정렬이 적용되고, 선택 상태는 정렬 후에도 유지됩니다.',
      },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: row => row.id,
  },
}

/**
 * Table + Pagination 조합. navigation의 Pagination 컴포넌트를 테이블 하단에 사용합니다.
 */
function WithPaginationWrapper(args: TableProps<User>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number | null>(10)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  const largeData = createLargeUserData(100)
  const totalItems = largeData.length
  const paginatedData =
    pageSize === null
      ? largeData
      : largeData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const selectedData = largeData.filter(item => selectedRows.has(item.id))

  const sortableColumns = columns.map(col => ({
    ...col,
    sortable: ['name', 'email', 'role'].includes(String(col.key)),
  }))

  return (
    <div className={cn('flex flex-col', gap.default)}>
      <SelectionInfo selectedData={selectedData} />
      <div style={{ width: '800px' }}>
        <Table
          {...args}
          columns={sortableColumns}
          data={paginatedData}
          keyExtractor={(row: User) => row.id}
          selectable
          selectedRows={selectedRows}
          onSelectRows={setSelectedRows}
        />
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          visiblePageCount={5}
        />
      </div>
    </div>
  )
}

export const WithPagination: Story = {
  render: WithPaginationWrapper,
  parameters: {
    docs: {
      description: {
        story:
          'Table과 navigation의 Pagination을 조합한 시나리오입니다. 행 선택, 정렬, 페이지 이동을 함께 사용합니다.',
      },
    },
  },
  args: {
    columns,
    data: sampleData,
    keyExtractor: (row: User) => row.id,
  },
}
