---
name: test-scenarios
description: |
  이슈 단위로 함수·컴포넌트 시그니처를 확정하고 테스트 시나리오를 도출하는 스킬. /test-scenarios 명령어로 진입.
  Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
  /feature-planner 세션 컨텍스트가 있으면 feature-path를 자동 로드해 경로 입력을 생략할 수 있다.
  사용자가 "테스트 시나리오", "시그니처 도출", "AC 커버리지", "TDD 준비", "issue 시나리오" 등을 언급하면 반드시 이 스킬을 사용할 것.
  feature-planning 스킬의 task.md가 확정된 직후, 각 태스크를 TDD로 구현하기 전에 실행한다.
---

# Test Scenarios Workflow

태스크의 시그니처를 확정하고 테스트 시나리오를 도출하는 파이프라인.
두 개의 GATE에서 사용자의 명시적 승인을 받아야 다음 단계로 진행한다.

---

## 브랜치 기반 경로 자동 추론

### 입력 형식

```
/test-scenarios                       ← 컨텍스트 또는 브랜치에서 자동 추론 + 태스크 번호 질문
/test-scenarios {N}                   ← 컨텍스트 또는 브랜치 추론 + 태스크 번호 지정
/test-scenarios {feature-path} {N}   ← 경로 직접 지정 (기존 방식)
```

### 경로 결정 우선순위

아래 순서로 `feature-path`를 결정한다. 위 단계에서 결정되면 아래 단계는 실행하지 않는다.

**1순위: /feature-planner 세션 컨텍스트**

같은 세션에서 `/feature-planner`가 먼저 실행된 경우, `[CONTEXT]`의 `feature-path`를 그대로 사용한다.
별도로 `git` 명령을 실행하거나 사용자에게 경로를 묻지 않는다.

```
[CONTEXT] feature-path: notice/list   ← 이 값을 자동 사용
```

**2순위: 직접 지정**

첫 토큰에 슬래시(`/`)가 포함된 영문 경로 → `{feature-path}`로 판단.

```
/test-scenarios notice/list 1   → feature-path: notice/list, N: 1
```

**3순위: 현재 브랜치 자동 추론**

위 두 경우에 해당하지 않으면 `git branch --show-current`를 실행해 브랜치에서 추론한다.

#### 보호 브랜치 감지

브랜치명이 `main`, `master`, `develop`, `dev` 이거나 `feature/` · `feat/` prefix가 없는 경우:

```
⚠️  현재 브랜치: main (보호 브랜치)
    시나리오 작업은 feature 브랜치에서 진행해야 합니다.

    기능명을 알려주시면 브랜치명을 제안해드릴게요.
    예) "공지 목록"       → feature/notice/list
        "태그 관리"       → feature/tag
        "공지 검색 조건"  → feature/notice/list-search
```

사용자가 기능명을 입력하면:

1. **브랜치명 제안**
   ```
   제안 브랜치명: feature/{feature-path}

   ✅ 이 이름으로 생성할까요?
   ```

2. **브랜치 생성 명령어 제시**
   > Claude는 git 명령을 직접 실행하지 않는다. 사용자가 직접 실행하도록 명령어를 제시한다.
   ```bash
   git checkout -b feature/notice/list
   ```
   ```
   위 명령어 실행 후 "완료"라고 말씀해주세요.
   ```

3. **"완료" 응답 시** → feature-path 확정 → 경로 안내 출력 → 태스크 번호 확인으로 진행

#### 브랜치 컨벤션

> - `/` : 계층 구분자 (도메인/기능/하위기능)
> - `-` : 같은 계층 내 단어 연결

#### feature/* 브랜치 변환 규칙

| 브랜치명 | feature-path |
|---------|-------------|
| `feature/tag` | `tag` |
| `feature/notice/list` | `notice/list` |
| `feature/notice/list-search` | `notice/list-search` |
| `feat/notice/category/detail` | `notice/category/detail` |
| `feature/notice/tag-filter` | `notice/tag-filter` |

**변환 알고리즘:**
1. `feature/` 또는 `feat/` prefix 제거
2. 나머지를 그대로 `feature-path`로 사용 (슬래시·하이픈 변환 없음)

### 경로 확정 안내

경로가 결정되면 아래 형식으로 사용자에게 보여준다.

```
🌿 브랜치: feature/notice/list            ← 브랜치 추론 시에만 표시
📁 feature-path: notice/list
📋 태스크: /src/features/notice/list/docs/task.md — Task {N}
📄 참조: /src/features/notice/list/docs/prd.md
✏️  기록: /src/features/notice/list/docs/issue-{N}.md

변경이 필요하면 말씀해주세요. 없으면 바로 분석을 시작합니다.
```

컨텍스트에서 자동 로드한 경우에는 브랜치 줄을 생략하고 아래처럼 표시한다.

