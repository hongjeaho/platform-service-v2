# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

본 프로젝트는 Java 21과 Spring Boot 3 기반으로 구축된 백엔드 애플리케이션입니다.
유지보수성과 확장성, 그리고 안정적인 데이터 처리 구조를 목표로 설계되었습니다.

- **Runtime**: Java 21, Spring Boot 3.4.2 (WebFlux 제외, 일반 MVC)
- **DB**: MySQL 8, JOOQ 3.19 (기본), MyBatis (복잡 동적 쿼리), Flyway (마이그레이션)
- **인프라**: HikariCP, Caffeine 캐시, Spring Security (JWT Stateless)
- **Build**: Gradle 8
- **의존 모듈**: `common/core`, `common/web`, `common/jooq`, `datasource/platform`

# Backend

`api/platform` 모듈 개발 규칙 및 명령어 가이드.

## Backend Commands

```bash
# 빌드
./gradlew :api:platform:build -x test

# 실행 (local 프로파일)
./gradlew :api:platform:bootRun --args='--spring.profiles.active=local'

# 테스트
./gradlew :api:platform:test

# JOOQ 코드 재생성 (스키마 변경 후 필수)
./gradlew :datasource:platform:generateJooq

# 헬스체크
GET /public/platform/actuator/health
GET /public/swagger-ui/index.html
```

## 아키텍처: 도메인 중심 단일 구조

모든 도메인은 **동일한 패키지 구조**를 따릅니다.
CRUD가 단순하든 비즈니스 규칙이 복잡하든 구조가 바뀌지 않습니다.
복잡도는 파일 수로 흡수하고, 폴더 구조는 항상 일정합니다.

```
com.platform.api.platform.
└── {domain}/
    ├── controller/
    │   └── {Domain}Controller.java              # HTTP 계층 (필수)
    ├── service/
    │   ├── {Domain}Service.java                 # 비즈니스 오케스트레이션 (필수)
    │   └── helper/                              # 헬퍼 컴포넌트 (선택, 복잡할 때만)
    │       └── {Domain}{Description}{Role}.java
    ├── dto/
    │   ├── {Domain}Request.java                 # 요청 DTO (필수)
    │   └── {Domain}Response.java                # 응답 DTO (필수)
    └── type/
        └── {Domain}StatusType.java              # 도메인 전용 Enum (선택)
```

### 계층별 책임

| 계층 | 어노테이션 | 책임 | 금지 사항 |
|---|---|---|---|
| Controller | `@RestController` | HTTP 수신, `@Valid` 검증, 응답 래핑 | 비즈니스 로직 |
| Service | `@Service` | 비즈니스 로직, 트랜잭션 단위, UseCase 오케스트레이션 | 직접 HTTP/JSON 처리 |
| Helper | `@Component` | Service에서 추출한 단일 책임 규칙 | 트랜잭션 시작, DB 직접 접근 |
| DTO | — | 계층 간 데이터 전달 | 비즈니스 로직 |

### 헬퍼 컴포넌트 (`service/helper/`)

#### 추출 기준

- Service가 200줄을 초과하거나 private 메서드가 5개 이상 생길 때
- 동일한 로직이 2개 이상의 Service에서 반복될 때
- 독립적으로 단위 테스트해야 하는 계산·검증 로직

추출하지 않는 것:
- 2–3줄짜리 단순 변환 → Service private 메서드로 충분
- DB 접근이 포함된 로직 → Service에서 Repository 직접 호출

#### 역할 접미사 (Role Suffix) — 필수 준수

클래스 이름은 `{Domain}{Description}{Role}` 형식으로 지어 역할을 즉시 파악할 수 있게 합니다.

| 접미사 | 역할 | 예시 |
|---|---|---|
| `Validator` | 비즈니스 규칙 검증, 상태 전이 가능 여부 확인 | `CaseStatusValidator` |
| `Calculator` | 금액·기간·수량 계산 | `CasePriceCalculator` |
| `Converter` | 도메인 객체 ↔ DTO 변환, 코드 매핑 | `CaseStatusConverter` |
| `Sender` | 알림·이메일·SMS 발송 | `CaseNotificationSender` |
| `Builder` | 복잡한 객체 조립 (여러 소스 조합) | `CaseDocumentBuilder` |
| `Processor` | 단계적 처리 흐름 실행 | `CaseApprovalProcessor` |

> ⚠️ `Reader`는 Helper가 아닌 **Service 레이어** 컴포넌트로 분류한다.
> 여러 Repository를 조합하는 복합 조회가 필요하면 `{Domain}Reader`를 `@Service`로 선언하고
> `@PlatformTransactional(readOnly = true)`를 적용한다.
> Helper 규칙(Repository 주입 금지, 트랜잭션 금지)이 적용되지 않는다.
>
> ```java
> @Service
> @RequiredArgsConstructor
> public class CaseSummaryReader {
>     private final CaseRepository caseRepository;
>     private final UserRepository userRepository;
>
>     @PlatformTransactional(readOnly = true)
>     public CaseSummaryResponse read(Long caseSeq) { ... }
> }
> ```

