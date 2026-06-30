---
name: security-review
description: |
  refactor 완료 후 커밋 전, 타입 오류·코드 품질·보안 취약점을 점검하고 결과를 분류하는 스킬.
  /security-review {N} 또는 /security-review {feature-path} {N} 명령어로 진입.
  Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
  결과는 src/features/{feature-path}/docs/issue-{N}.md 하단 ## 보안 검토 섹션에 기록.
  /e2e-test 완료 후, git commit 전 실행.
  사용자가 "보안 검토", "security review", "취약점 점검", "타입 오류 확인",
  "커밋 전 검사", "audit", "lint 점검", "하드코딩 시크릿" 등을 언급하면 이 스킬을 사용할 것.
---

# Security Review Workflow

`/e2e-test` 완료 후 **커밋 전** 타입 오류·보안 취약점·코드 품질을 일괄 점검하는 파이프라인.
발견된 이슈를 세 분류로 나눠 개발자에게 보고하고, 승인 후 "즉시 수정 필요" 항목만 처리한다.

---

## 입력 형식

```
/security-review {N}                        ← 브랜치 추론 + 이슈 번호
/security-review {feature-path} {N}        ← 경로 직접 지정 + 이슈 번호
```

---

## feature-path 결정

아래 순서로 `feature-path`를 결정합니다. 위 단계에서 결정되면 아래는 실행하지 않습니다.

**1순위: 직접 지정**

첫 토큰에 슬래시(`/`)가 포함된 영문 경로 → `{feature-path}`로 판단.

```
/security-review notice/list 1   → feature-path: notice/list, N: 1
```

**2순위: 현재 브랜치 자동 추론**

위 경우에 해당하지 않으면 `git branch --show-current`를 실행해 브랜치에서 추론합니다.

**파싱 규칙:**
`feature/` prefix 제거 후, 마지막 세그먼트를 제외하고 **후보 feature-path**를 추출합니다.

| 브랜치명 | 후보 feature-path | 파싱 규칙 |
|---------|-----------------|-----------|
| `feature/tag/add-tag` | `tag` | prefix 제거 + 마지막 세그먼트 제거 |
| `feature/users/test` | `users` | prefix 제거 + 마지막 세그먼트 제거 |
| `feature/notice/list` | `notice` | prefix 제거 + 마지막 세그먼트 제거 |
| `feature/users/list/users-list` | `users/list` | prefix 제거 + 마지막 세그먼트 제거 |

> **마지막 세그먼트 제거 규칙:**
> - 브랜치명이 3개 이상 세그먼트면 마지막을 제거합니다.
> - 이는 기능의 하위 태스크(create-document, fix-bug 등)를 제거하고 상위 기능 경로를 추출하기 위함입니다.

**파일시스템 검증:**

후보 feature-path가 추출되면 실제 디렉토리가 존재하는지 검증합니다.

```bash
# docs 폴더 존재 확인
find src/features/{후보}/docs/ -type d 2>/dev/null

# 존재하지 않으면 현재 도메인 목록 확인
ls src/features/
```

| 검증 결과 | 처리 |
|----------|------|
| docs 폴더 존재 | ✅ feature-path 확정, 진행 |
| docs 폴더 없음 | ⚠️ 사용자 입력 요청 (아래 메시지) |

**⚠️ 경로를 찾을 수 없는 경우:**

파일시스템 검증 실패 시 `ls src/features/`로 존재하는 도메인을 나열한 뒤, 사용자에게 후보를 보여주고 직접 입력을 요청합니다.

```
⚠️ 경로를 찾을 수 없습니다.
   브랜치: feature/users/email/create-document
   추론된 feature-path: users/email

   현재 존재하는 도메인 (src/features/ 아래):
   - users    → src/features/users/

   feature-path를 직접 입력해주세요.
   예) users
```

**3순위: 보호 브랜치 감지**

브랜치명이 `main`, `master`, `develop`, `dev` 이거나 `feature/` prefix가 없는 경우 **즉시 중단**합니다.

```
⚠️  현재 브랜치: main (보호 브랜치)
    TDD 작업은 feature 브랜치에서 진행해야 합니다.
    feature 브랜치로 전환 후 다시 실행해주세요.
```

**4순위: 직접 입력 요청**

위 모든 경우에 해당하지 않으면 사용자에게 직접 입력을 요청합니다.

```
feature-path를 입력해주세요.
예) /security-review notice/list 1
```

---

## 진입 안내

