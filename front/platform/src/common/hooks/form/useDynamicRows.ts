import { useFieldArray, useFormContext } from 'react-hook-form'

/**
 * 동적 행 추가/삭제를 위한 커스텀 훅
 * useFormContext + useFieldArray 래퍼
 *
 * @param name - 폼 필드 이름 (예: 'agreementDetails')
 * @param minRows - 최소 유지할 행 수 (기본값: 1)
 * @param defaultValue - 새 행 추가 시 사용할 기본값
 *
 * @example
 * ```tsx
 * const { fields, handleAdd, handleRemove, canRemove } = useDynamicRows(
 *   'agreementDetails',
 *   1,
 *   { consultationDate: '', consultationDateText: '' }
 * )
 * ```
 */
export function useDynamicRows<T extends object>(
  name: string,
  minRows = 1,
  defaultValue?: Partial<T>,
) {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const handleAdd = () => {
    append((defaultValue ?? {}) as T)
  }

  const handleRemove = (index: number) => {
    if (fields.length > minRows) {
      remove(index)
    }
  }

  const canRemove = fields.length > minRows

  return {
    fields,
    handleAdd,
    handleRemove,
    canRemove,
  }
}
