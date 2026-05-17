import type { TableFooterProps } from './Table.type'

export function TableFooter({ children }: TableFooterProps) {
  return <tfoot>{children}</tfoot>
}
