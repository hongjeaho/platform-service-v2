import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Pagination.module.css'
import type { PaginationProps } from './Pagination.types'
import {
  calculatePagination,
  canGoToNextPage,
  canGoToPreviousPage,
  getNavigationButtonLabel,
  isPageValid,
} from './utils/paginationUtils'

const FirstIcon = icons.first
const LastIcon = icons.last
const PrevIcon = icons.prev
const NextIcon = icons.next

/**
 * Pagination 컴포넌트
 * 처음, 이전, 페이지 번호(1~n), 다음, 마지막 버튼으로 페이지 이동을 제공합니다.
 * visiblePageCount로 표시할 페이지 버튼 개수를 설정할 수 있습니다.
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  visiblePageCount = 10,
  showInfo = true,
  compact = false,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const { pageNumbers, startPage, endPage, prevGroupStart, nextGroupStart } = calculatePagination(
    currentPage,
    totalItems,
    pageSize,
    visiblePageCount,
  )

  const handlePageClick = (page: number) => {
    if (isPageValid(page, totalPages)) {
      onPageChange(page)
    }
  }

  const handleFirstPage = () => handlePageClick(1)
  const handlePreviousPage = () => {
    if (canGoToPreviousPage(currentPage)) handlePageClick(currentPage - 1)
  }
  const handleNextPage = () => {
    if (canGoToNextPage(currentPage, totalPages)) handlePageClick(currentPage + 1)
  }
  const handleLastPage = () => handlePageClick(totalPages)
  const handlePrevGroup = () => prevGroupStart && handlePageClick(prevGroupStart)
  const handleNextGroup = () => nextGroupStart && handlePageClick(nextGroupStart)

  const showEllipsisStart = startPage > 1
  const showEllipsisEnd = endPage < totalPages

  return (
    <div className={cn(styles.paginationContainer, className)}>
      {showInfo && (
        <span className={cn(styles.paginationInfo, textCombinations.bodySm)}>
          총 {totalItems}개 항목 ({pageSize}개씩)
        </span>
      )}

      <div className={styles.paginationControls}>
        {!compact && (
          <button
            type="button"
            className={styles.paginationButton}
            onClick={handleFirstPage}
            disabled={!canGoToPreviousPage(currentPage)}
            aria-label={getNavigationButtonLabel('first')}
            title={getNavigationButtonLabel('first')}
          >
            <FirstIcon className={iconSizes.md} aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          className={styles.paginationButton}
          onClick={handlePreviousPage}
          disabled={!canGoToPreviousPage(currentPage)}
          aria-label={getNavigationButtonLabel('previous')}
          title={getNavigationButtonLabel('previous')}
        >
          <PrevIcon className={iconSizes.md} aria-hidden="true" />
        </button>

        {showEllipsisStart && (
          <>
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => handlePageClick(1)}
              aria-label="1 페이지로 이동"
            >
              1
            </button>
            {prevGroupStart !== undefined && (
              <button
                type="button"
                className={styles.paginationButton}
                onClick={handlePrevGroup}
                aria-label={`${prevGroupStart} 페이지 그룹으로 이동`}
              >
                {'<'}
              </button>
            )}
            <span className={styles.paginationEllipsis}>...</span>
          </>
        )}

        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            type="button"
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

        {showEllipsisEnd && (
          <>
            <span className={styles.paginationEllipsis}>...</span>
            {nextGroupStart !== undefined && (
              <button
                type="button"
                className={styles.paginationButton}
                onClick={handleNextGroup}
                aria-label={`${nextGroupStart} 페이지 그룹으로 이동`}
              >
                {'>'}
              </button>
            )}
            {totalPages > endPage && (
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => handlePageClick(totalPages)}
                aria-label={`${totalPages} 페이지로 이동`}
              >
                {totalPages}
              </button>
            )}
          </>
        )}

        <button
          type="button"
          className={styles.paginationButton}
          onClick={handleNextPage}
          disabled={!canGoToNextPage(currentPage, totalPages)}
          aria-label={getNavigationButtonLabel('next')}
          title={getNavigationButtonLabel('next')}
        >
          <NextIcon className={iconSizes.md} aria-hidden="true" />
        </button>

        {!compact && (
          <button
            type="button"
            className={styles.paginationButton}
            onClick={handleLastPage}
            disabled={!canGoToNextPage(currentPage, totalPages)}
            aria-label={getNavigationButtonLabel('last')}
            title={getNavigationButtonLabel('last')}
          >
            <LastIcon className={iconSizes.md} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

Pagination.displayName = 'Pagination'