```
service/
├── CaseService.java
└── helper/
    ├── CaseStatusValidator.java    # 상태 전이 검증
    ├── CasePriceCalculator.java    # 보상금 계산
    └── CaseDocumentBuilder.java    # 결정문 조립
```

### 현재 도메인 목록

| 도메인 패키지 | 역할                 |
|---|--------------------|
| `config/` | Security, Cache, 전역 예외 핸들러 |

---

## Backend Patterns

### 응답 형식

모든 API 응답은 `ApiResponse<T>` (`common/web`)로 통일합니다:

```
// 단건 응답
return ResponseEntity.ok(ApiResponse.of(data));

// 페이징 응답
return ResponseEntity.ok(ApiResponse.of(list, pagingInfo));

// 생성 응답
return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(data));
```

에러 응답은 `GlobalExceptionHandler`가 자동으로 `ErrorResponse`로 변환합니다.
Controller에서 직접 `ErrorResponse`를 반환하거나 try-catch를 작성하지 마세요.

### 예외 처리 전략

| 상황 | 던질 예외 | HTTP 결과 |
|---|---|---|
| 잘못된 입력값 (비즈니스) | `IllegalArgumentException` | 400 |
| 비즈니스 규칙 위반, 상태 충돌 | `IllegalStateException` | 409 |
| @Valid 검증 실패 | 자동 처리 | 400 |
| DB 오류 | 자동 처리 | 503 |

도메인 전용 예외가 필요하면 위 두 가지를 상속하여 정의합니다:

```
// 상속 예시
public class CaseNotFoundException extends IllegalArgumentException {
    public CaseNotFoundException(Long id) {
        super("사건을 찾을 수 없습니다. id=" + id);
    }
}
```

Service에서 예외를 던지면 GlobalExceptionHandler가 자동으로 처리합니다.

### DB 접근 계층

> JOOQ 쿼리 패턴, MyBatis Mapper 작성법, Flyway 마이그레이션 규칙, `@PlatformTransactional` 정의는
> `datasource/platform/CLAUDE.md` 참조.


### 트랜잭션

`@Transactional` 대신 **`@PlatformTransactional`** 사용 (`datasource/platform` 모듈 제공):

```
@PlatformTransactional               // 쓰기 (기본)
@PlatformTransactional(readOnly = true)  // 읽기 전용
```

- Service 메서드에만 적용 (Repository, Helper에는 적용 금지)
- 하나의 public 메서드 = 하나의 트랜잭션 단위

### 보안 및 인증

**현재 사용자 조회** — `UserAccountHolder` (`common/core`):

```
AuthUser user    = UserAccountHolder.get();
Long seq         = UserAccountHolder.getSeqNo();
String userId    = UserAccountHolder.getUserId();
Set<Role> roles  = UserAccountHolder.getRoles();
```

**메서드 권한 제어** — `@PreAuthorize`:

```
@PreAuthorize("hasAuthority('ADMIN')")
public ResponseEntity<?> adminOnly() { ... }
```

**Auditing — 생성자/수정자 자동 주입**:

`AbstractResponse`를 상속한 Request DTO에 `@Auditing` 파라미터를 추가하면
`createdBy`, `updatedBy`, `createdTime`, `updatedTime`이 자동으로 채워집니다.

```
// 생성 (createdBy, createdTime, updatedBy, updatedTime 모두 세팅)
public ResponseEntity<?> create(@RequestBody @Valid CaseRequest req,
                                 @Auditing CaseRequest audited) {
    service.create(audited);
}

// 수정 (updatedBy, updatedTime만 세팅)
public ResponseEntity<?> update(@RequestBody @Valid CaseRequest req,
                                 @Auditing(isUpdateOnly = true) CaseRequest audited) {
    service.update(audited);
}
```

### 캐시 패턴

캐시 이름은 `CacheNames` 상수로만 참조합니다 (문자열 하드코딩 금지).

새 캐시 추가 순서:
1. `CacheNames.java`에 상수 추가
2. `CacheConfig.java`의 캐시 목록에 `createXxxCache()` 추가
3. 사용

```
// 1. CacheNames.java
public static final String CASE_TEMPLATE_CACHE_NAME = "case_template_cache";

// 2. CacheConfig.java — cacheManager() 내 캐시 목록에 추가
List.of(createCaseTemplateCache(), ...);

// 3. 사용
@Cacheable(cacheNames = CacheNames.CASE_TEMPLATE_CACHE_NAME, key = "#id")
public CaseTemplate getTemplate(Long id) { ... }

@CacheEvict(cacheNames = CacheNames.CASE_TEMPLATE_CACHE_NAME, key = "#id")
public void updateTemplate(Long id, ...) { ... }
```

### Swagger / OpenAPI 문서화

```
// Controller 클래스
@Tag(name = "사건", description = "사건 관리 API")
@RestController

// 엔드포인트
@Operation(summary = "사건 상세 조회")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "조회 성공"),
    @ApiResponse(responseCode = "404", description = "사건 없음")
})

// DTO 필드
@Schema(description = "사건 일련번호", example = "1")
private Long caseSeq;
```

