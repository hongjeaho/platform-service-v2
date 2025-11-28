import { useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './DatePicker.module.css'
import type { DateRangePickerProps } from './DatePicker.types'

/**
 * DateRangePicker 컴포넌트
 * 날짜 범위(시작일 ~ 종료일)를 선택하기 위한 입력 필드입니다.
 */
export function DateRangePicker({
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
}: DateRangePickerProps) {
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

  const fromDateString = value?.from ? value.from.toISOString().split('T')[0] : ''
  const toDateString = value?.to ? value.to.toISOString().split('T')[0] : ''

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value
    if (!dateStr) {
      onChange?.({ to: value?.to })
      return
    }
    const date = new Date(dateStr)
    onChange?.({ from: date, to: value?.to })
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value
    if (!dateStr) {
      onChange?.({ from: value?.from })
      return
    }
    const date = new Date(dateStr)
    onChange?.({ from: value?.from, to: date })
  }

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const displayText =
    value?.from || value?.to
      ? `${value.from ? formatDate(value.from) : '시작일'} ~ ${value.to ? formatDate(value.to) : '종료일'}`
      : placeholder

  return (
    <div className={styles.container}>
      {label && (
        <label className={cn(styles.label, textCombinations.label)}>
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
        <span
          className={cn(
            styles.text,
            !(value?.from || value?.to) && styles.placeholder,
            textCombinations.body,
          )}
        >
          {displayText}
        </span>
      </div>

      <div className={styles.rangeContainer} style={{ display: isOpen ? 'flex' : 'none' }}>
        <div className={styles.rangeGroup}>
          <label className={styles.rangeLabel}>시작일</label>
          <input
            type='date'
            name={name ? `${name}-from` : undefined}
            value={fromDateString}
            onChange={handleFromDateChange}
            disabled={disabled}
            min={minDate ? minDate.toISOString().split('T')[0] : undefined}
            max={maxDate ? maxDate.toISOString().split('T')[0] : undefined}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.rangeGroup}>
          <label className={styles.rangeLabel}>종료일</label>
          <input
            type='date'
            name={name ? `${name}-to` : undefined}
            value={toDateString}
            onChange={handleToDateChange}
            disabled={disabled}
            min={minDate ? minDate.toISOString().split('T')[0] : undefined}
            max={maxDate ? maxDate.toISOString().split('T')[0] : undefined}
            className={styles.rangeInput}
          />
        </div>
      </div>

      {error && (
        <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
          {error}
        </p>
      )}
    </div>
  )
}

DateRangePicker.displayName = 'DateRangePicker'
