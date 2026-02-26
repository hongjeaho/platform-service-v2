import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import type { EvaluationFormData } from '../types'

interface EvaluationCorporationViewProps {
  data?: EvaluationFormData | null
}

export function EvaluationCorporationView({ data }: EvaluationCorporationViewProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>시도지사 추천 요청</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn(textCombinations.bodySm, 'text-muted-foreground')}>
            표시할 데이터가 없습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  /** 시도지사 추천 값이 있으면(true/false) "감정평가법인 및 협의 감정평가액" 영역 노출 */
  const showSections = data.selectedCheck != null && data.selectedCheck !== undefined

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>시도지사 추천 요청</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn(textCombinations.body, 'mb-4')}>
            시도지사 추천요청 여부: {data.selectedCheck ? '네' : '아니오'}
          </p>
          {data.selectedCheck === false && data.notReqReason && (
            <p className={cn(textCombinations.bodySm, 'text-muted-foreground')}>
              미요청 사유: {data.notReqReason}
            </p>
          )}
          {data.announcementFiles?.length ? (
            <p className={cn(textCombinations.bodySm)}>
              공고문 첨부: {data.announcementFiles.length}개 파일
            </p>
          ) : null}
        </CardContent>
      </Card>

      {showSections && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>감정평가법인 및 협의 감정평가액</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn(textCombinations.bodySm, 'mb-2')}>
                사업시행자 추천: {data.corporations?.businessOperator ?? '-'} / 시도지사 추천:{' '}
                {data.corporations?.governor ?? '-'} / 토지소유자 추천:{' '}
                {data.corporations?.landowner ?? '-'}
              </p>
              <p className={cn(textCombinations.bodySm)}>
                협의 감정평가액 합계 평균:{' '}
                {data.amounts?.amountAverage?.toLocaleString('ko-KR') ?? '-'}원
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>의뢰 공문 및 회신 공문</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn(textCombinations.bodySm)}>
                의뢰 공문: {data.requestLetterFiles?.length ?? 0}개 / 회신 공문:{' '}
                {data.responseLetterFiles?.length ?? 0}개
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
