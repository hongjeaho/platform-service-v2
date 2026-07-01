# 이슈 #2: POST /api/public/users/send-otp

## 개요
사용자 이메일로 OTP를 생성하고 Redis에 저장한 후 이메일로 발송한다.

## API 명세

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

## Acceptance Criteria

- [x] Given 등록된 사용자 이메일로 OTP 발송을 요청할 때, When 요청을 보내면, Then 6자리 OTP가 생성되고 Redis에 30분 TTL로 저장된다.
- [x] Given OTP가 Redis에 저장되었을 때, When 이메일을 발송하면, Then PasswordChangeEmailSender.send()가 @Async로 비동기 호출된다.
- [x] Given 등록되지 않은 이메일로 OTP 발송을 요청할 때, When 요청을 보내면, Then IllegalArgumentException이 발생하고 400 상태코드와 "해당 이메일로 등록된 사용자가 없습니다." 메시지가 반환된다.
- [x] Given 동일 이메일로 10분 미경과 상태일 때, When 재발송을 요청하면, Then IllegalStateException이 발생하고 409 상태코드와 "OTP는 10분마다 재발송할 수 있습니다." 메시지가 반환된다.
- [x] Given OTP 발송이 성공했을 때, When 응답을 받으면, Then 200 상태코드와 "OTP가 이메일로 발송되었습니다." 메시지가 반환된다.
- [x] Given OTP 발송이 완료되었을 때, When Redis를 조회하면, Then `otp:{email}` 키와 `otp:last-sent:{email}` 키가 존재한다.

## 변경 범위

- `api/platform/.../users/dto/SendOtpRequest.java`: 신규
- `api/platform/.../users/dto/SendOtpResponse.java`: 신규
- `api/platform/.../users/service/OtpService.java`: 신규 (generateAndSave, checkResendInterval)
- `api/platform/.../users/controller/PublicUsersController.java`: sendOtp() 엔드포인트 추가
- `common/core/.../email/PasswordChangeEmailSender.java`: send() 메서드에 @Async 추가

## 의존성
이슈 #1 선행 필요

---

## 시그니처

### Controller
```java
// PublicUsersController.sendOtp: POST /api/public/users/send-otp
// 접근 권한: 인증 불필요 (/api/public/** → PublicUsersController)
//
// 참고: 공개 API이므로 @Auditing 불필요 (생성자 추적 불필요)

@PostMapping("/send-otp")
public ResponseEntity<ApiResult<SendOtpResponse>> sendOtp(
    @RequestBody @Valid SendOtpRequest req
);
```

### Service
```java
// OtpService.generateAndSave: OTP 생성 및 Redis 저장, 이메일 발송
@PlatformTransactional(readOnly = false)
public void generateAndSave(String userEmail);

// 예외: IllegalArgumentException(등록되지 않은 이메일) | IllegalStateException(10분 미경과 재발송)
```

### Repository
이슈 #2에서 신규 Repository 메서드는 없습니다. (기존 UsersRepository.existsByEmail() 재사용)

### DTO
```java
// SendOtpRequest
@NotBlank(message = "userEmail은 필수입니다.")
@Email(message = "이메일 형식이 올바르지 않습니다.")
String userEmail;  // @Schema(description = "사용자 이메일")

// SendOtpResponse
String message;  // @Schema(description = "응답 메시지") - "OTP가 이메일로 발송되었습니다."
```

### Helper
이슈 #2에서 Helper는 없습니다. (OtpService가 단일 책임을 담당)

---

📌 **참고한 기존 패턴:**
- `api/platform/src/main/java/com/platform/api/platform/users/controller/PublicUsersController.java`
- `api/platform/src/main/java/com/platform/api/platform/users/service/UsersService.java`
- `datasource/platform/src/main/java/com/platform/datasource/platform/repository/users/UsersRepository.java`
- `common/core/src/main/java/com/platform/common/core/email/PasswordChangeEmailSender.java`

📌 **기존 패턴과의 차이:**
- **OtpService 신규 추가**: OTP 관련 로직을 독립 Service로 분리 (재사용 가능성, 단일 책임)
- **Redis 사용**: RedisTemplate을 주입받아 OTP 저장/검증 (신규 인프라)
- **@Async 비동기 처리**: PasswordChangeEmailSender.send()에 @Async 추가 (이슈 #1에서 설정)

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] OtpService.generateAndSave — should generate 6-digit OTP and save to Redis with 30min TTL when registered email
- [x] [정상] OtpService.generateAndSave — should send email via PasswordChangeEmailSender when OTP saved
- [x] [정상] OtpService.generateAndSave — should set last-sent timestamp in Redis when first request
- [x] [예외] OtpService.generateAndSave — should throw IllegalArgumentException when email is not registered
- [x] [예외] OtpService.generateAndSave — should throw IllegalStateException when resend interval less than 10min

### Controller 슬라이스 테스트

