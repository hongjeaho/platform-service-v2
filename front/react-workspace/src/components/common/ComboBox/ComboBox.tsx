import { ChevronDown } from 'lucide-react'
import React, { Children, type ReactNode, useEffect, useId, useRef, useState } from 'react'

import { textCombinations } from '@/styles'

import { ComboBoxContext } from './ComboBox.context'
import styles from './ComboBox.module.css'
import type { ComboBoxProps, ComboBoxSize } from './ComboBox.type'
import { ComboBoxItem } from './ComboBoxItem'

const sizeClasses: Record<ComboBoxSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const listboxSizeClasses: Record<ComboBoxSize, string> = {
  sm: styles.listboxSizeSm,
  md: styles.listboxSizeMd,
  lg: styles.listboxSizeLg,
}

const ITEM_HEIGHT_PX: Record<ComboBoxSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

interface ParsedItem {
  value: string
  textValue?: string
  displayText: string
  disabled?: boolean
  element: React.ReactElement
}

function getTextFromNode(node: ReactNode): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextFromNode).join('')
  if (React.isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    if (props.children != null) return getTextFromNode(props.children)
  }
  return ''
}

function flattenFragmentChildren(node: ReactNode): React.ReactElement[] {
  const arr = Children.toArray(node)
  const result: React.ReactElement[] = []
  arr.forEach(child => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      const props = child.props as { children?: ReactNode }
      result.push(...flattenFragmentChildren(props.children ?? null))
    } else if (React.isValidElement(child)) result.push(child)
  })
  return result
}

function parseItems(children: ReactNode): ParsedItem[] {
  const items: ParsedItem[] = []
  const flat = flattenFragmentChildren(children)
  flat.forEach(child => {
    if (!React.isValidElement(child)) return
    const props = child.props as {
      value?: string
      textValue?: string
      disabled?: boolean
      children?: ReactNode
    }
    if (props.value === undefined) return
    const displayText =
      props.textValue != null
        ? String(props.textValue).trim()
        : getTextFromNode(props.children).trim() || String(props.value)
    items.push({
      value: String(props.value),
      textValue: props.textValue,
      displayText: displayText || String(props.value),
      disabled: props.disabled,
      element: child,
    })
  })
  return items
}

function getDisplayTextForValue(items: ParsedItem[], value: string): string {
  const item = items.find(i => i.value === value)
  return item?.displayText ?? value
}

/**
 * ComboBox 컴포넌트
 * 입력 필드 + 실시간 필터링 드롭다운. RHF register() 및 value/onChange와 호환됩니다.
 *
 * @example
 * ```tsx
 * <ComboBox placeholder="검색" label="과일" {...register('fruit')} error={errors.fruit?.message}>
 *   <ComboBoxItem value="0001">딸기</ComboBoxItem>
 *   <ComboBoxItem value="0002">바나나</ComboBoxItem>
 * </ComboBox>
 * ```
 */
