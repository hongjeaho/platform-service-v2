import { forwardRef } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Button.module.css'
import type { ButtonProps } from './Button.types'

const LoadingIcon = icons.time

const SIZE_KEYS = { sm: 'buttonSm', md: 'buttonMd', lg: 'buttonLg' } as const
const VARIANT_KEYS = {
  primary: 'primary',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  destructive: 'destructive',
  link: 'link',
} as const

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
    const sizeClass = styles[SIZE_KEYS[size]]
    const variantClass = styles[VARIANT_KEYS[variant]]

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
        aria-label={isLoading ? '로딩 중' : undefined}
        {...props}
      >
        {isLoading && <LoadingIcon className={cn(iconSizes.sm, styles.icon)} aria-hidden='true' />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
