import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    server: {
      port: 3000,
      host: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    esbuild: {
      target: 'es2020',
    },
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tsconfigPaths(),
      tailwindcss(),
      visualizer({ open: true }),
    ],
    build: {
      sourcemap: isDev, // 개발 모드에서만 소스맵 생성
      minify: !isDev, // 개발 모드에서는 압축하지 않음
      // Vite의 기본 청크 분리 전략 사용 (manualChunks 제거)
      // React 19의 scheduler 등 복잡한 의존성 체인을 Vite가 자동으로 올바른 순서로 처리
      // chunkSizeWarningLimit: 1000, // 필요하면 경고 한도 늘리기
    },
    // Vitest 테스트 설정
    test: {
      // 전역 API 활성화 (describe, it, expect 등 import 불필요)
      globals: true,

      // 테스트 환경 설정
      environment: 'jsdom',

      // 테스트 파일 패턴
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      // 테스트 제외 파일
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],

      // 테스트 설정 파일
      setupFiles: ['./src/test/setup.ts'],

      // CSS 처리
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },

      // 테스트 실행 pool 설정 (Vitest 4.0 - poolOptions 제거, 최상위 옵션 사용)
      pool: 'threads',
      maxWorkers: 4,

      // 커버리지 설정 (Vitest 4.0 - all 옵션 제거됨)
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'src/gen/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData',
          'dist/',
        ],
        // 문 라인 기준 커버리지 임계값
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },

      // watch 모드 설정
      watch: false,
    },
  }
})
