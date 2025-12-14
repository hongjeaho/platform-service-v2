import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { FormRadioGroupProps } from './FormRadioGroup.types'
import { RadioGroup } from './RadioGroup'

/**
 * React Hook Form용 라디오 그룹 컴포넌트
 *
 * @example
 * ```typescript
 * <FormRadioGroup
 *   name="gender"
 *   control={control}
 *   label="성별"
 *   options={[
 *     { label: '남성', value: 'male' },
 *     { label: '여성', value: 'female' },
 *   ]}
 *   rules={{ required: '성별을 선택해주세요' }}
 * />
 * ```
 */
export function FormRadioGroup<TFieldValues extends FieldValues = FieldValues, TValue = string>({
  name,
  control,
  rules,
  shouldUnregister = false,
  ...radioGroupProps
}: FormRadioGroupProps<TFieldValues, TValue>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        // RadioGroup의 onChange를 RHF field.onChange에 연결
        const handleChange = (value: TValue) => {
          field.onChange(value)
        }

        return (
          <RadioGroup<TValue>
            {...field}
            value={field.value as TValue | undefined}
            onChange={handleChange}
            error={fieldState.error?.message}
            {...radioGroupProps}
          />
        )
      }}
    />
  )
}
