# Spring Platform V2

Spring Boot + React 기반의 멀티모듈 플랫폼 프로젝트입니다.

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [프로젝트 초기 설정](#2-프로젝트-초기-설정)
3. [개발 서버 실행](#3-개발-서버-실행)
4. [백엔드 TDD 워크플로우](#4-백엔드-tdd-워크플로우)
5. [운영(개발) 서버 배포](#5-운영개발-서버-배포)
6. [모니터링](#6-모니터링)

---

## 1. 프로젝트 소개

### 기술 스택

| 영역 | 기술 |
|---|---|
| 백엔드 | Spring Boot 3.4.2, Spring MVC, Spring Security |
| ORM / DB | JOOQ 3.19, MyBatis, Flyway, MySQL 8 |
| 인증 | JWT |
| 프론트엔드 | React 19, TypeScript 5, Vite |
| 스타일링 | Tailwind CSS v4 |
| 상태 관리 | Zustand, TanStack Query |
| 빌드 도구 | Gradle 8 (backend), pnpm 10 (frontend) |

### 멀티모듈 구조

```
platform-service-v2/
├── api/
│   └── platform/          # Spring Boot REST API 서버 (포트 8080)
├── batch/
│   └── platform/          # 배치 처리
├── common/
│   ├── core/              # 핵심 공통 라이브러리 (JWT, DTO, OpenAPI)
│   ├── web/               # 웹 공통 (AOP, 캐싱, 모니터링)
│   └── jooq/              # JOOQ 코드 생성 전략
├── datasource/
│   └── platform/          # DB 접근 계층 (JOOQ, MyBatis, Flyway)
└── front/
    └── react-workspace/   # React SPA (포트 3000)
```

### 백엔드 요청 흐름

```
HTTP Request
→ SecurityConfig (JWT 필터, CORS, CSRF disabled)
→ Controller (@RestController, OpenAPI 문서화)
→ Service (비즈니스 로직)
→ Repository (JOOQ DSL 또는 MyBatis)
→ MySQL (HikariCP)
```

---

## 2. 프로젝트 초기 설정

### 사전 요구 사항

- Java 21+
- Gradle 8+
- Node.js 20+ / pnpm 10+
- Docker & Docker Compose

### 저장소 클론

```bash
git clone <repository-url>
cd platform-service-v2
```

### 데이터베이스 설정 (Docker)

```bash
docker-compose up -d
```

MySQL 접속 정보 (로컬):
- Host: `localhost:3306`
- Database: `store`
- Username: `root`
- Password: `root`

### 백엔드 초기 설정

**환경변수 설정 (선택사항):**

```bash
export $(grep -v '^#' .env | xargs)
```

**로컬 개발 핵심 환경변수:**

| 환경변수 | 용도 | 기본값 |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Spring 프로파일 활성화 | `local` |
| `JWT_SECRET` | JWT 서명 키 | `local-dev-secret-change-in-production` |
| `FILE_UPLOAD_PATH` | 파일 업로드 경로 | `./uploads` |
| `DB_JDBC_URL` | JOOQ/Flyway Gradle 태스크용 DB URL | — |
| `DB_USERNAME` | JOOQ/Flyway Gradle 태스크용 DB 유저 | — |
| `DB_PASSWORD` | JOOQ/Flyway Gradle 태스크용 DB 패스워드 | — |

### JOOQ 코드 생성

백엔드 실행 전, DB 스키마를 기반으로 JOOQ 코드를 생성합니다.

**1단계 - DB 접속 정보 파일 생성 (최초 1회):**

```bash
cp datasource/platform/gradle.properties.example datasource/platform/gradle.properties
```

**2단계 - JOOQ 코드 생성:**

```bash
./gradlew :datasource:platform:generateJooq
```

### 프론트엔드 초기 설정

```bash
cd front/react-workspace
pnpm install
```

---

## 3. 개발 서버 실행

### 백엔드 로컬 실행

```bash
./gradlew :api:platform:bootRun --args='--spring.profiles.active=local'
```

백엔드 서버가 `http://localhost:8080`에서 실행됩니다.

### 프론트엔드 로컬 실행

```bash
cd front/react-workspace
pnpm dev
```

프론트엔드 서버가 `http://localhost:3000`에서 실행됩니다.

---

## 4. 백엔드 TDD 워크플로우

### 기획 단계

신규 백엔드 기능 기획 시 `/feature-planner-be` 커맨드로 시작합니다.

| 커맨드 형식 | 동작 |
|---|---|
| `/feature-planner-be` | 현재 git 브랜치에서 feature-path 자동 추론 |
| `/feature-planner-be {기능 설명}` | 브랜치 추론 + 설명 추가 |
| `/feature-planner-be {feature-path}` | 경로 직접 지정 |

**파이프라인:**

```
아이디어 → spec → spec-fixed → prd(+ADR) → issues
```

각 단계는 승인 GATE가 있어 진행 시 개발자 확인이 필요합니다.

**산출물 경로:** `api/platform/src/main/java/com/platform/api/platform/{feature-path}/docs/`

### spec.md 형식

기능 명세서는 다음 형식을 따릅니다:

```markdown
# {기능명} 정의서

## 기능 개요
{설명에서 추출한 기능 목적. 한두 문장.}

## 기능 요구사항
{설명에서 추출한 사용자 행동 목록}

## 제약사항
{설명에서 추출한 제한 조건. 없으면 "없음".}
```

### TDD 이슈 사이클

이슈 작업 시 다음 순서를 따릅니다:

| 순서 | 커맨드 | 설명 | GATE |
|---|---|---|---|
| 1 | `/test-scenarios-be N` | 이슈 AC → Java 시그니처 확정 + 테스트 시나리오 도출 | × 2 |
| 2 | `/tdd-red-be N` | 시나리오 → JUnit 실패 테스트 작성 (Service 단위 + Controller 슬라이스) | - |
| 3 | `/tdd-green-be N` | 테스트 통과 최소 구현 (Repository → Service → Controller) | - |
| 4 | `/ac-verifier-be N` | AC 충족 독립 검증 (테스트 통과 ≠ AC 충족) | ✓ |
| 5 | `/tdd-refactor-be N` | 구조 개선 (Helper 추출, 패턴 일관성), 깨지면 즉시 롤백 | ✓ |
| 6 | `/security-review-be N` | 보안 취약점·패턴 위반·코드 품질 점검 | ✓ |
| 7 | `/create-pr-be` | 모든 이슈 완료 후 git commit 안내 + PR 제목·본문 생성 | × 2 |

### TDD 단계별 작업 범위

| 단계 | 작성 대상 | 수정 금지 |
|------|----------|---------|
| `tdd-red-be` | `src/test/` 테스트 파일 | `src/main/` 기존 구현 코드 (컴파일 에러 해소용 스켈레톤 시그니처만 예외) |
| `tdd-green-be` | `src/main/` 구현 파일 | `src/test/` 테스트 파일 |
| `tdd-refactor-be` | `src/main/` 구현 파일 | `src/test/` 테스트 파일 |

> **중요:** 자동으로 다음 단계로 넘어가지 않습니다. 각 단계 완료 후 개발자가 직접 다음 커맨드를 실행해야 합니다.

### 테스트 레이어

| 레이어 | 어노테이션 | Mock 대상 |
|--------|-----------|---------|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | Repository (`@Mock`) |
| Controller 슬라이스 | `@WebMvcTest` | Service (`@MockBean`) |

### 빠른 실행 명령어

```bash
# 특정 도메인 테스트만
./gradlew :api:platform:test --tests "com.platform.api.platform.{domain}.*"

# 전체 테스트
./gradlew :api:platform:test
```

---

## 5. 운영(개발) 서버 배포

### 환경설정 파일 세팅 (dev 프로파일)

운영/개발 서버에서는 `dev` 프로파일을 사용합니다.

**dev 환경 핵심 환경변수:**

| 환경변수 | 필수 여부 | 설명 |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | 필수 | `dev` 로 설정 |
| `JWT_SECRET` | 필수 | 강력한 랜덤 문자열 |
| `PLATFORM_DB_PASSWORD` | 필수 | dev DB 패스워드 |
| `FILE_UPLOAD_PATH` | 선택 | 기본값 `./uploads` |

**systemd 설정 예시 (`/etc/systemd/system/platform-api.service`):**

```ini
[Unit]
Description=Platform API Service
After=network.target

[Service]
User=staff
WorkingDirectory=/home/staff/platform
EnvironmentFile=/etc/platform/env
ExecStart=java -jar /home/staff/platform/platform.jar
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 백엔드 빌드 및 배포

```bash
./gradlew :api:platform:build -x test
# 빌드 결과물: api/platform/build/libs/platform-*.jar
```

### 프론트엔드 빌드 및 배포

```bash
cd front/react-workspace
pnpm install --frozen-lockfile
pnpm build
# 빌드 결과물: front/react-workspace/dist/
```

---

## 6. 모니터링

| 엔드포인트 | 설명 |
|---|---|
| `GET /actuator/health` | 헬스 체크 |
| `GET /actuator/metrics` | 메트릭 목록 |
| `GET /actuator/prometheus` | Prometheus 스크래핑 엔드포인트 |

---

## Git Convention

```
type(scope): 한글 요약 (50자 이내)

# type: feat | fix | refactor | chore | docs | test | style
# scope: 변경 모듈 또는 기능 영역
# 예시: feat(auth): 리프레시 토큰 갱신 API 추가
```

브랜치 형식: `type/description` 또는 `type/ISSUE-NUMBER-description`

### Git Hooks (Husky)

| 훅 | 시점 | 검사 내용 |
|---|---|---|
| `pre-commit` | 커밋 직후 | staged `.ts/.tsx` 파일 ESLint + Prettier 자동 수정 |
| `commit-msg` | 메시지 작성 후 | Conventional Commits 형식 검증 |
