# CONTEXT — 도메인 용어집 (Domain Glossary)

비즈니스 도메인 언어(ubiquitous language). 기술 스택 용어(`@WebMvcTest`, JOOQ, Query key factory, CSS Module 등)는 여기가 아니라 `CLAUDE.md`를 참조한다.

> 단일 컨텍스트 구조. 독립 bounded context(`decision` 등)가 도래하면 `CONTEXT-MAP.md` + `docs/contexts/<name>/`로 이관 (`docs/agents/domain.md` 참조).

## Users (회원)

### 회원 / User
플랫폼에 가입한 사용자. `userId`(로그인 ID)·`userEmail`·암호화된 비밀번호를 가지며, 하나 이상의 역할(Role, 기본 `USER`)을 갖는다.

### OTP 인증 (이메일 인증)
이메일로 발송되는 6자리 일회성 코드. 수신자가 해당 이메일을 **통제함**을 증명한다. 코드는 Redis에 30분 TTL로 저장되고, 검증 성공 시 즉시 삭제된다. 동일 용도·이메일에 대해 10분 재발송 제한(throttle)이 있다.

### OtpPurpose (OTP 용도)
OTP가 **무엇을 증명하는지**를 나타내는 차원. 두 용도는 **서로 독립된 검증**이다 — 각각 별도의 Redis 네임스페이스(`otp:{purpose}:{email}`)와 별도의 재발송 throttle을 가지며, **서로 교차 만족할 수 없다**(한 용도로 발급된 코드가 다른 용도의 검증을 통과하지 못한다).

- **`SIGNUP`** — *미가입* 이메일이 도달 가능함을 증명. 회원가입 시 사용.
- **`PASSWORD_CHANGE`** — *가입된* 사용자가 해당 이메일을 통제함을 증명. 비밀번호 재설정(로그인 전) 시 사용.

> 용도별 사전조건(가입 필요 vs 미가입 필요)은 **OTP 기계가 아닌 호출자(회원 도메인)가 소유**한다. OTP 인증 메커니즘은 회원 가입 여부를 알지 않는다 — 이 결정의 근거는 [ADR-0001](docs/adr/0001-otp-purpose-scoping.md)에 기록되어 있다.

## 인증 (Authentication)

### JWT 세션
로그인 시 발급되는 JWT 하나로 유지되는 무상태 세션. 리프레시 토큰 없이, 인증된 요청마다 남은 유효시간이 임계값 미만이면 새 토큰을 응답 헤더로 실어 보내는 **슬라이딩 윈도우 방식**으로 연장된다([ADR-0003](docs/adr/0003-jwt-sliding-window-renewal.md)). 발급·검증·갱신 판단은 `JwtSessionManager`(common-core kernel)가 소유한다.

### TokenUserCodec
시스템의 인증 주체(principal)와 JWT claims 간 변환을 소유하는 **도메인 제공 adapter**. kernel은 principal의 shape를 모르며, codec bean의 존재 자체가 "이 시스템은 JWT 인증을 쓴다"는 선언이다 — codec이 없는 시스템은 JWT 스택 없이 부팅된다. 회원 도메인이 첫 adapter다([ADR-0004](docs/adr/0004-jwt-session-kernel-codec-seam.md)).
