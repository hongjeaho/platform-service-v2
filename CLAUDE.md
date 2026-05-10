# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

한국 정부/행정 플랫폼 서비스. Spring Boot 3.4.2(WebFlux 제외, 일반 MVC) + React 19 풀스택 멀티모듈 모노레포.

- **Backend**: Spring Boot 3.4.2, JOOQ 3.19, MyBatis, Flyway, MySQL 8, Java 21
- **Frontend**: React 19, TypeScript, Vite, Zustand, TanStack Query, Tailwind CSS v4
- **Build**: Gradle 8 (backend), pnpm 10 (frontend)

## Quick Start

```bash
# 1. DB 시작
docker-compose up -d   # MySQL 3306, user: root / pw: root / db: store

# 2. JOOQ 코드 생성 (빌드 전 필수)
./gradlew :datasource:platform:generateJooq

# 3. 백엔드 실행 (port 8080)
./gradlew :api:platform:bootRun --args='--spring.profiles.active=local'

# 4. 프론트엔드 실행 (port 3000, /api → localhost:8080 프록시)
cd front/react-workspace && pnpm dev
```

## Backend Commands

```bash
# 빌드
./gradlew :api:platform:build -x test

# 테스트
./gradlew test

# JOOQ 코드 재생성 (스키마 변경 후)
./gradlew :datasource:platform:generateJooq

# 헬스체크
GET /actuator/health
GET /actuator/prometheus
```

## Frontend Commands

```bash
pnpm lint:fix && pnpm format   # 커밋 전 필수
pnpm orval                      # OpenAPI → TypeScript 클라이언트 재생성
pnpm test:run                   # 단일 실행
pnpm storybook                  # 컴포넌트 문서 (port 6006)
```

> 프론트엔드 상세 규칙: `front/react-workspace/CLAUDE.md`

## Architecture

### 모듈 구조

| 디렉토리 | 역할 |
|---------|-----|
| `common/*` | 공유 라이브러리 (jar only) — `core`(JWT, DTO, OpenAPI), `web`(AOP, 캐시, 필터), `jooq`(코드 생성 전략) |
| `datasource/*` | 데이터 접근 계층 — JOOQ 생성 코드, MyBatis 매퍼, Flyway 마이그레이션 |
| `api/*` | 실행 가능 API 서버 (bootJar) |
| `batch/*` | 배치 처리 애플리케이션 (bootJar) |
| `front/react-workspace/` | React SPA |

`settings.gradle`이 `common/*/`, `datasource/*/`, `api/*/`, `batch/*/` 패턴으로 모듈을 자동 검색.

### 백엔드 요청 흐름

```
HTTP Request
→ SecurityConfig (JWT 필터, CORS, CSRF disabled)
→ Controller (@RestController, OpenAPI 문서화)
→ Service (비즈니스 로직)
→ Repository (JOOQ DSL 또는 MyBatis)
→ MySQL (HikariCP)
```

## Backend Patterns

- **JOOQ** (기본): 타입 안전 SQL, `datasource/platform/`에 자동 생성된 DSL 코드
- **MyBatis** (보조): 복잡한 동적 쿼리용
- **Flyway**: `datasource/platform/flyway/V*.sql` 버전 관리 마이그레이션
- **JWT Auth**: `Authorization` 헤더, `SessionCreationPolicy.STATELESS`, BCrypt 비밀번호
- **AOP Auditing**: `@Auditing` 어노테이션으로 요청 추적 (`common-web`)
- **캐싱**: Caffeine 기반 Spring Cache 추상화
- **설정 프로파일**: `local`, `dev` — `application-{profile}.yml`로 분리

## Frontend Patterns

### 컴포넌트 패턴

**공통 컴포넌트 (`src/components/common`)** — 6개 파일 모두 필수:
```
Button/ → Button.tsx, Button.type.ts, Button.module.css, Button.stories.tsx, Button.test.tsx, index.ts
```
- CSS Module 필수, `className` prop 외부 노출 금지
- `forwardRef` 금지 → ref를 일반 prop으로 받음 (React 19)
- 파생 값은 `useState+useEffect` 대신 인라인 계산으로 처리

**피처 컴포넌트 (`src/features/{domain}`)** — 복잡도에 따라 단일 파일 or 폴더
- 공통 컴포넌트 재사용 최우선, 중복 구현 금지
- Tailwind 우선, CSS Module은 복잡한 애니메이션 등 필요 시에만
- Page 컴포넌트는 `export function Component()` 로 export (React Router lazy용)

### 상태관리

- **TanStack Query**: 서버 데이터 캐싱/동기화 → `features/{domain}/hooks/`에서 wrapping
- **Zustand**: 클라이언트 UI 상태 → `store/{domain}/` (selector 필수)

```ts
const user = useAuthStore(selectUser)  // ✅ selector로 구독 범위 최소화
const { user } = useAuthStore()        // ❌ 전체 구독 → 불필요한 리렌더링
```

### API 호출 패턴 (3계층)

1. `src/api/client.ts` — Axios 인스턴스 (JWT 자동 주입, 401 → `/login` 리다이렉트)
2. `src/api/services/{domain}Service.ts` — 순수 API 함수 (TanStack Query 미포함)
3. `src/features/{domain}/hooks/use{Domain}.ts` — TanStack Query 래핑 + Query key factory

```ts
// Query key factory 패턴 — 모든 도메인 훅에 필수
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
}
```

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|-----|-----|-----|
| 컴포넌트/파일 | PascalCase | `UserCard.tsx` |
| 훅 | `use` prefix + camelCase | `useUsers`, `useAuthStore` |
| 서비스 | camelCase + `Service` suffix | `userService` |
| Query key 객체 | `{domain}Keys` | `userKeys` |
| Zustand store | `use{Name}Store` | `useAuthStore` |
| 타입 파일 | `{name}.type.ts` | `user.type.ts`, `authStore.type.ts` |

## Git Convention

```
type(scope): 한글 요약 (50자 이내)

# type: feat | fix | refactor | chore | docs | test | style
# scope: 변경 모듈 또는 기능 영역
# 예시: feat(auth): 리프레시 토큰 갱신 API 추가
```

브랜치 형식: `type/description` 또는 `type/ISSUE-NUMBER-description`

### Git Hooks (Husky)

커밋 시 자동으로 두 가지 검사가 실행됩니다:

| 훅 | 시점 | 검사 내용 |
|---|---|---|
| `pre-commit` | 커밋 직후 | staged `.ts/.tsx` 파일 ESLint + Prettier 자동 수정 |
| `commit-msg` | 메시지 작성 후 | Conventional Commits 형식 검증 |

- fix 불가능한 lint 에러가 있으면 커밋 차단 → `pnpm lint:fix && pnpm format` 실행 후 재시도
- 커밋 메시지 형식 위반 시 커밋 차단 → 위 형식에 맞게 수정 후 재시도
- GUI Git 클라이언트(Fork 등) 사용 시 `~/.config/husky/init.sh`에 nvm PATH 설정 필요
