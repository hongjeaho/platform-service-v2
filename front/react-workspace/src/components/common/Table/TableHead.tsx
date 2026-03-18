import styles from './Table.module.css'
import type { TableHeadProps } from './Table.type'

function getAlignClass(align: NonNullable<TableHeadProps['align']>) {
  if (align === 'left') return styles.alignLeft
  if (align === 'right') return styles.alignRight
  return styles.alignCenter
}

export function TableHead({ align = 'center', colSpan, rowSpan, children }: TableHeadProps) {
  return (
    <th
      className={[styles.cellBase, styles.head, getAlignClass(align)].join(' ')}
      data-align={align}
      colSpan={colSpan}
      rowSpan={rowSpan}
      scope='col'
    >
      {children}
    </th>
  )
}
