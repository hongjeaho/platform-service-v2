import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { authStatusAtom, hydratedUserDataAtom, setHydratedAtom, setUserState } from './store/auth'

/**
 * 통합 인증 관리 훅
 * - 하이드레이션 안전한 인증 상태 관리
 * - 자동 하이드레이션 처리
 * - 로그인/로그아웃 기능
 */
export const useAuth = () => {
  const authStatus = useAtomValue(authStatusAtom)
  const userData = useAtomValue(hydratedUserDataAtom)
  const setHydrated = useSetAtom(setHydratedAtom)
  const setUser = useSetAtom(setUserState)

  // 컴포넌트 마운트 시 하이드레이션 완료 표시
  useEffect(() => {
    if (!authStatus.isHydrated) {
      setHydrated(true)
    }
  }, [authStatus.isHydrated, setHydrated])

  const login = (user: Parameters<typeof setUser>[0]) => {
    setUser(user)
  }

  const logout = () => {
    setUser(null)
    // localStorage에서도 제거
    localStorage.removeItem('user')
  }

  return {
    // 상태
    ...authStatus,
    userData,

    // 액션
    login,
    logout,

    // 편의 속성
    isReady: authStatus.isHydrated,
    hasUser: authStatus.isAuthenticated,
  }
}
