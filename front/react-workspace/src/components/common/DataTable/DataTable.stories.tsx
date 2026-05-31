import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Button } from '@/components/common/Button'

import { DataTable } from '.'
import type { ColumnDef } from './DataTable.type'

interface SampleRow {
  id: number
  name: string
  status: string
  amount: number
  date: string
}

const sampleData: SampleRow[] = [
  { id: 1, name: '김철수', status: '완료', amount: 1200000, date: '2024-11-01' },
  { id: 2, name: '이영희', status: '검토중', amount: 850000, date: '2024-11-05' },
  { id: 3, name: '박지민', status: '접수', amount: 300000, date: '2024-11-10' },
  { id: 4, name: '최민준', status: '반려', amount: 0, date: '2024-11-12' },
  { id: 5, name: '정수연', status: '보류', amount: 500000, date: '2024-11-15' },
]

const sampleColumns: ColumnDef<SampleRow>[] = [
  { key: 'id', header: 'ID', width: '3.75rem', align: 'center' },
  { key: 'name', header: '이름', align: 'left' },
  { key: 'status', header: '상태', align: 'center' },
  {
    key: 'amount',
    header: '금액',
    align: 'right',
    render: v => `${(v as number).toLocaleString()}원`,
  },
  { key: 'date', header: '날짜', align: 'center' },
]

// 제네릭 컴포넌트를 구체 타입으로 바인딩 — argTypes 타입 추론을 위해 필요
const BoundDataTable = DataTable<SampleRow>
type Story = StoryObj<typeof BoundDataTable>

// 기본 렌더: data·columns 고정, 나머지 props는 args에서 주입
const Render: Story['render'] = args => (
  <div className='w-[800px]'>
    <BoundDataTable {...args} data={sampleData} columns={sampleColumns} />
  </div>
)

const meta: Meta<typeof BoundDataTable> = {
  title: 'Common/DataTable',
  component: BoundDataTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: '로딩 상태 — 헤더 유지, tbody를 pageSize개 스켈레톤 행으로 대체',
    },
    isError: {
      control: 'boolean',
      description: '에러 상태 — isLoading보다 우선. 에러 메시지 + 재시도 버튼 표시',
    },
    emptyMessage: {
      control: 'text',
      description: '빈 데이터 메시지 (data 길이 0일 때 표시)',
    },
    pageSize: {
      control: 'number',
      description: '한 페이지 행 수 — 스켈레톤 행 수에도 동일하게 적용. 기본값 10',
    },
    selectable: {
      control: 'boolean',
      description: '행 선택 기능 활성화 — 첫 컬럼에 체크박스 추가, 헤더로 전체 선택/해제',
    },
    ariaLabel: {
      control: 'text',
      description: '접근성 레이블 (table aria-label)',
    },
    onRetry: {
      action: 'retry',
      description: '에러 상태에서 [다시 시도] 버튼 클릭 콜백 — prop 미전달 시 버튼 미노출',
    },
    onSelectionChange: {
      action: 'selectionChange',
      description: 'selectable 활성화 시 선택된 행 배열을 전달하는 콜백',
    },
    data: {
      control: false,
      description: '테이블 데이터 배열',
    },
    columns: {
      control: false,
      description: 'ColumnDef 배열 — key · header · width? · align? · render?(value, row)',
    },
    pagination: {
      control: false,
      description: '페이지네이션 설정 ({ totalPages, onPageChange }) — 미전달 시 Pagination 미렌더',
    },
  },
  render: Render,
}

export default meta

export const Default: Story = {
  args: {
    isLoading: false,
    isError: false,
    emptyMessage: '데이터가 없습니다.',
    pageSize: 10,
    selectable: false,
    ariaLabel: '샘플 데이터 테이블',
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    pageSize: 5,
  },
}

export const Error: Story = {
  args: {
    ...Default.args,
    isError: true,
  },
}

export const ErrorWithoutRetry: Story = {
  name: 'Error (onRetry 없음)',
  args: {
    ...Default.args,
    isError: true,
    onRetry: undefined,
  },
}

// data가 빈 배열일 때 emptyMessage 표시 — render에서 data를 []로 고정
export const Empty: Story = {
  render: args => (
    <div className='w-[800px]'>
      <BoundDataTable {...args} data={[]} columns={sampleColumns} />
    </div>
  ),
  args: {
    ...Default.args,
    emptyMessage: '조회된 데이터가 없습니다.',
  },
}

// pagination prop은 함수를 포함하는 객체라 args 직렬화 불가 — render에서 직접 전달
export const WithPagination: Story = {
  render: args => (
    <div className='w-[800px]'>
      <BoundDataTable
        {...args}
        data={sampleData}
        columns={sampleColumns}
        pagination={{ totalPages: 5, onPageChange: () => {} }}
      />
    </div>
  ),
  args: {
    ...Default.args,
  },
}

export const Selectable: Story = {
  args: {
    ...Default.args,
    selectable: true,
  },
}

function SelectableWithPaginationRenderer(args: React.ComponentProps<typeof BoundDataTable>) {
  const [selectedRows, setSelectedRows] = useState<SampleRow[]>([])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', width: '50rem' }}>
      <BoundDataTable
        {...args}
        data={sampleData}
        columns={sampleColumns}
        selectable
        onSelectionChange={setSelectedRows}
        pagination={{ totalPages: 3, onPageChange: () => {} }}
      />
      <Button variant='accent' onClick={() => alert(JSON.stringify(selectedRows, null, 2))}>
        선택된 데이터 확인 ({selectedRows.length}건)
      </Button>
      {selectedRows.length > 0 && (
        <pre
          style={{
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            background: 'var(--surface-container-low)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--foreground)',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(selectedRows, null, 2)}
        </pre>
      )}
    </div>
  )
}

export const SelectableWithPagination: Story = {
  render: args => <SelectableWithPaginationRenderer {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
const [selectedRows, setSelectedRows] = useState<SampleRow[]>([])

<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', width: '50rem' }}>
  <DataTable
    data={sampleData}
    columns={sampleColumns}
    selectable
    onSelectionChange={setSelectedRows}
    pagination={{ totalPages: 3, onPageChange: () => {} }}
  />
  <Button variant="accent" onClick={() => alert(JSON.stringify(selectedRows, null, 2))}>
    선택된 데이터 확인 ({selectedRows.length}건)
  </Button>
  {selectedRows.length > 0 && (
    <pre>{JSON.stringify(selectedRows, null, 2)}</pre>
  )}
</div>
        `.trim(),
      },
    },
  },
  args: {
    ...Default.args,
    selectable: true,
  },
}
