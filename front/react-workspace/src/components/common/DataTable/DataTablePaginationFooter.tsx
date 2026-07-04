import { useEffect, useMemo, useRef } from 'react'

import { icons, iconSizes } from '@/styles'

import styles from './DataTable.module.css'

const PAGE_GROUP_SIZE = 5

function clampToRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

interface DataTablePaginationFooterProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
}

/**
 * DataTable 전용 페이지네이션 푸터
 *
 * 예전에는 공통 `Pagination` 컴포넌트를 별도 블록으로 아래에 띄웠으나,
 * DataTable 외 다른 소비처가 없어 카드 안에 자연스럽게 이어지는 조용한
 * 톤의 푸터로 흡수했다(테이블 바로 아래, border-top으로만 구분).
 */
export function DataTablePaginationFooter({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: DataTablePaginationFooterProps) {
  const safeTotalPages = useMemo(() => Math.max(1, Math.floor(totalPages)), [totalPages])
  const safeCurrentPage = useMemo(
    () => clampToRange(Math.floor(currentPage), 1, safeTotalPages),
    [currentPage, safeTotalPages],
  )

  const groupIndex = Math.floor((safeCurrentPage - 1) / PAGE_GROUP_SIZE)
  const groupStart = groupIndex * PAGE_GROUP_SIZE + 1
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, safeTotalPages)

  const pages = useMemo(
    () => Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i),
    [groupEnd, groupStart],
  )

  const prevTargetPage = groupStart === 1 ? 1 : groupStart - PAGE_GROUP_SIZE
  const nextTargetPage = groupEnd === safeTotalPages ? safeTotalPages : groupStart + PAGE_GROUP_SIZE

  const pageButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const navRef = useRef<HTMLElement | null>(null)
  const shouldFocusRef = useRef(false)

  const triggerPageChange = (targetPage: number) => {
    const normalized = clampToRange(Math.floor(targetPage), 1, safeTotalPages)
    if (normalized === safeCurrentPage) return

    shouldFocusRef.current = true
    onPageChange(normalized)
  }

  useEffect(() => {
    if (!shouldFocusRef.current) return
    requestAnimationFrame(() => {
      const node = pageButtonRefs.current[safeCurrentPage]
      if (node) node.focus()
      shouldFocusRef.current = false
    })
  }, [safeCurrentPage])

  const handlePageButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      triggerPageChange(safeCurrentPage - 1)
      return
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      triggerPageChange(safeCurrentPage + 1)
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      triggerPageChange(groupStart)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      triggerPageChange(groupEnd)
    }
  }

  const handleNavKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab') return
    const navEl = navRef.current
    if (!navEl) return

    const active = document.activeElement
    if (!active || !navEl.contains(active)) return

    const tabbables = Array.from(
      navEl.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
    ).filter(btn => btn.tabIndex !== -1)
    if (tabbables.length === 0) return

    const currentIndex = tabbables.indexOf(active as HTMLButtonElement)
    if (currentIndex === -1) return

    e.preventDefault()
    const nextIndex = e.shiftKey
      ? currentIndex === 0
        ? tabbables.length - 1
        : currentIndex - 1
      : currentIndex === tabbables.length - 1
        ? 0
        : currentIndex + 1
    tabbables[nextIndex]?.focus()
  }

  const rangeSummary =
    totalItems != null && pageSize != null
      ? `총 ${totalItems.toLocaleString()}건 중 ${(safeCurrentPage - 1) * pageSize + 1}–${Math.min(safeCurrentPage * pageSize, totalItems)}`
      : null

  return (
    <div className={styles.paginationFooter}>
      {rangeSummary && <span className={styles.paginationSummary}>{rangeSummary}</span>}
      <nav
        ref={navRef}
        className={styles.paginationNav}
        aria-label='Pagination'
        onKeyDown={handleNavKeyDown}
      >
        <button
          type='button'
          className={styles.paginationNavButton}
          onClick={() => triggerPageChange(prevTargetPage)}
          disabled={groupStart === 1}
          aria-label='이전'
        >
          <icons.prev className={iconSizes.sm} aria-hidden='true' />
        </button>

        {pages.map(page => (
          <button
            key={page}
            ref={el => {
              pageButtonRefs.current[page] = el
            }}
            type='button'
            className={[
              styles.paginationPageButton,
              page === safeCurrentPage ? styles.paginationPageButtonActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            tabIndex={page === safeCurrentPage ? 0 : -1}
            aria-current={page === safeCurrentPage ? 'page' : undefined}
            onClick={() => triggerPageChange(page)}
            onKeyDown={handlePageButtonKeyDown}
          >
            {page}
          </button>
        ))}

        <button
          type='button'
          className={styles.paginationNavButton}
          onClick={() => triggerPageChange(nextTargetPage)}
          disabled={groupEnd === safeTotalPages}
          aria-label='다음'
        >
          <icons.next className={iconSizes.sm} aria-hidden='true' />
        </button>
      </nav>
    </div>
  )
}
