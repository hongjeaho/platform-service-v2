---
name: tdd-red-be
description: |
  이슈 AC를 실패하는 백엔드 테스트(Service 단위 + Controller 슬라이스)로 변환하는 TDD Red 스킬.
  "백엔드 TDD Red"·"tdd-red-be"·"JUnit 실패 테스트 작성" 언급 시 이 스킬 사용.
---

# TDD Red Workflow [백엔드 · Spring Boot]

이슈의 AC(Acceptance Criteria)를 읽어 **실패하는 테스트 코드**를 작성하는 파이프라인.
테스트는 두 레이어로 분리한다: Service 단위 테스트 + Controller 슬라이스 테스트.
모든 테스트가 컴파일 에러 없이 "정상 실패(assertion fail)"로 끝나야 이 단계가 완료된다.

---

## 입력 형식

```
/tdd-red-be {N}                      ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/tdd-red-be {feature-path} {N}      ← 경로 직접 지정 + 이슈 번호
```

---

## 컨텍스트 결정

### feature-path / module-name / pkg-root 결정

아래 순서로 결정한다. 위 단계에서 결정되면 아래는 실행하지 않는다.

**1순위: /feature-planner-be 세션 컨텍스트**

같은 세션에서 `/feature-planner-be`가 먼저 실행된 경우 `[CONTEXT]`를 그대로 사용한다.

```
[CONTEXT] feature-path: notice/list
          module-name:  platform
          api-module:   api/platform
          ds-module:    datasource/platform
          pkg-root:     com/platform/api/platform
          docs-root:    api/platform/src/main/java/com/platform/api/platform/notice/list/docs/
          branch:       feature/notice/list
```

**2순위: 직접 지정**

첫 토큰에 슬래시(`/`)가 포함된 영문 경로 → `{feature-path}`로 판단.
module-name·pkg-root는 `ls api/` + `find *Application.java` 로 자동 탐색한다.

```
/tdd-red-be notice/list 1   → feature-path: notice/list, N: 1
```

**3순위: 현재 브랜치 자동 추론**

```bash
git branch --show-current
```

`main`·`master`·`develop`·`dev` 또는 `feature/` prefix 없는 브랜치:

```
⚠️  현재 브랜치: main (보호 브랜치)
    TDD 작업은 feature 브랜치에서 진행해야 합니다.
    feature 브랜치로 전환 후 다시 실행해주세요.
```

`feature/*` 브랜치라면 `feature/` prefix를 제거해 feature-path로 사용.

**4순위: 직접 입력 요청**

```
feature-path를 입력해주세요.
예) /tdd-red-be notice/list 1
```

---

## 진입 안내

컨텍스트가 확정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📦 모듈:   api/platform + datasource/platform
📁 feature-path: notice/list
📄 읽기: api/platform/src/main/java/com/platform/api/platform/notice/list/docs/issue-1.md
🔴 TDD Red — 실패하는 테스트 코드 작성을 시작합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md` |
| Service 테스트 (생성) | `api/{module-name}/src/test/java/{pkg-root}/{feature-path}/service/{Domain}ServiceTest.java` |
| Controller 테스트 (생성) | `api/{module-name}/src/test/java/{pkg-root}/{feature-path}/controller/{Domain}ControllerTest.java` |

**예시 (module-name=platform, pkg-root=com/platform/api/platform, feature-path=notice/list):**

```
이슈 파일:
  api/platform/src/main/java/com/platform/api/platform/notice/list/docs/issue-1.md

Service 테스트:
  api/platform/src/test/java/com/platform/api/platform/notice/list/service/NoticeListServiceTest.java

Controller 테스트:
  api/platform/src/test/java/com/platform/api/platform/notice/list/controller/NoticeListControllerTest.java
