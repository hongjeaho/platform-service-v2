import type { AuthStatus } from '@hooks/auth/type/auth'
import { useAuth } from '@hooks/auth/useAuth.ts'

/**
 * 인증이 필요한 컴포넌트에서 사용하는 훅
 * - 하이드레이션 완료까지 대기
 * - 로그인 여부 확인
 */
export const useRequireAuth = (): AuthStatus & { isReady: boolean } => {
  const auth = useAuth()

  return {
    ...auth,
    isReady: auth.isHydrated,
  }
}