feature-path와 이슈 번호가 결정되면 아래 형식으로 출력한다.

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📁 feature-path: notice/list
📄 읽기: src/features/notice/list/docs/issue-1.md
🔐 Security Review — 타입 오류·취약점·코드 품질을 점검합니다.
```

---

## 기본 브랜치 결정

수정 범위 산출에 사용할 기본 브랜치는 아래 순서로 결정한다.

```bash
# 1순위: 원격 HEAD 브랜치
git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | sed 's|origin/||'

# 결과가 없으면 2순위: 로컬에 main 존재 여부
git show-ref --verify --quiet refs/heads/main && echo main || echo master
```

결정된 기본 브랜치를 `{기본브랜치}` 자리에 대입한다.

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기 · 쓰기) | `src/features/{feature-path}/docs/issue-{N}.md` |
| 수정 대상 파일 | `git diff {기본브랜치}...HEAD --name-only -- src/` 결과 중 비테스트 파일 |

---

## 파이프라인 개요

```
/security-review [{feature-path}] {N}
    ↓ feature-path 결정 (직접 지정 → 브랜치 추론 → 보호 브랜치 감지 → 직접 입력)
    ↓ 단계 1: npx tsc --noEmit → 타입 오류 목록 수집
    ↓ 단계 2: pnpm audit → 취약점 목록 수집
    ↓ 단계 3: grep src/ → 하드코딩 시크릿 패턴 확인
    ↓ 단계 4: eslint --max-warnings=0 src/ → lint 오류 수집 (수정 금지)
    ↓ 단계 5: 결과 세 분류로 정리 후 보고 → 개발자 승인 대기 [GATE]
    ↓ 단계 6: 승인 후 "즉시 수정 필요" 항목만 처리
    ↓ 단계 7: 재스캔 → 클린 기준 충족 확인 → issue-{N}.md 하단 기록
```

---

## 단계 1: TypeScript 타입 검사

```bash
npx tsc --noEmit
```

오류 목록(파일명·라인·메시지)을 수집하고 아래 항목은 "무시 가능" 후보로 마킹한다.

- `@ts-ignore` 주석이 달린 라인의 오류
- `.d.ts` 파일 내부 오류

---

## 단계 2: 의존성 취약점 검사

```bash
pnpm audit
```

취약점 목록(패키지명·심각도·설명)을 수집하고 아래 항목은 "무시 가능" 후보로 마킹한다.

- `devDependencies`에 속하는 low 심각도 취약점

---

## 단계 3: 하드코딩 시크릿 grep

`src/` 내 아래 세 가지 패턴을 순서대로 확인한다.

```bash
# 패턴 1: 하드코딩 시크릿 (API 키, 토큰)
grep -rEn "sk-|pk_|Bearer [A-Za-z0-9]{20,}" src/

# 패턴 2: .env 직접 import
grep -rEn "require\('.env'\)|import '.env'" src/

# 패턴 3: 시크릿 변수명에 값 할당
grep -rEn "(API_KEY|SECRET|PASSWORD|TOKEN)\s*=\s*['\"][^'\"]{8,}" src/
```

발견된 항목은 무조건 **즉시 수정 필요**로 분류한다.

---

## 단계 4: ESLint 검사 (목록 파악 전용)

```bash
pnpm lint
```

lint 오류 목록을 수집한다. 이 단계에서는 **수정하지 않는다** (`--fix` 미사용).

`eslint-disable` 주석이 달린 라인의 오류는 "무시 가능" 후보로 마킹한다.

---

## 단계 5: 결과 분류 및 보고 [GATE]

수집된 결과를 세 분류로 정리해 개발자에게 출력한다.

### 분류 기준

| 분류 | 포함 항목 |
|------|----------|
| **즉시 수정 필요** | tsc 빌드 오류, high/critical 취약점, 하드코딩 시크릿, lint error |
| **권장 수정** | moderate 취약점, lint warning, 타입 경고 |
| **무시 가능** | devDeps low 취약점, @ts-ignore 라인 오류, .d.ts 오류, eslint-disable 라인 오류 |

### 출력 형식

```
🔐 Security Review 결과 — issue-{N}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ 즉시 수정 필요 ({N}건)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[tsc] src/features/notice/list/hooks/useNoticeList.ts:12:5
  — Type 'string' is not assignable to type 'number'
[audit] lodash@4.17.20 — Prototype Pollution (high)
[secret] src/features/auth/services/authService.ts:3
  — API_KEY = 'sk-abc1234...' (하드코딩 시크릿)
