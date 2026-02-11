import { useId } from 'react'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Radio.module.css'
import type { RadioGroupProps } from './Radio.types'

/**
 * RadioGroup 컴포넌트
 * 라디오 버튼 옵션 그룹을 렌더링합니다.
 */
export function RadioGroup<T = string>({
  options,
  value,
  onChange,
  orientation = 'vertical',
  error,
  label,
  name,
  required = false,
  disabled = false,
}: RadioGroupProps<T>) {
  // name이 없을 경우 고유 ID 생성
  const generatedId = useId()
  const groupId = name || `radio-group-${generatedId}`
  const errorId = `${groupId}-error`
  const labelId = label ? `${groupId}-label` : undefined

  const handleChange = (optionValue: T) => {
    if (!disabled) {
      onChange?.(optionValue)
    }
  }

  return (
    <div
      className={cn(styles.group, orientation === 'horizontal' && styles.groupHorizontal)}
      role='radiogroup'
      aria-invalid={!!error}
      aria-labelledby={labelId}
      aria-describedby={error ? errorId : undefined}
      aria-required={required}
    >
      {label && (
        <label id={labelId} className={cn(styles.groupLabel, textCombinations.label)}>
          {label}
          {required && <span aria-label='필수 항목'> *</span>}
        </label>
      )}
      {options.map((option, index) => {
        const optionId = `${groupId}-option-${index}`
        const isDisabled = disabled || option.disabled
        const isChecked = value === option.value

        return (
          <label
            key={optionId}
            htmlFor={optionId}
            className={styles.item}
            onClick={() => !isDisabled && handleChange(option.value)}
          >
            <input
              id={optionId}
              type='radio'
              name={groupId}
              value={String(option.value)}
              checked={isChecked}
              onChange={() => handleChange(option.value)}
              disabled={isDisabled}
              className={styles.input}
              aria-label={option.label}
              aria-describedby={option.description ? `${optionId}-description` : undefined}
            />
            <div className={styles.content}>
              <span className={cn(styles.label, textCombinations.body)}>{option.label}</span>
              {option.description && (
                <span
                  id={`${optionId}-description`}
                  className={cn(styles.description, textCombinations.bodySm)}
                >
                  {option.description}
                </span>
              )}
            </div>
          </label>
        )
      })}
      {error && (
        <p id={errorId} className={cn(styles.error, textCombinations.bodySm)} role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}
