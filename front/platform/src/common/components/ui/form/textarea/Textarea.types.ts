import type { ComponentPropsWithoutRef } from 'react'

/**
 * Textarea 컴포넌트 Props
 * React Hook Form register()와 호환 (ref, onChange, onBlur, name)
 */
export interface TextareaProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'onChange'> {
  /** 입력 값 (controlled) */
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
  /** 도움말 텍스트 */
  helpText?: string
  /** 글자 수 제한 표시 (예: "0 / 200자") */
  maxLength?: number
  /** 현재 글자 수 (maxLength와 함께 사용) */
  currentLength?: number
}
