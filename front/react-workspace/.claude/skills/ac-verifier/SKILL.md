---
name: ac-verifier
description: |
  Green 완료 후 이슈의 Acceptance Criteria 충족 여부를 독립 검증하는 스킬.
  /ac-verifier {이슈번호} 명령어로 진입. /feature-planner 세션 컨텍스트가 있으면 feature-path를 자동 로드하고,
  없으면 Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
  사용자가 "AC 검증", "AC 충족 검증", "ac-verifier", "Acceptance Criteria 독립 검증",
  "AC 독립 검증", "테스트 통과 ≠ AC 충족" 등을 언급하면 반드시 이 스킬을 사용할 것.
  /tdd-green 스킬이 모든 테스트 통과를 완료한 직후 실행한다.
  테스트 통과 여부가 아닌 AC의 의도가 구현 코드에 반영되었는지를 판단한다.
  구현 파일은 절대 수정하지 않는다 — issue-{N}.md 최하단 검증 결과 기록만 예외.
---

## 목적

이슈의 Acceptance Criteria(AC)가 실제로 충족되었는지 독립적으로 검증한다.
테스트 통과 여부가 아닌, AC 문장의 의도가 코드에 반영되었는지를 판단한다.

---

## 입력 형식

```
/ac-verifier {N}                      ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/ac-verifier {feature-path} {N}      ← 경로 직접 지정 + 이슈 번호
```

---

## feature-path 결정

아래 순서로 `feature-path`를 결정한다. 위 단계에서 결정되면 아래 단계는 실행하지 않는다.

**1순위: /feature-planner 세션 컨텍스트**

같은 세션에서 `/feature-planner`가 먼저 실행된 경우 `[CONTEXT]`의 `feature-path`를 그대로 사용한다.

```
[CONTEXT] feature-path: notice/list   ← 이 값을 자동 사용
```

**2순위: 직접 지정**

첫 토큰에 슬래시(`/`)가 포함된 영문 경로 → `{feature-path}`로 판단.

```
/ac-verifier notice/list 1   → feature-path: notice/list, N: 1
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
feature-path와 이슈 번호를 입력해주세요.
예) /ac-verifier notice/list 1
```

---

## 진입 안내

feature-path와 이슈 번호가 결정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📁 feature-path: notice/list
📄 읽기: src/features/notice/list/docs/issue-1.md
🔍 AC Verifier — Acceptance Criteria 충족 여부를 독립 검증합니다.
```

컨텍스트에서 자동 로드한 경우:

```
📁 feature-path: notice/list  (feature-planner 컨텍스트에서 로드)
📄 읽기: src/features/notice/list/docs/issue-1.md
🔍 AC Verifier — Acceptance Criteria 충족 여부를 독립 검증합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기 전용) | `src/features/{feature-path}/docs/issue-{N}.md` |
| 테스트 파일 (읽기 전용) | `## 시그니처` 섹션 코드 블록 상단 주석의 테스트 파일 경로 |
| 구현 파일 (읽기 전용) | `## 시그니처` 섹션 코드 블록 상단 주석의 구현 파일 경로 |

**이 스킬은 어떤 파일도 수정하지 않는다.** (단, issue-{N}.md 최하단 검증 결과 기록은 예외)

---

## issue-{N}.md 구조 이해

`/test-scenarios` 스킬이 생성하는 `issue-{N}.md`는 아래 구조를 가진다.

```
## 시그니처                       ← 파일 최상단 (단계 2에서 기록)
  ### 컴포넌트 Props
  ### API 서비스
  ### 훅
  ### Store 액션
  각 코드 블록 상단에 파일 경로 주석 포함:
    // 파일: src/features/.../xxx.ts
    // 테스트: src/features/.../xxx.test.ts

---

(기존 이슈 원문 내용)

---

## 테스트 시나리오                ← 파일 하단 (단계 3 GATE 2 후 기록)
  ### API 서비스 / 훅
  ### 컴포넌트
  ### AC 커버리지                 ← AC 목록의 정규 위치

### AC 커버리지 테이블 형식:
| AC | 커버 시나리오 |
|----|-------------|
| AC-{N}-1: Given ..., When ..., Then ... | [정상] 함수명 — ... |
| AC-{N}-2: Given ..., When ..., Then ... | [경계] 함수명 — ... |
```

---

## 전제 조건

- `/tdd-green` 단계가 완료되어 전체 테스트가 통과 상태여야 한다.
- `package.json`의 `test:run` 스크립트가 vitest를 실행함을 가정한다.

---

## 파이프라인 개요

