---
name: test-scenarios-be
description: |
  이슈 단위로 Java 메서드 시그니처 확정 및 백엔드 테스트 시나리오 도출 스킬. GATE × 2 포함.
  "백엔드 테스트 시나리오"·"test-scenarios-be"·"Java 시그니처 도출" 언급 시 이 스킬 사용.
---

# Test Scenarios Workflow [백엔드 · Spring Boot]

이슈의 Java 메서드 시그니처를 확정하고 테스트 시나리오를 도출하는 파이프라인.
두 개의 GATE에서 사용자의 명시적 승인을 받아야 다음 단계로 진행한다.

---

## 입력 형식

```
/test-scenarios-be                        ← 컨텍스트 또는 브랜치 추론 + 이슈 번호 질문
/test-scenarios-be {N}                    ← 컨텍스트 또는 브랜치 추론 + 이슈 번호 지정
/test-scenarios-be {feature-path} {N}    ← 경로 직접 지정
```

---

## 컨텍스트 결정

아래 4순위로 결정한다:
1순위 세션 [CONTEXT] 블록 → 2순위 첫 토큰 `/` 포함 경로 직접 지정 → 3순위 `git branch --show-current` (`feature/*` 파싱) → 4순위 직접 입력 요청.
보호 브랜치(main/master/develop/dev) 감지 시 즉시 중단.

---

## 진입 안내

컨텍스트가 확정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📦 모듈:   api/platform + datasource/platform
📁 feature-path: notice/list
📋 이슈: api/platform/src/main/java/com/platform/api/platform/notice/list/docs/issues.md — Issue {N}
📄 참조: ...notice/list/docs/prd.md
✏️  기록: ...notice/list/docs/issue-{N}.md