export function ComboBox({
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
}: ComboBoxProps) {
  const generatedId = useId()
  const triggerId = idProp ?? generatedId
  const listboxId = `${triggerId}-listbox`
  const errorId = error ? `${triggerId}-error` : undefined

  const [isOpen, setOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [inputValue, setInputValueState] = useState(() =>
    getDisplayTextForValue(parseItems(children), (defaultValue || valueProp) ?? ''),
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement | null>(null)
  const triggerInputRef = useRef<HTMLInputElement | null>(null)
  /** blur 시 목록에 없는 검색어일 때 복원할 값 (선택된 값은 타이핑 중에도 유지) */
  const lastSelectedValueRef = useRef<string>((defaultValue || valueProp) ?? '')

  const items = parseItems(children)
  const isControlled = valueProp !== undefined
  const currentValue = isControlled ? valueProp : uncontrolledValue

  const q = inputValue.trim().toLowerCase()
  const filteredItems = !q
    ? items.slice(0, limit)
    : items.filter(i => i.displayText.toLowerCase().includes(q)).slice(0, limit)
  const filteredValues = new Set(filteredItems.map(i => i.value))

  useEffect(() => {
    if (isControlled && valueProp !== undefined) {
      setInputValueState(getDisplayTextForValue(items, valueProp))
      lastSelectedValueRef.current = valueProp
    }
  }, [isControlled, valueProp, items])

  const setValue = (v: string, displayText: string) => {
    lastSelectedValueRef.current = v
    if (!isControlled) setUncontrolledValue(v)
    setInputValueState(displayText)
    setOpen(false)
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
  }

  const setInputValue = (v: string) => {
    setInputValueState(v)
    setOpen(true)
    const currentDisplay = getDisplayTextForValue(items, currentValue)
    if (currentValue && v !== currentDisplay) {
      setUncontrolledValue('')
      onValueChange?.('')
      const input = hiddenInputRef.current
      if (input) {
        input.value = ''
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
      onChange?.({
        target: { name: name ?? '', value: '' },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const setHiddenInputRef = (el: HTMLInputElement | null) => {
    hiddenInputRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputValue(v)
  }

  /** 포커스 아웃 시: 드롭다운 목록에 없는 검색어면 마지막 선택값 표시 또는 빈 값으로 초기화 */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmed = inputValue.trim()
    const matchesSomeItem = items.some(i => i.displayText.toLowerCase() === trimmed.toLowerCase())
    if (!matchesSomeItem) {
      const restoreValue = lastSelectedValueRef.current
      const displayForRestore = getDisplayTextForValue(items, restoreValue)
      setInputValueState(displayForRestore)
      if (!restoreValue) {
        setUncontrolledValue('')
        onValueChange?.('')
        const input = hiddenInputRef.current
        if (input) {
          input.value = ''
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
        onChange?.({
          target: { name: name ?? '', value: '' },
        } as React.ChangeEvent<HTMLInputElement>)
      } else {
        setUncontrolledValue(restoreValue)
        onValueChange?.(restoreValue)
        const input = hiddenInputRef.current
        if (input) {
          input.value = restoreValue
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
        onChange?.({
          target: { name: name ?? '', value: restoreValue },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    }
    onBlur?.(e)
  }

  const contextValue = {
    value: currentValue,
    inputValue,
    setInputValue,
    onSelect: setValue,
    isOpen,
    listboxId,
    triggerId,
    disabled,
    size,
    filteredValues,
  }

  const listboxMaxHeight = ITEM_HEIGHT_PX[size] * limit

  const comboboxWrapClasses = [
    styles.comboboxWrap,
    isOpen ? styles.open : '',
    disabled ? styles.disabled : '',
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ')

  const triggerWrapClasses = [styles.triggerWrap, sizeClasses[size]].filter(Boolean).join(' ')

  return (
    <ComboBoxContext.Provider value={contextValue}>
      <div ref={containerRef} className={styles.field}>
        {label != null && (
          <label htmlFor={triggerId} className={[styles.label, textCombinations.label].join(' ')}>
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
        )}
        <input
          ref={setHiddenInputRef}
          type='hidden'
          name={name}
          value={currentValue}
          readOnly
          aria-hidden
          tabIndex={-1}
        />
        <div className={comboboxWrapClasses}>
          <div className={triggerWrapClasses}>
            <input
              ref={triggerInputRef}
              type='text'
              id={triggerId}
              className={styles.input}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => !disabled && setOpen(true)}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete='off'
              role='combobox'
              aria-expanded={isOpen}
              aria-haspopup='listbox'
              aria-controls={listboxId}
              aria-autocomplete='list'
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={errorId}
            />
            <span
              className={styles.triggerIcon}
              aria-hidden
              tabIndex={-1}
              onClick={() => {
                if (!disabled) {
                  triggerInputRef.current?.focus()
                  setOpen(true)
                }
              }}
              onPointerDown={e => e.preventDefault()}
            >
              <ChevronDown size={16} aria-hidden />
            </span>
          </div>
        </div>
        {isOpen && (
          <div className={[styles.listbox, listboxSizeClasses[size]].join(' ')}>
            <div
              role='listbox'
              id={listboxId}
              className={styles.listboxScroll}
              style={{ maxHeight: listboxMaxHeight }}
            >
              {filteredItems.map(item => (
                <ComboBoxItem
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  textValue={item.textValue}
                >
                  {item.displayText}
                </ComboBoxItem>
              ))}
            </div>
          </div>
        )}
        {error != null && (
          <span
            id={errorId}
            className={[styles.errorMessage, textCombinations.bodySm].join(' ')}
            role='alert'
          >
            {error}
          </span>
        )}
      </div>
    </ComboBoxContext.Provider>
  )
}
