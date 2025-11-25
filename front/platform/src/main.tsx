import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { setupInterceptors } from '@utils/http'
import { createStore, Provider as JotaiProvider } from 'jotai'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from './router'

/**
 * React Query 클라이언트 인스턴스를 초기화합니다.
 *
 * 기본 설정:
 * - staleTime: 5분 (커스텀 쿼리 옵션에서 정의)
 * - gcTime: 10분 (캐시 유지 시간)
 * - retry: 최대 3회 (4xx 제외)
 */
const queryClient = new QueryClient()

/**
 * Jotai store 인스턴스를 생성합니다.
 * HTTP 인터셉터가 React 외부에서 이 store에 접근할 수 있습니다.
 */
const jotaiStore = createStore()

/**
 * HTTP 인터셉터를 설정합니다.
 * 앱 시작 시 한 번만 실행됩니다.
 */
setupInterceptors(jotaiStore)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JotaiProvider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* 개발 환경에서만 React Query DevTools 표시 */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </JotaiProvider>
  </StrictMode>,
)
