## 시그니처

> ⚠️ 설계 변경 (issue-1.md에서 확정): `EmailServiceImpl.sendPasswordChangeVerification` → `PasswordChangeEmailSender.send`
> `WelcomeEmailSender` 패턴을 동일하게 적용 (마커 인터페이스 `EmailSender` implements)

### Service (구현체)

```java
// PasswordChangeEmailSender: 비밀번호 변경 OTP 인증 이메일 발송 서비스
// implements EmailSender (마커 인터페이스)
// Mock 대상 (테스트): JavaMailSender (@Mock), SpringTemplateEngine (@Mock, qualifier="emailTemplateEngine")

/**
 * 비밀번호 변경 OTP 인증 이메일 발송 서비스.
 */
@Service
public class PasswordChangeEmailSender implements EmailSender {

    /**
     * 비밀번호 변경 OTP 인증 이메일을 발송한다.
     *
     * @param to      수신자 이메일 주소
     * @param otpCode OTP 인증 코드
     * @throws IllegalArgumentException to 또는 otpCode가 null/blank인 경우
     */
    public void send(String to, String otpCode);
    // 예외: IllegalArgumentException("수신자 이메일은 필수입니다.") — to null/blank
    // 예외: IllegalArgumentException("OTP 코드는 필수입니다.")     — otpCode null/blank
}
```

---

## 이슈 #2: 비밀번호 변경 OTP 이메일

### 범위

- `PasswordChangeEmailSender` @Service 생성 (`send` 구현)
- `password-change-verification.html` Thymeleaf 템플릿 생성

### 생성/수정 파일

```
common/core/src/main/java/com/platform/common/core/email/
└── PasswordChangeEmailSender.java                                  (신규)
common/core/src/main/resources/templates/email/
└── password-change-verification.html                              (신규)
```

### Acceptance Criteria

- [x] Given JavaMailSender Mock, When `send("to@test.com", "123456")` 호출, Then `mailSender.send(MimeMessage)` 1회 호출됨
- [x] Given 유효한 수신자와 OTP 코드, When `send` 호출, Then MimeMessage subject에 "비밀번호 변경" 포함
- [x] Given Thymeleaf 템플릿, When `send` 호출, Then MimeMessage body에 `otpCode` 값이 렌더링됨
- [x] Given `to`가 null 또는 blank, When `send` 호출, Then `IllegalArgumentException` 발생
- [x] Given `otpCode`가 null 또는 blank, When `send` 호출, Then `IllegalArgumentException` 발생

### 테스트 레이어

| 레이어 | 어노테이션 | Mock 대상 |
|--------|-----------|---------|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | `JavaMailSender` (`@Mock`), `SpringTemplateEngine` (`@Mock`) |

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] `PasswordChangeEmailSender.send` — should invoke `mailSender.send(MimeMessage)` once when valid `to` and `otpCode` given
- [x] [정상] `PasswordChangeEmailSender.send` — should set MimeMessage subject containing "비밀번호 변경" when valid `to` and `otpCode` given
- [x] [정상] `PasswordChangeEmailSender.send` — should render `otpCode` value in MimeMessage body when Thymeleaf template processed
- [x] [예외] `PasswordChangeEmailSender.send` — should throw `IllegalArgumentException` when `to` is null
- [x] [예외] `PasswordChangeEmailSender.send` — should throw `IllegalArgumentException` when `to` is blank
- [x] [예외] `PasswordChangeEmailSender.send` — should throw `IllegalArgumentException` when `otpCode` is null
- [x] [예외] `PasswordChangeEmailSender.send` — should throw `IllegalArgumentException` when `otpCode` is blank

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| `mailSender.send(MimeMessage)` 1회 호출 | [정상] should invoke `mailSender.send(MimeMessage)` once |
| MimeMessage subject에 "비밀번호 변경" 포함 | [정상] should set subject containing "비밀번호 변경" |
| MimeMessage body에 `otpCode` 렌더링 | [정상] should render `otpCode` in MimeMessage body |
| `to` null/blank → `IllegalArgumentException` | [예외] should throw when `to` is null, [예외] should throw when `to` is blank |
| `otpCode` null/blank → `IllegalArgumentException` | [예외] should throw when `otpCode` is null, [예외] should throw when `otpCode` is blank |

---

## AC 검증

검증일: 2026-06-28
결과: ✅ 모든 AC 충족 (5건)

---

## 리팩토링 결과
리팩토링일: 2026-06-28
완료: 0건 / 건너뜀: 0건

---

## 보안 검토

검토일: 2026-06-28

### 즉시 수정 필요
없음

### 권장 수정
없음

### 무시 가능
없음

### 클린 기준 충족
- [x] ./gradlew :common-core:build -x test: 컴파일 오류 0건
- [x] ./gradlew :common-core:test: 전체 통과
