import type { BaseFieldProps, BaseItemProps, FieldSize } from '../fields.type'

/**
 * Select 크기
 */
export type SelectSize = FieldSize

/**
 * Select 컴포넌트 Props
 * 라벨·에러 메시지를 포함한 필드 형태. RHF register() 및 value/onChange 제어 사용 가능.
 *
 * @example
 * ```tsx
 * <Select placeholder="선택" label="과일" {...register('fruit')} error={errors.fruit?.message}>
 *   <SelectItem value="apple">사과</SelectItem>
 *   <SelectItem value="banana">바나나</SelectItem>
 * </Select>
 * ```
 */
export interface SelectProps extends BaseFieldProps {}

/**
 * SelectItem 컴포넌트 Props
 * Select 내부에서만 유효하며, Context 없으면 렌더되지 않음.
 *
 * @example
 * ```tsx
 * <SelectItem value="0001" textValue="딸기">딸기</SelectItem>
 * ```
 */
export interface SelectItemProps extends BaseItemProps {}

/**
 * Select Context 값 (Select ↔ SelectItem 연동용)
 * Select.context.ts에서 사용.
 */
export interface SelectContextValue {
  value: string
  onSelect: (value: string) => void
  isOpen: boolean
  listboxId: string
  triggerId: string
  disabled: boolean
  size: SelectSize
}
