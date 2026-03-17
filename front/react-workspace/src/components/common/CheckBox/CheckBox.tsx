import { useId } from 'react'

import { textCombinations } from '@/styles'

import styles from './CheckBox.module.css'
import type { CheckBoxProps } from './CheckBox.type'

const sizeClasses: Record<Required<CheckBoxProps>['size'], string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const variantClasses: Record<Required<CheckBoxProps>['variant'], string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  tertiary: styles.variantTertiary,
}

/**
 * CheckBox 컴포넌트
 *
 * variant/size/disabled/checked를 지원합니다.
 * RHF register()와 호환되며, onValueChange로 간단 setState 패턴을 지원합니다.
 *
 * @example
 * ```tsx
 * <CheckBox textValue="이용약관에 동의합니다" value="agree" />
 * <CheckBox {...register('agree')} textValue="동의" />
 * ```
 */
export function CheckBox({
  ref,
  variant = 'primary',
  size = 'md',
  disabled = false,
  checked,
  value = 'on',
  textValue,
  id: idProp,
  onValueChange,
  onChange: onChangeProp,
  onBlur,
  name,
  ...rest
}: CheckBoxProps) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId

  const inputClasses = [styles.input, sizeClasses[size], variantClasses[variant]]
    .filter(Boolean)
    .join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onValueChange?.(e.target.value)
    }
    onChangeProp?.(e)
  }

  return (
    <label htmlFor={inputId} className={styles.wrapper}>
      <input
        ref={ref}
        type='checkbox'
        id={inputId}
        checked={checked}
        value={value}
        disabled={disabled}
        name={name}
        className={inputClasses}
        {...rest}
        onChange={handleChange}
        onBlur={onBlur}
      />
      {textValue != null && (
        <span className={[styles.text, textCombinations.body].join(' ')}>{textValue}</span>
      )}
    </label>
  )
}
