import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getDefaultStore } from 'jotai'

import { alertMessageState } from '../../common/components/message/store'
import { STORAGE_KEYS } from '../../constants/storage'

const API_BASE_URL = ''

/**
 * axios 인스턴스
 * 모든 HTTP 요청에 사용됩니다.
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

// 토큰 만료 알림 중복 방지 플래그
let isTokenExpiredAlertShown = false

/**
 * HTTP 인터셉터를 설정합니다.
 *
 * @param store Jotai store 인스턴스 (옵셔널, 기본값은 getDefaultStore())
 * @returns cleanup 함수
 */
export const setupInterceptors = (store?: ReturnType<typeof getDefaultStore>) => {
  const jotaiStore = store || getDefaultStore()

  // Request 인터셉터
  const requestInterceptor = axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTHORIZATION) as string | undefined
      if (token !== undefined) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
  )

  // Response 인터셉터
  const responseInterceptor = axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      const { headers } = response

      // Authorization 헤더 갱신
      if (headers[STORAGE_KEYS.AUTHORIZATION] !== undefined) {
        localStorage.setItem(STORAGE_KEYS.AUTHORIZATION, headers[STORAGE_KEYS.AUTHORIZATION])
      }

      // 파일 다운로드 처리
      if (headers['content-disposition']) {
        const disposition = headers['content-disposition']
        const match = disposition?.match(/filename\*?=([^;]+)/i)
        const extracted = match?.[1]?.replace("UTF-8''", '').replace(/"/g, '').trim()
        if (extracted) {
          const filename = decodeURIComponent(extracted)
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(url)
        }
      }

      return response
    },
    (error: AxiosError | Error): Promise<AxiosError> => {
      // Error 인터셉터
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { headers } = error.response

          const isTokenExpired = headers['x-token-expired']
          if (isTokenExpired === 'true') {
            localStorage.removeItem(STORAGE_KEYS.AUTHORIZATION)
            localStorage.removeItem(STORAGE_KEYS.USER)

            // 중복 알림 방지
            if (!isTokenExpiredAlertShown) {
              isTokenExpiredAlertShown = true

              // Jotai store 직접 사용
              jotaiStore.set(alertMessageState, {
                message: '로그인이 필요합니다.',
                onCallBack: () => {
                  isTokenExpiredAlertShown = false
                  window.location.href = '/'
                },
              })
            }
          }
        }
      }

      return Promise.reject(error)
    },
  )

  // cleanup 함수 반환
  return () => {
    axiosInstance.interceptors.request.eject(requestInterceptor)
    axiosInstance.interceptors.response.eject(responseInterceptor)
  }
}
