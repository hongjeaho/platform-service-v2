import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from './DateRangePicker.types'
import type { FormDateRangePickerProps } from './FormDateRangePicker.types'

/**
 * React Hook Form용 날짜 범위 선택 컴포넌트
 *
 * @example
 * ```typescript
 * <FormDateRangePicker
 *   name="period"
 *   control={control}
 *   label="기간"
 *   rules={{ required: '기간을 선택해주세요' }}
 * />
 * ```
 */
export function FormDateRangePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister = false,
  ...dateRangePickerProps
}: FormDateRangePickerProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        // RHF의 value를 DateRange로 변환
        const dateRangeValue: DateRange = (() => {
          if (!field.value) {
            return { startDate: null, endDate: null }
          }

          const value = field.value as
            | DateRange
            | { startDate: string | Date | null; endDate: string | Date | null }
            | null

          if (!value) {
            return { startDate: null, endDate: null }
          }

          const convertToDate = (date: string | Date | null): Date | null => {
            if (date === null || date === undefined) return null
            if (date instanceof Date) return date
            if (typeof date === 'string') return new Date(date)
            return null
          }

          return {
            startDate: convertToDate(value.startDate),
            endDate: convertToDate(value.endDate),
          }
        })()

        // DateRangePicker의 onChange를 RHF field.onChange에 연결
        const handleChange = (range: DateRange) => {
          field.onChange(range)
        }

        return (
          <DateRangePicker
            {...field}
            value={dateRangeValue}
            onChange={handleChange}
            error={fieldState.error?.message}
            {...dateRangePickerProps}
          />
        )
      }}
    />
  )
}
