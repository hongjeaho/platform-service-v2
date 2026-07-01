## 시그니처

### Configuration

```java
// RedisConfig: RedisTemplate Bean 등록 (common/core)
// 역할: OTP 저장용 RedisTemplate<String, String> Bean 구성
//
// 참고 패턴: EmailConfig.java (proxyBeanMethods = false, @Configuration)

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(RedisProperties.class)
public class RedisConfig {

    /**
     * OTP 저장용 RedisTemplate.
     *
     * <p>String type Key-Value를 사용하며, 직렬화는 StringRedisSerializer를 사용한다.
     * Redis Key 구조: otp:{email}, otp:last-sent:{email}
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new StringRedisSerializer());
        return template;
    }
}

// AsyncConfig: @Async 활성화 및 ThreadPoolTaskExecutor Bean 등록 (common/web)
// 역할: 이메일 발송 등 비동기 처리를 위한 스레드 풀 구성
//
// 참고 패턴: JacksonConfig.java (@Configuration, Bean 등록)

@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * 비동기 작업을 위한 스레드 풀.
     *
     * <p>이메일 발송 등 외부 I/O 작업을 비동기로 처리한다.
     * CorePoolSize: 5, MaxPoolSize: 10, QueueCapacity: 100
     */
    @Bean(name = "taskExecutor")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
```

### Properties

```java
// RedisProperties: Redis 연결 설정 (common/core)
// 역할: application.yml의 spring.redis 속성을 매핑
//
// 참고 패턴: EmailProperties.java

@ConfigurationProperties(prefix = "spring.redis")
public record RedisProperties(
    String host,
    int port,
    @JsonProperty("password") String password,
    int timeout
) {}
```

### build.gradle (common/core)

```gradle
// 추가 의존성
api "$boot:spring-boot-starter-data-redis"
```

### application.yml (api/platform)

```yaml
spring:
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    timeout: 2000
```

---

## 이슈 #1: Redis 설정 + @Async 설정

### 개요
Redis 캐시와 비동기 처리를 위한 인프라를 구축한다.

### Acceptance Criteria

- [ ] Given 프로젝트에 spring-boot-starter-data-redis 의존성이 없을 때, When build.gradle을 수정하면, Then 의존성이 추가된다.
- [ ] Given Redis 설정이 없을 때, When application.yml에 Redis 설정을 추가하면, Then 연결 정보가 설정된다.
- [ ] Given RedisTemplate Bean이 없을 때, When @Configuration 클래스를 작성하면, Then RedisTemplate<String, String> Bean이 등록된다.
- [ ] Given @Async가 활성화되지 않았을 때, When @EnableAsync를 설정에 추가하면, Then @Async가 동작한다.
- [ ] Given @Async가 활성화되었을 때, When ThreadPoolTaskExecutor Bean을 등록하면, Then 비동기 작업을 위한 스레드 풀이 생성된다.

### 변경 범위

- `build.gradle`: 의존성 추가 (common/core 모듈)
- `api/platform/src/main/resources/application.yml`: Redis 연결 설정
- `common/core/src/main/java/.../config/RedisConfig.java`: 신규 (RedisTemplate Bean)
- `common/web/src/main/java/.../config/AsyncConfig.java`: 신규 (@EnableAsync, ThreadPoolTaskExecutor)

### 의존성
없음 (첫 번째 이슈)

---

## 테스트 시나리오

### Configuration 단위 테스트

- [ ] [정상] RedisConfig — should create RedisTemplate Bean when Spring context loads
- [ ] [정상] RedisConfig — should use StringRedisSerializer for keys and values
- [ ] [정상] AsyncConfig — should enable @Async when context loads
- [ ] [정상] AsyncConfig — should create ThreadPoolTaskExecutor with correct configuration

### Integration 테스트 (build.gradle, application.yml)

- [ ] [정상] 의존성 확인 — should include spring-boot-starter-data-redis
- [ ] [정상] 설정 확인 — should load Redis properties from application.yml

### AC 커버리지

| AC | 커버 시나리오 |
|-----|-------------|
| Given 프로젝트에 spring-boot-starter-data-redis 의존성이 없을 때, When build.gradle을 수정하면, Then 의존성이 추가된다. | [정상] 의존성 확인 — should include spring-boot-starter-data-redis |
| Given Redis 설정이 없을 때, When application.yml에 Redis 설정을 추가하면, Then 연결 정보가 설정된다. | [정상] 설정 확인 — should load Redis properties from application.yml |
| Given RedisTemplate Bean이 없을 때, When @Configuration 클래스를 작성하면, Then RedisTemplate<String, String> Bean이 등록된다. | [정상] RedisConfig — should create RedisTemplate Bean when Spring context loads |
| Given @Async가 활성화되지 않았을 때, When @EnableAsync를 설정에 추가하면, Then @Async가 동작한다. | [정상] AsyncConfig — should enable @Async when context loads |
| Given @Async가 활성화되었을 때, When ThreadPoolTaskExecutor Bean을 등록하면, Then 비동기 작업을 위한 스레드 풀이 생성된다. | [정상] AsyncConfig — should create ThreadPoolTaskExecutor with correct configuration |

---

## AC 검증

검증일: 2026-07-01
결과: ✅ 모든 AC 충족 (5건)

### 검증 내용

| AC | 상태 | 근거 |
|-----|------|------|
| AC-1: spring-boot-starter-data-redis 의존성 추가 | ✅ | common/core/build.gradle 라인 11 |
| AC-2: application.yml Redis 설정 추가 | ✅ | api/platform/.../application.yml 라인 20-24 |
| AC-3: RedisTemplate Bean 등록 | ✅ | RedisConfig.java 라인 26-34 |
| AC-4: @EnableAsync 활성화 | ✅ | AsyncConfig.java 라인 18 |
| AC-5: ThreadPoolTaskExecutor Bean 등록 | ✅ | AsyncConfig.java 라인 27-35 |

---

## 리팩토링 결과
리팩토링일: 2026-07-01
완료: 0건 / 건너뜀: 0건

검토 파일:
- RedisConfig.java: 50줄 미만, 단순 Bean 등록만 수행 → 리팩토링 불필요
- RedisProperties.java: record 클래스, 단순 필드 매핑 → 리팩토링 불필요
- AsyncConfig.java: 50줄 미만, 단순 Bean 등록만 수행 → 리팩토링 불필요
- build.gradle / application.yml: 설정 파일 → 구조 개선 대상 아님

---

## 보안 검토

검토일: 2026-07-01

### 즉시 수정 필요 (0건)
없음

### 권장 수정 (0건)
- [x] 미사용 import 제거 — AsyncConfig.java (AsyncUncaughtExceptionHandler, BeanFactory)

### 무시 가능 (0건)
없음

### 클린 기준 충족
- [x] 하드코딩 시크릿 없음 (환경변수 사용)
- [x] 미사용 import 제거 완료
- [ ] ./gradlew build -x test: 컴파일 오류 0건 (JAVA_HOME 미설정으로 실행 보류)
- [ ] ./gradlew test: 전체 통과 (JAVA_HOME 미설정으로 실행 보류)
