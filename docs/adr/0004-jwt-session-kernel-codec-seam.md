# ADR-0004: JWT 세션 kernel 분리 — TokenUserCodec seam 도입

- **상태(Status)**: 수락됨(Accepted)
- **날짜**: 2026-07-16
- **컨텍스트**: 인증 / 발판(base) 리포 모델

## 배경(Context)

이 리포는 발판(base) 리포다 — 새 시스템마다 독립 git 리포를 생성해 각자 성장시킨다(CLAUDE.md Project Overview). 그런데 아키텍처 검토에서 kernel이어야 할 common 모듈들이 회원 도메인의 concrete shape에 묶여 있음이 확인되었다:

1. **`AuthUser`(concrete DTO)가 common-core에** 살며, `JwtTokenUtil`·`JWTCheckFilter`(common-web)·`UserAccountHolder`가 전부 이 타입에 typed. 새 리포가 다른 principal(다른 계정 모델, OAuth 등)을 쓰려면 "공통" jar를 수술해야 한다.
2. **`SecurityConfig`(api-platform)는 `UserDetailsService` bean 없이 부팅 불가** — 회원 도메인을 지우면 컨텍스트가 죽는다. 인증 없는 시스템은 발판에서 출발할 수 없다.
3. **`AuthorityRepository`(datasource-platform)가 JOOQ record에서 `AuthUser`를 직접 조립** — 보안 관심사가 데이터 계층에 있다.
4. **검증 실패를 mutable `success` 플래그로 표현** — `AuthUser.builder().success(false)` 반환. 결과가 아닌 부수 상태.
5. **issuer `"platform.go.kr"` 하드코딩 + 검증 없음.** 발판 분기물들은 기본 `jwt.secret`을 상속하므로, 서로 다른 시스템의 local 토큰이 교차 유효하다 — ADR-0001이 OTP에서 잡은 교차 만족(cross-satisfaction) 결함과 같은 구조.
6. **갱신 판단이 서블릿 adapter에 용접** — ADR-0003이 "candidate 3, 범위 밖"으로 미뤄둔 문제.

## 결정(Decision)

1. **`JwtSessionManager` kernel 도입** (`common/core`의 새 패키지 `com.platform.common.core.jwt`). interface는 두 메서드:
   - `issue(UserDetails) → String` — 만료기간은 kernel 설정(`jwt.expiration.period`)이 소유. 호출자(`AuthService`)의 `@Value` 중복 제거.
   - `authenticate(token) → Optional<JwtSession>` — `JwtSession = (principal, Optional<갱신토큰>)` record. empty = 만료/위조/issuer 불일치. **슬라이딩 윈도우 갱신 판단(ADR-0003)을 kernel 안으로 흡수** — ADR-0003이 미뤄둔 candidate 3이 여기 편입된다. 갱신 동작과 설정 키(`jwt.expiration.renew-before`)는 불변.
2. **`TokenUserCodec` seam** — `toClaims(UserDetails)` / `fromClaims(Map)` 두 메서드의 도메인 제공 adapter. kernel은 principal의 shape를 모른다(Spring Security `UserDetails` 어휘만 사용). 회원 도메인이 첫 adapter로 현행 `"user"` claim 스키마를 그대로 재현한다. 테스트의 fake codec이 두 번째 adapter — seam이 hypothetical이 아닌 real이 된다.
3. **회원 principal의 이사** — `AuthUser`·`AuthRequest`·`BasicAuthority`·`UserAccountHolder`를 common-core에서 회원 도메인(api-platform)으로 이동. `success` 플래그와 `@Setter` 제거(불변 객체화).
4. **조립 책임 이동** — `AuthorityRepository`는 users/roles 조회 결과(row)만 반환하고, `AuthUser` 조립은 보안 adapter인 `UserDetailsServiceImpl`(api-platform) 한 곳에서 담당한다.
5. **조건부 활성화** — `JwtSessionManager`·`JWTCheckFilter`는 컴포넌트 스캔이 아니라 kernel `@Configuration`에서 `TokenUserCodec` bean이 존재할 때만 등록한다(스캔 순서에 민감하지 않도록 auto-configuration/명시적 `@Import`로). **codec bean = "이 시스템은 JWT 인증을 쓴다"는 선언.** codec이 없는 분기 리포는 JWT 스택 없이 부팅된다.
6. **issuer 설정화 + 검증** — `jwt.issuer`를 **기본값 없는 필수 프로퍼티**로 두고 각 시스템의 `api/*/application.yml`이 선언한다. `authenticate()`는 issuer를 검증한다 — 기본 secret을 상속한 분기물끼리 토큰이 교차 유효한 결함을 차단한다(ADR-0001과 같은 논리: 한 인스턴스의 증명이 다른 인스턴스를 만족하면 안 된다). 기본값을 주지 않는 이유: 기본값도 상속되면 검증이 무의미하다.

### 테스트 seam (사전 합의)

| seam | 방식 |
|---|---|
| `JwtSessionManager` interface | fake codec으로 순수 단위 테스트 — 발급→인증 roundtrip, 만료, 위조, issuer 불일치, 갱신 윈도우 |
| 회원 codec | `AuthUser ↔ claims` roundtrip (현행 스키마 보존 검증) |
| `UserDetailsServiceImpl` | row → `AuthUser` 조립 (`@Mock` repository) |

`JWTCheckFilter`는 직접 테스트하지 않는다 — 헤더 I/O + SecurityContext 등록만 남은 얇은 adapter이며, 기존 슬라이스/E2E가 커버한다.

## 결과(Consequences)

- **긍정**: kernel이 domain-free가 되어 분기 리포는 codec adapter 하나만 교체하면 자기 principal을 쓸 수 있고, 인증 없는 시스템도 부팅된다(발판의 deletion test 통과). 갱신 판단이 서블릿 없이 테스트 가능해지고, `verify`+`getExpirationDate`+`makeAuthToken` 세 메서드가 `authenticate` 하나로 줄어든다(interface 축소). issuer 검증으로 인스턴스 간 토큰 교차 만족이 차단된다.
- **부정/비용**: issuer 검증 도입으로 기존 발급 토큰이 무효화된다 — ADR-0001과 동일하게 local/dev 단계이므로 무시한다(운영 도입 시 cutover 고려). `jwt.issuer`가 모든 시스템의 필수 설정이 된다. `@ConditionalOnBean`은 등록 순서에 민감하므로 구현 시 auto-configuration 경로를 지켜야 한다.
- **범위 밖**: `OtpTemplate` 등 OTP 메일 기계의 common-core 잔류(ADR-0001 5항)는 이 ADR이 다루지 않는다 — 같은 검토의 별도 candidate로 진행한다. `SecurityConfig`의 `UserDetailsService` 요구는 도메인 adapter의 배선이므로 각 시스템 소관으로 남긴다.
