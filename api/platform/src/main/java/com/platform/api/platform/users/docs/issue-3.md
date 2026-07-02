## 시그니처

### Controller
```java
// PublicUsersController.sendSignupOtp: POST /api/public/users/signup/otp
// 접근 권한: 인증 불필요 (/api/public/users/** → PublicUsersController)
// Auditing 불필요 (공개 API, 생성자 추적 없음)
@PostMapping("/signup/otp")
public ResponseEntity<ApiResult<SendOtpResponse>> sendSignupOtp(
    @RequestBody @Valid SendOtpRequest request
);
// → usersService.sendSignupOtp(request.userEmail()) 호출
```

### Service
```java
// UsersService.sendSignupOtp: 미가입 이메일에 회원가입용 OTP를 발송한다.
// (이메일이 미가입이어야 정상 — 기존 OtpService의 "등록 여부 확인"과 정반대)
@PlatformTransactional
public SendOtpResponse sendSignupOtp(String userEmail);
// 예외:
//   IllegalStateException("이미 가입된 이메일입니다.")        ← 이미 가입된 이메일 (409)
//   IllegalStateException("OTP는 10분마다 재발송할 수 있습니다.") ← 10분 미경과 재발송 (OtpService에서 전파, 409)

// OtpService.generateAndSaveForSignup: 사용자 등록 여부 확인 없이 회원가입용 OTP를 생성·저장·발송한다.
// (existsByEmail 체크 생략 — 회원가입은 미가입이 정상 케이스. SIGNUP 템플릿 고정)
@PlatformTransactional
public SendOtpResponse generateAndSaveForSignup(String userEmail);
// 예외:
//   IllegalStateException("OTP는 10분마다 재발송할 수 있습니다.") ← 10분 미경과 재발송 (409)
```

> **파일 변경 범위 참고 (GATE 1 승인)**: 기존 `OtpService.generateAndSave(email, template)`는 미가입 시 `IllegalArgumentException`을 던져 회원가입용(미가입 허용)과 충돌. 이를 우회하기 위해 `OtpService.generateAndSaveForSignup` 신규 메서드를 추가한다 → **`OtpService.java`가 파일 변경 범위에 포함됨** (이슈 원본의 파일 변경 목록에서 누락되었으나 승인됨).

---

## 이슈 3: 회원 가입용 OTP 발송 API (미가입 이메일 허용)

### 목적
회원 가입을 위한 OTP 발송 엔드포인트 생성. 기존 OtpService의 "사용자 등록 여부 확인" 로직을 우회하는 별도 메서드 필요.

### 작업 내용
- `UsersService.sendSignupOtp()` 메서드 생성 (미가입 이메일 허용)
- `PublicUsersController.sendSignupOtp()` 엔드포인트 생성
- `SendOtpRequest` DTO 재사용 (이메일만)
- 응답: 기존 `SendOtpResponse` 재사용

### Acceptance Criteria
- [x] Given 미가입 이메일, When POST /api/public/users/signup/otp를 호출하면, Then 200 OK와 OTP 발송 성공 응답이 반환된다.
- [x] Given 이미 가입된 이메일, When POST /api/public/users/signup/otp를 호출하면, Then 409 Conflict와 "이미 가입된 이메일입니다" 에러가 반환된다.
- [x] Given 10분 미경과 재발송 요청, When POST /api/public/users/signup/otp를 호출하면, Then 409 Conflict와 "OTP는 10분마다 재발송할 수 있습니다" 에러가 반환된다.
- [x] Given null/blank 이메일, When POST /api/public/users/signup/otp를 호출하면, Then 400 Bad Request가 반환된다.

### API 명세
| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/users/signup/otp | 불필요 | SendOtpRequest | SendOtpResponse |

### 파일 변경
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/UsersService.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/OtpService.java` (GATE 1 승인: `generateAndSaveForSignup` 신규 추가)
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/controller/PublicUsersController.java`

