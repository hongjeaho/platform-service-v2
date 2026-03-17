import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '.'

function DefaultTable(props?: { striped?: boolean; hoverable?: boolean }) {
  return (
    <Table ariaLabel='테이블' striped={props?.striped} hoverable={props?.hoverable}>
      <TableHeader>
        <TableRow>
          <TableHead align='left'>이름</TableHead>
          <TableHead align='right'>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell align='left'>딸기</TableCell>
          <TableCell align='right'>10,000</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} align='left'>
            합계
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe('Table', () => {
  it('table 구조(thead/tbody/tfoot)를 렌더링합니다', () => {
    const { container } = render(<DefaultTable />)
    const table = screen.getByRole('table', { name: '테이블' })
    expect(table).toBeInTheDocument()
    expect(container.querySelector('thead')).toBeInTheDocument()
    expect(container.querySelector('tbody')).toBeInTheDocument()
    expect(container.querySelector('tfoot')).toBeInTheDocument()
  })

  it('striped/hoverable 기본값을 data attribute로 가집니다', () => {
    render(<DefaultTable />)
    const table = screen.getByRole('table', { name: '테이블' })
    expect(table).toHaveAttribute('data-striped', 'false')
    expect(table).toHaveAttribute('data-hoverable', 'true')
  })

  it('striped/hoverable 값을 전달하면 data attribute가 변경됩니다', () => {
    render(<DefaultTable striped hoverable={false} />)
    const table = screen.getByRole('table', { name: '테이블' })
    expect(table).toHaveAttribute('data-striped', 'true')
    expect(table).toHaveAttribute('data-hoverable', 'false')
  })

  it('TableHead/TableCell align이 data-align로 반영됩니다', () => {
    render(<DefaultTable />)
    const table = screen.getByRole('table', { name: '테이블' })
    const headerCells = within(table).getAllByRole('columnheader')
    expect(headerCells[0]).toHaveAttribute('data-align', 'left')
    expect(headerCells[1]).toHaveAttribute('data-align', 'right')
    const bodyCells = within(table).getAllByRole('cell')
    expect(bodyCells[0]).toHaveAttribute('data-align', 'left')
    expect(bodyCells[1]).toHaveAttribute('data-align', 'right')
  })

  it('colSpan이 적용됩니다', () => {
    render(<DefaultTable />)
    const table = screen.getByRole('table', { name: '테이블' })
    expect(within(table).getByRole('cell', { name: '합계' })).toHaveAttribute('colspan', '2')
  })
})

