# 비로그인 사용자 비밀번호 변경 고도화 - 이슈 목록

## 이슈 분해 전략

**수직 슬라이싱 원칙**: 각 이슈 완료 시 curl/Swagger로 호출 가능한 엔드포인트

1. **이슈 #1: Redis 설정 + @Async 설정** (인프라)
   - Redis 의존성 추가
   - RedisTemplate Bean 등록
   - @EnableAsync 설정

2. **이슈 #2: POST /api/public/users/send-otp** (OTP 발송)
   - OtpService 구현
   - PublicUsersController.sendOtp() 엔드포인트

3. **이슈 #3: POST /api/public/users/change-password** (OTP 검증 + 비밀번호 변경)
   - OtpService.verify() 구현
   - UsersService.changePasswordWithOtp() 수정
   - 기존 ChangePasswordBeforeLoginRequest 대체

---

## 이슈 #1: Redis 설정 + @Async 설정

### 개요
Redis 캐시와 비동기 처리를 위한 인프라를 구축한다.

### Acceptance Criteria

- [ ] Given 프로젝트에 spring-boot-starter-data-redis 의존성이 없을 때, When build.gradle을 수정하면, Then 의존성이 추가된다.
- [ ] Given Redis 설정이 없을 때, When application.yml에 Redis 설정을 추가하면, Then 연결 정보가 설정된다.
- [ ] Given RedisTemplate Bean이 없을 때, When @Configuration 클래스를 작성하면, Then RedisTemplate<String, String> Bean이 등록된다.
- [ ] Given @Async가 활성화되지 않았을 때, When @EnableAsync를 설정에 추가하면, Then @Async가 동작한다.
- [ ] Given @Async가 활성화되었을 때, When ThreadPoolTaskExecutor Bean을 등록하면, Then 비동기 작업을 위한 스레드 풀이 생성된다.

### 변경 범위

- `build.gradle`: 의존성 추가 (common/core 모듈)
- `api/platform/src/main/resources/application.yml`: Redis 연결 설정
- `common/core/src/main/java/.../config/RedisConfig.java`: 신규 (RedisTemplate Bean)
- `common/web/src/main/java/.../config/AsyncConfig.java`: 신규 (@EnableAsync, ThreadPoolTaskExecutor)

### 의존성
없음 (첫 번째 이슈)

---

## 이슈 #2: POST /api/public/users/send-otp

### 개요
사용자 이메일로 OTP를 생성하고 Redis에 저장한 후 이메일로 발송한다.

### API 명세

| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/users/send-otp | 불필요 | SendOtpRequest | SendOtpResponse |

### DTO

```java
record SendOtpRequest(
    @NotBlank(message = "userEmail은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    String userEmail
)

record SendOtpResponse(
    String message  // "OTP가 이메일로 발송되었습니다."
)
```

### Acceptance Criteria

- [ ] Given 등록된 사용자 이메일로 OTP 발송을 요청할 때, When 요청을 보내면, Then 6자리 OTP가 생성되고 Redis에 30분 TTL로 저장된다.
- [ ] Given OTP가 Redis에 저장되었을 때, When 이메일을 발송하면, Then PasswordChangeEmailSender.send()가 @Async로 비동기 호출된다.
- [ ] Given 등록되지 않은 이메일로 OTP 발송을 요청할 때, When 요청을 보내면, Then IllegalArgumentException이 발생하고 400 상태코드와 "해당 이메일로 등록된 사용자가 없습니다." 메시지가 반환된다.
- [ ] Given 동일 이메일로 10분 미경과 상태일 때, When 재발송을 요청하면, Then IllegalStateException이 발생하고 409 상태코드와 "OTP는 10분마다 재발송할 수 있습니다." 메시지가 반환된다.
- [ ] Given OTP 발송이 성공했을 때, When 응답을 받으면, Then 200 상태코드와 "OTP가 이메일로 발송되었습니다." 메시지가 반환된다.
- [ ] Given OTP 발송이 완료되었을 때, When Redis를 조회하면, Then `otp:{email}` 키와 `otp:last-sent:{email}` 키가 존재한다.

### 변경 범위

