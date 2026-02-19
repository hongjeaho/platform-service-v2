import type { ReactNode } from 'react'

/**
 * Table 컬럼 정의
 */
export interface TableColumn<T> {
  /** 컬럼 key (데이터 필드명) */
  key: keyof T | string
  /** 컬럼 헤더 텍스트 */
  header: string
  /** 컬럼 너비 (예: '100px', '20%') */
  width?: string
  /** 텍스트 정렬 */
  align?: 'left' | 'center' | 'right'
  /** 정렬 가능 여부 */
  sortable?: boolean
  /** 커스텀 렌더링 함수 */
  render?: (value: T[keyof T], row: T, index: number) => ReactNode
}

/**
 * Table 정렬 설정
 */
export interface TableSortConfig {
  /** 정렬할 컬럼 key */
  key: string
  /** 정렬 방향 */
  direction: 'asc' | 'desc'
}

/**
 * Table 컴포넌트 Props
 */
export interface TableProps<T> {
  /** 컬럼 정의 배열 */
  columns: TableColumn<T>[]
  /** 데이터 배열 */
  data: T[]
  /**
   * 각 행의 unique key를 추출하는 함수.
   * 생략 시 row index를 key로 사용합니다.
   * selectable 사용 시 페이지 단위 데이터와 함께 쓰면 반드시 명시하세요.
   */
  keyExtractor?: (row: T, index: number) => string | number
  /** 행 선택 가능 여부 */
  selectable?: boolean
  /** 선택된 행 keys */
  selectedRows?: Set<string | number>
  /** 행 선택 변경 콜백 */
  onSelectRows?: (selectedRows: Set<string | number>) => void

  /** 데이터 없음 메시지 */
  emptyMessage?: string
  /** 테이블 크기 */
  size?: 'sm' | 'md' | 'lg'
  /** 스트라이프 스타일 (홀수 행 배경 다름) */
  striped?: boolean
  /** CSS 클래스 */
  className?: string
}
