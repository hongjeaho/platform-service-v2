import { forwardRef, useEffect, useId, useRef } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { cn } from '@/lib/utils'

import styles from './Modal.module.css'
import type { ModalBodyProps, ModalFooterProps, ModalHeaderProps, ModalProps } from './Modal.types'

const CloseIcon = icons.close

/**
 * Modal 루트
 * open 시 오버레이 + role="dialog" 패널 렌더링. ESC 키 및 오버레이 클릭으로 닫기.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, children, className }, ref) => {
    const titleId = useId()
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!open) return
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, onClose])

    if (!open) return null

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    }

    return (
      <div
        ref={ref}
        className={cn(styles.overlay, className)}
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={styles.panel}
        >
          {title && (
            <div className={styles.header}>
              <h2 id={titleId} className={styles.headerTitle}>
                {title}
              </h2>
              <ModalCloseButton onClose={onClose} />
            </div>
          )}
          {children}
        </div>
      </div>
    )
  },
)

Modal.displayName = 'Modal'

/**
 * ModalHeader: 제목 + 닫기 버튼
 */
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, id }, ref) => {
    return (
      <div ref={ref} id={id} className={cn(styles.header, className)}>
        {children}
      </div>
    )
  },
)

ModalHeader.displayName = 'ModalHeader'

/**
 * ModalBody: 스크롤 가능 본문
 */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn(styles.body, className)}>
        {children}
      </div>
    )
  },
)

ModalBody.displayName = 'ModalBody'

/**
 * ModalFooter: 액션 버튼 영역
 */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn(styles.footer, className)}>
        {children}
      </div>
    )
  },
)

ModalFooter.displayName = 'ModalFooter'

export interface ModalCloseButtonProps {
  onClose: () => void
  className?: string
  'aria-label'?: string
}

/**
 * 모달 닫기 버튼 (헤더에 배치용)
 */
export function ModalCloseButton({
  onClose,
  className,
  'aria-label': ariaLabel = '닫기',
}: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      className={cn(styles.closeBtn, className)}
      onClick={onClose}
      aria-label={ariaLabel}
    >
      <CloseIcon className={iconSizes.md} aria-hidden />
    </button>
  )
}
