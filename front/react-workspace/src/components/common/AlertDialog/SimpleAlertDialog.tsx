import type { MouseEvent } from 'react'
import { useState } from 'react'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from './AlertDialog'
import styles from './AlertDialog.module.css'
import type { SimpleAlertDialogProps } from './AlertDialog.type'

/**
 * SimpleAlertDialog
 *
 * low-level Primitive 조합 없이 자주 쓰는 확인/취소 패턴을 제공합니다.
 * `open`/`onOpenChange` 제어 모드만 지원합니다.
 */
export function SimpleAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  size = 'md',
  confirmVariant = 'destructive',
}: SimpleAlertDialogProps) {
  const [isConfirmPending, setIsConfirmPending] = useState(false)

  const handleConfirm = async (e: MouseEvent) => {
    // Radix Action은 기본적으로 클릭 시 닫힘을 요청합니다.
    // 제어 모드에서 확인 로직 완료 후 닫히도록 기본 동작을 막습니다.
    e.preventDefault()

    if (isConfirmPending) return

    try {
      setIsConfirmPending(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsConfirmPending(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    // 실제 닫힘은 Radix Cancel 동작이 onOpenChange(false)를 호출합니다(제어 모드).
  }

  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description != null && <AlertDialogDescription>{description}</AlertDialogDescription>}
          <div className={styles.actions}>
            <AlertDialogCancel size={size} onClick={handleCancel}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              size={size}
              variant={confirmVariant}
              disabled={confirmDisabled || isConfirmPending}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  )
}
