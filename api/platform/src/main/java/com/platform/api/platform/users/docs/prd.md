# 비로그인 사용자 비밀번호 변경 고도화 PRD

## 개요
비로그인 사용자가 이메일 OTP 인증을 통해 본인 확인 후 비밀번호를 변경하는 기능이다.
기존 "현재 비밀번호 입력" 방식을 "OTP 이메일 인증" 방식으로 완전히 대체하여 보안을 강화한다.

**노출 엔드포인트**: `/api/public/users/send-otp` (POST), `/api/public/users/change-password` (POST)
**호출 주체**: 비로그인 사용자
**해결 비즈니스 문제**: 현재 비밀번호를 잊어버린 사용자가 본인 확인 후 비밀번호를 재설정할 수 있도록 한다.

## 사용자 스토리
- As a 비로그인 사용자, I want 이메일로 OTP를 받아서, so that 비밀번호를 잊어버려도 본인 확인 후 비밀번호를 변경할 수 있다.
- As a 비로그인 사용자, I want OTP를 입력하고 새 비밀번호를 설정해서, so that 안전하게 비밀번호를 재설정할 수 있다.

## API 명세
> API 변경 시 프론트엔드 `pnpm orval` 재실행 필요.

| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/users/send-otp | 불필요 | SendOtpRequest | SendOtpResponse |
| POST | /api/public/users/change-password | 불필요 | ChangePasswordWithOtpRequest | ChangePasswordResponse |

### DTO 명세

#### SendOtpRequest
```java
record SendOtpRequest(
    @NotBlank @Email String userEmail
)
```

#### SendOtpResponse
```java
record SendOtpResponse(
    String message
)
```

#### ChangePasswordWithOtpRequest
```java
record ChangePasswordWithOtpRequest(
    @NotBlank @Email String userEmail,
    @NotBlank @Size(min=6, max=6) String otpCode,
    @NotBlank @Size(min=8, max=12) String newPassword
)
```

#### ChangePasswordResponse
```java
record ChangePasswordResponse(
    String message
)
```

## 백엔드 아키텍처 준수 계획

**영역 범위**: `api/platform` (Controller·Service·DTO·Helper) + `datasource/platform` (Repository)

**Service/Helper 분리**:
| Service/Helper 클래스 | 역할 | 추출 이유 |
|---------------------|------|---------|
| UsersService | 비밀번호 변경 UseCase 조율 | 기존 유지 |
| OtpService | OTP 생성·저장·검증, 재발송 간격 확인 | 재사용 가능성(회원가입 등)을 위해 분리 |

**Helper**: Service 200줄 초과 or private 5개 이상 → 추출. Repository 주입·트랜잭션 금지.
| Helper 클래스 | 역할 접미사 | 추출 이유 |
|-------------|-----------|---------|
| — | Validator / Calculator / Converter | — |

**예외**: Controller try-catch 금지. `IllegalArgumentException`(400) / `IllegalStateException`(409).

**캐시**: Redis 신규 도입. OTP 저장(TTL 30분), 재발송 간격 확인(10분).
```java
// Redis Key 구조: otp:{email}, otp:last-sent:{email}
// TTL: 30분
```

**DB**: JOOQ 기존 사용. UsersRepository 기존 메서드 재사용(`findByUserEmail`, `updatePassword`). 스키마 변경 없음.

**비동기 처리**: 이메일 발송은 `@Async`로 비동기 처리. 응답 시간 3초 이내.

## 기술 결정

### Redis 도입 방식: RedisTemplate 직접 사용

**Context**
- OTP를 30분 TTL로 저장해야 한다.
- 재발송 간격(10분) 확인을 위해 별도 키를 저장해야 한다.
- 분산 환경에서 여러 서버가 OTP에 접근 가능해야 한다.

**Decision**
- `RedisTemplate<String, String>`을 직접 사용하여 String type으로 OTP를 저장한다.
- TTL은 `redisTemplate.expire(key, 30, TimeUnit.MINUTES)`로 설정한다.
- 재발송 간격 확인은 별도 키 `otp:last-sent:{email}`로 저장한다.

**Alternatives**
- **Spring Data Redis Repository (@RedisHash)**: 거부. 복잡한 Entity 구조와 자동 직렬화/역직렬화 오버헤드가 있으며, 단순 TTL 저장에는 과도한 추상화다.
- **Caffeine 로컬 캐시**: 거부. 분산 환경에서 여러 서버 간 OTP 동기화가 불가능하다. 로드밸런서 뒤에 여러 인스턴스가 있을 경우 동일 이메일로 다른 인스턴스에 요청이 갈 수 있다.

**Consequences**
- **장점**: Spring Boot 표준 방식, 설정 간단, TTL 직관적, 분산 환경 지원
- **단점**: Redis 의존성 추가 필요, Redis 인프라 구성 필요
- **영향**: build.gradle에 spring-boot-starter-data-redis 의존성 추가, application.yml에 Redis 설정 추가

### OtpService 분리: 독립 @Service

**Context**
- OTP 생성·저장·검증 로직은 재사용 가능성이 높다 (회원가입, 휴대폰 인증 등).
- 비즈니스 로직이 UsersService에 추가되면 SRP를 침해할 수 있다.

**Decision**
- `OtpService`를 독립 `@Service`로 분리한다.
- `RedisTemplate`을 주입받아 OTP 관련 로직을 책임진다.
- 주요 메서드: `generateAndSave()`, `verify()`, `checkResendInterval()`.

