/**
 * Select 옵션 인터페이스
 */
export interface SelectOption<T = string> {
  /** 옵션 라벨 */
  label: string
  /** 옵션 값 */
  value: T
  /** 옵션 비활성화 여부 */
  disabled?: boolean
}

/**
 * Select 컴포넌트 Props
 */
export interface SelectProps<T = string> {
  /** Select 옵션 목록 */
  options: SelectOption<T>[]
  /** 선택된 값 */
  value?: T
  /** 값 변경 콜백 */
  onChange?: (value: T) => void
  /** 플레이스홀더 텍스트 */
  placeholder?: string
  /** 에러 메시지 */
  error?: string
  /** 라벨 */
  label?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** Select의 name 속성 */
  name?: string
  /** CSS 클래스 */
  className?: string
  /** 검색 기능 활성화 여부 */
  searchable?: boolean
  /** 검색 입력창 플레이스홀더 */
  searchPlaceholder?: string
  /** 검색 결과 없을 때 메시지 */
  emptyMessage?: string
}
