import type { ComponentPropsWithoutRef } from 'react'

/**
 * Checkbox 컴포넌트 Props
 */
export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'onChange'> {
  /** 체크 상태 */
  checked?: boolean
  /** 체크 상태 변경 콜백 */
  onChange?: (checked: boolean) => void
  /** 라벨 텍스트 */
  label?: string
  /** 설명 텍스트 */
  description?: string
  /** 에러 메시지 */
  error?: string
  /** 부분 선택 상태 (indeterminate) */
  indeterminate?: boolean
}
