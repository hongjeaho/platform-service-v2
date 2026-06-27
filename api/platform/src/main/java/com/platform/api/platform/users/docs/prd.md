# 회원 정보 조회 및 수정 API PRD

## 개요
회원가입 전 단계에서 아이디/이메일 중복 확인 기능과, 로그인 전/후 비밀번호 변경 기능을 제공하는 REST API를 구현합니다. 중복 확인은 회원가입 플로우의 사전 단계로서 빠른 응답이 필요하며, 비밀번호 변경은 보안 검증 로직을 포함합니다.

## 사용자 스토리
- As a 일반 사용자,
  I want to POST /api/public/users/check-id (userId)
  so that 회원가입 전 아이디 중복 여부를 확인할 수 있다.

- As a 일반 사용자,
  I want to POST /api/public/users/check-email (userEmail)
  so that 회원가입 전 이메일 중복 여부를 확인할 수 있다.

- As a 일반 사용자 (로그인 전),
  I want to POST /api/public/users/change-password (userEmail, currentPassword, newPassword)
  so that 이메일을 알면 비밀번호를 변경할 수 있다.

- As a 일반 사용자 (로그인 후),
  I want to POST /api/users/change-password (currentPassword, newPassword)
  so that 현재 비밀번호를 확인하고 새 비밀번호로 변경할 수 있다.

## API 명세

> 이 명세가 Orval이 생성하는 프론트엔드 TypeScript 타입의 기준이 됩니다.
> API 변경 시 프론트엔드에서 `pnpm orval` 재실행 필요.

| HTTP | URI | 인증 | 요청 DTO | 응답 DTO | Orval 재실행 |
|------|-----|-----|---------|---------|------------|
| POST | /api/public/users/check-id | 불필요 | UserIdCheckRequest | CheckDuplicateResponse | 필요 |
| POST | /api/public/users/check-email | 불필요 | UserEmailCheckRequest | CheckDuplicateResponse | 필요 |
| POST | /api/public/users/change-password | 불필요 | ChangePasswordRequest (로그인 전) | ChangePasswordResponse | 필요 |
| POST | /api/users/change-password | JWT 필요 | ChangePasswordRequest (로그인 후) | ChangePasswordResponse | 필요 |

### 요청 DTO 상세

**UserIdCheckRequest**
```java
@Schema(description = "아이디 중복 확인 요청")
public class UserIdCheckRequest {
    @NotBlank(message = "userId는 필수입니다.")
    @Size(max = 30, message = "userId는 30자 이하여야 합니다.")
    @Schema(description = "사용자 아이디", example = "testuser")
    private String userId;
}
```

**UserEmailCheckRequest**
```java
@Schema(description = "이메일 중복 확인 요청")
public class UserEmailCheckRequest {
    @NotBlank(message = "userEmail은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Size(max = 100, message = "userEmail은 100자 이하여야 합니다.")
    @Schema(description = "사용자 이메일", example = "test@example.com")
    private String userEmail;
}
```

**ChangePasswordRequest (로그인 전)**
```java
@Schema(description = "비밀번호 변경 요청 (로그인 전)")
public class ChangePasswordBeforeLoginRequest {
    @NotBlank(message = "userEmail은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Schema(description = "사용자 이메일", example = "test@example.com")
    private String userEmail;

    @NotBlank(message = "currentPassword는 필수입니다.")
    @Schema(description = "현재 비밀번호", example = "current123")
    private String currentPassword;

    @NotBlank(message = "newPassword는 필수입니다.")
    @Size(min = 8, max = 12, message = "비밀번호는 8~12자리여야 합니다.")
    @Schema(description = "새 비밀번호", example = "new12345")
    private String newPassword;
}
```

**ChangePasswordRequest (로그인 후)**
```java
@Schema(description = "비밀번호 변경 요청 (로그인 후)")
public class ChangePasswordRequest {
    @NotBlank(message = "currentPassword는 필수입니다.")
    @Schema(description = "현재 비밀번호", example = "current123")
    private String currentPassword;

    @NotBlank(message = "newPassword는 필수입니다.")
    @Size(min = 8, max = 12, message = "비밀번호는 8~12자리여야 합니다.")
    @Schema(description = "새 비밀번호", example = "new12345")
    private String newPassword;
}
```

