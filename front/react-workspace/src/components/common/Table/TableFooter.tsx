import styles from './Table.module.css'
import type { TableFooterProps } from './Table.type'

export function TableFooter({ children }: TableFooterProps) {
  return <tfoot className={styles.footer}>{children}</tfoot>
}