```
/ac-verifier [{feature-path}] {N}
    ↓ feature-path 결정 (컨텍스트 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ 단계 1: pnpm test:run → 전체 통과 확인
    │   └─ 실패 시: 즉시 중단, /tdd-green 먼저 실행 요청
    ↓ 단계 2: issue-{N}.md 읽기
    │   ├─ ## 시그니처 섹션 → 파일 경로 주석 추출 (구현 파일 + 테스트 파일)
    │   └─ ## 테스트 시나리오 > ### AC 커버리지 테이블 → AC 목록 추출
    ↓ 단계 3: AC별 3단계 검증 (AC 수만큼 반복)
    │   ↓ 3-1: 테스트 존재 여부 + 이름이 AC 의도를 정확히 반영하는지 확인
    │   ↓ 3-2: 구현 코드 확인 (경계 조건 누락 특별 주의)
    │   └─ 3-3: AC 의도 충족 판정 (✅ / ⚠️ / ❌)
    ↓ 단계 4: AC별 결과 보고
    ↓ 단계 5: 갭 있는 AC에 추가 테스트 시나리오 제안 → 종료
```

---

## 단계 1: 전체 테스트 통과 확인

```bash
pnpm test:run
```

- **전체 통과** → 단계 2로 진행.
- **실패 테스트 존재 시** → 즉시 중단:

```
⛔ 전체 테스트가 통과하지 않았습니다.

실패한 테스트:
- {실패 테스트명}
- ...

/tdd-green {N} 단계를 먼저 완료해주세요.
```

---

## 단계 2: 이슈 파일 읽기

`src/features/{feature-path}/docs/issue-{N}.md`를 읽어 아래 항목을 추출한다.

**파일이 없는 경우:**
```
⛔ issue-{N}.md 파일을 찾을 수 없습니다.
   경로: src/features/{feature-path}/docs/issue-{N}.md
   /test-scenarios {N} 을 먼저 실행해주세요.
```

**파일이 있는 경우 추출 항목:**

### 2-1. 파일 경로 추출 (`## 시그니처` 섹션)

각 코드 블록 상단의 경로 주석을 파싱한다.

```ts
// 파일: src/features/notice/list/hooks/useNoticeList.ts      ← 구현 파일
// 테스트: src/features/notice/list/hooks/useNoticeList.test.ts  ← 테스트 파일
```

- 경로 주석이 없는 코드 블록은 `## 시그니처` 섹션의 서브섹션명을 참고해 아래 기본 경로 패턴으로 glob 탐색한다.

| 서브섹션 | 기본 glob 패턴 |
|---------|--------------|
| API 서비스 | `src/api/services/**/*.ts` + `src/api/services/**/*.test.ts` |
| 훅 | `src/features/{feature-path}/hooks/**/*.ts` + `*.test.ts` |
| 컴포넌트 Props | `src/features/{feature-path}/components/**/*.tsx` + `*.test.tsx` |
| Store 액션 | `src/features/{feature-path}/store/**/*.ts` + `*.test.ts` |

### 2-2. AC 목록 추출 (`## 테스트 시나리오 > ### AC 커버리지`)

`### AC 커버리지` 테이블의 첫 번째 열(AC 열)에서 AC 항목을 추출한다.

```
| AC-{N}-1: Given ..., When ..., Then ... | ...커버 시나리오... |
  ↑ 이 부분을 AC 문장으로 사용
```

**AC 커버리지 섹션이 없는 경우:**
```
⚠️ issue-{N}.md에 ### AC 커버리지 섹션이 없습니다.
   /test-scenarios {N} 을 다시 실행해 AC 커버리지를 생성해주세요.
```

### 2-3. 테스트 시나리오 목록 파악

`[정상]`, `[경계]`, `[예외]` 분류 목록을 읽어 어떤 시나리오가 작성되었는지 파악한다.
(검증 시 테스트 이름과의 대조에 사용)

---

## 단계 3: AC별 검증

각 AC에 대해 아래 3단계를 순서대로 수행한다.

### 3-1. 테스트 존재 여부 확인

단계 2-1에서 파악한 테스트 파일에서 해당 AC를 검증하는 테스트를 찾는다.

판단 기준:
- AC를 직접 검증하는 테스트(`it` / `test` 블록)가 존재하는가?
- 테스트 이름(`"should ... when ..."`)이 시나리오 설명과 일치하며 AC 의도를 반영하는가?

### 3-2. 구현 코드 확인

테스트가 검증하는 동작이 실제 구현 코드에 반영되어 있는지 확인한다.

