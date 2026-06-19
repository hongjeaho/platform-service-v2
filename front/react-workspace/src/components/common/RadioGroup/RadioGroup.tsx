import React, { useEffect, useId, useRef, useState } from 'react'

import { RadioGroupContext } from './RadioGroup.context'
import styles from './RadioGroup.module.css'
import type { RadioGroupOrientation, RadioGroupProps } from './RadioGroup.type'

const orientationClasses: Record<RadioGroupOrientation, string> = {
  horizontal: styles.orientationHorizontal,
  vertical: styles.orientationVertical,
}

/**
 * RadioGroup 컴포넌트
 * 단일 name으로 동작하며, RHF register() 및 value/onChange와 호환됩니다.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="0001" name="fruit" {...register('fruit')}>
 *   <RadioGroupItem value="0001" textValue="딸기">딸기</RadioGroupItem>
 *   <RadioGroupItem value="0002" textValue="바나나">바나나</RadioGroupItem>
 * </RadioGroup>
 * ```
 */
export function RadioGroup({
  ref,
  defaultValue = '',
  value: valueProp,
  disabled = false,
  size = 'md',
  orientation = 'horizontal',
  name,
  onChange,
  onValueChange,
  onBlur,
  id: idProp,
  error,
  children,
}: RadioGroupProps) {
  const generatedId = useId()
  const groupId = idProp ?? generatedId
  const errorId = error ? `${groupId}-error` : undefined
  const hiddenInputRef = useRef<HTMLInputElement | null>(null)
  const groupRef = useRef<HTMLDivElement>(null)

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const currentValue = isControlled ? valueProp : uncontrolledValue

  const setValue = (v: string) => {
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
  }

  const setHiddenInputRef = (el: HTMLInputElement | null) => {
    hiddenInputRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
  }

  const contextValue = {
    value: currentValue,
    onSelect: setValue,
    disabled,
    size,
    orientation,
    name,
    groupId,
  }

  const groupClasses = [styles.group, orientationClasses[orientation]].filter(Boolean).join(' ')

  useEffect(() => {
    const el = groupRef.current
    if (!el || !onBlur) return
    const handleFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node)) {
        const target = hiddenInputRef.current
        const synthetic = {
          target,
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          currentTarget: target,
          defaultPrevented: e.defaultPrevented,
          eventPhase: e.eventPhase,
          isTrusted: e.isTrusted,
          preventDefault: () => e.preventDefault(),
          isDefaultPrevented: () => e.defaultPrevented,
          stopPropagation: () => e.stopPropagation(),
          timeStamp: e.timeStamp,
          type: e.type,
        } as React.FocusEvent<HTMLInputElement>
        onBlur(synthetic)
      }
    }
    el.addEventListener('focusout', handleFocusOut)
    return () => el.removeEventListener('focusout', handleFocusOut)
  }, [onBlur])

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <input
        ref={setHiddenInputRef}
        type='hidden'
        name={name}
        value={currentValue}
        readOnly
        aria-hidden
        tabIndex={-1}
        data-testid='radio-group-hidden-input'
      />
      <div ref={groupRef} className={styles.wrapper}>
        <div
          id={groupId}
          role='radiogroup'
          className={groupClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
        >
          {children}
        </div>
        {error != null && (
          <span
            id={errorId}
            className={styles.errorMessage}
            role='alert'
            data-testid='radio-group-error'
          >
            {error}
          </span>
        )}
      </div>
    </RadioGroupContext.Provider>
  )
}

RadioGroup.displayName = 'RadioGroup'
