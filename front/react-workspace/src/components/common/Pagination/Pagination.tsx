import { useEffect, useMemo, useRef } from 'react'

import { icons, iconSizes } from '@/styles'

import styles from './Pagination.module.css'
import type { PaginationColor, PaginationProps, PaginationVariant } from './Pagination.type'

function clampToRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'primary',
  color = 'primary',
  showFirstButton = false,
  showLastButton = false,
  pageGroupSize = 5,
  showPageNumbersOnly = false,
}: PaginationProps) {
  const safeTotalPages = useMemo(() => Math.max(1, Math.floor(totalPages)), [totalPages])
  const safePageGroupSize = useMemo(() => Math.max(1, Math.floor(pageGroupSize)), [pageGroupSize])
  const safeCurrentPage = useMemo(
    () => clampToRange(Math.floor(currentPage), 1, safeTotalPages),
    [currentPage, safeTotalPages],
  )

  const groupIndex = Math.floor((safeCurrentPage - 1) / safePageGroupSize)
  const groupStart = groupIndex * safePageGroupSize + 1
  const groupEnd = Math.min(groupStart + safePageGroupSize - 1, safeTotalPages)

  const pages = useMemo(() => {
    if (showPageNumbersOnly) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1)
    }

    return Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i)
  }, [groupEnd, groupStart, safeTotalPages, showPageNumbersOnly])

  const prevTargetPage = groupStart === 1 ? 1 : groupStart - safePageGroupSize
  const nextTargetPage =
    groupEnd === safeTotalPages ? safeTotalPages : groupStart + safePageGroupSize

  const pageButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const navRef = useRef<HTMLElement | null>(null)
  const shouldFocusRef = useRef(false)

  const activePageClasses: Record<PaginationColor, string> = {
    primary: styles.pageActivePrimary,
    secondary: styles.pageActiveSecondary,
    tertiary: styles.pageActiveTertiary,
  }

  const inactivePageClasses: Record<PaginationVariant, string> = {
    primary: styles.pageInactivePrimary,
    secondary: styles.pageInactiveSecondary,
    tertiary: styles.pageInactiveTertiary,
  }

  const controlVariantClasses: Record<PaginationVariant, string> = {
    primary: styles.controlVariantPrimary,
    secondary: styles.controlVariantSecondary,
    tertiary: styles.controlVariantTertiary,
  }

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
      triggerPageChange(showPageNumbersOnly ? 1 : groupStart)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      triggerPageChange(showPageNumbersOnly ? safeTotalPages : groupEnd)
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

  const pageCircleClass = (page: number) => {
    const isCurrent = page === safeCurrentPage
    if (isCurrent) return activePageClasses[color]
    return inactivePageClasses[variant]
  }

  const controlVariantClass = controlVariantClasses[variant]

  return (
    <nav
      ref={navRef}
      className={styles.wrapper}
      aria-label='Pagination'
      onKeyDown={handleNavKeyDown}
    >
      {!showPageNumbersOnly && showFirstButton && (
        <button
          type='button'
          className={[styles.navButton, controlVariantClass].join(' ')}
          onClick={() => triggerPageChange(1)}
          disabled={safeCurrentPage === 1}
          aria-label='처음'
        >
          <icons.first className={[styles.icon, iconSizes.sm].join(' ')} aria-hidden='true' />
        </button>
      )}

      {!showPageNumbersOnly && (
        <button
          type='button'
          className={[styles.navButton, controlVariantClass].join(' ')}
          onClick={() => triggerPageChange(prevTargetPage)}
          disabled={groupStart === 1}
          aria-label='이전'
        >
          <icons.prev className={[styles.icon, iconSizes.sm].join(' ')} aria-hidden='true' />
        </button>
      )}

      {pages.map(page => (
        <button
          key={page}
          ref={el => {
            pageButtonRefs.current[page] = el
          }}
          type='button'
          className={[styles.pageButton, pageCircleClass(page)].join(' ')}
          tabIndex={page === safeCurrentPage ? 0 : -1}
          aria-current={page === safeCurrentPage ? 'page' : undefined}
          onClick={() => triggerPageChange(page)}
          onKeyDown={handlePageButtonKeyDown}
        >
          {page}
        </button>
      ))}

      {!showPageNumbersOnly && (
        <>
          <button
            type='button'
            className={[styles.navButton, controlVariantClass].join(' ')}
            onClick={() => triggerPageChange(nextTargetPage)}
            disabled={groupEnd === safeTotalPages}
            aria-label='다음'
          >
            <icons.next className={[styles.icon, iconSizes.sm].join(' ')} aria-hidden='true' />
          </button>

          {showLastButton && (
            <button
              type='button'
              className={[styles.navButton, controlVariantClass].join(' ')}
              onClick={() => triggerPageChange(safeTotalPages)}
              disabled={safeCurrentPage === safeTotalPages}
              aria-label='마지막'
            >
              <icons.last className={[styles.icon, iconSizes.sm].join(' ')} aria-hidden='true' />
            </button>
          )}
        </>
      )}
    </nav>
  )
}