특별 주의 항목:
- 빈 값, 최대/최소 경계, 중복, 권한 등 경계 조건이 누락되지 않았는지
- 테스트는 통과하지만 AC가 요구하는 케이스 전체를 커버하지 못하는 경우

### 3-3. AC 의도 충족 판정

| 판정 | 기준 |
|------|------|
| ✅ 충족 | 테스트 있음 + 구현 확인 + AC 의도 완전 반영 |
| ⚠️ 부분 충족 | 테스트 있으나 경계 케이스 누락 또는 AC 의도와 일부 불일치 |
| ❌ 미충족 | 테스트 없음 또는 구현 누락 |

**⚠️ 판정 예시:**
```
AC: "AC-1-3: Given 태그가 10개일 때, When 태그를 추가하면, Then 에러를 반환한다"
테스트: 11번째 추가 시 에러를 던지는지만 확인
→ 에러 메시지 내용이나 UI 피드백이 누락되어 있으면 ⚠️
```

---

## 단계 4: AC별 결과 보고

모든 AC 검증 완료 후 아래 형식으로 보고한다.
AC 식별자는 `### AC 커버리지` 테이블에서 추출한 `AC-{N}-{번호}` 형식을 그대로 사용한다.

```
🔍 AC 검증 결과 — issue-{N}

[AC-{N}-1] {AC 문장 (Given…When…Then…)}
✅ 충족 — 테스트: "{테스트명}" 존재, {함수/컴포넌트명}() 구현 확인
          근거: {구체적 코드 위치 또는 동작 설명}

[AC-{N}-2] {AC 문장}
⚠️ 부분 충족 — 테스트 있으나 {누락된 경계 케이스}
              AC 의도: {원래 AC가 요구한 것}
              현재 상태: {테스트/구현이 커버하는 범위}

[AC-{N}-3] {AC 문장}
❌ 미충족 — {테스트 없음 / 구현 누락} — {상세 이유}

---
요약: ✅ {N}개 충족 / ⚠️ {N}개 부분 충족 / ❌ {N}개 미충족
```

---

## 단계 5: 추가 테스트 시나리오 제안

⚠️ 또는 ❌ 판정을 받은 AC가 있으면 아래 형식으로 추가 시나리오를 제안한다.
시나리오 형식은 `/test-scenarios` 스킬의 형식(`[분류] 함수명 — should {기대동작} when {조건}`)을 따른다.

```
📋 추가 테스트 시나리오 제안:

[AC-{N}-{번호} - ⚠️] {AC 문장}
- [ ] [경계] {함수/컴포넌트명} — should {구체적 동작} when {조건}
- [ ] [예외] {함수/컴포넌트명} — should {구체적 동작} when {조건}

[AC-{N}-{번호} - ❌] {AC 문장}
- [ ] [정상] {함수/컴포넌트명} — should {구체적 동작} when {조건}
- [ ] [경계] {함수/컴포넌트명} — should {구체적 동작} when {조건}

위 시나리오를 issue-{N}.md의 `## 테스트 시나리오` 섹션에 수동으로 추가한 뒤
/tdd-red {N} 을 실행하면 추가 시나리오에 대한 테스트 코드가 작성됩니다.
(기존 테스트 파일은 유지되며, 새 시나리오에 해당하는 테스트만 추가됩니다.)
```

갭이 없으면 (모든 AC가 ✅이면):

```
✅ 모든 AC가 충족되었습니다. /tdd-refactor {N} 으로 진행할 수 있습니다.
```

---

## 완료 보고

```
✅ AC Verifier 완료 — issue-{N}

📊 검증 결과:
   ✅ {N}개 충족
   ⚠️ {N}개 부분 충족
   ❌ {N}개 미충족

다음 단계: /tdd-refactor {N}  (구조 개선)
```

갭이 있는 경우:

```
⚠️ AC 충족 갭이 있습니다. 추가 시나리오 제안을 참고해주세요.
갭 해결 후 /tdd-green {N} → /ac-verifier {N} 를 다시 실행해주세요.
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 파일 수정 | 금지 — issue-{N}.md 최하단 검증 결과 기록 제외하고 어떤 파일도 생성하거나 수정하지 않는다 |
| 구현 코드 생성 | 금지 |
| 테스트 추가 | 금지 |
| 판정 기준 | 테스트 통과 여부가 아닌 AC 의도 충족 여부 |
| 보고 방식 | 근거 없는 판정 금지 — 반드시 구체적 코드 위치 또는 테스트명을 근거로 제시 |
