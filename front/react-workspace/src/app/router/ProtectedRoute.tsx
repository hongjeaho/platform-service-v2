import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

import { selectIsAuthenticated, useAuthStore } from '@/store/auth/authStore'

export interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // 현재 경로를 state로 저장하여 로그인 후 복귀할 수 있게 함
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}