**Alternatives**
- **Helper 추출 (OtpHelper)**: 거부. Helper는 Repository 주입이 금지되어 있어 RedisTemplate을 사용할 수 없다. 또한 Helper는 무상태 유틸리티 역할에 적합하고, OtpService는 상태(Redis)를 다루므로 Service가 적합하다.
- **UsersService 내부 private 메서드**: 거부. 재사용 가능성이 있고 복잡도가 증가할 경우 SRP 위반이다.

**Consequences**
- **장점**: 재사용 가능성, 단일 책임, 테스트 용이성 (Mock RedisTemplate)
- **단점**: 클래스 1개 추가
- **영향**: 없음

### 비동기 이메일 발송: @Async 직접 적용

**Context**
- 이메일 발송은 외자 I/O 작업으로 응답 시간에 영향을 준다.
- 요구사항: 응답 시간 3초 이내.

**Decision**
- `PasswordChangeEmailSender.send()` 메서드에 `@Async`를 추가한다.
- `@EnableAsync`를 설정 클래스에 추가한다.
- ThreadPoolTaskExecutor로 별도 스레드 풀 구성.

**Alternatives**
- **Spring Event (ApplicationEventPublisher)**: 거부. 현재 규모에서는 불필요한 추상화다. Event 구조는 여러 Subscriber가 있거나 복잡한 비동기 흐름에 적합하다. 단일 이메일 발송에는 @Async가 더 간단하다.
- **동기 처리**: 거부. 응답 시간 3초 요구사항을 충족할 수 없다. 이메일 발송은 수초~수십초가 소요될 수 있다.

**Consequences**
- **장점**: 간단한 구현, 명확한 비동기 처리, 응답 시간 단축
- **단점**: 스레드 풀 관리 필요, 실패 시 재시도 로직 별도 필요
- **영향**: AsyncConfig 설정 클래스 추가, PasswordChangeEmailSender 메서드 수정

### API 대체: 기존 /change-password를 OTP 방식으로 완전히 대체

**Context**
- 기존 `/api/public/users/change-password`는 `currentPassword`를 받는다.
- 요구사항: OTP 방식으로 변경.

**Decision**
- 기존 API를 완전히 대체한다. (Breaking Change)
- `ChangePasswordBeforeLoginRequest`를 `ChangePasswordWithOtpRequest`로 변경한다.
- 기존 `currentPassword` 필드를 제거하고 `otpCode` 필드를 추가한다.

**Alternatives**
- **신규 엔드포인트 추가**: 거부. 중복 API 관리 부담이 증가한다. "비밀번호 변경"은 하나의 UseCase이므로 하나의 엔드포인트가 적합하다.
- **기존 유지 + 신규 추가**: 거부. 위와 동일.

**Consequences**
- **장점**: API 단일화, 관리 용이성
- **단점**: Breaking Change, 프론트엔드 수정 필요 (pnpm orval 재실행)
- **영향**: DTO 변경, UsersService 메서드 시그니처 변경, 프론트엔드 Orval 재생성

## Out of Scope

이번 고도화에서 **하지 않는 것**:

1. **SMS OTP 지원**
   - 이메일 OTP만 구현한다.
   - 향후 휴대폰 인증이 필요한 경우 별도 이슈로 다룬다.

2. **OTP 검증 횟수 제한**
   - OTP 불일치 시 재시도 횟수 제한을 두지 않는다.
   - TTL 30분으로 자동 만료되므로 충분하다 판단한다.
   - 보안 강화가 필요한 경우 별도 이슈로 다룬다.

3. **관리자 기능**
   - 관리자가 사용자 비밀번호를 강제 초기화하는 기능은 다루지 않는다.
   - 일반 사용자 셀프 서비스에만 집중한다.

4. **비밀번호 정책 변경**
   - 비밀번호 복잡도(특수문자 포함 등), 주기 변경 등의 정책은 다루지 않는다.
   - 기존 8~12자리 길이 검증 유지한다.

5. **로그인된 사용자 비밀번호 변경 API 수정**
   - `/api/users/change-password` (로그인 후)는 건드리지 않는다.
   - 비로그인 사용자(`/api/public/users`)에만 집중한다.

6. **Redis HA (High Availability) 구성**
   - Redis Sentinel/Cluster 구성은 다루지 않는다.
   - 단일 Redis 인스턴스로 충분하다 가정한다.

7. **이메일 템플릿 수정**
   - 기존 `password-change-verification` 템플릿을 그대로 사용한다.
   - 템플릿 내용 변경은 별도 이슈로 다룬다.

8. **OTP 길이/형식 변경**
   - 6자리 숫자로 고정한다.
   - 영문 혼합 등 복잡한 형식은 다루지 않는다.

## 용어 정의

| 용어 | 설명 | 코드 네이밍 |
|------|------|------------|
| OTP | One-Time Password, 6자리 숫자, 30분 유효 | `otpCode`, `otp` |
| 이메일 발송 | PasswordChangeEmailSender.send() 사용 | `PasswordChangeEmailSender` |
| Redis 캐시 | OTP 저장용, TTL 30분, 재발송 10분 제한 | `RedisTemplate`, `@Cacheable` |
| 비밀번호 변경 | UsersRepository.updatePassword() 사용 | `changePasswordBeforeLogin` |
| 사용자 | UsersEntity, 이메일로 식별 | `UsersEntity`, `userEmail` |
