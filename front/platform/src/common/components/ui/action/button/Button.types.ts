import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Button 크기 variants
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button 스타일 variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** 버튼 스타일 variant (기본값: 'primary') */
  variant?: ButtonVariant
  /** 버튼 크기 (기본값: 'md') */
  size?: ButtonSize
  /** 로딩 상태 */
  isLoading?: boolean
  /** 버튼 내용 */
  children: ReactNode
}
