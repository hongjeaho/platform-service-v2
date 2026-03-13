import type { ButtonProps } from './Button.type'

import { icons } from '@/styles'
import styles from './Button.module.css'

/**
 * 버튼 크기별 스타일 클래스 매핑 (CSS Module)
 */
const sizeClasses: Record<Required<ButtonProps>['size'], string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

/**
 * 버튼 variant별 스타일 클래스 매핑 (CSS Module)
 */
const variantClasses: Record<Required<ButtonProps>['variant'], string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  accent: styles.variantAccent,
  destructive: styles.variantDestructive,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
  link: styles.variantLink,
}

/**
 * 버튼 컴포넌트
 *
 * 디자인 시스템을 따르는 재사용 가능한 버튼 컴포넌트입니다.
 * 디자인 토큰과 통합하여 일관된 스타일을 제공합니다.
 * CSS Module을 사용하여 스타일을 캡슐화합니다.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">클릭하세요</Button>
 * <Button variant="destructive" loading>로딩 중...</Button>
 * <Button variant="outline" icon={<Plus />}>추가</Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  const hasIconOnly = !children && (loading || icon)

  // CSS Module 클래스 조합
  const buttonClasses = [
    styles.button,
    sizeClasses[size],
    variantClasses[variant],
    isDisabled ? styles.disabled : '',
    fullWidth ? styles.fullWidth : '',
    hasIconOnly ? styles.iconOnly : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      {loading && (
        <span className={styles.icon} aria-hidden="true">
          <icons.loading className={`${styles.spinner} h-4 w-4`} />
        </span>
      )}

      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}

      {children && <span>{children}</span>}

      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
}
