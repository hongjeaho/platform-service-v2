import type { TableRowProps } from './Table.type'

export function TableRow({ children, groupEnd = false }: TableRowProps) {
  return <tr data-group-end={groupEnd ? 'true' : undefined}>{children}</tr>
}
