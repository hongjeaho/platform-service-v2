import type { ComponentPropsWithoutRef } from 'react'

/**
 * Input 컴포넌트 Props
 *
 * React Hook Form과의 호환성:
 * - Controller render prop 내에서 spread 연산자 사용 권장: `{...field}`
 * - `field.value`가 `value` prop으로, `field.onChange`가 `onChange` prop으로 자동 매핑
 * - `fieldState.error`를 `error` prop으로 전달하여 유효성 검증 결과 표시
 * - 이벤트 핸들러를 직접 사용하지 않고 RHF의 상태 관리에 위임
 */
export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> {
  /** 입력 값 */
  value?: string
  /** 값 변경 콜백 */
  onChange?: (value: string) => void
  /** 라벨 텍스트 */
  label?: string
  /** 플레이스홀더 */
  placeholder?: string
  /** 에러 메시지 */
  error?: string
  /** 필수 입력 표시 */
  required?: boolean
}
