import type { AriaAttributes, DOMAttributes, ReactNode, Ref } from 'react'

// Design system imports
import type { ButtonVariant as DSButtonVariant } from '@/styles'

/**
 * 버튼 크기 타입
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * 아이콘 위치 타입
 */
export type IconPosition = 'left' | 'right'

/**
 * 버튼 컴포넌트 Props
 * CSS Module을 사용하므로 className prop은 제공되지 않습니다.
 * 필요한 속성만 명시적으로 정의합니다.
 */
export interface ButtonProps
  extends Omit<DOMAttributes<HTMLButtonElement>, 'className'>,
    AriaAttributes {
  /**
   * ref (React 19: 일반 prop으로 전달)
   */
  ref?: Ref<HTMLButtonElement>

  /**
   * 버튼 variant (디자인 시스템 토큰 사용)
   * @default 'primary'
   */
  variant?: DSButtonVariant

  /**
   * 버튼 크기 (디자인 시스템 간격 토큰 사용)
   * @default 'md'
   */
  size?: ButtonSize

  /**
   * 로딩 상태 표시 (스피너)
   * @default false
   */
  loading?: boolean

  /**
   * 버튼 비활성화
   * @default false
   */
  disabled?: boolean

  /**
   * 폼 제출 관련 속성
   */
  formAction?: string
  formEncType?: HTMLButtonElement['formEncType']
  formMethod?: HTMLButtonElement['formMethod']
  formNoValidate?: boolean
  formTarget?: HTMLButtonElement['formTarget']
  name?: string
  type?: 'submit' | 'reset' | 'button'
  value?: string

  /**
   * 텍스트 앞에 표시할 아이콘 컴포넌트
   */
  icon?: ReactNode

  /**
   * 아이콘 위치
   * @default 'left'
   */
  iconPosition?: IconPosition

  /**
   * 버튼 전체 너비 사용
   * @default false
   */
  fullWidth?: boolean

  /**
   * 자식 노드 (버튼 텍스트 등)
   */
  children: ReactNode
}
