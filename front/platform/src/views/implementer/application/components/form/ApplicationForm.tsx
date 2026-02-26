import {
  type ApplicationFormData,
  EvaluationCorporationInput,
} from '@components/implementer/application'
import {
  AgreementDetailsInput,
  BusinessInput,
  BusinessRecognitionDateInput,
  CityPlanningInput,
  DecisionAttachmentsInput,
  DecisionReasonInput,
  TargetBuildingInput,
  TotalQuantityStatementInput,
} from '@components/implementer/application'
import { APPLICATION_FORM_DEFAULT_VALUES } from '@components/implementer/application/defaultValues'
import { gap } from '@constants/design/spacing'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/common/components/ui'
import { cn } from '@/lib/utils'
import { formatConsultationDate } from '@/utils/format/date'

export interface ApplicationFormProps {
  /** write: 신규 작성, edit: 수정 (API 데이터 로드) */
  mode?: 'write' | 'edit'
  /** 폼 초기값 (테스트 등에서 주입용, 미지정 시 APPLICATION_FORM_DEFAULT_VALUES 사용) */
  defaultValues?: ApplicationFormData
}

/**
 * 재결신청 통합 폼
 * useFormContext로 모든 하위 섹션이 연동되며, Edit 모드 시 API 데이터를 reset()으로 주입합니다.
 */
export function ApplicationForm({
  mode = 'write',
  defaultValues = APPLICATION_FORM_DEFAULT_VALUES,
}: ApplicationFormProps) {
  const navigate = useNavigate()

  const methods = useForm<ApplicationFormData>({
    defaultValues,
  })

  // TODO: Edit 모드 + judgSeqNo 있을 때 API 데이터 로드 후 reset (Orval 훅 연동 시 사용)
  // TODO: 로딩 상태 UI 처리

  const onSubmit = (data: ApplicationFormData) => {
    const payload = {
      ...data,
      agreementDetails: data.agreementDetails.map(row => ({
        ...row,
        consultationDate: formatConsultationDate(row.consultationDate),
      })),
    }
    console.log('ApplicationForm submit:', payload)
    // TODO: usePutApplicationData 등 연동
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={cn('flex flex-col', gap.loose)}>
        <BusinessInput />
        <AgreementDetailsInput />
        <EvaluationCorporationInput />
        <CityPlanningInput />
        <TargetBuildingInput />
        <DecisionReasonInput />
        <BusinessRecognitionDateInput />
        <TotalQuantityStatementInput />
        <DecisionAttachmentsInput />

        <div className={cn('flex justify-end', gap.tight)}>
          <Button type='button' variant='secondary' onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type='submit' variant='primary'>
            {mode === 'write' ? '재결신청 제출' : '수정 완료'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
