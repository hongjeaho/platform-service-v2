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
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale/ko'
import { forwardRef, memo, useEffect, useMemo, useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './DateRangePicker.module.css'
import type { DateRangePickerProps } from './DateRangePicker.types'

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
  const PrevIcon = icons.prev
  const NextIcon = icons.next

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
        <PrevIcon className={iconSizes.sm} />
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
        <NextIcon className={iconSizes.sm} />
      </button>
    </div>
  )
}

/**
 * CalendarCell 컴포넌트
 * 개별 날짜 셀 (범위 선택 지원)
 */
interface CalendarCellProps {
  date: Date
  currentMonth: Date
  startDate: Date | null
  endDate: Date | null
  hoverDate: Date | null
  onClick: (date: Date) => void
  onHover: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
}

const CalendarCell = memo(function CalendarCell({
  date,
  currentMonth,
  startDate,
  endDate,
  hoverDate,
  onClick,
  onHover,
  minDate,
  maxDate,
}: CalendarCellProps) {
  const isOtherMonth = !isSameMonth(date, currentMonth)
  const isTodayDate = isToday(date)
  const isDisabled =
    (minDate && date < startOfDay(minDate)) || (maxDate && date > startOfDay(maxDate))

  // 날짜 상태 계산
  const isStart = startDate !== null && isSameDay(date, startDate)
  const isEnd = endDate !== null && isSameDay(date, endDate)
  const isInRange = useMemo(() => {
    if (!startDate || !endDate) return false
    const dateStart = startOfDay(date)
    const rangeStart = startOfDay(startDate)
    const rangeEnd = startOfDay(endDate)
    return isAfter(dateStart, rangeStart) && isBefore(dateStart, rangeEnd)
  }, [date, startDate, endDate])

  // hover 시 임시 범위 계산 (startDate는 있고 endDate는 없을 때만)
  const isInHoverRange = useMemo(() => {
    if (!startDate || endDate || !hoverDate) return false
    const dateStart = startOfDay(date)
    const rangeStart = startOfDay(startDate)
    const rangeEnd = startOfDay(hoverDate)

    // startDate와 hoverDate 중 작은 날짜가 시작, 큰 날짜가 종료
    const actualStart = isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd
    const actualEnd = isBefore(rangeStart, rangeEnd) ? rangeEnd : rangeStart

    // 범위 내에 있는지 확인 (시작/종료 날짜 제외)
    return isAfter(dateStart, actualStart) && isBefore(dateStart, actualEnd)
  }, [date, startDate, hoverDate, endDate])

  return (
    <button
      type='button'
      className={cn(
        styles.dateCell,
        isOtherMonth && styles.dateCellOtherMonth,
        isTodayDate && styles.dateCellToday,
        isStart && styles.dateCellStart,
        isEnd && styles.dateCellEnd,
        isInRange && !isStart && !isEnd && styles.dateCellInRange,
        isInHoverRange && !isStart && styles.dateCellHoverRange,
        isDisabled && styles.dateCellDisabled,
      )}
      onClick={() => !isDisabled && onClick(date)}
      onMouseEnter={() => !isDisabled && onHover(date)}
      onMouseLeave={() => !isDisabled && onHover(null)}
      disabled={isDisabled}
      aria-label={format(date, 'yyyy년 M월 d일', { locale: ko })}
      aria-selected={isStart || isEnd}
    >
      {format(date, 'd')}
    </button>
  )
})

/**
 * CalendarGrid 컴포넌트
 * 날짜 그리드 렌더링
 */
interface CalendarGridProps {
  currentMonth: Date
  startDate: Date | null
  endDate: Date | null
  hoverDate: Date | null
  onDateSelect: (date: Date) => void
  onDateHover: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
}

