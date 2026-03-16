import { useId } from 'react'

import { textCombinations } from '@/styles'

import styles from './Input.module.css'
import type { InputProps } from './Input.type'

const sizeClasses: Record<Required<InputProps>['size'], string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const variantClasses: Record<Required<InputProps>['variant'], string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  tertiary: styles.variantTertiary,
}

/**
 * Input 컴포넌트
 *
 * 텍스트 입력 요소로, 라벨과 에러 메시지를 함께 제공합니다.
 * variant/size/disabled/readOnly를 지원하며, 디자인 토큰 기반 스타일을 사용합니다.
 *
 * @example
 * ```tsx
 * <Input
 *   value={value}
 *   onValueChange={setValue}
 *   label="아이디"
 *   placeholder="아이디 입력"
 *   required
 * />
 * <Input {...register('name')} label="이름" error={errors.name?.message} />
 * ```
 */
export function Input({
  ref,
  type = 'text',
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
  autoComplete,
  maxLength,
  minLength,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  const inputProps = Object.fromEntries(
    Object.entries(rest as Record<string, unknown>).filter(
      ([key]) => key !== 'className',
    ),
  )

  const inputClasses = [
    styles.input,
    sizeClasses[size],
    variantClasses[variant],
    disabled ? styles.disabled : '',
    readOnly ? styles.readOnly : '',
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value)
    onChange?.(e)
  }

  const fieldClasses = [styles.field, className].filter(Boolean).join(' ')

  return (
    <div className={fieldClasses}>
      {label != null && (
        <label
          htmlFor={inputId}
          className={[styles.label, textCombinations.label].join(' ')}
        >
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
        aria-invalid={error ? 'true' : ariaInvalid}
        aria-describedby={errorId ?? ariaDescribedBy}
        className={inputClasses}
        {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {error != null && (
        <span
          id={errorId}
          className={[styles.errorMessage, textCombinations.bodySm].join(' ')}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}
