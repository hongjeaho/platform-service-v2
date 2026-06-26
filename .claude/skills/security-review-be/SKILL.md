---
name: security-review-be
description: |
  커밋 전 Spring Boot 보안 취약점·패턴 위반·코드 품질 점검 스킬. 즉시 수정/권장/무시 3분류 보고.
  "백엔드 보안 검토"·"보안 취약점"·"security-review-be" 언급 시 이 스킬 사용.
---

# Security Review Workflow [백엔드 · Spring Boot]

`/tdd-refactor-be` 완료 후 **커밋 전** 보안 취약점·Spring Boot 패턴 위반·코드 품질을 일괄 점검하는 파이프라인.
발견된 이슈를 세 분류로 나눠 개발자에게 보고하고, 승인 후 "즉시 수정 필요" 항목만 처리한다.

---

## 입력 형식

```
/security-review-be {N}                        ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/security-review-be {feature-path} {N}        ← 경로 직접 지정 + 이슈 번호
```

---

## 컨텍스트 결정

아래 4순위로 결정한다:
1순위 세션 [CONTEXT] 블록 → 2순위 첫 토큰 `/` 포함 경로 직접 지정 → 3순위 `git branch --show-current` (`feature/*` 파싱) → 4순위 직접 입력 요청.
보호 브랜치(main/master/develop/dev) 감지 시 즉시 중단.

---

## 진입 안내

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📦 모듈:   api/platform + datasource/platform
📁 feature-path: notice/list
📄 읽기: ...notice/list/docs/issue-1.md
🔐 Security Review — 보안 취약점·패턴 위반·코드 품질을 점검합니다.
```

---

## 기본 브랜치 결정

수정 범위 산출에 사용할 기본 브랜치를 동적으로 탐지한다.

```bash
# 1순위: 원격 HEAD 브랜치
git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | sed 's|origin/||'

# 결과 없으면 2순위: 로컬 main → master 순
git show-ref --verify --quiet refs/heads/main && echo main || echo master
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기 · 쓰기) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md` |
| 점검 대상 파일 | `git diff {기본브랜치}...HEAD --name-only -- api/ datasource/` 결과 중 비테스트 파일 |

---

## 파이프라인 개요

```
/security-review-be [{feature-path}] {N}
    ↓ 컨텍스트 결정
    ↓ 단계 1: 빌드 컴파일 검사
    ↓ 단계 2: 하드코딩 시크릿 grep
    ↓ 단계 3: Spring Boot 패턴 위반 검사 (6가지)
    ↓ 단계 4: 코드 품질 정적 분석
    ↓ 단계 5: 결과 세 분류로 정리 후 보고 [GATE]
    ↓ 단계 6: 승인 후 "즉시 수정 필요" 항목만 처리 (항목 없으면 건너뜀)
    ↓ 단계 7: 재확인 → issue-{N}.md 기록
```

---

## 단계 1: 빌드 컴파일 검사

```bash
./gradlew :api:{module-name}:build -x test 2>&1 | tail -50
```

컴파일 오류가 있으면 **즉시 수정 필요**로 분류한다.
컴파일 오류가 존재하는 상태에서는 나머지 단계를 진행하지 않는다.

---

## 단계 2: 하드코딩 시크릿 grep

`api/` 및 `datasource/` 내 변경 파일에서 아래 패턴을 순서대로 확인한다.

```bash
# 패턴 1: 하드코딩 토큰·키 (테스트·빌드 디렉토리 제외)
grep -rEn "Bearer [A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}" \
  --exclude-dir=build --exclude-dir=out --exclude-dir=.gradle --exclude-dir=test \
  api/ datasource/

# 패턴 2: 시크릿 변수명에 값 직접 할당 (테스트·빌드 디렉토리 제외)
grep -rEn "(API_KEY|SECRET|PASSWORD|JWT_SECRET|TOKEN)\s*=\s*['\"][^'\"]{8,}" \
  --exclude-dir=build --exclude-dir=out --exclude-dir=.gradle --exclude-dir=test \
  api/ datasource/

