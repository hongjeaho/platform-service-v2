import { defineConfig } from 'orval'

import { commonHooks, commonOutputConfig } from './base.orval.config'

export default defineConfig({
  store: {
    output: {
      ...commonOutputConfig,
      // MSW 미사용 정책(CLAUDE.md) — mock 산출물은 msw/@faker-js 미설치로 tsc를 깨뜨린다
      mock: false,
    },
    hooks: commonHooks,
    input: {
      target: 'http://localhost:8080/api/public/api-docs/json',
    },
  },
})
