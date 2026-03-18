import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import styles from './AlertDialog.module.css'
import type { AlertDialogTitleProps } from './AlertDialog.type'

export function AlertDialogTitle({ ...rest }: AlertDialogTitleProps) {
  const { className: _omit, ...titleProps } = rest as AlertDialogTitleProps & { className?: string }
  void _omit

  return <AlertDialogPrimitive.Title className={styles.title} {...titleProps} />
}
