import styles from './Table.module.css'
import type { TableProps } from './Table.type'

export function Table({
  striped = false,
  hoverable = true,
  ariaLabel,
  ariaDescribedBy,
  children,
}: TableProps) {
  return (
    <div className={styles.tableWrap}>
      <table
        className={styles.table}
        data-striped={striped ? 'true' : 'false'}
        data-hoverable={hoverable ? 'true' : 'false'}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </table>
    </div>
  )
}