- `api/platform/.../users/dto/SendOtpRequest.java`: 신규
- `api/platform/.../users/dto/SendOtpResponse.java`: 신규
- `api/platform/.../users/service/OtpService.java`: 신규 (generateAndSave, checkResendInterval)
- `api/platform/.../users/controller/PublicUsersController.java`: sendOtp() 엔드포인트 추가
- `common/core/.../email/PasswordChangeEmailSender.java`: send() 메서드에 @Async 추가

### 의존성
이슈 #1 선행 필요

---

## 이슈 #3: POST /api/public/users/change-password (OTP 방식으로 대체)

### 개요
OTP로 본인 확인 후 비밀번호를 변경한다. 기존 currentPassword 방식을 OTP 방식으로 완전히 대체한다.

### API 명세

| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/users/change-password | 불필요 | ChangePasswordWithOtpRequest | ChangePasswordResponse |

### DTO

```java
record ChangePasswordWithOtpRequest(
    @NotBlank(message = "userEmail은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    String userEmail,

    @NotBlank(message = "otpCode는 필수입니다.")
    @Size(min = 6, max = 6, message = "OTP는 6자리여야 합니다.")
    String otpCode,

    @NotBlank(message = "newPassword는 필수입니다.")
    @Size(min = 8, max = 12, message = "비밀번호는 8~12자리여야 합니다.")
    String newPassword
)

record ChangePasswordResponse(
    String message  // "비밀번호가 변경되었습니다."
)
```

### Acceptance Criteria

- [ ] Given 유효한 OTP가 Redis에 저장되어 있을 때, When OTP와 새 비밀번호로 변경을 요청하면, Then 비밀번호가 변경되고 OTP가 Redis에서 삭제된다.
- [ ] Given OTP가 30분 경과로 만료되었을 때, When 변경을 요청하면, Then IllegalArgumentException이 발생하고 400 상태코드와 "OTP가 만료되었습니다. 다시 발송해주세요." 메시지가 반환된다.
- [ ] Given 잘못된 OTP를 입력했을 때, When 변경을 요청하면, Then IllegalArgumentException이 발생하고 400 상태코드와 "OTP가 일치하지 않습니다." 메시지가 반환된다.
- [ ] Given 새 비밀번호가 현재 비밀번호와 동일할 때, When 변경을 요청하면, Then IllegalStateException이 발생하고 409 상태코드와 "현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다." 메시지가 반환된다.
- [ ] Given 비밀번호 변경이 성공했을 때, When 응답을 받으면, Then 200 상태코드와 "비밀번호가 변경되었습니다." 메시지가 반환된다.
- [ ] Given 비밀번호가 변경되었을 때, When DB를 조회하면, Then USER_PASSWORD가 새 비밀번호(BCrypt 암호화)로 업데이트되고 PASSWORD_CHANGED_TIME이 현재 시간으로 업데이트된다.
- [ ] Given 기존 ChangePasswordBeforeLoginRequest가 존재할 때, When 이슈를 완료하면, Then ChangePasswordWithOtpRequest로 대체되고 currentPassword 필드가 제거된다.

### 변경 범위

- `api/platform/.../users/dto/ChangePasswordBeforeLoginRequest.java`: 삭제 (또는 ChangePasswordWithOtpRequest로 대체)
- `api/platform/.../users/dto/ChangePasswordWithOtpRequest.java`: 신규
- `api/platform/.../users/service/OtpService.java`: verify() 메서드 추가
- `api/platform/.../users/service/UsersService.java`: changePasswordBeforeLogin() 메서드 수정 (otpCode 파라미터 추가)
- `api/platform/.../users/controller/PublicUsersController.java`: changePasswordBeforeLogin() 엔드포인트 수정

### 의존성
이슈 #1, #2 선행 필요

---

## 의존성 순서

```
이슈 #1 (Redis 설정)
  ↓
이슈 #2 (send-otp)
  ↓
이슈 #3 (change-password 대체)
```

---

## 네이밍 규칙

spec-fixed.md의 용어 정의를 따른다:

| 용어 | 코드 네이밍 |
|------|------------|
| OTP | `otpCode`, `otp` |
| OTP 발송 | `sendOtp()`, `generateAndSave()` |
| OTP 검증 | `verify()`, `checkResendInterval()` |
| 비밀번호 변경 | `changePasswordBeforeLogin()`, `changePasswordWithOtp()` |
| 사용자 이메일 | `userEmail` |
