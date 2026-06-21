---
name: tdd-green
description: |
  실패하는 테스트를 통과시키는 최소한의 구현 코드를 작성하는 TDD Green 단계 스킬.
  /tdd-green {이슈번호} 명령어로 진입. /feature-planner 세션 컨텍스트가 있으면 feature-path를 자동 로드하고,
  없으면 Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
  사용자가 "TDD Green", "테스트 통과", "구현 코드 작성", "green 단계", "tdd-green",
  "실패 테스트 통과", "최소 구현", "green 단계 구현" 등을 언급하면 반드시 이 스킬을 사용할 것.
  /tdd-red 스킬이 issue-{N}.md 테스트 코드 작성을 완료한 직후 실행한다.
  테스트 파일(.test.ts / .test.tsx)은 절대 수정하지 않으며, 구현 코드만 작성한다.
  직접 API를 작성하지 않고 orval이 생성한 hook 또는 api(src/api/generated/)를 사용한다.
---

# TDD Green Workflow

`/tdd-red`가 작성한 **실패하는 테스트**를 통과시키는 **최소한의 구현 코드**를 작성하는 파이프라인.
테스트가 요구하는 동작만 정확히 구현하며, 과도한 추상화나 미래 대비 코드는 작성하지 않는다.

---

## 입력 형식

```
/tdd-green {N}                      ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/tdd-green {feature-path} {N}      ← 경로 직접 지정 + 이슈 번호
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
/tdd-green notice/list 1   → feature-path: notice/list, N: 1
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
예) /tdd-green notice/list 1
```

---

## 진입 안내

feature-path와 이슈 번호가 결정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📁 feature-path: notice/list
📄 읽기: src/features/notice/list/docs/issue-1.md
🟢 TDD Green — 실패하는 테스트를 통과시키는 구현을 시작합니다.
```

컨텍스트에서 자동 로드한 경우:

```
📁 feature-path: notice/list  (feature-planner 컨텍스트에서 로드)
📄 읽기: src/features/notice/list/docs/issue-1.md
🟢 TDD Green — 실패하는 테스트를 통과시키는 구현을 시작합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기 / 체크박스 업데이트) | `src/features/{feature-path}/docs/issue-{N}.md` |
| 디자인 시스템 (선택 읽기) | `src/features/{feature-path}/docs/design-system.md` |
| 구현 파일 (생성/수정) | 이슈 파일 `## 시그니처` 섹션의 경로 기준 |

---

## 전제 조건

| 항목 | 내용 |
|------|------|
| 테스트 러너 | `package.json`의 `test` 스크립트가 vitest를 실행함을 가정 |
| 폴백 | `pnpm test:run` 없으면 `npx vitest run` 직접 사용 |
| 테스트 환경 | Vitest + React Testing Library |
| API 클라이언트 | 직접 작성 금지 — `src/api/generated/`의 orval 생성 hook/api 사용 |

---

## 파이프라인 개요

```
/tdd-green [{feature-path}] {N}
    ↓ feature-path 결정 (컨텍스트 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ 단계 1: pnpm test:run → 실패 테스트 목록 확인
    ↓ 단계 2: 체크박스 수 vs Tests 수 대조 → 불일치 시 stub 생성 후 재실행
    ↓ 단계 3: design-system.md 로드 (파일 존재 시)
    ↓ 단계 4–7: 테스트별 반복
    │   ↓ 단계 4: 첫 번째 실패 테스트 → 최소 구현 코드 작성
    │   ↓ 단계 5: 피드백 루프 (최대 5회)
    │   │   ├─ 5-1: pnpm test:run {파일} → 대상 테스트 실행
    │   │   │   ├─ 실패 → 코드 수정 후 5-1 재실행 (최대 5회)
    │   │   │   └─ 5회 초과 → 실패 원인 보고 후 중단
    │   │   └─ 5-2: pnpm test:run (전체) → 회귀 확인
    │   │       ├─ 통과 → 단계 6으로
    │   │       └─ 회귀 발생 → 코드 수정 후 5-1부터 재실행
    │   ↓ 단계 6: issue-{N}.md 해당 항목 [x] 체크
    │   ↓ 단계 7: 다음 실패 테스트 → 단계 4부터 반복
    ↓ 단계 8: 전체 통과 후 pnpm test:coverage → 미커버 라인 보고
    ↓ 단계 9: 결과 요약
```

