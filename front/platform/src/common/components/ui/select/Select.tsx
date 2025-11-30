import {
  autoUpdate,
  flip,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react'
import { forwardRef, useMemo, useRef, useState, useEffect } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Select.module.css'
import type { SelectProps } from './Select.types'

/**
 * Select 컴포넌트
 * 커스텀 드롭다운 UI를 제공하며, 선택적으로 검색 기능을 지원합니다.
 * react-hook-form과 호환됩니다.
 */
export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
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
      maxHeight = '300px',
      ...props
    }: SelectProps,
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const optionsListRef = useRef<HTMLDivElement>(null)

    const ChevronIcon = icons.next
    const SearchIcon = icons.search

    // Floating UI 설정
    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
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

    // 필터링된 옵션
    const filteredOptions = useMemo(() => {
      if (!searchable || !searchQuery) return options

      const query = searchQuery.toLowerCase()
      return options.filter(option => option.label.toLowerCase().includes(query))
    }, [options, searchQuery, searchable])

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
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) return

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
    }

    // 옵션으로 스크롤
    const scrollToOption = (index: number) => {
      if (!optionsListRef.current) return

      const optionElement = optionsListRef.current.children[index] as HTMLElement
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest' })
      }
    }

    // 옵션 선택 핸들러
    const handleSelect = (selectedValue: any) => {
      onChange?.(selectedValue)
      setIsOpen(false)
      setSearchQuery('')
    }

    // 검색 입력 핸들러
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      setHighlightedIndex(-1)
    }

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
        type="hidden"
        name={name}
        value={value ?? ''}
        required={required}
        disabled={disabled}
      />

      {/* Trigger 버튼 */}
      <button
        ref={refs.setReference}
        type="button"
        disabled={disabled}
        className={cn(styles.trigger, error && styles.triggerError)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        onKeyDown={handleKeyDown}
        {...getReferenceProps()}
        {...props}
      >
          <span className={styles.triggerText}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronIcon
            className={cn(
              styles.chevronIcon,
              iconSizes.sm,
              isOpen && styles.chevronIconOpen,
            )}
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
                    <SearchIcon className={cn(iconSizes.sm, styles.searchIcon)} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                      className={styles.searchInput}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                )}

                {/* 옵션 리스트 */}
                <div
                  ref={optionsListRef}
                  className={styles.optionsList}
                  style={{ maxHeight }}
                  role="listbox"
                >
                  {filteredOptions.length === 0 ? (
                    <div className={cn(styles.emptyMessage, textCombinations.bodySm)}>
                      {emptyMessage}
                    </div>
                  ) : (
                    filteredOptions.map((option, index) => (
                      <div
                        key={String(option.value)}
                        role="option"
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
                        {option.label}
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
