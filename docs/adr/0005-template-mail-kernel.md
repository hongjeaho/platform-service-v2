# ADR-0005: 템플릿 메일 kernel 분리 — 도메인 문구·템플릿의 도메인 소유

- **상태(Status)**: 수락됨(Accepted)
- **날짜**: 2026-07-16
- **컨텍스트**: 메일 / 발판(base) 리포 모델
- **개정**: [ADR-0001](0001-otp-purpose-scoping.md) 5항(OtpTemplate의 common/core 잔류)을 대체한다

## 배경(Context)

아키텍처 검토(candidate 3)에서 common-core의 메일 기계를 조사한 결과:

1. **회원 도메인 presentation이 kernel jar에** — "인증 코드"·"가입을 축하합니다!" 제목과 Thymeleaf 템플릿이 common-core에 하드코딩. 발판에서 분기한 모든 시스템이 회원 가입 메일 문구를 상속한다.
2. **실버그** — `OtpTemplate.SIGNUP`이 가리키는 `signup-verification.html`이 리포에 존재하지 않는다. `OtpEmailSender.send`가 `@Async`라 렌더 실패 예외가 비동기 스레드에 삼켜져, **회원가입 OTP 메일이 조용히 발송되지 않는다**. `OtpTemplateTest`는 enum 문자열만 검증해 이 구멍이 보이지 않았다 — interface(템플릿 이름)와 implementation(파일)이 다른 모듈에 있어 생긴 locality 부재의 실증.
3. **dead code** — `WelcomeEmailSender`·`PasswordChangeEmailSender`는 호출자 0. `EmailSender`는 메서드 0개의 빈 marker interface. 셋 다 deletion test 탈락.
4. **중복** — 세 sender가 MIME 조립·from·UTF-8 제목·렌더·예외 래핑 코드를 80% 공유.

ADR-0001 5항은 의존성 방향(common ← api 역전 금지)을 지키기 위해 `OtpTemplate`을 common/core에 남겼다. 그러나 발판-분기 모델(CLAUDE.md)에서는 분기 리포 N개가 전부 이 도메인 문구를 kernel에 물려받는다 — 재검토 사유가 충분하다. 해법은 역전이 아니라 **generic 메일 module + 도메인 소유 템플릿**이다.

## 결정(Decision)

1. **`TemplateMailSender` kernel 도입** (common-core `email` 패키지) — interface는 `send(to, subject, templateName, model)` 하나. MIME 조립·from/fromName·UTF-8 제목·Thymeleaf 렌더·`EmailSendException` 래핑을 전부 implementation에 숨긴다. **동기(synchronous)** — 비동기는 호출자 정책이다.
2. **`@Async`는 도메인 adapter가 소유** — "메일은 비동기, 예외는 삼켜짐"을 kernel에 박지 않는다(바로 그 조합이 2번 버그를 조용하게 만들었다).
3. **`OtpEmailSender`·`OtpTemplate`을 회원 도메인(api-platform users)으로 이사** — 제목·템플릿 매핑·`@Async`를 소유하는 얇은 adapter. 시그니처를 유지해 `OtpService`는 import 교체 외 무변경.
4. **가입 축하 메일은 도메인에서 재작성하고 회원가입 완료 flow에 배선한다** — 호출자 없는 재작성은 cruft의 재생산이므로, `UsersService` 가입 완료 시 발송(신규 동작, Red 선행)까지 포함한다.
5. **dead code 삭제** — `PasswordChangeEmailSender`(OtpEmailSender와 기능 중복), `EmailSender` marker, 각각의 테스트.
6. **템플릿 파일은 도메인이 소유** — `api/platform/src/main/resources/templates/email/`로 이동. `signup-verification.html`을 신설해 2번 버그를 수정한다(렌더링 테스트 Red 선행).

### 테스트 seam (사전 합의)

| seam | 방식 |
|---|---|
| kernel `TemplateMailSender` | mock `JavaMailSender` + 실제 `emailTemplateEngine` + **테스트 전용 템플릿** — 렌더 결과의 MIME 적재, from/to/제목, blank 거부, 예외 래핑. 도메인 템플릿 비의존 |
| 도메인 `OtpEmailSender` | kernel mock — "인증 코드" 제목·템플릿 매핑 |
| 도메인 `WelcomeEmailSender` | kernel mock — "가입을 축하합니다!" 제목·`welcome` 템플릿 |
| 템플릿 렌더링 (api-platform) | 실제 `emailTemplateEngine`으로 3개 템플릿 전부 렌더 — `signup-verification`은 Red 선행 버그픽스. 템플릿 누락 계열의 상시 방지선 |
| `UsersService` 가입 배선 | `@Mock WelcomeEmailSender` — 가입 성공 시 발송 검증(Red 선행) |

## 결과(Consequences)

- **긍정**: kernel 메일 module이 domain-free — 분기 리포는 발송 기계만 상속하고 문구·템플릿은 각자 소유. signup OTP 메일 버그 수정 + 렌더링 테스트가 재발 방지선. 중복 3벌이 kernel 한 곳으로(locality). 가입 축하 메일이 실제 flow에 연결되어 존재 이유를 회복.
- **부정/비용**: 템플릿 렌더 실패는 여전히 `@Async` 뒤에서 발생할 수 있다 — 렌더링 테스트가 컴파일 타임 방지선이지만, 런타임 관측(비동기 예외 로깅/알림)은 이 ADR 범위 밖이다. `welcome` 메일이 가입 flow에 추가되므로 가입 트래픽만큼 SMTP 발송이 늘어난다.
- **ADR-0001과의 관계**: 1~4항(OtpPurpose·네임스페이스·검증 시그니처·사전조건 소유)은 그대로 유효하다. 5항만 이 ADR로 대체된다.
