/**
 * 시도지사 추천요청 및 감정평가법인 입력 섹션 (오케스트레이터)
 * Phase 2.1: 컴포넌트 분할 - 하위 컴포넌트로 위임
 * Phase 3.1: useFormWatch 훅 사용 (재사용성 향상)
 * Phase 3.2: useEvaluationAverage 훅 사용 (계산 로직 분리)
 * 조건부: selectedCheck true 시 감정평가법인·금액·의뢰/회신 공문 표시
 */
import { memo, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { useFormWatch } from '@/common/hooks/form/useFormWatch'

import type { ApplicationFormData } from '../types'
import {
  EvaluationAmountsCard,
  EvaluationCorporationCard,
  GovernorRequestCard,
  LetterFilesCard,
} from './EvaluationCorporationInput.parts'
import { useEvaluationAverage } from './hooks/useEvaluationAverage'

export const EvaluationCorporationInput = memo(function EvaluationCorporationInput() {
  const { setValue } = useFormContext<ApplicationFormData>()

  // Phase 3.1: Using useFormWatch hook for clean, reusable field watching
  const { selectedCheck, amounts } = useFormWatch<ApplicationFormData>([
    'evaluation.selectedCheck',
    'evaluation.amounts',
  ])

  /** 비교 시 네이티브 radio에서 오는 문자열 포함 (boolean | null | string) */
  const selectedValue = selectedCheck as boolean | null | string | undefined

  /** 시도지사 추천요청 여부를 선택했을 때만 "감정평가법인 및 협의 감정평가액" 영역 노출 */
  const hasAnsweredGovernorRequest = selectedValue !== null && selectedValue !== undefined

  /** "네" 선택 시 시도지사 추천 컬럼 표시 */
  const hasGovernorRecommendation = selectedValue === true || selectedValue === 'true'

  /** "아니오" 선택 시 미요청 사유 입력 영역 표시 */
  const showNotRequestedReasonSection = selectedValue === false || selectedValue === 'false'

  // Phase 3.2: Using useEvaluationAverage hook for clean calculation logic
  const averageAmount = useEvaluationAverage(
    amounts?.amountA,
    amounts?.amountB,
    amounts?.amountC,
    hasGovernorRecommendation,
  )

  // Only update form value when averageAmount actually changes (prevent unnecessary re-renders)
  const prevAverageRef = useRef(averageAmount)
  useEffect(() => {
    if (prevAverageRef.current !== averageAmount) {
      setValue('evaluation.amounts.amountAverage', averageAmount, {
        shouldValidate: false,
        shouldDirty: false,
      })
      prevAverageRef.current = averageAmount
    }
  }, [averageAmount, setValue])

  return (
    <>
      <GovernorRequestCard showNotRequestedReasonSection={showNotRequestedReasonSection} />

      {hasAnsweredGovernorRequest && (
        <>
          <EvaluationCorporationCard hasGovernorRecommendation={hasGovernorRecommendation} />
          <EvaluationAmountsCard
            hasGovernorRecommendation={hasGovernorRecommendation}
            averageAmount={averageAmount}
          />
          <LetterFilesCard />
        </>
      )}
    </>
  )
})
