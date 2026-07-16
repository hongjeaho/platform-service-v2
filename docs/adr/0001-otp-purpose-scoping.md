# ADR-0001: OTP 용도 스코핑(purpose-scoping)과 사전조건의 소유

- **상태(Status)**: 수락됨(Accepted)
- **날짜**: 2026-07-06
- **컨텍스트**: Users / OTP 인증

## 배경(Context)

OTP 인증은 두 용도로 쓰인다 — 회원가입(`SIGNUP`, 미가입 이메일의 도달 가능성 증명)과 비밀번호 재설정(`PASSWORD_CHANGE`, 가입된 사용자가 해당 이메일을 통제함을 증명). 기존 구조는 두 가지 문제가 있었다.

1. **교차 만족(cross-satisfaction) 결함** — Redis 키가 `otp:{email}` 단일이고 `verify`가 용도를 몰랐다. 한 용도로 발급된 코드가 다른 용도의 검증을 통과할 수 있었다(예: 회원가입용 OTP 코드로 비밀번호 재설정 검증 통과, 그 반대도 가능).
2. **사전조건 소유의 비대칭** — 용도별 사전조건(가입 필요 vs 미가입 필요)이 OTP 발급 코드에 섞여 있었다. `PASSWORD_CHANGE` 발급은 `OtpService` 내부에서 `existsByEmail`을 검사했고, `SIGNUP` 발급은 `UsersService`에서 미가입을 검사한 뒤 `OtpService`에 위임했다. 같은 "사전조건" 개념이 두 계층에 흩어져 있었다.

## 결정(Decision)

1. **`OtpPurpose` 차원 도입** — `SIGNUP`, `PASSWORD_CHANGE` 두 용도를 명시적 enum(`com.platform.api.platform.users.type.OtpPurpose`)으로 모델링한다.
2. **용도별 독립 Redis 네임스페이스** — 키를 `otp:{purpose}:{email}`, 재발송 throttle 키를 `otp:last-sent:{purpose}:{email}` 로 둔다. 각 용도는 별도 네임스페이스와 별도 throttle을 가진다 → **교차 만족 불가**.
3. **검증 시 용도 명시** — `OtpService.verify(email, code, purpose)` 로 시그니처를 변경한다. 한 용도로 발급된 코드는 다른 용도 검증을 통과하지 못한다.
4. **OTP 기계는 회원 가입 여부를 모른다** — `OtpService`(`issue`/`verify`)에서 `UsersRepository` 의존성과 `existsByEmail` 사전조건을 제거한다. 사전조건(가입 필요/미가입 필요)은 **호출자인 회원 도메인(`UsersService`)**이 소유한다:
   - `UsersService.sendSignupOtp(email)` — 미가입 확인 후 `issue(email, SIGNUP)`
   - `UsersService.sendPasswordChangeOtp(email)` — 가입 확인 후 `issue(email, PASSWORD_CHANGE)`
5. **presentation 분리 유지** — `OtpTemplate`(common/core, Thymeleaf 템플릿명)은 도메인 enum으로 대체하지 않고 共存한다. `OtpPurpose → OtpTemplate` 매핑은 `OtpService` 내부 한 곳에 두어 의존성 방향(common ← api 역전 금지)을 보존한다.
   > **개정(2026-07-16)**: 이 항은 [ADR-0005](0005-template-mail-kernel.md)로 대체되었다 — 발판-분기 모델에서 도메인 문구·템플릿이 common에 남는 비용이 커져, `OtpTemplate`과 템플릿 파일은 회원 도메인(api-platform)이 소유하고 common-core에는 generic `TemplateMailSender` kernel만 남긴다. 1~4항은 그대로 유효하다.

## 결과(Consequences)

- **긍정**: 교차 만족 결함 제거(보안 강화). 사전조건이 한 계층(호출자)에 집중되어 OTP 머신은 순수 발급/검증만 담당 → 재사용성·테스트 용이성 향상. 새 용도(예: 이메일 변경 확인) 추가 시 `OtpPurpose` 값 + 호출자 사전조건 메서드만 추가하면 된다.
- **부정/비용**: Redis 키 포맷이 `otp:{email}` → `otp:{purpose}:{email}` 로 변경 — 마이그레이션이 필요하다. 단, 이 ADR 시점에는 local/dev 단계이며 운영 데이터가 없으므로 무시한다. 운영 도입 시점에는 키 마이그레이션 또는 단절(cutover)을 고려해야 한다.
- **호출자 의무**: OTP 발급/검증을 쓰려면 반드시 용도를 명시해야 한다. 용도 없는 발급/검증은 허용하지 않는다(컴파일 타임 보장).
