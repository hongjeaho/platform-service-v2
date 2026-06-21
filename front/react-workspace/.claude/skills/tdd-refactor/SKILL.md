---
name: tdd-refactor
description: |
  테스트 통과 상태를 유지하면서 코드 구조를 개선하는 TDD Refactor 단계 스킬.
  /tdd-refactor {이슈번호} 명령어로 진입. /feature-planner 세션 컨텍스트가 있으면
  feature-path를 자동 로드하고, 없으면 Git 브랜치명(feature/xxx)을 자동 파싱해
  feature-path를 설정한다.
  사용자가 "TDD Refactor", "리팩토링", "코드 개선", "refactor 단계", "tdd-refactor",
  "테스트 유지 리팩토링", "구조 개선" 등을 언급하면 반드시 이 스킬을 사용할 것.
  /tdd-green 스킬이 모든 테스트를 통과시킨 직후 실행한다.
  테스트 파일(.test.ts / .test.tsx)은 절대 수정하지 않으며, 구현 코드만 리팩토링한다.
  새 기능 추가 금지 — 동작을 바꾸지 않고 구조만 개선한다.
---

# TDD Refactor Workflow

`/tdd-green`이 통과시킨 **모든 테스트를 깨뜨리지 않으면서** 코드 구조를 개선하는 파이프라인.
동작은 변경하지 않고 중복 제거·네이밍·단일 책임·복잡도·컨벤션 불일치를 개선한다.

---

## 입력 형식

```
/tdd-refactor {N}                      ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/tdd-refactor {feature-path} {N}      ← 경로 직접 지정 + 이슈 번호
```

---

## feature-path 결정

아래 순서로 `feature-path`를 결정한다. 위 단계에서 결정되면 아래 단계는 실행하지 않는다.

**1순위: /feature-planner 세션 컨텍스트**

같은 세션에서 `/feature-planner`가 먼저 실행된 경우 `[CONTEXT]`의 `feature-path`를 그대로 사용한다.
git 명령을 실행하거나 사용자에게 경로를 묻지 않는다.

```
[CONTEXT] feature-path: notice/list   ← 이 값을 자동 사용
```

**2순위: 직접 지정**

첫 토큰에 슬래시(`/`)가 포함된 영문 경로 → `{feature-path}`로 판단.

```
/tdd-refactor notice/list 1   → feature-path: notice/list, N: 1
```

**3순위: 현재 브랜치 자동 추론**

위 두 경우에 해당하지 않으면 `git branch --show-current`를 실행해 브랜치에서 추론한다.

브랜치명이 `main`, `master`, `develop`, `dev` 이거나 `feature/` · `feat/` prefix가 없는 경우:

```
⚠️  현재 브랜치: main (보호 브랜치)
    TDD 작업은 feature 브랜치에서 진행해야 합니다.
    feature 브랜치로 전환 후 다시 실행해주세요.
```

`feature/*` 브랜치라면 아래 규칙으로 변환한다.

| 브랜치명 | feature-path |
|---------|-------------|
| `feature/tag` | `tag` |
| `feature/notice/list` | `notice/list` |
| `feature/notice/list-search` | `notice/list-search` |
| `feat/notice/category/detail` | `notice/category/detail` |

**변환 알고리즘:** `feature/` 또는 `feat/` prefix를 제거하고 나머지를 그대로 사용한다.

**4순위: 직접 입력 요청**

위 세 가지 모두 실패할 경우:

```
feature-path를 입력해주세요.
예) /tdd-refactor notice/list 1
```

---

## 진입 안내

feature-path와 이슈 번호가 결정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📁 feature-path: notice/list
📄 읽기: src/features/notice/list/docs/issue-1.md
🔵 TDD Refactor — 테스트를 유지하며 코드 구조를 개선합니다.
```

컨텍스트에서 자동 로드한 경우:

```
📁 feature-path: notice/list  (feature-planner 컨텍스트에서 로드)
📄 읽기: src/features/notice/list/docs/issue-1.md
🔵 TDD Refactor — 테스트를 유지하며 코드 구조를 개선합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기) | `src/features/{feature-path}/docs/issue-{N}.md` |
| 수정 대상 파일 | `git diff $(git rev-parse --abbrev-ref origin/HEAD | sed 's/origin\///') ...HEAD --name-only -- src/` 결과 중 비테스트 파일 |

