import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import type { TotalQuantityFormData } from '../types'
import styles from './TotalQuantityStatementView.module.css'

const ROWS = [
  { key: 'land' as const, label: '토 지' },
  { key: 'object' as const, label: '물건' },
  { key: 'goodwill' as const, label: '영업권' },
  { key: 'etc' as const, label: '기타' },
] as const

const ROW_HAS_AREA = { land: true, object: false, goodwill: false, etc: true }

interface TotalQuantityStatementViewProps {
  data?: TotalQuantityFormData | null
}

export function TotalQuantityStatementView({ data }: TotalQuantityStatementViewProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>총물량조서</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn(textCombinations.bodySm, 'text-muted-foreground')}>
            표시할 데이터가 없습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          총물량조서
          <span className='text-sm font-normal text-muted-foreground ml-1'>
            (단위: 면적 ㎡, 금액 천원)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>구 분</th>
                <th colSpan={3} className={styles.th}>
                  총 보상대상
                </th>
                <th colSpan={3} className={styles.th}>
                  협의취득 등
                </th>
                <th colSpan={3} className={styles.th}>
                  재결신청
                </th>
              </tr>
              <tr>
                <th className={styles.th} />
                <th className={styles.th}>필,건</th>
                <th className={styles.th}>면적(m²)</th>
                <th className={styles.th}>금액(천 원)</th>
                <th className={styles.th}>필,건</th>
                <th className={styles.th}>면적(m²)</th>
                <th className={styles.th}>금액(천 원)</th>
                <th className={styles.th}>필,건</th>
                <th className={styles.th}>면적(m²)</th>
                <th className={styles.th}>금액(천 원)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ key, label }) => {
                const row = data[key]
                const hasArea = ROW_HAS_AREA[key]
                if (!row) return null
                return (
                  <tr key={key}>
                    <th className={cn(styles.th, styles.rowLabel)}>{label}</th>
                    <td className={cn(styles.td, textCombinations.body)}>{row.totalCnt || '-'}</td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {hasArea ? (row.totalArea ?? '-') : ''}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.totalPrice || '-'}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>{row.conferCnt || '-'}</td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {hasArea ? (row.conferArea ?? '-') : ''}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.conferPrice || '-'}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.decisionCnt || '-'}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {hasArea ? (row.decisionArea ?? '-') : ''}
                    </td>
                    <td className={cn(styles.td, textCombinations.body)}>
                      {row.decisionPrice || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
