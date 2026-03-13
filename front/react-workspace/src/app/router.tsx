import { createBrowserRouter } from 'react-router'

import { Layout } from '../components/layout/Layout'

function PageLoader() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    // path 없는 Layout Route — URL 변경 없이 Layout을 모든 자식에 적용
    Component: Layout,
    children: [
      {
        path: '/',
        index: true,
        HydrateFallback: PageLoader,
        lazy: {
          Component: async () => (await import('../features/home/pages/HomePage')).Component,
        },
      },
      {
        path: 'users',
        HydrateFallback: PageLoader,
        lazy: {
          Component: async () => (await import('../features/user/pages/UserListPage')).Component,
        },
      },
    ],
  },
])
