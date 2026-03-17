import { useId } from 'react'

import { textCombinations } from '@/styles'

import styles from './Textarea.module.css'
import type { TextareaProps } from './Textarea.type'

const sizeClasses: Record<Required<TextareaProps>['size'], string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const variantClasses: Record<Required<TextareaProps>['variant'], string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  tertiary: styles.variantTertiary,
}

/**
 * Textarea 컴포넌트
 *
 * 다중 행 텍스트 입력 요소로, 라벨과 에러 메시지를 함께 제공합니다.
 * variant/size/disabled/readOnly를 지원하며, 디자인 토큰 기반 스타일을 사용합니다.
 *
 * @example
 * ```tsx
 * <Textarea
 *   value={value}
 *   onValueChange={setValue}
 *   label="설명"
 *   placeholder="내용 입력"
 *   required
 * />
 * <Textarea {...register('description')} label="설명" error={errors.description?.message} />
 * ```
 */
export function Textarea({
  ref,
  placeholder,
  variant = 'primary',
  size = 'md',
  disabled = false,
  readOnly = false,
  label,
  error,
  required = false,
  className,
  id: idProp,
  value,
  onChange,
  onValueChange,
  onBlur,
  name,
  maxLength,
  minLength,
  rows,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = idProp ?? generatedId
  const errorId = error ? `${textareaId}-error` : undefined

  const textareaProps = Object.fromEntries(
    Object.entries(rest as Record<string, unknown>).filter(
      ([key]) => key !== 'className' && key !== 'size',
    ),
  )

  const textareaClasses = [
    styles.textarea,
    sizeClasses[size],
    variantClasses[variant],
    disabled ? styles.disabled : '',
    readOnly ? styles.readOnly : '',
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(e.target.value)
    onChange?.(e)
  }

  const fieldClasses = [styles.field, className].filter(Boolean).join(' ')

  return (
    <div className={fieldClasses}>
      {label != null && (
        <label htmlFor={textareaId} className={[styles.label, textCombinations.label].join(' ')}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : ariaInvalid}
        aria-describedby={errorId ?? ariaDescribedBy}
        className={textareaClasses}
        {...(textareaProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
      {error != null && (
        <span
          id={errorId}
          className={[styles.errorMessage, textCombinations.bodySm].join(' ')}
          role='alert'
        >
          {error}
        </span>
      )}
    </div>
  )
}
