import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { FormInputProps } from './FormInput.types'
import { Input } from './Input'

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
  ...inputProps
}: FormInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          id={field.name}
          value={field.value ?? ''}
          error={fieldState.error?.message}
          {...inputProps}
        />
      )}
    />
  )
}
