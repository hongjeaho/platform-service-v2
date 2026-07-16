# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spring Boot 3.4.2(Spring MVC) + React 19 풀스택 멀티모듈 모노레포.

**이 리포는 발판(base) 리포다.** 새 시스템(개인 서비스, 공공시스템 등)이 필요할 때 이 리포에서 **독립 git 리포지토리를 생성**하고, 그 리포는 이후 독립적으로 성장한다(업스트림 머지 없음). 따라서 아키텍처 판단 기준은 "새 리포가 분기 시점에 무엇을 상속하는가"다 — 발판의 도메인 누수·cruft는 분기 전에 정리하는 것이 가장 싸다.

패키지·모듈명의 "platform"은 인스턴스 이름이 아니라 **발판의 generic 어휘**다 — 분기 리포는 rename하지 않는다. 인스턴스 정체성은 설정 값(`jwt.issuer`, `VITE_APP_NAME`, `cors.allowed-origins`, 메일 계정)으로만 존재한다(ADR-0006).

- **Backend**: Spring Boot 3.4.2(MVC, WebFlux 아님), Spring Security, JOOQ 3.19.18, MyBatis, Flyway 12.6.2, MySQL 8, Redis 7, JWT(auth0 java-jwt), Java 21
- **Frontend**: React 19, TypeScript, Vite 6, Zustand, TanStack Query, Tailwind CSS v4, Orval(OpenAPI → 코드 생성), Vitest, Storybook, Playwright
- **Build**: Gradle 8(백엔드), pnpm 10(프론트엔드)
- **이슈 트래커**: GitHub Issues (`github.com/hongjeaho/platform-service-v2`)

## Commands

### 데이터베이스 & 코드 생성

```bash
docker-compose up -d                              # MySQL 8(3306, db=store, root/root) + Redis 7(6379)

# JOOQ 코드 생성 — local 프로필은 datasource/platform/gradle.properties(커밋 금지) 필요:
#   cp datasource/platform/gradle.properties.example datasource/platform/gradle.properties
#   (db.url / db.user / db.password 기입). dev 등은 환경변수 DB_JDBC_URL/DB_USERNAME/DB_PASSWORD 사용.
./gradlew :datasource-platform:generateJooq       # compileJava가 이 태스크에 의존 → 빌드 전 필수
```

### 백엔드

```bash
./gradlew :api-platform:bootRun --args='--spring.profiles.active=local'   # 8080 포트
./gradlew :api-platform:test                                              # 전체 테스트
./gradlew :api-platform:test --tests "com.platform.api.platform.users.*"  # 특정 도메인만
./gradlew jacocoMergedReport                                             # 전체 모듈 통합 커버리지(common-jooq 제외)
./gradlew :api-platform:build -x test                                     # JAR 빌드(build/libs/platform-*.jar)
```

### 프론트엔드 (`cd front/react-workspace`)

```bash
pnpm install
pnpm dev                  # 3000 포트 (Vite 프록시: /api → localhost:8080)
pnpm build                # tsc -b && vite build
pnpm test                 # Vitest watch
pnpm test:run             # Vitest 1회 실행
pnpm orval                # 백엔드 OpenAPI(http://localhost:8080/api/public/api-docs/json) → src/api/generated/ 코드 생성
pnpm storybook            # Storybook(6006)
pnpm e2e                  # Playwright
pnpm lint:fix && pnpm format   # Husky pre-commit 통과 불가 시 수동 실행
```

Orval은 **백엔드 API 서버가 켜져 있어야** 동작한다(실행 중인 서버에서 API spec을 읽음).

## Architecture

### 멀티모듈 구조

| 모듈 | 산출물 | 역할 |
|------|--------|------|
| `common-core` | jar | 핵심 공통 — JWT, DTO, OpenAPI(springdoc), Redis, 메일, test-fixtures |
| `common-web` | jar | 웹 공통 — Spring Web/AOP, Actuator, Prometheus, 보안 설정 |
| `common-jooq` | jar | JOOQ 코드 생성 전략(`CustomGeneratorStrategy`). JaCoCo 제외 |
| `datasource-platform` | jar | 데이터 접근 — JOOQ 생성 코드, MyBatis 매퍼, Repository, Flyway 마이그레이션(`flyway/`) |
| `api-platform` | bootJar | 실행 가능 REST API 서버 |
| `front/react-workspace` | — | React SPA |

