# 공통 이메일 발송 기능 정의서 (확정)

## 기능 개요

`common/core` 라이브러리에 `EmailService` 빈을 제공한다.
`api/platform` 등 의존 모듈의 Service에서 주입하여 이메일을 동기 발송한다.

## 기능 요구사항

- 회원가입 완료 시 축하 이메일을 발송한다
- 비밀번호 변경 시 OTP 코드를 포함한 인증 이메일을 발송한다
- 이메일 본문은 Thymeleaf HTML 템플릿으로 렌더링한다
- 발신자 이메일/이름은 `platform.email` 설정으로 관리한다

## 제약사항

- `spring-boot-starter-mail` 라이브러리 사용
- `spring-boot-starter-thymeleaf` 라이브러리 사용
- 발송 방식: 동기 (JavaMailSender 직접 호출)
- OTP 코드 생성·저장·검증은 `api/platform` 담당 — `common/core`는 발송만 담당
- `common/core`는 `datasource-platform` 의존 없음 → 템플릿은 classpath resources 방식

## 용어 정의

| 용어 | 설명 | 코드 네이밍 |
|------|------|-----------|
| 이메일 서비스 | 이메일 발송 전용 서비스 | `EmailService` (interface) / `EmailServiceImpl` (@Service) |
| 회원가입 축하 메일 | 가입 완료 후 발송하는 축하 이메일 | `sendWelcomeEmail(String to, String userName)` |
| 비밀번호 변경 인증 메일 | OTP 코드를 포함한 비밀번호 변경 인증 이메일 | `sendPasswordChangeVerification(String to, String otpCode)` |
| OTP 코드 | 6자리 숫자 인증 코드. 생성·저장·검증은 api/platform 담당 | `otpCode` (String) |
| 이메일 템플릿 | Thymeleaf HTML 파일 (classpath 위치) | `welcome.html`, `password-change-verification.html` |
| 발신자 설정 | 이메일 발신자 주소 및 표시 이름 | `EmailProperties` (`platform.email.from`, `platform.email.fromName`) |

### 동의어 금지

- 회원 / 사용자 / 유저 → `userName` 단일 사용
- 인증코드 / OTP / 코드 → `otpCode` 단일 사용
- 메일 / 이메일 → `Email` 단일 사용
