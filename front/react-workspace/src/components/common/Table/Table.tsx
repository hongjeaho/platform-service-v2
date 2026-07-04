import styles from './Table.module.css'
import type { TableProps } from './Table.type'

export function Table({
  striped = false,
  hoverable = true,
  bordered = false,
  roundedBottom = true,
  ariaLabel,
  ariaDescribedBy,
  children,
}: TableProps) {
  return (
    <div
      className={[styles.tableWrap, !roundedBottom && styles.tableWrapSquareBottom]
        .filter(Boolean)
        .join(' ')}
    >
      <table
        className={styles.table}
        data-striped={striped ? 'true' : 'false'}
        data-hoverable={hoverable ? 'true' : 'false'}
        data-bordered={bordered ? 'true' : 'false'}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </table>
    </div>
  )
}
