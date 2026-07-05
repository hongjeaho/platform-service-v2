import { TableCell, TableRow } from '@/components/common/Table'

import styles from './DataTable.module.css'
import type { DataTableSkeletonProps } from './DataTable.type'

export function DataTableSkeleton({ pageSize, columnCount }: DataTableSkeletonProps) {
  return (
    <tbody>
      {Array.from({ length: pageSize }, (_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columnCount }, (_, colIdx) => (
            <TableCell key={colIdx}>
              <span className={styles.skeleton} aria-hidden='true' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </tbody>
  )
}
