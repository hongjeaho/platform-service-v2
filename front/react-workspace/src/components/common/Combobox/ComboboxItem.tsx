import { useContext } from 'react'

import { ComboboxContext } from './Combobox.context'
import type { ComboboxItemProps } from './Combobox.type'
import styles from './ComboboxItem.module.css'

/**
 * ComboboxItem 컴포넌트
 * Combobox 내부에서만 사용하며, 개별 옵션 한 건의 표시·선택 반응을 담당합니다.
 * Context 없이 사용 시, 또는 현재 필터에 포함되지 않으면 렌더하지 않습니다.
 */
export function ComboboxItem({ value, disabled = false, textValue, children }: ComboboxItemProps) {
  const ctx = useContext(ComboboxContext)
  if (!ctx) return null
  if (!ctx.filteredValues.has(value)) return null

  const { value: selectedValue, onSelect, isOpen, size } = ctx
  const isSelected = selectedValue === value

  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd

  const optionClasses = [
    styles.option,
    sizeClass,
    isSelected ? styles.optionSelected : '',
    disabled ? styles.optionDisabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  const displayText = textValue != null ? textValue : typeof children === 'string' ? children : ''

  const handleClick = () => {
    if (disabled) return
    onSelect(value, displayText)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) onSelect(value, displayText)
    }
  }

  return (
    <div
      role='option'
      aria-selected={isSelected}
      aria-disabled={disabled}
      aria-label={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={optionClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-value={value}
      tabIndex={isOpen ? 0 : -1}
    >
      {children}
    </div>
  )
}

ComboboxItem.displayName = 'ComboboxItem'
