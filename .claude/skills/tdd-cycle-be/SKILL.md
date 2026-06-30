---
name: tdd-cycle-be
description: |
  TDD 풀 사이클 컨테이너. 이슈 번호 하나로 test-scenarios-be → security-review-be까지
  6단계를 순서대로 실행하고, 완료 후 해당 이슈 단위로 git commit을 실행한다.
  각 스킬의 승인 게이트는 그대로 유지된다.
  모든 이슈 완료 후 /create-pr-be로 PR 생성.
  "tdd-cycle-be"·"TDD 풀 사이클"·"이슈 TDD 사이클" 언급 시 이 스킬 사용.
---

# TDD 풀 사이클 컨테이너 [백엔드 · Spring Boot]

이슈 번호 하나를 받아 6개 서브 스킬을 **순서대로** 호출하고, 완료 후 **이슈 단위 커밋**을 실행한다.
컨테이너는 순서 보장과 진행 배너 출력만 담당하며, 각 스킬 내부의 승인 게이트는 그대로 작동한다.

> **워크플로우**:
> - 각 이슈: `/tdd-cycle-be N` → 6단계 → git commit (이슈 N)
> - 모든 이슈 완료 후: `/create-pr-be` → push → PR 생성

---

## 입력 형식

```
/tdd-cycle-be {N}    ← N = 이슈 번호 (숫자)
```

`$ARGUMENTS`가 비어 있으면 즉시 중단:

```
⛔ 이슈 번호를 입력해주세요.
    사용법: /tdd-cycle-be {N}
```

---

## 시작 배너 및 [CONTEXT] 선언

이슈 번호를 파싱한 뒤 아래 절차를 순서대로 실행한다.

### 1단계: 컨텍스트 결정

아래 순서로 결정한다. 위 단계에서 결정되면 아래는 실행하지 않는다.

1. 세션 내 기존 `[CONTEXT]` 블록 → 그대로 재사용
2. 현재 브랜치 자동 추론: `git branch --show-current` (`feature/*` prefix 제거 → feature-path)
3. `ls api/` + `find api -name "*Application.java" | head -1` → module-name·pkg-root 확정
4. 보호 브랜치(main/master/develop/dev) 감지 시 즉시 중단

컨텍스트가 확정되면 **[CONTEXT] 블록을 출력**한다. 이후 모든 서브 스킬은 이 블록을 1순위로 참조하여 git/파일 재탐색을 건너뛴다.

```
[CONTEXT] feature-path: {feature-path}
          module-name:  {module-name}
          api-module:   api/{module-name}
          ds-module:    datasource/{module-name}
          pkg-root:     {pkg-root}
          docs-root:    api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/
          branch:       {current-branch}
          issue:        {N}
```

### 2단계: 시작 배너 출력

