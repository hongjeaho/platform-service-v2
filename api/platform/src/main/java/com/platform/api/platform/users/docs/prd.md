# 회원 등록 PRD

## 개요
`POST /api/public/users` 엔드포인트를 통해 플랫폼에 신규 회원을 등록한다.
인증 없이 호출할 수 있으며, 등록 완료 시 USER 권한이 자동 부여된다.

## 사용자 스토리
- As a 비인증 사용자,
  I want to POST /api/public/users with userId, userName, password, (userEmail)
  so that 플랫폼 회원으로 등록되어 로그인할 수 있다.

## API 명세

> 이 명세가 Orval이 생성하는 프론트엔드 TypeScript 타입의 기준이 된다.
> API 변경 시 프론트엔드에서 `pnpm orval` 재실행 필요.

| HTTP | URI | 인증 | 요청 DTO | 응답 DTO | Orval 재실행 |
|------|-----|------|---------|---------|------------|
| POST | /api/public/users | 불필요 | `UsersSignupRequest` | `UsersSignupResponse` | 필요 |

### 요청 (UsersSignupRequest)

| 필드 | 타입 | 필수 | 검증 |
|------|------|------|------|
| userId | String | 필수 | @NotBlank |
| userName | String | 필수 | @NotBlank |
| password | String | 필수 | @NotBlank |
| userEmail | String | 필수 | @NotBlank, @Email |

### 응답 (UsersSignupResponse) — 201 Created

| 필드 | 타입 | 설명 |
|------|------|------|
| seq | Long | 생성된 회원 일련번호 |
| userId | String | 사용자 아이디 |
| userName | String | 사용자 이름 |

## 백엔드 아키텍처 준수 계획

### 영향 모듈 범위

| 모듈 | 변경 대상 |
|------|---------|
| `api/platform` | UsersController, UsersService, UsersSignupRequest, UsersSignupResponse |
| `datasource/platform` | UsersRepository (신규), AuthorityRepository (컬럼명 수정) |

### 처리 흐름

```
POST /api/public/users
  → UsersController
  → UsersService.signup(UsersSignupRequest)
      → userId 중복 체크 (UsersRepository.existsByUserId)
      → userEmail 중복 체크 (UsersRepository.existsByEmail)
      → BCrypt 비밀번호 인코딩
      → UsersRepository.insertUser() → seq 반환
      → UsersRepository.findRoleSeqByName("USER")
      → UsersRepository.insertUserRole(userSeq, roleSeq, 0L)
  → 201 Created + UsersSignupResponse
```

### Helper 추출 계획

없음. Service 로직 50줄 이하 예상.

### 예외 처리 계획

| 예외 상황 | 사용 예외 클래스 | HTTP |
|---------|---------------|------|
| 아이디 중복 | `IllegalStateException` | 409 |
| 이메일 중복 | `IllegalStateException` | 409 |
| USER role 없음 | `IllegalStateException` | 409 |

### 캐시 계획

캐시 없음 — 회원가입은 쓰기 연산.

### DB 접근 계획

| 접근 목적 | 방식 | Flyway 필요 여부 |
|---------|------|----------------|
| userId 존재 여부 확인 | JOOQ Repository | 불필요 (기존 테이블) |
| userEmail 존재 여부 확인 | JOOQ Repository | 불필요 |
| 신규 회원 삽입 | JOOQ Repository | 불필요 |
| USER role seq 조회 | JOOQ Repository | 불필요 |
| user_roles 삽입 | JOOQ Repository | 불필요 |

## 기술 결정

### JOOQ 코드 재생성 선행 필요

**Context** — Flyway 마이그레이션에서 roles 컬럼명이 `user_role_name` → `role_name`으로 변경됨.

**Decision** — 이슈 시작 전 `./gradlew :datasource:platform:generateJooq` 실행. AuthorityRepository의 `USER_ROLE_NAME` → `ROLE_NAME` 수정.

**Alternatives** — JOOQ 클래스 수동 수정: 자동 생성 코드 수동 수정 금지 규칙에 위배하여 거부.

**Consequences** — 재생성 후 AuthorityRepository 컴파일 오류 확인 및 수정 필요.

### created_by 처리

**Context** — 공개 API라 `UserAccountHolder` 사용 불가. `created_by BIGINT NOT NULL` 제약 존재.

**Decision** — `created_by = 0L` (시스템 계정 예약값).

**Alternatives** — insert 후 seq update(자기참조): DB 왕복 2회, 복잡도 증가로 거부.

**Consequences** — `created_by = 0`이 시스템 생성을 의미하는 프로젝트 관례가 됨.

## Out of Scope

- 이메일 인증 (가입 후 이메일 발송)
- 소셜 로그인 (OAuth2)
- 비밀번호 복잡도 정책
- 회원 탈퇴 / 회원 정보 수정
- CAPTCHA

## 용어 정의

| 용어 | 설명 | 코드 네이밍 |
|------|------|-----------|
| 회원 | 플랫폼에 등록된 사용자 | `Users` / `UsersEntity` |
| 회원 등록 | 신규 회원을 시스템에 등록하는 행위 | `signup` |
| 사용자 아이디 | 로그인에 사용하는 고유 식별자 | `userId` |
| 사용자 이름 | 회원의 표시 이름 | `userName` |
| 사용자 이메일 | 연락처 이메일 주소 | `userEmail` |
| 비밀번호 | 로그인 인증 문자열 (BCrypt 저장) | `password` |
| USER 권한 | 일반 회원 기본 권한 | `"USER"` |
