import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  tableStyles,
} from '@/common/components/ui'
import { textCombinations } from '@/constants/design'
import { cn } from '@/lib/utils'

import type { CityPlanningRow } from '../types'
import styles from './CityPlanningView.module.css'

interface CityPlanningViewProps {
  items?: CityPlanningRow[] | null
}

export default function CityPlanningView({ items }: CityPlanningViewProps) {
  const hasItems = items && items.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>도시계획 [사업인정]관계</CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          header={
            <tr>
              <th className={cn(tableStyles.th, styles.thTitle)}>제목</th>
              <th className={tableStyles.th}>내용</th>
            </tr>
          }
        >
          {hasItems ? (
            items.map((row, index) => (
              <tr key={`${row.title}-${index}`}>
                <td className={cn(tableStyles.td, textCombinations.body)}>
                  {row.title || '-'}
                </td>
                <td className={cn(tableStyles.td, textCombinations.body)}>
                  {row.content || '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={2}
                className={cn(
                  tableStyles.td,
                  textCombinations.bodySm,
                  'text-muted-foreground text-center',
                )}
              >
                표시할 데이터가 없습니다.
              </td>
            </tr>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
