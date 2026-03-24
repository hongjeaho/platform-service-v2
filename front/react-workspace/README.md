# React 19 Government Platform

정부 플랫폼을 위한 React 19 기반 웹 애플리케이션 템플릿입니다.

## 기술 스택

- **React 19** - React Compiler 자동 최적화
- **TypeScript** - Strict mode, 타입 안전성 보장
- **TailwindCSS v4** - OKLCH 색상 공간 기반 디자인 시스템
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Zustand** - 로컬 상태 관리
- **TanStack Query** - 서버 상태 관리
- **React Router v7** - 클라이언트 사이드 라우팅
- **Storybook** - 컴포넌트 문서화
- **Vitest** - 단위 테스트
- **Orval** - OpenAPI 기반 TypeScript API 클라이언트 생성

## 시작 방법

### 선행 조건

- Node.js 18+
- pnpm 8+

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

개발 서버가 http://localhost:3000 에서 실행됩니다.

### 환경 변수

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:8080
```

## 주요 명령어

```bash
# 개발
pnpm dev              # 개발 서버 시작 (port 3000)
pnpm build            # 프로덕션 빌드
pnpm preview          # 프로덕션 빌드 미리보기

# 코드 품질
pnpm lint:fix         # ESLint 수정
pnpm format           # Prettier 포맷팅

# API
pnpm orval            # OpenAPI로부터 TypeScript 클라이언트 생성

# 테스트
pnpm test             # 테스트 실행 (watch 모드)
pnpm test:run         # 테스트 실행 (한 번)
pnpm test:ui          # 테스트 UI 실행

# Storybook
pnpm storybook        # Storybook 시작 (port 6006)
pnpm storybook:build  # Storybook 정적 빌드
```

**커밋 전 항상 `pnpm format`과 `pnpm lint:fix`를 실행하세요.**

## 프로젝트 구조

```
src/
├── api/                    # API 레이어
│   ├── client.ts          # Axios 인스턴스
│   ├── services/          # API 서비스 함수
│   └── generated/         # Orval 생성 파일
├── app/                    # 앱 설정
│   ├── providers.tsx      # React Query Provider
│   ├── queryClient.ts     # Query Client 설정
│   └── router.tsx         # React Router 설정
├── components/
│   ├── common/            # 재사용 가능한 공통 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트
│       ├── ErrorBoundary/ # 에러 바운더리
│       └── Layout.tsx     # 기본 레이아웃
├── features/               # 도메인별 피처
│   ├── auth/              # 인증 관련
│   ├── home/              # 홈 피처
│   └── user/              # 사용자 피처
├── hooks/                  # 커스텀 훅
├── store/                  # Zustand stores
│   └── auth/              # 인증 상태
├── styles/                 # 디자인 시스템
│   ├── tokens.ts          # 디자인 토큰
│   └── globals.css        # 전역 스타일
├── utils/                  # 유틸리티 함수
└── test/                   # 테스트 설정
```

### Path Aliases

```typescript
@/*              → src/*
@api/*           → src/api/*
@components/*    → src/components/*
@features/*      → src/features/*
@styles/*        → src/styles/*
```

## 디자인 시스템

이 프로젝트는 중앙화된 디자인 토큰 시스템을 사용합니다. 자세한 내용은 [`src/styles/README.md`](src/styles/README.md)를 참조하세요.

```tsx
import { buttonVariants, semanticColorClasses } from '@/styles'

// ✅ GOOD - 디자인 토큰 사용
<button className={buttonVariants.primary}>버튼</button>

// ❌ BAD - 하드코딩된 값
<button style={{ backgroundColor: '#3B82F6' }}>버튼</button>
```

## 코딩 규칙

### 공통 컴포넌트 (`src/components/common`)

- 엄격한 파일 구조 준수: `.tsx`, `.type.ts`, `.module.css`, `.stories.tsx`, `.test.tsx`
- CSS Modules 사용 (className prop 허용하지 않음)
- Storybook으로 문서화 (CSF3 + useArgs)
- React 19 패턴 (ref as prop, forwardRef 미사용)

### 피처 컴포넌트 (`src/features`)

- **공통 컴포넌트 우선 재사용** - 로직 중복 방지
- 복잡도에 따른 구조 선택 (단일 파일 vs 폴더)
- Tailwind 권장, CSS Modules 선택적
- 비즈니스 로직에만 테스트 작성

### Git 워크플로우

- **커밋 메시지**: `type(scope): 한글 요약 (50자 이내)`
- **브랜치**: `type/description` 또는 `type/ISSUE-NUMBER-description`

**예시:**
```
feat(auth): 로그인 폼 구현
fix(user): 사용자 목록 정렬 버그 수정
docs(readme): 설치 방법 문서 추가
```

상세 규칙은 [`.cursor/rules/`](.cursor/rules/)를 참조하세요.

## API 레이어

- **Client**: `src/api/client.ts` - 인증 토큰 자동 추가, 401 처리
- **Services**: `src/api/services/` - 도메인별 API 함수
- **Generated**: `src/api/generated/` - Orval로 자동 생성된 타입 안전 클라이언트

```bash
# OpenAPI 스펙에서 클라이언트 생성
pnpm orval
```

## 테스트

```bash
# 모든 테스트 실행
pnpm test:run

# 특정 파일 테스트
pnpm test UserListPage

# 커버리지 확인
pnpm test:run -- --coverage
```

커버리지 목표: 80%

## Storybook

```bash
# Storybook 실행
pnpm storybook
```

http://localhost:6006 에서 모든 공통 컴포넌트의 스토리를 확인할 수 있습니다.

## 새 프로젝트 시작 시 체크리스트

이 템플릿을 기반으로 새 프로젝트를 시작할 때:

1. [ ] `package.json`의 name, description, version 수정
2. [ ] `.env.local` 생성 및 환경 변수 설정
3. [ ] `index.html`의 제목/메타데이터 수정
4. [ ] 파비콘 추가 (`/public/favicon.ico`)
5. [ ] Orval 설정 수정 (`config/orval.local.config.ts`)
6. [ ] `pnpm orval` 실행
7. [ ] 브랜딩 수정 (`src/styles/tokens.ts`)
8. [ ] 라우팅 구조 수정 (`src/app/router.tsx`)
9. [ ] Git 원격 저장소 연결

## 추가 학습 자료

- [React 19 문서](https://react.dev/)
- [TailwindCSS v4 문서](https://tailwindcss.com/docs)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Storybook 문서](https://storybook.js.org/docs)

## 라이선스

MIT

---

**관리자**: 정부 플랫폼 개발팀
