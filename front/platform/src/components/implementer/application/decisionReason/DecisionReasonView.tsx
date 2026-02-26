import { Card, CardContent, CardHeader, CardTitle, Textarea } from '@/common/components/ui'

/**
 * 재결신청사유 조회 전용 섹션 (읽기 전용)
 */
interface DecisionReasonViewProps {
  value?: string | null
}

export function DecisionReasonView({ value }: DecisionReasonViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>재결신청사유</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea label='재결신청사유' value={value ?? '-'} readOnly rows={4} tabIndex={-1} />
      </CardContent>
    </Card>
  )
}
