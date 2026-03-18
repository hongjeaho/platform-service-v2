import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import styles from './AlertDialog.module.css'
import type { AlertDialogContentProps } from './AlertDialog.type'

export function AlertDialogContent({ ...rest }: AlertDialogContentProps) {
  const { className: _omit, ...contentProps } = rest as AlertDialogContentProps & {
    className?: string
  }
  void _omit

  return <AlertDialogPrimitive.Content className={styles.content} {...contentProps} />
}
