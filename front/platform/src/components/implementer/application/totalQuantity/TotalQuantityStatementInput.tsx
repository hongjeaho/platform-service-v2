/**
 * 총물량조서 입력 (자동/수동 모드 전환) - 오케스트레이터
 * Phase 2.2: 컴포넌트 분할 - 하위 컴포넌트로 위임
 * Phase 3.1: useFormWatch 훅 사용 (재사용성 향상)
 * 단위: 면적 ㎡, 금액 천원
 */
import { memo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import type { ApplicationFormData, QuantityRow } from '../types'
import styles from './TotalQuantityStatementInput.module.css'
import {
  QuantityModeToggle,
  QuantityTable,
  QuantityTotalsRow,
} from './TotalQuantityStatementInput.parts'

const TOTAL_QUANTITY_WATCH_FIELDS = [
  'totalQuantity.mode',
  'totalQuantity.land',
  'totalQuantity.object',
  'totalQuantity.goodwill',
  'totalQuantity.etc',
] as const

type TotalQuantityWatched = [
  string | undefined,
  QuantityRow | undefined,
  QuantityRow | undefined,
  QuantityRow | undefined,
  QuantityRow | undefined,
]

export const TotalQuantityStatementInput = memo(function TotalQuantityStatementInput() {
  const { control, setValue } = useFormContext<ApplicationFormData>()

  const watched = useWatch({
    control,
    name: TOTAL_QUANTITY_WATCH_FIELDS as unknown as [
      'totalQuantity.mode',
      'totalQuantity.land',
      'totalQuantity.object',
      'totalQuantity.goodwill',
      'totalQuantity.etc',
    ],
  }) as TotalQuantityWatched

  const [mode, land, object, goodwill, etc] = watched

  const isAuto = mode === 'auto'

  const toggleMode = () => {
    setValue('totalQuantity.mode', isAuto ? 'manual' : 'auto', { shouldDirty: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          총물량조서 입력
          <span className={cn(textCombinations.bodySm, styles.unitHint)}>
            (단위: 면적 ㎡, 금액 천원)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QuantityModeToggle isAuto={isAuto} onToggle={toggleMode} />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <QuantityTable isAuto={isAuto} />
            <QuantityTotalsRow land={land} object={object} goodwill={goodwill} etc={etc} />
          </table>
        </div>
      </CardContent>
    </Card>
  )
})
