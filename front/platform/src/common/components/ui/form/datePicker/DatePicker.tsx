import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react'
import {
  addMonths,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale/ko'
import { forwardRef, useEffect, useMemo, useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './DatePicker.module.css'
import type { DatePickerProps } from './DatePicker.types'

const PREV_ICON = icons.prev
const NEXT_ICON = icons.next
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

/**
 * CalendarHeader 컴포넌트
 * 월/년 표시 및 이전/다음 달 이동 버튼
 */
interface CalendarHeaderProps {
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  minDate?: Date
  maxDate?: Date
}

function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  minDate,
  maxDate,
}: CalendarHeaderProps) {
  const isPrevDisabled = useMemo(() => {
    if (!minDate) return false
    const prevMonth = subMonths(currentMonth, 1)
    return startOfMonth(prevMonth) < startOfMonth(minDate)
  }, [currentMonth, minDate])

  const isNextDisabled = useMemo(() => {
    if (!maxDate) return false
    const nextMonth = addMonths(currentMonth, 1)
    return startOfMonth(nextMonth) > startOfMonth(maxDate)
  }, [currentMonth, maxDate])

  return (
    <div className={styles.calendarHeader}>
      <button
        type='button'
        className={styles.calendarHeaderButton}
        onClick={onPrevMonth}
        disabled={isPrevDisabled}
        aria-label='이전 달'
      >
        <PREV_ICON className={iconSizes.sm} />
      </button>
      <div className={styles.calendarHeaderTitle}>
        {format(currentMonth, 'yyyy년 M월', { locale: ko })}
      </div>
      <button
        type='button'
        className={styles.calendarHeaderButton}
        onClick={onNextMonth}
        disabled={isNextDisabled}
        aria-label='다음 달'
      >
        <NEXT_ICON className={iconSizes.sm} />
      </button>
    </div>
  )
}

/**
 * CalendarCell 컴포넌트
 * 개별 날짜 셀
 */
interface CalendarCellProps {
  date: Date
  currentMonth: Date
  selectedDate: Date | null
  onClick: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

function CalendarCell({
  date,
  currentMonth,
  selectedDate,
  onClick,
  minDate,
  maxDate,
}: CalendarCellProps) {
  const isOtherMonth = !isSameMonth(date, currentMonth)
  const isSelected = selectedDate !== null && isSameDay(date, selectedDate)
  const isTodayDate = isToday(date)
  const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate)

  return (
    <button
      type='button'
      className={cn(
        styles.dateCell,
        isOtherMonth && styles.dateCellOtherMonth,
        isTodayDate && styles.dateCellToday,
        isSelected && styles.dateCellSelected,
        isDisabled && styles.dateCellDisabled,
      )}
      onClick={() => !isDisabled && onClick(date)}
      disabled={isDisabled}
      aria-label={format(date, 'yyyy년 M월 d일', { locale: ko })}
      aria-selected={isSelected}
    >
      {format(date, 'd')}
    </button>
  )
}

/**
 * CalendarGrid 컴포넌트
 * 날짜 그리드 렌더링
 */
interface CalendarGridProps {
  currentMonth: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

function CalendarGrid({
  currentMonth,
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - getDay(startDate))

  const dates = useMemo(() => {
    const year = startDate.getFullYear()
    const month = startDate.getMonth()
    const day = startDate.getDate()
    return Array.from({ length: 42 }, (_, i) => new Date(year, month, day + i))
  }, [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()])

  return (
    <>
      <div className={styles.weekdayHeader}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.dateGrid}>
        {dates.map((date, index) => (
          <CalendarCell
            key={index}
            date={date}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onClick={onDateSelect}
            minDate={minDate}
            maxDate={maxDate}
          />
        ))}
      </div>
    </>
  )
}

/**
 * DatePicker 컴포넌트
 * 날짜 선택을 위한 드롭다운 달력 UI를 제공합니다.
 * react-hook-form과 호환됩니다.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = '날짜를 선택하세요',
      error,
      label,
      required,
      disabled,
      name,
      className,
      minDate,
      maxDate,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(() =>
      value ? startOfMonth(value) : startOfMonth(new Date()),
    )

    const CalendarIcon = icons.calendar

    // Floating UI 설정
    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [offset(4), flip({ padding: 8 })],
      whileElementsMounted: autoUpdate,
    })

    const click = useClick(context)
    const dismiss = useDismiss(context)

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

    // 선택된 날짜가 변경되면 현재 월 업데이트
    useEffect(() => {
      if (value) {
        setCurrentMonth(startOfMonth(value))
      }
    }, [value])

    // 날짜 포맷팅 (yyyy-MM-dd)
    const formattedDate = useMemo(() => {
      if (!value) return ''
      return format(value, 'yyyy-MM-dd')
    }, [value])

    // 이전 달로 이동
    const handlePrevMonth = () => {
      setCurrentMonth(prev => subMonths(prev, 1))
    }

    // 다음 달로 이동
    const handleNextMonth = () => {
      setCurrentMonth(prev => addMonths(prev, 1))
    }

    // 날짜 선택 핸들러
    const handleDateSelect = (date: Date) => {
      onChange?.(date)
      setIsOpen(false)
    }

    return (
      <div className={cn(styles.container, className)}>
        {label && (
          <label htmlFor={name} className={cn(styles.label, textCombinations.label)}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {/* Hidden input for react-hook-form */}
        <input
          ref={ref}
          type='hidden'
          name={name}
          value={formattedDate}
          required={required}
          disabled={disabled}
        />

        {/* Input 필드 */}
        <button
          ref={refs.setReference}
          type='button'
          disabled={disabled}
          className={cn(styles.input, error && styles.inputError)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-label={label || '날짜 선택'}
          {...getReferenceProps()}
          {...props}
        >
          <span className={styles.inputText}>{formattedDate || placeholder}</span>
          <CalendarIcon className={cn(styles.calendarIcon, iconSizes.sm)} />
        </button>

        {/* 달력 팝업 */}
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                className={styles.calendar}
                {...getFloatingProps()}
              >
                <CalendarHeader
                  currentMonth={currentMonth}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  minDate={minDate}
                  maxDate={maxDate}
                />
                <CalendarGrid
                  currentMonth={currentMonth}
                  selectedDate={value || null}
                  onDateSelect={handleDateSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
            {error}
          </p>
        )}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
