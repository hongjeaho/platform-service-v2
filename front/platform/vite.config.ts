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
          rewrite: path => path.replace(/^\/api/, ''),
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
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/react/')) return 'react'
              if (id.includes('/react-dom/')) return 'react-dom'
              if (id.includes('/react-router-dom/')) return 'react-router-dom'
              if (
                id.includes('@tanstack/react-query') ||
                id.includes('jotai') ||
                id.includes('axios')
              ) {
                return 'state'
              }
              if (id.includes('date-fns')) return 'date-fns'
              if (id.includes('react-hook-form')) return 'form'
              if (id.includes('react-kakao-maps-sdk')) return 'kakao-maps'
              if (id.includes('lucide-react')) return 'icons'

              // 기본적으로 기타 node_modules 들은 vendor로 묶음
              return 'vendor'
            }
          },
        },
      },
      // chunkSizeWarningLimit: 1000, // 필요하면 경고 한도 늘리기
    },
  }
})
