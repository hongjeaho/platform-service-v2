import { forwardRef, useId } from 'react'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Textarea.module.css'
import type { TextareaProps } from './Textarea.types'

/**
 * Textarea 컴포넌트
 * 여러 줄 텍스트 입력 요소로, 라벨·에러·도움말·글자 수 표시를 지원합니다.
 *
 * @example
 * ```tsx
 * <Textarea
 *   value={value}
 *   onChange={setValue}
 *   label="재결신청사유"
 *   placeholder="사유를 입력하세요"
 *   rows={4}
 *   required
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      helpText,
      maxLength,
      currentLength,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const textareaId = idProp ?? generatedId
    const errorId = error ? `${textareaId}-error` : undefined

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className={cn(styles.field, className)}>
        {(label || helpText || (maxLength != null && currentLength != null)) && (
          <div className={styles.labelRow}>
            {label && (
              <label htmlFor={textareaId} className={cn(styles.label, textCombinations.label)}>
                {label}
                {required && <span className={styles.required}> *</span>}
              </label>
            )}
            {helpText && (
              <span className={cn(styles.helpText, textCombinations.bodySm)}>{helpText}</span>
            )}
            {maxLength != null && currentLength != null && (
              <span className={cn(styles.charCount, textCombinations.bodySm)}>
                {currentLength} / {maxLength}자
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          className={cn(styles.textarea, error && styles.error)}
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

Textarea.displayName = 'Textarea'
