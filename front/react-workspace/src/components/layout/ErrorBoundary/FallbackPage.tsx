import { AlertTriangle, RefreshCw } from 'lucide-react'

import type { FallbackPageProps } from './ErrorBoundary.type'

export function FallbackPage({ error, resetError }: FallbackPageProps) {
  const errorMessage = error?.message || '알 수 없는 오류가 발생했습니다.'
  const errorStack = error?.stack

  const handleRefresh = () => {
    if (resetError) {
      resetError()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-6'>
      <div className='w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-lg'>
        {/* 아이콘 */}
        <div className='flex justify-center'>
          <div className='rounded-full bg-error/10 p-4'>
            <AlertTriangle className='h-12 w-12 text-error' aria-hidden='true' />
          </div>
        </div>

        {/* 제목 */}
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-card-foreground'>오류가 발생했습니다</h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            죄송합니다. 예상치 못한 문제가 발생했습니다.
          </p>
        </div>

        {/* 에러 메시지 */}
        {errorMessage && (
          <div className='rounded-md bg-destructive/10 p-4'>
            <p className='break-words text-sm text-destructive'>{errorMessage}</p>
          </div>
        )}

        {/* 에러 스택 (개발 모드에서만 표시) */}
        {import.meta.env.DEV && errorStack && (
          <details className='rounded-md bg-muted p-4'>
            <summary className='cursor-pointer text-sm font-medium text-muted-foreground hover:text-muted-foreground/80'>
              에러 상세 정보 (개발자용)
            </summary>
            <pre className='mt-2 overflow-auto text-xs text-muted-foreground'>{errorStack}</pre>
          </details>
        )}

        {/* 안내 문구 */}
        <div className='rounded-md bg-muted/50 p-4'>
          <p className='text-sm text-muted-foreground'>문제가 지속되면 다음을 시도해보세요:</p>
          <ul className='mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground'>
            <li>페이지를 새로고침해주세요</li>
            <li>브라우저 캐시를 삭제해주세요</li>
            <li>나중에 다시 시도해주세요</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className='flex flex-col gap-3 sm:flex-row'>
          <button
            type='button'
            onClick={handleRefresh}
            className='flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          >
            <RefreshCw className='h-4 w-4' aria-hidden='true' />
            새로고침
          </button>
          <button
            type='button'
            onClick={() => (window.location.href = '/')}
            className='flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}
