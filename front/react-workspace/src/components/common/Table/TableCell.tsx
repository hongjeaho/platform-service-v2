import styles from './Table.module.css'
import type { TableCellProps } from './Table.type'

function getAlignClass(align: NonNullable<TableCellProps['align']>) {
  if (align === 'left') return styles.alignLeft
  if (align === 'right') return styles.alignRight
  return styles.alignCenter
}

export function TableCell({
  as = 'td',
  align = 'center',
  scope,
  colSpan,
  rowSpan,
  children,
}: TableCellProps) {
  const Component = as

  return (
    <Component
      className={[styles.cellBase, getAlignClass(align)].join(' ')}
      data-align={align}
      scope={as === 'th' ? scope : undefined}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </Component>
  )
}
