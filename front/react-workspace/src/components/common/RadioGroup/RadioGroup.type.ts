import type { Ref } from 'react'

/**
 * RadioGroup / RadioGroupItem 크기
 */
export type RadioGroupSize = 'sm' | 'md' | 'lg'

/**
 * RadioGroup 배치 방향
 */
export type RadioGroupOrientation = 'horizontal' | 'vertical'

/**
 * RadioGroup 컴포넌트 Props
 * 단일 name으로 동작하며, RHF register() 및 value/onChange 제어 사용 가능.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="0001" name="fruit" {...register('fruit')}>
 *   <RadioGroupItem value="0001" textValue="딸기">딸기</RadioGroupItem>
 *   <RadioGroupItem value="0002" textValue="바나나">바나나</RadioGroupItem>
 * </RadioGroup>
 * ```
 */
export interface RadioGroupProps {
  /**
   * ref (React 19: 일반 prop, 숨김 input에 부착되어 RHF register와 연동)
   */
  ref?: Ref<HTMLInputElement>

  /**
   * 비제어 모드 초기값
   */
  defaultValue?: string

  /**
   * 제어 모드 현재값 (제공 시 제어 컴포넌트)
   */
  value?: string

  /**
   * 비활성화 여부 (그룹 전체)
   * @default false
   */
  disabled?: boolean

  /**
   * 크기
   * @default 'md'
   */
  size?: RadioGroupSize

  /**
   * 배치 방향
   * @default 'horizontal'
   */
  orientation?: RadioGroupOrientation

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

  /**
   * 접근성: radiogroup 라벨용 id (미제공 시 useId로 자동 생성)
   */
  id?: string

  /**
   * 에러 메시지 (있으면 하단에 role="alert"로 표시)
   */
  error?: string

  /** RadioGroupItem 자식 */
  children: React.ReactNode
}

/**
 * RadioGroupItem 컴포넌트 Props
 * RadioGroup 내부에서만 유효하며, Context 없으면 렌더되지 않음.
 *
 * @example
 * ```tsx
 * <RadioGroupItem value="0001" textValue="딸기">딸기</RadioGroupItem>
 * ```
 */
export interface RadioGroupItemProps {
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
   * 접근성/스크린리더용 텍스트 (미제공 시 children 사용)
   */
  textValue?: string

  /** 표시할 내용 */
  children: React.ReactNode
}

/**
 * RadioGroup Context 값 (RadioGroup ↔ RadioGroupItem 연동용)
 */
export interface RadioGroupContextValue {
  value: string
  onSelect: (value: string) => void
  disabled: boolean
  size: RadioGroupSize
  orientation: RadioGroupOrientation
  name: string | undefined
  groupId: string
}
