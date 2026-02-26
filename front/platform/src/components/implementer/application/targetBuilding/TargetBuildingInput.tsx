import { useFormContext } from 'react-hook-form'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  tableStyles,
} from '@/common/components/ui'
import { useDynamicRows } from '@/common/hooks/form/useDynamicRows'
import { icons, iconSizes } from '@/constants/design'
import { cn } from '@/lib/utils'

import type { ApplicationFormData } from '../types'
import type { TargetBuildingRow } from '../types'
import styles from './TargetBuildingInput.module.css'

const AddIcon = icons.add
const DeleteIcon = icons.delete

const DEFAULT_ROW: TargetBuildingRow = {
  locationOwner: '',
  lotNumber: '',
  landCategory: '',
  areaBeforeInclusion: '',
  areaIncluded: '',
  remarks: '',
}

/**
 * 대상(건축물) 입력 섹션 (동적 행 추가/삭제)
 * 소재지, 지번, 지목, 면적(편입 전/편입), 비고
 */
export function TargetBuildingInput() {
  const { register } = useFormContext<ApplicationFormData>()

  const { fields, handleAdd, handleRemove, canRemove } = useDynamicRows<TargetBuildingRow>(
    'targetBuilding',
    0,
    DEFAULT_ROW,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>대상(건축물)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          header={
            <>
              <tr>
                <th className={tableStyles.th}>소재지(소유자)</th>
                <th className={tableStyles.th}>지번</th>
                <th className={tableStyles.th}>지목</th>
                <th colSpan={2} className={tableStyles.th}>
                  면적(m²)
                </th>
                <th className={tableStyles.th}>비고</th>
                <th className={cn(tableStyles.th, tableStyles.thActions)}>
                  <Button type='button' variant='secondary' size='sm' onClick={handleAdd}>
                    <AddIcon className={cn(iconSizes.sm, tableStyles.iconSpacer)} aria-hidden />
                    추가
                  </Button>
                </th>
              </tr>
              <tr>
                <th className={tableStyles.th} />
                <th className={tableStyles.th} />
                <th className={tableStyles.th} />
                <th className={tableStyles.th}>편입 전 면적</th>
                <th className={tableStyles.th}>편입 면적</th>
                <th className={tableStyles.th} />
                <th className={tableStyles.th} />
              </tr>
            </>
          }
        >
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td className={tableStyles.td}>
                <input
                  className={styles.rowInput}
                  {...register(`targetBuilding.${index}.locationOwner` as const)}
                  aria-label='소재지(소유자)'
                />
              </td>
              <td className={tableStyles.td}>
                <input
                  className={cn(styles.rowInput, styles.rowInputCenter)}
                  {...register(`targetBuilding.${index}.lotNumber` as const)}
                  aria-label='지번'
                />
              </td>
              <td className={tableStyles.td}>
                <input
                  className={cn(styles.rowInput, styles.rowInputCenter)}
                  {...register(`targetBuilding.${index}.landCategory` as const)}
                  aria-label='지목'
                />
              </td>
              <td className={tableStyles.td}>
                <input
                  className={cn(styles.rowInput, styles.rowInputCenter)}
                  {...register(`targetBuilding.${index}.areaBeforeInclusion` as const)}
                  aria-label='편입 전 면적'
                />
              </td>
              <td className={tableStyles.td}>
                <input
                  className={cn(styles.rowInput, styles.rowInputCenter)}
                  {...register(`targetBuilding.${index}.areaIncluded` as const)}
                  aria-label='편입 면적'
                />
              </td>
              <td className={tableStyles.td}>
                <input
                  className={styles.rowInput}
                  {...register(`targetBuilding.${index}.remarks` as const)}
                  aria-label='비고'
                />
              </td>
              <td className={cn(tableStyles.td, tableStyles.tdActions)}>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleRemove(index)}
                  disabled={!canRemove}
                  aria-label='행 삭제'
                >
                  <DeleteIcon className={cn(iconSizes.sm, tableStyles.iconSpacer)} aria-hidden />
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </CardContent>
    </Card>
  )
}
