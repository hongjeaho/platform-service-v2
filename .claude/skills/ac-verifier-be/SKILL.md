---
name: ac-verifier-be
description: |
  tdd-green-be 완료 후, AC 의도가 구현 코드에 반영되었는지 독립 검증하는 스킬. 구현 파일 수정 없음.
  "AC 검증"·"ac-verifier-be"·"Acceptance Criteria 독립 검증" 언급 시 이 스킬 사용.
---

# AC Verifier Workflow [백엔드 · Spring Boot]

`/tdd-green-be` 완료 후 **구현 코드를 직접 읽어** AC 충족 여부를 검증한다.
테스트가 통과했더라도 AC를 실제로 만족하는 코드가 있는지 추적한다.

> **핵심 전제**: 테스트 통과 ≠ AC 충족.
> 테스트가 AC를 잘못 해석했거나, 경계 조건이 빠졌을 수 있다.

**이 스킬은 어떤 구현 파일도 수정하지 않는다.**
미충족 AC가 발견되면 수정 방법을 제안하고, 개발자가 `/tdd-red-be {N}` → `/tdd-green-be {N}` 순서로 직접 처리한다.

---

## 입력 형식

```
/ac-verifier-be {N}                      ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/ac-verifier-be {feature-path} {N}      ← 경로 직접 지정 + 이슈 번호
```

---

## 컨텍스트 결정 (브랜치 중심 Single Source of Truth)

아래 4순위로 결정한다:
1순위 세션 [CONTEXT] 블록 → 2순위 브랜치 확인 + docs 검증 → 3순위 docs 폴더 탐색 → 4순위 직접 입력 요청.
보호 브랜치(main/master/develop/dev) 감지 시 즉시 중단.

---

## 진입 안내

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📦 모듈:   api/platform
📁 feature-path: notice/list
📄 읽기: ...notice/list/docs/issue-1.md
🔍 AC Verifier — 구현이 AC를 실제로 만족하는지 검증합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기 / 검증 결과 기록) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md` |
| 구현 파일 (읽기 전용) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/` 아래 전체 |
| 테스트 파일 (읽기 전용) | `api/{module-name}/src/test/java/{pkg-root}/{feature-path}/` 아래 전체 |

---

## 파이프라인 개요

```
/ac-verifier-be [{feature-path}] {N}
    ↓ 컨텍스트 결정 (세션 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ 단계 1: 전체 테스트 통과 확인 (기준선)
    ↓ 단계 2: issue-{N}.md에서 AC 목록 추출
    ↓ 단계 3: AC별 구현 추적 (Given → When → Then)
    ↓ 단계 4: 결과 보고 + 미충족 시 수정 방향 제안
```

---

## 단계 1: 전체 테스트 통과 확인

```bash
./gradlew :api:{module-name}:test 2>&1 \
  | grep -E "tests.*completed|BUILD (SUCCESSFUL|FAILED)|FAILED" | tail -10
```

**실패 테스트 존재 시** → 즉시 중단:

```
⛔ 실패하는 테스트가 있습니다 — AC 검증을 시작할 수 없습니다.
   /tdd-green-be {N} 을 먼저 완료해주세요.
```

---

## 단계 2: AC 목록 추출

`issue-{N}.md`의 `## Acceptance Criteria` 섹션에서 모든 AC를 읽는다.

파일이 없거나 AC 섹션이 없으면:

```
⚠️  issue-{N}.md에 Acceptance Criteria가 없습니다.
    /test-scenarios-be {N} → /tdd-red-be {N} → /tdd-green-be {N}
    순서로 먼저 실행해주세요.
```

---

## 단계 3: AC별 구현 추적

각 AC 항목을 아래 3단계로 추적한다. **테스트 코드가 아닌 구현 코드를 기준으로 검증**한다.

### 3-1. Given: 사전 조건 확인

AC의 `Given` 조건이 구현 코드에서 전제되는지 확인한다.

예) `Given 공지가 존재할 때` → Repository의 `findById` 또는 `findAll`이 실제로 존재하는가?

### 3-2. When: 진입점 확인

AC의 `When` HTTP 요청이 실제 Controller 엔드포인트에 매핑되는지 확인한다.

```
When GET /api/public/notice
→ @GetMapping이 해당 URI에 존재하는가?
→ 인증 설정이 prd.md 접근 권한과 일치하는가? (public vs JWT)
```

### 3-3. Then: 결과 검증

| Then 유형 | 확인 항목 |
|---------|---------|
| 상태코드 200 | `ResponseEntity.ok(...)` 또는 `@ResponseStatus` |
| 상태코드 201 | `ResponseEntity.status(HttpStatus.CREATED)` |
| 상태코드 204 | `ResponseEntity.noContent().build()` |
| 상태코드 400 | `IllegalArgumentException` throw → GlobalExceptionHandler |
| 상태코드 409 | `IllegalStateException` throw → GlobalExceptionHandler |
| 응답 바디 필드 | DTO 필드명과 `ApiResult<T>` 구조 |
| 예외 메시지 | throw 시 메시지 문자열 |

