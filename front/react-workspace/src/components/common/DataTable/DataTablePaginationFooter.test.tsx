import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DataTablePaginationFooter } from './DataTablePaginationFooter'

describe('DataTablePaginationFooter', () => {
  describe('렌더링', () => {
    it('페이지 네비게이션을 렌더링합니다', () => {
      render(<DataTablePaginationFooter currentPage={1} totalPages={5} onPageChange={() => {}} />)
      expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    })

    it('현재 페이지와 총 페이지 범위 내의 페이지 버튼을 렌더링합니다', () => {
      render(<DataTablePaginationFooter currentPage={1} totalPages={10} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    })

    it('현재 페이지에 aria-current="page" 속성을 추가합니다', () => {
      render(<DataTablePaginationFooter currentPage={3} totalPages={10} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
    })

    it('이전/다음 버튼을 렌더링합니다', () => {
      render(<DataTablePaginationFooter currentPage={3} totalPages={10} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument()
    })
  })

  describe('페이지 그룹화', () => {
    it('5개씩 페이지를 그룹화하여 표시합니다', () => {
      render(<DataTablePaginationFooter currentPage={1} totalPages={15} onPageChange={() => {}} />)
      // 첫 그룹: 1, 2, 3, 4, 5
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument()
    })

    it('두 번째 그룹을 표시합니다', () => {
      render(<DataTablePaginationFooter currentPage={6} totalPages={15} onPageChange={() => {}} />)
      // 두 번째 그룹: 6, 7, 8, 9, 10
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument()
    })

    it('마지막 그룹이 5개 미만이면 남은 페이지만 표시합니다', () => {
      render(<DataTablePaginationFooter currentPage={14} totalPages={15} onPageChange={() => {}} />)
      // 마지막 그룹: 11, 12, 13, 14, 15
      expect(screen.getByRole('button', { name: '11' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '15' })).toBeInTheDocument()
    })
  })

  describe('페이지 변경', () => {
    it('페이지 버튼 클릭 시 onPageChange를 호출합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={1} totalPages={10} onPageChange={onPageChange} />,
      )

      await user.click(screen.getByRole('button', { name: '3' }))
      expect(onPageChange).toHaveBeenCalledWith(3)
    })

    it('이전 버튼 클릭 시 이전 그룹의 첫 페이지로 이동합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={7} totalPages={20} onPageChange={onPageChange} />,
      )

      await user.click(screen.getByRole('button', { name: '이전' }))
      expect(onPageChange).toHaveBeenCalledWith(1) // 6 - 5 = 1
    })

    it('다음 버튼 클릭 시 다음 그룹의 첫 페이지로 이동합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={3} totalPages={20} onPageChange={onPageChange} />,
      )

      await user.click(screen.getByRole('button', { name: '다음' }))
      expect(onPageChange).toHaveBeenCalledWith(6) // 1 + 5 = 6
    })

    it('현재 페이지와 같은 페이지를 클릭하면 onPageChange를 호출하지 않습니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={3} totalPages={10} onPageChange={onPageChange} />,
      )

      await user.click(screen.getByRole('button', { name: '3', current: 'page' }))
      expect(onPageChange).not.toHaveBeenCalled()
    })
  })

  describe('버튼 비활성화', () => {
    it('첫 그룹에서는 이전 버튼이 비활성화됩니다', () => {
      render(<DataTablePaginationFooter currentPage={1} totalPages={10} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '이전' })).toBeDisabled()
    })

    it('마지막 그룹에서는 다음 버튼이 비활성화됩니다', () => {
      render(<DataTablePaginationFooter currentPage={14} totalPages={15} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '다음' })).toBeDisabled()
    })

    it('중간 그룹에서는 두 버튼 모두 활성화됩니다', () => {
      render(<DataTablePaginationFooter currentPage={7} totalPages={20} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '이전' })).toBeEnabled()
      expect(screen.getByRole('button', { name: '다음' })).toBeEnabled()
    })
  })

  describe('키보드 내비게이션', () => {
    it('ArrowLeft 키로 이전 페이지로 이동합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={3} totalPages={10} onPageChange={onPageChange} />,
      )

      const currentPageButton = screen.getByRole('button', { name: '3', current: 'page' })
      currentPageButton.focus()
      await user.keyboard('{ArrowLeft}')

      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('ArrowRight 키로 다음 페이지로 이동합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={3} totalPages={10} onPageChange={onPageChange} />,
      )

      const currentPageButton = screen.getByRole('button', { name: '3', current: 'page' })
      currentPageButton.focus()
      await user.keyboard('{ArrowRight}')

      expect(onPageChange).toHaveBeenCalledWith(4)
    })

    it('Home 키로 그룹의 첫 페이지로 이동합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={7} totalPages={20} onPageChange={onPageChange} />,
      )

      const currentPageButton = screen.getByRole('button', { name: '7', current: 'page' })
      currentPageButton.focus()
      await user.keyboard('{Home}')

      expect(onPageChange).toHaveBeenCalledWith(6) // 현재 그룹의 첫 페이지
    })

    it('End 키로 그룹의 마지막 페이지로 이동합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTablePaginationFooter currentPage={7} totalPages={20} onPageChange={onPageChange} />,
      )

      const currentPageButton = screen.getByRole('button', { name: '7', current: 'page' })
      currentPageButton.focus()
      await user.keyboard('{End}')

      expect(onPageChange).toHaveBeenCalledWith(10) // 현재 그룹의 마지막 페이지
    })
  })

  describe('포커스 관리', () => {
    it('페이지 변경 후 새 페이지 버튼에 포커스를 이동합니다', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      const { rerender } = render(
        <DataTablePaginationFooter currentPage={1} totalPages={10} onPageChange={onPageChange} />,
      )

      await user.click(screen.getByRole('button', { name: '3' }))
      expect(onPageChange).toHaveBeenCalledWith(3)

      // 페이지 상태 변경을 시뮬레이션
      rerender(
        <DataTablePaginationFooter currentPage={3} totalPages={10} onPageChange={onPageChange} />,
      )

      await waitFor(() => {
        const button3 = screen.getByRole('button', { name: '3', current: 'page' })
        expect(button3).toHaveFocus()
      })
    })
  })

  describe('범위 요약', () => {
    it('totalItems와 pageSize가 있으면 범위 요약을 표시합니다', () => {
      render(
        <DataTablePaginationFooter
          currentPage={2}
          totalPages={10}
          onPageChange={() => {}}
          totalItems={95}
          pageSize={10}
        />,
      )
      expect(screen.getByText('총 95건 중 11–20')).toBeInTheDocument()
    })

    it('마지막 페이지에서는 totalItems까지만 표시합니다', () => {
      render(
        <DataTablePaginationFooter
          currentPage={10}
          totalPages={10}
          onPageChange={() => {}}
          totalItems={95}
          pageSize={10}
        />,
      )
      expect(screen.getByText('총 95건 중 91–95')).toBeInTheDocument()
    })

    it('totalItems나 pageSize가 없으면 요약을 표시하지 않습니다', () => {
      render(<DataTablePaginationFooter currentPage={1} totalPages={10} onPageChange={() => {}} />)
      expect(screen.queryByText(/총.*건/)).not.toBeInTheDocument()
    })
  })

  describe('경계 케이스', () => {
    it('totalPages가 1 미만이면 1로 처리합니다', () => {
      render(<DataTablePaginationFooter currentPage={1} totalPages={0} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    })

    it('currentPage가 1 미만이면 1로 처리합니다', () => {
      render(<DataTablePaginationFooter currentPage={-5} totalPages={10} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '1', current: 'page' })).toBeInTheDocument()
    })

    it('currentPage가 totalPages를 초과하면 마지막 페이지로 처리합니다', () => {
      render(<DataTablePaginationFooter currentPage={100} totalPages={5} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '5', current: 'page' })).toBeInTheDocument()
    })

    it('소수값이 들어오면 내림하여 처리합니다', () => {
      render(
        <DataTablePaginationFooter currentPage={3.7} totalPages={5.8} onPageChange={() => {}} />,
      )
      expect(screen.getByRole('button', { name: '3', current: 'page' })).toBeInTheDocument()
    })

    it('totalPages가 5개 이하면 모든 페이지를 표시합니다', () => {
      render(<DataTablePaginationFooter currentPage={3} totalPages={5} onPageChange={() => {}} />)
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    })
  })
})