공개 경로: `/api/public/**` (인증 불필요), 나머지는 JWT 필요.
Swagger UI: `/public/swagger-ui/index.html`

### JavaDoc 컨벤션

| 계층 | 클래스 JavaDoc | 메서드 JavaDoc |
|---|---|---|
| Controller | 작성 안 함 | 작성 안 함 (`@Tag`·`@Operation`이 API 문서 역할) |
| Service | 필수 | public 메서드 전체 필수 |
| Helper (`@Component`) | 필수 (1줄) | public 메서드 필수 |
| Repository | 필수 (1줄) | 복잡 쿼리만 — 단순 CRUD(`findAll`, `save` 등) 생략 |
| API-facing DTO (`@Schema` 적용, 항상 `class`) | 작성 안 함 | 작성 안 함 |
| 내부 값 객체 (`record`, Service 내부 전달용) | 필수 | record 생성자 `@param` 작성 |
| Config 클래스 | 필수 | `@Bean` 메서드 필수 |

Service 템플릿:

```java
/**
 * {도메인명} 비즈니스 로직 서비스.
 *
 * <p>{주요 기능 한 줄 요약}.
 */
@Service
public class {Domain}Service {

    /**
     * {동사형 한 줄 설명}.
     *
     * @param {param}  {설명}
     * @return {반환값 설명}
     * @throws IllegalArgumentException {발생 조건 — HTTP 400}
     * @throws IllegalStateException    {발생 조건 — HTTP 409}
     */
    public {ReturnType} {method}(...) { ... }
}
```

Repository 클래스 템플릿:

```java
/**
 * {도메인/테이블명} 데이터 접근 레포지토리.
 */
@Repository
public class {Domain}Repository {
    // 단순 CRUD(findAll, save, findById, delete, update, countAll): JavaDoc 생략
    // 복잡한 조인·검색·집계 쿼리: @param/@return 작성
}
```

### 공통 모듈 활용

| 모듈 | 주요 제공 요소 | 사용 계층 |
|---|---|---|
| `common/core` | `AuthUser`, `UserAccountHolder`, `AbstractResponse`, `AbstractPagingResponse`, 공통 Enum/Type | Service, DTO |
| `common/web` | `ApiResponse`, `ErrorResponse`, `@Auditing`, `JWTCheckFilter`, `SwaggerConfig` | Controller, Config |
| `common/jooq` | `CustomGeneratorStrategy` (테이블→`J{Name}`, POJO→`{Name}Entity`) | 코드 생성 전용 |
| `datasource/platform` | JOOQ DSL, Repository, Mapper, `@PlatformTransactional` | Service에서 주입 |

### 설정 프로파일

| 프로파일 | 포함 설정 그룹 | 용도 |
|---|---|---|
| `local` | `core`, `datasource-platform`, `web-base` | 로컬 개발 |
| `dev` | `local` + `datasource-platform-dev` | 개발 서버 |

주요 환경 변수: `SPRING_PROFILES_ACTIVE`, `JWT_SECRET`, `FILE_UPLOAD_PATH`

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| Service | `{Domain}Service` | `CaseService` |
| Helper 컴포넌트 | `{Domain}{Function}` | `CaseStatusValidator`, `CasePriceCalculator` |
| Controller | `{Domain}Controller` | `CaseController` |
| Request DTO | `{Domain}Request` 또는 기능 명시 | `CaseCreateRequest` |
| Response DTO | `{Domain}Response` 또는 기능 명시 | `CaseDetailResponse` |
| 도메인 Enum | `{Domain}StatusType` | `CaseStatusType`, `ReceiptStatusType` |
| 캐시 상수 | `{DOMAIN}_CACHE_NAME` | `CASE_TEMPLATE_CACHE_NAME` |

### DTO 타입 선택 규칙

| 상황 | 타입 | 이유 |
|---|---|---|
| `@Auditing` 대상 Request DTO | `class extends AbstractResponse` | `AuditingHandlerMethodArgumentResolver`가 setter로 audit 주입 — `record` 불가 |
| 일반 API Request/Response DTO | `record` | Spring Boot 3.x 모범 사례 — 불변, 간결, Lombok 불필요 |

> `@Auditing`을 `record`에 사용하면 런타임 오류 발생 (setter 없음, `AbstractResponse` 상속 불가).
>
> record 사용 시 주의 사항:
> - record component와 동일한 이름의 static 팩토리 메서드는 컴파일 오류 발생 → `ofXxx()` 형식으로 명명
>   - ✅ `static ChangePasswordResponse ofSuccess()` (component 이름: `success`)
>   - ❌ `static ChangePasswordResponse success()` — accessor 반환 타입 충돌
> - record accessor는 `getXxx()` 없이 `xxx()` 형식 — 호출부 전체 수정 필요
> - boolean component accessor: `isXxx()` 아닌 `xxx()` 형식

