import { createBrowserRouter, useRouteError } from 'react-router'

import type { NavSection } from '../components/layout/AppShell'
import { AppShell } from '../components/layout/AppShell'

const navSections: NavSection[] = [{ items: [{ label: '대시보드', to: '/' }] }]

function RootLayout() {
  return (
    <AppShell brand={{ label: 'React Workspace' }} sections={navSections} breadcrumb='대시보드' />
  )
}

function RouterErrorPage() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4 p-6'>
      <h1 className='text-2xl font-bold text-error-foreground'>오류가 발생했습니다</h1>
      <p className='text-muted-foreground'>{message}</p>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>404</h1>
      <p className='text-xl text-muted-foreground'>페이지를 찾을 수 없습니다.</p>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    // path 없는 Layout Route — URL 변경 없이 AppShell을 모든 자식에 적용
    Component: RootLayout,
    errorElement: <RouterErrorPage />,
    children: [
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
])
