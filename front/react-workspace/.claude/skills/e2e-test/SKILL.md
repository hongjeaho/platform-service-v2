---
name: e2e-test
description: |
  PRD 사용자 스토리를 Playwright E2E 테스트로 변환하는 스킬.
  /e2e-test {N} 또는 /e2e-test {feature-path} {N} 명령어로 진입.
  /feature-planner 세션 컨텍스트가 있으면 feature-path를 자동 로드하고,
  없으면 Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
  사용자가 "E2E 테스트", "Playwright 테스트", "e2e", "통합 테스트 작성",
  "사용자 시나리오 테스트", "브라우저 테스트", "e2e-test" 등을 언급하면 반드시 이 스킬을 사용할 것.
  TDD 이슈 사이클의 /tdd-refactor 완료 이후 단계에서 실행한다.
  prd.md의 사용자 스토리 → E2E 시나리오 도출 → 사용자 승인(GATE) → 테스트 코드 작성 순서로 진행한다.
---

# E2E Test Workflow

`/tdd-refactor`로 구현 코드가 완성된 후, PRD 사용자 스토리를 Playwright E2E 테스트로 변환하는 파이프라인.
단위 테스트(Vitest)에서 이미 검증된 내용은 반복하지 않고, 브라우저 수준의 사용자 흐름만 검증한다.

---

## 입력 형식

```
/e2e-test {N}                       ← 컨텍스트 또는 브랜치 추론 + 이슈 번호
/e2e-test {feature-path} {N}       ← 경로 직접 지정 + 이슈 번호
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
/e2e-test notice/list 1   → feature-path: notice/list, N: 1
```

**3순위: 현재 브랜치 자동 추론**

위 두 경우에 해당하지 않으면 `git branch --show-current`를 실행해 브랜치에서 추론한다.

브랜치명이 `main`, `master`, `develop`, `dev`이거나 `feature/` prefix가 없는 경우:

```
⚠️  현재 브랜치: main (보호 브랜치)
    E2E 작업은 feature 브랜치에서 진행해야 합니다.
    feature 브랜치로 전환 후 다시 실행해주세요.
```

`feature/*` 브랜치라면 prefix를 제거해 feature-path로 변환한다.

| 브랜치명 | feature-path |
|---------|-------------|
| `feature/tag` | `tag` |
| `feature/notice/list` | `notice/list` |

**4순위: 직접 입력 요청**

위 세 가지 모두 실패할 경우:

```
feature-path를 입력해주세요.
예) /e2e-test notice/list 1
```

---

## 진입 안내

feature-path와 이슈 번호가 결정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📁 feature-path: notice/list
📄 읽기: src/features/notice/list/docs/prd.md
🔍 스캔: src/features/notice/list/**/*.test.ts(x)
🎭 E2E Test — 사용자 시나리오 기반 Playwright 테스트 작성을 시작합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| PRD (읽기) | `src/features/{feature-path}/docs/prd.md` |
| 이슈 파일 (읽기) | `src/features/{feature-path}/docs/issue-{N}.md` |
| 기존 단위 테스트 (스캔) | `src/features/{feature-path}/**/*.test.ts(x)` |
| E2E 테스트 파일 (생성) | `e2e/{feature-path}/issue-{N}.spec.ts` |

**E2E 파일 위치 예시:**

```
feature-path: notice/list, N: 1
→ e2e/notice/list/issue-1.spec.ts

feature-path: tag, N: 2
→ e2e/tag/issue-2.spec.ts
```

---

## 파이프라인 개요

```
/e2e-test [{feature-path}] {N}
    ↓ feature-path 결정 (컨텍스트 → 직접 지정 → 브랜치 추론 → 직접 입력)
    ↓ 단계 1: PRD + 이슈 파일 읽기 — 사용자 스토리·AC 추출
    ↓ 단계 2: 기존 단위 테스트 스캔 — 이미 검증된 항목 목록화
    ↓ 단계 3: E2E 시나리오 도출 — 브라우저 흐름만 선별
    ↓ [GATE] 사용자 승인
    ↓ 단계 4: Playwright 테스트 코드 작성
    ↓ 단계 5: 실행 확인
    ↓ 완료 보고
```

