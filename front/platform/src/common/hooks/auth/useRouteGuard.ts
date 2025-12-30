import { useShowAlertMessageCallBack } from '@hooks/auth/store/message'
import { usePermission } from '@hooks/auth/usePermission.ts'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AUTH_MESSAGES } from './messages.type'
import { LOGIN_REDIRECT_PATH } from './permissions.type'
import type { RouteGuardConfig } from './routeGuard.type'

/**
 * 라우트 가드 훅
 *
 * 권한에 따른 자동 리다이렉션과 사용자 친화적인 에러 메시지 표시를 수행합니다.
 * 선언적 라우트 보호를 위한 훅입니다.
 *
 * @param config - 라우트 가드 설정
 * @param config.requireAuth - 인증 요구 여부 (기본값: true)
 * @param config.requiredRoles - 필요한 역할 목록
 * @param config.redirectTo - 리다이렉션 경로 (기본값: LOGIN_REDIRECT_PATH)
 *
 * @returns 권한 결과 및 가드 상태
 *
 * @example
 * ```tsx
 * function AdminPage() {
 *   const { isGuarding, isBlocked } = useRouteGuard({ requiredRoles: ['ADMIN'] })
 *
 *   if (isGuarding) return <div>권한 확인 중...</div>
 *   // 권한 없으면 자동으로 리다이렉트됨
 *
 *   return <AdminPanel />
 * }
 * ```
 *
 * @property {boolean} hasAccess - 접근 권한 여부
 * @property {boolean} isLoading - 권한 체크 진행 중 여부
 * @property {UserRole[]} requiredRoles - 필요한 역할 목록
 * @property {UserRole[]} userRoles - 사용자 역할 목록
 * @property {boolean} isGuarding - 가드 진행 중 여부
 * @property {boolean} isBlocked - 접근 차단 여부
 */
export const useRouteGuard = (config: RouteGuardConfig = {}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const showAlertMessage = useShowAlertMessageCallBack()

  const { requireAuth = true, requiredRoles, redirectTo = LOGIN_REDIRECT_PATH } = config

  // URL에서 judgSeq 추출 (/judgment/{숫자} 패턴)
  const extractJudgSeqFromPath = (pathname: string): string | undefined => {
    const judgmentMatch = pathname.match(/\/judgment\/(\d+)/)
    return judgmentMatch ? judgmentMatch[1] : undefined
  }

  const judgSeq = extractJudgSeqFromPath(location.pathname)

  const permission = usePermission({
    requireAuth,
    requiredRoles,
    checkCaseAccess: !!judgSeq, // judgSeq가 있을 때만 사건 권한 체크
    judgSeq: judgSeq ? Number(judgSeq) : undefined,
  })

  useEffect(() => {
    // 로딩 중이거나 권한이 있으면 아무것도 하지 않음
    if (permission.isLoading || permission.hasAccess) {
      return
    }

    // 권한이 없는 경우 처리
    const handleUnauthorized = () => {
      // 조건부 할당으로 타입 에러 방지
      const message =
        requireAuth && !permission.hasAccess
          ? AUTH_MESSAGES.LOGIN_REQUIRED
          : AUTH_MESSAGES.ACCESS_DENIED

      showAlertMessage(message, () => {
        navigate(redirectTo, { replace: true })
      })
    }

    handleUnauthorized()
  }, [
    permission.isLoading,
    permission.hasAccess,
    requireAuth,
    redirectTo,
    navigate,
    showAlertMessage,
  ])

  return {
    ...permission,
    // 가드 상태
    isGuarding: permission.isLoading,
    isBlocked: !permission.isLoading && !permission.hasAccess,
  }
}

/**
 * 페이지 보호 훅 (간편 버전)
 * - 현재 페이지 권한 체크 및 보호
 */
export const usePageGuard = () => {
  return useRouteGuard({
    requireAuth: true,
    // requiredRoles는 현재 경로에서 자동 결정됨
  })
}

/**
 * 관리자 페이지 보호 훅
 */
export const useAdminGuard = () => {
  return useRouteGuard({
    requireAuth: true,
    requiredRoles: ['ADMIN'],
  })
}
