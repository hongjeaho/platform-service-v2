import type { ComponentPropsWithoutRef } from 'react'

/**
 * Checkbox 컴포넌트 Props
 *
 * React Hook Form과의 호환성:
 * - Controller render prop 내에서 spread 연산자 사용 권장: `{...field}`
 * - `field.value`가 `checked` prop으로, `field.onChange`가 `onChange` prop으로 자동 매핑
 * - `fieldState.error`를 `error` prop으로 전달하여 유효성 검증 결과 표시
 * - 이벤트 핸들러를 직접 사용하지 않고 RHF의 상태 관리에 위임
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