# 패턴 3: 설정 파일에 패스워드 하드코딩 (test 디렉토리 제외 — 테스트 DB 설정은 의도적 허용)
grep -rEn "password:\s*[^\$\{]" \
  --exclude-dir=build --exclude-dir=out --exclude-dir=.gradle --exclude-dir=test \
  --include="*.yml" --include="*.yaml" api/ datasource/
# Flyway SQL 파일도 별도 확인 (위 grep에서 *.sql은 제외되므로)
grep -rEn "password\s*[=:]\s*['\"][^'\"]" datasource/ --include="*.sql"
```

발견된 항목은 무조건 **즉시 수정 필요**로 분류한다.

---

## 단계 3: Spring Boot 패턴 위반 검사

변경 파일 내에서 아래 6가지 패턴 위반을 순서대로 확인한다.

### 3-1. Controller try-catch 금지

```bash
# Controller 파일에 try-catch 블록이 있는지 확인 (src/main/만 대상)
grep -rEn "try\s*\{" api/{module-name}/src/main/java/{pkg-root}/{feature-path}/controller/
```

Controller에 try-catch가 있으면 **즉시 수정 필요**.
예외는 Service에서 throw하고 GlobalExceptionHandler가 처리해야 한다.

### 3-2. @Valid 누락 검사

```bash
# Controller 파일 전체를 읽어 @RequestBody 파라미터에 @Valid 누락 여부를 확인한다
# (grep은 맥락 파악이 어려우므로 파일을 직접 읽어 검토한다)
find api/{module-name}/src/main/java/{pkg-root}/{feature-path}/controller \
  -name "*.java" | xargs grep -l "@RequestBody"
```

위 명령으로 `@RequestBody`를 사용하는 Controller 파일 목록을 구한 뒤,
**각 파일을 직접 읽어** `@RequestBody` 앞에 `@Valid`가 없는 파라미터가 있는지 확인한다.

예) 아래는 **누락** 패턴:
```java
public ResponseEntity<?> create(@RequestBody NoticeCreateRequest req)  // ❌ @Valid 없음
```
아래는 **정상** 패턴:
```java
public ResponseEntity<?> create(@RequestBody @Valid NoticeCreateRequest req)  // ✅
```

`@Valid` 없이 `@RequestBody`만 있으면 **즉시 수정 필요**.

### 3-3. Helper 위반 검사 (Repository 주입 / 트랜잭션)

```bash
# @RequiredArgsConstructor 기반 생성자 주입 — private final 필드로 감지 (@Autowired 필드 주입도 방어적으로 포함)
# Repository / Dao / Store / Mapper 접미사 모두 포함
grep -rEn "private final.*(Repository|Dao|Store|Mapper)|@Autowired" api/{module-name}/src/main/java/{pkg-root}/{feature-path}/service/helper/