### 충족 판정 기준

| 판정 | 조건 |
|------|------|
| ✅ 충족 | Given·When·Then 세 조건 모두 구현 코드에서 추적 가능 |
| ⚠️ 부분 충족 | 구현은 있으나 경계 조건·예외 메시지가 AC와 다름 |
| ❌ 미충족 | When 진입점 없음, 또는 Then 결과가 구현 코드에 없음 |

### 부분 충족 처리 기준

⚠️ 부분 충족 발견 시 아래 기준으로 처리 방식을 결정한다.

| 부분 충족 유형 | 처리 방식 |
|-------------|---------|
| 경계값·예외 메시지가 AC와 다름 | /tdd-red-be → /tdd-green-be로 보완 후 재검증 |
| HTTP 상태코드 불일치 (예: 200 vs 201) | **즉시 보완 필요** — API 계약 위반 |
| 응답 DTO 필드명·구조 불일치 | **즉시 보완 필요** — API 계약 위반 |
| 로깅·성능 관련 AC (예: "1초 이내 응답") | 별도 이슈로 분리, 현재 PR은 진행 가능 |

---

## 단계 4: 결과 보고

모든 AC 검증 완료 후 아래 형식으로 보고한다.

```
🔍 AC Verifier 결과 — issue-{N}

---
✅ 충족 ({N}건)
---
AC-1: Given 공지 존재, When GET /api/public/notice, Then 200 + 목록
  → NoticeController.getList() @GetMapping → NoticeService.getList() → Repository.findAll() ✅

AC-2: Given 없는 id, When GET /api/public/notice/99, Then 400
  → Service.getDetail() → IllegalArgumentException → GlobalExceptionHandler(400) ✅

---
⚠️  부분 충족 ({N}건)
---
AC-3: Given 중복 제목, When POST /api/notice, Then 409
  → Service에 중복 체크 로직 없음 — 테스트는 통과했으나 실제 중복 입력 시 DB 오류(503) 발생 가능

---
❌ 미충족 ({N}건)
---
AC-4: Given pageSize=0, When GET /api/public/notice?pageSize=0, Then 400
  → @Valid 없음, @Min(1) 없음 — pageSize=0 입력 시 빈 목록 반환

---
요약: ✅ {N}건 / ⚠️ {N}건 / ❌ {N}건
```

**모든 AC 충족 시:**

`issue-{N}.md` **최하단**에 아래 섹션을 추가한 뒤 완료 메시지를 출력한다.

```markdown
---

## AC 검증

검증일: {YYYY-MM-DD}
결과: ✅ 모든 AC 충족 ({N}건)
```

```
✅ 모든 AC가 구현 코드에서 충족됩니다.
   issue-{N}.md에 검증 결과가 기록되었습니다.

다음 단계: /tdd-refactor-be {N}  (코드 구조 개선)
```

**미충족·부분 충족 항목이 있을 때:**

`issue-{N}.md` **최하단**에 아래 섹션을 추가한 뒤 **중단**한다.

```markdown
---

## AC 검증

검증일: {YYYY-MM-DD}
결과: ⚠️ 미충족/부분 충족 항목 있음 (✅ {N}건 / ⚠️ {N}건 / ❌ {N}건)
```

그 다음 아래 GATE 메시지를 출력하고 중단한다. `/tdd-refactor-be` 다음 단계를 안내하지 않는다.

```
⛔ AC 미충족 — tdd-refactor-be로 진행할 수 없습니다.
   ⚠️/❌ 항목을 아래 순서로 처리한 뒤 /ac-verifier-be {N}을 다시 실행해주세요.
   누락된 테스트를 먼저 추가한 뒤 구현을 작성해야 TDD 원칙이 유지됩니다.

   1. issue-{N}.md의 ## 테스트 시나리오에 누락 시나리오를 수동 추가  ← 개발자가 직접 편집
   2. /tdd-red-be {N}   — 누락된 테스트 코드 작성
   3. /tdd-green-be {N} — 테스트 통과 구현 추가
   4. /ac-verifier-be {N} — 재검증 후 모든 AC ✅ 확인

   [AC-3] 중복 체크 로직 추가
     → NoticeService.create()에 Repository.existsByTitle() 호출 후 IllegalStateException throw

   [AC-4] @Min(1) 제약 추가
     → NoticeListRequest.pageSize 필드에 @Min(1) 추가

   모든 AC가 ✅가 될 때까지 tdd-refactor-be를 실행하지 마세요.
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 구현 파일 수정 | 금지 — issue-{N}.md 검증 결과 기록만 예외 |
| 검증 기준 | 테스트 코드가 아닌 구현 코드 직접 추적 |
| 판정 근거 | 근거 없는 판정 금지 — 반드시 구체적 코드 위치를 명시 |
