import type { UserRole } from './permissions.type'

/** 라우트 가드 설정 */
export interface RouteGuardConfig {
  requireAuth?: boolean
  requiredRoles?: UserRole[]
  redirectTo?: string
}
