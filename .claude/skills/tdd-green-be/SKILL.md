---
name: tdd-green-be
description: |
  실패하는 백엔드 테스트를 통과시키는 최소한의 구현 코드를 작성하는 TDD Green 단계 스킬.
  /tdd-green-be {이슈번호} 명령어로 진입. /feature-planner-be 세션 컨텍스트가 있으면
  feature-path, module-name, pkg-root를 자동 로드하고,
  없으면 Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
  사용자가 "백엔드 TDD Green", "백엔드 구현 코드 작성", "테스트 통과 구현",
  "green 단계 구현", "tdd-green-be", "Service 구현", "Controller 구현",
  "Repository 구현", "Spring Boot Green" 등을 언급하면 반드시 이 스킬을 사용할 것.
  /tdd-red-be 스킬이 테스트 코드 작성을 완료한 직후 실행한다.
  테스트 파일(src/test/)은 절대 수정하지 않으며, 구현 코드(src/main/)만 작성한다.
---

# TDD Green Workflow [백엔드 · Spring Boot]

`/tdd-red-be`가 작성한 **실패하는 테스트**를 통과시키는 **최소한의 구현 코드**를 작성하는 파이프라인.
테스트가 요구하는 동작만 정확히 구현하며, 과도한 추상화나 미래 대비 코드는 작성하지 않는다.

---

## 입력 형식

```
/tdd-green-be {N}                      ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/tdd-green-be {feature-path} {N}      ← 경로 직접 지정 + 이슈 번호
```

---

## 컨텍스트 결정

`/tdd-red-be`와 동일한 4순위 결정 방식 사용.
세션 컨텍스트 `[CONTEXT]`에서 `feature-path`, `module-name`, `api-module`, `ds-module`, `pkg-root`, `docs-root`를 로드한다.

```
[CONTEXT] feature-path: notice/list
          module-name:  platform
          api-module:   api/platform
          ds-module:    datasource/platform
          pkg-root:     com/platform/api/platform
          docs-root:    api/platform/src/main/java/com/platform/api/platform/notice/list/docs/
          branch:       feature/notice/list
```

---

## 진입 안내

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📦 모듈:   api/platform + datasource/platform
📁 feature-path: notice/list
📄 읽기: ...notice/list/docs/issue-1.md
🟢 TDD Green — 실패하는 테스트를 통과시키는 구현을 시작합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기 / 체크박스 업데이트) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md` |
| Service 테스트 (읽기) | `api/{module-name}/src/test/java/{pkg-root}/{feature-path}/service/{Domain}ServiceTest.java` |
| Controller 테스트 (읽기) | `api/{module-name}/src/test/java/{pkg-root}/{feature-path}/controller/{Domain}ControllerTest.java` |
| 구현 파일 (생성/수정) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/` 아래 해당 계층 |
| Repository (생성/수정) | `datasource/{module-name}/src/main/java/{ds-pkg-root}/repository/{feature-path}/` |
| Flyway SQL (생성) | `datasource/{module-name}/flyway/V{yyyyMMddHHmmss}__{설명}.sql` |

---

## 전제 조건

| 항목 | 내용 |
|------|------|
| 빌드 도구 | Gradle 8 |
| 테스트 실행 | `./gradlew :api:{module-name}:test` |
| 특정 클래스 테스트 | `./gradlew :api:{module-name}:test --tests "{패키지}.{클래스명}"` |
| JOOQ 재생성 | `./gradlew :datasource:{module-name}:generateJooq` (스키마 변경 시) |

### `ds-pkg-root` 결정

`datasource/{module-name}`의 패키지 루트(`ds-pkg-root`)는 `api/{module-name}`의 `pkg-root`와 다를 수 있다.
Repository 파일을 처음 생성하기 전에 아래 명령으로 실제 경로를 확인한다.

```bash
find datasource/{module-name}/src/main/java -name "*Repository*.java" | head -1
```

결과가 없으면:
```bash
find datasource/{module-name}/src/main/java -name "*.java" | head -1
```