const CalendarGrid = memo(function CalendarGrid({
  currentMonth,
  startDate,
  endDate,
  hoverDate,
  onDateSelect,
  onDateHover,
  minDate,
  maxDate,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth)
  const startDateOfWeek = new Date(monthStart)
  startDateOfWeek.setDate(startDateOfWeek.getDate() - getDay(startDateOfWeek))

  const dates = useMemo(() => {
    const days: Date[] = []
    const current = new Date(startDateOfWeek)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [startDateOfWeek])

  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <>
      <div className={styles.weekdayHeader}>
        {weekdays.map(day => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.dateGrid}>
        {dates.map(date => (
          <CalendarCell
            key={date.toISOString()}
            date={date}
            currentMonth={currentMonth}
            startDate={startDate}
            endDate={endDate}
            hoverDate={hoverDate}
            onClick={onDateSelect}
            onHover={onDateHover}
            minDate={minDate}
            maxDate={maxDate}
          />
        ))}
      </div>
    </>
  )
})

/**
 * DateRangePicker 컴포넌트
 * 날짜 범위 선택을 위한 드롭다운 달력 UI를 제공합니다.
 */
export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = '날짜 범위를 선택하세요',
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
    const [currentMonth, setCurrentMonth] = useState(() => {
      const today = new Date()
      return startOfMonth(today)
    })
    const [hoverDate, setHoverDate] = useState<Date | null>(null)

    // 원본 값 (선택 로직에서 사용)
    const originalStartDate = value?.startDate || null
    const originalEndDate = value?.endDate || null

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

    // 날짜 범위 유효성 검사 (표시용)
    const validatedRange = useMemo(() => {
      if (!originalStartDate && !originalEndDate) return { startDate: null, endDate: null }

      let validStartDate = originalStartDate
      let validEndDate = originalEndDate

      // minDate 검증
      if (validStartDate && minDate && validStartDate < startOfDay(minDate)) {
        validStartDate = startOfDay(minDate)
      }
      if (validEndDate && minDate && validEndDate < startOfDay(minDate)) {
        validEndDate = startOfDay(minDate)
      }

      // maxDate 검증
      if (validStartDate && maxDate && validStartDate > startOfDay(maxDate)) {
        validStartDate = startOfDay(maxDate)
      }
      if (validEndDate && maxDate && validEndDate > startOfDay(maxDate)) {
        validEndDate = startOfDay(maxDate)
      }

      // startDate가 endDate보다 이후인 경우 자동 보정
      if (validStartDate && validEndDate && validStartDate > validEndDate) {
        const temp = validStartDate
        validStartDate = validEndDate
        validEndDate = temp
      }

      return { startDate: validStartDate, endDate: validEndDate }
    }, [originalStartDate, originalEndDate, minDate, maxDate])

    // 유효성 검사된 날짜 (표시용)
    const startDate = validatedRange.startDate
    const endDate = validatedRange.endDate

    // 선택된 날짜 범위가 변경되면 현재 월 업데이트
    useEffect(() => {
      if (startDate) {
        setCurrentMonth(startOfMonth(startDate))
      } else if (endDate) {
        setCurrentMonth(startOfMonth(endDate))
      }
    }, [startDate, endDate])

    // 날짜 범위 포맷팅 (yyyy-MM-dd ~ yyyy-MM-dd)
    const formattedRange = useMemo(() => {
      const { startDate: validStartDate, endDate: validEndDate } = validatedRange
      if (!validStartDate && !validEndDate) return ''
      if (validStartDate && !validEndDate) {
        return `${format(validStartDate, 'yyyy-MM-dd')} ~ `
      }
      if (validStartDate && validEndDate) {
        return `${format(validStartDate, 'yyyy-MM-dd')} ~ ${format(validEndDate, 'yyyy-MM-dd')}`
      }
      return ''
    }, [validatedRange])

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
      if (!originalStartDate || (originalStartDate && originalEndDate)) {
        // 첫 번째 선택 또는 범위 완성 후 재선택
        onChange?.({ startDate: date, endDate: null })
      } else if (originalStartDate && !originalEndDate) {
        // 두 번째 선택 - 범위 완성
        const dateStart = startOfDay(originalStartDate)
        const dateEnd = startOfDay(date)

        // 날짜 순서 자동 보정
        if (isBefore(dateEnd, dateStart)) {
          // endDate를 먼저 선택한 경우 swap
          onChange?.({ startDate: date, endDate: originalStartDate })
        } else {
          onChange?.({ startDate: originalStartDate, endDate: date })
        }
        // 범위 완성 후 달력 자동 닫힘
        setIsOpen(false)
      }
    }

    // 다음 달
    const nextMonth = addMonths(currentMonth, 1)

    return (
      <div className={cn(styles.container, className)}>
        {label && (
          <label htmlFor={name} className={cn(styles.label, textCombinations.label)}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {/* Input 필드 */}
        <button
          ref={node => {
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            refs.setReference(node)
          }}
          type='button'
          disabled={disabled}
          className={cn(styles.input, error && styles.inputError)}
          aria-invalid={!!error}
          aria-expanded={isOpen}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-label={label || '날짜 범위 선택'}
          {...getReferenceProps()}
          {...props}
        >
          <span className={styles.inputText}>{formattedRange || placeholder}</span>
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
                {/* 첫 번째 달력 (현재월) */}
                <div className={styles.monthContainer}>
                  <CalendarHeader
                    currentMonth={currentMonth}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                  <CalendarGrid
                    currentMonth={currentMonth}
                    startDate={startDate}
                    endDate={endDate}
                    hoverDate={hoverDate}
                    onDateSelect={handleDateSelect}
                    onDateHover={setHoverDate}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>

                {/* 두 번째 달력 (다음월) */}
                <div className={styles.monthContainer}>
                  <CalendarHeader
                    currentMonth={nextMonth}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                  <CalendarGrid
                    currentMonth={nextMonth}
                    startDate={startDate}
                    endDate={endDate}
                    hoverDate={hoverDate}
                    onDateSelect={handleDateSelect}
                    onDateHover={setHoverDate}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>
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

DateRangePicker.displayName = 'DateRangePicker'
