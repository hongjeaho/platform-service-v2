import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

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
                    // test 모드에서는 React Compiler를 비활성화한다.
                    // 컴파일러가 useMemo/useCallback을 재작성하면 v8 소스맵이 어긋나
                    // 실제로는 실행된 코드가 미커버로 보고되는 false negative가 발생한다.
                    plugins: mode !== 'test' ? [['babel-plugin-react-compiler']] : [],
                },
            }),
            tsconfigPaths(),
            tailwindcss(),
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
            exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e'],

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
                    'src/test/',
                    'e2e',
                    '**/*.d.ts',
                    '**/*.config.*',
                    '**/mockData',
                    'dist/',
                    // 테스트 대상이 아닌 파일
                    '.storybook/**',           // Storybook — 테스트로 실행 불가
                    'src/main.tsx',
                    'src/App.tsx',
                    '**/index.ts',
                    '.prettierrc.cjs',
                    'config/**',               // Orval 환경설정
                    '**/*.stories.tsx',        // Storybook 파일 — 테스트로 실행 불가
                    '**/*.type.ts',            // 타입 정의만 존재, 런타임 로직 없음
                    'src/app/**',
                    'src/api/**',              // Orval 자동생성 — 수동 수정 금지
                    'src/app/router.tsx',      // 라우트 선언부 — 통합 테스트 영역
                    'src/features/**/pages/',  // 페이지 컴포넌트 — e2e/통합 테스트 영역
                    'src/features/**/hooks/',  // TanStack Query 훅 — API 모킹 필요, 통합 테스트 영역
                    'src/components/layout/Layout.tsx', // 라우팅 셸 (NavLink + Outlet) — 통합/e2e 테스트 영역
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