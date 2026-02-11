import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { FormSelectProps } from './FormSelect.types'
import { Select } from './Select'

/**
 * React Hook Form용 Select 컴포넌트
 *
 * @example
 * ```typescript
 * <FormSelect
 *   name="region"
 *   control={control}
 *   options={regionOptions}
 *   label="지역 선택"
 *   rules={{ required: '지역을 선택해주세요' }}
 * />
 * ```
 */
export function FormSelect<TFieldValues extends FieldValues = FieldValues, TValue = string>({
  name,
  control,
  rules,
  shouldUnregister = false,
  ...selectProps
}: FormSelectProps<TFieldValues, TValue>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        return (
          <Select
            name={field.name}
            value={field.value as TValue | undefined}
            onChange={field.onChange}
            disabled={field.disabled}
            error={fieldState.error?.message}
            ref={field.ref}
            {...selectProps}
          />
        )
      }}
    />
  )
}
