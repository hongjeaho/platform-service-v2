---
name: tdd-refactor-be
description: |
  ac-verifier-be 완료 후, 테스트 통과 상태를 유지하며 백엔드 코드 구조를 개선하는 TDD Refactor 스킬. 새 기능 추가 없음.
  "백엔드 리팩토링"·"tdd-refactor-be"·"Helper 추출" 언급 시 이 스킬 사용.
---

# TDD Refactor Workflow [백엔드 · Spring Boot]

`/tdd-green-be`가 통과시킨 **모든 테스트를 깨뜨리지 않으면서** 코드 구조를 개선하는 파이프라인.
`CLAUDE.md` 컨벤션을 기준으로 패턴 일관성을 유지한다.

---

## 입력 형식

```
/tdd-refactor-be {N}                      ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/tdd-refactor-be {feature-path} {N}      ← 경로 직접 지정 + 이슈 번호
```

---

## 컨텍스트 결정 (브랜치 중심 Single Source of Truth)

아래 3순위로 결정한다:
1순위 브랜치 확인 + docs 검증 → 2순위 docs 폴더 탐색 → 3순위 직접 입력 요청.
보호 브랜치(main/master/develop/dev) 감지 시 즉시 중단.

---

## 진입 안내

```
🌿 브랜치: feature/notice/list/목록-조회        ← 브랜치 추론 시에만 표시
📦 모듈:   api/platform + datasource/platform
📁 feature-path: notice/list
📄 읽기: ...notice/list/docs/issue-1.md
🔵 TDD Refactor — 테스트를 유지하며 코드 구조를 개선합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md` |
| 수정 대상 파일 | `git diff {base}...HEAD --name-only -- api/ datasource/` 결과 중 비테스트 파일 |
| 참고 | 동일 모듈 내 기존 도메인 (`find api/{module-name}/src/main/java/{pkg-root} -name "*Service.java"`) |

---

## 파이프라인 개요

```
/tdd-refactor-be [{feature-path}] {N}
    ↓ 컨텍스트 결정
    ↓ 단계 1: CLAUDE.md 읽기 → 프로젝트 컨벤션 파악
    ↓ 단계 2: 전체 테스트 통과 확인 (실패 시 즉시 중단)
    ↓ 단계 3: 리팩토링 대상 파일 식별
    │   ├─ git diff로 변경 파일 추출
    │   ├─ 이슈 관련 파일만 교집합 추출
    │   ├─ src/test/ 파일 제외
    │   └─ 7가지 점검 기준 적용
    ↓ 단계 4: 리팩토링 대상 보고 → 개발자 승인 대기 [GATE]
    ↓ 단계 5: 승인 항목 하나씩 리팩토링 〈피드백 루프〉
    │   ├─ 변경 → 전체 테스트 실행 → 통과 → 다음 항목
    │   ├─ 실패 → 즉시 롤백 → 다른 방식으로 1회 재시도
    │   └─ 재시도도 실패 → 건너뜀 + 사용자 보고
    ↓ 단계 6: 결과 요약
```

---

## 단계 1: CLAUDE.md 읽기

프로젝트 루트 `CLAUDE.md`와 `api/{module-name}/CLAUDE.md`를 읽어 아래 항목을 파악한다.

- 계층별 책임 (Controller / Service / Helper / DTO)
- Helper 추출 기준 (200줄 / private 5개)
- Helper 역할 접미사 규칙 (Validator / Calculator / Converter / Sender / Builder / Processor) — feature-planner-be에서 정의된 목록 참조
  ※ Reader는 Helper가 아닌 Service 레이어 컴포넌트 (@Service, Repository 주입 허용, @PlatformTransactional(readOnly=true))
- 트랜잭션 규칙 (`@PlatformTransactional`)
- 네이밍 규칙 (클래스명, 메서드명, DTO명)

이 정보는 단계 3의 점검 기준에 사용한다.

---

## 단계 2: 전체 테스트 통과 확인

```bash
./gradlew :api:{module-name}:test 2>&1 | tail -50
```

**전체 통과** → 단계 3으로 진행.

**실패 테스트 존재 시** → 즉시 중단:

```
⛔ 실패하는 테스트가 있습니다 — 리팩토링을 시작할 수 없습니다.

실패 테스트:
  - {패키지}.{ClassName}#{methodName}

/tdd-green-be {N} 을 먼저 실행해 모든 테스트를 통과시켜주세요.
```

---

## 단계 3: 리팩토링 대상 파일 식별

### 3-1. 변경 파일 추출

