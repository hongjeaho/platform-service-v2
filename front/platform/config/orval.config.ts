import { defineConfig } from 'orval'

import { commonHooks, commonOutputConfig } from './base.orval.config'

// 환경별 API URL 설정
const getApiUrl = () => {
  const isDev = process.env.NODE_ENV === 'development'
  const envApiUrl = process.env.VITE_API_BASE_URL

  if (envApiUrl) {
    return `${envApiUrl}/api/public/api-docs/json`
  }

  // fallback URL (개발환경)
  return isDev
    ? 'http://localhost:8080/api/public/api-docs/json'
    : process.env.VITE_API_BASE_URL || 'http://localhost:8080/api/public/api-docs/json'
}

export default defineConfig({
  store: {
    output: {
      ...commonOutputConfig,
      // 개발 환경에서만 mock 활성화 고려
      mock: process.env.NODE_ENV === 'development' && process.env.VITE_ENABLE_MOCK === 'true',
    },
    hooks: commonHooks,
    input: {
      target: getApiUrl(),
      validation: false, // OpenAPI Validation 비활성화 (성능상 이유)
      // 개발 환경에서만 상세 로깅
      ...(process.env.NODE_ENV === 'development' && {
        logLevel: 'info',
      }),
    },
  },
})