---

## 단계 1: 실패 테스트 목록 확인

아래 명령어를 순서대로 시도한다.

```bash
pnpm test:run
```

`pnpm test:run`이 없으면 폴백:

```bash
npx vitest run
```

실행 결과에서 `FAIL` 로 시작하는 줄과 `Tests X failed` 항목을 수집해 실패 테스트 목록을 만든다.

---

## 단계 2: 체크박스 수 대조

`src/features/{feature-path}/docs/issue-{N}.md`의 `## 테스트 시나리오` 섹션에서
체크박스(`- [ ]`) 총 건수를 세고, vitest가 보고하는 `Tests` 수와 비교한다.

**일치하는 경우** → 단계 3으로 진행.

**불일치하는 경우** (체크박스 수 > Tests 수):

import 대상 모듈이 없어 vitest가 테스트를 인식하지 못한 것이다.
시그니처만 있는 stub 파일을 생성해 전체 테스트가 인식되도록 한다.

```ts
// stub 예시 — 구현 없이 시그니처와 빈 반환값만 포함
export function someFunction(_param: string): string[] {
  return []
}
```

```tsx
// 컴포넌트 stub 예시
export type SomeComponentProps = { ... }
export function SomeComponent(_props: SomeComponentProps) {
  return null
}
```

stub 생성 후 `pnpm test:run`을 재실행해 Tests 수가 일치하는지 확인한다.

---

## 단계 3: 디자인 컨텍스트 로드

아래 순서로 UI 구현에 필요한 시각적 스펙을 파악한다.

1. `src/features/{feature-path}/docs/design-system.md` 존재 여부 확인
   - 존재하면 읽어서 색상·간격·레이아웃·상태별 표현·Tailwind 클래스 파악
2. `issue-{N}.md`에 "디자인 참고" 섹션이 있으면 함께 확인
3. `CLAUDE.md`의 스타일링 컨벤션 참조 (디자인 토큰 사용 원칙)

`design-system.md`가 없으면 이 단계를 건너뛰고 CLAUDE.md 컨벤션만 따른다.

---

## 단계 4: 최소 구현 코드 작성

**원칙: 테스트가 요구하는 동작만 구현한다.**

- 테스트 파일(`.test.ts` / `.test.tsx`)은 절대 수정하지 않는다.
- 직접 API 함수를 작성하지 않는다 — `src/api/generated/`의 orval 생성 hook 또는 api를 사용한다.
- UI 컴포넌트는 `design-system.md`의 Tailwind 클래스, 레이아웃 구조, 상태별 표현을 그대로 적용한다.
- `design-system.md`에 없는 시각적 요소는 임의로 추가하지 않는다.
- 테스트를 통과시키기 위한 최소한의 코드만 작성하고, 과도한 추상화나 미래 기능을 추가하지 않는다.

### 구현 예시 — 서비스 함수

```ts
// ❌ 과도한 구현
export function addTag(tags: string[], tag: string): string[] {
  const trimmed = tag.trim().toLowerCase()
  if (!trimmed || tags.includes(trimmed)) return tags
  return [...tags, trimmed]
}

// ✅ 테스트가 요구하는 최소 구현
export function addTag(tags: string[], tag: string): string[] {
  if (tags.includes(tag)) return tags
  return [...tags, tag]
}
```

### 구현 예시 — 컴포넌트

```tsx
// ✅ 테스트가 요구하는 최소 구현 (design-system.md 기준 클래스 적용)
export function TagInput({ tags, onAdd, onRemove }: TagInputProps) {
  const [value, setValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="tag-badge">
          {tag}
          <button onClick={() => onRemove(tag)}>×</button>
        </span>
      ))}
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
```

---

## 단계 5: 피드백 루프 (최대 5회) `<피드백루프>`

