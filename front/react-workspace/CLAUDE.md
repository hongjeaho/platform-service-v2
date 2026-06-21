# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

본 프로젝트는 최신 React 생태계를 기반으로 구성된 프론트엔드 애플리케이션입니다.
빠른 개발 경험(DX), 유지보수성, 타입 안정성, 그리고 확장 가능한 아키텍처를 목표로 설계되었습니다.

- **Framework**: React 19, TypeScript, Vite
- **React Compiler**: `babel-plugin-react-compiler` 활성화 — `useMemo`/`useCallback` 직접 작성 금지 (컴파일러가 자동 최적화)
- **상태관리**: Zustand (클라이언트), TanStack Query (서버)
- **스타일**: Tailwind CSS v4, CSS Modules
- **Build**: pnpm 10
- **API 클라이언트**: Orval (OpenAPI → TypeScript 자동 생성, `src/api/generated/`에 출력)

# Frontend

`front/react-workspace` 개발 규칙 및 명령어 가이드.

## Frontend Commands

```bash
pnpm lint:fix && pnpm format   # 커밋 전 필수
pnpm orval                      # OpenAPI → TypeScript 클라이언트 재생성
pnpm test:run                   # 단일 실행
pnpm storybook                  # 컴포넌트 문서 (port 6006)
```

## 디렉토리 구조

```
src/
├── api/
│   ├── client.ts          # Axios 인스턴스 (JWT 자동 주입, 401 → /login 리다이렉트)
│   ├── request.ts         # 공통 요청 유틸리티
│   ├── tokenService.ts    # 토큰 저장/갱신 로직
│   ├── generated/         # Orval 자동 생성 코드 (수동 수정 금지)
│   └── services/          # 순수 API 함수 ({domain}Service.ts)
├── app/
│   ├── providers.tsx      # 전역 Provider 조합
│   ├── queryClient.ts     # TanStack Query 클라이언트 설정
│   └── router.tsx         # React Router 라우트 정의
├── components/
│   ├── common/            # 재사용 공통 컴포넌트
│   └── layout/            # 레이아웃 전용 컴포넌트 (ErrorBoundary, Layout 등)
├── features/{domain}/
│   ├── components/        # 도메인 전용 컴포넌트
│   ├── hooks/             # TanStack Query 래핑 훅
│   ├── pages/             # Page 컴포넌트 (React Router lazy용)
│   └── types/             # 도메인 타입 ({name}.type.ts)
├── hooks/                 # 전역 공통 훅 (도메인 무관, useDebounce 등)
├── store/{domain}/        # Zustand 스토어
├── styles/                # CSS 변수, TypeScript 토큰, 폰트
└── utils/                 # 순수 유틸리티 함수 (cn, format, validation 등)
```

## Frontend Patterns

### 컴포넌트 패턴

**공통 컴포넌트 (`src/components/common`)** — 기본 6개 파일:
```
Button/ → Button.tsx, Button.type.ts, Button.module.css, Button.stories.tsx, Button.test.tsx, index.ts
```

복합 컴포넌트(AlertDialog, Table, Select 등)는 추가 파일 허용:
- 서브 컴포넌트: `AlertDialogContent.tsx`, `TableRow.tsx` 등 (같은 폴더에 위치)
- Context 분리: `{Name}.context.ts` (Combobox, Select, RadioGroup 등 상태 공유 필요 시)
- AI 프롬프트: `{Name}.prompt.md` (컴포넌트 생성 지침)

공통 규칙:
- CSS Module 필수, `className` prop 외부 노출 금지
- `forwardRef` 금지 → ref를 일반 prop으로 받음 (React 19)
- 파생 값은 `useState+useEffect` 대신 인라인 계산으로 처리

**피처 컴포넌트 (`src/features/{domain}`)** — 복잡도에 따라 단일 파일 or 폴더
- 공통 컴포넌트 재사용 최우선, 중복 구현 금지
- Tailwind 우선, CSS Module은 복잡한 애니메이션 등 필요 시에만
- `cn()` (`src/utils/cn.ts`) 사용 가능 — clsx + tailwind-merge 조합
- Page 컴포넌트는 `export function Component()` 로 export (React Router lazy용)

**레이아웃 컴포넌트 (`src/components/layout`)** — 라우팅/앱 구조 전용
- `ErrorBoundary`, `Layout` 등 앱 셸 컴포넌트
- 도메인 로직 포함 금지

### 상태관리

- **TanStack Query**: 서버 데이터 캐싱/동기화 → `features/{domain}/hooks/`에서 wrapping
- **Zustand**: 클라이언트 UI 상태 → `store/{domain}/` (selector 필수)

```
// ✅ selector로 구독 범위 최소화
const user = useAuthStore(selectUser)

// ❌ 전체 구독 → 불필요한 리렌더링
const { user } = useAuthStore()
```

### API 호출 패턴 (3계층)

1. `src/api/client.ts` — Axios 인스턴스 (JWT 자동 주입, 401 → `/login` 리다이렉트)
2. `src/api/services/{domain}Service.ts` — 순수 API 함수 (TanStack Query 미포함)
3. `src/features/{domain}/hooks/use{Domain}.ts` — TanStack Query 래핑 + Query key factory

```ts
// Query key factory 패턴 — 모든 도메인 훅에 필수 (계층적 구조)
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}
```

### 훅 위치 규칙

| 훅 종류 | 위치 | 예시 |
|---|---|---|
| 도메인 서버 상태 | `features/{domain}/hooks/` | `useUsers`, `useOrders` |
| 도메인 무관 공통 | `src/hooks/` | `useDebounce`, `useLocalStorage` |
| Zustand store 훅 | `store/{domain}/` | `useAuthStore` |

