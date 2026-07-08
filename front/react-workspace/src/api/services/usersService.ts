import { apiClient } from '@api/client'
import axios from 'axios'

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
 *
 * 백엔드는 사용 가능한 경우에만 200을 반환하고, 중복인 경우 200/{available:false}가 아니라
 * 409 Conflict를 던진다(`UsersService.checkAvailability`). 여기서 409를 사용 불가로 변환한다.
 */
export async function checkUserIdAvailability(userId: string): Promise<boolean> {
  try {
    const response = await apiClient.get<ApiResultResponse<CheckDuplicateResponse>>(
      '/api/public/users/availability',
      { params: { userId } },
    )

    return response.data.data.available
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return false
    }
    throw error
  }
}
