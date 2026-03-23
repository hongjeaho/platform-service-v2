import { defineConfig } from 'orval'

import { commonHooks, commonOutputConfig } from './base.orval.config'

export default defineConfig({
  store: {
    output: {
      ...commonOutputConfig,
      // 개발 환경에서만 mock 활성화 고려
      mock: true,
    },
    hooks: commonHooks,
    input: {
      target: 'http://localhost:8080/api/public/api-docs/json',
    },
  },
})
