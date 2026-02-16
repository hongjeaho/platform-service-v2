import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { FormUploadMultiProps } from './FormUploadMulti.types'
import { UploadMulti } from './UploadMulti'

/**
 * React Hook Form용 UploadMulti 컴포넌트
 *
 * @example
 * ```typescript
 * <FormUploadMulti
 *   name="attachments"
 *   control={control}
 *   label="첨부파일"
 *   maxFiles={5}
 *   displayMode="table"
 *   rules={{ required: '최소 1개 이상의 파일을 업로드해주세요' }}
 * />
 * ```
 */
export function FormUploadMulti<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister = false,
  ...uploadMultiProps
}: FormUploadMultiProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        // RHF의 value를 File[]로 변환
        const filesValue = (() => {
          const value = field.value as unknown
          if (value === null || value === undefined) {
            return []
          }
          // 타입 가드: Array 확인
          if (Array.isArray(value)) {
            // 모든 요소가 File 객체인지 확인
            if (value.every(item => item instanceof File)) {
              return value as File[]
            }
          }
          return []
        })()

        // UploadMulti의 onChange를 RHF field.onChange에 연결
        const handleChange = (files: File[]) => {
          field.onChange(files)
        }

        return (
          <UploadMulti
            {...field}
            value={filesValue}
            onChange={handleChange}
            error={fieldState.error?.message}
            {...uploadMultiProps}
          />
        )
      }}
    />
  )
}