예) `datasource/platform/src/main/java/com/platform/datasource/platform/repository/board/BoardContentRepository.java`
→ `ds-pkg-root`: `com/platform/datasource/platform`

### JOOQ 클래스 네이밍 규칙 (`common/jooq` CustomGeneratorStrategy)

`./gradlew :datasource:{module-name}:generateJooq` 실행 후 생성되는 클래스 이름 규칙:

| 생성 대상 | 네이밍 패턴 | 예시 (테이블: `board_content`) |
|----------|-----------|-------------------------------|
| DSL 진입점 (테이블 메타) | `J{TablePascal}` | `JBoardContent` |
| 테이블 상수 | `J{TablePascal}.{TABLE_SNAKE_UPPER}` | `JBoardContent.BOARD_CONTENT` |
| POJO (Entity) | `{TablePascal}Entity` | `BoardContentEntity` |

Repository 구현 시 아래 패턴을 따른다.

```java
// JOOQ DSL 사용 예시 (board_content 테이블)
@Repository
@RequiredArgsConstructor
public class NoticeRepository {

    private final DSLContext dsl;

    public List<NoticeEntity> findAll(int page, int pageSize) {
        return dsl.selectFrom(JNotice.NOTICE)          // J{Pascal}.{SNAKE_UPPER}
                  .orderBy(JNotice.NOTICE.CREATED_TIME.desc())
                  .limit(pageSize).offset((long) page * pageSize)
                  .fetchInto(NoticeEntity.class);       // {Pascal}Entity
    }

    public Long save(NoticeEntity entity) {
        return dsl.insertInto(JNotice.NOTICE)
                  .set(dsl.newRecord(JNotice.NOTICE, entity))
                  .returningResult(JNotice.NOTICE.SEQ_NO)
                  .fetchOneInto(Long.class);
    }
}
```

> 기존 도메인(board 등)의 Repository를 먼저 읽어 패턴을 확인한 뒤 동일하게 작성한다.

---

## 파이프라인 개요

```
/tdd-green-be [{feature-path}] {N}
    ↓ 컨텍스트 결정
    ↓ 단계 1: 전체 테스트 실행 → 실패 목록 확인
    ↓ 단계 2: 체크박스 수 vs Tests 수 대조
    ↓ 단계 3: Flyway + JOOQ (스키마 변경 이슈인 경우)
    ↓ 단계 4–7: 테스트별 반복 (Service 테스트 먼저, Controller 테스트 다음)
    │   ↓ 단계 4: 실패 테스트 → 최소 구현 코드 작성 (구현 순서: Repository → Service → Controller)
    │   ↓ 단계 5: 피드백 루프 (최대 5회)
    │   │   ├─ 5-1: 대상 테스트 실행 → 통과 or 수정 후 재실행
    │   │   └─ 5-2: 전체 실행 → 회귀 확인
    │   ↓ 단계 6: issue-{N}.md 해당 AC 항목 [x] 체크
    │   ↓ 단계 7: 다음 실패 테스트로 이동
    ↓ 단계 8: 결과 요약
```

---

## 단계 1: 실패 테스트 목록 확인

```bash
./gradlew :api:{module-name}:test 2>&1 | tail -50
```

출력에서 `FAILED` 또는 `X tests completed, Y failed` 항목을 수집해 실패 테스트 목록을 만든다.

---

## 단계 2: 체크박스 수 대조

`issue-{N}.md`의 `## 테스트 시나리오` 섹션에서 체크박스(`- [ ]`) 총 건수를 세고,
Gradle 테스트 결과의 Tests 수와 비교한다.

> **주의**: `## Acceptance Criteria`가 아닌 `## 테스트 시나리오`를 기준으로 한다.
> AC 1개 → Service 테스트 1개 + Controller 테스트 1개 = 최소 2개 테스트가 생성되므로
> AC 수와 Tests 수는 일치하지 않는 것이 정상이다.

**불일치** (시나리오 체크박스 수 > Tests 수):
`/tdd-red-be`가 일부 테스트를 생성하지 못한 상태다.
Service/Controller 스켈레톤을 생성해 테스트가 컴파일되도록 한 뒤 재실행한다.