`settings.gradle`이 `common/`·`datasource/`·`api/`·`batch/` 하위 디렉토리를 자동 검색하여 `:common-core` 형태의 모듈로 등록한다. **새 모듈 디렉토리를 만들면 `build.gradle`과 소스 폴더(`src/main/java/com/platform/{comp}/{name}`)를 자동 생성**한다. 배치 처리가 필요한 시스템은 `batch/{name}` 디렉토리를 만들면 같은 메커니즘으로 등록된다(빈 스텁은 두지 않는다 — deletion test).

의존성 방향: `api`·`batch` → `common-web` + `datasource-platform` → `common-core`(`common-web`과 `datasource-platform` 모두가 `common-core`에 의존).

### 백엔드 요청 흐름

```
HTTP → SecurityConfig(JWT 필터, CORS 허용, CSRF 비활성) → Controller(OpenAPI 문서화)
     → Service(비즈니스 로직) → Repository(JOOQ DSL 또는 MyBatis) → MySQL(HikariCP)
```

### Controller 명명 규칙 (인증 수준 기준)

`SecurityConfig`의 `requestMatchers`와 반드시 일치해야 한다.

| 접근 권한 | 경로 | Controller 명 | 예시 |
|----------|------|---------------|------|
| 인증 불필요 | `/api/public/{domain}/**` | `Public{Domain}Controller` | `PublicAuthController` |
| JWT 인증 필요 | `/api/{domain}/**` | `{Domain}Controller` | `UsersController` |
| ADMIN 전용 | `/api/admin/{domain}/**` | `Admin{Domain}Controller` | `AdminUsersController` |

테스트 클래스도 동일한 접두사 규칙을 따른다(`Public{Domain}ControllerTest` 등).

### 영속성 — JOOQ + MyBatis + Flyway 혼용

세 기술이 `datasource-platform` 하나에 공존하며, 역할이 나뉜다:

- **Flyway**(`datasource/platform/flyway/`)가 스키마를 마이그레이션 → **JOOQ**가 그 스키마에서 코드를 생성(`generateJooq`, 산출물은 `build/generated` + JaCoCo 제외) → 애플리케이션은 생성된 DSL/DAO 또는 **MyBatis 매퍼**(`src/main/resources/mybatis-mapper/`)로 접근.
- JOOQ는 `compileJava` 전 자동 실행되므로, 스키마 변경 후엔 마이그레이션 → `generateJooq` 순으로 갱신해야 컴파일된다.
- JaCoCo는 전역에서 `config/`, `dto/`, `type/`(Enum), `*Application`, JOOQ 생성 코드를 커버리지에서 제외한다.

### 백엔드 테스트 레이어 (`/tdd` 스킬 참조)

| 레이어 | 어노테이션 | Mock 대상 |
|--------|-----------|-----------|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | Repository (`@Mock`) |
| Controller 슬라이스 | `@WebMvcTest` | Service (`@MockBean`) |

- 실행: `./gradlew :api-platform:test`(전체) · `--tests "com.platform.api.platform.{domain}.*"`(특정 도메인) · `./gradlew jacocoMergedReport`(전체 모듈 통합 커버리지). JaCoCo 제외 대상은 위 영속성 섹션 참조.

### 프론트엔드 아키텍처 (`front/react-workspace`)

React 19 + TypeScript + Vite. **React Compiler 활성화** → `useMemo`/`useCallback` 직접 작성 금지 (컴파일러가 자동 최적화; 테스트 모드에서는 커버리지 정확도를 위해 비활성화). 상태는 Zustand(클라이언트) + TanStack Query(서버). 스타일은 Tailwind v4 + CSS Modules. Orval이 **실행 중인 백엔드** OpenAPI로 `src/api/generated/`를 생성(수동 수정 금지, 커밋 제외).

**디렉토리 구조:**

```
src/
├── api/             # client.ts(axios, JWT 주입, 401→/login), services/{domain}Service.ts(순수 함수), generated/(Orval)
├── app/             # providers, queryClient, router
├── components/
│   ├── common/      # 재사용 공통 컴포넌트
│   └── layout/      # ErrorBoundary, Layout (도메인 로직 금지)
├── features/{domain}/  # components/, hooks/(TanStack Query 래핑), pages/(React Router lazy), types/
├── hooks/           # 도메인 무관 공통 훅 (useDebounce 등)
├── store/{domain}/  # Zustand 스토어
├── styles/          # CSS 변수 + TypeScript 디자인 토큰
└── utils/           # 순수 함수 (cn, format, validation)
```

**컴포넌트 패턴:**

