import { AppShell } from '@components/layout/AppShell'
import { useRouteError } from 'react-router'

import { getNavSections } from '../routeRegistry'

/**
 * Root layout component with AppShell
 */
export function RootLayout() {
  return (
    <AppShell brand={{ label: 'React Workspace' }} sections={getNavSections()} breadcrumb='홈' />
  )
}

/**
 * Error page component for router errors
 */
export function RouterErrorPage() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4 p-6'>
      <h1 className='text-2xl font-bold text-error-foreground'>오류가 발생했습니다</h1>
      <p className='text-muted-foreground'>{message}</p>
    </div>
  )
}

/**
 * 404 Not Found page component
 */
export function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>404</h1>
      <p className='text-xl text-muted-foreground'>페이지를 찾을 수 없습니다.</p>
    </div>
  )
}