---

## 파이프라인 개요

```
/tdd-refactor [{feature-path}] {N}
    ↓ feature-path 결정 (컨텍스트 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ 단계 1: CLAUDE.md 읽기 → 프로젝트 컨벤션 파악
    ↓ 단계 2: pnpm test:run → 전체 통과 확인
    │   └─ 실패 테스트 존재 시: 즉시 중단 → tdd-green 먼저 실행 요청
    ↓ 단계 3: 리팩토링 대상 파일 식별
    │   ├─ git diff {기본브랜치}...HEAD --name-only -- src/
    │   ├─ issue-{N}.md 시그니처와 교차 검증 (범위 좁힘)
    │   ├─ *.test.ts / *.test.tsx 제외
    │   └─ 범용 점검 기준 5가지 적용
    ↓ 단계 4: 리팩토링 대상 목록 보고 → 개발자 승인 대기 [GATE]
    ↓ 단계 5: 승인 항목 하나씩 리팩토링 〈피드백 루프〉
    │   ├─ 변경 → pnpm test:run → 전체 통과 → 다음 항목
    │   ├─ 실패 → 즉시 롤백 → 다른 접근 방식으로 1회 재시도
    │   └─ 재시도도 실패 → 해당 항목 건너뜀 + 사용자 보고
    ↓ 단계 6: 결과 요약 출력
```

---

## 단계 1: CLAUDE.md 읽기

프로젝트 루트와 `front/react-workspace/`의 `CLAUDE.md`를 읽어 아래 항목을 파악한다.

- 네이밍 규칙 (컴포넌트, 훅, 서비스, 타입 파일)
- 디렉토리 구조 및 파일 위치 규칙
- 상태관리 패턴 (Zustand selector, TanStack Query key factory)
- 스타일링 컨벤션 (디자인 토큰, Tailwind 사용 원칙)

이 정보는 단계 3의 점검 기준 5번(컨벤션 불일치)에 사용한다.

---

## 단계 2: 전체 테스트 통과 확인

```bash
pnpm test:run
```

`pnpm test:run`이 없으면 폴백:

```bash
npx vitest run
```

**전체 통과** → 단계 3으로 진행.

**실패 테스트 존재 시** → 즉시 중단:

```
⛔ 실패하는 테스트가 있습니다 — 리팩토링을 시작할 수 없습니다.

실패 테스트:
  - src/features/.../SomeComponent.test.tsx — {테스트명}

/tdd-green {N} 을 먼저 실행해 모든 테스트를 통과시켜주세요.
```

---

## 단계 3: 리팩토링 대상 파일 식별

### 3-1. 변경 파일 추출

기본 브랜치를 동적으로 탐지한 뒤 diff를 추출한다.

```bash
BASE=$(git rev-parse --abbrev-ref origin/HEAD | sed 's/origin\///')
git diff ${BASE}...HEAD --name-only -- src/
```

`origin/HEAD`가 설정되지 않은 경우 `main` → `master` 순으로 존재 여부를 확인해 fallback한다.

### 3-2. issue-{N}.md 시그니처와 교차 검증

`src/features/{feature-path}/docs/issue-{N}.md`의 `## 시그니처` 섹션에 명시된 파일 목록과 비교해
관련성이 낮은 파일을 제외한다.

### 3-3. 테스트 파일 제외

`*.test.ts` / `*.test.tsx` 패턴에 해당하는 파일은 목록에서 제거한다.

### 3-4. 범용 점검 기준 적용

남은 파일 각각을 아래 5가지 기준으로 검토한다.

| 기준 | 점검 내용 |
|------|---------|
| **중복 제거** | 같은 로직이 2곳 이상 반복되는가 |
| **네이밍 명확성** | 함수·변수·컴포넌트 이름이 의도를 드러내는가 |
| **단일 책임** | 하나의 함수/컴포넌트가 너무 많은 역할을 담당하는가 |
| **불필요한 복잡도** | 매직 넘버, 과도한 중첩, 불필요한 추상화가 있는가 |
| **CLAUDE.md 컨벤션 불일치** | 프로젝트의 네이밍·패턴·구조 규칙과 어긋나는가 |

개선이 필요한 항목만 목록에 남긴다. 개선 사항이 없으면 해당 파일은 목록에서 제외한다.

---

## 단계 4: 리팩토링 대상 보고 및 승인 [GATE]

