import { apiClient } from '@api/client'
import type { AuthRequest } from '@api/generated/model'

import type { Role, User } from '@/store/auth/authStore.type'

/**
 * 백엔드 AuthUser DTO 응답 형태.
 *
 * Orval은 이 엔드포인트의 응답 스키마를 제네릭 소거 문제로 정확히 생성하지 못해
 * (`ApiResult`가 다른 엔드포인트의 데이터 타입으로 고정됨) 여기서 직접 타입을 선언한다.
 * 필드는 `AuthUser.java`(common-core)와 1:1로 대응한다.
 */
interface AuthUserResponse {
  seq: number
  userEmail: string
  userId: string
  name: string
  roles: { userSeq: number; role: string }[]
}

interface ApiResultResponse<T> {
  success: boolean
  data: T
  meta?: unknown
}

export interface LoginResult {
  user: User
  token: string
}

function toUser(authUser: AuthUserResponse): User {
  const roles: Role[] = authUser.roles.map(role => ({
    id: role.userSeq,
    name: role.role as Role['name'],
  }))

  return {
    id: authUser.seq,
    name: authUser.name,
    email: authUser.userEmail,
    roles,
  }
}

/**
 * 로그인한다.
 *
 * JWT는 응답 body가 아니라 `Authorization` 헤더로 내려오므로, Orval이 생성한
 * `useLogin`(응답 헤더를 버리는 공용 request() 유틸 사용)은 쓸 수 없다 — 여기서
 * axios를 직접 호출해 전체 응답에서 헤더를 읽는다.
 */
export async function login(authRequest: AuthRequest): Promise<LoginResult> {
  const response = await apiClient.post<ApiResultResponse<AuthUserResponse>>(
    '/api/public/auth',
    authRequest,
  )

  const token = response.headers.authorization
  if (!token) {
    throw new Error('로그인 응답에 인증 토큰이 없습니다.')
  }

  return { user: toUser(response.data.data), token }
}
