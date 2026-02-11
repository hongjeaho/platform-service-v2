/**
 * Radio 옵션 인터페이스
 */
export interface RadioOption<T = string> {
  /** 옵션 라벨 */
  label: string
  /** 옵션 값 */
  value: T
  /** 옵션 비활성화 여부 */
  disabled?: boolean
  /** 옵션 설명 텍스트 */
  description?: string
}

/**
 * RadioGroup 컴포넌트 Props
 */
export interface RadioGroupProps<T = string> {
  /** Radio 옵션 목록 */
  options: RadioOption<T>[]
  /** 선택된 값 */
  value?: T
  /** 값 변경 콜백 */
  onChange?: (value: T) => void
  /** 라디오 레이아웃 방향 */
  orientation?: 'horizontal' | 'vertical'
  /** 에러 메시지 */
  error?: string
  /** 라벨 */
  label?: string
  /** 필수 여부 */
  required?: boolean
  /** 라디오 그룹 name */
  name?: string
  /** 비활성화 여부 */
  disabled?: boolean
}