[lint] src/features/notice/list/components/NoticeList.tsx:45
  — 'unused' is defined but never used

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  권장 수정 ({N}건)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[audit] axios@1.6.0 — ReDoS vulnerability (moderate)
[lint] src/features/notice/list/pages/NoticeListPage.tsx:20
  — Unexpected console statement (warning)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 무시 가능 ({N}건)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[tsc] src/types/global.d.ts:5 — @ts-ignore 적용
[audit] some-dev-pkg@1.0.0 — devDependencies low

"즉시 수정 필요" 항목을 처리할까요?
(승인 / 항목별 선택 가능 — 예: "1, 3번만" / 취소)
```

**즉시 수정 필요 항목이 없는 경우:**

```
✅ 즉시 수정 필요 항목 없음 — 단계 7 재스캔으로 진행합니다.
```

---

## 단계 6: "즉시 수정 필요" 항목 처리

개발자 승인 확인 후 승인된 항목을 하나씩 처리한다.

### 수정 원칙

- `git diff {기본브랜치}...HEAD --name-only -- src/` 결과 파일 범위 내에서만 수정
- `.test.ts` / `.test.tsx` 파일 수정 금지
- `eslint --fix` 자동 실행 금지 → lint 오류는 항목별 수동 처리
- `pnpm audit fix --force` 사용 금지 → 취약점은 패키지 버전 직접 수정

### 항목 진행 중 상태 출력 예시

```
🔧 [1/3] tsc 오류 수정 — useNoticeList.ts:12
   → 타입 수정 완료
🔧 [2/3] 하드코딩 시크릿 제거 — authService.ts:3
   → 환경 변수(import.meta.env)로 교체 완료
🔧 [3/3] lint 오류 수정 — NoticeList.tsx:45
   → 미사용 변수 제거 완료
```

---

## 단계 7: 재스캔 및 issue-{N}.md 기록

### 재스캔

```bash
npx tsc --noEmit    # 오류 0건 확인
pnpm audit          # 즉시 수정 필요 항목 0건 확인
pnpm lint           # 즉시 수정 필요 항목 0건 확인
pnpm test:run       # 전체 통과 확인 (회귀 방지)
```

**클린 기준:** 네 조건 모두 충족 시 통과.

조건 미충족 시 단계 6으로 돌아가 추가 처리한다.

### issue-{N}.md 하단 기록

클린 기준 충족 후 `issue-{N}.md` 파일 **최하단**에 아래 섹션을 추가한다.

```markdown
---

## 보안 검토

검토일: {YYYY-MM-DD}

### 즉시 수정 필요 (처리 완료)
- [x] {처리 완료된 항목}

### 권장 수정
- [ ] {권장 항목 — 개발자 판단으로 별도 처리}

### 무시 가능
- {무시 항목}: {근거}

### 클린 기준 충족
- [x] npx tsc --noEmit: 오류 0건
- [x] pnpm audit: 즉시 수정 필요 0건
- [x] pnpm lint: 즉시 수정 필요 0건
- [x] pnpm test:run: 전체 통과
```

### 완료 출력

```
✅ Security Review 완료 — issue-{N}

📋 처리 완료:
  ✅ tsc 오류 1건 수정
  ✅ 하드코딩 시크릿 1건 환경 변수로 교체
  ✅ lint 오류 1건 제거

⚠️  권장 수정 항목 {N}건 — issue-{N}.md에 기록됨 (개발자 판단 처리)

🧪 최종 테스트: {통과 수}/{전체 수} 통과
📝 보안 검토 결과가 issue-{N}.md 하단에 기록되었습니다.

➡️  다음 단계: git commit
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 판단이 필요한 항목 | 반드시 개발자 승인 후 수정 |
| 테스트 파일 수정 | 금지 (`.test.ts` / `.test.tsx`) |
| 취약점 강제 수정 | `pnpm audit fix --force` 사용 금지 |
| 수정 범위 | `git diff` 결과 외 파일 수정 금지 |
| ESLint 자동 수정 | `eslint --fix` 자동 실행 금지 — 승인 후 항목별 수동 처리 |

---

## 승인 게이트

단계 5에서 분류 결과를 보고한 뒤 반드시 개발자 승인을 기다린다.
승인 없이 코드를 변경하지 않는다.

단, 아래 경우에는 즉시 중단한다.

issue-{N}.md 파일 자체가 없는 경우:
```
⚠️  issue-{N}.md 파일이 없습니다.
    /test-scenarios {N} → /tdd-red {N} → /tdd-green {N} → /tdd-refactor {N} 순서로 먼저 실행해주세요.
```
