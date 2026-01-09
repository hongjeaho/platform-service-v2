import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Select.module.css'
import type { SelectProps } from './Select.types'

/**
 * Select 컴포넌트
 * 커스텀 드롭다운 UI를 제공하며, 선택적으로 검색 기능을 지원합니다.
 * react-hook-form과 호환됩니다.
 *
 * 주요 기능:
 * - Floating UI 기반 포지셔닝
 * - 검색 기능 (debounce 적용)
 * - 키보드 네비게이션
 * - 접근성 (ARIA 속성)
 * - 검색어 하이라이트
 */

/**
 * 검색어 하이라이트 유틸리티 함수
 */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)

  return (
    <>
      {before}
      <mark className={styles.highlight}>{match}</mark>
      {after}
    </>
  )
}

export const Select = forwardRef(
  <T = string,>(
    {
      options,
      value,
      onChange,
      placeholder = '선택해주세요',
      error,
      label,
      required,
      disabled,
      name,
      className,
      searchable = false,
      searchPlaceholder = '검색...',
      emptyMessage = '검색 결과가 없습니다',
      ...props
    }: SelectProps<T>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const optionsListRef = useRef<HTMLDivElement>(null)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const ChevronIcon = useMemo(() => icons.next, [])
    const SearchIcon = useMemo(() => icons.search, [])

    // 드롭다운 열기/닫기 핸들러
    const handleOpenChange = useCallback((open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setSearchQuery('')
        setDebouncedSearchQuery('')
        setHighlightedIndex(-1)
      }
    }, [])

    // Debounce 검색어 (300ms)
    useEffect(() => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery)
      }, 200)

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    }, [searchQuery])

    // Floating UI 설정
    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: handleOpenChange,
      middleware: [
        offset(4),
        flip({ padding: 8 }),
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
            })
          },
          padding: 8,
        }),
      ],
      whileElementsMounted: autoUpdate,
    })

    const click = useClick(context)
    const dismiss = useDismiss(context)
    const role = useRole(context, { role: 'listbox' })

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

    // 선택된 옵션 찾기
    const selectedOption = useMemo(
      () => options.find(option => option.value === value),
      [options, value],
    )

    // 필터링된 옵션 (debounced 검색어 사용)
    const filteredOptions = useMemo(() => {
      if (!searchable || !debouncedSearchQuery) return options

      const query = debouncedSearchQuery.toLowerCase()
      return options.filter(option => option.label.toLowerCase().includes(query))
    }, [options, debouncedSearchQuery, searchable])

    // 활성 옵션 ID (접근성용)
    const activeOptionId = useMemo(() => {
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        return `${name}-option-${highlightedIndex}`
      }
      return undefined
    }, [highlightedIndex, filteredOptions.length, name])

    // 옵션으로 스크롤
    const scrollToOption = useCallback((index: number) => {
      if (!optionsListRef.current) return

      const optionElement = optionsListRef.current.children[index] as HTMLElement
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest' })
      }
    }, [])

    // 옵션 선택 핸들러
    const handleSelect = useCallback(
      (selectedValue: T) => {
        onChange?.(selectedValue)
        setIsOpen(false)
        setSearchQuery('')
        setDebouncedSearchQuery('')
      },
      [onChange],
    )

    // 검색 입력 핸들러
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      setHighlightedIndex(-1)
    }, [])

    // 드롭다운이 열릴 때 검색창에 포커스
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus()
      }
      if (isOpen) {
        setHighlightedIndex(-1)
      }
    }, [isOpen, searchable])

    // 키보드 네비게이션
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!isOpen) {
          // 드롭다운이 닫혀있을 때 Space나 Enter로 열기
          if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
            e.preventDefault()
            setIsOpen(true)
          }
          return
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setHighlightedIndex(prev => {
              const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0
              scrollToOption(nextIndex)
              return nextIndex
            })
            break

          case 'ArrowUp':
            e.preventDefault()
            setHighlightedIndex(prev => {
              const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1
              scrollToOption(nextIndex)
              return nextIndex
            })
            break

          case 'Enter':
            e.preventDefault()
            if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
              const option = filteredOptions[highlightedIndex]
              if (!option.disabled) {
                handleSelect(option.value)
              }
            }
            break

          case 'Escape':
            e.preventDefault()
            setIsOpen(false)
            break

          case 'Tab':
            setIsOpen(false)
            break
        }
      },
      [isOpen, disabled, filteredOptions, highlightedIndex, scrollToOption, handleSelect],
    )

    return (
      <div className={cn(styles.container, className)}>
        {label && (
          <label htmlFor={name} className={cn(styles.label, textCombinations.label)}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {/* Hidden input for react-hook-form */}
        <input
          ref={ref}
          type='hidden'
          name={name}
          value={value ? String(value) : ''}
          required={required}
          disabled={disabled}
        />

        {/* Trigger 버튼 */}
        <button
          ref={refs.setReference}
          type='button'
          disabled={disabled}
          className={cn(styles.trigger, error && styles.triggerError)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-controls={isOpen ? `${name}-listbox` : undefined}
          aria-activedescendant={activeOptionId}
          aria-label={label || name || '선택'}
          onKeyDown={handleKeyDown}
          {...getReferenceProps()}
          {...props}
        >
          <span className={styles.triggerText}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronIcon
            className={cn(styles.chevronIcon, iconSizes.sm, isOpen && styles.chevronIconOpen)}
          />
        </button>

        {/* Portal 드롭다운 */}
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                className={styles.dropdown}
                {...getFloatingProps()}
              >
                {/* 검색 입력창 */}
                {searchable && (
                  <div className={styles.searchContainer}>
                    <SearchIcon
                      className={cn(iconSizes.sm, styles.searchIcon)}
                      aria-hidden='true'
                    />
                    <input
                      ref={searchInputRef}
                      type='text'
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                      className={styles.searchInput}
                      onKeyDown={handleKeyDown}
                      aria-label='옵션 검색'
                      aria-controls={`${name}-listbox`}
                    />
                    {/* 검색 결과 개수 (스크린 리더용) */}
                    {debouncedSearchQuery && (
                      <span className='sr-only' aria-live='polite' aria-atomic='true'>
                        {filteredOptions.length}개의 결과가 있습니다
                      </span>
                    )}
                  </div>
                )}

                {/* 옵션 리스트 */}
                <div
                  ref={optionsListRef}
                  className={styles.optionsList}
                  role='listbox'
                  id={`${name}-listbox`}
                  aria-label={label || '옵션 목록'}
                >
                  {filteredOptions.length === 0 ? (
                    <div className={cn(styles.emptyMessage, textCombinations.bodySm)} role='status'>
                      {emptyMessage}
                    </div>
                  ) : (
                    filteredOptions.map((option, index) => (
                      <div
                        key={String(option.value)}
                        id={`${name}-option-${index}`}
                        role='option'
                        aria-selected={option.value === value}
                        aria-disabled={option.disabled}
                        className={cn(
                          styles.option,
                          option.value === value && styles.optionSelected,
                          index === highlightedIndex && styles.optionHighlighted,
                          option.disabled && styles.optionDisabled,
                        )}
                        onClick={() => {
                          if (!option.disabled) {
                            handleSelect(option.value)
                          }
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {searchable && debouncedSearchQuery
                          ? highlightText(option.label, debouncedSearchQuery)
                          : option.label}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'

// 제네릭 타입 지원을 위한 타입 캐스팅
export default Select as <T = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> },
) => React.ReactElement