```
┌─────────────────────────────────────────────────────────────┐
│  🔄 TDD 풀 사이클 — 이슈 #{N}                               │
│                                                             │
│  [ 1 ] test-scenarios-be  시그니처·시나리오 도출            │
│  [ 2 ] tdd-red-be         실패 테스트 작성                  │
│  [ 3 ] tdd-green-be       최소 구현                         │
│  [ 4 ] ac-verifier-be     AC 충족 검증                      │
│  [ 5 ] tdd-refactor-be    코드 구조 개선                    │
│  [ 6 ] security-review-be 보안·패턴·품질 점검               │
│  [ 7 ] git commit         이슈 단위 커밋                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 실행 규칙

1. 각 단계는 **Skill 도구**로 서브 스킬을 호출한다.
2. 서브 스킬 호출 전에 **단계 시작 배너**를 출력한다.
3. 서브 스킬 내부의 게이트(사용자 응답 대기)는 그대로 작동한다. 컨테이너는 추가 게이트를 만들지 않는다.
4. 서브 스킬이 ⛔ 메시지로 중단되면 **컨테이너도 즉시 중단**하고 아래 형식으로 출력한다.
5. 서브 스킬이 정상 완료되면 **단계 완료 배너**를 출력하고 다음 단계로 진행한다.

### 단계 시작 배너

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶ 단계 X/7 시작 — {스킬명}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 단계 완료 배너

서브 스킬 완료 직후, 핵심 결과를 1줄로 요약해 아래 형식으로 출력한다.

```
━━━ 단계 X/7 완료 ▶ 단계 X+1/7 시작 ━━━
📌 결과: {핵심 1줄 요약}
```

**단계별 요약 형식 예시:**

| 단계 | 요약 예시 |
|------|---------|
| 1 test-scenarios-be | `시그니처 확정 + 시나리오 8건 (Service 5 / Controller 3)` |
| 2 tdd-red-be | `테스트 8건 작성, 전체 정상 실패 (assertion fail)` |
| 3 tdd-green-be | `AC 4/4 통과, 구현 파일 3건 생성` |
| 4 ac-verifier-be | `AC 4건 모두 ✅ 충족` |
| 5 tdd-refactor-be | `리팩토링 3건 적용, 테스트 이상 없음` |
| 6 security-review-be | `즉시 수정 0건 / 권장 2건 / 무시 1건` |
| 7 git commit | `커밋 완료: feat: 이메일 인증 코드 전송 (#1)` |

### 중단 출력 형식

```
⛔ TDD 사이클 중단 — 이슈 #{N}

중단 단계: 단계 X/7 · {스킬명}
원인: {서브 스킬이 출력한 ⛔ 메시지 요약}

해결 후 해당 스킬부터 다시 실행하세요:
  /{스킬명} {N}
```

---

## 단계별 서브 스킬 호출

### 단계 1/7 — test-scenarios-be

```
Skill(skill="test-scenarios-be", args="{N}")
```

- 시그니처 승인 [GATE 1], 시나리오 승인 [GATE 2] — 사용자가 직접 응답.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 2/7 — tdd-red-be

```
Skill(skill="tdd-red-be", args="{N}")
```

- 게이트 없음. `issue-{N}.md`에 시그니처/시나리오 섹션 없으면 ⛔.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 3/7 — tdd-green-be

```
Skill(skill="tdd-green-be", args="{N}")
```

- 게이트 없음. 피드백 루프 5회 초과 시 ⛔.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 4/7 — ac-verifier-be

```
Skill(skill="ac-verifier-be", args="{N}")
```

- 게이트 없음. ⚠️/❌ 항목이 있으면 ⛔ 출력 → 사이클 중단.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 5/7 — tdd-refactor-be

```
Skill(skill="tdd-refactor-be", args="{N}")
```

- 리팩토링 대상 목록 보고 [GATE] — 사용자가 전체·부분·취소 선택.
  - "취소" 선택 → 스킬이 `완료: 0건` 요약 출력 후 정상 완료. 컨테이너는 다음 단계로 진행.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 6/6 — security-review-be

```
Skill(skill="security-review-be", args="{N}")
```

- 3분류 결과 보고 [GATE] — 사용자가 즉시 수정/권장/생략 선택.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 7/7 — git commit (이슈 단위)

6단계 완료 후 **git commit**을 실행한다.

```bash
# 1. git status 확인
git status

# 2. 커밋 메시지 생성 (issue-{N}.md에서 추출)
# 형식: {type}: {이슈 제목} (#{N})
# 예: feat(users): 이메일 인증 API 구현 (#1)

# 3. git commit 실행
git add .
git commit -m "{커밋 메시지}"
```

**커밋 메시지 생성 규칙:**

1. `issue-{N}.md`의 제목에서 이슈 제목 추출
2. Git 컨벤션 형식: `{type}: {제목} (#{N})`
   - type: `feat` | `fix` | `refactor` | `chore`
   - 제목: 한글 요약 (50자 이내)
   - 예: `feat: 이메일 인증 코드 전송 (#1)`

**완료 배너:**

```
━━━ 단계 7/7 완료 ━━━
✅ 이슈 #{N} 커밋 완료
📝 커밋 메시지: {실제 커밋 메시지}

다음 이슈가 있으면 /tdd-cycle-be {다음 이슈 번호}
모든 이슈 완료 시 /create-pr-be
```

---

## 완료 배너

7단계 모두 완료되면 출력한다.

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ TDD 풀 사이클 완료 — 이슈 #{N}                          │
│                                                             │
│  ✅ 단계 1 — test-scenarios-be                              │
│  ✅ 단계 2 — tdd-red-be                                     │
│  ✅ 단계 3 — tdd-green-be                                   │
│  ✅ 단계 4 — ac-verifier-be                                 │
│  ✅ 단계 5 — tdd-refactor-be                                │
│  ✅ 단계 6 — security-review-be                             │
│  ✅ 단계 7 — git commit                                     │
└─────────────────────────────────────────────────────────────┘

다음 이슈가 있으면: /tdd-cycle-be {다음 번호}
모든 이슈 완료 시: /create-pr-be
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| 추가 게이트 | 단계 사이에 "다음 단계 진행할까요?" 같은 확인 금지 |
| 서브 스킬 내부 | 컨테이너가 서브 스킬 내부 동작을 변경하거나 재현하지 않음 |
| 출력 | 단계 배너 외 컨테이너 자체 설명 출력 최소화 |
| 실패 감지 | ⛔ 이외의 에러(스킬 내부 경고 ⚠️ 등)는 실패로 간주하지 않음 |
