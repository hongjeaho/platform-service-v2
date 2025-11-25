/**
 * 권한 관련 상수 정의
 */

/** 사용자 역할 타입 */
export const USER_ROLES = {
  IMPLEMENTER: 'IMPLEMENTER',
  DECISION: 'DECISION',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/** 페이지별 필요 권한 매핑 */
export const MENU_PERMISSIONS: Record<string, UserRole[]> = {
  receipt: [USER_ROLES.IMPLEMENTER, USER_ROLES.DECISION, USER_ROLES.ADMIN],
  conclusion: [USER_ROLES.DECISION, USER_ROLES.ADMIN],
  admin: [USER_ROLES.ADMIN],
} as const

/** 기본 라우트 (권한이 필요하지 않은 경로) */
export const DEFAULT_ROUTE = 'implementer'

/** 로그인 후 리다이렉션 경로 */
export const LOGIN_REDIRECT_PATH = '/'

/** 권한 체크 옵션 */
export interface PermissionCheckOptions {
  requireAuth?: boolean
  requiredRoles?: UserRole[]
  checkCaseAccess?: boolean
  judgSeq?: number
}

/** 권한 체크 결과 */
export interface PermissionResult {
  hasAccess: boolean
  isLoading: boolean
  requiredRoles?: UserRole[]
  userRoles?: UserRole[]
}

