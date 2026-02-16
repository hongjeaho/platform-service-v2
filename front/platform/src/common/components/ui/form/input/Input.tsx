import { forwardRef, useId } from 'react'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Input.module.css'
import type { InputProps } from './Input.types'

/**
 * Input 컴포넌트
 *
 * 텍스트 입력 요소로, 라벨과 에러 메시지를 함께 제공합니다.
 * 디자인 토큰을 사용하여 일관된 스타일을 제공합니다.
 *
 * @example
 * ```tsx
 * <Input
 *   value={value}
 *   onChange={setValue}
 *   label="아이디"
 *   placeholder="아이디 입력"
 *   required
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value = '',
      onChange,
      label,
      placeholder,
      error,
      required,
      disabled,
      className,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = idProp ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className={cn(styles.field, className)}>
        {label && (
          <label htmlFor={inputId} className={cn(styles.label, textCombinations.label)}>
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          className={cn(styles.input, error && styles.error)}
          {...props}
        />
        {error && (
          <span
            id={errorId}
            className={cn(styles.errorMessage, textCombinations.bodySm)}
            role='alert'
          >
            {error}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
