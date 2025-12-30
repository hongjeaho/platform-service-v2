import { useParams } from 'react-router-dom'

/**
 * URL 파라미터에서 judgSeq를 추출하는 훅입니다.
 *
 * @returns judgSeq 값 (문자열), 존재하지 않으면 undefined
 *
 * @example
 * ```tsx
 * const judgSeq = useGetJudgSeq()
 * if (judgSeq) {
 *   console.log('사건 번호:', judgSeq) // "123"
 * }
 * ```
 */
export const useGetJudgSeq = (): string | undefined => {
  const { judgSeq } = useParams<{ judgSeq?: string }>()
  return judgSeq
}
