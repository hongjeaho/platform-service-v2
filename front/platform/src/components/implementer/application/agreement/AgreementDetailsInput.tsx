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
import { FormDatePicker } from '@/common/components/ui/form/datePicker/FormDatePicker'
import { useDynamicRows } from '@/common/hooks/form/useDynamicRows'
import { icons, iconSizes } from '@/constants/design'
import { cn } from '@/lib/utils'

import type { ApplicationFormData } from '../types'
import type { AgreementDetail } from '../types'
import styles from './AgreementDetailsInput.module.css'

const AddIcon = icons.add
const DeleteIcon = icons.delete

const DEFAULT_ROW: AgreementDetail = {
  consultationDate: '',
  consultationDateText: '',
}

/**
 * 협의 내역 입력 섹션 (동적 행 추가/삭제)
 * useFieldArray로 agreementDetails 배열 관리, 최소 1행 유지.
 * 부모 defaultValues에 agreementDetails: [DEFAULT_ROW] 한 개 이상 넣어 두는 것을 권장.
 */
export function AgreementDetailsInput() {
  const { control } = useFormContext<ApplicationFormData>()

  const { fields, handleAdd, handleRemove, canRemove } = useDynamicRows<
    AgreementDetail & Record<string, unknown>
  >('agreementDetails', 1, DEFAULT_ROW as Partial<AgreementDetail & Record<string, unknown>>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>협의 내역</CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          header={
            <tr>
              <th className={cn(tableStyles.th, styles.thDate, styles.cellCenter)}>날짜</th>
              <th className={cn(tableStyles.th, styles.cellCenter)}>내용</th>
              <th className={cn(tableStyles.th, tableStyles.thActions)}>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  className={styles.addButton}
                  onClick={handleAdd}
                >
                  <AddIcon className={cn(iconSizes.sm, tableStyles.iconSpacer)} aria-hidden />
                  추가
                </Button>
              </th>
            </tr>
          }
        >
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td className={cn(tableStyles.td, styles.cellCenter)}>
                <FormDatePicker
                  name={`agreementDetails.${index}.consultationDate` as const}
                  control={control}
                  rules={{ required: '날짜를 입력해주세요.' }}
                  placeholder='예) 2023.10.23'
                  className={styles.cellDatePicker}
                  required
                />
              </td>
              <td className={cn(tableStyles.td, styles.cellCenter)}>
                <FormInput
                  name={`agreementDetails.${index}.consultationDateText` as const}
                  control={control}
                  rules={{ required: '내용을 입력해주세요.' }}
                  placeholder='예시) 손실보상협의요청 제1차 (건설관리과 2003-001호)'
                  className={styles.cellInput}
                  required
                />
              </td>
              <td className={cn(tableStyles.td, tableStyles.tdActions)}>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className={styles.deleteButton}
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
