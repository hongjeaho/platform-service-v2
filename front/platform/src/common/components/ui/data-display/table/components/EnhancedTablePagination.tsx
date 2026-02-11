import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from '../Table.module.css'
import {
  calculatePagination,
  canGoToNextPage,
  canGoToPreviousPage,
  getNavigationButtonLabel,
  isPageValid,
} from '../utils/paginationUtils'

/**
 * 고급 테이블 페이지네이션 컴포넌트 Props
 */
export interface EnhancedTablePaginationProps {
  /** 현재 페이지 번호 (1-based) */
  currentPage: number
  /** 전체 아이템 개수 */
  totalItems: number
  /** 페이지당 표시할 아이템 개수 (null이면 전체 표시) */
  pageSize: number | null
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void
  /** 한 번에 표시할 페이지 버튼 개수 (기본: 10) */
  visiblePageCount?: number
  /** 페이지 크기 변경 핸들러 (선택사항) */
  onPageSizeChange?: (pageSize: number | null) => void
  /** 페이지네이션 정보 표시 여부 (기본: true) */
  showPaginationInfo?: boolean
  /** CSS 클래스 추가 */
  className?: string
}

/**
 * 고급 테이블 페이지네이션 컴포넌트
 * 페이지 번호 버튼, 네비게이션 버튼, 전체 표시 기능을 지원합니다.
 */
export function EnhancedTablePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  visiblePageCount = 10,
  onPageSizeChange,
  showPaginationInfo = true,
  className,
}: EnhancedTablePaginationProps) {
  // 전체 표시 모드인 경우 페이지네이션을 표시하지 않음
  if (pageSize === null || pageSize >= totalItems) {
    return (
      <div className={cn(styles.paginationContainer, className)}>
        {showPaginationInfo && (
          <span className={cn(styles.paginationInfo, textCombinations.bodySm)}>
            전체 {totalItems}개 항목 표시
          </span>
        )}
        {onPageSizeChange && (
          <div className={styles.paginationControls}>
            <button
              className={cn(styles.paginationButton, styles.pageSizeButton)}
              onClick={() => onPageChange(null)}
              aria-label='페이지당 항목 개수로 변경'
            >
              {pageSize}개 표시
            </button>
          </div>
        )}
      </div>
    )
  }

  const { totalPages, startPage, endPage, pageNumbers, prevGroupStart, nextGroupStart } =
    calculatePagination(currentPage, totalItems, pageSize, visiblePageCount)

  const handlePageClick = (page: number) => {
    if (isPageValid(page, totalPages)) {
      onPageChange(page)
    }
  }

  const handleFirstPage = () => {
    handlePageClick(1)
  }

  const handlePreviousPage = () => {
    if (canGoToPreviousPage(currentPage)) {
      handlePageClick(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (canGoToNextPage(currentPage, totalPages)) {
      handlePageClick(currentPage + 1)
    }
  }

  const handleLastPage = () => {
    handlePageClick(totalPages)
  }

  const handlePrevGroup = () => {
    if (prevGroupStart) {
      handlePageClick(prevGroupStart)
    }
  }

  const handleNextGroup = () => {
    if (nextGroupStart) {
      handlePageClick(nextGroupStart)
    }
  }

  const showEllipsisStart = startPage > 1
  const showEllipsisEnd = endPage < totalPages

  return (
    <div className={cn(styles.paginationContainer, className)}>
      {showPaginationInfo && (
        <span className={cn(styles.paginationInfo, textCombinations.bodySm)}>
          총 {totalItems}개 항목 ({pageSize}개씩)
        </span>
      )}

      <div className={styles.paginationControls}>
        {/* 첫 페이지 버튼 */}
        <button
          className={styles.paginationButton}
          onClick={handleFirstPage}
          disabled={!canGoToPreviousPage(currentPage)}
          aria-label={getNavigationButtonLabel('first')}
          title={getNavigationButtonLabel('first')}
        >
          <ChevronFirst size={16} />
        </button>

        {/* 이전 페이지 버튼 */}
        <button
          className={styles.paginationButton}
          onClick={handlePreviousPage}
          disabled={!canGoToPreviousPage(currentPage)}
          aria-label={getNavigationButtonLabel('previous')}
          title={getNavigationButtonLabel('previous')}
        >
          <ChevronLeft size={16} />
        </button>

        {/* 페이지 번호 버튼 그룹 */}
        {showEllipsisStart && (
          <>
            {/* 첫 페이지로 빠르게 이동 */}
            <button
              className={styles.paginationButton}
              onClick={() => handlePageClick(1)}
              aria-label='1 페이지로 이동'
            >
              1
            </button>

            {/* 이전 그룹으로 이동 */}
            {prevGroupStart && (
              <button
                className={styles.paginationButton}
                onClick={handlePrevGroup}
                aria-label={`${prevGroupStart} 페이지 그룹으로 이동`}
              >
                {'<'}
              </button>
            )}

            {/* 말줄임표 */}
            <span className={styles.paginationEllipsis}>...</span>
          </>
        )}

        {/* 현재 그룹의 페이지 번호 버튼들 */}
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            className={cn(
              styles.paginationButton,
              styles.pageNumberButton,
              pageNum === currentPage && styles.active,
            )}
            onClick={() => handlePageClick(pageNum)}
            aria-label={`${pageNum} 페이지`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        {/* 마지막 페이지 그룹 */}
        {showEllipsisEnd && (
          <>
            {/* 말줄임표 */}
            <span className={styles.paginationEllipsis}>...</span>

            {/* 다음 그룹으로 이동 */}
            {nextGroupStart && (
              <button
                className={styles.paginationButton}
                onClick={handleNextGroup}
                aria-label={`${nextGroupStart} 페이지 그룹으로 이동`}
              >
                {'>'}
              </button>
            )}

            {/* 마지막 페이지로 빠르게 이동 */}
            {totalPages > endPage && (
              <button
                className={styles.paginationButton}
                onClick={() => handlePageClick(totalPages)}
                aria-label={`${totalPages} 페이지로 이동`}
              >
                {totalPages}
              </button>
            )}
          </>
        )}

        {/* 다음 페이지 버튼 */}
        <button
          className={styles.paginationButton}
          onClick={handleNextPage}
          disabled={!canGoToNextPage(currentPage, totalPages)}
          aria-label={getNavigationButtonLabel('next')}
          title={getNavigationButtonLabel('next')}
        >
          <ChevronRight size={16} />
        </button>

        {/* 마지막 페이지 버튼 */}
        <button
          className={styles.paginationButton}
          onClick={handleLastPage}
          disabled={!canGoToNextPage(currentPage, totalPages)}
          aria-label={getNavigationButtonLabel('last')}
          title={getNavigationButtonLabel('last')}
        >
          <ChevronLast size={16} />
        </button>
      </div>

      {/* 페이지 크기 변경 옵션 */}
      {onPageSizeChange && (
        <div className={styles.pageSizeSelector}>
          <button
            className={cn(styles.paginationButton, styles.pageSizeButton)}
            onClick={() => onPageSizeChange(null)}
            aria-label='전체 표시'
          >
            전체
          </button>
        </div>
      )}
    </div>
  )
}

EnhancedTablePagination.displayName = 'EnhancedTablePagination'
