import { icons, iconSizes } from '@/constants/design/icons'
import { cn } from '@/lib/utils'

import { usePaginationHandlers } from '@/common/components/ui/data-display/table/utils/usePaginationHandlers'

import styles from './Pagination.module.css'
import type { PaginationProps } from './Pagination.types'
import {
  calculatePagination,
  canGoToNextPage,
  canGoToPreviousPage,
  getNavigationButtonLabel,
} from './utils/paginationUtils'

const FirstIcon = icons.first
const LastIcon = icons.last
const PrevIcon = icons.prev
const NextIcon = icons.next

/**
 * Pagination 컴포넌트
 * 처음, 이전 그룹, 페이지 번호(1~n), 다음 그룹, 마지막 버튼으로 페이지 이동을 제공합니다.
 * visiblePageCount로 표시할 페이지 버튼 개수(한 그룹 크기)를 설정할 수 있습니다.
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  visiblePageCount = 10,
  compact = false,
  className,
}: PaginationProps) {
  const isShowAll = pageSize === null
  const effectivePageSize = isShowAll ? totalItems : pageSize
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize))
  const { pageNumbers, startPage, endPage, prevGroupStart, nextGroupStart } = calculatePagination(
    currentPage,
    totalItems,
    pageSize,
    visiblePageCount,
  )

  const {
    handlePageClick,
    handleFirstPage,
    handleLastPage,
    handlePrevGroup,
    handleNextGroup,
  } = usePaginationHandlers({
    currentPage,
    totalPages,
    onPageChange,
    prevGroupStart,
    nextGroupStart,
  })

  const prevGroupEnd =
    prevGroupStart !== undefined
      ? Math.min(totalPages, prevGroupStart + visiblePageCount - 1)
      : undefined
  const nextGroupEnd =
    nextGroupStart !== undefined
      ? Math.min(totalPages, nextGroupStart + visiblePageCount - 1)
      : undefined

  const prevGroupLabel =
    prevGroupEnd !== undefined
      ? `이전 페이지 그룹(${prevGroupStart}~${prevGroupEnd})으로 이동`
      : undefined
  const nextGroupLabel =
    nextGroupEnd !== undefined
      ? `다음 페이지 그룹(${nextGroupStart}~${nextGroupEnd})으로 이동`
      : undefined

  return (
    <div className={cn(styles.paginationContainer, className)}>
      {!isShowAll && (
      <div className={styles.paginationControls}>
        {!compact && (
          <button
            type='button'
            className={styles.paginationButton}
            onClick={handleFirstPage}
            disabled={!canGoToPreviousPage(currentPage)}
            aria-label={getNavigationButtonLabel('first')}
            title={getNavigationButtonLabel('first')}
          >
            <FirstIcon className={iconSizes.md} aria-hidden='true' />
          </button>
        )}

        <button
          type='button'
          className={styles.paginationButton}
          onClick={handlePrevGroup}
          disabled={prevGroupStart === undefined}
          aria-label={prevGroupLabel ?? '이전 페이지 그룹으로 이동'}
          title={prevGroupLabel ?? '이전 페이지 그룹으로 이동'}
        >
          <PrevIcon className={iconSizes.md} aria-hidden='true' />
        </button>

        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            type='button'
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

        <button
          type='button'
          className={styles.paginationButton}
          onClick={handleNextGroup}
          disabled={nextGroupStart === undefined}
          aria-label={nextGroupLabel ?? '다음 페이지 그룹으로 이동'}
          title={nextGroupLabel ?? '다음 페이지 그룹으로 이동'}
        >
          <NextIcon className={iconSizes.md} aria-hidden='true' />
        </button>

        {!compact && (
          <button
            type='button'
            className={styles.paginationButton}
            onClick={handleLastPage}
            disabled={!canGoToNextPage(currentPage, totalPages)}
            aria-label={getNavigationButtonLabel('last')}
            title={getNavigationButtonLabel('last')}
          >
            <LastIcon className={iconSizes.md} aria-hidden='true' />
          </button>
        )}
      </div>
      )}
    </div>
  )
}

Pagination.displayName = 'Pagination'
