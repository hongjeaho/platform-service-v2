import React, { useContext, useRef } from 'react'

import { RadioGroupContext } from './RadioGroup.context'
import type { RadioGroupSize } from './RadioGroup.type'
import styles from './RadioGroupItem.module.css'
import type { RadioGroupItemProps } from './RadioGroupItem.type'

const sizeClasses: Record<RadioGroupSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

/**
 * RadioGroupItem 컴포넌트
 * RadioGroup 내부에서만 사용하며, 개별 옵션 한 건의 표시·선택을 담당합니다.
 * Context 없이 사용 시 아무것도 렌더하지 않습니다.
 */
export function RadioGroupItem({
  value,
  disabled: itemDisabled = false,
  textValue,
  children,
}: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext)
  const itemRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (!ctx) return
    const disabled = ctx.disabled || itemDisabled
    if (disabled) return
    ctx.onSelect(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!ctx) return
    const disabled = ctx.disabled || itemDisabled
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!disabled) ctx.onSelect(value)
      return
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = itemRef.current?.nextElementSibling as HTMLElement | null
      next?.focus()
      return
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = itemRef.current?.previousElementSibling as HTMLElement | null
      prev?.focus()
      return
    }
  }

  if (!ctx) return null

  const { value: selectedValue, disabled: groupDisabled, size } = ctx
  const isSelected = selectedValue === value
  const disabled = groupDisabled || itemDisabled
  const ariaLabel = textValue ?? (typeof children === 'string' ? children : undefined)

  const sizeClass = sizeClasses[size]
  const itemClasses = [styles.item, sizeClass, disabled ? styles.itemDisabled : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={itemRef}
      type='button'
      role='radio'
      aria-checked={isSelected}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={isSelected ? 0 : -1}
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    >
      <span className={styles.radioDot} aria-hidden />
      {children != null && <span className={styles.label}>{children}</span>}
    </button>
  )
}

RadioGroupItem.displayName = 'RadioGroupItem'
