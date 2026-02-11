import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Card 크기 variants
 */
export type CardSize = 'sm' | 'md' | 'lg'

/**
 * Card 스타일 variants
 */
export type CardVariant = 'default' | 'elevated' | 'outlined'

/**
 * Card 컴포넌트 Props
 */
export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Card 스타일 variant (기본값: 'default') */
  variant?: CardVariant
  /** Card 크기 (기본값: 'md') */
  size?: CardSize
  /** hover 효과 활성화 여부 */
  interactive?: boolean
  /** Card 내용 */
  children: ReactNode
}

/**
 * CardHeader 컴포넌트 Props
 */
export interface CardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  /** 헤더 내용 */
  children: ReactNode
}

/**
 * CardContent 컴포넌트 Props
 */
export interface CardContentProps extends ComponentPropsWithoutRef<'div'> {
  /** 컨텐츠 내용 */
  children: ReactNode
}

/**
 * CardFooter 컴포넌트 Props
 */
export interface CardFooterProps extends ComponentPropsWithoutRef<'div'> {
  /** 푸터 내용 */
  children: ReactNode
}

/**
 * CardTitle 컴포넌트 Props
 */
export interface CardTitleProps extends ComponentPropsWithoutRef<'h3'> {
  /** 제목 내용 */
  children: ReactNode
}

/**
 * CardDescription 컴포넌트 Props
 */
export interface CardDescriptionProps extends ComponentPropsWithoutRef<'p'> {
  /** 설명 내용 */
  children: ReactNode
}
