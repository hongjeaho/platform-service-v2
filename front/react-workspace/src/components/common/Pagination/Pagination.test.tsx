import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Pagination } from './Pagination'

function PaginationHarness({
  initialCurrentPage,
  totalPages,
  pageGroupSize = 5,
  variant = 'primary',
  color = 'primary',
  showFirstButton = false,
  showLastButton = false,
  showPageNumbersOnly = false,
}: {
  initialCurrentPage: number
  totalPages: number
  pageGroupSize?: number
  variant?: 'primary' | 'secondary' | 'tertiary'
  color?: 'primary' | 'secondary' | 'tertiary'
  showFirstButton?: boolean
  showLastButton?: boolean
  showPageNumbersOnly?: boolean
}) {
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)

  useEffect(() => {
    setCurrentPage(initialCurrentPage)
  }, [initialCurrentPage])

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageGroupSize={pageGroupSize}
      onPageChange={setCurrentPage}
      variant={variant}
      color={color}
      showFirstButton={showFirstButton}
      showLastButton={showLastButton}
      showPageNumbersOnly={showPageNumbersOnly}
    />
  )
}

describe('Pagination', () => {
  it('그룹 기준으로 페이지 번호를 렌더링합니다', () => {
    render(<PaginationHarness initialCurrentPage={9} totalPages={15} pageGroupSize={5} />)

    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '11' })).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: '9' })).toHaveAttribute('aria-current', 'page')
  })

  it('이전 버튼은 이전 그룹의 첫 페이지로 이동합니다', () => {
    render(<PaginationHarness initialCurrentPage={9} totalPages={15} pageGroupSize={5} />)

    fireEvent.click(screen.getByRole('button', { name: '이전' }))

    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '9' })).not.toBeInTheDocument()
  })

  it('다음 버튼은 다음 그룹의 첫 페이지로 이동합니다', () => {
    render(<PaginationHarness initialCurrentPage={9} totalPages={15} pageGroupSize={5} />)

    fireEvent.click(screen.getByRole('button', { name: '다음' }))

    expect(screen.getByRole('button', { name: '11' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: '15' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '9' })).not.toBeInTheDocument()
  })

  it('처음/마지막 버튼을 활성화할 수 있습니다', () => {
    render(
      <PaginationHarness
        initialCurrentPage={4}
        totalPages={15}
        pageGroupSize={5}
        showFirstButton
        showLastButton
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '처음' }))
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('button', { name: '마지막' }))
    expect(screen.getByRole('button', { name: '15' })).toHaveAttribute('aria-current', 'page')
  })

  it('showPageNumbersOnly는 이전/다음/처음/마지막을 숨깁니다', () => {
    render(
      <PaginationHarness
        initialCurrentPage={9}
        totalPages={15}
        pageGroupSize={5}
        showPageNumbersOnly
        showFirstButton
        showLastButton
      />,
    )

    expect(screen.queryByRole('button', { name: '이전' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '다음' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '처음' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '마지막' })).not.toBeInTheDocument()

    for (let page = 1; page <= 15; page += 1) {
      expect(screen.getByRole('button', { name: String(page) })).toBeInTheDocument()
    }
  })

  it('페이지 버튼에서 Arrow/Home/End 키로 이동합니다', async () => {
    render(<PaginationHarness initialCurrentPage={6} totalPages={15} pageGroupSize={5} />)

    const btn6 = screen.getByRole('button', { name: '6' })
    btn6.focus()
    expect(btn6).toHaveFocus()

    fireEvent.keyDown(btn6, { key: 'ArrowLeft' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('button', { name: '5' })).toHaveFocus()
    })

    const btn5 = screen.getByRole('button', { name: '5' })
    fireEvent.keyDown(btn5, { key: 'ArrowRight' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '6' })).toHaveAttribute('aria-current', 'page')
    })

    // 현재 그룹은 6..10
    const btn7 = screen.getByRole('button', { name: '7' })
    btn7.focus()
    fireEvent.keyDown(btn7, { key: 'Home' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '6' })).toHaveAttribute('aria-current', 'page')
    })

    fireEvent.keyDown(screen.getByRole('button', { name: '6' }), { key: 'End' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '10' })).toHaveAttribute('aria-current', 'page')
    })
  })

  it('Tab 키로 focus가 컴포넌트 내부에서 트랩됩니다', async () => {
    render(<PaginationHarness initialCurrentPage={1} totalPages={15} pageGroupSize={5} />)

    const nextButton = screen.getByRole('button', { name: '다음' })
    nextButton.focus()
    expect(nextButton).toHaveFocus()

    fireEvent.keyDown(nextButton, { key: 'Tab' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '1' })).toHaveFocus()
    })

    const page1 = screen.getByRole('button', { name: '1' })
    fireEvent.keyDown(page1, { key: 'Tab', shiftKey: true })

    await waitFor(() => {
      expect(nextButton).toHaveFocus()
    })
  })
})
