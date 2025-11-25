import { type AuthUser } from '@api/model/authUser.ts'
import { type BasicAuthority } from '@api/model/basicAuthority.ts'
import { type AuthStatus, type HydratedUserData } from '@hooks/auth/type/auth'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// 하이드레이션 완료 상태를 추적하는 atom
export const isHydratedAtom = atom<boolean>(false)

// 동기식으로 초기값을 설정하는 함수
const getInitialUserData = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem('user')
    if (!stored || stored === 'null' || stored === 'undefined') {
      return null
    }
    return JSON.parse(stored) as AuthUser
  } catch {
    return null
  }
}

// localStorage와 동기화되는 user atom (즉시 초기화)
export const userState = atomWithStorage<AuthUser | null>('user', getInitialUserData())

// 하이드레이션 상태 설정
export const setHydratedAtom = atom(null, (_, set, isHydrated: boolean) => {
  set(isHydratedAtom, isHydrated)
})

// 사용자 정보를 설정하는 write-only atom (전체 교체)
export const setUserState = atom(null, (_, set, newUser: AuthUser | null) => {
  set(userState, newUser)
})

// 사용자 정보를 부분적으로 업데이트하는 atom
export const updateUserState = atom(null, (get, set, updates: Partial<AuthUser>) => {
  const currentUser = get(userState)
  if (currentUser) {
    set(userState, { ...currentUser, ...updates })
  }
})

// 하이드레이션 안전한 인증 상태 atom
export const authStatusAtom = atom<AuthStatus>(get => {
  const user = get(userState)
  const isHydrated = get(isHydratedAtom)

  return {
    isLoading: !isHydrated,
    isAuthenticated: user !== null && user !== undefined,
    user,
    isHydrated,
  }
})

// 하이드레이션 안전한 사용자 데이터 atom
export const hydratedUserDataAtom = atom<HydratedUserData>(get => {
  const user = get(userState)
  const isHydrated = get(isHydratedAtom)

  return {
    user,
    roles: user?.roles ?? [],
    isHydrated,
  }
})

// 로그인 상태를 확인하는 파생된 atom (기존 이름 유지)
export const isLoginSelector = atom<boolean>(get => {
  const { isAuthenticated, isHydrated } = get(authStatusAtom)
  return isHydrated && isAuthenticated
})

// 하위 호환성을 위한 legacy 함수들 (deprecated 표시)
/** @deprecated Use authStatusAtom instead */
export const useAuthStatusSelector = () => {
  const user = getInitialUserData()

  return {
    isLoading: false, // 동기식으로 변경됨
    isLogin: user !== null,
    user,
  }
}

/** @deprecated Use hydratedUserDataAtom instead */
export const userAuthoritySelector = (): BasicAuthority[] => {
  const user = getInitialUserData()
  return user?.roles ?? []
}