| 종류 | 위치 | 규칙 |
|------|------|------|
| 공통 | `components/common/{Name}/` | 6파일 세트: `{Name}.tsx`, `{Name}.type.ts`, `{Name}.module.css`, `{Name}.stories.tsx`, `{Name}.test.tsx`, `index.ts`. **CSS Module 필수, `className` prop 노출 금지, `forwardRef` 금지**(React 19 — ref를 일반 prop으로) |
| 피처 | `features/{domain}/` | 공통 컴포넌트 재사용 최우선(중복 구현 금지). Page는 `export function Component()` (React Router lazy용) |
| 레이아웃 | `components/layout/` | 앱 셸 전용. 도메인 로직 포함 금지 |

**API 3계층:** `api/client.ts`(axios 인스턴스) → `api/services/{domain}Service.ts`(순수 API 함수) → `features/{domain}/hooks/use{Domain}.ts`(TanStack Query 래핑). 모든 도메인 훅은 **Query key factory 패턴** 필수:

```ts
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
}
```

Zustand는 **selector로 구독 범위 최소화** (`useAuthStore(selectUser)`, 전체 구독 금지).

**테스트 레이어** (`/tdd` 스킬 참조):

| 레이어 | 도구 | 비고 |
|--------|------|------|
| 컴포넌트 단위 | Vitest + Testing Library (`jsdom`) | `{Name}.test.tsx`를 컴포넌트 폴더에 배치. `globals=true`, setup=`src/test/setup.ts`(`@testing-library/jest-dom`) |
| E2E | Playwright (chromium) | `e2e/` 디렉토리. `baseURL=localhost:3000`, `webServer`가 `pnpm dev` 자동 시작 |

- 커버리지(v8): lines/functions/branches/statements **80% 임계값**. `api/generated`, `features/**/hooks`(TanStack Query), `features/**/pages`, `app/router`는 단위 테스트 제외(통합·E2E 영역).
- MSW 미사용 → TanStack Query 훅은 통합·E2E로 검증(컴포넌트 단위 테스트 대상 아님).

**디자인 시스템:** 색상/스페이싱의 단일 소스는 `src/styles/globals.css`의 CSS 변수(`:root` + `@theme inline`) — **TS 색상 토큰 사본 금지**(ADR-0007). TS 헬퍼는 클래스 문자열(`typography.ts`의 `textCombinations`)과 아이콘 매핑(`icons.ts`)만. **하드코딩 hex/rgb/px 금지**, Tailwind 기본 팔레트(`bg-gray-*`) 직접 사용 금지. `cn()`(`utils/cn.ts`, clsx+tailwind-merge) 사용. 다크 모드는 현재 미지원(요구사항 도래 시 신규 설계).

**네이밍:** 컴포넌트 PascalCase · 훅 `use*` camelCase · 서비스 `*Service` · Query key `{domain}Keys` · Store `use{Name}Store` · 타입 `{name}.type.ts`.

## 개발 워크플로우 (스킬 기반 TDD)

**기본 방침: 모든 개발은 `.claude/skills/`의 스킬을 통해 TDD로 진행한다.**

```
grill-me(아이디어 정제) → to-prd(PRD) → to-issues(이슈 분해) → tdd(구현) → **E2E 검증(사용자 화면 있을 때, `pnpm e2e`)** → improve-codebase-architecture(아키텍처 개선)
```

스킬은 `.claude/skills/{name}/SKILL.md`에 정의되어 있다(Mattpocock/skills). 각 스킬의 `SKILL.md`를 먼저 읽고 그 절차를 따를 것.

| 단계 | 스킬 | 역할 |
|------|------|------|
| 정제 | `grill-me` | `/grilling` 인터뷰로 계획/설계를 다듬음 |
| 기획 | `to-prd` | 대화 컨텍스트를 합성해 PRD 작성 → GitHub 이슈로 발행(`ready-for-agent` 라벨) |
| 분해 | `to-issues` | PRD를 **수직 슬라이스(tracer bullet)** 이슈로 분해 — 각 이슈가 모든 계층을 관통 |
| 구현 | `tdd` | Red(실패 테스트) → Green(최소 구현) 루프. 모델 자동 호출 가능(나머지는 명시적 호출) |
| E2E 검증 | `pnpm e2e` (명령) | **사용자 화면이 있는 기능(프론트/풀스택)만** — `/tdd` 직후 Playwright E2E 실행. `/to-prd`의 User Stories → E2E 시나리오로 매핑. 백엔드-only 기능은 생략 |
| 개선 | `improve-codebase-architecture` | shallow 모듈을 deepening 기회로 스캔 → HTML 리포트 → 그릴링으로 설계 |

> E2E는 통합 Matt Pocock 스킬 셋에 전용 스킬이 없어 **스킬이 아닌 명령 게이트**로 운영한다. 도구 상세는 위 "프론트엔드 테스트 레이어" 표 참조.

