# 회원 가입 이메일 발송 PRD

## 개요
회원 가입 시 이메일 인증(OTP)을 도입하여 실제 사용자의 이메일 소유를 확인하고 가입을 완료하는 기능.
노출 엔드포인트는 `/api/public/users/send-otp`, `/api/public/users`이며, 일반 사용자가 호출한다.
이메일 인증 없는 가입을 방지하여 서비스 안정성을 높이는 비즈니스 문제를 해결한다.

## 사용자 스토리
- As a 일반 사용자, I want to 회원 가입을 위해 OTP를 이메일로 발송받고, so that 내 이메일을 인증할 수 있다.
- As a 일반 사용자, I want to OTP와 함께 회원 정보를 제출하여 가입을 완료하고, so that 서비스를 이용할 수 있다.

## API 명세
> API 변경 시 프론트엔드 `pnpm orval` 재실행 필요.

| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/users/send-otp | 불필요 | SendOtpRequest | SendOtpResponse |
| POST | /api/public/users | 불필요 | UsersSignupWithOtpRequest | UsersSignupResponse |

## 백엔드 아키텍처 준수 계획

**영향 범위**: `api/platform` (Controller·Service·DTO·Helper) + `datasource/platform` (Repository)

**Helper**: Service 200줄 초과 or private 5개 이상 → 추출. Repository 주입·트랜잭션 금지.
| Helper 클래스 | 역할 접미사 | 추출 이유 |
|-------------|-----------|---------|
| — | — | 예상 복잡도 낮음, 기존 Service 확장으로 충분 |

**예외**: Controller try-catch 금지. `IllegalArgumentException`(400) / `IllegalStateException`(409).

**캐시**: Redis 기존 활용 (OtpService 패턴). Caffeine 불필요.
- OTP_KEY_PREFIX: "otp:"
- LAST_SENT_KEY_PREFIX: "otp:last-sent:"
- TTL: 30분 (OTP), 10분 (재발송 방지)

**DB**: JOOQ 기본. 스키마 변경 없음 (기존 users 테이블 활용). Flyway 마이그레이션 불필요.

## 기술 결정

### 이메일 발송 서비스 통합 (OtpTemplate enum 도입)

**Context**
회원 가입용 OTP 발송 기능이 추가됨에 따라, 기존 비밀번호 변경용 OTP와 회원 가입용 OTP를 어떻게 관리할지 결정이 필요함.
기존 `PasswordChangeEmailSender`, `WelcomeEmailSender`가 각각 독립적인 구현체로 존재하며, 동일한 패턴의 이메일 발송 로직이 중복되어 있음.

**Decision**
`OtpEmailSender`를 신규 생성하고 `OtpTemplate` enum으로 템플릿을 구분하는 방식으로 통합함.
- `OtpTemplate` enum: `SIGNUP`, `PASSWORD_CHANGE` (각각 템플릿 이름 보유)
- `OtpEmailSender`: `send(String to, String otpCode, OtpTemplate template)` 메서드 하나로 두 용도 처리
- 기존 `PasswordChangeEmailSender`는 `OtpEmailSender`로 대체 (하위 호환성 고려하여 잠시 유지 가능, 제거 권장)
- `WelcomeEmailSender`는 유지 (가입 축하 이메일, OTP 아님)

**Alternatives**

- **안 A: SignupOtpEmailSender 신규 생성** - 기존 패턴 유지하나 중복 코드 발생, Service 메서드가 OTP 용도별로 분리되어야 함. 거부 사유: 코드 중복, 확장성 부족.
- **안 C: 추상 클래스 + 상속** - 상속 구조 도입하여 공통 로직을 상위로 이동. 거부 사유: 불필요한 복잡도 증가, 테스트 용이성 저하.

**Consequences**

장점:
- Service 메서드 하나로 여러 OTP 용도 처리 가능 (확장성 우수)
- 중복 코드 제거
- 템플릿 추가 시 enum만 추가하면 됨 (OEP 원칙 준수)

단점:
- 기존 `PasswordChangeEmailSender`를 `OtpEmailSender`로 교체하는 리팩토링 작업 필요
- 템플릿 파라미터가 DTO에 추가되어야 함 (API 변경)

## Out of Scope

- **SMS/알림톡 인증** - 이메일 OTP만 구현, 타 채널은 제외
- **회원 가입 승인 절차** - OTP 검증만으로 즉시 가입, 관리자 승인 프로세스 없음
- **이메일 링크 인증** - OTP 코드 방식만, 링크 클릭 방식 제외
- **OTP 재발송 횟수 제한** - 간격(10분)만 적용, 일일 최대 횟수 제한 없음
- **이메일 인증 만료 후 재가입** - Redis TTL 자동 소멸로만 처리, 별도 만료 로직 없음
- **가입 이메일 변경** - 가입 절차 중 이메일 변경 불가, 새 OTP 필요시 처음부터 다시 시작
- **Rate Limiting** - 이메일 발송에 대한 요청 rate limiting은 본 이슈에서 제외
- **WelcomeEmailSender 제거** - 기존 가입 축하 이메일은 유지, 제거 범위 아님
- **PasswordChangeEmailSender 즉시 제거** - 하위 호환성을 위해 잔존 허용, 향 이슈에서 제거 예정

## 용어 정의
spec-fixed.md와 동기화

| 용어 | 설명 | 코드 네이밍 |
|------|------|------------|
| OTP | One-Time Password, 6자리 숫자 인증 코드 | `otpCode`, `OTP_TTL_MINUTES` |
| Redis | OTP 캐싱을 위한 인메모리 DB | `redisTemplate`, `OTP_KEY_PREFIX` |
| EmailTemplate | 이메일 템플릿 타입 enum | `EmailTemplate` (SIGNUP, PASSWORD_CHANGE) |
| EmailSender | 이메일 발송 서비스 (범용) | `EmailSender` |
| SignupService | 회원 가입 비즈니스 로직 | `UsersService` (기존 확장) |
| PublicUsersController | 인증 불필요 회원 엔드포인트 | `PublicUsersController` |