---

## 테스트 시나리오

> 본 이슈의 400 입력 오류는 Bean Validation(`@NotBlank`/`@Email` → `MethodArgumentNotValidException`)이 담당하므로 `IllegalArgumentException` 시나리오는 없음. 비즈니스 409는 모두 `IllegalStateException`(이미 가입 / 재발송 간격)로 처리.

### Service 단위 테스트

- [x] [정상] `UsersService.sendSignupOtp` — should delegate to `OtpService.generateAndSaveForSignup` and return `SendOtpResponse` when email is NOT registered (`existsByEmail` = false)
- [x] [예외] `UsersService.sendSignupOtp` — should throw `IllegalStateException("이미 가입된 이메일입니다.")` when email is already registered (`existsByEmail` = true), and should NOT call OtpService
- [x] [정상] `OtpService.generateAndSaveForSignup` — should generate OTP, save to Redis, and send email with `OtpTemplate.SIGNUP` when email is unregistered and resend interval passed (no existsByEmail check — 미가입 허용)
- [x] [예외] `OtpService.generateAndSaveForSignup` — should throw `IllegalStateException("OTP는 10분마다 재발송할 수 있습니다.")` when resend interval not passed (`otp:last-sent:` key exists)

### Controller 슬라이스 테스트

- [x] [정상] `PublicUsersController.sendSignupOtp` — should return 200 and success response when valid unregistered email provided
- [x] [예외] `PublicUsersController.sendSignupOtp` — should return 409 with message "이미 가입된 이메일입니다." when email already registered
- [x] [예외] `PublicUsersController.sendSignupOtp` — should return 409 with message "OTP는 10분마다 재발송할 수 있습니다." when resend interval not passed
- [x] [예외] `PublicUsersController.sendSignupOtp` — should return 400 when email is null/blank (`@Valid` `@NotBlank`)
- [x] [경계] `PublicUsersController.sendSignupOtp` — should return 400 when email format is invalid (e.g. `"not-an-email"`, `@Email`)

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| AC-1: 미가입 이메일 → 200 OK | [정상] `UsersService.sendSignupOtp` (위임), [정상] `OtpService.generateAndSaveForSignup` (미가입 허용 + SIGNUP), [정상] `PublicUsersController.sendSignupOtp` (200) |
| AC-2: 이미 가입된 이메일 → 409 "이미 가입된 이메일입니다" | [예외] `UsersService.sendSignupOtp` (IllegalStateException), [예외] `PublicUsersController.sendSignupOtp` (409) |
| AC-3: 10분 미경과 재발송 → 409 "OTP는 10분마다 재발송할 수 있습니다" | [예외] `OtpService.generateAndSaveForSignup` (IllegalStateException), [예외] `PublicUsersController.sendSignupOtp` (409) |
| AC-4: null/blank 이메일 → 400 | [예외] `PublicUsersController.sendSignupOtp` (400 blank/null), [경계] `PublicUsersController.sendSignupOtp` (400 invalid format) |

---

## AC 검증

검증일: 2026-07-03
결과: ✅ 모든 AC 충족 (4건)

### AC별 추적 결과

- **AC-1 (미가입 이메일 → 200 OK)** ✅
  - Given: `UsersService.sendSignupOtp` → `usersRepository.existsByEmail` false 확인 (`UsersService.java:176`)
  - When: `@PostMapping("/signup/otp")` + `@RequestMapping("/api/public/users")` → `/api/public/users/signup/otp` (`PublicUsersController.java:116`); `/api/public/**` permitAll (`SecurityConfig.java:103`)
  - Then: `ResponseEntity.ok(ApiResult.of(...))` → `OtpService.generateAndSaveForSignup` → `SendOtpResponse.ofSuccess()` (`PublicUsersController.java:120`, `OtpService.java:132`)

