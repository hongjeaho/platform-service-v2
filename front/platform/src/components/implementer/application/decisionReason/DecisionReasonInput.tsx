import { useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle, FormTextarea } from '@/common/components/ui'

import type { ApplicationFormData } from '../types'

/**
 * 재결신청사유 입력 섹션
 */
export function DecisionReasonInput() {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>재결신청사유</CardTitle>
      </CardHeader>
      <CardContent>
        <FormTextarea
          name='decisionReason'
          control={control}
          label='재결신청사유'
          placeholder='예)보상금저렴, 재결신청의 청구'
          helpText='소유자의 재결신청사유를 원인별로 간략하게 입력하세요'
          rows={4}
          required
          rules={{
            required: '재결신청사유를 입력해주세요.',
          }}
        />
      </CardContent>
    </Card>
  )
}