분석 결과를 아래 형식으로 출력하고 개발자 승인을 기다린다.

```
🔍 리팩토링 대상 분석 결과

📁 대상 파일 ({N}개):
  1. src/features/notice/list/components/NoticeList.tsx
     → 단일 책임: 필터링 로직이 컴포넌트 내부에 혼재
  2. src/features/notice/list/hooks/useNoticeList.ts
     → 네이밍: handleClick → handleNoticeSelect (의도 불명확)
  3. src/features/notice/list/utils/noticeUtils.ts
     → 중복: buildQueryParams 패턴이 3곳에서 반복

리팩토링을 진행할까요?
(전체 승인 / 취소 / 특정 번호만 선택 가능 — 예: "1, 3번만")
```

**개선 항목이 없는 경우:**

```
✅ 리팩토링 대상 없음

변경된 파일을 검토했으나 개선이 필요한 항목이 없습니다.
코드가 이미 깔끔한 상태입니다.
```

---

## 단계 5: 피드백 루프 리팩토링

승인된 항목을 하나씩 순서대로 처리한다.

### 처리 흐름

1. 리팩토링 변경 적용
2. 전체 테스트 실행 (단계 2와 동일한 폴백 적용):
   ```bash
   pnpm test:run   # 없으면 npx vitest run
   ```
3. **전체 통과** → 다음 항목으로 이동
4. **실패 발생** → Edit 도구로 변경 내용을 수동 원복한 뒤 다른 접근 방식으로 1회 재시도
5. **재시도도 실패** → 해당 항목을 건너뛰고 사용자에게 보고:
   ```
   ⚠️ 건너뜀: {파일명}
   원인: {테스트 실패 이유 요약}
   다른 접근 방식도 실패했습니다. 수동 확인이 필요합니다.
   ```

### 항목 진행 중 상태 출력 예시

```
🔵 [1/3] NoticeList.tsx — 필터링 로직 분리 중...
   → pnpm test:run ... ✅ 전체 통과
🔵 [2/3] useNoticeList.ts — handleClick 리네임 중...
   → pnpm test:run ... ✅ 전체 통과
🔵 [3/3] noticeUtils.ts — buildQueryParams 추출 중...
   → pnpm test:run ... ❌ 실패 → 롤백 후 재시도
   → pnpm test:run ... ❌ 재시도도 실패 → 건너뜀
```

---

## 단계 6: 결과 요약

```
✅ TDD Refactor 완료 — issue-{N}

📋 리팩토링 완료 항목:
  ✅ NoticeList.tsx — 필터링 로직을 useNoticeFilter 훅으로 분리 (단일 책임)
  ✅ useNoticeList.ts — handleClick → handleNoticeSelect 리네임 (네이밍 명확성)

⚠️ 건너뜀 항목: (있으면 표시)
  - noticeUtils.ts — buildQueryParams 추출 시 타입 에러 미해결 (수동 확인 필요)

🧪 최종 테스트: {통과 수}/{전체 수} 통과
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 새 기능 추가 | 금지 — 동작 변경 없이 구조만 개선 |
| 테스트 파일 수정 | 금지 (`.test.ts` / `.test.tsx`) |
| 수정 범위 | `src/features/{feature-path}/` 내부만 |
| git diff 외 파일 | `git diff {기본브랜치}...HEAD` 결과 외 파일 수정 금지 |
| 피드백 루프 | 실패 시 1회 재시도 후 건너뜀 — 무한 반복 금지 |
| 승인 전 수정 | 단계 4 승인 전 코드 변경 금지 |

---

## 승인 게이트

단계 4에서 리팩토링 대상 목록을 보고한 뒤 반드시 개발자 승인을 기다린다.
승인 없이 코드를 변경하지 않는다.

단, 아래 경우에는 즉시 중단한다.

issue-{N}.md 파일 자체가 없는 경우:
```
⚠️  issue-{N}.md 파일이 없습니다.
    /test-scenarios {N} → /tdd-red {N} → /tdd-green {N} 순서로 먼저 실행해주세요.
```

issue-{N}.md에 `## 시그니처` 섹션이 없는 경우:
```
⚠️  issue-{N}.md에 시그니처 섹션이 없습니다.
    /test-scenarios {N} → /tdd-red {N} → /tdd-green {N} 순서로 먼저 실행해주세요.
```
