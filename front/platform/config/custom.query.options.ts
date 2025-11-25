// Custom query options for Orval-generated API hooks
const isDevelopment = process.env.NODE_ENV === 'development'

export const customQueryOptionsFn = (options: any = {}): any => {
  // Query와 Mutation 구분
  const isQueryOption = !options?.mutation

  if (!isQueryOption) {
    // Mutation 옵션: 재시도 비활성화 (중복 요청 방지)
    return {
      retry: false,
      ...options,
    }
  }

  // Query 옵션: 환경별 설정
  return {
    // 개발 환경: 빠른 피드백
    // 프로덕션: 캐싱과 효율성
    staleTime: isDevelopment ? 0 : 1000 * 60 * 5, // 프로덕션: 5분간 데이터가 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지 후 가비지 컬렉션
    refetchOnWindowFocus: isDevelopment, // 개발: true (자동 재요청), 프로덕션: false (효율성)
    refetchOnReconnect: true, // 네트워크 재연결 시 재요청 활성화
    retry: (failureCount: number, error: any) => {
      // 4xx 에러는 재시도하지 않음
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      // 최대 2번까지 재시도 (총 3번 요청) - 프로덕션에 적합한 수준
      return failureCount < 2
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnMount: true, // staleTime을 존중하면서 stale 데이터만 재요청
    // 사용자 옵션을 마지막에 적용하여 덮어쓰기 허용
    ...options,
  }
}
