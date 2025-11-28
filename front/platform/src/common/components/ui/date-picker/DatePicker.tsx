import { useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './DatePicker.module.css'
import type { DatePickerProps } from './DatePicker.types'

/**
 * DatePicker 컴포넌트
 * 단일 날짜를 선택하기 위한 입력 필드입니다.
 * 클릭 시 브라우저 네이티브 date input을 통해 날짜를 선택합니다.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = '날짜 선택',
  disabled,
  minDate,
  maxDate,
  error,
  label,
  required,
  name,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const CalendarIcon = icons.calendar

  const formatDate = (date?: Date): string => {
    if (!date) return ''
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }

  const dateString = value ? value.toISOString().split('T')[0] : ''

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value
    if (!dateStr) {
      onChange?.(undefined)
      return
    }
    const date = new Date(dateStr)
    onChange?.(date)
  }

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={name} className={cn(styles.label, textCombinations.label)}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div
        className={cn(styles.input, error && styles.inputError, className)}
        onClick={handleClick}
        role='button'
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick()
          }
        }}
      >
        <CalendarIcon className={cn(iconSizes.md, styles.icon)} aria-hidden='true' />
        <span className={cn(styles.text, !value && styles.placeholder, textCombinations.body)}>
          {value ? formatDate(value) : placeholder}
        </span>
      </div>
      <input
        type='date'
        name={name}
        value={dateString}
        onChange={handleDateChange}
        disabled={disabled}
        min={minDate ? minDate.toISOString().split('T')[0] : undefined}
        max={maxDate ? maxDate.toISOString().split('T')[0] : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        style={{ display: 'none' }}
      />
      {error && (
        <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
          {error}
        </p>
      )}
    </div>
  )
}

DatePicker.displayName = 'DatePicker'
