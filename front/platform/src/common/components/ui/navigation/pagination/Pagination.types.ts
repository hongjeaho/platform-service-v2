/**
 * Pagination 컴포넌트 Props
 */
export interface PaginationProps {
  /** 현재 페이지 번호 (1-based) */
  currentPage: number
  /** 전체 아이템 개수 */
  totalItems: number
  /** 페이지당 표시할 아이템 개수 */
  pageSize: number
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void
  /** 한 번에 표시할 페이지 버튼 개수 (기본: 10) */
  visiblePageCount?: number
  /** 페이지네이션 정보 표시 여부 (기본: true) */
  showInfo?: boolean
  /** 컴팩트 모드 (처음/마지막 버튼 숨김) */
  compact?: boolean
  /** CSS 클래스 */
  className?: string
}
