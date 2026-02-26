import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import type { TargetBuildingRow } from '../types'
import styles from './TargetBuildingView.module.css'

interface TargetBuildingViewProps {
  items?: TargetBuildingRow[] | null
}

export function TargetBuildingView({ items }: TargetBuildingViewProps) {
  const hasItems = items && items.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>대상(건축물)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>소재지(소유자)</th>
                <th className={styles.th}>지번</th>
                <th className={styles.th}>지목</th>
                <th className={styles.th}>편입 전 면적</th>
                <th className={styles.th}>편입 면적</th>
                <th className={styles.th}>비고</th>
              </tr>
            </thead>
            <tbody>
              {hasItems ? (
                items.map((row, index) => (
                  <tr key={`${row.locationOwner}-${index}`}>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.locationOwner || '-'}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>{row.lotNumber || '-'}</td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.landCategory || '-'}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.areaBeforeInclusion || '-'}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.areaIncluded || '-'}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>{row.remarks || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className={cn(
                      styles.td,
                      textCombinations.bodySm,
                      'text-muted-foreground text-center',
                    )}
                  >
                    표시할 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
