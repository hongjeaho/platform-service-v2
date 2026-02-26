import { Card, CardContent, CardHeader, CardTitle, Input } from '@/common/components/ui'

import type { ApplicationFormData } from '../types'

/**
 * 사업 정보 조회 전용 섹션 (읽기 전용)
 * 데이터는 부모에서 주입되거나 props로 받을 수 있음
 */
interface BusinessViewProps {
  /** 폼 컨텍스트 대신 직접 데이터 전달 시 사용 */
  data?: ApplicationFormData['business'] | null
}

export function BusinessView({ data }: BusinessViewProps) {
  if (data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>사업 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <Input label='사건번호' value={data.caseNo ?? '-'} readOnly tabIndex={-1} />
            <Input label='사업명' value={data.caseTitle ?? '-'} readOnly tabIndex={-1} />
          </div>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <Input label='위치' value={data.address ?? '-'} readOnly tabIndex={-1} />
            <Input label='규모(단위)' value={data.scale ?? '-'} readOnly tabIndex={-1} />
          </div>
          <div className='mt-4'>
            <Input label='사업기간' value={data.businessPeriod ?? '-'} readOnly tabIndex={-1} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>사업 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>표시할 데이터가 없습니다.</p>
      </CardContent>
    </Card>
  )
}