### 응답 DTO 상세

**CheckDuplicateResponse**
```java
@Schema(description = "중복 확인 응답")
public class CheckDuplicateResponse {
    @Schema(description = "사용 가능 여부 (true: 사용 가능, false: 중복)", example = "true")
    private boolean available;

    @Schema(description = "메시지", example = "사용 가능합니다.")
    private String message;

    public static CheckDuplicateResponse available() {
        return new CheckDuplicateResponse(true, "사용 가능합니다.");
    }

    public static CheckDuplicateResponse duplicate(String field) {
        return new CheckDuplicateResponse(false, "이미 사용 중인 " + field + "입니다.");
    }
}
```

**ChangePasswordResponse**
```java
@Schema(description = "비밀번호 변경 응답")
public class ChangePasswordResponse {
    @Schema(description = "성공 여부", example = "true")
    private boolean success;

    @Schema(description = "메시지", example = "비밀번호가 변경되었습니다.")
    private String message;

    public static ChangePasswordResponse success() {
        return new ChangePasswordResponse(true, "비밀번호가 변경되었습니다.");
    }
}
```

## 백엔드 아키텍처 준수 계획

### 영향 모듈 범위
| 모듈 | 변경 대상 |
|------|---------|
| `api/platform` | UsersController, UserService, DTO (Request/Response) |
| `datasource/platform` | UsersRepository (기존 활용), Flyway 추가 없음 (기존 테이블 활용) |

### Helper 추출 계획
> Service가 200줄 초과 또는 private 메서드 5개 이상이면 Helper로 추출합니다.
> Helper에 Repository를 주입하거나 트랜잭션을 시작하는 것은 금지.

| Helper 클래스 | 역할 접미사 | 추출 이유 / 해당없음 |
|-------------|-----------|-------------------|
| - | - | 해당없음 (Service 단독 처리) |

### 예외 처리 계획
> Controller에 try-catch 작성 금지. Service에서 던지면 GlobalExceptionHandler가 처리합니다.

| 예외 상황 | 사용 예외 클래스 | HTTP |
|---------|---------------|-----|
| 빈 값 입력 | IllegalArgumentException (Bean Validation 자동) | 400 |
| 아이디/이메일 중복 | IllegalStateException | 409 |
| 해당 사용자 없음 (비밀번호 변경) | IllegalArgumentException | 400 |
| 현재 비밀번호 불일치 | IllegalArgumentException | 400 |
| 새 비밀번호가 현재와 동일 | IllegalStateException | 409 |
| 비밀번호 길이 위반 | IllegalArgumentException (Bean Validation 자동) | 400 |
| 이메일 형식 위반 | IllegalArgumentException (Bean Validation 자동) | 400 |

### 캐시 계획
> CacheNames 상수로만 참조. 문자열 하드코딩 금지.

| 캐시 대상 | CacheNames 상수 | @Cacheable / @CacheEvict 적용 메서드 |
|---------|---------------|-------------------------------------|
| - | - | - |

**캐시 없음 — 이유**: 중복 확인은 실시간 데이터 정합성이 필요하고, 빈도가 높지 않아 캐시 불필요.

### DB 접근 계획
> JOOQ 기본. MyBatis는 동적 조건이 수십 개인 복잡 쿼리에만.

| 접근 목적 | 방식 | Flyway 필요 여부 |
|---------|-----|----------------|
| 중복 확인 | JOOQ Repository (existsByUserId, existsByEmail) | 불필요 (기존 테이블) |
| 비밀번호 변경 (조회) | JOOQ Repository (신규 메서드 필요) | 불필요 |
| 비밀번호 변경 (수정) | JOOQ Repository (신규 메서드 필요) | 불필요 |

