import { forwardRef, useEffect,useRef } from 'react'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Checkbox.module.css'
import type { CheckboxProps } from './Checkbox.types'

/**
 * Checkbox 컴포넌트
 * 체크박스 입력 요소로, 라벨과 설명을 함께 제공합니다.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      onChange,
      label,
      description,
      error,
      indeterminate = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = ref || internalRef

    // indeterminate 상태 처리
    useEffect(() => {
      if (typeof inputRef === 'object' && inputRef !== null) {
        inputRef.current!.indeterminate = indeterminate
      }
    }, [indeterminate, inputRef])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked)
    }

    const hasContent = label || description || error

    if (!hasContent) {
      return (
        <input
          ref={inputRef}
          type='checkbox'
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={cn(styles.input, className)}
          aria-checked={indeterminate ? 'mixed' : checked}
          {...props}
        />
      )
    }

    return (
      <div className={styles.container}>
        <label className={styles.wrapper}>
          <input
            ref={inputRef}
            type='checkbox'
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className={styles.input}
            aria-checked={indeterminate ? 'mixed' : checked}
            {...props}
          />
          {(label || description) && (
            <div className={styles.content}>
              {label && <span className={cn(styles.label, textCombinations.body)}>{label}</span>}
              {description && (
                <span className={cn(styles.description, textCombinations.bodySm)}>
                  {description}
                </span>
              )}
            </div>
          )}
        </label>
        {error && <p className={cn(styles.error, textCombinations.bodySm)}>{error}</p>}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
