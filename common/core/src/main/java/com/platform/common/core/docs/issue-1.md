## 시그니처

> ⚠️ 설계 변경: 단일 `EmailService` 인터페이스 → `EmailSender` 마커 + 이메일 타입별 독립 구현체 (ISP 준수)
> Issue #1 = `WelcomeEmailSender`, Issue #2 = `PasswordChangeEmailSender`

### Service (마커 인터페이스)

```java
// EmailSender: 이메일 발송 서비스 공통 마커 인터페이스
// 메서드 선언 없음 — 각 구현체마다 파라미터가 달라 공통 시그니처 정의 불가
public interface EmailSender {}
```

### Service (구현체)

```java
// WelcomeEmailSender: 회원가입 축하 이메일 발송 서비스
// Mock 대상 (테스트): JavaMailSender (@Mock), SpringTemplateEngine (@Mock, qualifier="emailTemplateEngine")

/**
 * 회원가입 축하 이메일 발송 서비스.
 */
@Service
public class WelcomeEmailSender implements EmailSender {

    /**
     * 회원가입 축하 이메일을 발송한다.
     *
     * @param to       수신자 이메일 주소
     * @param userName 수신자 이름
     * @throws IllegalArgumentException to 또는 userName이 null/blank인 경우
     */
    public void send(String to, String userName);
    // 예외: IllegalArgumentException("수신자 이메일은 필수입니다.") — to null/blank
    // 예외: IllegalArgumentException("사용자명은 필수입니다.")     — userName null/blank
}
```

### Config

```java
// EmailProperties: platform.email 설정 바인딩
@ConfigurationProperties("platform.email")
public record EmailProperties(
    String from,      // 발신자 이메일 주소 (예: noreply@platform.com)
    String fromName   // 발신자 표시 이름 (예: Platform)
) {}

// EmailConfig: 이메일 전용 Thymeleaf 엔진 구성 (웹 MVC 뷰 엔진과 격리)
/**
 * 이메일 발송에 필요한 Bean을 구성한다.
 */
@Configuration
@EnableConfigurationProperties(EmailProperties.class)
public class EmailConfig {

    /**
     * 이메일 전용 Thymeleaf 엔진.
     * ClassLoaderTemplateResolver로 classpath:/templates/email/ 경로만 탐색한다.
     */
    @Bean("emailTemplateEngine")
    public SpringTemplateEngine emailTemplateEngine();
}
```

---

## 이슈 #1: EmailService 기반 구조 + 회원가입 축하 메일

### 범위

- `common/core/build.gradle`에 의존성 추가
- `EmailProperties` @ConfigurationProperties record 생성
- `EmailConfig` @Configuration 생성 (이메일 전용 Thymeleaf 엔진)
- `EmailSender` 마커 인터페이스 생성
- `WelcomeEmailSender` @Service 생성 (`send` 구현)
- `welcome.html` Thymeleaf 템플릿 생성
- `application-core.yml`에 `platform.email` 기본값 추가

### 생성/수정 파일

```
common/core/build.gradle                                            (수정)
common/core/src/main/resources/application-core.yml                (수정)
common/core/src/main/java/com/platform/common/core/email/
├── EmailSender.java                                                (신규)
├── WelcomeEmailSender.java                                         (신규)
└── config/
    ├── EmailConfig.java                                            (신규)
    └── EmailProperties.java                                        (신규)
common/core/src/main/resources/templates/email/
└── welcome.html                                                    (신규)
```

### Acceptance Criteria

- [x] Given JavaMailSender Mock, When `send("to@test.com", "홍길동")` 호출, Then `mailSender.send(MimeMessage)` 1회 호출됨
- [x] Given 유효한 수신자 이메일과 사용자명, When `send` 호출, Then MimeMessage의 subject가 "가입을 축하합니다!" 포함
- [x] Given Thymeleaf 템플릿, When `send` 호출, Then MimeMessage body에 `userName` 값이 렌더링됨
- [x] Given `to`가 null 또는 blank, When `send` 호출, Then `IllegalArgumentException` 발생
- [x] Given `userName`이 null 또는 blank, When `send` 호출, Then `IllegalArgumentException` 발생

### 테스트 레이어

| 레이어 | 어노테이션 | Mock 대상 |
|--------|-----------|---------|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | `JavaMailSender` (`@Mock`), `SpringTemplateEngine` (`@Mock`, `"emailTemplateEngine"` qualifier) |

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] `WelcomeEmailSender.send` — should invoke `mailSender.send(MimeMessage)` once when valid `to` and `userName` given
- [x] [정상] `WelcomeEmailSender.send` — should set MimeMessage subject containing "가입을 축하합니다!" when valid `to` and `userName` given
- [x] [정상] `WelcomeEmailSender.send` — should render `userName` value in MimeMessage body when Thymeleaf template processed
- [x] [예외] `WelcomeEmailSender.send` — should throw `IllegalArgumentException` when `to` is null
- [x] [예외] `WelcomeEmailSender.send` — should throw `IllegalArgumentException` when `to` is blank
- [x] [예외] `WelcomeEmailSender.send` — should throw `IllegalArgumentException` when `userName` is null
- [x] [예외] `WelcomeEmailSender.send` — should throw `IllegalArgumentException` when `userName` is blank

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| `mailSender.send(MimeMessage)` 1회 호출 | [정상] should invoke `mailSender.send(MimeMessage)` once |
| MimeMessage subject에 "가입을 축하합니다!" 포함 | [정상] should set subject containing "가입을 축하합니다!" |
| MimeMessage body에 `userName` 렌더링 | [정상] should render `userName` in MimeMessage body |
| `to` null/blank → `IllegalArgumentException` | [예외] should throw when `to` is null, [예외] should throw when `to` is blank |
| `userName` null/blank → `IllegalArgumentException` | [예외] should throw when `userName` is null, [예외] should throw when `userName` is blank |

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
- [x] RuntimeException → EmailSendException 교체 — WelcomeEmailSender.java:66
  (EmailSendException extends RuntimeException 신규 클래스 생성, 호출부에서 원인별 catch 가능)

### 무시 가능
없음

### 클린 기준 충족
- [x] ./gradlew :common-core:build -x test: 컴파일 오류 0건
- [x] ./gradlew :common-core:test: 7/7 전체 통과
