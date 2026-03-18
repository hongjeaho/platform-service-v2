import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import styles from './AlertDialog.module.css'
import type { AlertDialogDescriptionProps } from './AlertDialog.type'

export function AlertDialogDescription({ ...rest }: AlertDialogDescriptionProps) {
  const { className: _omit, ...descriptionProps } = rest as AlertDialogDescriptionProps & {
    className?: string
  }
  void _omit

  return <AlertDialogPrimitive.Description className={styles.description} {...descriptionProps} />
}
