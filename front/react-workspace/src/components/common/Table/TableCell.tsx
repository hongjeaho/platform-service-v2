import styles from './Table.module.css'
import type { TableCellProps } from './Table.type'

function getAlignClass(align: NonNullable<TableCellProps['align']>) {
  if (align === 'left') return styles.alignLeft
  if (align === 'right') return styles.alignRight
  return styles.alignCenter
}

export function TableCell({ align = 'center', colSpan, rowSpan, children }: TableCellProps) {
  return (
    <td
      className={[styles.cellBase, getAlignClass(align)].join(' ')}
      data-align={align}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </td>
  )
}

