import { apiClient } from '@api/client'

/**
 * 백엔드 CheckDuplicateResponse DTO 응답 형태.
 *
 * Orval은 이 엔드포인트의 응답 스키마를 제네릭 소거 문제로 정확히 생성하지 못해
 * (`ApiResult.data`가 다른 엔드포인트의 응답 타입으로 고정됨) 여기서 직접 타입을 선언한다.
 * 필드는 `CheckDuplicateResponse.java`(api-platform)와 1:1로 대응한다.
 */
interface CheckDuplicateResponse {
  available: boolean
  message: string
}

interface ApiResultResponse<T> {
  success: boolean
  data: T
  meta?: unknown
}

/**
 * 아이디 사용 가능 여부를 확인한다.
 */
export async function checkUserIdAvailability(userId: string): Promise<boolean> {
  const response = await apiClient.get<ApiResultResponse<CheckDuplicateResponse>>(
    '/api/public/users/availability',
    { params: { userId } },
  )

  return response.data.data.available
}
