/**
 * 에러 처리 유틸리티
 */

/**
 * 에러 메시지를 추출합니다.
 * @param error - 에러 객체
 * @returns 에러 메시지
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return '알 수 없는 오류가 발생했습니다.'
}

/**
 * API 에러 응답에서 메시지를 추출합니다.
 * @param response - API 응답 객체
 * @returns 에러 메시지
 */
export function getApiErrorMessage(response: { message?: string; error?: string }): string {
  return response.message || response.error || 'API 요청에 실패했습니다.'
}

/**
 * 에러를 콘솔에 로깅합니다.
 * @param error - 에러 객체
 * @param context - 추가 컨텍스트 정보
 */
export function logError(error: unknown, context?: string): void {
  const message = getErrorMessage(error)
  const contextPrefix = context ? `[${context}] ` : ''

  if (import.meta.env.DEV) {
    console.error(`${contextPrefix}${message}`, error)
  }

  // TODO: 프로덕션 환경에서는 Sentry 같은 에러 트래킹 서비스로 전송
  // if (Sentry) {
  //   Sentry.captureException(error, { tags: { context } })
  // }
}
