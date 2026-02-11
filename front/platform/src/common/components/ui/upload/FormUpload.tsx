import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { FormUploadProps } from './FormUpload.types'
import { Upload } from './Upload'

/**
 * React Hook Form용 Upload 컴포넌트
 *
 * @example
 * ```typescript
 * <FormUpload
 *   name="document"
 *   control={control}
 *   label="문서 업로드"
 *   accept=".pdf,.docx"
 *   maxSize={5 * 1024 * 1024}
 *   rules={{ required: '문서를 업로드해주세요' }}
 * />
 * ```
 */
export function FormUpload<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister = false,
  ...uploadProps
}: FormUploadProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        // RHF의 value를 File | null로 변환
        const fileValue = (() => {
          const value = field.value as unknown
          if (value === null || value === undefined) {
            return null
          }
          // 타입 가드: File 객체 확인
          if (value instanceof File) {
            return value
          }
          return null
        })()

        // Upload의 onChange를 RHF field.onChange에 연결
        const handleChange = (file: File | null) => {
          field.onChange(file)
        }

        return (
          <Upload
            {...field}
            value={fileValue}
            onChange={handleChange}
            error={fieldState.error?.message}
            {...uploadProps}
          />
        )
      }}
    />
  )
}


