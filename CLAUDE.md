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
