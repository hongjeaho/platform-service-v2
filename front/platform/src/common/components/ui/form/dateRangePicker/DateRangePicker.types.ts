/**
 * DateRangePicker 컴포넌트 Props
 */
export interface DateRange {
  /** 시작 날짜 */
  startDate: Date | null
  /** 종료 날짜 */
  endDate: Date | null
}

export interface DateRangePickerProps {
  /** 선택된 날짜 범위 */
  value?: DateRange
  /** 날짜 범위 변경 콜백 */
  onChange?: (range: DateRange) => void
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
  /** DateRangePicker의 name 속성 (react-hook-form 호환) */
  name?: string
  /** CSS 클래스 */
  className?: string
  /** 최소 날짜 (이 날짜 이전은 선택 불가) */
  minDate?: Date
  /** 최대 날짜 (이 날짜 이후는 선택 불가) */
  maxDate?: Date
}
