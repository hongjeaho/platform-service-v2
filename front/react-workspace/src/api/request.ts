import { type AxiosError, type AxiosRequestConfig } from 'axios'

import { apiClient } from './client'

/**
 * 중첩된 객체 타입
 */
type NestedValue = string | number | boolean | null | undefined | NestedObject | NestedValue[]
type NestedObject = Record<string, NestedValue>

/**
 * 객체를 평탄화합니다 (중첩된 객체를 dot notation으로 변환).
 * 순환 참조를 방지합니다.
 *
 * @param object 평탄화할 객체
 * @param prefix 접두사 (재귀 호출 시 사용)
 * @param seen 순환 참조 추적용 WeakSet
 * @returns 평탄화된 객체
 */
const flatObject = (
  object: NestedObject,
  prefix = '',
  seen = new WeakSet<object>(),
): Record<string, string | number | boolean> => {
  // 순환 참조 체크
  if (typeof object === 'object' && object !== null && seen.has(object)) {
    return {}
  }
  if (typeof object === 'object' && object !== null) {
    seen.add(object)
  }

  return Object.keys(object).reduce(
    (carry, key: string) => {
      const value = (object as Record<string, unknown>)[key]
      const pre = prefix ? `${prefix}.${key}` : key

      // null, undefined, 빈 문자열은 건너뜀
      if (value === null || value === undefined || value === '') {
        return carry
      }

      if (Array.isArray(value)) {
        // 배열: 각 요소를 인덱스와 함께 추가
        value.forEach((item, index) => {
          if (item !== null && item !== undefined && item !== '') {
            carry[`${pre}[${index}]`] = item
          }
        })
      } else if (typeof value === 'object' && value !== null) {
        // 중첩 객체: 재귀적으로 평탄화
        Object.assign(carry, flatObject(value as NestedObject, pre, seen))
      } else {
        // 원시 타입: 그대로 추가
        carry[pre] = value as string | number | boolean
      }

      return carry
    },
    {} as Record<string, string | number | boolean>,
  )
}

/**
 * HTTP 요청을 수행합니다.
 * Orval이 생성한 API 클라이언트에서 사용됩니다.
 *
 * @param options axios 요청 옵션
 * @returns Promise<T>
 */
export const request = <T>(options: AxiosRequestConfig): Promise<T> => {
  const config: AxiosRequestConfig = { ...options }

  // GET 요청 시 파라미터 직렬화
  if (config.method?.toUpperCase() === 'GET') {
    config.paramsSerializer = paramObj => {
      const flattened = flatObject(paramObj as NestedObject)
      const searchParams = new URLSearchParams()

      for (const [key, value] of Object.entries(flattened)) {
        // 배열 인덱스를 유지하여 데이터 손실 방지
        searchParams.append(key, String(value))
      }

      return searchParams.toString()
    }
  }

  // AbortController는 Orval이 직접 관리하므로 별도 생성하지 않음
  return apiClient(config).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>
