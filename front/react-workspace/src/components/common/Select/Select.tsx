import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  isValidElement,
  Children,
  Fragment,
} from 'react'

import { ChevronDown } from 'lucide-react'

import { textCombinations } from '@/styles'

import { SelectContext } from './Select.context'
import styles from './Select.module.css'
import type { SelectProps, SelectSize } from './Select.type'

const sizeClasses: Record<SelectSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const listboxSizeClasses: Record<SelectSize, string> = {
  sm: styles.listboxSizeSm,
  md: styles.listboxSizeMd,
  lg: styles.listboxSizeLg,
}

/** 항목 하나 높이(px) — limit와 곱해 리스트박스 maxHeight 계산 */
const ITEM_HEIGHT_PX: Record<SelectSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

function getDisplayForValue(children: ReactNode, value: string): ReactNode {
  let found: ReactNode = null
  Children.forEach(children, (child) => {
    if (found != null) return
    if (!isValidElement(child)) return
    const props = child.props as { value?: string; children?: ReactNode }
    if (props.value !== undefined && String(props.value) === String(value)) {
      found = props.children
      return
    }
    if (child.type === Fragment && props.children != null)
      found = getDisplayForValue(props.children, value)
  })
  return found
}

/**
 * Select 컴포넌트
 * 트리거·리스트박스·라벨·에러를 담당하며, RHF register() 및 value/onChange와 호환됩니다.
 *
 * @example
 * ```tsx
 * <Select placeholder="선택" label="과일" {...register('fruit')} error={errors.fruit?.message}>
 *   <SelectItem value="apple">사과</SelectItem>
 *   <SelectItem value="banana">바나나</SelectItem>
 * </Select>
 * ```
 */
export function Select({
  ref,
  placeholder,
  limit = 5,
  defaultValue = '',
  value: valueProp,
  disabled = false,
  size = 'md',
  label,
  error,
  required = false,
  id: idProp,
  name,
  onChange,
  onValueChange,
  onBlur,
  children,
}: SelectProps) {
  const generatedId = useId()
  const triggerId = idProp ?? generatedId
  const listboxId = `${triggerId}-listbox`
  const errorId = error ? `${triggerId}-error` : undefined

  const [isOpen, setOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement | null>(null)

  const isControlled = valueProp !== undefined
  const currentValue = isControlled ? valueProp : uncontrolledValue

  const displayLabel = currentValue ? getDisplayForValue(children, currentValue) ?? currentValue : null

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolledValue(v)
      onValueChange?.(v)
      const input = hiddenInputRef.current
      if (input) {
        input.value = v
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
      const syntheticEvent = {
        target: { name: name ?? '', value: v },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
    },
    [isControlled, name, onChange, onValueChange],
  )

  const handleSelect = useCallback(
    (v: string) => {
      setOpen(false)
      setValue(v)
    },
    [setValue],
  )

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const setHiddenInputRef = useCallback(
    (el: HTMLInputElement | null) => {
      hiddenInputRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
    },
    [ref],
  )

  const contextValue = {
    value: currentValue,
    onSelect: handleSelect,
    isOpen,
    listboxId,
    triggerId,
    disabled,
    size,
  }

  const triggerClasses = [
    styles.trigger,
    sizeClasses[size],
    disabled ? '' : '',
    error ? styles.error : '',
    !displayLabel && placeholder ? styles.triggerPlaceholder : '',
  ]
    .filter(Boolean)
    .join(' ')

  const listboxMaxHeight = ITEM_HEIGHT_PX[size] * limit

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={containerRef} className={styles.field}>
        {label != null && (
          <label
            htmlFor={triggerId}
            className={[styles.label, textCombinations.label].join(' ')}
          >
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
        )}
        <input
          ref={setHiddenInputRef}
          type="hidden"
          name={name}
          value={currentValue}
          readOnly
          aria-hidden
          tabIndex={-1}
        />
        <button
          type="button"
          id={triggerId}
          className={triggerClasses}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onBlur={onBlur}
        >
          <span>{displayLabel ?? placeholder ?? ''}</span>
          <span className={styles.triggerIcon} aria-hidden>
            <ChevronDown size={16} aria-hidden />
          </span>
        </button>
        {isOpen && (
          <div
            role="listbox"
            id={listboxId}
            className={[styles.listbox, listboxSizeClasses[size]].join(' ')}
            style={{ maxHeight: listboxMaxHeight }}
            aria-activedescendant={undefined}
          >
            {children}
          </div>
        )}
        {error != null && (
          <span
            id={errorId}
            className={[styles.errorMessage, textCombinations.bodySm].join(' ')}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    </SelectContext.Provider>
  )
}
