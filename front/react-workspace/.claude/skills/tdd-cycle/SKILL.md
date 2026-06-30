---
name: tdd-cycle
description: |
  이슈 1개의 TDD 풀 사이클(8단계)을 순서대로 실행하는 컨테이너 스킬.
  test-scenarios → tdd-red → tdd-green → ac-verifier → tdd-refactor → e2e-test → security-review → git commit 순서를 보장하며,
  완료 후 해당 이슈 단위로 커밋된다.
  각 단계 내부의 승인 게이트는 그대로 작동한다. 컨테이너 자체는 순서만 보장하고 추가 게이트를 만들지 않는다.
  모든 이슈 완료 후 /create-pr로 PR 생성.

  다음 상황에서 반드시 이 스킬을 사용할 것:
  - "/tdd-cycle"
  - "이슈 N번 TDD로 처음부터 끝까지"
  - "test-scenarios부터 git commit까지 한 번에"
  - "TDD 8단계 전부 돌려줘"
---

# TDD Cycle — 풀 사이클 컨테이너

이슈 1개를 받아 TDD 8단계를 **순서대로** 실행한다.
각 단계는 기존 스킬/에이전트를 그대로 위임 호출하며, 내부 승인 게이트는 유지된다.
컨테이너는 "순서 보장"과 "진행 상태 표시"만 담당한다.

---

## 입력 형식

```
/tdd-cycle {N}                     ← 브랜치 추론 + 이슈 번호
/tdd-cycle {feature-path} {N}     ← 경로 직접 지정 + 이슈 번호
```

---

## 단계 0: 사전 점검 및 배너 출력

### feature-path 결정

아below 우선순위로 `feature-path`를 결정합니다. 위 단계에서 결정되면 아래는 실행하지 않습니다.

**1순위: 직접 지정**

첫 토큰에 슬래시(`/`)가 포함된 영문 경로 → `{feature-path}`로 판단.

```
/tdd-cycle notice/list 3   → feature-path: notice/list, N: 3
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
```

| 검증 결과 | 처리 |
|----------|------|
| docs 폴더 존재 | ✅ feature-path 확정, 진행 |
| docs 폴더 없음 | ⚠️ 사용자 입력 요청 (아래 메시지) |

**⚠️ 경로를 찾을 수 없는 경우:**

파일시스템 검증 실패 시 사용자에게 후보를 보여주고 직접 입력을 요청합니다.

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

브랜치명이 `main`, `master`, `develop`, `dev`이거나 `feature/` prefix가 없는 경우 **즉시 중단**합니다.

```
⚠️  현재 브랜치: master (보호 브랜치)
    TDD Loop는 feature 브랜치에서 실행해야 합니다.

    feature 브랜치를 생성한 뒤 다시 실행해주세요.
    예) git checkout -b feature/notice/list
```

**4순위: 직접 입력 요청**

위 모든 경우에 해당하지 않으면 사용자에게 직접 입력을 요청합니다.

### 시작 배너

feature-path와 이슈 번호 N이 확정되면 아래 배너를 출력하고 단계 1로 진행한다.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄  TDD Loop 시작
    feature-path : {feature-path}
    이슈 번호    : #{N}
    진행 단계    : 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 실행 순서

각 단계 시작 전 진행 메시지를 출력한다.
단계가 완료되면 체크 메시지를 출력하고 다음 단계로 넘어간다.
단계 실패 시 중단 메시지를 출력하고 루프를 종료한다.

### 단계 1/8 — test-scenarios

```
▶ 단계 1/8: test-scenarios 호출 중…
```

`/test-scenarios {feature-path} {N}` 스킬을 실행한다.

스킬 내부 동작:
- GATE 1: 시그니처 승인 (사용자 응답 필요)
- GATE 2: 시나리오 승인 (사용자 응답 필요)
- `issue-{N}.md`에 시그니처 + 테스트 시나리오 기록

완료 확인 조건: `issue-{N}.md`에 `## 테스트 시나리오` 섹션이 존재한다.

```
✅ 단계 1 완료 → 다음: tdd-red
```

---

### 단계 2/8 — tdd-red

```
▶ 단계 2/8: tdd-red 호출 중…
```

`/tdd-red {feature-path} {N}` 스킬을 실행한다.

스킬 내부 동작:
- 시나리오 → 실패 테스트 변환
- stub 생성 안내 (collect 실패 시)
- 모든 테스트가 "정상 실패(assertion fail)"로 끝나야 완료

완료 확인 조건: 테스트 파일이 존재하고 `pnpm test:run`이 컴파일 에러 없이 실패한다.

```
✅ 단계 2 완료 → 다음: tdd-green
```

---

### 단계 3/8 — tdd-green

```
▶ 단계 3/8: tdd-green 호출 중…
```

`/tdd-green {feature-path} {N}` 스킬을 실행한다.

스킬 내부 동작:
- 최소 구현으로 모든 테스트 통과
- 5회 피드백 루프 (실패 시 자동 수정)
- 회귀 감시 (기존 테스트 깨지지 않아야 함)

완료 확인 조건: `pnpm test:run` 전체 통과.

```
✅ 단계 3 완료 → 다음: ac-verifier
```

---

### 단계 4/8 — ac-verifier

