import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { FormInputProps } from './FormInput.types'
import { Input } from './Input'

/** 숫자를 천 단위 콤마가 포함된 문자열로 포맷 (양의 정수만) */
function formatNumberWithComma(value: number | undefined | null): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return ''
  }
  const n = Math.floor(Number(value))
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

/** 입력 문자열에서 숫자(0-9)만 추출해 number로 파싱. 빈 결과면 undefined */
function parseNumericInput(input: string): number | undefined {
  const digitsOnly = input.replace(/\D/g, '')
  if (digitsOnly === '') {
    return undefined
  }
  return Number(digitsOnly)
}

/**
 * React Hook Form용 인풋 컴포넌트
 *
 * Controller 패턴을 사용하여 React Hook Form과 통합됩니다.
 *
 * @example
 * ```tsx
 * <FormInput
 *   name="id"
 *   control={control}
 *   label="아이디"
 *   placeholder="아이디 입력"
 *   rules={{ required: '아이디를 입력해주세요.' }}
 * />
 * ```
 */
export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister = false,
  type = 'text',
  ...inputProps
}: FormInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        const isNumber = type === 'number'
        const value = isNumber
          ? formatNumberWithComma(field.value)
          : (field.value ?? '')
        const handleChange = isNumber
          ? (v: string) => field.onChange(parseNumericInput(v))
          : (v: string) => field.onChange(v)

        return (
          <Input
            ref={field.ref}
            id={field.name}
            name={field.name}
            onBlur={field.onBlur}
            value={value}
            onChange={handleChange}
            type={isNumber ? 'text' : type}
            inputMode={isNumber ? 'numeric' : undefined}
            error={fieldState.error?.message}
            {...inputProps}
          />
        )
      }}
    />
  )
}
