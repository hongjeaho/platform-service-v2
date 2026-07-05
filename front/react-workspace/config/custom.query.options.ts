import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query'

/**
 * TanStack Query용 커스텀 옵션 팩토리
 *
 * Query와 Mutation에 적합한 기본값을 설정합니다:
 * - Mutation: 재시도 비활성화 (중복 요청 방지)
 * - Query: 5분 staleTime, 10분 gcTime, 스마트 재시도 로직
 */
export const customQueryOptionsFn = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> |
           UseMutationOptions<unknown, TError, void, unknown>,
): UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> |
    UseMutationOptions<unknown, TError, void, unknown> => {
  // Mutation 옵션: 재시도 비활성화 (중복 요청 방지)
  if (options && 'mutation' in options) {
    return {
      retry: false,
      ...options,
    } as UseMutationOptions<unknown, TError, void, unknown>
  }

  // Query 옵션: 환경별 설정
  return {
    staleTime: 1000 * 60 * 5, // 프로덕션: 5분간 데이터가 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지 후 가비지 컬렉션
    refetchOnWindowFocus: false, // 효율성을 위해 자동 재요청 비활성화
    refetchOnReconnect: true, // 네트워크 재연결 시 재요청 활성화
    retry: (failureCount: number, error: any) => {
      // 4xx 에러는 재시도하지 않음
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      // 최대 2번까지 재시도 (총 3번 요청)
      return failureCount < 2
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnMount: true, // stale 데이터만 재요청
    ...options,
  } as UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
}
