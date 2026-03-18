import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import styles from './AlertDialog.module.css'
import type { AlertDialogOverlayProps } from './AlertDialog.type'

export function AlertDialogOverlay({ ...rest }: AlertDialogOverlayProps) {
  const { className: _omit, ...overlayProps } = rest as AlertDialogOverlayProps & {
    className?: string
  }
  void _omit

  return <AlertDialogPrimitive.Overlay className={styles.overlay} {...overlayProps} />
}
