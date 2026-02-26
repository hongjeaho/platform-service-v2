import { Card, CardContent, CardHeader, CardTitle, Input } from '@/common/components/ui'

/**
 * 사업시행인가고시일 조회 전용 섹션 (읽기 전용)
 */
interface BusinessRecognitionDateViewProps {
  value?: string | null
}

export function BusinessRecognitionDateView({ value }: BusinessRecognitionDateViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          사업시행인가고시일
          <span className='text-sm font-normal text-muted-foreground ml-1'>(사업인정일)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          label='사업시행인가고시일 (사업인정일)'
          value={value ?? '-'}
          readOnly
          tabIndex={-1}
        />
      </CardContent>
    </Card>
  )
}
