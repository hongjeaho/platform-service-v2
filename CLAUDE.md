# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

모노 레포 플랫폼 서비스. Spring Boot 3.4.2(WebFlux 제외, 일반 MVC) + React 19 풀스택 멀티모듈 모노레포.

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

### Controller 네이밍 규칙

인증 수준에 따라 Controller 명명과 경로를 일관되게 적용한다.

| 접근 권한 | 경로 패턴 | Controller 명 | 예시 |
|----------|-----------|---------------|------|
| 인증 불필요 | `/api/public/{domain}/**` | `Public{Domain}Controller` | `PublicAuthController`, `PublicUsersController` |
| JWT 인증 필요 | `/api/{domain}/**` | `{Domain}Controller` | `NoticeListController` |
| ADMIN 전용 | `/api/admin/{domain}/**` | `Admin{Domain}Controller` | `AdminUsersController` |

- `SecurityConfig.java`의 `requestMatchers` 패턴과 일치해야 함
- 명명 규칙에 따라 테스트 클래스도 `Public{Domain}ControllerTest`, `{Domain}ControllerTest`, `Admin{Domain}ControllerTest`로 작성

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

## 백엔드 기획 및 TDD 워크플로우

### 기획 워크플로우

**신규 백엔드 기능 기획 시 반드시 `/feature-planner-be` 커맨드로 시작할 것.**

| 커맨드 형식 | 동작 |
|---|---|
| `/feature-planner-be` | 현재 git 브랜치에서 feature-path 자동 추론 |
| `/feature-planner-be {기능 설명}` | 브랜치 추론 + 설명 추가 |
| `/feature-planner-be {feature-path}` | 경로 직접 지정 |

파이프라인: 아이디어 → spec → spec-fixed → prd(+ADR) → issues (단계별 승인 GATE)

산출물 경로: `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/`

### TDD 이슈 사이클

새 이슈 작업 시 다음 순서를 따른다:

1. `/test-scenarios-be N` — 이슈 AC → Java 시그니처 확정 + 테스트 시나리오 도출 [GATE × 2]
2. `/tdd-red-be N`        — 시나리오 → JUnit 실패 테스트 작성 (Service 단위 + Controller 슬라이스)
3. `/tdd-green-be N`      — 테스트 통과 최소 구현 (Repository → Service → Controller)
4. `/ac-verifier-be N`    — AC 충족 독립 검증 (테스트 통과 ≠ AC 충족) [GATE]
5. `/tdd-refactor-be N`   — 구조 개선 (Helper 추출, 패턴 일관성), 깨지면 즉시 롤백 [GATE]
6. `/security-review-be N`— 보안 취약점·패턴 위반·코드 품질 점검 [GATE]
7. `/create-pr-be`        — 모든 이슈 완료 후 git commit 안내 + PR 제목·본문 생성 [GATE × 2]

각 단계는 **담당 영역만** 건드린다.

| 단계 | 작성 대상 | 수정 금지 |
|------|----------|---------|
| `tdd-red-be` | `src/test/` 테스트 파일 | `src/main/` 기존 구현 코드 (컴파일 에러 해소용 스켈레톤 시그니처만 예외) |
| `tdd-green-be` | `src/main/` 구현 파일 | `src/test/` 테스트 파일 |
| `tdd-refactor-be` | `src/main/` 구현 파일 | `src/test/` 테스트 파일 |

**자동으로 다음 단계로 넘어가지 말 것 — 각 단계 완료 후 개발자가 확인한다.**

#### 테스트 레이어

| 레이어 | 어노테이션 | Mock 대상 |
|--------|-----------|---------|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | Repository (`@Mock`) |
| Controller 슬라이스 | `@WebMvcTest` | Service (`@MockBean`) |

#### 빠른 실행 명령어

```bash
# 특정 도메인 테스트만
./gradlew :api:platform:test --tests "com.platform.api.platform.{domain}.*"

# 전체 테스트
./gradlew :api:platform:test
```