- [x] [정상] PublicUsersController.sendOtp — should return 200 with success message when valid email
- [x] [정상] PublicUsersController.sendOtp — should return SendOtpResponse with "OTP가 이메일로 발송되었습니다." message when success
- [x] [예외] PublicUsersController.sendOtp — should return 400 with "해당 이메일로 등록된 사용자가 없습니다." when email not registered
- [x] [예외] PublicUsersController.sendOtp — should return 409 with "OTP는 10분마다 재발송할 수 있습니다." when resend interval not met

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| Given 등록된 사용자 이메일로 OTP 발송을 요청할 때, When 요청을 보내면, Then 6자리 OTP가 생성되고 Redis에 30분 TTL로 저장된다. | [정상] OtpService.generateAndSave — should generate 6-digit OTP and save to Redis with 30min TTL |
| Given OTP가 Redis에 저장되었을 때, When 이메일을 발송하면, Then PasswordChangeEmailSender.send()가 @Async로 비동기 호출된다. | 통합 테스트로 확인 (단위 테스트 범위 밖) |
| Given 등록되지 않은 이메일로 OTP 발송을 요청할 때, When 요청을 보내면, Then IllegalArgumentException이 발생하고 400 상태코드와 "해당 이메일로 등록된 사용자가 없습니다." 메시지가 반환된다. | [예외] OtpService.generateAndSave — should throw IllegalArgumentException, [예외] PublicUsersController.sendOtp — should return 400 |
| Given 동일 이메일로 10분 미경과 상태일 때, When 재발송을 요청하면, Then IllegalStateException이 발생하고 409 상태코드와 "OTP는 10분마다 재발송할 수 있습니다." 메시지가 반환된다. | [예외] OtpService.generateAndSave — should throw IllegalStateException, [예외] PublicUsersController.sendOtp — should return 409 |
| Given OTP 발송이 성공했을 때, When 응답을 받으면, Then 200 상태코드와 "OTP가 이메일로 발송되었습니다." 메시지가 반환된다. | [정상] PublicUsersController.sendOtp — should return 200 with success message |
| Given OTP 발송이 완료되었을 때, When Redis를 조회하면, Then `otp:{email}` 키와 `otp:last-sent:{email}` 키가 존재한다. | [정상] OtpService.generateAndSave — should set last-sent timestamp in Redis (검증 로직 포함) |

---

## AC 검증

검증일: 2026-07-01
결과: ✅ 모든 AC 충족 (6건)

| AC | 상태 | 추적 경로 |
|----|------|----------|
| AC-1: 6자리 OTP 생성·Redis 저장 (30분 TTL) | ✅ | OtpService.generateAndSave() → generateOtpCode() (OTP_LENGTH=6) → redisTemplate.set(..., 30, MINUTES) |
| AC-2: @Async 비동기 이메일 발송 | ✅ | OtpService.generateAndSave() → emailSender.send() → @Async 추가 확인 |
| AC-3: 등록되지 않은 이메일 → 400 | ✅ | OtpService.generateAndSave() → usersRepository.existsByEmail() → IllegalArgumentException("해당 이메일로 등록된 사용자가 없습니다.") |
| AC-4: 10분 미경과 재발송 → 409 | ✅ | OtpService.generateAndSave() → redisTemplate.hasKey(LAST_SENT_KEY_PREFIX) → IllegalStateException("OTP는 10분마다 재발송할 수 있습니다.") |
| AC-5: 성공 시 200 + 성공 메시지 | ✅ | PublicUsersController.sendOtp() → ResponseEntity.ok() → SendOtpResponse.ofSuccess() |
| AC-6: Redis 키 존재 확인 | ✅ | OtpService.generateAndSave() → redisTemplate.set(otpKey, ...) → redisTemplate.set(lastSentKey, ...) |

---

## 리팩토링 결과
리팩토링일: 2026-07-01
완료: 0건 / 건너뜀: 0건

---

## 보안 검토

검토일: 2026-07-01

점검 대상: `PublicUsersController.java`, `OtpService.java`, `SendOtpRequest.java`, `SendOtpResponse.java`, `PasswordChangeEmailSender.java`
(`application.yml`은 이슈 #1에서 이미 검토된 env var 플레이스홀더 방식이라 재확인만 수행, 문제 없음)

### 즉시 수정 필요 (0건)
- [x] 없음 — 하드코딩 시크릿, Controller try-catch, `@Valid` 누락, Helper 위반, Flyway 우회 DDL, SecurityConfig 불일치, Swagger 어노테이션 누락, 민감정보 로깅, SQL Injection 모두 미발견

### 권장 수정 (0건)
- [x] 없음 — RuntimeException 직접 사용, `@Transactional` 직접 사용, 엔티티 노출, Request DTO 내부 ID 필드 노출 모두 미발견

### 무시 가능 (0건)
- 없음 — 미사용 import, TODO 주석 없음

### 클린 기준 충족
- [x] `./gradlew :api-platform:build -x test`: 컴파일 오류 0건 (BUILD SUCCESSFUL)
- [x] `./gradlew :api-platform:test`: 전체 테스트 통과
- [x] 보안 취약점: 0건
- [x] Spring Boot 패턴 위반: 0건
- [x] 코드 품질: 우수
