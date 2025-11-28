import { forwardRef } from 'react'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Select.module.css'
import type { SelectProps } from './Select.types'

/**
 * Select 컴포넌트
 * 선택 목록 입력 요소로, 라벨과 에러 메시지를 함께 제공합니다.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = '선택해주세요',
      error,
      label,
      required,
      disabled,
      name,
      className,
      ...props
    }: SelectProps,
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      // SelectProps에서 T는 onChange의 value 매개변수 타입과 일치
      // string 타입의 HTMLSelectElement 값을 T로 캐스팅
      onChange?.(e.target.value as any)
    }

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={name} className={cn(styles.label, textCombinations.label)}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <select
          ref={ref}
          name={name}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
          className={cn(styles.select, error && styles.selectError, className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        >
          <option value='' disabled>
            {placeholder}
          </option>
          {options.map(option => (
            <option
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
