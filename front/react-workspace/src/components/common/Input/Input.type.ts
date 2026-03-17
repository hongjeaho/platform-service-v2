import type { AriaAttributes, DOMAttributes, Ref } from 'react'

/**
 * Input 시각적 변형
 */
export type InputVariant = 'primary' | 'secondary' | 'tertiary'

/**
 * Input 크기
 */
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * Input 컴포넌트 Props
 * 라벨·에러 메시지를 포함한 필드 형태를 지원합니다.
 * RHF(Controller/register) 및 value/onChange 제어로 사용 가능합니다.
 */
export interface InputProps
  extends Omit<DOMAttributes<HTMLInputElement>, 'className' | 'size'>, AriaAttributes {
  /**
   * ref (React 19: 일반 prop으로 전달)
   */
  ref?: Ref<HTMLInputElement>

  /**
   * input type (text, email, password 등)
   * @default 'text'
   */
  type?: string

  /**
   * placeholder 텍스트
   */
  placeholder?: string

  /**
   * 시각적 variant
   * @default 'primary'
   */
  variant?: InputVariant

  /**
   * 크기
   * @default 'md'
   */
  size?: InputSize

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  /**
   * 읽기 전용 여부
   * @default false
   */
  readOnly?: boolean

  /**
   * 필드 라벨 (있으면 label 요소로 렌더링)
   */
  label?: string

  /**
   * 에러 메시지 (있으면 input 하단에 role="alert"로 표시)
   */
  error?: string

  /**
   * 필수 여부 (라벨 옆 * 표시)
   * @default false
   */
  required?: boolean

  /**
   * 필드 컨테이너에 적용할 추가 클래스 (레이아웃 등)
   */
  className?: string

  /**
   * 접근성: label과 연결할 id (미제공 시 useId로 자동 생성)
   */
  id?: string

  /**
   * 접근성: 오류 시 true (error가 있으면 자동 설정)
   */
  'aria-invalid'?: boolean

  /**
   * 접근성: 설명/오류 메시지 id (error가 있으면 자동 설정)
   */
  'aria-describedby'?: string

  /** value (제어 컴포넌트) @default '' */
  value?: string

  /** onChange (네이티브, RHF register()와 호환) */
  onChange?: DOMAttributes<HTMLInputElement>['onChange']

  /**
   * 값만 전달하는 콜백 (간단 패턴: setState 전달 시 사용)
   * onChange와 함께 호출됩니다.
   */
  onValueChange?: (value: string) => void

  /** onBlur */
  onBlur?: DOMAttributes<HTMLInputElement>['onBlur']
  /** name (폼 제출용) */
  name?: string
  /** 자동완성 */
  autoComplete?: string
  /** maxLength */
  maxLength?: number
  /** minLength */
  minLength?: number
}