---

## 단계 1: PRD + 이슈 파일 파싱

`src/features/{feature-path}/docs/prd.md`를 읽어 아래 항목을 추출한다.

- **사용자 스토리** (`## 사용자 스토리` 또는 `User Story` 섹션)
- **AC (Acceptance Criteria)** — Given-When-Then 형식

`src/features/{feature-path}/docs/issue-{N}.md`를 함께 읽어 해당 이슈의 AC를 보강한다.

**파일이 없는 경우:**

```
⚠️  prd.md 가 없습니다: src/features/{feature-path}/docs/prd.md
    /feature-planner 를 먼저 실행해 PRD를 생성해주세요.
```

---

## 단계 2: 기존 단위 테스트 스캔

`src/features/{feature-path}/**/*.test.ts(x)` 파일을 스캔해 **이미 검증된 항목**을 목록화한다.
스캔 대상은 `describe` 블록과 `it` / `test` 이름이다.

**중복 제거 기준:**
- 단위 테스트가 **동일한 조건+기대동작**을 이미 검증하면 E2E에서 반복하지 않는다.
- 단위 테스트가 "값 반환"을 검증했더라도, 브라우저에서 실제로 **화면에 렌더링**되는지를 검증하는 E2E는 중복이 아니다.
- `userEvent`, `fireEvent`로 검증한 인터랙션은 단위 테스트로 분류한다.

---

## 단계 3: E2E 시나리오 도출 (GATE 전 출력)

단계 1·2의 결과를 바탕으로 E2E에서 검증할 시나리오를 선별한다.

**E2E가 적합한 시나리오:**
- 페이지 전환 / 라우팅 흐름
- 폼 제출 후 서버 응답 → 화면 변화
- 인증 상태에 따른 리다이렉트
- 여러 컴포넌트에 걸친 연쇄 인터랙션 (예: 목록 → 상세 → 수정)
- 브라우저 고유 동작 (URL 변경, 뒤로 가기, 새로고침 후 상태 유지)

**E2E에서 제외할 시나리오:**
- 단위 테스트로 이미 검증한 값 계산·검증 로직
- 단일 컴포넌트의 렌더링 결과 (Vitest + Testing Library로 충분)
- API 응답 포맷 검증 (서비스 레이어 단위 테스트 담당)

**출력 형식 (GATE 전):**

```
📋 E2E 시나리오 (총 {N}개)

[포함] 로그인 성공 후 대시보드로 리다이렉트된다
[포함] 공지 목록에서 항목 클릭 시 상세 페이지로 이동한다
[포함] 공지 등록 폼 제출 후 목록에 새 항목이 표시된다
[제외] 공지 제목 유효성 검사 — 단위 테스트(NoticeForm.test.tsx)에서 검증됨

🔍 기존 단위 테스트에서 제외한 항목: {M}개

위 시나리오로 E2E 테스트를 작성할까요? (수정 사항이 있으면 알려주세요)
```

사용자가 승인하면 단계 4로 진행한다. 수정 요청이 있으면 시나리오를 조정한 후 다시 출력한다.

---

## 단계 4: Playwright 테스트 코드 작성

### 파일 구조

```ts
// e2e/{feature-path}/issue-{N}.spec.ts
import { expect, test } from '@playwright/test'

test.describe('{PRD 사용자 스토리 제목}', () => {
  test('{조건} 시 {기대동작}한다', async ({ page }) => {
    // Arrange: 시작 상태 설정
    await page.goto('/')

    // Act: 사용자 인터랙션
    await page.getByRole('button', { name: '공지 등록' }).click()

    // Assert: 결과 확인
    await expect(page.getByText('등록되었습니다')).toBeVisible()
  })
})
```

