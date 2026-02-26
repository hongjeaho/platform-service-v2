import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

/**
 * 재결신청 파일첨부 조회 전용 섹션
 * 파일 목록을 읽기 전용으로 표시
 */
interface DecisionAttachmentsViewProps {
  /** 첨부 파일 목록 (파일명 또는 URL 등 표시용) */
  files?: Array<{ name: string; size?: number }> | null
}

export function DecisionAttachmentsView({ files }: DecisionAttachmentsViewProps) {
  const hasFiles = files && files.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>재결신청 파일첨부</CardTitle>
      </CardHeader>
      <CardContent>
        {hasFiles ? (
          <ul className='list-disc list-inside space-y-1' role='list'>
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className={cn(textCombinations.bodySm, 'text-foreground')}
              >
                {file.name}
                {file.size != null && (
                  <span className='text-muted-foreground ml-1'>({formatFileSize(file.size)})</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={cn(textCombinations.bodySm, 'text-muted-foreground')}>
            첨부된 파일이 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}
