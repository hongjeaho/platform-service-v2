# 회원 가입 이메일 발송 이슈 목록

## 이슈 1: OtpTemplate enum 및 OtpEmailSender 생성

### 목적
회원 가입용 OTP와 비밀번호 변경용 OTP를 하나의 통합된 EmailSender로 처리하기 위한 기반 구축.

### 작업 내용
- `OtpTemplate` enum 생성 (SIGNUP, PASSWORD_CHANGE)
- `OtpEmailSender` 클래스 생성 (기존 PasswordChangeEmailSender 패턴 기반)
- 템플릿 변수에 따라 동적으로 Thymeleaf 템플릿 처리

### Acceptance Criteria
- [ ] Given OtpTemplate.SIGNUP이 주어질 때, When OtpEmailSender.send()를 호출하면, Then "signup-verification" 템플릿이 사용된다.
- [ ] Given OtpTemplate.PASSWORD_CHANGE가 주어질 때, When OtpEmailSender.send()를 호출하면, Then "password-change-verification" 템플릿이 사용된다.
- [ ] Given null/blank 이메일 또는 OTP 코드, When send()를 호출하면, Then IllegalArgumentException이 발생한다.
- [ ] Given 메일 발송 실패(MessagingException), When send()를 호출하면, Then EmailSendException이 발생한다.

### 파일 변경
- 신규: `common/core/src/main/java/com/platform/common/core/email/OtpTemplate.java`
- 신규: `common/core/src/main/java/com/platform/common/core/email/OtpEmailSender.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/OtpService.java` (OtpEmailSender로 교체)

---

## 이슈 2: OtpService에 템플릿 파라미터 추가

### 목적
OtpService가 템플릿 타입을 받아서 OtpEmailSender에 전달하도록 수정.

### 작업 내용
- `OtpService.generateAndSave()` 메서드에 `OtpTemplate` 파라미터 추가
- `OtpEmailSender.send()` 호출 시 템플릿 전달
- 하위 호환성을 위한 오버로드 메서드 제거 (기존 비밀번호 변경 API도 템플릿 명시하도록 수정)

### Acceptance Criteria
- [ ] Given OtpTemplate.PASSWORD_CHANGE가 주어질 때, When generateAndSave()를 호출하면, Then OtpEmailSender에 PASSWORD_CHANGE가 전달된다.
- [ ] Given OtpTemplate.SIGNUP이 주어질 때, When generateAndSave()를 호출하면, Then OtpEmailSender에 SIGNUP이 전달된다.

### 파일 변경
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/OtpService.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/controller/PublicUsersController.java` (send-otp 엔드포인트 수정)

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
- [ ] Given 미가입 이메일, When POST /api/public/users/signup/otp를 호출하면, Then 200 OK와 OTP 발송 성공 응답이 반환된다.
- [ ] Given 이미 가입된 이메일, When POST /api/public/users/signup/otp를 호출하면, Then 409 Conflict와 "이미 가입된 이메일입니다" 에러가 반환된다.
- [ ] Given 10분 미경과 재발송 요청, When POST /api/public/users/signup/otp를 호출하면, Then 409 Conflict와 "OTP는 10분마다 재발송할 수 있습니다" 에러가 반환된다.
- [ ] Given null/blank 이메일, When POST /api/public/users/signup/otp를 호출하면, Then 400 Bad Request가 반환된다.

### API 명세
| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/users/signup/otp | 불필요 | SendOtpRequest | SendOtpResponse |

### 파일 변경
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/UsersService.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/controller/PublicUsersController.java`

---

## 이슈 4: 회원 가입 완료 API에 OTP 검증 추가

### 목적
기존 회원 가입 API에 OTP 검증 로직을 추가하여 인증된 사용자만 가입되도록 수정.

### 작업 내용
- `UsersSignupRequest`에 `otpCode` 필드 추가
- `UsersService.signup()` 메서드에 OTP 검증 로직 추가 (OtpService.verify() 호출)
- OTP 검증 실패 시 400 Bad Request 반환
- OTP 검증 성공 후 기존 가입 로직 진행

### Acceptance Criteria
- [ ] Given 유효한 OTP와 중복되지 않은 아이디/이메일, When POST /api/public/users를 호출하면, Then 201 Created와 사용자 정보가 반환된다.
- [ ] Given 만료되거나 잘못된 OTP, When POST /api/public/users를 호출하면, Then 400 Bad Request와 "OTP가 만료되었습니다" 또는 "OTP가 일치하지 않습니다" 에러가 반환된다.
- [ ] Given 중복된 아이디, When POST /api/public/users를 호출하면, Then 409 Conflict와 "이미 사용 중인 아이디입니다" 에러가 반환된다.
- [ ] Given 중복된 이메일, When POST /api/public/users를 호출하면, Then 409 Conflict와 "이미 사용 중인 이메일입니다" 에러가 반환된다.
- [ ] Given null/blank OTP 코드, When POST /api/public/users를 호출하면, Then 400 Bad Request가 반환된다.

### API 명세
| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/users | 불필요 | UsersSignupWithOtpRequest | UsersSignupResponse |

### 파일 변경
- 신규: `api/platform/src/main/java/com/platform/api/platform/users/dto/UsersSignupWithOtpRequest.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/UsersService.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/controller/PublicUsersController.java`

---

## 의존성 순서

1. **이슈 1** → OtpTemplate, OtpEmailSender 생성 (기반 구축)
2. **이슈 2** → OtpService 수정 (테플릿 파라미터 추가)
3. **이슈 3** → 회원 가입용 OTP 발송 API (미가입 이메일 허용 로직)
4. **이슈 4** → 회원 가입 완료 API에 OTP 검증 추가

---

## 네이밍 규칙

spec-fixed.md의 용어 정의를 따름:

| 용어 | 코드 네이밍 |
|------|-----------|
| OTP | `otpCode`, `OTP_TTL_MINUTES` |
| OtpTemplate | `OtpTemplate` enum |
| OtpEmailSender | `OtpEmailSender` |
| UsersService | `UsersService` |
| PublicUsersController | `PublicUsersController` |
| SendOtpRequest | `SendOtpRequest` |
| SendOtpResponse | `SendOtpResponse` |
| UsersSignupWithOtpRequest | `UsersSignupWithOtpRequest` |
| UsersSignupResponse | `UsersSignupResponse` |
