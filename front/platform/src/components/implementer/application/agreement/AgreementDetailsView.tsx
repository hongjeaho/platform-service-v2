import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  tableStyles,
} from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'
import { formatConsultationDate } from '@/utils/format/date'

import type { AgreementDetail } from '../types'
import styles from './AgreementDetailsView.module.css'

/**
 * 협의 내역 조회 전용 섹션 (읽기 전용 테이블)
 */
interface AgreementDetailsViewProps {
  items?: AgreementDetail[] | null
}

export function AgreementDetailsView({ items }: AgreementDetailsViewProps) {
  const hasItems = items && items.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>협의 내역</CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          header={
            <tr>
              <th className={cn(tableStyles.th, styles.thDate)}>날짜</th>
              <th className={tableStyles.th}>내용</th>
            </tr>
          }
        >
          {hasItems ? (
            items.map((row, index) => (
              <tr key={`${formatConsultationDate(row.consultationDate)}-${index}`}>
                <td className={cn(tableStyles.td, textCombinations.body)}>
                  {formatConsultationDate(row.consultationDate) || '-'}
                </td>
                <td className={cn(tableStyles.td, textCombinations.body)}>
                  {row.consultationDateText || '-'}
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
                표시할 협의 내역이 없습니다.
              </td>
            </tr>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
