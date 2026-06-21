import type { Ref } from 'react'

/**
 * 폼 필드 컴포넌트 공통 크기
 * Select · Combobox 등 필드형 컴포넌트가 공유합니다.
 */
export type FieldSize = 'sm' | 'md' | 'lg'

/**
 * 폼 필드 컴포넌트 공통 Props
 * RHF register() 및 value/onChange 제어 모두 호환.
 * Select · ComboBox 가 이 인터페이스를 상속합니다.
 */
export interface BaseFieldProps {
  /**
   * ref (React 19: 일반 prop, 숨김 input에 부착되어 RHF register와 연동)
   */
  ref?: Ref<HTMLInputElement>

  /**
   * 트리거에 표시할 placeholder
   */
  placeholder?: string

  /**
   * 목록에 표시할 최대 항목 수 (스크롤 시 더 표시)
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
  size?: FieldSize

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
   * name (폼 제출 · RHF register용)
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

  /** 옵션으로 사용할 Item 자식 */
  children: React.ReactNode
}

/**
 * 필드 내 개별 옵션 항목 공통 Props
 * SelectItem · ComboBoxItem 이 이 인터페이스를 상속합니다.
 */
export interface BaseItemProps {
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