### 셀렉터 우선순위

Playwright 권장 순서를 따른다. 구현 세부사항에 덜 의존하는 것을 우선한다.

1. `getByRole` — 접근성 속성 기반 (최우선)
2. `getByLabel` — 폼 레이블
3. `getByPlaceholder` — 입력 힌트
4. `getByText` — 화면 텍스트
5. `getByTestId` — `data-testid` (마지막 수단)

`#id`, `.class` CSS 셀렉터는 사용하지 않는다.

### 인증이 필요한 테스트

로그인이 선행되어야 하는 시나리오는 `test.beforeEach`에서 처리한다.

```ts
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('이메일').fill('test@example.com')
  await page.getByLabel('비밀번호').fill('password')
  await page.getByRole('button', { name: '로그인' }).click()
  await page.waitForURL('/')
})
```

### 비동기 처리

- API 응답을 기다릴 때는 `await expect(...).toBeVisible()` 등 자동 대기가 내장된 Playwright assertion 사용
- `page.waitForTimeout()` 사용 금지 — 명시적 대기가 필요하면 `page.waitForURL()` 또는 `page.waitForResponse()` 사용

### Page Object Model (선택)

동일한 페이지에 대한 시나리오가 3개 이상이고 셀렉터가 중복되면 별도 파일로 분리한다.

```
e2e/{feature-path}/
├── issue-{N}.spec.ts
└── pages/
    └── {FeatureName}Page.ts   ← 셀렉터 + 액션 모음
```

시나리오가 2개 이하이면 파일 분리 없이 spec 파일 안에 인라인으로 작성한다.

---

## 단계 5: 실행 확인

테스트 파일 작성 후 아래 명령으로 실행한다. (`pnpm dev`가 실행 중인지 먼저 확인한다)

```bash
pnpm e2e e2e/{feature-path}/issue-{N}.spec.ts
```

**실패 유형 분류:**

| 실패 유형 | 원인 | 대응 |
|-----------|------|------|
| `Locator ... not found` | 셀렉터 불일치 | 실제 HTML 구조 확인 후 셀렉터 수정 |
| `Timeout exceeded` | 페이지/API 느림 | `waitForURL` · `waitForResponse` 보강 |
| `Expected visible, got hidden` | 조건부 렌더링 | 선행 액션 누락 확인 |
| 서버 오류(5xx) | 백엔드 미실행 | `pnpm dev` + 백엔드 서버 실행 안내 |

테스트가 통과하면 완료 보고로 넘어간다. 실패 시 원인을 분석해 수정하고 재실행한다.

---

## 완료 보고

```
✅ E2E Test 완료 — issue-{N}

🎭 작성된 E2E 파일:
   - e2e/{feature-path}/issue-{N}.spec.ts ({M}개 시나리오)

✅ 실행 결과: {M}/{M} 통과
🚫 단위 테스트 중복 제외: {K}개

다음 단계: /security-review {N}  (타입·보안 점검)
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 파일 조작 범위 | `e2e/` 폴더만 생성·수정 |
| `src/` 코드 | 절대 수정하지 않음 |
| 단위 테스트 | 기존 `.test.ts(x)` 파일 수정 금지 |
| 셀렉터 | CSS 클래스·ID 사용 금지, 역할·레이블·텍스트 우선 |
| 대기 | `waitForTimeout()` 사용 금지 |
| 시나리오 범위 | 단위 테스트로 이미 검증된 로직 중복 금지 |

---

## 승인 게이트

| 지점 | 내용 |
|------|------|
| 단계 3 후 | E2E 시나리오 목록 확인 → 사용자 승인 후 코드 작성 |

승인 없이 테스트 코드를 작성하지 않는다.
시나리오 수정 요청이 있으면 조정 후 다시 출력하고 재승인을 받는다.
