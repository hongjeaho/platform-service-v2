import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'
import { parseCurrency } from '@/utils/format/number'

import type { ApplicationFormData } from '../types'
import type { QuantityRow } from '../types'
import styles from './TotalQuantityStatementInput.module.css'

const EMPTY_ROW: QuantityRow = {
  totalCnt: '',
  totalPrice: '',
  conferCnt: '',
  conferPrice: '',
  decisionCnt: '',
  decisionPrice: '',
}

const ROWS = [
  { key: 'land' as const, label: '토 지' },
  { key: 'object' as const, label: '물건' },
  { key: 'goodwill' as const, label: '영업권' },
  { key: 'etc' as const, label: '기타' },
] as const

const ROW_HAS_AREA = { land: true, object: false, goodwill: false, etc: true }

/**
 * 총물량조서 입력 (자동/수동 모드 전환)
 * 단위: 면적 ㎡, 금액 천원
 */
export function TotalQuantityStatementInput() {
  const { register, watch, setValue } = useFormContext<ApplicationFormData>()

  const mode = watch('totalQuantity.mode')
  const land = watch('totalQuantity.land')
  const object = watch('totalQuantity.object')
  const goodwill = watch('totalQuantity.goodwill')
  const etc = watch('totalQuantity.etc')

  const isAuto = mode === 'auto'

  const totals = useMemo(() => {
    const rows = [land, object, goodwill, etc].map(r => r ?? EMPTY_ROW)
    const sum = (get: (row: QuantityRow) => number) => rows.reduce((a, row) => a + get(row), 0)
    return {
      totalCnt: sum(r => parseCurrency(r.totalCnt)),
      totalArea: sum(r => parseCurrency(r.totalArea ?? '')),
      totalPrice: sum(r => parseCurrency(r.totalPrice)),
      conferCnt: sum(r => parseCurrency(r.conferCnt)),
      conferArea: sum(r => parseCurrency(r.conferArea ?? '')),
      conferPrice: sum(r => parseCurrency(r.conferPrice)),
      decisionCnt: sum(r => parseCurrency(r.decisionCnt)),
      decisionArea: sum(r => parseCurrency(r.decisionArea ?? '')),
      decisionPrice: sum(r => parseCurrency(r.decisionPrice)),
    }
  }, [land, object, goodwill, etc])

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
        <div className={styles.modeRow}>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            onClick={toggleMode}
            aria-pressed={!isAuto}
          >
            {isAuto ? '수동입력 모드로 전환' : '자동계산 모드로 전환'}
          </Button>
        </div>

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
                const hasArea = ROW_HAS_AREA[key]
                const prefix = `totalQuantity.${key}` as const
                return (
                  <tr key={key}>
                    <th className={cn(styles.th, styles.rowLabel)}>{label}</th>
                    <td className={styles.td}>
                      <input
                        className={styles.cellInput}
                        {...register(`${prefix}.totalCnt`)}
                        readOnly={isAuto}
                        aria-label={`${label} 총 보상대상 필건`}
                      />
                    </td>
                    <td className={styles.td}>
                      {hasArea ? (
                        <input
                          className={styles.cellInput}
                          {...register(`${prefix}.totalArea`)}
                          readOnly={isAuto}
                          aria-label={`${label} 총 보상대상 면적`}
                        />
                      ) : (
                        <span className={styles.cellInput} />
                      )}
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.cellInput}
                        {...register(`${prefix}.totalPrice`)}
                        readOnly={isAuto}
                        aria-label={`${label} 총 보상대상 금액`}
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.cellInput}
                        {...register(`${prefix}.conferCnt`)}
                        aria-label={`${label} 협의취득 필건`}
                      />
                    </td>
                    <td className={styles.td}>
                      {hasArea ? (
                        <input
                          className={styles.cellInput}
                          {...register(`${prefix}.conferArea`)}
                          aria-label={`${label} 협의취득 면적`}
                        />
                      ) : (
                        <span className={styles.cellInput} />
                      )}
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.cellInput}
                        {...register(`${prefix}.conferPrice`)}
                        aria-label={`${label} 협의취득 금액`}
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.cellInput}
                        {...register(`${prefix}.decisionCnt`)}
                        aria-label={`${label} 재결신청 필건`}
                      />
                    </td>
                    <td className={styles.td}>
                      {hasArea ? (
                        <input
                          className={styles.cellInput}
                          {...register(`${prefix}.decisionArea`)}
                          aria-label={`${label} 재결신청 면적`}
                        />
                      ) : (
                        <span className={styles.cellInput} />
                      )}
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.cellInput}
                        {...register(`${prefix}.decisionPrice`)}
                        aria-label={`${label} 재결신청 금액`}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th className={cn(styles.th, styles.tfootRow)}>계</th>
                <td className={styles.td}>
                  <input
                    className={styles.cellInput}
                    readOnly
                    value={totals.totalCnt || ''}
                    aria-label='총계 필건'
                  />
                </td>
                <td className={styles.td}>
                  <input
                    className={styles.cellInput}
                    readOnly
                    value={totals.totalArea || ''}
                    aria-label='총계 면적'
                  />
                </td>
                <td className={styles.td}>
                  <input
                    className={styles.cellInput}
                    readOnly
                    value={totals.totalPrice || ''}
                    aria-label='총계 금액'
                  />
                </td>
                <td className={styles.td}>
                  <input className={styles.cellInput} readOnly value={totals.conferCnt || ''} />
                </td>
                <td className={styles.td}>
                  <input className={styles.cellInput} readOnly value={totals.conferArea || ''} />
                </td>
                <td className={styles.td}>
                  <input className={styles.cellInput} readOnly value={totals.conferPrice || ''} />
                </td>
                <td className={styles.td}>
                  <input className={styles.cellInput} readOnly value={totals.decisionCnt || ''} />
                </td>
                <td className={styles.td}>
                  <input className={styles.cellInput} readOnly value={totals.decisionArea || ''} />
                </td>
                <td className={styles.td}>
                  <input className={styles.cellInput} readOnly value={totals.decisionPrice || ''} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
