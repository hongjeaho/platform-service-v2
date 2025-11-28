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
  disabled = false,
}: RadioGroupProps<T>) {
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
      aria-describedby={error ? `${name}-error` : undefined}
    >
      {label && <label className={cn(styles.groupLabel, textCombinations.label)}>{label}</label>}
      {options.map(option => (
        <label
          key={String(option.value)}
          className={styles.item}
          onClick={() => handleChange(option.value)}
        >
          <input
            type='radio'
            name={name}
            value={String(option.value)}
            checked={value === option.value}
            onChange={() => handleChange(option.value)}
            disabled={disabled || option.disabled}
            className={styles.input}
            aria-label={option.label}
          />
          <div className={styles.content}>
            <span className={cn(styles.label, textCombinations.body)}>{option.label}</span>
            {option.description && (
              <span className={cn(styles.description, textCombinations.bodySm)}>
                {option.description}
              </span>
            )}
          </div>
        </label>
      ))}
      {error && (
        <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
          {error}
        </p>
      )}
    </div>
  )
}
