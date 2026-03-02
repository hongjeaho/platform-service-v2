/**
 * TotalQuantityStatementInput 서브 컴포넌트
 * Phase 2.2: 컴포넌트 분할 (성능 최적화 및 유지보수성 향상)
 */
import { memo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/common/components/ui'
import { cn } from '@/lib/utils'

import type { ApplicationFormData, QuantityRow } from '../types'
import { ROW_HAS_AREA, ROWS } from './TotalQuantityStatementInput.constants'
import styles from './TotalQuantityStatementInput.module.css'

// ----- Quantity Mode Toggle -----
interface QuantityModeToggleProps {
  isAuto: boolean
  onToggle: () => void
}

export const QuantityModeToggle = memo(function QuantityModeToggle({
  isAuto,
  onToggle,
}: QuantityModeToggleProps) {
  return (
    <div className={styles.modeRow}>
      <Button type='button' variant='secondary' size='sm' onClick={onToggle} aria-pressed={!isAuto}>
        {isAuto ? '수동입력 모드로 전환' : '자동계산 모드로 전환'}
      </Button>
    </div>
  )
})

// ----- Quantity Table -----
interface QuantityTableProps {
  isAuto: boolean
}

export const QuantityTable = memo(function QuantityTable({ isAuto }: QuantityTableProps) {
  const { register } = useFormContext<ApplicationFormData>()

  return (
    <>
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
                  <span className={styles.cellInputPlaceholder} aria-hidden />
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
                  <span className={styles.cellInputPlaceholder} aria-hidden />
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
                  <span className={styles.cellInputPlaceholder} aria-hidden />
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
    </>
  )
})

// ----- Quantity Totals Row -----
interface QuantityTotalsRowProps {
  land: QuantityRow | undefined
  object: QuantityRow | undefined
  goodwill: QuantityRow | undefined
  etc: QuantityRow | undefined
}

export const QuantityTotalsRow = memo(function QuantityTotalsRow({
  land,
  object,
  goodwill,
  etc,
}: QuantityTotalsRowProps) {
  const totals = {
    totalCnt: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.totalCnt || 0),
      0,
    ),
    totalArea: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.totalArea || 0),
      0,
    ),
    totalPrice: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.totalPrice || 0),
      0,
    ),
    conferCnt: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.conferCnt || 0),
      0,
    ),
    conferArea: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.conferArea || 0),
      0,
    ),
    conferPrice: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.conferPrice || 0),
      0,
    ),
    decisionCnt: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.decisionCnt || 0),
      0,
    ),
    decisionArea: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.decisionArea || 0),
      0,
    ),
    decisionPrice: [land, object, goodwill, etc].reduce(
      (sum, row) => sum + Number(row?.decisionPrice || 0),
      0,
    ),
  }

  return (
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
  )
})