```

---

## 파이프라인 개요

```
/tdd-red-be [{feature-path}] {N}
    ↓ 컨텍스트 결정 (세션 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ 단계 1: issue-{N}.md 파싱 — 시그니처·시나리오 추출
    ↓ 단계 2: Service 단위 테스트 작성 → 즉시 실행
    │   ├─ 정상 실패 → 단계 3으로
    │   └─ 에러 실패 → Service 스켈레톤 생성 → 재실행
    ↓ 단계 3: Controller 슬라이스 테스트 작성 → 즉시 실행
    │   ├─ 정상 실패 → 완료 보고
    │   └─ 에러 실패 → Controller 스켈레톤 생성 → 재실행
    ↓ 완료 보고
```

---

## 단계 1: issue-{N}.md 파싱

`docs/issue-{N}.md`를 읽어 아래 두 섹션을 추출한다.

- **`## 시그니처`** — Controller·Service·Repository·DTO 메서드 시그니처
- **`## 테스트 시나리오`** — Service 단위 테스트 / Controller 슬라이스 테스트 시나리오 체크박스 목록

파일이 없거나 두 섹션 중 하나라도 없으면:

```
⚠️  issue-{N}.md에 {누락 섹션}이 없습니다.
    /test-scenarios-be {N} 을 먼저 실행해 시그니처·시나리오를 확정해주세요.
```

---

## 단계 2: Service 단위 테스트 작성

### 어노테이션 구성

> **전제 조건**: 테스트 대상 Service는 반드시 **생성자 주입(`@RequiredArgsConstructor`)**을 사용해야 한다.
> `@Autowired` 필드 주입 방식의 Service에서는 `@InjectMocks`가 Mock을 주입하지 못한다.

```java
@ExtendWith(MockitoExtension.class)
class {Domain}ServiceTest {

    @Mock
    private {Domain}Repository {domain}Repository;  // 실제 의존 Repository

    // @RequiredArgsConstructor + @InjectMocks → Mockito가 생성자 인자에 @Mock을 자동 연결
    @InjectMocks
    private {Domain}Service {domain}Service;

    @Test
    @DisplayName("{조건} 시 {기대 동작}한다")
    void {methodName}_{scenario}() {
        // Given
        // When
        // Then
    }
}
```

### AC → 테스트 변환 규칙

- AC 한 줄 = 테스트 메서드 하나
- Given: `when(repository.method()).thenReturn(...)` Mock 설정
- When: `service.method(...)` 호출
- Then: `assertThat(result).isEqualTo(...)` 또는 `assertThatThrownBy(...).isInstanceOf(...)`

### 테스트 메서드 명

```
{메서드명}_{시나리오 한 줄 영문}
예) getList_returnEmptyWhenNothingExists
    create_throwWhenDuplicateTitle
```

### 예외 검증

```java
// IllegalArgumentException (400) 검증
assertThatThrownBy(() -> service.getDetail(999L))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessageContaining("찾을 수 없습니다");

// IllegalStateException (409) 검증
assertThatThrownBy(() -> service.create(duplicateRequest))
    .isInstanceOf(IllegalStateException.class);
```

### 스켈레톤이 null/빈값을 반환하는 경우 Then 작성 규칙

스켈레톤이 `return null` 또는 `return List.of()`를 반환하므로, Then 검증은 **필드 직접 접근 전에 null 체크**를 먼저 한다.
필드에 직접 접근하면 NPE가 발생해 "에러 실패"가 되므로 금지.

```java
// ✅ 올바른 패턴 — null 반환 스켈레톤에서 assertion fail 유도
NoticeListResponse result = service.create(request);
assertThat(result).isNotNull();               // Red: null → 여기서 assertion fail (NPE 아님)
assertThat(result.getTitle()).isEqualTo("제목");  // Green: 구현 후 이 줄까지 실행됨

// ❌ 금지 패턴 — NPE 발생 → assertion fail이 아닌 "에러 실패"
assertThat(service.create(request).getTitle()).isEqualTo("제목");
```

### 실행

> ※ `{pkg-root-dot}` = pkg-root의 `/`를 `.`으로 치환 (예: `com/platform/api/platform` → `com.platform.api.platform`)
> ※ `{feature-path-dot}` = feature-path의 `/`를 `.`으로 치환 (예: `notice/list` → `notice.list`)

```bash
./gradlew :api:{module-name}:test --tests "{pkg-root-dot}.{feature-path-dot}.service.*ServiceTest"
```

예) `./gradlew :api:platform:test --tests "com.platform.api.platform.notice.list.service.*ServiceTest"`

---

## 단계 3: Controller 슬라이스 테스트 작성

### 어노테이션 구성

```java
@WebMvcTest({Domain}Controller.class)
@AutoConfigureMockMvc(addFilters = false)  // 기본값 — 공개·JWT 엔드포인트 모두
class {Domain}ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private {Domain}Service {domain}Service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("{조건} 시 {기대 응답 상태코드}를 반환한다")
    void {methodName}_{scenario}() throws Exception {
        // Given
        // When & Then
    }
}
```

### AC → 테스트 변환 규칙

- Given: `when(service.method(...)).thenReturn(...)` MockBean 설정
- When: `mockMvc.perform(get("/api/...").param(...))` or `post(...)`, `put(...)`, `delete(...)`
- Then: `.andExpect(status().isOk())`, `.andExpect(jsonPath("$.data").exists())`

### Bean Validation 실패 케이스

`@Valid + @NotBlank` 등 Bean Validation 위반은 `addFilters=false` 환경에서도 동작한다.

