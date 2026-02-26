import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { FormTextareaProps } from './FormTextarea.types'
import { Textarea } from './Textarea'

/**
 * React Hook Form용 Textarea 컴포넌트
 * Controller 패턴으로 React Hook Form과 통합됩니다.
 *
 * @example
 * ```tsx
 * <FormTextarea
 *   name="decisionReason"
 *   control={control}
 *   label="재결신청사유"
 *   placeholder="사유를 입력하세요"
 *   rules={{ required: '재결신청사유를 입력해주세요.' }}
 *   rows={4}
 * />
 * ```
 */
export function FormTextarea<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister = false,
  maxLength,
  ...textareaProps
}: FormTextareaProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <Textarea
          id={field.name}
          name={field.name}
          value={field.value ?? ''}
          onChange={value => field.onChange(value)}
          onBlur={field.onBlur}
          ref={field.ref}
          error={fieldState.error?.message}
          maxLength={maxLength}
          currentLength={
            maxLength != null && typeof field.value === 'string' ? field.value.length : undefined
          }
          {...textareaProps}
        />
      )}
    />
  )
}