### 5-1. 대상 테스트 실행 (빠른 피드백)

구현 후 즉시 해당 테스트 파일을 실행한다.

```bash
pnpm test:run {테스트파일경로}
```

**통과** → 5-2로 이동.

**실패** → 에러 메시지를 읽고 원인을 분석해 구현 코드를 수정한 뒤 5-1 재실행.
최대 5회까지 반복하며, 5회 초과 시:

```
⛔ 5회 반복 후에도 실패: {테스트명}

원인 분석:
- {에러 메시지 요약}
- {시도한 수정 내용}

개발자 확인이 필요합니다. 해결 후 /tdd-green {N}을 다시 실행해주세요.
```

### 5-2. 전체 회귀 확인

대상 테스트가 통과되면 전체 suite를 실행해 기존 테스트에 회귀가 없는지 확인한다.

```bash
pnpm test:run
```

**전체 통과** → 단계 6으로 이동.

**회귀 발생** (기존 테스트 실패) → 회귀 원인을 분석해 구현 코드를 수정하고 5-1부터 재실행.

---

## 단계 6: issue-{N}.md 체크박스 업데이트

통과된 테스트에 해당하는 시나리오의 체크박스를 `[ ]` → `[x]`로 변경한다.

```markdown
<!-- 변경 전 -->
- [ ] [정상] TagInput — should display tag when valid text is entered and Enter is pressed

<!-- 변경 후 -->
- [x] [정상] TagInput — should display tag when valid text is entered and Enter is pressed
```

---

## 단계 7: 다음 실패 테스트로 이동

체크박스 업데이트 후 `pnpm test:run`에서 남은 실패 테스트를 확인하고,
다음 실패 테스트로 이동해 단계 4부터 반복한다.

모든 `- [ ]` 항목이 `- [x]`로 전환될 때까지 반복한다.

---

## 단계 8: 커버리지 측정

전체 테스트가 통과되면 커버리지를 측정한다.

```bash
pnpm test:coverage
```

- 미커버 라인을 확인하고, 시나리오에서 빠진 케이스인지 개발자에게 보고한다.
- **커버리지를 올리기 위한 테스트 추가는 금지.** 참고용으로만 활용한다.

---

## 단계 9: 결과 요약

```
✅ TDD Green 완료 — issue-{N}

📋 통과된 테스트: {통과 수}/{전체 수}

✅ 체크된 시나리오:
   - [x] [정상] {함수명/컴포넌트명} — ...
   - [x] [경계] {함수명/컴포넌트명} — ...
   - [x] [예외] {함수명/컴포넌트명} — ...

📊 커버리지 리포트 요약:
   Statements : XX%
   Branches   : XX%
   Functions  : XX%
   Lines      : XX%

   미커버 라인 (시나리오 누락 가능성):
   - src/features/.../SomeComponent.tsx : line {N}, {N+1}

⚠️ 미해결 항목: (있으면 표시)
   - [ ] {미통과 시나리오 — 원인 요약}

다음 단계: /tdd-refactor {N}  (리팩토링)
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 파일 조작 범위 | 구현 파일만 생성·수정. 테스트 파일(`.test.ts` / `.test.tsx`) 수정 금지 |
| API 작성 | 직접 작성 금지 — `src/api/generated/`의 orval 생성 hook/api 사용 |
| 디자인 | `design-system.md`에 없는 시각 요소 임의 추가 금지 |
| 커버리지 | 커버리지 향상 목적의 테스트 추가 금지 |
| 피드백 루프 | 최대 5회 반복. 초과 시 개발자에게 보고 후 중단 |
| 구현 범위 | 테스트가 요구하는 동작만. 과도한 추상화·미래 기능 추가 금지 |

---

## 승인 게이트

이 스킬은 GATE 없이 자동으로 진행한다.
단, issue-{N}.md에 `## 시그니처` 또는 `## 테스트 시나리오` 섹션이 없으면:

```
⚠️  issue-{N}.md에 {누락 섹션}이 없습니다.
    /test-scenarios {N} → /tdd-red {N} 을 먼저 실행해주세요.
```