# helper/ 디렉토리 내 @Transactional 또는 @PlatformTransactional 확인
grep -rEn "@Transactional|@PlatformTransactional" api/{module-name}/src/main/java/{pkg-root}/{feature-path}/service/helper/
```

Helper에 Repository 주입이나 트랜잭션 어노테이션이 있으면 **즉시 수정 필요**.

### 3-4. Flyway 우회 DDL 확인

```bash
# 구현 코드에서 DDL 직접 실행 (JdbcTemplate.execute 등)
grep -rEn "execute\s*\(\s*['\"]CREATE|execute\s*\(\s*['\"]ALTER|execute\s*\(\s*['\"]DROP" api/ datasource/
```

발견되면 **즉시 수정 필요**. 스키마 변경은 Flyway SQL로만 해야 한다.

### 3-5. 잘못된 예외 타입 사용

```bash
# RuntimeException, Exception을 직접 throw하는 코드 확인
grep -rEn "throw new RuntimeException|throw new Exception" api/{module-name}/src/main/java/{pkg-root}/{feature-path}/service/
```

`RuntimeException`·`Exception`을 직접 throw하면 **권장 수정**.
`IllegalArgumentException`(400) 또는 `IllegalStateException`(409)으로 교체해야 한다.

### 3-6. SecurityConfig 엔드포인트 정합성

`prd.md`가 있는 경우 API 명세 섹션에서 "인증 불필요 / JWT 필요 / ADMIN 전용" 설정을 읽어,
실제 Controller의 URI prefix와 어노테이션이 일치하는지 확인한다.

**prd.md가 없는 경우:** 이 검사를 건너뛰고 아래와 같이 표시한다.
```
3-6 skip — prd.md 없음 (SecurityConfig 정합성 검사는 prd.md 기반이므로 수동 확인 권장)
```

| prd.md 명세 | 기대 URI prefix | 추가 확인 |
|-----------|--------------|---------|
| 인증 불필요 | `/api/public/{domain}/**` | — |
| JWT 인증 필요 | `/api/{domain}/**` | — |
| ADMIN 전용 | `/api/{domain}/**` | `@PreAuthorize("hasAuthority('ADMIN')")` 존재 여부 |

**URI prefix 확인:**

```bash
grep -rn "@RequestMapping\|@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping" \
  api/{module-name}/src/main/java/{pkg-root}/{feature-path}/controller/
```

**ADMIN 전용 엔드포인트 추가 확인 (prd.md에 ADMIN 전용이 명시된 경우만):**

```bash
grep -rn "@PreAuthorize" \
  api/{module-name}/src/main/java/{pkg-root}/{feature-path}/controller/
```

결과가 비어 있으면 **즉시 수정 필요** — `@PreAuthorize("hasAuthority('ADMIN')")` 누락.

URI prefix 불일치 또는 ADMIN 전용인데 `@PreAuthorize` 없으면 **즉시 수정 필요**.

---

## 단계 4: 코드 품질 정적 분석

변경된 구현 파일 각각을 아래 기준으로 확인한다.

### 4-1. Swagger 어노테이션 누락 grep

```bash
# Controller 클래스에 @Tag 없는 파일 탐지
grep -rLn "@Tag" api/{module-name}/src/main/java/{pkg-root}/{feature-path}/controller/

# @GetMapping/@PostMapping 등 엔드포인트 메서드 목록 추출 — 파일 직접 읽어 @Operation 누락 확인
grep -rn "@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping\|@PatchMapping" \
  api/{module-name}/src/main/java/{pkg-root}/{feature-path}/controller/
```

`-L` 옵션 결과(매칭 없는 파일 목록)에 파일이 있으면 `@Tag` 누락 → **즉시 수정 필요**.
엔드포인트 메서드 위에 `@Operation`이 없으면 → **즉시 수정 필요**.

### 4-2. 나머지 항목 (파일 직접 읽어 확인)

| 항목 | 기준 | 분류 |
|------|------|------|
| 민감 정보 로깅 | 비밀번호·토큰·개인정보를 `log.info/debug`로 출력 | 즉시 수정 필요 |
| SQL 동적 문자열 조합 | MyBatis Mapper에서 `${}` 파라미터 사용 (SQL Injection 위험) | 즉시 수정 필요 |
| `@Transactional` 직접 사용 | `@PlatformTransactional` 대신 Spring 기본 사용 | 권장 수정 |
| 응답 DTO에 엔티티 직접 노출 | `{Domain}Entity`를 Controller에서 직접 반환 | 권장 수정 |
| Request DTO에 내부 ID 필드 노출 | `id`, `seqNo`, `createdBy` 등 DB 생성 필드가 Request에 존재 (Mass Assignment 위험) | 권장 수정 |
| `@PageableDefault` 누락 | `Pageable` 파라미터를 사용하는 경우에만 해당. 기본값 없음 — 무한 페이지 크기 허용 위험. `int page, int pageSize` 직접 파라미터 방식은 해당 없음 | 권장 수정 |
| 미사용 import | 컴파일은 되나 사용하지 않는 import 다수 | 무시 가능 |
| TODO 주석 잔존 | 구현 파일에 `// TODO` 주석 | 무시 가능 |

---

## 단계 5: 결과 분류 및 보고 [GATE]

수집된 결과를 세 분류로 정리해 개발자에게 출력한다.

### 분류 기준

| 분류 | 포함 항목 |
|------|----------|
| **즉시 수정 필요** | 컴파일 오류, 하드코딩 시크릿, Controller try-catch, @Valid 누락, Helper 위반(Repository/Dao/Store/Mapper 주입·트랜잭션), DDL 직접 실행, 잘못된 URI/인증 설정, 민감 정보 로깅, SQL Injection `${}`, Swagger 어노테이션 누락(`@Tag`·`@Operation`) |
| **권장 수정** | `RuntimeException` 직접 사용, `@Transactional` 직접 사용, 엔티티 직접 노출, Request DTO 내부 ID 필드 노출, `@PageableDefault` 누락 (`Pageable` 파라미터 사용 시에만) |
| **무시 가능** | 미사용 import, TODO 주석 |

### 출력 형식

```
🔐 Security Review 결과 — issue-{N}

---
⛔ 즉시 수정 필요 ({N}건)
---
[try-catch] NoticeController.java:34
  — Controller에 try-catch 블록 존재. Service에서 throw → GlobalExceptionHandler로 처리할 것.

[valid] NoticeController.java:28
  — @RequestBody NoticeCreateRequest 에 @Valid 누락.

[secret] datasource/platform/flyway/V20260101__init.sql:5
  — password: 'plaintext123' 하드코딩.

---
⚠️  권장 수정 ({N}건)
---
[exception] NoticeService.java:55
  — throw new RuntimeException(...) → IllegalArgumentException 또는 IllegalStateException으로 교체 권장.

---
✅ 무시 가능 ({N}건)
---
[import] NoticeService.java:5 — 미사용 import java.util.Map

수정 항목을 처리할까요?
(즉시 수정만 / 즉시 수정 + 권장 수정 전체 / 즉시 수정 + 권장 수정 일부 선택 — 예: "즉시 전체, 권장 1번" / 취소)
```

**즉시 수정 필요 항목이 없는 경우:**

```
✅ 즉시 수정 필요 항목 없음

권장 수정 {N}건을 함께 처리할까요?
(전체 처리 / 항목별 선택 — 예: "1번만" / 생략)
```

---

## 단계 6: 수정 항목 처리

개발자 승인 확인 후 승인된 항목을 순서대로 처리한다.
"즉시 수정 필요" → "권장 수정" 순서로 처리하며, 각 처리 후 전체 테스트를 재실행한다.

### 수정 원칙

- `git diff {기본브랜치}...HEAD --name-only -- api/ datasource/` 결과 파일 범위 내에서만 수정
- `src/test/` 파일 수정 금지
- 수정 후 전체 테스트 재실행해 회귀 없음 확인:
  ```bash
  ./gradlew :api:{module-name}:test 2>&1 | tail -50
  ```

### 항목 진행 중 상태 출력

```
🔧 [즉시-1/3] Controller try-catch 제거 — NoticeController.java:34
   → try-catch 블록 제거, 예외를 Service에서 throw하도록 이동
   → ./gradlew :api:platform:test ... ✅ 전체 통과

🔧 [즉시-2/3] @Valid 추가 — NoticeController.java:28
   → @RequestBody 앞에 @Valid 추가
   → ./gradlew :api:platform:test ... ✅ 전체 통과

🔧 [즉시-3/3] 하드코딩 패스워드 제거 — flyway/V20260101__init.sql:5
   → 처리 옵션 (아래 중 하나 선택):
      A. Flyway placeholder 활용: SQL에서 ${password}로 교체 후
         application.yml에 spring.flyway.placeholders.password: ${DB_PASSWORD} 추가
      B. 초기 데이터 SQL에서 민감 값 제거 — 앱 레이어(Service)에서 처리하도록 이동 (권장)
   → ./gradlew :api:platform:build -x test ... ✅ 컴파일 통과

🔧 [권장-1/1] RuntimeException 교체 — NoticeService.java:55
   → throw new RuntimeException → IllegalArgumentException으로 교체
   → ./gradlew :api:platform:test ... ✅ 전체 통과
```

---

## 단계 7: 재확인 및 issue-{N}.md 기록

### 재확인

```bash
./gradlew :api:{module-name}:build -x test 2>&1 | tail -50   # 컴파일 오류 0건
./gradlew :api:{module-name}:test 2>&1 | tail -50             # 전체 테스트 통과
```

**클린 기준:** 두 조건 모두 충족 시 통과.
조건 미충족 시 단계 6으로 돌아가 추가 처리한다.

### issue-{N}.md 하단 기록

클린 기준 충족 후 `issue-{N}.md` **최하단**에 아래 섹션을 추가한다.

```markdown
---

## 보안 검토

검토일: {YYYY-MM-DD}

### 즉시 수정 필요 (처리 완료)
- [x] Controller try-catch 제거 — NoticeController.java
- [x] @Valid 추가 — NoticeController.java
- [x] 하드코딩 패스워드 제거 — flyway SQL

### 권장 수정
- [x] RuntimeException → IllegalArgumentException 교체 — NoticeService.java  ← 처리한 경우
- [-] @PageableDefault 누락 — NoticeController.java (생략)                    ← 생략한 경우

### 무시 가능
- 미사용 import — 컴파일에 영향 없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건
- [x] ./gradlew test: 전체 통과
```

> **기록 규칙**: 권장 수정 항목은 반드시 `[x]`(처리 완료) 또는 `[-]`(생략 결정) 중 하나로 기록한다.
> `- [ ]`(미결정)는 남기지 않는다 — `/create-pr-be` 사전 체크가 `- [ ]` 존재 시 차단한다.

### 완료 출력

```
✅ Security Review 완료 — issue-{N}

📋 처리 완료:
  ✅ 즉시 수정 필요 {N}건 처리 완료
  ✅ 권장 수정 {N}건 처리 완료 / {N}건 생략

🧪 최종 테스트: {통과 수}/{전체 수} 통과
📝 보안 검토 결과가 issue-{N}.md 하단에 기록되었습니다.

➡️  다음 이슈가 남아 있으면: /test-scenarios-be {N+1}  (다음 이슈 TDD 사이클 시작)
    모든 이슈 완료 후 마지막에: git commit → /create-pr-be
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 수정 범위 | `git diff` 결과 파일 범위 내에서만 수정 |
| 테스트 파일 수정 | 금지 (`src/test/` 전체) |
| 승인 전 수정 | 단계 5 승인 전 코드 변경 금지 |
| 강제 수정 | `--force` 옵션 사용 금지 |

---

## 승인 게이트

단계 5에서 분류 결과를 보고한 뒤 반드시 개발자 승인을 기다린다.
즉시 수정 필요 항목이 없으면 권장 수정 처리 여부만 확인 후 단계 7로 진행한다.
권장 수정은 처리(`[x]`) 또는 생략(`[-]`) 중 하나를 반드시 선택한다 — `- [ ]` 미결 상태로 기록하지 않는다.

issue-{N}.md 파일이 없는 경우:
```
⚠️  issue-{N}.md 파일이 없습니다.
    /test-scenarios-be {N} → /tdd-red-be {N} → /tdd-green-be {N}
    → /ac-verifier-be {N} → /tdd-refactor-be {N} 순서로 먼저 실행해주세요.
```