```bash
# 1순위: 원격 HEAD 브랜치
BASE=$(git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | sed 's|origin/||')

# 결과 없으면 2순위: 로컬 main → master 순
if [ -z "$BASE" ]; then
  git show-ref --verify --quiet refs/heads/main && BASE=main || BASE=master
fi

# BASE 확정 후 실제 존재 여부 검증
git show-ref --verify --quiet "refs/heads/${BASE}" 2>/dev/null || \
git show-ref --verify --quiet "refs/remotes/origin/${BASE}" 2>/dev/null

git diff ${BASE}...HEAD --name-only -- api/ datasource/
```

탐지 실패 시 (변경 파일 목록이 비어 있거나 git 오류 발생):

```
⚠️  기본 브랜치를 자동으로 탐지하지 못했습니다.
    아래 중 하나를 실행한 뒤 /tdd-refactor-be {N} 을 다시 실행해주세요.

    # 원격 HEAD 설정 (가장 권장)
    git remote set-head origin -a

    # 또는 기본 브랜치를 직접 확인
    git branch -a
```

### 3-2. 이슈 관련 파일 교집합

`issue-{N}.md`의 `## 시그니처` 섹션에 선언된 클래스명(Controller·Service·Repository·Helper 등)을 기반으로,
git diff 결과와 교집합을 추출한다.
이슈와 무관한 파일(타 도메인 수정 등)은 목록에서 제거한다.

> ※ `## Acceptance Criteria`는 Given-When-Then 동작 설명이므로 클래스명을 포함하지 않는다.
>    반드시 `## 시그니처` 섹션을 참조할 것.

### 3-3. 테스트 파일 제외

`src/test/` 하위 파일 전부를 목록에서 제거한다.

### 3-4. 7가지 점검 기준 적용

남은 파일 각각을 아래 기준으로 검토한다.

| 기준 | 점검 내용 |
|------|---------|
| **Helper 추출** | Service가 200줄 초과 또는 private 메서드 5개 이상인가 |
| **중복 제거** | 같은 로직이 2곳 이상 반복되는가 |
| **네이밍 명확성** | 클래스·메서드·DTO 이름이 CLAUDE.md 네이밍 규칙을 따르는가 |
| **단일 책임** | 하나의 클래스/메서드가 너무 많은 역할을 담당하는가 |
| **트랜잭션 경계** | `@PlatformTransactional` 적용 단위가 올바른가 (Helper·Repository에 적용 금지) |
| **프로젝트 컨벤션 일관성** | `CLAUDE.md` 컨벤션(레이어 책임·네이밍·트랜잭션)에서 벗어난 구조가 있는가. 벗어난다면 이유가 ADR에 기록되었는가 |
| **Converter 추출** | 아래 중 하나에 해당하면 `{Domain}Converter` Helper로 추출: 1) 동일 변환 로직이 복수 Service 클래스에 중복 존재하는 경우 (같은 Service 내 private 메서드 재호출은 해당 없음) / 2) 비즈니스 분기(if·switch)가 포함된 변환 로직이 재사용되거나 복잡한 경우 (null 방어용 단순 ternary·Optional 제외) / 3) 복수 엔티티를 조합하는 변환 (Service SRP 침해). 단순 필드 복사 수준의 변환은 Service private 메서드로 유지 |

개선이 필요한 항목만 목록에 남긴다.

---

## 단계 4: 리팩토링 대상 보고 및 승인 [GATE]

분석 결과를 아래 형식으로 출력하고 개발자 승인을 기다린다.

```
🔍 리팩토링 대상 분석 결과

📁 대상 파일 ({N}개):
  1. api/platform/src/.../service/NoticeListService.java
     → Helper 추출: Service 230줄 — 검증 로직을 NoticeListValidator로 분리 권장
  2. api/platform/src/.../controller/NoticeListController.java
     → 네이밍: getNoticeListItems() → getList() (CLAUDE.md 네이밍 규칙 불일치)
  3. datasource/platform/src/.../repository/NoticeListRepository.java
     → 중복: findByCondition 패턴이 3곳에서 반복

리팩토링을 진행할까요?
(전체 승인 / 취소 / 특정 번호만 선택 가능 — 예: "1, 3번만")
```

**개선 항목이 없는 경우:**

```
✅ 리팩토링 대상 없음

변경된 파일을 검토했으나 개선이 필요한 항목이 없습니다.
프로젝트 컨벤션과 일관성이 유지되고 있습니다.
```

개선 항목이 없더라도 `issue-{N}.md` **최하단**에 아래 섹션을 추가한 뒤 단계 6으로 진행한다.

```markdown
## 리팩토링 결과
리팩토링일: {YYYY-MM-DD}
완료: 0건 / 건너뜀: 0건
```

