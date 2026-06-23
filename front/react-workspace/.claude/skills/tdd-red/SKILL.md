---
name: tdd-red
description: |
  승인된 테스트 시나리오를 실패하는 테스트 코드로 변환하는 TDD Red 단계 스킬.
  /tdd-red {이슈번호} 명령어로 진입. /feature-planner 세션 컨텍스트가 있으면 feature-path를 자동 로드하고,
  없으면 Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
  사용자가 "TDD Red", "테스트 코드 작성", "실패하는 테스트", "red 단계", "tdd-red",
  "시나리오를 테스트로", "issue 테스트 코드 작성" 등을 언급하면 반드시 이 스킬을 사용할 것.
  /test-scenarios 스킬이 issue-{N}.md 승인을 완료한 직후 실행하며, 구현 코드 작성 전 단계다.
  테스트 파일만 생성·수정하고 src/의 구현 코드는 절대 손대지 않는다.
---

# TDD Red Workflow

`/test-scenarios`가 확정한 시나리오와 시그니처를 읽어 **실패하는 테스트 코드**를 작성하는 파이프라인.
모든 테스트가 컴파일 에러 없이 "정상 실패(assertion fail)"로 끝나야 이 단계가 완료된다.

---

## 입력 형식

```
/tdd-red {N}                          ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/tdd-red {feature-path} {N}          ← 경로 직접 지정 + 이슈 번호
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
/tdd-red notice/list 1   → feature-path: notice/list, N: 1
```

**3순위: 현재 브랜치 자동 추론**

위 두 경우에 해당하지 않으면 `git branch --show-current`를 실행해 브랜치에서 추론한다.

브랜치명이 `main`, `master`, `develop`, `dev` 이거나 `feature/` prefix가 없는 경우:

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

**변환 알고리즘:** `feature/` prefix를 제거하고 나머지를 그대로 사용한다.

**4순위: 직접 입력 요청**

위 세 가지 모두 실패할 경우:

```
feature-path를 입력해주세요.
예) /tdd-red notice/list 1
```

---

## 진입 안내

feature-path와 이슈 번호가 결정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📁 feature-path: notice/list
📄 읽기: src/features/notice/list/docs/issue-1.md
🧪 TDD Red — 실패하는 테스트 코드 작성을 시작합니다.
```

컨텍스트에서 자동 로드한 경우:

```
📁 feature-path: notice/list  (feature-planner 컨텍스트에서 로드)
📄 읽기: src/features/notice/list/docs/issue-1.md
🧪 TDD Red — 실패하는 테스트 코드 작성을 시작합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기) | `src/features/{feature-path}/docs/issue-{N}.md` |
| 테스트 파일 (생성) | 테스트 대상 파일과 같은 디렉토리 |

**테스트 파일 위치 예시:**

```
src/api/services/tagService.ts        → src/api/services/tagService.test.ts
src/features/tag/hooks/useTags.ts     → src/features/tag/hooks/useTags.test.ts
src/components/common/TagInput.tsx    → src/components/common/TagInput.test.tsx
src/features/tag/components/TagBadge.tsx → src/features/tag/components/TagBadge.test.tsx
```

---

## 파이프라인 개요

```
/tdd-red [{feature-path}] {N}
    ↓ feature-path 결정 (컨텍스트 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ issue-{N}.md 읽기 — 시그니처 + 시나리오 추출
    ↓ 시나리오마다 반복:
    │   ↓ 테스트 코드 작성
    │   ↓ 즉시 실행 (pnpm test:run {파일명})
    │   ├─ 정상 실패 (assertion fail) → 다음 시나리오
    │   └─ 에러 실패 (import/compile 오류) → 최소 스켈레톤 생성 → 재실행
    ↓ 전체 완료 후 pnpm test:run 실행 → 모두 실패 확인
    ↓ 완료 보고
```

---

## 단계 1: issue-{N}.md 파싱

`src/features/{feature-path}/docs/issue-{N}.md`를 읽어 아래 두 섹션을 추출한다.

- **`## 시그니처`** — 함수명, Props 타입, 훅 시그니처, Store 액션 시그니처
- **`## 테스트 시나리오`** — `[정상]` / `[경계]` / `[예외]` 분류 시나리오 목록

파일이 없거나 두 섹션 중 하나라도 없으면:

```
⚠️  issue-{N}.md에 {누락 섹션}이 없습니다.
    /test-scenarios {N} 을 먼저 실행해 시나리오를 확정해주세요.
```

---

## 단계 2: 테스트 코드 작성 (시나리오 단위)

### 시나리오 → 테스트 변환 규칙

각 시나리오를 순서대로 하나씩 테스트 코드로 작성한다.

**테스트 이름 형식:**
```
"{조건} 시 {기대동작}한다"
```

시나리오 설명(`should {기대동작} when {조건}`)을 한국어로 자연스럽게 변환해 테스트 이름으로 사용한다.

예) `should return updated list when valid tag is added` → `유효한 태그 추가 시 목록이 업데이트된다`

**describe 블록 구성:**
```ts
describe('{함수명 또는 컴포넌트명}', () => {
  it('{조건} 시 {기대동작}한다', () => {
    // ...
  })
})
```

같은 함수·컴포넌트의 시나리오는 하나의 `describe` 블록 안에 묶는다.

