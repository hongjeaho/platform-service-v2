import { useCallback } from 'react'

import {
  canGoToNextPage,
  canGoToPreviousPage,
  isPageValid,
} from './paginationUtils'

/**
 * 페이지네이션 핸들러 훅 Props
 */
export interface UsePaginationHandlersProps {
  /** 현재 페이지 번호 (1-based) */
  currentPage: number
  /** 총 페이지 수 */
  totalPages: number
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void
  /** 이전 페이지 그룹 시작 페이지 (선택사항) */
  prevGroupStart?: number
  /** 다음 페이지 그룹 시작 페이지 (선택사항) */
  nextGroupStart?: number
}

/**
 * 페이지네이션 핸들러 훅 반환값
 */
export interface PaginationHandlers {
  /** 페이지 클릭 핸들러 */
  handlePageClick: (page: number) => void
  /** 첫 페이지로 이동 핸들러 */
  handleFirstPage: () => void
  /** 이전 페이지로 이동 핸들러 */
  handlePreviousPage: () => void
  /** 다음 페이지로 이동 핸들러 */
  handleNextPage: () => void
  /** 마지막 페이지로 이동 핸들러 */
  handleLastPage: () => void
  /** 이전 페이지 그룹으로 이동 핸들러 */
  handlePrevGroup: () => void
  /** 다음 페이지 그룹으로 이동 핸들러 */
  handleNextGroup: () => void
}

/**
 * 페이지네이션 핸들러 훅
 * 페이지네이션 관련 핸들러 로직을 공유하기 위해 사용합니다.
 *
 * @example
 * ```tsx
 * const handlers = usePaginationHandlers({
 *   currentPage: 1,
 *   totalPages: 10,
 *   onPageChange: (page) => console.log(page),
 *   prevGroupStart: 1,
 *   nextGroupStart: 11,
 * })
 *
 * <button onClick={handlers.handleFirstPage}>First</button>
 * <button onClick={handlers.handlePreviousPage}>Previous</button>
 * ```
 */
export function usePaginationHandlers({
  currentPage,
  totalPages,
  onPageChange,
  prevGroupStart,
  nextGroupStart,
}: UsePaginationHandlersProps): PaginationHandlers {
  const handlePageClick = useCallback(
    (page: number) => {
      if (isPageValid(page, totalPages)) {
        onPageChange(page)
      }
    },
    [totalPages, onPageChange],
  )

  const handleFirstPage = useCallback(() => handlePageClick(1), [handlePageClick])

  const handlePreviousPage = useCallback(() => {
    if (canGoToPreviousPage(currentPage)) {
      handlePageClick(currentPage - 1)
    }
  }, [currentPage, handlePageClick])

  const handleNextPage = useCallback(() => {
    if (canGoToNextPage(currentPage, totalPages)) {
      handlePageClick(currentPage + 1)
    }
  }, [currentPage, totalPages, handlePageClick])

  const handleLastPage = useCallback(() => handlePageClick(totalPages), [handlePageClick, totalPages])

  const handlePrevGroup = useCallback(() => {
    if (prevGroupStart) {
      handlePageClick(prevGroupStart)
    }
  }, [prevGroupStart, handlePageClick])

  const handleNextGroup = useCallback(() => {
    if (nextGroupStart) {
      handlePageClick(nextGroupStart)
    }
  }, [nextGroupStart, handlePageClick])

  return {
    handlePageClick,
    handleFirstPage,
    handlePreviousPage,
    handleNextPage,
    handleLastPage,
    handlePrevGroup,
    handleNextGroup,
  }
}
