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
  }
})
