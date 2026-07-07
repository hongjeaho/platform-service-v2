import axios from 'axios'

import { useAuthStore } from '@/store/auth/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // /api/public/** 는 인증이 필요 없는 엔드포인트라 401이 "세션 만료"를 의미하지 않는다
    // (예: 로그인 자체의 자격증명 불일치) — 이 경우엔 로그아웃/리다이렉트를 트리거하지 않는다
    const isPublicEndpoint = error.config?.url?.includes('/api/public/')
    if (error.response?.status === 401 && !isPublicEndpoint) {
      useAuthStore.getState().logout()
      window.location.replace('/login')
    }
    return Promise.reject(error)
  },
)
