# Spring Platform V2

Spring Boot(MVC) + React 기반의 멀티모듈 플랫폼 프로젝트입니다.

## 목차

1. [기술 스택](#기술-스택)
2. [멀티모듈 구조](#멀티모듈-구조)
3. [사전 요구사항](#사전-요구사항)
4. [빠른 시작](#빠른-시작)
5. [환경변수](#환경변수)
6. [gh CLI 설치 (스킬 워크플로용)](#gh-cli-설치-스킬-워크플로용)
7. [개발 워크플로우](#개발-워크플로우)
8. [빌드 및 배포(dev)](#빌드-및-배포dev)
9. [모니터링](#모니터링)
10. [Git 컨벤션](#git-컨벤션)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 백엔드 | Spring Boot 3.4.2, Spring MVC, Spring Security, JWT |
| 영속성 | JOOQ 3.19.18, MyBatis, Flyway 12.6.2, MySQL 8, HikariCP |
| 캐시/세션 | Redis 7 (Spring Data Redis) |
| 메일 | Gmail SMTP (Spring Mail) |
| 빌드 | Gradle 8 (백엔드), Java 21 |
| 프론트엔드 | React 19, TypeScript, Vite 6, Zustand, TanStack Query, Tailwind CSS v4, Orval |
| 프론트 테스트 | Vitest, Testing Library, Storybook, Playwright |
| 패키지 매니저 | pnpm 10 (프론트엔드), Husky + commitlint (커밋 훅) |

## 멀티모듈 구조

```
platform-service-v2/
├── api/
│   └── platform/          # Spring Boot REST API 서버 (포트 8080, bootJar)
├── batch/
│   └── platform/          # 배치 처리 애플리케이션 (bootJar)
├── common/
│   ├── core/              # 핵심 공통 — JWT, DTO, OpenAPI, Redis, 메일 (jar)
│   ├── web/               # 웹 공통 — AOP, 캐시, Actuator, Prometheus, 보안 설정 (jar)
│   └── jooq/              # JOOQ 코드 생성 전략 (jar)
├── datasource/
│   └── platform/          # DB 접근 — JOOQ 생성 코드, MyBatis 매퍼, Repository, Flyway (jar)
└── front/
    └── react-workspace/   # React SPA (포트 3000)
```

`settings.gradle`이 `common/`·`datasource/`·`api/`·`batch/` 하위 디렉토리를 자동으로 모듈로 등록합니다. 자세한 아키텍처는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

### 백엔드 요청 흐름

```
HTTP → SecurityConfig(JWT 필터, CORS 허용, CSRF 비활성) → Controller(OpenAPI 문서화)
     → Service(비즈니스 로직) → Repository(JOOQ DSL 또는 MyBatis) → MySQL(HikariCP)
```

---

## 사전 요구사항

| 도구 | 버전 | 비고 |
|------|------|------|
| JDK | 21+ | 시스템 기본 JDK 사용 (toolchain 미지정) |
| Node.js | 20+ | 프론트엔드 |
| pnpm | 10+ | `corepack enable && corepack prepare pnpm@10 --activate` |
| Docker & Docker Compose | 최신 | MySQL + Redis 로컬 실행 |
| Git | 최신 | |

> 💡 백엔드는 Gradle Wrapper(`./gradlew`)를 제공하므로 Gradle을 별도 설치할 필요가 없습니다.

---

## 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/hongjeaho/platform-service-v2.git
cd platform-service-v2
```

### 2. 인프라 실행 (MySQL + Redis)

```bash
docker-compose up -d
```

실행되는 컨테이너:

| 서비스 | 컨테이너명 | 포트 | 비고 |
|--------|-----------|------|------|
| MySQL 8.0.45 | `platform-mysql-v2` | 3306 | db=`store`, user=`root`, pw=`root` |
| Redis 7.4 | `platform-redis-v2` | 6379 | 패스워드 없음 |

종료: `docker-compose down` (볼륨까지 삭제: `docker-compose down -v`)

### 3. 백엔드 — JOOQ 코드 생성 설정

JOOQ/Flyway Gradle 태스크가 DB에 접속해야 하므로 로컬 DB 연결정보 파일을 만듭니다 (커밋 금지, `.gitignore` 처리됨).

```bash
cp datasource/platform/gradle.properties.example datasource/platform/gradle.properties
```

기본값(`localhost:3306/store`, `root/root`)을 그대로 쓰면 추가 수정 없이 동작합니다. 스키마를 기반으로 JOOQ 코드를 생성합니다.

```bash
./gradlew :datasource:platform:generateJooq
```

> `compileJava`가 `generateJooq`에 의존하므로, **스키마 변경 후에는 반드시 마이그레이션 → `generateJooq` 순으로 갱신**해야 컴파일됩니다.

### 4. 백엔드 실행

```bash
./gradlew :api:platform:bootRun
```

서버가 `http://localhost:8080`에서 실행됩니다. (local 프로파일이 기본이며, DB `root/root`·Redis `localhost:6379`·JWT 시크릿 등 모두 기본값으로 동작합니다.)

- Swagger UI: http://localhost:8080/public/swagger-ui
- API 문서(JSON): http://localhost:8080/api/public/api-docs/json

### 5. 프론트엔드 실행

```bash
cd front/react-workspace
pnpm install
pnpm dev
```

서버가 `http://localhost:3000`에서 실행됩니다. (Vite가 `/api` 요청을 `localhost:8080`으로 프록시)

> 백엔드 API가 변경되면 `pnpm orval`로 클라이언트 코드(`src/api/generated/`)를 재생성합니다. **백엔드 서버가 켜져 있어야** 동작합니다.

---

## 환경변수

로컬(local 프로파일)은 모두 기본값으로 동작하므로 설정하지 않아도 됩니다. 운영(dev)이나 이메일 기능 테스트 시에만 필요합니다.

### 런타임 (애플리케이션)

| 환경변수 | 기본값 | 설명 |
|----------|--------|------|
| `SPRING_PROFILES_ACTIVE` | `local` | Spring 프로파일 (`local` \| `dev`) |
| `PLATFORM_DB_USERNAME` | `root` | 런타임 DB 유저 |
| `PLATFORM_DB_PASSWORD` | `root` | 런타임 DB 패스워드 |
| `PLATFORM_REDIS_HOST` | `localhost` | Redis 호스트 |
| `PLATFORM_REDIS_PORT` | `6379` | Redis 포트 |
| `PLATFORM_REDIS_PASSWORD` | _(빈 문자열)_ | Redis 패스워드 |
| `JWT_SECRET` | `local-dev-secret-change-in-production` | JWT 서명 키 (**운영에서는 강력한 랜덤값 필수**) |
| `FILE_UPLOAD_PATH` | `./uploads` | 파일 업로드 경로 |
| `PLATFORM_EMAIL_USERNAME` | — | Gmail SMTP 계정 (이메일 기능 사용 시 필수) |
| `PLATFORM_EMAIL_FROM_PASSWORD` | — | Gmail 앱 비밀번호 (이메일 기능 사용 시 필수) |

> 런타임 JDBC URL은 `localhost:3306/store`로 고정되어 있습니다.

### Gradle JOOQ/Flyway 태스크용

local 프로파일은 `datasource/platform/gradle.properties`(`db.url`/`db.user`/`db.password`)를 사용합니다. 그 외 프로파일은 환경변수를 사용:

| 환경변수 | 설명 |
|----------|------|
| `DB_JDBC_URL` | JOOQ/Flyway 태스크용 DB URL |
| `DB_USERNAME` | JOOQ/Flyway 태스크용 DB 유저 |
| `DB_PASSWORD` | JOOQ/Flyway 태스크용 DB 패스워드 |

---

## gh CLI 설치 (스킬 워크플로용)

이 프로젝트는 Matt Pocock 스킬 기반 TDD 워크플로우(`grill-me → to-prd → to-issues → tdd → improve-codebase-architecture`)를 사용하며, GitHub를 이슈 트래커로 사용합니다. `to-prd`/`to-issues` 스킬이 `gh` CLI로 이슈를 생성하므로 **설치가 필요**합니다.

**Windows (권장 — 이 프로젝트 환경):**
```bash
winget install GitHub.cli
```

**macOS:**
```bash
brew install gh
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt install gh
```

설치 후 인증:
```bash
gh auth login
```

> 이 설정은 `/setup-matt-pocock-skills` 스킬이 생성했으며, 상세는 `docs/agents/issue-tracker.md`에 기록되어 있습니다.

---

## 개발 워크플로우

모든 기능 개발은 **스킬 기반 TDD**로 진행합니다. 자세한 절차와 아키텍처 가이드는 [CLAUDE.md](./CLAUDE.md)에 정리되어 있습니다.

```
grill-me(아이디어 정제) → to-prd(PRD) → to-issues(이슈 분해) → tdd(구현) → improve-codebase-architecture(개선)
```

| 단계 | 스킬 | 역할 |
|------|------|------|
| 정제 | `/grill-me` | 인터뷰로 계획·설계 다듬기 |
| 기획 | `/to-prd` | PRD 작성 → GitHub 이슈 발행 |
| 분해 | `/to-issues` | PRD를 수직 슬라이스 이슈로 분해 |
| 구현 | `/tdd` | Red → Green 루프 |
| 개선 | `/improve-codebase-architecture` | 아키텍처 deepening |

### 백엔드 테스트

```bash
./gradlew :api:platform:test                                              # 전체
./gradlew :api:platform:test --tests "com.platform.api.platform.users.*"  # 특정 도메인만
./gradlew jacocoMergedReport                                             # 전체 모듈 통합 커버리지
```

### 프론트엔드 테스트

```bash
cd front/react-workspace
pnpm test          # Vitest watch
pnpm test:run      # 1회 실행
pnpm storybook     # 컴포넌트 개발
pnpm e2e           # Playwright E2E
```

---

## 빌드 및 배포(dev)

### 백엔드

```bash
./gradlew :api:platform:build -x test
# 산출물: api/platform/build/libs/platform-*.jar

# dev 프로파일 실행
java -jar api/platform/build/libs/platform-*.jar --spring.profiles.active=dev
```

dev 프로파일 필수 환경변수: `JWT_SECRET`(강력한 랜덤값), `PLATFORM_DB_PASSWORD`, `PLATFORM_REDIS_PASSWORD` 등.

### 프론트엔드

```bash
cd front/react-workspace
pnpm install --frozen-lockfile
pnpm build
# 산출물: front/react-workspace/dist/
```

---

## 모니터링

Actuator 엔드포인트 (base-path: `/public/platform/actuator`):

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /public/platform/actuator/health` | 헬스 체크 |
| `GET /public/platform/actuator/info` | 애플리케이션 정보 |
| `GET /public/platform/actuator/metrics` | 메트릭 목록 |
| `GET /public/platform/actuator/prometheus` | Prometheus 스크래핑 |

> `health`는 인증 없이 접근 가능, 나머지 상세는 인증 필요(`show-details: when-authorized`).

---

## Git 컨벤션

```
type(scope): 한글 요약 (50자 이내)
# type: feat | fix | refactor | chore | docs | test | style
# 예시: feat(auth): 리프레시 토큰 갱신 API 추가
```

브랜치: `type/description` 또는 `type/ISSUE-NUMBER-description`

### Husky Hooks

| 훅 | 시점 | 동작 |
|---|---|---|
| `pre-commit` | 커밋 시 | staged `.ts/.tsx` 파일 ESLint + Prettier 자동 수정 |
| `commit-msg` | 메시지 작성 후 | Conventional Commits 형식 검증 |

수정 불가능한 lint 에러 / 메시지 위반 시 커밋이 차단됩니다 → `pnpm lint:fix && pnpm format` 후 재시도.
