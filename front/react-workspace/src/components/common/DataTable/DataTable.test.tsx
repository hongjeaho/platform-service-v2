import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DataTable } from '.'
import { DataTableSkeleton } from './DataTableSkeleton'

interface Row {
  id: number
  name: string
  status: string
}

const columns = [
  { key: 'id' as const, header: 'ID' },
  { key: 'name' as const, header: '이름' },
  { key: 'status' as const, header: '상태' },
]

const data: Row[] = [
  { id: 1, name: '김철수', status: '완료' },
  { id: 2, name: '이영희', status: '검토중' },
]

describe('DataTable', () => {
  it('데이터를 테이블로 렌더링합니다', () => {
    render(<DataTable data={data} columns={columns} ariaLabel='테스트 테이블' />)
    expect(screen.getByRole('table', { name: '테스트 테이블' })).toBeInTheDocument()
    expect(screen.getByText('김철수')).toBeInTheDocument()
    expect(screen.getByText('이영희')).toBeInTheDocument()
  })

  it('헤더 컬럼명을 렌더링합니다', () => {
    render(<DataTable data={data} columns={columns} ariaLabel='테이블' />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('이름')).toBeInTheDocument()
    expect(screen.getByText('상태')).toBeInTheDocument()
  })

  it('isLoading이면 pageSize만큼 스켈레톤 행을 렌더링합니다', () => {
    const { container } = render(
      <DataTable data={[]} columns={columns} isLoading pageSize={3} ariaLabel='로딩 테이블' />,
    )
    const tbody = container.querySelector('tbody')
    expect(tbody?.querySelectorAll('tr')).toHaveLength(3)
  })

  it('isError가 isLoading보다 우선합니다', () => {
    render(<DataTable data={[]} columns={columns} isError isLoading ariaLabel='에러 테이블' />)
    expect(screen.getByText('데이터를 불러오지 못했습니다.')).toBeInTheDocument()
  })

  it('isError이고 onRetry가 있으면 다시 시도 버튼이 표시됩니다', async () => {
    const onRetry = vi.fn()
    render(
      <DataTable data={[]} columns={columns} isError onRetry={onRetry} ariaLabel='에러 테이블' />,
    )
    const retryButton = screen.getByRole('button', { name: '다시 시도' })
    expect(retryButton).toBeInTheDocument()
    await userEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('isError이고 onRetry가 없으면 다시 시도 버튼이 없습니다', () => {
    render(<DataTable data={[]} columns={columns} isError ariaLabel='에러 테이블' />)
    expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument()
  })

  it('data가 빈 배열이면 기본 빈 메시지를 표시합니다', () => {
    render(<DataTable data={[]} columns={columns} ariaLabel='빈 테이블' />)
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument()
  })

  it('emptyMessage prop을 표시합니다', () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        emptyMessage='조회된 데이터가 없습니다.'
        ariaLabel='빈 테이블'
      />,
    )
    expect(screen.getByText('조회된 데이터가 없습니다.')).toBeInTheDocument()
  })

  it('pagination prop이 없으면 Pagination을 렌더링하지 않습니다', () => {
    render(<DataTable data={data} columns={columns} ariaLabel='테이블' />)
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('pagination prop이 있으면 Pagination을 렌더링합니다', () => {
    render(
      <DataTable
        data={data}
        columns={columns}
        pagination={{ totalPages: 3, onPageChange: () => {} }}
        ariaLabel='테이블'
      />,
    )
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })

  it('render 함수로 셀을 커스텀 렌더링합니다', () => {
    const customColumns = [
      {
        key: 'id' as const,
        header: 'ID',
        render: (v: unknown) => <span data-testid='custom-cell'>{String(v)}</span>,
      },
      { key: 'name' as const, header: '이름' },
      { key: 'status' as const, header: '상태' },
    ]
    render(<DataTable data={data} columns={customColumns} ariaLabel='테이블' />)
    expect(screen.getAllByTestId('custom-cell')).toHaveLength(2)
  })

  it('selectable이 없으면 체크박스가 없습니다', () => {
    render(<DataTable data={data} columns={columns} ariaLabel='테이블' />)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('selectable이면 헤더 포함 체크박스 컬럼이 추가됩니다', () => {
    render(<DataTable data={data} columns={columns} selectable ariaLabel='테이블' />)
    // 헤더 1 + 데이터 2 = 3
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('헤더 체크박스로 전체 선택됩니다', async () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        selectable
        onSelectionChange={onSelectionChange}
        ariaLabel='테이블'
      />,
    )
    const headerCheckbox = screen.getByRole('checkbox', { name: '전체 선택' })
    await userEvent.click(headerCheckbox)
    expect(onSelectionChange).toHaveBeenCalledWith(data)
  })

  it('전체 선택 후 헤더 체크박스로 전체 해제됩니다', async () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        selectable
        onSelectionChange={onSelectionChange}
        ariaLabel='테이블'
      />,
    )
    const headerCheckbox = screen.getByRole('checkbox', { name: '전체 선택' })
    await userEvent.click(headerCheckbox) // 전체 선택
    await userEvent.click(headerCheckbox) // 전체 해제
    expect(onSelectionChange).toHaveBeenLastCalledWith([])
  })

  it('행 체크박스로 개별 행을 선택합니다', async () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        selectable
        onSelectionChange={onSelectionChange}
        ariaLabel='테이블'
      />,
    )
    const rowCheckbox = screen.getByRole('checkbox', { name: '1번 행 선택' })
    await userEvent.click(rowCheckbox)
    expect(onSelectionChange).toHaveBeenCalledWith([data[0]])
  })

  it('페이지 변경 시 onPageChange가 호출됩니다', async () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        pagination={{ totalPages: 5, onPageChange }}
        ariaLabel='테이블'
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('페이지 변경 시 currentPage가 내부적으로 업데이트됩니다', async () => {
    render(
      <DataTable
        data={data}
        columns={columns}
        pagination={{ totalPages: 5, onPageChange: () => {} }}
        ariaLabel='테이블'
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: '2' }))
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('페이지 변경 시 선택된 행이 초기화됩니다', async () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        selectable
        onSelectionChange={onSelectionChange}
        pagination={{ totalPages: 3, onPageChange: () => {} }}
        ariaLabel='테이블'
      />,
    )
    await userEvent.click(screen.getByRole('checkbox', { name: '1번 행 선택' }))
    await userEvent.click(screen.getByRole('button', { name: '2' }))
    expect(onSelectionChange).toHaveBeenLastCalledWith([])
  })
})

describe('DataTableSkeleton', () => {
  it('pageSize만큼 행이 렌더됩니다', () => {
    const { container } = render(<DataTableSkeleton pageSize={5} columnCount={3} />)
    expect(container.querySelectorAll('tr')).toHaveLength(5)
  })

  it('각 행에 columnCount만큼 셀이 렌더됩니다', () => {
    const { container } = render(<DataTableSkeleton pageSize={2} columnCount={4} />)
    container.querySelectorAll('tr').forEach(row => {
      expect(row.querySelectorAll('td')).toHaveLength(4)
    })
  })
})
