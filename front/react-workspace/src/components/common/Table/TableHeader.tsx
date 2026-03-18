import type { TableHeaderProps } from './Table.type'

export function TableHeader({ children }: TableHeaderProps) {
  return <thead>{children}</thead>
}
