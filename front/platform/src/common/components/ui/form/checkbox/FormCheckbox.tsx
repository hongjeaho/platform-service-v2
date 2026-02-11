import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Checkbox } from './Checkbox'
import type { FormCheckboxProps } from './FormCheckbox.types'

/**
 * React Hook Form용 체크박스 컴포넌트
 *
 * @example
 * ```typescript
 * <FormCheckbox
 *   name="agree"
 *   control={control}
 *   label="약관 동의"
 *   rules={{ required: '약관에 동의해야 합니다' }}
 * />
 * ```
 */
export function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister = false,
  ...checkboxProps
}: FormCheckboxProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <Checkbox
          {...field}
          checked={field.value || false}
          error={fieldState.error?.message}
          {...checkboxProps}
        />
      )}
    />
  )
}
