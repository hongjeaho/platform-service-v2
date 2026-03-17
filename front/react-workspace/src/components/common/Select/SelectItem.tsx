import { useContext } from 'react'

import { SelectContext } from './Select.context'
import type { SelectItemProps } from './Select.type'
import styles from './SelectItem.module.css'

/**
 * SelectItem 컴포넌트
 * Select 내부에서만 사용하며, 개별 옵션 한 건의 표시·선택 반응을 담당합니다.
 * Context 없이 사용 시 아무것도 렌더하지 않습니다.
 */
export function SelectItem({ value, disabled = false, textValue, children }: SelectItemProps) {
  const ctx = useContext(SelectContext)
  if (!ctx) return null

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

  const handleClick = () => {
    if (disabled) return
    onSelect(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) onSelect(value)
    }
  }

  return (
    <div
      role='option'
      aria-selected={isSelected}
      aria-disabled={disabled}
      aria-label={textValue}
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

SelectItem.displayName = 'SelectItem'
