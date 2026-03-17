import type { AriaAttributes, DOMAttributes, Ref } from 'react'

/**
 * CheckBox 시각적 변형
 */
export type CheckBoxVariant = 'primary' | 'secondary' | 'tertiary'

/**
 * CheckBox 크기
 */
export type CheckBoxSize = 'sm' | 'md' | 'lg'

/**
 * CheckBox 컴포넌트 Props
 * RHF(register) 및 checked/onChange 제어로 사용 가능합니다.
 */
export interface CheckBoxProps
  extends Omit<DOMAttributes<HTMLInputElement>, 'className' | 'size' | 'children'>, AriaAttributes {
  /**
   * ref (React 19: 일반 prop으로 전달)
   */
  ref?: Ref<HTMLInputElement>

  /**
   * 시각적 variant
   * @default 'primary'
   */
  variant?: CheckBoxVariant

  /**
   * 크기
   * @default 'md'
   */
  size?: CheckBoxSize

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  /**
   * 체크 여부 (제어 모드)
   * @default false
   */
  checked?: boolean

  /**
   * 폼 제출 시 전달되는 값 (input value)
   */
  value?: string

  /**
   * 체크박스 옆에 표시할 텍스트 (접근성·표시용)
   */
  textValue?: string

  /**
   * 접근성: label과 연결할 id (미제공 시 useId로 자동 생성)
   */
  id?: string

  /** onChange (네이티브, RHF register()와 호환) */
  onChange?: DOMAttributes<HTMLInputElement>['onChange']

  /**
   * 체크 시 value 전달 콜백 (간단 setState 패턴용)
   * onChange와 함께 호출됩니다.
   */
  onValueChange?: (value: string) => void

  /** onBlur */
  onBlur?: DOMAttributes<HTMLInputElement>['onBlur']
  /** name (폼 제출용) */
  name?: string
}