---

## 단계 5: 피드백 루프 리팩토링

승인된 항목을 하나씩 순서대로 처리한다.

### 처리 흐름

1. 리팩토링 변경 적용
2. 전체 테스트 실행:
   ```bash
   ./gradlew :api:{module-name}:test 2>&1 | tail -50
   ```
3. **전체 통과** → 다음 항목으로 이동
4. **실패 발생** → Edit 도구로 변경한 내용을 직접 원복 → 다른 방식으로 1회 재시도
5. **재시도도 실패** → 건너뜀 + 사용자 보고:
   ```
   ⚠️ 건너뜀: {파일명}
   원인: {테스트 실패 이유 요약}
   다른 접근 방식도 실패했습니다. 수동 확인이 필요합니다.
   ```

### Helper 추출 시 준수 사항

```java
// ✅ Helper 올바른 예시
@Component
@RequiredArgsConstructor
public class NoticeListValidator {

    // Repository 주입 금지 — DB 접근은 Service에서만
    // @Autowired NoticeListRepository X ← 금지

    public void validateCreate(NoticeListCreateRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("제목은 필수입니다.");
        }
    }
}

// Service에서 Helper 사용
@Service
@RequiredArgsConstructor
public class NoticeListService {

    private final NoticeListRepository noticeListRepository;
    private final NoticeListValidator noticeListValidator; // Helper 주입

    @PlatformTransactional
    public NoticeListResponse create(NoticeListCreateRequest request) {
        noticeListValidator.validateCreate(request); // 검증 위임
        Long seq = noticeListRepository.save(...);
        return toResponse(noticeListRepository.findById(seq));
    }
}
```

### 항목 진행 중 상태 출력 예시

```
🔵 [1/3] NoticeListService.java — NoticeListValidator 추출 중...
   → ./gradlew :api:platform:test ... ✅ 전체 통과
🔵 [2/3] NoticeListController.java — 메서드명 리네임 중...
   → ./gradlew :api:platform:test ... ✅ 전체 통과
🔵 [3/3] NoticeListRepository.java — 중복 쿼리 추출 중...
   → ./gradlew :api:platform:test ... ❌ 실패 → 롤백 후 재시도
   → ./gradlew :api:platform:test ... ❌ 재시도도 실패 → 건너뜀
```

---

## 단계 6: 결과 요약

```
✅ TDD Refactor 완료 — issue-{N}

📋 리팩토링 완료 항목:
  ✅ NoticeListService.java — 검증 로직을 NoticeListValidator로 분리 (Helper 추출)
  ✅ NoticeListController.java — getNoticeListItems() → getList() 리네임 (패턴 일관성)

⚠️ 건너뜀 항목: (있으면 표시)
  - NoticeListRepository.java — 중복 쿼리 추출 시 JOOQ DSL 타입 에러 미해결 (수동 확인 필요)

🧪 최종 테스트: {통과 수}/{전체 수} 통과
```

결과 요약 출력 후 `issue-{N}.md` 최하단에 아래 섹션을 추가한다.

```markdown
## 리팩토링 결과
리팩토링일: {YYYY-MM-DD}
완료: {N}건 / 건너뜀: {N}건
```

### 다음 단계

```
➡️  다음 단계: /security-review-be {N}  (보안 취약점·패턴 위반·코드 품질 점검)
    이후: git commit → /create-pr-be
    전체 백엔드 이슈 사이클:
      test-scenarios-be → tdd-red-be → tdd-green-be → ac-verifier-be
      → tdd-refactor-be → security-review-be → create-pr-be
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 새 기능 추가 | 금지 — 동작 변경 없이 구조만 개선 |
| 테스트 파일 수정 | 금지 (`src/test/` 전체) |
| 수정 범위 | git diff 결과 중 이슈 관련 비테스트 파일만 |
| Helper | Repository 주입 금지, 트랜잭션 시작 금지 |
| 피드백 루프 | 실패 시 1회 재시도 후 건너뜀 — 무한 반복 금지 |
| 승인 전 수정 | 단계 4 승인 전 코드 변경 금지 |

---

## 승인 게이트

단계 4에서 리팩토링 대상 목록을 보고한 뒤 반드시 개발자 승인을 기다린다.
승인 없이 코드를 변경하지 않는다.

issue-{N}.md 파일 자체가 없는 경우:
```
⚠️  issue-{N}.md 파일이 없습니다.
    /feature-planner-be → /test-scenarios-be {N} → /tdd-red-be {N} → /tdd-green-be {N} → /ac-verifier-be {N} 순서로 먼저 실행해주세요.
```
