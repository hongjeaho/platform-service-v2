import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { STORAGE_KEYS } from '@/constants/storage'

import { authStatusAtom, hydratedUserDataAtom, setHydratedAtom, setUserState } from './store/auth'

/**
 * 통합 인증 관리 훅
 *
 * 하이드레이션 안전한 인증 상태 관리와 자동 하이드레이션 처리를 제공합니다.
 * 로그인/로그아웃 기능을 포함합니다.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isReady, isAuthenticated, userData, login, logout } = useAuth()
 *
 *   if (!isReady) return <div>로딩 중...</div>
 *   if (!isAuthenticated) return <Login />
 *
 *   return <div>환영합니다, {userData?.userId}!</div>
 * }
 * ```
 *
 * @returns 인증 상태 및 액션
 * @property {boolean} isLoading - 하이드레이션 진행 중 여부
 * @property {boolean} isAuthenticated - 로그인 상태 여부
 * @property {AuthUser | null} user - 사용자 정보 (레거시)
 * @property {boolean} isHydrated - 하이드레이션 완료 여부
 * @property {ReturnType<typeof hydratedUserDataAtom>} userData - 하이드레이션 안전한 사용자 데이터
 * @property {function} login - 로그인 함수
 * @property {function} logout - 로그아웃 함수
 * @property {boolean} isReady - 하이드레이션 완료 여부 (별칭)
 * @property {boolean} hasUser - 로그인 상태 여부 (별칭)
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
    localStorage.removeItem(STORAGE_KEYS.USER)
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
