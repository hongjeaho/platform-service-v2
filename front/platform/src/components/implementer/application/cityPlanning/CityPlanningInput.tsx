import { useFormContext } from 'react-hook-form'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormInput,
  Table,
  tableStyles,
} from '@/common/components/ui'
import { useDynamicRows } from '@/common/components/ui/layout/table'
import { icons, iconSizes, textCombinations } from '@/constants/design'
import { cn } from '@/lib/utils'

import type { ApplicationFormData } from '../types'
import type { CityPlanningRow } from '../types'
import styles from './CityPlanningInput.module.css'

const AddIcon = icons.add
const DeleteIcon = icons.delete

const DEFAULT_ROW: CityPlanningRow = {
  title: '',
  content: '',
}

/**
 * 도시계획 [사업인정]관계 입력 섹션 (동적 행 추가/삭제)
 */
export default function CityPlanningInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  const { fields, handleAdd, handleRemove, canRemove } = useDynamicRows<CityPlanningRow>(
    'cityPlanning',
    0,
    DEFAULT_ROW,
  )

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
              <th className={cn(tableStyles.th, tableStyles.thActions)}>
                <Button type='button' variant='secondary' size='sm' onClick={handleAdd}>
                  <AddIcon className={cn(iconSizes.sm, tableStyles.iconSpacer)} aria-hidden />
                  추가
                </Button>
              </th>
            </tr>
          }
        >
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td className={tableStyles.td}>
                <FormInput
                  name={`cityPlanning.${index}.title` as const}
                  control={control}
                  aria-label='제목'
                />
              </td>
              <td className={tableStyles.td}>
                <FormInput
                  name={`cityPlanning.${index}.content` as const}
                  control={control}
                  aria-label='내용'
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
        {errors.cityPlanning?.root?.message && (
          <span
            className={cn(textCombinations.bodyXs, 'text-error block', styles.errorMessage)}
            role='alert'
          >
            {errors.cityPlanning.root.message}
          </span>
        )}
      </CardContent>
    </Card>
  )
}
