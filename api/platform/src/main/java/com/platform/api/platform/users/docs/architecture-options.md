# 아키텍처 3안 제안 & 비교

## 안 A: 단순 RedisTemplate + OtpService 분리 + @Async 직접 적용

### 구조
```
PublicUsersController
├── POST /send-otp → UsersService.sendOtp() → OtpService.generateAndSave() + PasswordChangeEmailSender.send() @Async
└── POST /change-password → UsersService.changePasswordWithOtp() → OtpService.verify() + UsersRepository.updatePassword()
```

### 특징
- **Redis**: RedisTemplate 직접 사용 (String type, TTL 설정)
- **OtpService**: 독립 @Service, 재사용 가능성 고려
- **비동기**: PasswordChangeEmailSender.send()에 @Async 추가
- **DTO**: SendOtpRequest, ChangePasswordWithOtpRequest (기존 ChangePasswordBeforeLoginRequest 대체)

### 8기준 비교

| # | 기준 | 안 A |
|---|------|------|
| 1 | 도메인 모델/DB 스키마 | UsersEntity 기존 활용, 스키마 변경 없음 |
| 2 | REST API 설계 | `/send-otp`, `/change-password` (기존 대체), DTO 신규 |
| 3 | Service/Helper 분리 | OtpService(@Service) 분리, UsersService 기존 유지 |
| 4 | DB 접근 전략 | JOOQ 기존 UsersRepository 재사용 |
| 5 | 트랜잭션 경계 | @PlatformTransactional 없음 (읽기 전용 조회 + 캐시 활용) |
| 6 | 캐시 전략 | Redis 신규, TTL 30분, RedisTemplate 직접 사용 |
| 7 | 테스트 용이성 | OtpService 단위 테스트 가능 (Mock RedisTemplate) |
| 8 | 구현 복잡도/공수 | Redis 의존성 추가 + 설정 + OtpService 구현 (중간) |

---

## 안 B: Spring Data Redis Repository + OtpService 분리 + Spring Event

### 구조
```
PublicUsersController
├── POST /send-otp → UsersService.sendOtp() → OtpService.generate() + OtpRepository.save() + OtpSentEvent 발행
└── POST /change-password → UsersService.changePasswordWithOtp() → OtpService.verify() + UsersRepository.updatePassword()

EventListener → PasswordChangeEmailSender.send()
```

### 특징
- **Redis**: Spring Data Redis @RedisHash Entity 사용, 자동 직렬화
- **OtpService**: 독립 @Service
- **비동기**: Spring Event (ApplicationEventPublisher) + @EventListener
- **DTO**: 안 A와 동일

### 8기준 비교

| # | 기준 | 안 B |
|---|------|------|
| 1 | 도메인 모델/DB 스키마 | OtpEntity 신규 (Redis Hash), UsersEntity 기존 |
| 2 | REST API 설계 | 안 A와 동일 |
| 3 | Service/Helper 분리 | 안 A와 동일 |
| 4 | DB 접근 전략 | JOOQ 기존 + Redis Repository 신규 |
| 5 | 트랜잭션 경계 | 안 A와 동일 |
| 6 | 캐시 전략 | Spring Data Redis Repository, 자동 TTL 지원 (annotated) |
| 7 | 테스트 용이성 | Repository 테스트 추가 필요 (Redis Embedded) |
| 8 | 구현 복잡도/공수 | Spring Data Redis 의존성 + Event 구조 (높음) |

---

## 안 C: Caffeine 로컬 캐시 (분산 미고려) + OtpHelper 추출 + @Async

### 구조
```
PublicUsersController
├── POST /send-otp → UsersService.sendOtp() → OtpHelper.generate() + Caffeine Cache + @Async 이메일
└── POST /change-password → UsersService.changePasswordWithOtp() → OtpHelper.verify() + UsersRepository.updatePassword()
```

### 특징
- **캐시**: 기존 Caffeine 확장 (분산 환경 미지원)
- **OtpHelper**: Helper 추출 (Repository 주입 금지 → RedisTemplate 직접 사용 불가, 캐시 한정)
- **비동기**: @Async
- **DTO**: 안 A와 동일

### 8기준 비교

| # | 기준 | 안 C |
|---|------|------|
| 1 | 도메인 모델/DB 스키마 | 안 A와 동일 |
| 2 | REST API 설계 | 안 A와 동일 |
| 3 | Service/Helper 분리 | OtpHelper 추출 (역할: Validator/Calculator 수준) |
| 4 | DB 접근 전략 | 안 A와 동일 |
| 5 | 트랜잭션 경계 | 안 A와 동일 |
| 6 | 캐시 전략 | 기존 Caffeine 확장, 분산 미지원, 단일 서버 한정 |
| 7 | 테스트 용이성 | 안 A와 동일 |
| 8 | 구현 복잡도/공수 | Redis 의존성 없음, 캐시 설정만 (낮음) |

---

## 추천 선택

**안 A**를 추천합니다.

**이유**:
1. **Redis**: RedisTemplate은 Spring Boot 표준 방식, 설정 간단, TTL 직관적
2. **OtpService**: 재사용 가능성(회원가입 등)을 위해 독립 Service가 적합
3. **비동기**: @Async 직접 적용이 Spring Event보다 간단, 규모가 작아서 충분
4. **공수**: 중간 수준, 기존 코드 최소 변경

**안 C 비추천 이유**: 분산 환경(여러 서버)에서 OTP 동기화 문제 발생 가능. Redis가 표준적인 OTP 저장소입니다.

**안 B 비추천 이유**: Spring Data Redis Repository는 복잡한 CRUD에 유리하지만, 단순 TTL 저장에는 과함. Event 구조는 현재 규모에 불필요한 추상화입니다.