### 사전 설정 (`/setup-matt-pocock-skills` 완료됨)

`to-prd`·`to-issues`·`tdd`·`improve-codebase-architecture`는 `CONTEXT.md`(도메인 용어), `docs/adr/`(아키텍처 결정), `docs/agents/`(이슈 트래커·트리아지 라벨)를 참조한다. 설정값은 하단 `## Agent skills` 블록과 `docs/agents/*.md`에 기록되어 있다.

- 이슈 트래커 = GitHub(`gh` CLI). PR은 트리아지 대상 아님.
- 트리아지 라벨 = 기본값(`needs-triage` 등 5종).
- 도메인 문서 = **현재 단일 컨텍스트**(루트 `CONTEXT.md` + `docs/adr/`). `decision` 등 독립 bounded context가 도래하면 `CONTEXT-MAP.md` + `docs/contexts/<name>/`로 이관(트리거·레이아웃·shared-kernel 규칙은 `docs/agents/domain.md`). `CONTEXT.md`/ADR은 지연 생성(lazy).
- **주의**: `to-prd`/`to-issues`가 `gh`로 이슈를 생성하므로 `gh` CLI 설치 + `gh auth login`이 필요하다.

### TDD 핵심 원칙 (스킬이 강제하는 규칙)

- **사전 합의한 seam에서만 테스트.** 테스트 작성 전 검증할 seam을 명시하고 사용자와 확인. 미확인 seam에 테스트 금지.
- **수직 슬라이스 단위.** 한 seam, 한 테스트, 한 최소 구현. 테스트를 한 번에 다 작성하지 말 것(구현을 모른 채 형태만 검증하게 됨).
- **Red 선행.** 실패 테스트 → 통과 최소 코드. 미래 테스트나 투기적 기능 예측 금지.
- **리팩토링은 루프 밖.** Red→Green 사이클에 포함하지 않는다 — 구조 개선은 `improve-codebase-architecture`(및 코드 리뷰) 단계로.
- 외부 동작만 검증(구현 디테일/호출 순서/사적 메서드 모킹 금지). 기대값은 코드와 동일한 방식으로 재계산하지 말 것(자명한 테스트 됨).

## Agent skills

이 설정은 `/setup-matt-pocock-skills`가 생성했으며, 스킬들이 참조한다.

### Issue tracker

GitHub Issues(`github.com/hongjeaho/platform-service-v2`)를 `gh` CLI로 사용. 외부 PR은 트리아지 대상 아님. 자세한 내용은 `docs/agents/issue-tracker.md`.

### Triage labels

기본 어휘(`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) 사용. 자세한 내용은 `docs/agents/triage-labels.md`.

### Domain docs

현재 단일 컨텍스트(루트 `CONTEXT.md` + `docs/adr/`). 독립 bounded context(`decision` 등) 도래 시 `CONTEXT-MAP.md` + `docs/contexts/<name>/`로 이관. 자세한 내용은 `docs/agents/domain.md`.

## Git Convention

### 브랜치 전략

- **main 브랜치에서 직접 작업 금지**
- 모든 작업은 기능 브랜치에서 진행
- 브랜치 명명: `type/description` 또는 `type/ISSUE-NUMBER-description`
- 작업 완료 후 PR을 통해 main 병합
- **PR 머지 전략은 rebase merge.** "Rebase and merge" 버튼으로 머지하며 개별 커밋이 SHA 재작성되어 `main`에 선형으로 반영된다. 머지 후 로컬 브랜치는 원격 머지 확인 뒤 `git branch -D`로 정리한다. blocked-by 이슈는 선행 PR 머지를 기다리지 않고 선행 브랜치 위에 스택해서 진행할 수 있다 — 상세는 `docs/adr/0002-branch-strategy-for-blocked-issues.md` 참조.

### 커밋 메시지

```
type(scope): 한글 요약 (50자 이내)
# type: feat | fix | refactor | chore | docs | test | style
# 예시: feat(auth): 리프레시 토큰 갱신 API 추가
```

### Husky Hooks

| 훅 | 시점 | 동작 |
|---|---|---|
| `pre-commit` | 커밋 시 | staged `.ts/.tsx` 파일에 ESLint + Prettier 자동 수정 |
| `commit-msg` | 메시지 작성 후 | Conventional Commits 형식 검증(commitlint) |

수정 불가능한 lint 에러 / 메시지 형식 위반 시 커밋이 차단된다 → `pnpm lint:fix && pnpm format` 후 재시도. GUI Git 클라이언트(Fork 등) 사용 시 `~/.config/husky/init.sh`에 nvm PATH 설정이 필요할 수 있다.
