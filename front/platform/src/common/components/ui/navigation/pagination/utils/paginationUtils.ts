/**
 * 페이지네이션 관련 유틸리티 함수들
 */

/**
 * 페이지네이션을 위한 계산 결과 타입
 */
export interface PaginationCalculation {
  /** 총 페이지 수 */
  totalPages: number
  /** 시작 페이지 번호 */
  startPage: number
  /** 끝 페이지 번호 */
  endPage: number
  /** 페이지 버튼 표시 여부를 위한 배열 */
  pageNumbers: number[]
  /** 이전 페이지 그룹으로 이동할 때의 시작 페이지 */
  prevGroupStart?: number
  /** 다음 페이지 그룹으로 이동할 때의 시작 페이지 */
  nextGroupStart?: number
}

/**
 * 페이지네이션 정보를 계산합니다.
 * 표시 구간은 visiblePageCount 단위의 고정 블록으로 정렬됩니다.
 * (예: visiblePageCount=5이면 1~5, 6~10, 11~15 ... 블록 단위로 노출)
 *
 * @param currentPage 현재 페이지 번호 (1-based)
 * @param totalItems 전체 아이템 개수
 * @param pageSize 페이지당 표시할 아이템 개수 (null이면 전체 표시로 1페이지만)
 * @param visiblePageCount 한 번에 표시할 페이지 버튼 개수 (기본: 10)
 * @returns 페이지네이션 계산 결과
 */
export function calculatePagination(
  currentPage: number,
  totalItems: number,
  pageSize: number | null,
  visiblePageCount: number = 10,
): PaginationCalculation {
  const effectiveSize = pageSize === null ? totalItems : pageSize
  if (effectiveSize >= totalItems) {
    return {
      totalPages: 1,
      startPage: 1,
      endPage: 1,
      pageNumbers: [1],
    }
  }

  const totalPages = Math.ceil(totalItems / effectiveSize)
  const blockIndex = Math.floor((currentPage - 1) / visiblePageCount)
  const startPage = blockIndex * visiblePageCount + 1
  const endPage = Math.min(totalPages, startPage + visiblePageCount - 1)

  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  const prevGroupStart =
    startPage > 1 ? Math.max(1, startPage - visiblePageCount) : undefined
  const nextGroupStart = endPage < totalPages ? endPage + 1 : undefined

  return {
    totalPages,
    startPage,
    endPage,
    pageNumbers,
    prevGroupStart,
    nextGroupStart,
  }
}

/**
 * 특정 페이지로 이동이 가능한지 확인합니다.
 */
export function isPageValid(page: number, totalPages: number): boolean {
  return page >= 1 && page <= totalPages
}

/**
 * 이전 페이지로 이동이 가능한지 확인합니다.
 */
export function canGoToPreviousPage(currentPage: number): boolean {
  return currentPage > 1
}

/**
 * 다음 페이지로 이동이 가능한지 확인합니다.
 */
export function canGoToNextPage(currentPage: number, totalPages: number): boolean {
  return currentPage < totalPages
}

/**
 * 페이지 이동 버튼에 대한 접근성 레이블을 생성합니다.
 */
export function getNavigationButtonLabel(
  action: 'first' | 'previous' | 'next' | 'last',
  targetPage?: number,
): string {
  const labels = {
    first: '첫 페이지로 이동',
    previous: '이전 페이지로 이동',
    next: '다음 페이지로 이동',
    last: '마지막 페이지로 이동',
  }

  if (targetPage) {
    return `${labels[action]} (${targetPage} 페이지)`
  }

  return labels[action]
}
