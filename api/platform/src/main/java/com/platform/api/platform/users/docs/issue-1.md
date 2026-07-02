## 시그니처

### Enum

```java
// common/core/src/main/java/com/platform/common/core/email/OtpTemplate.java
// OTP 이메일 템플릿 타입을 구분하는 enum
public enum OtpTemplate {
    SIGNUP("signup-verification"),           // 회원 가입용
    PASSWORD_CHANGE("password-change-verification");  // 비밀번호 변경용

    private final String templateName;

    OtpTemplate(String templateName) {
        this.templateName = templateName;
    }

    public String getTemplateName();
}
```

### Helper

```java
// common/core/src/main/java/com/platform/common/core/email/OtpEmailSender.java
// OTP 인증 이메일 발송 서비스 (통합 템플릿 처리)
// 역할 접미사: Sender (EmailSender 마커 인터페이스 구현)
@Service
public class OtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final EmailProperties emailProperties;

    public OtpEmailSender(JavaMailSender mailSender,
                          @Qualifier("emailTemplateEngine") SpringTemplateEngine templateEngine,
                          EmailProperties emailProperties);

    /**
     * OTP 인증 이메일을 발송한다. OtpTemplate에 따라 템플릿을 동적으로 선택한다.
     *
     * @param to      수신자 이메일 주소
     * @param otpCode OTP 인증 코드
     * @param template 템플릿 타입 (SIGNUP or PASSWORD_CHANGE)
     * @throws IllegalArgumentException to 또는 otpCode가 null/blank인 경우
     * @throws EmailSendException 이메일 발송 실패(MessagingException) 시
     */
    @Async
    public void send(String to, String otpCode, OtpTemplate template);
}
```

### Service (수정 범위)

```java
// api/platform/src/main/java/com/platform/api/platform/users/service/OtpService.java
// OtpEmailSender로 의존성 교체 (PasswordChangeEmailSender → OtpEmailSender)
@Service
@RequiredArgsConstructor
public class OtpService {

    private final UsersRepository usersRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final OtpEmailSender emailSender;  // PasswordChangeEmailSender → OtpEmailSender

    // 기존 메서드 시그니처 유지 (내부에서 PASSWORD_CHANGE 템플릿 사용)
    @PlatformTransactional
    public SendOtpResponse generateAndSave(String userEmail);
}
```

---

## 이슈 1: OtpTemplate enum 및 OtpEmailSender 생성

### 목적
회원 가입용 OTP와 비밀번호 변경용 OTP를 하나의 통합된 EmailSender로 처리하기 위한 기반 구축.

### 작업 내용
- `OtpTemplate` enum 생성 (SIGNUP, PASSWORD_CHANGE)
- `OtpEmailSender` 클래스 생성 (기존 PasswordChangeEmailSender 패턴 기반)
- 템플릿 변수에 따라 동적으로 Thymeleaf 템플릿 처리

### Acceptance Criteria
- [x] Given OtpTemplate.SIGNUP이 주어질 때, When OtpEmailSender.send()를 호출하면, Then "signup-verification" 템플릿이 사용된다.
- [x] Given OtpTemplate.PASSWORD_CHANGE가 주어질 때, When OtpEmailSender.send()를 호출하면, Then "password-change-verification" 템플릿이 사용된다.
- [x] Given null/blank 이메일 또는 OTP 코드, When send()를 호출하면, Then IllegalArgumentException이 발생한다.
- [x] Given 메일 발송 실패(MessagingException), When send()를 호출하면, Then EmailSendException이 발생한다.

### 파일 변경
- 신규: `common/core/src/main/java/com/platform/common/core/email/OtpTemplate.java`
- 신규: `common/core/src/main/java/com/platform/common/core/email/OtpEmailSender.java`
- 수정: `api/platform/src/main/java/com/platform/api/platform/users/service/OtpService.java` (OtpEmailSender로 교체)

---

## 테스트 시나리오

### Helper 단위 테스트 (OtpEmailSender)

