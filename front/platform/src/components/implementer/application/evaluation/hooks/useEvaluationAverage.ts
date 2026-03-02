import { useMemo } from 'react'

/**
 * 감정평가액 평균 계산 훅
 * 시도지사 추천 여부에 따라 2개 또는 3개 금액의 평균을 계산
 *
 * Phase 3.2: 계산 로직 분리 (재사용성 향상)
 *
 * @param amountA - 사업시행자 추천 감정평가액
 * @param amountB - 시도지사 추천 감정평가액 (선택사항)
 * @param amountC - 토지소유자 추천 감정평가액
 * @param hasGovernorRecommendation - 시도지사 추천 여부
 * @returns 계산된 평균 금액
 *
 * @example
 * ```tsx
 * const averageAmount = useEvaluationAverage(
 *   amounts?.amountA,
 *   amounts?.amountB,
 *   amounts?.amountC,
 *   hasGovernorRecommendation
 * )
 * ```
 */
export function useEvaluationAverage(
  amountA: number | undefined,
  amountB: number | undefined,
  amountC: number | undefined,
  hasGovernorRecommendation: boolean,
): number {
  return useMemo(() => {
    const a = Number(amountA) || 0
    const c = Number(amountC) || 0

    if (hasGovernorRecommendation && amountB != null) {
      const b = Number(amountB) || 0
      return Math.round((a + b + c) / 3)
    }

    return a && c ? Math.round((a + c) / 2) : 0
  }, [amountA, amountB, amountC, hasGovernorRecommendation])
}