**추가 Repository 메서드 필요**:
- `UsersEntity findByUserEmail(String userEmail)` — 이메일로 사용자 조회
- `void updatePassword(Long seq, String newPassword, Long updatedBy)` — 비밀번호 수정

## 기술 결정

### 안 A: 단순 CRUD (기존 패턴 적용) 선택

**Context**
회원가입 전 중복 확인과 로그인 전/후 비밀번호 변경 기능을 구현해야 합니다. 기존 `PublicUsersController`, `UsersService`가 회원가입 API로 이미 구현되어 있으며, `UsersRepository`에 중복 확인 메서드(`existsByUserId`, `existsByEmail`)가 존재합니다. 비즈니스 로직이 단순하여 Service 단독 처리 가능성이 높습니다.

**Decision**
기존 백엔드 패턴(Controller → Service → JOOQ Repository)을 그대로 적용하여 구현합니다.

- Controller: 기존 `PublicUsersController`에 엔드포인트 추가
- Service: 기존 `UsersService`에 메서드 추가 (Helper 없음)
- Repository: 기존 `UsersRepository`에 메서드 추가 (`findByUserEmail`, `updatePassword`)
- 트랜잭션: `@PlatformTransactional` 적용
- 캐시: 없음 (실시간 중복 체크 필요)

**Alternatives**
- **안 B (검증 Helper 추출)**: `UsersPasswordValidator`를 추출하여 비밀번호 검증 로직을 분리하는 안. 거부 이유: 현재 비즈니스 로직이 단순하여 Service 내 if문으로 충분히 처리 가능하며, Helper 추출 시 오버헤드가 더 큼. 추후 복잡도 증가 시 리팩토링으로 분리 용이.
- **안 C (CQRS-lite)**: UsersReadService, UsersWriteService로 분리하는 안. 거부 이유: 조회/명령 분리 이득이 없으며, Service 분리로 인한 조정 비용만 증가. 조회가 압도적이거나 통계/집계 기능이 없어 불필요.

**Consequences**
- **장점**: 기존 패턴과 일관성 유지, 구현 복잡도 최소, 빠른 개발 가능, 테스트 용이
- **단점**: Service 코드가 200줄을 초과할 경우 추후 리팩토링 필요 (현재는 메서드 4개 추가 예상으로 문제 없음), 향후 복잡한 검증 로직 추가 시 Helper로 재분리 작업 필요

## Out of Scope

이번 기능에서 **구현하지 않을 항목**을 명확히 정의합니다:

### 1. 이메일 인증 기능
- 로그인 전 비밀번호 변경 시 이메일 인증 코드 검증 로직
- **이유**: 현재 이메일 인증 시스템 미구현
- **추후 계획**: 이메일 발송 서비스 도입 후 인증 코드 검증 추가

### 2. 비밀번호 복잡도 강화
- 영문/숫자/특수문자 조합 검증
- **이유**: Bean Validation으로 길이만 검증 (8~12자)
- **추후 계획**: 정규식 패턴 추가 (`@Pattern`)

### 3. 비밀번호 변경 간격 제한
- 24시간 1회 등 변경 가능 주기 제한
- **이유**: password_changed_time 활용 로직 미포함
- **추후 계획**: 계정 보안 정책 수립 후 도입

### 4. 계정 잠금 기능
- 비밀번호 실패 횟수 초과 시 계정 잠금
- **이유**: 별도 테이블 또는 컬럼 필요
- **추후 계획**: 보안 정책에 따른 도입 검토

### 5. 회원 정보 조회 API
- seq로 회원 정보 조회
- **이유**: 중복 확인/비밀번호 변경에만 집중
- **추후 계획**: 마이페이지 기능 시 추가

### 6. 페이지네이션
- 회원 목록 조회 등 페이지네이션
- **이유**: 단건 기능 위주
- **추후 계획**: 관리자 기능 시 추가

### 7. 소셜 로그인 연동
- 소셜 계정 비밀번호 변경
- **이유**: 일반 사용자 로그인만 대상
- **추후 계획**: 소셜 로그인 도입 시 검토

## 용어 정의
spec-fixed.md의 용어 정의 동기화