```java
@Test
@DisplayName("빈 제목으로 요청 시 400을 반환한다")
void create_returns400_whenTitleIsBlank() throws Exception {
    mockMvc.perform(post("/api/public/notice")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"title\":\"\"}"))   // @NotBlank 위반
        .andExpect(status().isBadRequest());
}
```

> Service Mock 설정 없이도 `MethodArgumentNotValidException`이 Controller 계층에서 즉시 발생한다.

### @Auditing 파라미터가 있는 Controller 테스트

> `@Auditing` — 커스텀 애노테이션. JWT에서 현재 로그인 사용자를 읽어 `createdBy`/`updatedBy`를 자동 주입하는 `HandlerMethodArgumentResolver`. `@RequestBody` 파라미터와 쌍으로 선언해 사용한다.

`issue-{N}.md`의 시그니처에 `@Auditing` 파라미터가 있는 경우, `addFilters=false` 환경에서는
`@Auditing` 리졸버가 작동하지 않아 파라미터가 null로 처리된다.
아래 방법 A를 기본값으로 사용한다(Service Mock이 `any()`를 사용하므로 테스트 자체는 정상 실패).

```java
// @Auditing 파라미터가 있는 엔드포인트 테스트 (방법 A 기본값)
@Test
@DisplayName("유효한 요청 시 201 Created를 반환한다")
void create_returns201_whenValidRequest() throws Exception {
    // Given — audited 파라미터는 null이 되므로 Service mock에 any() 사용
    when(service.create(any())).thenReturn(response);

    // When & Then
    mockMvc.perform(post("/api/notice")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.title").value("제목"));
}
```

> `@Auditing` null 주입 자체를 검증해야 하는 경우(예: audited 필드 누락 시 400)에만
> 방법 B(SecurityConfig import)로 테스트를 별도 작성한다.

### 인증 처리

`@WebMvcTest`는 `anyRequest().authenticated()` 기본값이 적용되어 공개 엔드포인트도 401 반환.
**방법 A를 공개·JWT 엔드포인트 모두의 기본값으로 사용**한다.

**방법 A (기본값)**

```java
@WebMvcTest({Domain}Controller.class)
@AutoConfigureMockMvc(addFilters = false)  // 필터 체인 전체 비활성화
class {Domain}ControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private {Domain}Service {domain}Service;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void ...  // @WithMockUser 불필요
}
```

> JWT 인증 필요 엔드포인트: 방법 A로 기능 로직 검증 + 방법 B로 401 케이스 1개 이상 추가 권장.

**방법 B (고급 — 미인증 401·권한 없음 403 동작 자체 검증 시만)**

> ⛔ 방법 B 선택 시 `@MockBean ObjectMapper objectMapper`가 등록되어
>    테스트 클래스 전체에서 `objectMapper.writeValueAsString() → null` 반환.
>    이슈와 무관한 기존 테스트까지 깨질 수 있으므로 **미인증 401·403 검증이 반드시 필요한 경우에만 사용**.
>    대부분의 경우 방법 A(`addFilters = false`)로 충분하다.

```java
@WebMvcTest({Domain}Controller.class)
@Import(SecurityConfig.class)
class {Domain}ControllerTest {

    // SecurityConfig 의존 빈 (변경 시 SecurityConfig.java 확인)
    @MockBean UserDetailsService userDetailsService;
    @MockBean JWTCheckFilter jwtCheckFilter;
    @MockBean @Qualifier("platformHeaderFilter") OncePerRequestFilter platformHeaderFilter;
    @MockBean ObjectMapper objectMapper;  // writeValueAsString() → null. JSON 본문 수동 작성 필요.

    @Autowired private MockMvc mockMvc;
    @MockBean private {Domain}Service {domain}Service;

    @Test @WithMockUser void ... // 인증된 사용자
    @Test void unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/...")).andExpect(status().isUnauthorized());
    }
}
```

### 응답 형식 — ApiResponse<T>

모든 성공 응답은 `{"success":true,"data":...,"meta":...}` 구조이므로 jsonPath를 아래처럼 작성한다.

```java
.andExpect(jsonPath("$.success").value(true))
.andExpect(jsonPath("$.data").isArray())
.andExpect(jsonPath("$.data[0].title").value("제목"))
```

### 실행

> ※ pkg-root-dot, feature-path-dot 변환 규칙은 Service 테스트 실행 섹션 참고.

```bash
./gradlew :api:{module-name}:test --tests "{pkg-root-dot}.{feature-path-dot}.controller.*ControllerTest"
```

---

## 에러 실패 대응: 스켈레톤 생성