---

## 단계 3: Flyway + JOOQ 처리 (스키마 변경 이슈만)

이슈가 신규 테이블 생성 또는 컬럼 변경을 포함하면:

1. Flyway SQL 작성
   ```
   datasource/{module-name}/flyway/V{yyyyMMddHHmmss}__{설명}.sql
   ```
2. JOOQ 재생성
   ```bash
   ./gradlew :datasource:{module-name}:generateJooq
   ```
3. 이후 Repository 구현으로 진행

Flyway·JOOQ가 불필요하면 이 단계를 건너뛴다.

---

## 단계 4: 최소 구현 코드 작성

**원칙: 테스트가 요구하는 동작만 구현한다.**

- 테스트 파일(`src/test/`) 수정 금지
- 구현 순서: **Repository 메서드 → Service 메서드 → Controller (기존 스켈레톤 완성)**
- Helper 추출은 Service가 200줄을 초과하거나 private 메서드가 5개 이상일 때만
- Controller에 try-catch 작성 금지 — 예외는 Service에서 throw, GlobalExceptionHandler가 처리

### 구현 순서 예시 (POST /notice 엔드포인트)

```
1. Repository — save() 메서드 작성 (JOOQ DSL)
2. Service — create() 메서드 작성: 검증 → repository.save() → findById() → toResponse()
3. Controller — create() 엔드포인트 완성: @PostMapping, @Valid, ResponseEntity.status(CREATED)
               + @Tag(클래스), @Operation(메서드) — api/platform/CLAUDE.md 필수 컨벤션
```

### Swagger/OpenAPI 어노테이션 (Controller 필수)

`api/{module-name}/CLAUDE.md`의 컨벤션에 따라 Controller 구현 시 반드시 포함한다.

```java
// 클래스 레벨 — @Tag
@Tag(name = "{domain}", description = "{기능명} API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/{domain}")
public class {Domain}Controller {

    // 메서드 레벨 — @Operation
    @Operation(summary = "{엔드포인트 한 줄 설명}")
    @GetMapping
    public ResponseEntity<ApiResponse<List<{Domain}Response>>> getList(...) { ... }

    @Operation(summary = "{엔드포인트 한 줄 설명}")
    @PostMapping
    public ResponseEntity<ApiResponse<{Domain}Response>> create(...) { ... }
}
```

> **스켈레톤에서 완성으로 전환할 때**: 빈 바디만 있던 스켈레톤에 구현을 채우면서
> @Tag / @Operation을 함께 추가한다. 누락 시 `security-review-be`에서 지적된다.

### 최소 구현 원칙

```java
// ❌ 과도한 구현 (Green 단계에서 금지)
public List<NoticeResponse> getList(int page, int pageSize) {
    // 정렬, 필터, 캐시, 이벤트 발행까지 한 번에
    return cacheManager.get(...).orElseGet(() -> {
        List<NoticeEntity> list = repository.findAll(...);
        eventPublisher.publish(...);
        return list.stream().sorted(...).map(this::toResponse).toList();
    });
}

// ✅ 테스트가 요구하는 최소 구현
public List<NoticeResponse> getList(int page, int pageSize) {
    return repository.findAll(page, pageSize).stream()
        .map(this::toResponse)
        .toList();
}
```

### 트랜잭션 규칙

```java
// 조회 메서드: readOnly=true
@PlatformTransactional(readOnly = true)
public List<NoticeResponse> getList(...) { ... }

// 명령 메서드: 기본 (readOnly=false)
@PlatformTransactional
public NoticeResponse create(...) { ... }
```

---

## 단계 5: 피드백 루프 (최대 5회)

### 5-1. 대상 테스트 실행

```bash
./gradlew :api:{module-name}:test --tests "{pkg}.{Domain}ServiceTest"
```

**통과** → 5-2로 이동.

**실패** → 에러 메시지를 분석해 구현 코드를 수정한 뒤 5-1 재실행.
최대 5회까지 반복하며, 5회 초과 시:

```
⛔ 5회 반복 후에도 실패: {테스트명}

원인 분석:
- {에러 메시지 요약}
- {시도한 수정 내용}

개발자 확인이 필요합니다. 해결 후 /tdd-green-be {N}을 다시 실행해주세요.
```

### 5-2. 전체 회귀 확인

```bash
./gradlew :api:{module-name}:test 2>&1 | tail -50
```

**전체 통과** → 단계 6으로 이동.

**회귀 발생** (기존 테스트 실패) → 원인 분석 후 구현 코드 수정 → 5-1부터 재실행.

---

## 단계 6: issue-{N}.md 체크박스 업데이트

`issue-{N}.md`에는 체크박스가 두 섹션에 존재한다. **두 섹션 모두** 업데이트한다.

| 섹션 | 형식 | 업데이트 기준 |
|------|------|------------|
| `## 테스트 시나리오` | `[분류] ClassName.method — should ...` | 해당 테스트 메서드가 통과했을 때 |
| `## Acceptance Criteria` | `Given ..., When ..., Then ...` | 해당 AC의 모든 관련 테스트(Service + Controller)가 통과했을 때 |

```markdown
<!-- ## 테스트 시나리오 섹션 — 테스트 통과 즉시 체크 -->
- [ ] [정상] NoticeListService.getList — should return list when notices exist
↓ 통과 후
- [x] [정상] NoticeListService.getList — should return list when notices exist

<!-- ## Acceptance Criteria 섹션 — AC 관련 테스트 모두 통과 시 체크 -->
- [ ] Given 공지가 존재할 때, When GET /api/public/notice를 호출하면, Then 200 OK와 목록을 반환한다
↓ Service 테스트 + Controller 테스트 모두 통과 후
- [x] Given 공지가 존재할 때, When GET /api/public/notice를 호출하면, Then 200 OK와 목록을 반환한다
```

---

## 단계 7: 다음 실패 테스트로 이동

Service 테스트를 모두 통과시킨 후 Controller 테스트로 이동해 단계 4부터 반복한다.
모든 `- [ ]` 항목이 `- [x]`로 전환될 때까지 반복한다.

---

## 단계 8: 결과 요약

```
✅ TDD Green 완료 — issue-{N}

📋 통과된 테스트: {통과 수}/{전체 수}

✅ 체크된 AC:
   - [x] Given ..., When ..., Then ...
   - [x] Given ..., When ..., Then ...

📁 생성/수정된 구현 파일:
   - api/platform/src/.../service/NoticeListService.java
   - api/platform/src/.../controller/NoticeListController.java
   - datasource/platform/src/.../repository/NoticeListRepository.java
   (Flyway: datasource/platform/flyway/V20260101120000__create_notice_table.sql)

⚠️ 미해결 항목: (있으면 표시)
   - [ ] {미통과 AC — 원인 요약}

다음 단계: /ac-verifier-be {N}  (AC 충족 독립 검증)
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 파일 조작 범위 | `src/main/` 구현 파일만 생성·수정. 테스트 파일(`src/test/`) 수정 금지 |
| Controller | try-catch 작성 금지 — 예외는 Service에서 throw |
| Helper | Service 200줄 초과 또는 private 메서드 5개 이상일 때만 추출 |
| Helper 제약 | Helper에 Repository 주입 금지, 트랜잭션 시작 금지 |
| Flyway | 스키마 변경 시 Flyway SQL로만. DDL 직접 실행 금지 |
| 피드백 루프 | 최대 5회 반복. 초과 시 개발자에게 보고 후 중단 |
| 구현 범위 | 테스트가 요구하는 동작만. 과도한 추상화·미래 기능 추가 금지 |

---

## 승인 게이트

이 스킬은 GATE 없이 자동으로 진행한다.
단, issue-{N}.md에 AC 섹션이 없거나, 테스트 파일이 존재하지 않으면:

```
⚠️  테스트 파일이 없습니다.
    /tdd-red-be {N} 을 먼저 실행해 테스트 코드를 작성해주세요.
```