```
📁 feature-path: notice/list  (feature-planner 컨텍스트에서 로드)
📋 태스크: /src/features/notice/list/docs/task.md — Task {N}
📄 참조: /src/features/notice/list/docs/prd.md
✏️  기록: /src/features/notice/list/docs/issue-{N}.md
```

### 태스크 번호가 없는 경우

`{N}`이 입력되지 않았으면 경로 확정 후 바로 질문한다.

```
몇 번 태스크를 진행할까요?
```

---

## 경로 규칙

- `features/` 하위 기능: `src/features/{feature-path}/docs/`
- 공통 컴포넌트 등: `src/{feature-path}/docs/` (feature-path에 전체 경로 포함)

---

## 파이프라인 개요

```
/test-scenarios [{feature-path}] [{N}]
    ↓ feature-path 결정 (컨텍스트 → 직접 지정 → 브랜치 추론)
    │   └─ 보호 브랜치 감지 시: 브랜치 생성 안내 → 완료 확인 후 재진입
    ↓ 태스크 번호 확인 (없으면 질문)
    ↓ 경로 및 파일 확인 안내
    ↓ 단계 1: task.md(Task N) + prd.md 참고 + 코드베이스 분석 → 시그니처 도출
    ↓ [GATE 1] 시그니처 승인
    ↓ 단계 2: issue-{N}.md 상단에 시그니처 기록
    ↓ 단계 3: 시나리오 도출 + Task N AC 대조
    ↓ [GATE 2] 시나리오 승인 → issue-{N}.md 하단에 기록
```

---

## 진입: 파일 확인

- `task.md`가 없으면 사용자에게 알리고 대기한다. 파일 없이 시그니처를 추측하지 않는다.
- `task.md` 안에 Task {N}이 없으면 사용자에게 알린다.
- `prd.md`가 없으면 참고 없이 진행 가능하나 사용자에게 알린다.
- `issue-{N}.md`는 없어도 단계 2에서 새로 생성하므로 진행한다.

---

## 단계 1: 시그니처 도출

### 분석 범위

**반드시 읽어야 할 파일:**
1. `{docs-path}/task.md` — Task {N}의 설명, 생성/수정 파일 목록, AC 항목 추출
2. `{docs-path}/prd.md` — 전체 기능 맥락 및 사용자 스토리 (참고)

**기존 패턴 탐색 순서:**
1. `src/api/services/` — 도메인 서비스 함수 시그니처 패턴
2. `src/features/{feature-path}/hooks/` — TanStack Query 훅 패턴
3. `src/features/{feature-path}/types/` — 도메인 타입 패턴
4. `src/components/common/` — 재사용할 공통 컴포넌트와 해당 Props 타입
5. `src/api/generated/model/` — Orval 생성 타입 (API 응답 구조 파악)

### 시그니처 도출 규칙

- **구현 코드는 절대 작성하지 않는다.** 타입 선언과 함수 시그니처만 작성한다.
- **기존 패턴을 우선 따른다.** 코드베이스에 이미 있는 패턴과 다르게 도출하면 그 이유를 명시한다.
- **단일 책임 원칙** — 함수 하나는 하나의 책임만 가진다. 시그니처가 복잡해진다면 분리를 고려한다.
- **공통 컴포넌트 Props 재사용** — 기존 공통 컴포넌트의 Props를 `Pick`, `Omit`으로 조합한다. 중복 정의 금지.
- task.md의 **"생성/수정 파일"** 목록을 기준으로 시그니처 범위를 결정한다.

### 도출 항목

태스크에 포함된 코드 영역에 따라 해당하는 항목만 도출한다.

#### 함수 시그니처 (API 서비스 / 유틸 함수)

```ts
// {함수명}: {한 줄 설명}
function {함수명}({파라미터}: {타입}): {반환타입}

// 에러 케이스: {어떤 상황에서 무엇을 throw하는가}
```

#### TanStack Query 훅 시그니처

```ts
// {훅명}: {한 줄 설명}
function {훅명}({파라미터}: {타입}): {반환타입}

// Query Key: {queryKey 구조}
```

#### 컴포넌트 Props 타입

```ts
// {컴포넌트명}Props: {한 줄 설명}
type {컴포넌트명}Props = {
{propName}: {타입}
// 공통 컴포넌트에서 Pick/Omit한 경우: 출처 명시
}
```

#### Zustand Store 액션 시그니처

```ts
// {액션명}: {한 줄 설명}
{액션명}: ({파라미터}: {타입}) => void
```

### 출력 형식 (사용자에게 보여주는 형태)

