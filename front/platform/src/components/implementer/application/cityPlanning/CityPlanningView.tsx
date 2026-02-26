import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import type { CityPlanningRow } from '../types'
import styles from './CityPlanningView.module.css'

interface CityPlanningViewProps {
  items?: CityPlanningRow[] | null
}

export function CityPlanningView({ items }: CityPlanningViewProps) {
  const hasItems = items && items.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>도시계획 [사업인정]관계</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={cn(styles.th, styles.thTitle)}>제목</th>
                <th className={styles.th}>내용</th>
              </tr>
            </thead>
            <tbody>
              {hasItems ? (
                items.map((row, index) => (
                  <tr key={`${row.title}-${index}`}>
                    <td className={cn(styles.td, textCombinations.body)}>{row.title || '-'}</td>
                    <td className={cn(styles.td, textCombinations.body)}>{row.content || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
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
