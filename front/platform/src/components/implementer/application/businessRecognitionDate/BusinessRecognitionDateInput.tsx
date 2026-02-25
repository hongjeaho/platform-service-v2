import { useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle, FormInput } from '@/common/components/ui'

import type { ApplicationFormData } from '../types'

/**
 * 사업시행인가고시일(사업인정일) 입력 섹션
 */
export function BusinessRecognitionDateInput() {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          사업시행인가고시일
          <span className='text-sm font-normal text-muted-foreground ml-1'>(사업인정일)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormInput
          name='businessRecognitionDate'
          control={control}
          label='사업시행인가고시일 (사업인정일)'
          placeholder='예) 서울특별시 중구 고시 제 2018-2000호(2018. 12. 25.)'
          required
          rules={{
            required: '사업시행인가고시일을 입력해주세요.',
          }}
        />
        <p className='text-xs text-muted-foreground mt-1'>
          고시(공고)번호와 고시(공고)일자를 입력하세요
        </p>
      </CardContent>
    </Card>
  )
}
