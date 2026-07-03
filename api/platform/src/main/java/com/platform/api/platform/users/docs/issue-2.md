## 시그니처

### Controller
```java
// PublicUsersController.sendOtp: POST /api/public/users/send-otp
// 접근 권한: 인증 불필요 (/api/public/** → PublicUsersController)
//
@PostMapping("/send-otp")
public ResponseEntity<ApiResult<SendOtpResponse>> sendOtp(
    @RequestBody @Valid SendOtpRequest request
);
```

### Service
```java
// OtpService.generateAndSave: OTP를 생성하고 Redis에 저장한 후 이메일로 발송한다
// OtpTemplate 파라미터를 추가하여 템플릿 타입을 동적으로 처리한다
@PlatformTransactional
public SendOtpResponse generateAndSave(String userEmail, OtpTemplate template);
// 예외: IllegalArgumentException(등록되지 않은 이메일), IllegalStateException(10분 미경과 재발송)
```

---

## 이슈 2: OtpService에 템플릿 파라미터 추가

### 목적
OtpService가 템플릿 타입을 받아서 OtpEmailSender에 전달하도록 수정.

### 작업 내용
- `OtpService.generateAndSave()` 메서드에 `OtpTemplate` 파라미터 추가
- `OtpEmailSender.send()` 호출 시 템플릿 전달
- 하위 호환성을 위한 오버로드 메서드 제거 (기존 비밀번호 변경 API도 템플릿 명시하도록 수정)

### Acceptance Criteria
- [x] Given OtpTemplate.PASSWORD_CHANGE가 주어질 때, When generateAndSave()를 호출하면, Then OtpEmailSender에 PASSWORD_CHANGE가 전달된다.
- [x] Given OtpTemplate.SIGNUP이 주어질 때, When generateAndSave()를 호출하면, Then OtpEmailSender에 SIGNUP이 전달된다.

### 파일 변경
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/OtpService.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/controller/PublicUsersController.java` (send-otp 엔드포인트 수정)

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] OtpService.generateAndSave — should call OtpEmailSender with PASSWORD_CHANGE template when OtpTemplate.PASSWORD_CHANGE is given
- [x] [정상] OtpService.generateAndSave — should call OtpEmailSender with SIGNUP template when OtpTemplate.SIGNUP is given
- [x] [예외] OtpService.generateAndSave — should throw IllegalArgumentException when email is not registered
- [x] [예외] OtpService.generateAndSave — should throw IllegalStateException when resend interval not passed

### Controller 슬라이스 테스트

- [x] [정상] PublicUsersController.sendOtp — should return 200 and send OTP when valid email provided
- [x] [예외] PublicUsersController.sendOtp — should return 400 when email is null/blank
- [x] [예외] PublicUsersController.sendOtp — should return 400 when email is not registered
- [x] [예외] PublicUsersController.sendOtp — should return 409 when resend interval not passed

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| Given OtpTemplate.PASSWORD_CHANGE, When generateAndSave() 호출, Then OtpEmailSender에 PASSWORD_CHANGE 전달 | [정상] OtpService.generateAndSave — should call OtpEmailSender with PASSWORD_CHANGE template |
| Given OtpTemplate.SIGNUP, When generateAndSave() 호출, Then OtpEmailSender에 SIGNUP 전달 | [정상] OtpService.generateAndSave — should call OtpEmailSender with SIGNUP template |

---

## AC 검증

검증일: 2026-07-02
결과: ✅ 모든 AC 충족 (2건)

### AC-1: ✅ 충족
Given OtpTemplate.PASSWORD_CHANGE가 주어질 때, When generateAndSave()를 호출하면, Then OtpEmailSender에 PASSWORD_CHANGE가 전달된다.

**구현 추적:**
- Given: `OtpTemplate.PASSWORD_CHANGE` enum 정의 (OtpTemplate.java:11)
- When: `OtpService.generateAndSave(String userEmail, OtpTemplate template)` 메서드 시그니처 (OtpService.java:55)
- Then: `emailSender.send(userEmail, otpCode, template)` 호출 시 template 파라미터 전달 (OtpService.java:79)
- Then: `OtpEmailSender.send()`에서 `template.getTemplateName()` 사용 (OtpEmailSender.java:63)

### AC-2: ✅ 충족
Given OtpTemplate.SIGNUP이 주어질 때, When generateAndSave()를 호출하면, Then OtpEmailSender에 SIGNUP이 전달된다.

**구현 추적:**
- Given: `OtpTemplate.SIGNUP` enum 정의 (OtpTemplate.java:10)
- When: 동일 메서드 `OtpService.generateAndSave(String userEmail, OtpTemplate template)` (OtpService.java:55)
- Then: 동일 흐름으로 template 파라미터가 OtpEmailSender까지 전달됨 (OtpService.java:79 → OtpEmailSender.java:63)

---

## 리팩토링 결과
리팩토링일: 2026-07-02
완료: 0건 / 건너뜀: 0건 (대상 없음)

---

## 보안 검토

검토일: 2026-07-02

### 즉시 수정 필요
없음

### 권장 수정
없음

### 무시 가능
없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건
- [x] ./gradlew test: 전체 통과