```
## Task {N} 시그니처

### 컴포넌트 Props
{Props 타입 목록}

### API 서비스
{함수 시그니처 목록}

### 훅
{훅 시그니처 목록}

### Store 액션
{액션 시그니처 목록}

---
📌 참고한 기존 패턴: {파일 경로 목록}
```

---

## [GATE 1] 시그니처 승인

```
[GATE 1] 위 시그니처를 검토해주세요.
         수정이 필요하면 말씀해주세요.
         승인(yes / ok / 확인 / 좋아)하면 issue-{N}.md에 기록합니다.

         ⚠️ 승인 전까지 파일에 기록하지 않는다.
```

수정 요청이 오면 반영 후 재확인한다.

---

## 단계 2: 시그니처 기록

승인된 시그니처를 `{docs-path}/issue-{N}.md` **상단**에 기록한다.

- 파일이 없으면 새로 생성한다.
- 파일이 이미 있으면 기존 내용 **위**에 시그니처 섹션을 삽입한다.

**기록 형식:**

````markdown
## 시그니처

### 컴포넌트 Props
```ts
{승인된 Props 타입}
```

### API 서비스
```ts
{승인된 함수 시그니처}
```

### 훅
```ts
{승인된 훅 시그니처}
```

### Store 액션
```ts
{승인된 액션 시그니처}
```

---

{기존 이슈 내용 (있는 경우 그대로 유지)}
````

---

## 단계 3: 시나리오 도출 + AC 대조

### 시나리오 도출 규칙

- **테스트 코드는 작성하지 않는다.** 시나리오 설명문만 작성한다.
- 분류는 **정상 / 경계 / 예외** 세 가지만 사용한다.
- **형식**: `[분류] 함수명/컴포넌트명 — should {기대동작} when {조건}`

**분류 기준:**

| 분류 | 기준 | 예시 조건 |
|------|------|---------|
| 정상 | 의도한 대로 동작하는 케이스 | 유효한 입력, 정상 응답 |
| 경계 | 입력 범위의 끝, 빈 값, 최대/최소 | 빈 배열, 최대 길이 문자열, 0 |
| 예외 | 오류, 실패, 예상치 못한 입력 | 네트워크 오류, null, 권한 없음 |

### AC 대조

`task.md`의 Task {N} AC 항목을 기준으로 아래를 확인한다.

1. 모든 AC 항목에 최소 1개 이상의 시나리오가 있는지 확인한다.
2. 커버되지 않은 AC가 있으면 시나리오를 추가한다.
3. 시나리오 목록 하단에 AC 매핑 테이블을 작성한다.

**AC 매핑 테이블 형식:**

```markdown
### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| AC-{N}-1: Given ..., When ..., Then ... | [정상] 함수명 — ... |
| AC-{N}-2: Given ..., When ..., Then ... | [경계] 함수명 — ..., [예외] 함수명 — ... |
```

---

## [GATE 2] 시나리오 승인

```
[GATE 2] 위 시나리오와 AC 커버리지를 검토해주세요.
         - Task {N}의 모든 AC가 최소 1개 이상의 시나리오로 커버되었나요?
         - 누락된 엣지 케이스가 있나요?
         수정이 필요하면 말씀해주세요.
         승인(yes / ok / 확인 / 좋아)하면 issue-{N}.md 하단에 기록합니다.

         ⚠️ 승인 전까지 파일에 기록하지 않는다.
```

승인 후 아래 형식을 `issue-{N}.md` 하단에 추가한다.

````markdown
---

## 테스트 시나리오

### API 서비스 / 훅

- [정상] {함수명} — should {기대동작} when {조건}
- [경계] {함수명} — should {기대동작} when {조건}
- [예외] {함수명} — should {기대동작} when {조건}

### 컴포넌트

- [정상] {컴포넌트명} — should {기대동작} when {조건}
- [경계] {컴포넌트명} — should {기대동작} when {조건}
- [예외] {컴포넌트명} — should {기대동작} when {조건}

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| ... | ... |
````

승인이 완료되면 아래 메시지를 출력한다.

```
✅ issue-{N}.md 업데이트 완료
   - 상단: 시그니처
   - 하단: 테스트 시나리오 + AC 커버리지

다음 단계: /tdd-red {N}  (feature-path 자동 사용)
```

---

## 승인 게이트 요약

| 지점 | 확인 내용 | 긍정 응답 예시 |
|------|----------|--------------|
| GATE 1 | 시그니처 — 타입 정확성, 기존 패턴 일치 여부 | yes / ok / 확인 / 좋아 |
| GATE 2 | 시나리오 — AC 커버리지 완성도, 엣지 케이스 누락 여부 | yes / ok / 확인 / 좋아 |

GATE가 없으면 잘못된 시그니처로 테스트가 작성되고 나중에 수정 비용이 커진다.
반드시 각 GATE에서 멈추고 사용자의 응답을 기다릴 것.