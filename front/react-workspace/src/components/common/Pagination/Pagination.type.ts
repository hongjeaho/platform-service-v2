export type PaginationVariant = 'primary' | 'secondary' | 'tertiary'

export type PaginationColor = 'primary' | 'secondary' | 'tertiary'

export interface PaginationProps {
  /**
   * 현재 페이지 (1-based)
   * @default 1
   */
  currentPage: number

  /**
   * 전체 페이지 수
   * @default 1
   */
  totalPages: number

  /**
   * 페이지 이동 콜백 (target page: 1..totalPages)
   */
  onPageChange: (page: number) => void

  /**
   * 비활성(현재가 아닌) 페이지/컨트롤 버튼 시각적 변형
   * @default 'primary'
   */
  variant?: PaginationVariant

  /**
   * 활성(현재) 페이지 버튼 색상
   * @default 'primary'
   */
  color?: PaginationColor

  /**
   * 첫 페이지 버튼 노출
   * @default false
   */
  showFirstButton?: boolean

  /**
   * 마지막 페이지 버튼 노출
   * @default false
   */
  showLastButton?: boolean

  /**
   * 페이지 번호 그룹 크기 (예: 5 -> 1..5, 6..10)
   * @default 5
   */
  pageGroupSize?: number

  /**
   * 페이지 번호만 간단히 노출 (이전/다음/처음/마지막 숨김)
   * @default false
   */
  showPageNumbersOnly?: boolean
}
