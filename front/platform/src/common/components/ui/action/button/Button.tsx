import { forwardRef } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Button.module.css'
import type { ButtonProps } from './Button.types'

/**
 * Button 컴포넌트
 * 디자인 토큰을 활용한 버튼 컴포넌트입니다.
 * variant와 size를 통해 다양한 스타일을 제공합니다.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const LoadingIcon = icons.time

    const sizeClass = {
      sm: styles.buttonSm,
      md: styles.buttonMd,
      lg: styles.buttonLg,
    }[size]

    const variantClass = {
      primary: styles.primary,
      secondary: styles.secondary,
      outline: styles.outline,
      ghost: styles.ghost,
      destructive: styles.destructive,
      link: styles.link,
    }[variant]

    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          sizeClass,
          variantClass,
          textCombinations.button,
          isLoading && styles.loading,
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <LoadingIcon className={cn(iconSizes.sm, styles.icon)} aria-hidden='true' />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
