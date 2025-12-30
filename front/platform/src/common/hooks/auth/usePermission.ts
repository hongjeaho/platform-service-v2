import { useIsAuthorizedForCase } from '@api/hooks/authority-api/authority-api.ts'
import { useAuth } from '@hooks/auth/useAuth.ts'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import type { PermissionCheckOptions, PermissionResult, UserRole } from './permissions.type'
import { DEFAULT_ROUTE, MENU_PERMISSIONS, USER_ROLES } from './permissions.type'

/**
 * 권한 체크 유틸리티 함수
 */
const hasRequiredRole = (userRoles: UserRole[], requiredRoles: UserRole[]): boolean => {
  return userRoles.some(role => requiredRoles.includes(role))
}

/**
 * 현재 경로에서 필요한 권한을 가져오는 함수
 */
const getRequiredRolesForPath = (pathname: string): UserRole[] => {
  const path = pathname.split('/')[1] ?? DEFAULT_ROUTE
  return MENU_PERMISSIONS[path] ?? []
}

/**
 * 권한 체크 훅
 *
 * 현재 사용자의 권한을 확인하고 페이지별/사건별 접근 권한을 체크합니다.
 *
 * @param options - 권한 체크 옵션
 * @param options.requireAuth - 인증 요구 여부 (기본값: true)
 * @param options.requiredRoles - 필요한 역할 목록 (미지정 시 경로에서 자동 결정)
 * @param options.checkCaseAccess - 사건별 접근 권한 체크 여부
 * @param options.judgSeq - 사건 번호
 *
 * @returns 권한 체크 결과
 *
 * @example
 * ```tsx
 * // 현재 페이지 권한 체크
 * const { hasAccess, isLoading } = usePermission()
 *
 * // 특정 역할 요구
 * const { hasAccess } = usePermission({ requiredRoles: ['ADMIN'] })
 *
 * // 사건 접근 권한 체크
 * const { hasAccess } = usePermission({ judgSeq: 123, checkCaseAccess: true })
 * ```
 *
 * @property {boolean} hasAccess - 접근 권한 여부
 * @property {boolean} isLoading - 권한 체크 진행 중 여부
 * @property {UserRole[]} requiredRoles - 필요한 역할 목록
 * @property {UserRole[]} userRoles - 사용자 역할 목록
 */
export const usePermission = (options: PermissionCheckOptions = {}) => {
  const { isReady, isAuthenticated, userData } = useAuth()
  const location = useLocation()

  const { requireAuth = true, requiredRoles, checkCaseAccess = false, judgSeq } = options

  // 사용자 역할 목록
  const userRoles = useMemo(() => {
    return userData.roles?.map(role => role.role as UserRole) ?? []
  }, [userData.roles])

  // 현재 경로에 필요한 권한
  const pathRequiredRoles = useMemo(() => {
    return requiredRoles ?? getRequiredRolesForPath(location.pathname)
  }, [location.pathname, requiredRoles])

  // 사건별 권한 체크 (선택적)
  const { data: isCaseAuthorized, isLoading: isCaseAuthLoading } = useIsAuthorizedForCase(judgSeq, {
    query: {
      enabled: checkCaseAccess && !!judgSeq && isReady && isAuthenticated,
    },
  })

  // 권한 체크 결과
  const permissionResult: PermissionResult = useMemo(() => {
    // 하이드레이션이 완료되지 않았으면 로딩 상태
    if (!isReady) {
      return {
        hasAccess: false,
        isLoading: true,
        requiredRoles: pathRequiredRoles,
        userRoles,
      }
    }

    // 인증이 필요하지만 로그인하지 않은 경우
    if (requireAuth && !isAuthenticated) {
      return {
        hasAccess: false,
        isLoading: false,
        requiredRoles: pathRequiredRoles,
        userRoles,
      }
    }

    // 사건별 권한 체크가 로딩 중인 경우
    if (checkCaseAccess && isCaseAuthLoading) {
      return {
        hasAccess: false,
        isLoading: true,
        requiredRoles: pathRequiredRoles,
        userRoles,
      }
    }

    // 기본 역할 기반 권한 체크
    const hasRoleAccess =
      pathRequiredRoles.length === 0 || hasRequiredRole(userRoles, pathRequiredRoles)

    // DECISION 역할은 모든 사건에 접근 가능
    const isDecisionUser = userRoles.includes(USER_ROLES.DECISION)

    // 사건별 권한 체크 결과
    const hasCaseAccess =
      !checkCaseAccess || isDecisionUser || isCaseAuthorized === true || judgSeq === undefined

    return {
      hasAccess: hasRoleAccess && hasCaseAccess,
      isLoading: false,
      requiredRoles: pathRequiredRoles,
      userRoles,
    }
  }, [
    isReady,
    isAuthenticated,
    requireAuth,
    pathRequiredRoles,
    userRoles,
    checkCaseAccess,
    isCaseAuthLoading,
    isCaseAuthorized,
    judgSeq,
  ])

  return permissionResult
}

/**
 * 현재 페이지 권한 체크 훅 (간단 버전)
 */
export const usePagePermission = (judgSeq?: number) => {
  return usePermission({
    requireAuth: true,
    checkCaseAccess: !!judgSeq,
    judgSeq,
  })
}

/**
 * 특정 역할 권한 체크 훅
 */
export const useRolePermission = (requiredRoles: UserRole[]) => {
  return usePermission({
    requireAuth: true,
    requiredRoles,
    checkCaseAccess: false,
  })
}
