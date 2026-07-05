import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Table, TableCell, TableRow } from '.'

function DefaultTable(props?: { striped?: boolean; hoverable?: boolean }) {
  return (
    <Table ariaLabel='테이블' striped={props?.striped} hoverable={props?.hoverable}>
      <thead>
        <TableRow>
          <TableCell as='th' scope='col' align='left'>
            이름
          </TableCell>
          <TableCell as='th' scope='col' align='right'>
            금액
          </TableCell>
        </TableRow>
      </thead>
      <tbody>
        <TableRow>
          <TableCell align='left'>딸기</TableCell>
          <TableCell align='right'>10,000</TableCell>
        </TableRow>
      </tbody>
      <tfoot>
        <TableRow>
          <TableCell colSpan={2} align='left'>
            합계
          </TableCell>
        </TableRow>
      </tfoot>
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

  it('TableCell align이 data-align로 반영됩니다', () => {
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

  it('rowSpan이 적용됩니다', () => {
    render(
      <Table ariaLabel='테이블'>
        <tbody>
          <TableRow>
            <TableCell rowSpan={2}>병합</TableCell>
            <TableCell>첫째</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>둘째</TableCell>
          </TableRow>
        </tbody>
      </Table>,
    )
    const table = screen.getByRole('table', { name: '테이블' })
    expect(within(table).getByRole('cell', { name: '병합' })).toHaveAttribute('rowspan', '2')
  })

  it('TableCell as="th"일 때 scope가 적용됩니다', () => {
    render(
      <Table ariaLabel='테이블'>
        <thead>
          <TableRow>
            <TableCell as='th' scope='col'>
              제목
            </TableCell>
          </TableRow>
        </thead>
      </Table>,
    )
    const table = screen.getByRole('table', { name: '테이블' })
    expect(within(table).getByRole('columnheader', { name: '제목' })).toHaveAttribute(
      'scope',
      'col',
    )
  })

  it('TableRow groupEnd가 data-group-end로 반영됩니다', () => {
    render(
      <Table ariaLabel='테이블'>
        <tbody>
          <TableRow groupEnd>
            <TableCell>그룹 마지막</TableCell>
          </TableRow>
        </tbody>
      </Table>,
    )
    const table = screen.getByRole('table', { name: '테이블' })
    expect(table.querySelector('tr')).toHaveAttribute('data-group-end', 'true')
  })
})