### 도구 사용 원칙

- **순수 함수 / 서비스**: Vitest (`vi`, `expect`, `describe`, `it`)
- **훅**: `renderHook` from `@testing-library/react`
- **컴포넌트**: `render`, `screen`, `userEvent` from `@testing-library/react`
- mock은 최소한으로 — 실제 동작을 검증할 수 없는 경우에만 사용

### 실패를 유도하는 방법

구현 코드가 없으니 테스트는 자연스럽게 실패한다.
억지로 `expect(false).toBe(true)` 같은 더미 assertion을 넣지 않는다.
시그니처에서 함수·컴포넌트를 import하고 실제 동작을 검증하는 assertion을 작성하면
구현 전에는 반드시 실패한다.

**예시 — 서비스 함수:**
```ts
import { addTag } from '../tagService'

describe('addTag', () => {
  it('유효한 태그 추가 시 목록이 업데이트된다', () => {
    const result = addTag(['react'], 'typescript')
    expect(result).toEqual(['react', 'typescript'])
  })

  it('이미 존재하는 태그 추가 시 목록이 변경되지 않는다', () => {
    const result = addTag(['react'], 'react')
    expect(result).toEqual(['react'])
  })
})
```

**예시 — 컴포넌트:**
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagInput } from '../TagInput'

describe('TagInput', () => {
  it('텍스트 입력 후 Enter 시 태그가 표시된다', async () => {
    render(<TagInput tags={[]} onAdd={vi.fn()} onRemove={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), 'react{Enter}')
    expect(screen.getByText('react')).toBeInTheDocument()
  })
})
```

---

## 단계 3: 실행 및 에러 처리

시나리오를 작성할 때마다 즉시 실행해 결과를 확인한다.

```bash
pnpm test:run {테스트파일경로}
```

### 결과 분류

**정상 실패** (목표 상태) → 다음 시나리오로 진행

```
FAIL src/api/services/tagService.test.ts
  ● addTag › should return updated tag list when valid tag is added
    AssertionError: expected undefined to equal ['react', 'typescript']
```

**에러 실패** (해결 필요) → 최소 스켈레톤 생성 후 재실행

```
Error: Cannot find module '../tagService' from 'tagService.test.ts'
TypeError: render is not a function
SyntaxError: The requested module '...' does not provide an export named 'TagInput'
```

### 에러 실패 대응: 최소 스켈레톤 생성

> **원칙**: 구현 로직을 작성하지 않는다. import 에러를 없애는 최소한의 export 선언만 추가한다.
> **제약**: 기존 src/ 파일이 있으면 수정하지 않는다. 파일 자체가 없을 때만 새로 생성한다.

```ts
// tagService.ts — 스켈레톤 예시 (구현 없음)
// 빈 값을 반환해 assertion이 실행되도록 한다 → "expected [] to equal [...]" 형태의 명확한 실패 메시지
export function addTag(_tags: string[], _tag: string): string[] {
  return []
}
```

```tsx
// TagInput.tsx — 스켈레톤 예시 (구현 없음)
// null을 반환해 렌더는 성공하고 getByText 등 assertion이 실패하도록 한다
export type TagInputProps = {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
}
export function TagInput(_props: TagInputProps) {
  return null
}
```

스켈레톤 생성 후 테스트를 재실행한다. 여전히 에러 실패이면 원인을 파악해 스켈레톤을 수정한다.

---

## 단계 4: 전체 실행 확인

모든 시나리오의 테스트 작성이 완료되면 전체를 실행한다.

```bash
pnpm test:run
```

**확인 기준:**
- 모든 새 테스트가 "정상 실패(assertion fail)"로 끝나는가
- 에러 실패(compile/import 에러)가 없는가
- 기존 테스트가 영향받지 않는가

---

## 테스트 파일 컨벤션

```ts
// 파일 상단: 필요한 import만 (사용하지 않는 import 금지)
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// describe: 함수/컴포넌트 단위 (파일당 여러 describe 허용)
describe('{함수명 또는 컴포넌트명}', () => {
  // it: 시나리오 하나 = it 하나
  it('{조건} 시 {기대동작}한다', () => {
    // Arrange → Act → Assert 순서
  })
})
```

---

## 완료 보고

```
✅ TDD Red 완료 — issue-{N}

📋 작성된 테스트 파일:
   - src/api/services/tagService.test.ts  (3개 시나리오)
   - src/features/tag/components/TagInput.test.tsx  (4개 시나리오)

🔴 전체 실패 확인: 7/7 정상 실패 (assertion fail)

다음 단계: /tdd-green {N}  (구현 코드 작성)
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 파일 조작 범위 | 테스트 파일(`.test.ts` / `.test.tsx`)만 생성·수정 |
| 구현 코드 | `src/`의 기존 구현 코드 수정 금지 |
| 스켈레톤 | 파일이 아예 없을 때만 생성. 기존 파일 수정 금지 |
| assertion | 실제 동작 검증만. 더미 `expect(false).toBe(true)` 금지 |
| mock | 불가피한 경우에만 최소로 사용 |

---

## 승인 게이트

이 스킬은 GATE 없이 자동으로 진행한다.
단, issue-{N}.md에 시그니처나 시나리오가 없으면 `/test-scenarios {N}`을 먼저 실행하도록 안내하고 멈춘다.