### 타입 파일 위치 규칙

| 타입 종류 | 위치 |
|---|---|
| 컴포넌트 props | 컴포넌트와 같은 폴더 (`Button.type.ts`) |
| 피처 도메인 타입 | `features/{domain}/types/{name}.type.ts` |
| Store 상태 타입 | store와 같은 폴더 (`authStore.type.ts`) |

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트/파일 | PascalCase | `UserCard.tsx` |
| 훅 | `use` prefix + camelCase | `useUsers`, `useAuthStore` |
| 서비스 | camelCase + `Service` suffix | `userService` |
| Query key 객체 | `{domain}Keys` | `userKeys` |
| Zustand store | `use{Name}Store` | `useAuthStore` |
| 타입 파일 | `{name}.type.ts` | `user.type.ts`, `authStore.type.ts` |

## Design System

**신규 공통 컴포넌트는 반드시 `/common-gen ComponentName` 커맨드로 시작할 것.**

| 커맨드 | 용도 |
|---|---|
| `/common-gen Name` | 디자인 토큰 기반 공통 컴포넌트 스켈레톤 생성 |

> 스펙 문서: `docs/design/` (overview · color · typography · spacing · components · tokens)
> 토큰 구현: `src/styles/` — 상세 아키텍처는 `src/styles/CLAUDE.md` 참조

### 디자인 토큰 사용 원칙

- 모든 색상/스페이싱/타이포그래피는 `src/styles/`의 CSS 변수 또는 TypeScript 토큰 사용
- 하드코딩 hex/rgb/px 값 절대 금지 — `var(--primary)`, `rawColors.primary` 등 토큰 경유
- `bg-gray-*`, `text-blue-*` 등 Tailwind 기본 색상 팔레트 직접 사용 금지 — 디자인 토큰으로만
- 공통 컴포넌트는 `className` prop을 받지 않음 — CSS Module 내 CSS 변수로만 스타일링

## 기획 및 설계 워크플로우

**신규 기능 기획 시 반드시 `/feature-planner` 커맨드로 시작할 것.**

아이디어 → spec → spec-fixed → PRD+ADR → issues 파이프라인을 단계별 승인 게이트(GATE)와 함께 실행한다.

| 커맨드 형식 | 동작 |
|---|---|
| `/feature-planner` | 현재 git 브랜치에서 feature-path 자동 추론 |
| `/feature-planner {기능 설명}` | 브랜치 추론 + 설명 추가 |
| `/feature-planner {feature-path}` | 경로 직접 지정 (예: `notice/list`) |

> `main`·`master`·`develop` 등 보호 브랜치에서 실행 시, 먼저 feature 브랜치 생성을 안내한다.
> 확정된 `feature-path`는 세션 컨텍스트에 저장되어 이후 `/test-scenarios`, `/tdd-red`, `/tdd-green`, `/tdd-refactor`, `/e2e-test`, `/security-review`, `/create-pr` 스킬에 자동 전달된다.

### 파이프라인 개요

```
/feature-planner
    ↓ 브랜치 → feature-path 자동 추론 (보호 브랜치 시 생성 안내) [GATE]
    ↓ 단계 0: spec.md 확인 / 생성 → 진입 조건 검증 [GATE]
    ↓ 단계 1: 요구사항 인터뷰 → spec-fixed.md [GATE]
    ↓ 단계 2: PRD 뼈대 → 아키텍처 3안 선택 [GATE] → ADR → Out of Scope [GATE]
    ↓ 단계 3: 이슈 분해 → issues.md [GATE]
    ↓ /test-scenarios 핸드오프 (feature-path 자동 전달)
```

**산출물 경로**: `/src/features/{feature-path}/docs/`

### 승인 게이트 요약

| 지점 | 확인 내용 |
|------|----------|
| 단계 0 진입 | 브랜치 추론 경로 확정 |
| 단계 0 — spec.md | 기존 spec 검토 또는 신규 생성 확인 |
| 단계 1 후 | spec-fixed.md — 모호성 제거, 용어 확정 |
| 단계 2-2 후 | 아키텍처 3안 중 하나 선택 |
| 단계 2-4 후 | Out of Scope — 범위 확정 |
| 단계 3 후 | 이슈 목록 — 수직슬라이스·AC·의존성 확인 |

## TDD 이슈 사이클

새 이슈 작업 시 다음 순서를 따른다:

1. `/test-scenarios N`    — 시그니처 + 시나리오 (skill)
2. `/tdd-red N`           — 실패 테스트 작성 (skill)
3. `/tdd-green N`         — 최소 구현, 테스트 전체 통과 (skill)
4. `@ac-verifier N`       — AC 충족 독립 검증, 테스트 통과 ≠ AC 충족 (agent)
5. `/tdd-refactor N`      — 구조 개선, 깨지면 즉시 롤백 (skill)
6. `/e2e-test N`          — PRD 사용자 스토리 기반 Playwright E2E 테스트 (skill)
7. `/security-review N`   — 타입·보안 점검 (skill)
8. `/create-pr`           — E2E 검증 → push → PR 생성 (skill)

각 단계는 인간 승인 게이트가 있다. **자동으로 다음 단계로 넘어가지 말 것.**

> 이슈 1개를 처음부터 끝까지 한 번에 실행하려면 `/tdd-cycle N`을 사용한다.

### 이슈 분해 원칙 (수직 슬라이싱)

- "이 이슈만 완료하면 사용자에게 보여줄 수 있는 동작이 있는가?" → **Yes**여야 함
- 수평 슬라이싱 금지 (API만 → Store만 → UI만 순서로 분리하지 않는다)
- AC는 반드시 Given-When-Then 형식으로 작성
