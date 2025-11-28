/**
 * 단일 날짜 선택 DatePicker Props
 */
export interface DatePickerProps {
  /** 선택된 날짜 */
  value?: Date
  /** 날짜 변경 콜백 */
  onChange?: (date: Date | undefined) => void
  /** 플레이스홀더 텍스트 */
  placeholder?: string
  /** 비활성화 여부 */
  disabled?: boolean
  /** 최소 날짜 */
  minDate?: Date
  /** 최대 날짜 */
  maxDate?: Date
  /** 에러 메시지 */
  error?: string
  /** 라벨 */
  label?: string
  /** 필수 여부 */
  required?: boolean
  /** 입력 필드의 name 속성 */
  name?: string
  /** CSS 클래스 */
  className?: string
}

/**
 * 날짜 범위 DateRangePicker Props
 */
export interface DateRangeValue {
  from?: Date
  to?: Date
}

export interface DateRangePickerProps {
  /** 선택된 날짜 범위 */
  value?: DateRangeValue
  /** 날짜 범위 변경 콜백 */
  onChange?: (range: DateRangeValue) => void
  /** 플레이스홀더 텍스트 */
  placeholder?: string
  /** 비활성화 여부 */
  disabled?: boolean
  /** 최소 날짜 */
  minDate?: Date
  /** 최대 날짜 */
  maxDate?: Date
  /** 에러 메시지 */
  error?: string
  /** 라벨 */
  label?: string
  /** 필수 여부 */
  required?: boolean
  /** 입력 필드의 name 속성 */
  name?: string
  /** CSS 클래스 */
  className?: string
}