- **AC-2 (이미 가입된 이메일 → 409 "이미 가입된 이메일입니다")** ✅
  - `throw new IllegalStateException("이미 가입된 이메일입니다.")` (`UsersService.java:177`)
  - `GlobalExceptionHandler.handleIllegalStateException` → `HttpStatus.CONFLICT` (409) (`GlobalExceptionHandler.java:108-112`)

- **AC-3 (10분 미경과 재발송 → 409 "OTP는 10분마다 재발송할 수 있습니다")** ✅
  - `OtpService.generateAndSaveForSignup` → `redisTemplate.hasKey(LAST_SENT_KEY_PREFIX + userEmail)` → `throw new IllegalStateException("OTP는 10분마다 재발송할 수 있습니다.")` (`OtpService.java:113-116`)
  - GlobalExceptionHandler → 409

- **AC-4 (null/blank 이메일 → 400)** ✅
  - `SendOtpRequest.userEmail`에 `@NotBlank` + `@Email` (`SendOtpRequest.java:12-13`)
  - `@Valid` → `MethodArgumentNotValidException` → `GlobalExceptionHandler.handleValidationException` → `HttpStatus.BAD_REQUEST` (400) (`GlobalExceptionHandler.java:37-48`)

---

## 리팩토링 결과
리팩토링일: 2026-07-03
완료: 1건 / 건너뜀: 0건

### 적용 항목

- **OtpService.java — `issueOtp` 헬퍼 추출 (중복 제거)**
  - `generateAndSave(email, template)`와 `generateAndSaveForSignup(email)`의 공통 발급 로직
    (재발송 간격 체크 → 6자리 OTP 생성 → Redis OTP 저장(30분 TTL) → last-sent 저장(10분 TTL) → 이메일 발송)
    을 private `issueOtp(email, template)` 헬퍼로 추출.
  - 차이점(existsByEmail 사전 검증 / 템플릿 인자)만 각 public 메서드에 잔류 → 동작 변경 없음.
  - 회귀 확인: `:api-platform:test` BUILD SUCCESSFUL (전체 통과, 동작 변경 없음).

### 제외 항목 (검토했으나 유지)

- `UsersService.java` (242줄) — 200줄 초과이나 실제 로직 약 80줄, 잔여는 CLAUDE.md 의무 JavaDoc. 도메인 응집도가 높아 강제 Helper 추출 시 가독성 저하.
- `PublicUsersController.java` (122줄) — 엔드포인트 매핑만 존재, 중복·네이밍 이슈 없음.

> 비고: 상기 `## AC 검증` 섹션의 `OtpService.java` 줄번호 참조는 리팩토링(행 이동)으로 미세하게 변동될 수 있으나, 동작은 변경되지 않아 AC 충족 결론은 유효하다.

---

## 보안 검토

검토일: 2026-07-03

### 즉시 수정 필요 (처리 완료)
- (없음)

### 권장 수정
- (없음)

### 무시 가능
- (없음)

### 관찰 사항 (스킬 범위 외 — 조치 불필요)
- **이메일 존재 여부 노출(Account enumeration)** — `UsersService.sendSignupOtp`: 이미 가입된 이메일 → 409 "이미 가입된 이메일입니다" (AC-2 의무 동작). 회원가입 OTP 엔드포인트에서는 의도적·허용 가능한 UX 결정이며 AC가 명시하므로 유지.
- **이메일별 재발송 간격 제한만 존재** — `OtpService.issueOtp`: `otp:last-sent:{email}` Redis 키로 동일 이메일 10분 제한. IP/일일 횟수 제한은 prd Out-of-Scope(line 74)이자 기존 `/send-otp`(이슈 #2)와 동일 패턴 → 이 이슈 범위 외.

### 클린 기준 충족
- [x] `./gradlew :api-platform:build -x test`: 컴파일 오류 0건 (BUILD SUCCESSFUL)
- [x] `./gradlew :api-platform:test`: 전체 통과 (BUILD SUCCESSFUL)