> **원칙**: 구현 로직을 작성하지 않는다. 컴파일 에러를 없애는 최소한의 시그니처만 추가한다.
> **제약 (파일 없는 경우)**: 파일 자체가 없으면 새로 생성한다.
> **제약 (파일 있는 경우)**: 기존 메서드는 절대 수정하지 않는다.
>   단, 테스트가 호출하는 메서드 시그니처가 없어서 컴파일 에러가 발생한다면
>   **해당 메서드 시그니처만 빈 바디로 추가**한다. (이슈 2 이후 공통 상황)

**Service 스켈레톤 예시:**

```java
@Service
@RequiredArgsConstructor
public class NoticeListService {

    private final NoticeListRepository noticeListRepository;

    @PlatformTransactional(readOnly = true)
    public List<NoticeListResponse> getList(int page, int pageSize) {
        return List.of();   // 빈 값 반환 → assertion 실패 유도
    }

    @PlatformTransactional
    public NoticeListResponse create(NoticeListCreateRequest request) {
        return null;
    }
}
```

**Controller 스켈레톤 예시:**

```java
@Tag(name = "notice-list", description = "공지 목록 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/notice/list")
public class NoticeListController {

    private final NoticeListService noticeListService;

    @Operation(summary = "공지 목록 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NoticeListResponse>>> getList(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int pageSize
    ) {
        return ResponseEntity.ok(ApiResponse.of(noticeListService.getList(page, pageSize)));
    }
}
```

**Repository 스켈레톤 예시** (Service 테스트에서 `@Mock`으로 주입하므로 컴파일 가능 상태만 확보):

> **`ds-pkg-root` 결정**: Repository 파일을 처음 생성하기 전에 아래 명령으로 실제 경로를 확인한다.
> ```bash
> find datasource/{module-name}/src/main/java -name "*Repository*.java" | head -1
> ```
> 예) `datasource/platform/src/main/java/com/platform/datasource/platform/repository/board/BoardContentRepository.java`
> → `ds-pkg-root`: `com/platform/datasource/platform`

```java
// datasource/{module-name}/src/main/java/{ds-pkg-root}/repository/{feature-path}/NoticeListRepository.java
@Repository
@RequiredArgsConstructor
public class NoticeListRepository {

    private final DSLContext dsl;

    public List<NoticeEntity> findAll(int page, int pageSize) {
        return List.of();   // 스켈레톤 — 빈 값 반환
    }

    public Long save(NoticeEntity entity) {
        return null;        // 스켈레톤 — null 반환
    }
}
```

> JOOQ 클래스(`JNotice`, `NoticeEntity`)가 아직 생성되지 않은 경우 import를 주석 처리하고
> `List<Object>` 등 임시 타입으로 대체한 뒤, `/tdd-green-be`에서 Flyway + generateJooq 실행 후 교체한다.

스켈레톤 생성 후 재실행. 여전히 에러 실패이면 원인을 파악해 스켈레톤을 수정한다.

---

## 완료 보고

```
✅ TDD Red 완료 — issue-{N}

📋 작성된 테스트 파일:
   - api/platform/src/test/.../service/NoticeListServiceTest.java  (3개 AC → 3개 테스트)
   - api/platform/src/test/.../controller/NoticeListControllerTest.java  (4개 AC → 4개 테스트)

🔴 전체 실패 확인: 7/7 정상 실패 (assertion fail)
   - 컴파일 에러: 0건
   - 에러 실패: 0건

📦 생성된 스켈레톤 파일: (컴파일 에러 해소를 위해 생성한 경우만 표시)
   - api/platform/src/main/.../service/NoticeListService.java  (빈 메서드 시그니처)
   - api/platform/src/main/.../controller/NoticeListController.java  (빈 메서드 시그니처)
   스켈레톤이 없으면 이 섹션을 생략한다.

다음 단계: /tdd-green-be {N}  (구현 코드 작성)
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 파일 조작 범위 | `src/test/` 아래 테스트 파일만 생성·수정 |
| 구현 코드 | `src/main/` 기존 구현 코드 수정 금지 |
| 스켈레톤 (신규 파일) | 파일이 없을 때 `src/main/`에 생성 |
| 스켈레톤 (기존 파일) | 기존 메서드 수정 금지. 컴파일 에러 원인이 되는 **새 메서드 시그니처만** 빈 바디로 추가 |
| Controller | try-catch 작성 금지 — 테스트에서도 예외는 `GlobalExceptionHandler` 경유 |
| assertion | 실제 동작 검증만. 더미 `assertTrue(false)` 금지 |

---

## 승인 게이트

이 스킬은 GATE 없이 자동으로 진행한다.
단, issue-{N}.md에 `## 시그니처` 또는 `## 테스트 시나리오` 섹션이 없으면:

```
⚠️  issue-{N}.md에 {누락 섹션}이 없습니다.
    /test-scenarios-be {N} → /tdd-red-be {N} 순서로 먼저 실행해주세요.
```
