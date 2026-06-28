# 공통 이메일 발송 기능 — 이슈 목록

> 완료 기준: 이슈 완료 후 `api/platform`에서 `EmailService`를 주입하여 해당 이메일을 발송할 수 있다.
> Controller 없으므로 Service 단위 테스트가 주 테스트 레이어.

---

## 이슈 #1: EmailService 기반 구조 + 회원가입 축하 메일

### 범위

- `common/core/build.gradle`에 의존성 추가
- `EmailProperties` @ConfigurationProperties record 생성
- `EmailConfig` @Configuration 생성 (이메일 전용 Thymeleaf 엔진)
- `EmailService` interface 생성
- `EmailServiceImpl` @Service 생성 (`sendWelcomeEmail` 구현)
- `welcome.html` Thymeleaf 템플릿 생성
- `application-core.yml`에 `platform.email` 기본값 추가

### 생성/수정 파일

```
common/core/build.gradle                                            (수정)
common/core/src/main/resources/application-core.yml                (수정)
common/core/src/main/java/com/platform/common/core/email/
├── EmailService.java                                               (신규)
├── EmailServiceImpl.java                                           (신규)
└── config/
    ├── EmailConfig.java                                            (신규)
    └── EmailProperties.java                                        (신규)
common/core/src/main/resources/templates/email/
└── welcome.html                                                    (신규)
```

### Acceptance Criteria

- [ ] Given JavaMailSender Mock, When `sendWelcomeEmail("to@test.com", "홍길동")` 호출, Then `mailSender.send(MimeMessage)` 1회 호출됨
- [ ] Given 유효한 수신자 이메일과 사용자명, When `sendWelcomeEmail` 호출, Then MimeMessage의 subject가 "가입을 축하합니다!" 포함
- [ ] Given Thymeleaf 템플릿, When `sendWelcomeEmail` 호출, Then MimeMessage body에 `userName` 값이 렌더링됨
- [ ] Given `to`가 null 또는 blank, When `sendWelcomeEmail` 호출, Then `IllegalArgumentException` 발생
- [ ] Given `userName`이 null 또는 blank, When `sendWelcomeEmail` 호출, Then `IllegalArgumentException` 발생

### 테스트 레이어

| 레이어 | 어노테이션 | Mock 대상 |
|--------|-----------|---------|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | `JavaMailSender` (`@Mock`), `SpringTemplateEngine` (`@Mock`, `"emailTemplateEngine"` qualifier) |

---

## 이슈 #2: 비밀번호 변경 OTP 이메일

### 범위

- `EmailServiceImpl.sendPasswordChangeVerification` 구현
- `password-change-verification.html` Thymeleaf 템플릿 생성

### 생성/수정 파일

```
common/core/src/main/java/com/platform/common/core/email/
└── EmailServiceImpl.java                                           (수정 — 메서드 추가)
common/core/src/main/resources/templates/email/
└── password-change-verification.html                              (신규)
```

### Acceptance Criteria

- [ ] Given JavaMailSender Mock, When `sendPasswordChangeVerification("to@test.com", "123456")` 호출, Then `mailSender.send(MimeMessage)` 1회 호출됨
- [ ] Given 유효한 수신자와 OTP 코드, When `sendPasswordChangeVerification` 호출, Then MimeMessage subject에 "비밀번호 변경" 포함
- [ ] Given Thymeleaf 템플릿, When `sendPasswordChangeVerification` 호출, Then MimeMessage body에 `otpCode` 값이 렌더링됨
- [ ] Given `to`가 null 또는 blank, When `sendPasswordChangeVerification` 호출, Then `IllegalArgumentException` 발생
- [ ] Given `otpCode`가 null 또는 blank, When `sendPasswordChangeVerification` 호출, Then `IllegalArgumentException` 발생

### 테스트 레이어

| 레이어 | 어노테이션 | Mock 대상 |
|--------|-----------|---------|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | `JavaMailSender` (`@Mock`), `SpringTemplateEngine` (`@Mock`) |

---

## 의존성 순서

이슈 #1 완료 후 이슈 #2 진행. 이슈 #1에서 인프라(build.gradle, Config, Properties, 인터페이스)를 모두 구축하므로 이슈 #2는 구현 메서드와 템플릿만 추가.

## TDD 사이클

```
/test-scenarios-be 1   → EmailService 시그니처 확정 + 이슈 #1 시나리오 도출
/tdd-red-be 1          → 실패 테스트 작성
/tdd-green-be 1        → 최소 구현
/ac-verifier-be 1      → AC 독립 검증
/tdd-refactor-be 1     → 구조 개선
/security-review-be 1  → 보안 점검

/test-scenarios-be 2   → 이슈 #2 시나리오 도출
/tdd-red-be 2          → 실패 테스트 추가
/tdd-green-be 2        → 구현
/ac-verifier-be 2      → AC 검증
/tdd-refactor-be 2     → 리팩토링
/security-review-be 2  → 보안 점검

/create-pr-be          → PR 생성
```