```
▶ 단계 4/8: ac-verifier 호출 중…
```

`/ac-verifier {N}` 스킬을 실행한다.

스킬 내부 동작:
- `issue-{N}.md`의 AC 항목을 구현 코드와 대조
- 테스트 통과 ≠ AC 충족 — 독립적으로 판단
- 갭이 발견되면 사용자에게 보고 후 대기

완료 확인 조건: 에이전트가 "AC 충족" 또는 "갭 있음 → 사용자 확인" 보고를 완료한다.
갭이 있어 사용자가 수정을 결정한 경우: 수정 완료 후 단계 3으로 되돌아가도록 안내하고 루프를 중단한다.

```
✅ 단계 4 완료 → 다음: tdd-refactor
```

---

### 단계 5/8 — tdd-refactor

```
▶ 단계 5/8: tdd-refactor 호출 중…
```

`/tdd-refactor {feature-path} {N}` 스킬을 실행한다.

스킬 내부 동작:
- 구조 개선 (변경마다 `pnpm test:run` 실행)
- 테스트가 깨지면 즉시 롤백

완료 확인 조건: 리팩토링 후 `pnpm test:run` 전체 통과.

```
✅ 단계 5 완료 → 다음: e2e-test
```

---

### 단계 6/8 — e2e-test

```
▶ 단계 6/8: e2e-test 호출 중…
```

`/e2e-test {feature-path} {N}` 스킬을 실행한다.

스킬 내부 동작:
- PRD 사용자 스토리 + 이슈 AC 추출
- 기존 단위 테스트와 중복되는 시나리오 제외
- E2E 시나리오 목록 승인(GATE) 후 Playwright 테스트 코드 작성
- `pnpm e2e e2e/{feature-path}/issue-{N}.spec.ts` 실행 및 통과 확인

완료 확인 조건: E2E 테스트 파일이 생성되고 모든 시나리오가 통과한다.

```
✅ 단계 6 완료 → 다음: security-review
```

---

### 단계 7/8 — security-review

```
▶ 단계 7/8: security-review 호출 중…
```

`/security-review {feature-path} {N}` 스킬을 실행한다.

스킬 내부 동작:
- `tsc` 타입 검사
- `pnpm audit` 의존성 취약점 검사
- 보안 패턴 점검 (하드코딩 시크릿, XSS 등)
- 결과를 세 등급으로 분류: 즉시수정 / 계획수정 / 참고

완료 확인 조건: 즉시수정 항목이 0개이거나, 수정 완료 후 재검사 통과.

```
✅ 단계 7 완료 → 다음: git commit
```

---

### 단계 8/8 — git commit (이슈 단위)

```
▶ 단계 8/8: git commit 실행 중…
```

7단계 완료 후 **git commit**을 실행합니다.

```bash
# 1. git status 확인
git status

# 2. 커밋 메시지 생성 (issue-{N}.md에서 추출)
# 형식: {type}: {이슈 제목} (#{N})
# 예: feat: 이메일 인증 코드 전송 (#1)

# 3. git commit 실행
git add .
git commit -m "{커밋 메시지}"
```

**커밋 메시지 생성 규칙:**

1. `issue-{N}.md`의 제목에서 이슈 제목 추출
2. Git 컨벤션 형식: `{type}: {제목} (#{N})`
   - type: `feat` | `fix` | `refactor` | `chore` | `test` | `style`
   - 제목: 한글 요약 (50자 이내)
   - 예: `feat: 이메일 인증 코드 전송 (#1)`

**완료 배너:**

```
━━━ 단계 8/8 완료 ━━━
✅ 이슈 #{N} 커밋 완료
📝 커밋 메시지: {실제 커밋 메시지}

다음 이슈가 있으면 /tdd-cycle {다음 이슈 번호}
모든 이슈 완료 시 /create-pr
```

---

## 완료 배너

모든 단계가 성공하면 아래 배너를 출력합니다.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉  TDD Loop 완료!
    이슈  : #{N}
    커밋  : {커밋 메시지}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

다음 이슈가 있으면: /tdd-cycle {다음 번호}
모든 이슈 완료 시: /create-pr
```

---

## 단계 실패 처리

어느 단계에서든 스킬/에이전트가 오류로 중단되면:

```
❌ 단계 {N}/8 [{단계명}] 에서 중단됨.
   원인: {한 줄 요약}

   수정 후 해당 단계부터 다시 실행하세요:
   /{스킬명} {feature-path} {이슈번호}
```

루프를 종료하고 추가 단계를 자동으로 진행하지 않습니다.

---

## 컨테이너 행동 원칙

1. **순서 보장** — 단계를 건너뛰거나 순서를 바꾸지 않는다.
2. **게이트 위임** — 각 스킬 내부의 승인 게이트가 작동하므로, 컨테이너는 "다음 단계 진행할까요?" 같은 추가 확인을 만들지 않는다.
3. **진행 상태 투명성** — 각 단계 시작/완료 시 단순 메시지만 출력한다.
4. **실패 즉시 중단** — 실패한 단계에서 멈추고 다음으로 넘어가지 않는다.
5. **ac-verifier 갭 발견 시** — 단계 3으로 되돌아가도록 안내하고 루프를 중단한다. 갭을 무시하고 진행하지 않는다.
