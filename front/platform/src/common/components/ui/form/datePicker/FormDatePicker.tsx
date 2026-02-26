import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { DatePicker } from './DatePicker'
import type { FormDatePickerProps } from './FormDatePicker.types'

/**
 * React Hook Form용 날짜 선택 컴포넌트
 *
 * @example
 * ```typescript
 * <FormDatePicker
 *   name="birthDate"
 *   control={control}
 *   label="생년월일"
 *   rules={{ required: '생년월일을 선택해주세요' }}
 * />
 * ```
 */
export function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister = false,
  ...datePickerProps
}: FormDatePickerProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        // RHF의 value를 Date | null로 변환 (빈 문자열·Invalid Date는 null)
        const dateValue = (() => {
          const value = field.value as unknown
          if (value === null || value === undefined) {
            return null
          }
          // 타입 가드: Date 객체 확인
          if (value instanceof Date) {
            return Number.isNaN(value.getTime()) ? null : value
          }
          if (typeof value === 'string') {
            if (value.trim() === '') return null
            const d = new Date(value)
            return Number.isNaN(d.getTime()) ? null : d
          }
          return null
        })()

        // DatePicker의 onChange를 RHF field.onChange에 연결
        const handleChange = (date: Date | null) => {
          field.onChange(date)
        }

        return (
          <DatePicker
            {...field}
            value={dateValue}
            onChange={handleChange}
            error={fieldState.error?.message}
            {...datePickerProps}
          />
        )
      }}
    />
  )
}
