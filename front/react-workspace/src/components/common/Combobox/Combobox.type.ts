import type { Ref } from 'react'

/**
 * Combobox 크기
 */
export type ComboboxSize = 'sm' | 'md' | 'lg'

/**
 * Combobox 컴포넌트 Props
 * 입력 필드 + 실시간 필터링 드롭다운. 라벨·에러 포함. RHF register() 및 value/onChange 제어 사용 가능.
 *
 * @example
 * ```tsx
 * <Combobox placeholder="검색" label="과일" {...register('fruit')} error={errors.fruit?.message}>
 *   <ComboboxItem value="0001">딸기</ComboboxItem>
 *   <ComboboxItem value="0002">바나나</ComboboxItem>
 * </Combobox>
 * ```
 */
export interface ComboboxProps {
  /**
   * ref (React 19: 일반 prop, 숨김 input에 부착되어 RHF register와 연동)
   */
  ref?: Ref<HTMLInputElement>

  /**
   * 트리거 input에 표시할 placeholder
   */
  placeholder?: string

  /**
   * 목록에 표시할 최대 항목 수
   * @default 5
   */
  limit?: number

  /**
   * 비제어 모드 초기값
   */
  defaultValue?: string

  /**
   * 제어 모드 현재값 (제공 시 제어 컴포넌트)
   */
  value?: string

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  /**
   * 크기
   * @default 'md'
   */
  size?: ComboboxSize

  /**
   * 필드 라벨 (있으면 label 요소로 렌더링)
   */
  label?: string

  /**
   * 에러 메시지 (있으면 하단에 role="alert"로 표시)
   */
  error?: string

  /**
   * 필수 여부 (라벨 옆 * 표시)
   * @default false
   */
  required?: boolean

  /**
   * 접근성: label과 연결할 id (미제공 시 useId로 자동 생성)
   */
  id?: string

  /**
   * name (폼 제출·RHF register용)
   */
  name?: string

  /**
   * onChange (네이티브 이벤트, RHF register()와 호환)
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void

  /**
   * 값만 전달하는 콜백 (setState 패턴용)
   */
  onValueChange?: (value: string) => void

  /**
   * onBlur
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void

  /** 옵션으로 사용할 ComboboxItem 자식 */
  children: React.ReactNode
}

/**
 * ComboboxItem 컴포넌트 Props
 * Combobox 내부에서만 유효하며, Context 없으면 렌더되지 않음.
 *
 * @example
 * ```tsx
 * <ComboboxItem value="0001" textValue="딸기">딸기</ComboboxItem>
 * ```
 */
export interface ComboboxItemProps {
  /**
   * 옵션 값 (폼 제출·선택 시 전달되는 값)
   */
  value: string

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  /**
   * 접근성/필터링용 텍스트 (미제공 시 children 사용)
   */
  textValue?: string

  /** 표시할 내용 */
  children: React.ReactNode
}

/**
 * Combobox Context 값 (Combobox ↔ ComboboxItem 연동용)
 */
export interface ComboboxContextValue {
  value: string
  inputValue: string
  setInputValue: (v: string) => void
  onSelect: (value: string, displayText: string) => void
  isOpen: boolean
  listboxId: string
  triggerId: string
  disabled: boolean
  size: ComboboxSize
  /** 현재 필터를 통과한 value 집합 (ComboboxItem이 이에 포함될 때만 렌더) */
  filteredValues: Set<string>
}
