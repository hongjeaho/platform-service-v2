import type { AuthUser } from '@api/model/authUser.ts'
import type { BasicAuthority } from '@api/model/basicAuthority.ts'

/**
 * 인증 상태 타입 정의
 */

/** 인증 상태 */
export interface AuthStatus {
  isLoading: boolean
  isAuthenticated: boolean
  user: AuthUser | null
  isHydrated: boolean // 하이드레이션 완료 여부
}

/** 하이드레이션 안전한 사용자 데이터 */
export interface HydratedUserData {
  user: AuthUser | null
  roles: BasicAuthority[]
  isHydrated: boolean
}
