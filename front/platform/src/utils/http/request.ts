import { type AxiosError, type AxiosRequestConfig } from 'axios'

import { axiosInstance } from './client'

/**
 * 객체를 평탄화합니다 (중첩된 객체를 dot notation으로 변환).
 *
 * @param object 평탄화할 객체
 * @param prefix 접두사 (재귀 호출 시 사용)
 * @returns 평탄화된 객체
 */
const flatObject = (object: Record<string, any>, prefix = '') => {
  return Object.keys(object).reduce((carry: Record<string, any>, key: string) => {
    const pre = prefix ? prefix + `.${key}` : ''

    if (Array.isArray(object[key])) {
      carry = object[key].reduce((array: Record<string, any>, value: any, index: number) => {
        array[(pre || key) + `[${index}]`] = value
        return array
      }, carry)
    } else if (object[key] && typeof object[key] === 'object') {
      Object.assign(carry, flatObject(object[key], pre || key))
    } else {
      carry[pre || key] = object[key]
    }

    return carry
  }, {})
}

/**
 * HTTP 요청을 수행합니다.
 * Orval이 생성한 API 클라이언트에서 사용됩니다.
 *
 * @param options axios 요청 옵션
 * @returns Promise<T>
 */
export const request = <T>(options: AxiosRequestConfig): Promise<T> => {
  const config = {
    ...options,
  }

  // GET 요청 시 파라미터 직렬화
  if (config.method?.toUpperCase() === 'GET') {
    config.paramsSerializer = paramObj => {
      const queryString = new URLSearchParams()
      for (const [key, value] of Object.entries(flatObject(paramObj))) {
        if (value !== null && value !== undefined && value !== '') {
          const addKey = key.replace(/\[.+]/, '')
          queryString.append(addKey, value)
        }
      }
      return queryString.toString()
    }
  }

  const controller = new AbortController()
  const promise = axiosInstance({ ...config, signal: controller.signal }).then(({ data }) => data)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  promise.cancel = () => {
    controller.abort()
  }

  return promise
}

export type ErrorType<Error> = AxiosError<Error>
