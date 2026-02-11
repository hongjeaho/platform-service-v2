import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import styles from './Card.module.css'
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from './Card.types'

/**
 * Card 컴포넌트
 * 디자인 토큰을 활용한 카드 컴포넌트입니다.
 * variant, size, interactive 옵션을 통해 다양한 스타일을 제공합니다.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', size = 'md', interactive = false, children, className, ...props },
    ref,
  ) => {
    const sizeClass = {
      sm: styles.cardSm,
      md: styles.cardMd,
      lg: styles.cardLg,
    }[size]

    const variantClass = {
      default: styles.default,
      elevated: styles.elevated,
      outlined: styles.outlined,
    }[variant]

    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          sizeClass,
          variantClass,
          interactive && styles.interactive,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'

/**
 * CardHeader 컴포넌트
 * Card의 헤더 영역을 담당합니다.
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        {children}
      </div>
    )
  },
)

CardHeader.displayName = 'CardHeader'

/**
 * CardContent 컴포넌트
 * Card의 본문 내용을 담당합니다.
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.content, className)} {...props}>
        {children}
      </div>
    )
  },
)

CardContent.displayName = 'CardContent'

/**
 * CardFooter 컴포넌트
 * Card의 푸터 영역을 담당합니다.
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.footer, className)} {...props}>
        {children}
      </div>
    )
  },
)

CardFooter.displayName = 'CardFooter'

/**
 * CardTitle 컴포넌트
 * Card의 제목을 표시합니다.
 */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </h3>
    )
  },
)

CardTitle.displayName = 'CardTitle'

/**
 * CardDescription 컴포넌트
 * Card의 설명을 표시합니다.
 */
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(styles.description, className)} {...props}>
        {children}
      </p>
    )
  },
)

CardDescription.displayName = 'CardDescription'
