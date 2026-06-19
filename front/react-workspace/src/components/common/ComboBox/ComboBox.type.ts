import type { BaseFieldProps, BaseItemProps, FieldSize } from '../fields.type'

/**
 * ComboBox 크기
 */
export type ComboBoxSize = FieldSize

/**
 * ComboBox 컴포넌트 Props
 * 입력 필드 + 실시간 필터링 드롭다운. 라벨·에러 포함. RHF register() 및 value/onChange 제어 사용 가능.
 *
 * @example
 * ```tsx
 * <ComboBox placeholder="검색" label="과일" {...register('fruit')} error={errors.fruit?.message}>
 *   <ComboBoxItem value="0001">딸기</ComboBoxItem>
 *   <ComboBoxItem value="0002">바나나</ComboBoxItem>
 * </ComboBox>
 * ```
 */
export interface ComboBoxProps extends BaseFieldProps {}

/**
 * ComboBoxItem 컴포넌트 Props
 * ComboBox 내부에서만 유효하며, Context 없으면 렌더되지 않음.
 *
 * @example
 * ```tsx
 * <ComboBoxItem value="0001" textValue="딸기">딸기</ComboBoxItem>
 * ```
 */
export interface ComboBoxItemProps extends BaseItemProps {}

/**
 * ComboBox Context 값 (ComboBox ↔ ComboBoxItem 연동용)
 */
export interface ComboBoxContextValue {
  value: string
  inputValue: string
  setInputValue: (v: string) => void
  onSelect: (value: string, displayText: string) => void
  isOpen: boolean
  listboxId: string
  triggerId: string
  disabled: boolean
  size: ComboBoxSize
  /** 현재 필터를 통과한 value 집합 (ComboBoxItem이 이에 포함될 때만 렌더) */
  filteredValues: Set<string>
}