- [x] [정상] OtpEmailSender.send — should use "signup-verification" template when OtpTemplate.SIGNUP given
- [x] [정상] OtpEmailSender.send — should use "password-change-verification" template when OtpTemplate.PASSWORD_CHANGE given
- [x] [정상] OtpEmailSender.send — should send email with valid to, otpCode, and template
- [x] [예외] OtpEmailSender.send — should throw IllegalArgumentException when to is null
- [x] [예외] OtpEmailSender.send — should throw IllegalArgumentException when to is blank
- [x] [예외] OtpEmailSender.send — should throw IllegalArgumentException when otpCode is null
- [x] [예외] OtpEmailSender.send — should throw IllegalArgumentException when otpCode is blank
- [x] [예외] OtpEmailSender.send — should throw EmailSendException when MessagingException occurs

### Service 단위 테스트 (OtpService 수정 검증)

- [x] [정상] OtpService.generateAndSave — should work with OtpEmailSender dependency (regression test)
- [x] [예외] OtpService.generateAndSave — should throw IllegalArgumentException when unregistered email given (existing behavior)

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| Given OtpTemplate.SIGNUP이 주어질 때, When OtpEmailSender.send()를 호출하면, Then "signup-verification" 템플릿이 사용된다. | [정상] OtpEmailSender.send — should use "signup-verification" template when OtpTemplate.SIGNUP given |
| Given OtpTemplate.PASSWORD_CHANGE가 주어질 때, When OtpEmailSender.send()를 호출하면, Then "password-change-verification" 템플릿이 사용된다. | [정상] OtpEmailSender.send — should use "password-change-verification" template when OtpTemplate.PASSWORD_CHANGE given |
| Given null/blank 이메일 또는 OTP 코드, When send()를 호출하면, Then IllegalArgumentException이 발생한다. | [예외] OtpEmailSender.send — should throw IllegalArgumentException when to is null (×4 cases: to null, to blank, otpCode null, otpCode blank) |
| Given 메일 발송 실패(MessagingException), When send()를 호출하면, Then EmailSendException이 발생한다. | [예외] OtpEmailSender.send — should throw EmailSendException when MessagingException occurs |

---

## 리팩토링 결과
리팩토링일: 2026-07-02
완료: 0건 / 건너뜀: 0건

### 분석 대상 파일
- OtpService.java (125줄) — Helper 추출 불필요 (200줄 미만, private 1개)
- OtpEmailSender.java (72줄) — Helper 추출 불필요 (200줄 미만, private 0개)
- OtpTemplate.java (20줄) — 단순 enum

### 점검 결과
모든 파일이 7가지 점검 기준을 통과하며, 리팩토링이 필요한 항목이 없음.
프로젝트 컨벤션과 일관성이 유지되고 있음.

---

## 보안 검토

검토일: 2026-07-02

### 즉시 수정 필요 (0건)
- 없음

### 권장 수정 (0건)
- 없음

### 무시 가능 (0건)
- 없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건 (common-core, api-platform)
- [x] ./gradlew test: 전체 통과 (tdd-green 단계에서 검증 완료)

### 점검 항목별 결과 요약
| 단계 | 항목 | 결과 |
|------|------|------|
| 1 | 빌드 컴파일 검사 | ✅ 통과 |
| 2 | 하드코딩 시크릿 | ✅ 통과 (모두 환경변수 플레이스홀더 사용) |
| 3-1 | Controller try-catch | ✅ 통과 |
| 3-2 | @Valid 누락 | ✅ 통과 |
| 3-3 | Helper 위반 | ✅ 통과 |
| 3-4 | Flyway 우회 DDL | ✅ 통과 |
| 3-5 | 잘못된 예외 타입 | ✅ 통과 |
| 3-6 | SecurityConfig 정합성 | ✅ 통과 |
| 4-1 | Swagger 어노테이션 | ✅ 통과 |
| 4-2 | 기타 코드 품질 | ✅ 통과 |