변경이 필요하면 말씀해주세요. 없으면 바로 분석을 시작합니다.
```

컨텍스트에서 자동 로드한 경우 브랜치 줄을 생략한다.

```
📦 모듈:   api/platform + datasource/platform  (feature-planner-be 컨텍스트에서 로드)
📁 feature-path: notice/list
📋 이슈: ...issues.md — Issue {N}
📄 참조: ...prd.md
✏️  기록: ...issue-{N}.md
```

### 이슈 번호가 없는 경우

`{N}`이 입력되지 않으면 경로 확정 후 바로 질문한다.

```
몇 번 이슈를 진행할까요?
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 목록 (읽기) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issues.md` |
| PRD (참고) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/prd.md` |
| 이슈 파일 (생성/업데이트) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md` |

---

## 파이프라인 개요

```
/test-scenarios-be [{feature-path}] [{N}]
    ↓ 컨텍스트 결정 (세션 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ 이슈 번호 확인 (없으면 질문)
    ↓ 진입 안내 출력
    ↓ 진입: 파일 확인 (issues.md Issue N + prd.md)
    ↓ 단계 1: issues.md(Issue N) + prd.md + 코드베이스 분석 → 시그니처 도출
    ↓ [GATE 1] 시그니처 승인
    ↓ 단계 2: issue-{N}.md 상단에 시그니처 기록
    ↓ 단계 3: 시나리오 도출 + Issue N AC 대조
    ↓ [GATE 2] 시나리오 승인 → issue-{N}.md 하단에 기록
```

---

## 진입: 파일 확인

- `issues.md`가 없으면 사용자에게 알리고 대기한다. 파일 없이 시그니처를 추측하지 않는다.
- `issues.md` 안에 Issue {N}이 없으면 사용자에게 알린다.
- `prd.md`가 없으면 참고 없이 진행 가능하나 사용자에게 알린다.
- `issue-{N}.md`는 없어도 단계 2에서 새로 생성하므로 진행한다.

---

## 단계 1: 시그니처 도출

### 분석 범위

**반드시 읽어야 할 파일:**
1. `spec-fixed.md` — 확정된 용어 정의 (클래스·메서드·DTO 이름의 기준. 없으면 `prd.md` 용어 정의 섹션 참고)
2. `issues.md` — Issue {N}의 설명, AC, 구현 범위(Flyway·Repository·Service·Controller) 추출
3. `prd.md` — API 명세(HTTP 메서드·URI·요청/응답 DTO), 백엔드 아키텍처 준수 계획 참고

**기존 패턴 탐색 순서:**

1. 동일 모듈 내 가장 완성도 높은 기존 도메인 — Controller·Service·DTO 패턴 참고
   ```bash
   find api/{module-name}/src/main/java/{pkg-root} -name "*Service.java" \
     ! -path "*/config/*" ! -path "*/common/*" | head -5
   ```
   결과를 사용자에게 보여주고, 참고할 도메인을 확인한다.
   > 특정 도메인을 고정 레퍼런스로 삼지 않는다. 후보 중 가장 유사한 유스케이스를 가진 도메인을 선택한다.
2. `datasource/{module-name}/src/main/java/.../repository/` — 기존 Repository 메서드 패턴
3. `api/{module-name}/src/main/java/{pkg-root}/config/cache/CacheNames.java` — 재사용 가능한 캐시 상수
4. `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/service/helper/` — 기존 Helper (있는 경우)

### 시그니처 도출 규칙

- **구현 코드는 절대 작성하지 않는다.** 클래스/메서드 시그니처와 DTO 필드 선언만 작성한다.
- **기존 도메인 패턴을 따른다.** 패턴에서 벗어나는 경우 그 이유를 명시한다.
- **단일 책임 원칙** — 메서드 하나는 하나의 UseCase를 담당한다. issues.md의 수직 슬라이스 기준을 따른다.
- **spec-fixed.md 용어 정의 우선** — 클래스/메서드 이름은 spec-fixed.md의 용어 정의를 따른다.

### 도출 항목

이슈에 포함된 계층에 따라 해당하는 항목만 도출한다.
해당 사항이 없는 섹션은 출력 및 기록에서 완전히 생략한다.

#### Controller 엔드포인트 시그니처

```java
// {Controller명}: {HTTP메서드} {URI}
// 접근 권한: [인증 불필요 (/api/public/** → Public*Controller)] | [JWT 필요 (/api/** → *Controller)] | [ADMIN 전용 (@PreAuthorize)]
//
// Controller 네이밍 규칙:
// - 인증 불필요: Public{Domain}Controller (예: PublicAuthController)
// - JWT 필요: {Domain}Controller (예: NoticeListController)
// - ADMIN 전용: Admin{Domain}Controller (예: AdminUsersController)

// ── 읽기 엔드포인트 (GET, DELETE)
@GetMapping("{uri}")
public ResponseEntity<ApiResponse<{ResponseType}>> {methodName}(
    @{파라미터어노테이션} {ParamType} {paramName}
);

// ── 쓰기 엔드포인트 (POST, PUT) — createdBy/updatedBy 자동 주입이 필요한 경우
//    @Auditing: 커스텀 애노테이션. JWT에서 현재 로그인 사용자를 읽어 createdBy/updatedBy를 자동 주입하는 HandlerMethodArgumentResolver.
//    이중 파라미터 패턴 사용 — @RequestBody로 받은 req를 audited에 복사한 뒤 감사 필드를 채운다.
@PostMapping("{uri}")
public ResponseEntity<ApiResponse<{ResponseType}>> {methodName}(
    @RequestBody @Valid {Domain}CreateRequest req,
    @Auditing {Domain}CreateRequest audited   // createdBy, createdTime, updatedBy, updatedTime 자동 세팅
);

// ── 쓰기 엔드포인트 — Auditing 불필요한 경우 (단순 쓰기, 공개 API 등)
@PostMapping("{uri}")
public ResponseEntity<ApiResponse<{ResponseType}>> {methodName}(
    @RequestBody @Valid {Domain}CreateRequest req
);
```

> **판단 기준**: prd.md "API 명세"의 인증 설정과 이슈 AC를 읽어 결정한다.
> - `/api/public/**` + 생성자 추적 불필요 → `@Auditing` 생략
> - `/api/**` (JWT 필요) + 생성자·수정자 추적 필요 → `@Auditing` 포함
> - 수정 엔드포인트 (PUT): `@Auditing(isUpdateOnly = true)` 사용

#### Service 메서드 시그니처

```java
// {Domain}Service.{methodName}: {한 줄 설명}
@PlatformTransactional(readOnly = true | false)
public {ReturnType} {methodName}({ParamType} {paramName}, ...);

// 예외: IllegalArgumentException({상황}) | IllegalStateException({상황})
```

#### Repository 메서드 시그니처 (신규 메서드가 있는 경우만)

```java
// {Domain}Repository.{methodName}: {한 줄 설명} (JOOQ | MyBatis)
public {ReturnType} {methodName}({ParamType} {paramName}, ...);
```

#### DTO 필드 선언 (신규 DTO가 있는 경우만)

```java
// {Domain}CreateRequest / {Domain}Response 등
@NotNull / @NotBlank / @Size(max=...)
private {FieldType} {fieldName};  // 주요 필드만, @Schema 설명 포함
```

#### Helper 시그니처 (시그니처 명시 또는 Service 복잡도 초과 시만)

```java
// {Domain}{Role}.{methodName}: {한 줄 설명}
// 역할 접미사: Validator | Calculator | Converter | Sender | Builder | Processor  (feature-planner-be 참조)
// ※ Reader는 Helper가 아닌 @Service 레이어 컴포넌트 (Repository 주입·트랜잭션 허용)
//    사용 기준: 복수 Repository 조합, 조회 로직이 Service 200줄 초과, 또는 안 C(CQRS-lite) 선택 시
//    단순 findById · findAll은 Service에서 Repository를 직접 호출한다
public {ReturnType} {methodName}({ParamType} {paramName});
// 제약: Repository 주입 금지, 트랜잭션 금지
```

### 출력 형식 (사용자에게 보여주는 형태)

> ※ 아래는 모든 계층이 포함된 예시. **해당 없는 섹션은 출력하지 않는다.**
> - Controller·Service: 이슈에 항상 포함
> - Repository: 신규 메서드가 있는 경우만
> - DTO: 신규 DTO가 있는 경우만 (예: DELETE 204 응답은 DTO 없음)
> - Helper: 시그니처에 명시되었거나 Service 복잡도 초과 시만

```
## Issue {N} 시그니처

### Controller
{Controller 엔드포인트 시그니처}

### Service
{Service 메서드 시그니처}

### Repository  ← 신규 메서드가 있는 경우만
{Repository 메서드 시그니처}

### DTO  ← 신규 DTO가 있는 경우만
{DTO 필드 선언}

### Helper  ← 시그니처 명시 또는 Service 복잡도 초과 시만
{Helper 메서드 시그니처}

---
📌 참고한 기존 패턴: {파일 경로 목록}
📌 기존 패턴과의 차이: {없음 | 차이 내용 + 이유}
```

---

## [GATE 1] 시그니처 승인

```
[GATE 1] 위 시그니처를 검토해주세요.
         - 메서드명·파라미터·반환타입이 spec-fixed.md 용어와 일치하는가?
         - 기존 도메인 패턴에서 벗어난 경우 이유가 타당한가?
         - @PlatformTransactional readOnly 설정이 올바른가?
         수정이 필요하면 말씀해주세요.
         승인(yes / ok / 확인 / 좋아)하면 issue-{N}.md에 기록합니다.

         ⚠️ 승인 전까지 파일에 기록하지 않는다.
```

수정 요청이 오면 반영 후 재확인한다.

---

## 단계 2: 시그니처 기록

승인된 시그니처를 `issue-{N}.md` **상단**에 기록한다.

- **파일이 없으면 새로 생성한다.**
  1. `issues.md`에서 Issue {N}의 제목·설명·`## Acceptance Criteria` 섹션 전체를 복사해 본문으로 삽입한다.
  2. 그 위에 아래 기록 형식에 따라 `## 시그니처` 섹션을 추가한다.
  - 이 복사가 없으면 이후 `tdd-green-be`·`ac-verifier-be`가 AC를 읽지 못해 동작 불능이 된다.
- **파일이 이미 있으면** 기존 내용 **위**에 `## 시그니처` 섹션만 삽입한다.
- 해당 사항이 없는 하위 섹션은 생략한다.

**기록 형식:**

> 해당 없는 섹션은 생략한다. (Controller·Service는 항상 포함. Repository·DTO·Helper는 조건부)

````markdown
## 시그니처

### Controller
```java
{승인된 Controller 시그니처}
```

### Service
```java
{승인된 Service 시그니처}
```

### Repository  ← 신규 메서드가 있는 경우만
```java
{승인된 Repository 시그니처}
```

### DTO  ← 신규 DTO가 있는 경우만
```java
{승인된 DTO 필드}
```

### Helper  ← 시그니처 명시 또는 Service 복잡도 초과 시만
```java
{승인된 Helper 시그니처}
```

---

{issues.md에서 복사한 Issue N 내용 — 제목·설명·## Acceptance Criteria (신규 파일일 때만 삽입)}
````

---

## 단계 3: 시나리오 도출 + AC 대조

### 시나리오 도출 규칙

- **테스트 코드는 작성하지 않는다.** 시나리오 설명문만 작성한다.
- 시나리오는 **두 레이어**로 분리한다: Service 단위 테스트 / Controller 슬라이스 테스트
- 분류는 **정상 / 경계 / 예외** 세 가지만 사용한다.
- **형식**: `[분류] {ClassName}.{method} — should {기대동작} when {조건}`

**분류 기준:**

| 분류 | 기준 | 예시 조건 |
|------|------|---------|
| 정상 | 의도한 대로 동작하는 케이스 | 유효한 입력, 정상 Repository 반환값 |
| 경계 | 입력 범위의 끝, 빈 컬렉션, 0·최대값 | 빈 목록 반환, page=0, pageSize=최대 |
| 예외 | 오류, 없는 엔티티, 비즈니스 규칙 위반 | entity 없음 → IllegalArgumentException, 중복 → IllegalStateException |

**레이어별 시나리오 작성 기준:**

| 레이어 | When | Then |
|--------|------|------|
| Service 단위 | `service.{method}(...)` 호출 | 반환값 검증 또는 예외 타입 검증 |
| Controller 슬라이스 | `mockMvc.perform(...)` 호출 | HTTP 상태코드 + 응답 JSON 경로 검증 |

### AC 대조

`issues.md`의 Issue {N} `## Acceptance Criteria` 항목을 기준으로 아래를 확인한다.

1. 모든 AC 항목에 최소 1개 이상의 시나리오가 있는지 확인한다.
2. 커버되지 않은 AC가 있으면 시나리오를 추가한다.
3. 시나리오 목록 하단에 AC 매핑 테이블을 작성한다.

**AC 매핑 테이블 형식:**

```markdown
### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| Given ..., When GET /api/.., Then 200 | [정상] {Controller}.{method} — ... |
| Given 없는 id, When GET /api/../99, Then 400 | [예외] {Service}.{method} — ..., [예외] {Controller}.{method} — ... |
```

---

## [GATE 2] 시나리오 승인

```
[GATE 2] 위 시나리오와 AC 커버리지를 검토해주세요.
         - Issue {N}의 모든 AC가 최소 1개 이상의 시나리오로 커버되었나요?
         - Service 레이어와 Controller 레이어가 모두 있나요?
         - IllegalArgumentException / IllegalStateException 예외 시나리오가 있나요?
         수정이 필요하면 말씀해주세요.
         승인(yes / ok / 확인 / 좋아)하면 issue-{N}.md 하단에 기록합니다.

         ⚠️ 승인 전까지 파일에 기록하지 않는다.
```

승인 후 아래 형식을 `issue-{N}.md` 하단에 추가한다.

````markdown
---

## 테스트 시나리오

### Service 단위 테스트

- [ ] [정상] {ServiceClass}.{method} — should {기대동작} when {조건}
- [ ] [경계] {ServiceClass}.{method} — should {기대동작} when {조건}
- [ ] [예외] {ServiceClass}.{method} — should throw IllegalArgumentException when {조건}

### Controller 슬라이스 테스트

- [ ] [정상] {ControllerClass}.{method} — should return {상태코드} when {조건}
- [ ] [경계] {ControllerClass}.{method} — should return {상태코드} when {조건}
- [ ] [예외] {ControllerClass}.{method} — should return 400 when {조건}

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| ... | ... |
````

승인이 완료되면 아래 메시지를 출력한다.

```
✅ issue-{N}.md 업데이트 완료
   - 상단: Java 시그니처 (Controller / Service / Repository / DTO)
   - 하단: 테스트 시나리오 + AC 커버리지

다음 단계: /tdd-red-be {N}  (실패하는 테스트 코드 작성)
```

---

## 승인 게이트 요약

| 지점 | 확인 내용 | 긍정 응답 예시 |
|------|----------|--------------|
| GATE 1 | 시그니처 — 용어 일치, 프로젝트 컨벤션 준수, readOnly 설정 | yes / ok / 확인 / 좋아 |
| GATE 2 | 시나리오 — AC 커버리지 완성도, Service·Controller 레이어 분리, 예외 케이스 | yes / ok / 확인 / 좋아 |

GATE가 없으면 잘못된 시그니처로 테스트가 작성되고 나중에 수정 비용이 커진다.
반드시 각 GATE에서 멈추고 사용자의 응답을 기다릴 것.
