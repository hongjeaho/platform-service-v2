import { useShowAlertMessageCallBack } from '@hooks/auth/store/message'
import { AUTH_MESSAGES } from '@hooks/auth/type/messages'
import { LOGIN_REDIRECT_PATH } from '@hooks/auth/type/permissions'
import { usePermission } from '@hooks/auth/usePermission.ts'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type { RouteGuardConfig } from './type/routeGuard'

/**
 * 라우트 가드 훅
 * - 권한에 따른 자동 리다이렉션
 * - 사용자 친화적인 에러 메시지 표시
 * - 선언적 라우트 보호
 */
export const useRouteGuard = (config: RouteGuardConfig = {}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const showAlertMessage = useShowAlertMessageCallBack()

  const { requireAuth = true, requiredRoles, redirectTo = LOGIN_REDIRECT_PATH } = config

  // URL에서 judgSeq 추출
  const pathSegments = location.pathname.split('/')
  const judgSeq = pathSegments.find((segment, index) => {
    return pathSegments[index - 1] === 'judgment' || !isNaN(Number(segment))
  })

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
