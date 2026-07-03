# 회원 가입 이메일 발송 기능 정의서 (확정版)

## 기능 개요
회원 가입 시 사용자에게 이메일로 인증 코드(OTP)를 발송하고, OTP 검증을 통해 회원 가입을 완료하는 기능.

## 기능 요구사항

### 1. 회원 가입 OTP 발송
- 사용자가 입력한 이메일로 6자리 OTP 코드 발송
- 비동기로 이메일 발송 처리
- OTP 유효시간: 30분
- 재발송 간격: 10분 (기존 OtpService 패턴 재사용)

### 2. 회원 가입 완료 (OTP 검증 포함)
- 사용자 정보 + OTP 코드를 함께 받아 검증
- OTP 검증 성공 시 회원 가입 처리
- 검증 실패 시 적절한 에러 응답

## 제약사항

### 템플릿
- `welcome.html` 템플릿 사용 (회원 가입용)

### 이메일 발송 인프라
- 기존 `PasswordChangeEmailSender`를 범용 `EmailSender`로 확장
- 템플릿 타입을 enum으로 관리 (SIGNUP, PASSWORD_CHANGE)

### 접근 권한
- 모든 엔드포인트 인증 불필요 (`/api/public/users`)

### 에러 처리
- 이미 가입된 이메일: 409 Conflict + "이미 가입된 이메일입니다"
- OTP 만료: 400 Bad Request + "OTP가 만료되었습니다"
- OTP 불일치: 400 Bad Request + "OTP가 일치하지 않습니다"
- 메일 발송 실패: 503 Service Unavailable + "이메일 발송에 실패했습니다"

## 동작 시나리오

### 시나리오 1: 회원 가입 OTP 발송
1. 사용자가 이메일을 입력하여 OTP 발송 요청
2. 시스템이 6자리 OTP 코드 생성
3. Redis에 OTP 저장 (TTL 30분)
4. Redis에 재발송 방지를 위한 타임스탬프 저장 (TTL 10분)
5. 비동기로 이메일 발송 (welcome.html 템플릿)
6. 즉시 성공 응답 반환

### 시나리오 2: 회원 가입 완료 (OTP 검증 포함)
1. 사용자가 아이디, 이름, 이메일, 비밀번호, OTP 코드를 입력
2. 시스템이 Redis에서 OTP 조회 및 검증
3. 검증 실패 시 400 에러 반환
4. 검증 성공 시 아이디/이메일 중복 확인
5. 중복 시 409 에러 반환
6. 비밀번호 암호화 후 사용자 생성
7. USER 권한 부여
8. Redis에서 OTP 삭제
9. 201 Created 응답 반환

### 시나리오 3: OTP 재발송
1. 사용자가 동일한 이메일로 재발송 요청
2. 시스템이 Redis에서 마지막 발송 시간 확인
3. 10분 미경과 시 409 Conflict + "OTP는 10분마다 재발송할 수 있습니다"
4. 10분 경과 시 신규 OTP 생성 및 발송

## 용어 정의

| 용어 | 설명 | 코드 네이밍 |
|------|------|------------|
| OTP | One-Time Password, 6자리 숫자 인증 코드 | `otpCode`, `OTP_TTL_MINUTES` |
| Redis | OTP 캐싱을 위한 인메모리 DB | `redisTemplate`, `OTP_KEY_PREFIX` |
| EmailTemplate | 이메일 템플릿 타입 enum | `EmailTemplate` (SIGNUP, PASSWORD_CHANGE) |
| EmailSender | 이메일 발송 서비스 (범용) | `EmailSender` |
| SignupService | 회원 가입 비즈니스 로직 | `UsersService` (기존 확장) |
| PublicUsersController | 인증 불필요 회원 엔드포인트 | `PublicUsersController` |

## 기존 코드 재사용 계획

### OtpService
- 기존 `OtpService`의 OTP 생성/저장/검증 로직 재사용
- 단, 회원 가입용으로 사용 시 "사용자 등록 여부 확인" 로직 제거 필요
  - 회원 가입은 미가입 상태에서 발생하므로

### EmailSender
- 기존 `PasswordChangeEmailSender`를 `EmailSender`로 리팩토링
- `EmailTemplate` enum 추가 (SIGNUP, PASSWORD_CHANGE)
- 템플릿 타입에 따라 다른 HTML 템플릿 사용

### UsersService
- 기존 `signup()` 메서드에 OTP 검증 로직 추가
- 순서 변경: OTP 검증 → 중복 확인 → 사용자 생성

### Repository
- 기존 `UsersRepository` 재사용 (변경 없음)
