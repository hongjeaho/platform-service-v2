# 공통 이메일 발송 기능 PRD

## 개요

`common/core`에 `EmailService` 빈을 제공한다.
`api/platform` 등 의존 모듈의 Service가 이 빈을 주입해 회원가입 축하 메일과 비밀번호 변경 OTP 인증 메일을 동기 발송할 수 있다.

## 사용자 스토리

- As a `api/platform UsersService`, I want to call `emailService.sendWelcomeEmail(to, userName)`, so that 회원가입 완료 후 사용자에게 축하 이메일을 발송할 수 있다
- As a `api/platform UsersService`, I want to call `emailService.sendPasswordChangeVerification(to, otpCode)`, so that 비밀번호 변경 요청 시 OTP 코드가 담긴 인증 이메일을 발송할 수 있다

## API 명세 (EmailService 인터페이스)

```java
public interface EmailService {
    /**
     * 회원가입 축하 이메일을 발송한다.
     *
     * @param to       수신자 이메일 주소
     * @param userName 수신자 이름
     * @throws IllegalArgumentException to 또는 userName이 null/blank인 경우
     */
    void sendWelcomeEmail(String to, String userName);

    /**
     * 비밀번호 변경 OTP 인증 이메일을 발송한다.
     *
     * @param to      수신자 이메일 주소
     * @param otpCode 6자리 OTP 인증 코드
     * @throws IllegalArgumentException to 또는 otpCode가 null/blank인 경우
     */
    void sendPasswordChangeVerification(String to, String otpCode);
}
```

## 백엔드 아키텍처 준수 계획

**영향 범위**: `common/core` (EmailService, EmailServiceImpl, EmailConfig, EmailProperties, Thymeleaf 템플릿)

**Helper**: 없음 — 로직이 단순하여 Service 단독 처리

**예외**: `IllegalArgumentException` (null/blank 입력 시 400)

**캐시**: 없음 — 이메일 발송은 stateless 동기 I/O, 캐싱 대상 아님

**DB**: 없음 — 템플릿은 `classpath:/templates/email/` resources 방식

## 기술 결정

### 이메일 전용 Thymeleaf 엔진 분리

**Context**: `spring-boot-starter-thymeleaf` 추가 시 Spring Boot가 전역 `SpringTemplateEngine`을 자동 등록함. 웹 MVC 뷰 렌더링과 동일 엔진을 공유하면 향후 `ThymeleafViewResolver` 설정이 이메일 템플릿 경로를 오염시킬 수 있음.

**Decision**: `EmailConfig`에서 `@Bean("emailTemplateEngine")`으로 이메일 전용 `SpringTemplateEngine`을 별도 구성. `ClassLoaderTemplateResolver`가 `templates/email/` 경로만 탐색.

**Alternatives**:
- 전역 엔진 공유: 간단하지만 템플릿 경로 충돌 위험 → 거부
- `thymeleaf-spring6` 직접 사용 (starter 미사용): 자동 구성 이점 포기 → 거부

**Consequences**:
- 장점: 웹 뷰 엔진과 완전 격리, 이메일 템플릿 경로 명확
- 단점: `@Qualifier("emailTemplateEngine")` 주입 필요, 클래스 하나 추가

### 발신자 설정 분리 (EmailProperties)

**Context**: `spring.mail.username`을 그대로 발신 주소로 쓰면 `Platform <noreply@platform.com>` 형태의 표시 이름 설정 불가.

**Decision**: `@ConfigurationProperties("platform.email")` record로 `from`, `fromName` 관리. `application-core.yml`에 환경 변수 기반 기본값 제공.

**Alternatives**:
- `@Value` 개별 주입: 타입 안전성 없음 → 거부

**Consequences**:
- 장점: 타입 안전, 환경 변수로 오버라이드 가능, 테스트 용이
- 단점: `@EnableConfigurationProperties(EmailProperties.class)` 또는 `@ConfigurationPropertiesScan` 필요

### 템플릿 방식: resources (classpath)

**Context**: `common/core`는 `datasource-platform` 의존 없음 → DB 직접 접근 불가. 초기 템플릿 2개는 비즈니스 로직과 함께 변경되는 정적 자산.

**Decision**: `ClassLoaderTemplateResolver`로 `classpath:/templates/email/` 탐색.

**Alternatives**:
- DB 저장 + Repository: 모듈 경계 위반 (datasource 의존 불가) → 거부
- DB 내용을 파라미터로 주입: 향후 확장 시 고려 가능, 현재는 과도한 복잡도 → 거부

**Consequences**:
- 장점: 의존성 없음, classpath 캐싱으로 빠름, Git으로 이력 관리
- 단점: 템플릿 변경 시 배포 필요

## Out of Scope

- OTP 코드 생성, Redis 저장, 만료 검증 (api/platform users 도메인 담당)
- 이메일 발송 실패 재시도 (retry)
- 비동기 발송 (@Async)
- 이메일 발송 이력 DB 저장
- 첨부파일 지원
- 관리자 이메일 템플릿 편집 기능
- HTML 이외 plain text 발송

## 용어 정의

spec-fixed.md 참조.
