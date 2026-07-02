---
name: tdd-cycle-be
description: |
  TDD 풀 사이클 컨테이너. 이슈 번호 하나로 tdd-red-be → security-review-be까지
  5단계를 순서대로 실행하고, 완료 후 해당 이슈 단위로 git commit을 실행한다.
  test-scenarios-be는 이 컨테이너에 포함되지 않는다 — 실행 전 issue-{N}.md에 시그니처·
  테스트 시나리오가 이미 확정되어 있어야 하며, 없으면 /test-scenarios-be N을 먼저 별도 실행한다.
  GATE가 없는 무거운 단계(tdd-red-be·tdd-green-be·ac-verifier-be)는 서브에이전트에 위임해
  메인 세션의 컨텍스트 소비를 줄인다. 각 스킬의 승인 게이트는 그대로 유지된다.
  모든 이슈 완료 후 /create-pr-be로 PR 생성.
  "tdd-cycle-be"·"TDD 풀 사이클"·"이슈 TDD 사이클" 언급 시 이 스킬 사용.
---

# TDD 풀 사이클 컨테이너 [백엔드 · Spring Boot]

이슈 번호 하나를 받아 5개 서브 스킬(tdd-red-be → security-review-be)을 **순서대로** 실행하고,
완료 후 **이슈 단위 커밋**을 실행한다. 컨테이너는 순서 보장과 진행 배너 출력을 담당하며,
각 스킬 내부의 승인 게이트는 그대로 작동한다.

> **사전 조건**: `issue-{N}.md`에 `## 시그니처`·`## 테스트 시나리오` 섹션이 이미 확정되어
> 있어야 한다. 이 컨테이너는 test-scenarios-be 단계를 포함하지 않으므로, 아직 시나리오가
> 없다면 먼저 `/test-scenarios-be {feature-path} {N}`을 별도로 실행해야 한다.

> **워크플로우**:
> - (사전) `/test-scenarios-be {feature-path} N` → 시그니처·시나리오 확정
> - 각 이슈: `/tdd-cycle-be N` → 5단계 → git commit (이슈 N)
> - 모든 이슈 완료 후: `/create-pr-be` → push → PR 생성

## 실행 모델 (컨텍스트 절약)

GATE가 없는 3개 단계는 파일을 여러 개 읽고 쓰거나(테스트 작성), 최대 5회 피드백 루프를 돌거나(구현),
전체 구현 코드를 정독(AC 검증)하기 때문에 메인 세션 컨텍스트를 가장 많이 소비한다.
이 3개 단계는 **서브에이전트(Agent 도구)에 위임**해 실행하고, 메인 세션은 결과 요약만 받는다.
GATE가 있는 단계는 사용자와 직접 응답을 주고받아야 하므로 메인 세션에서 **Skill 도구로 직접** 호출한다.

> **Agent 호출은 동기(foreground)로 실행한다.** `run_in_background`를 지정하지 않으므로 `Agent` 호출은
> 서브에이전트가 완료될 때까지 블로킹되고, `[상태]/[요약]` 결과는 그 tool call의 반환값으로 바로 돌아온다.
> 완료 알림(task-notification)을 별도로 기다리는 절차는 없다 — 반환값을 받은 시점이 곧 완료 시점이다.

| 단계 | 스킬 | 실행 방식 | 이유 |
|---|---|---|---|
| 1 | tdd-red-be | **Agent 위임** | GATE 없음 · 테스트 파일 다건 작성 |
| 2 | tdd-green-be | **Agent 위임** | GATE 없음 · 최대 5회 피드백 루프 |
| 3 | ac-verifier-be | **Agent 위임** | GATE 없음 · 구현 코드 전체 정독 |
| 4 | tdd-refactor-be | Skill 직접 호출 (메인 세션) | GATE |
| 5 | security-review-be | Skill 직접 호출 (메인 세션) | GATE |
| 6 | git commit | 컨테이너 직접 실행 | 저비용 (파일 읽기 없음) |

서브에이전트는 격리된 worktree가 아니라 **현재 저장소에 직접** 파일을 읽고 쓴다 (파일 변경이 다음 단계에 바로 반영되어야 하므로).

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

> **저장소 루트 앵커링**: 현재 작업 디렉토리가 repo root가 아닐 수 있으므로(예: `front/react-workspace`에 남아있는 경우),
> 아래 모든 find/ls는 `$(git rev-parse --show-toplevel)`을 **매 명령에 직접 인라인**해 CWD와 무관하게 동작시킨다 —
> Bash 도구는 작업 디렉토리는 유지하지만 셸 변수는 호출 간 유지하지 않으므로, 변수에 저장해 두고
> 다음 호출(1.5·1.6단계 등)에서 재사용하는 방식은 쓰지 않는다.

1. 현재 브랜치 자동 추론: `git branch --show-current`
   → `feature/` 제거 → 첫 세그먼트가 예약어(`api|common|datasource|batch`)면 root 추출 → **마지막 세그먼트 제거(설명 레이블)** → 나머지가 feature-path
   → 예: `feature/users/이메일-인증` → feature-path: `users`
   → 예: `feature/users/email/이메일-인증` → feature-path: `users/email`
2. `ls "$(git rev-parse --show-toplevel)/api"` + `find "$(git rev-parse --show-toplevel)/api" -name "*Application.java" -not -path "*/build/*" -not -path "*/out/*" | head -1` → module-name·pkg-root 확정
3. 보호 브랜치(main/master/develop/dev) 감지 시 즉시 중단

### 1.5단계: 진행 상태 감지 (중단 후 재시작 대응)

**컨텍스트 결정 직후, 아래 1.6단계(사용자 확인)보다 먼저 실행한다.** 순서가 바뀌면 안 된다 —
재시작 여부를 먼저 판단해야 1.6단계의 확인 프롬프트를 생략할지 결정할 수 있다.

**사전 조건(하드 게이트)**: `issue-{N}.md`(경로: `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md`, 1단계에서 추론한 module-name·pkg-root·feature-path 기준)에 `## 시그니처`·`## 테스트 시나리오` 섹션이 **모두** 존재하는지 가장 먼저 확인한다.
이 컨테이너는 test-scenarios-be를 실행하지 않으므로, 하나라도 없으면 **재시작 감지를 진행하지 않고 즉시 중단**한다:

```
⛔ 이슈 #{N}의 시그니처·테스트 시나리오가 아직 확정되지 않았습니다.
   이 컨테이너(tdd-cycle-be)는 test-scenarios-be 단계를 포함하지 않습니다.

   먼저 아래를 실행해주세요:
   /test-scenarios-be {feature-path} {N}

   완료 후 다시 /tdd-cycle-be {N} 을 실행하면 단계 1(tdd-red-be)부터 시작합니다.
```

사전 조건을 충족하면, 이전 실행이 ⛔로 중단되었거나 세션이 끊긴 뒤 `/tdd-cycle-be {N}`을 다시 실행한 경우를 자동으로 감지해
**처음부터 다시 하지 않고 중단된 단계부터** 이어간다. 신규 이슈(시그니처·시나리오만 확정된 첫 실행)라면 모든 조건이 비어 있어 자연히 단계 1(=1.6단계로 진행)부터 시작한다.

`issue-{N}.md`와 git 상태를 아래 순서로 검사해 **가장 먼저 미완료로 판정되는 단계**를 시작 단계로 정한다.

| 순서 | 확인 대상 | 미완료 판정 시 시작 단계 |
|---|---|---|
| 1 | Service/Controller 테스트 파일 존재 (`find ... service/*ServiceTest.java`, `controller/*ControllerTest.java`) | 단계 1 |
| 2 | `issue-{N}.md`의 `## 테스트 시나리오` 섹션에 `- [ ]`(미체크) 항목이 0건 | 단계 2 |
| 3 | `## AC 검증` 섹션 존재 + "✅ 모든 AC 충족" 포함 | 단계 3 |
| 4 | `## 리팩토링 결과` 섹션 존재 | 단계 4 |
| 5 | `## 보안 검토` 섹션 존재 + "클린 기준 충족" 항목 두 개 모두 `[x]`, 권장 수정 목록에 `- [ ]`(미결) 없음 | 단계 5 |
| 6 | `git log --oneline`에 `(#{N})`을 포함하는 커밋 존재 | 단계 6 |

> 단계 3에서 `## AC 검증` 섹션은 있지만 "미충족/부분 충족"으로 기록된 경우, 이는 `ac-verifier-be` 자체 가드에 걸려 정상적으로 ⛔ 중단된 상태다. 자동으로 단계 3을 재실행하지 않는다 — ac-verifier-be가 안내한 순서(누락 시나리오 수동 추가 → `/tdd-red-be` → `/tdd-green-be` → `/ac-verifier-be`)를 그대로 출력하고 컨테이너를 중단한다.

**모든 단계가 충족되면** "이미 완료된 이슈"로 판단해 [완료 배너](#완료-배너)만 출력하고 종료한다.

**시작 단계가 1이 아니면(재시작)** → 아래 배너와 [CONTEXT] 블록(1.6단계 형식과 동일)을 출력한 뒤, **1.6단계를 건너뛰고 곧바로 2단계로 진행**한다.

```
🔁 이슈 #{N} 재시작 감지 — 단계 {X}/6부터 이어서 진행합니다.
   근거: {감지된 마커 1줄 요약, 예: "issue-{N}.md에 ## 테스트 시나리오까지 있으나 테스트 파일 없음"}
```

**시작 단계가 1이면(신규 이슈)** → 1.6단계로 진행한다.

### 1.6단계: 파일시스템 검증 + 사용자 확인

**1.5단계에서 시작 단계가 1로 판정된 경우에만 실행한다.** (재시작인 경우 이 단계는 건너뛴다.)

```bash
# docs 폴더 존재 확인
find "$(git rev-parse --show-toplevel)/api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs" -maxdepth 0 -type d 2>/dev/null
```

**docs 폴더가 존재하는 경우** → 아래 확인 메시지 출력 후 사용자 응답 대기:

```
🌿 브랜치: {current-branch}
📦 모듈:   api/{module-name} + datasource/{module-name}
📁 feature-path: {feature-path}
   docs 경로: api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/

위 경로로 이슈 #{N} TDD 사이클을 시작합니다. 다르면 말씀해주세요.
```

사용자가 수정 없이 진행 확인(yes / ok / 확인 / 좋아 또는 그냥 enter)하면 [CONTEXT] 블록 출력 후 사이클 시작.
사용자가 feature-path를 직접 입력하면 해당 값으로 재검증 후 진행.

**docs 폴더가 없는 경우** → 현재 존재하는 docs 목록을 탐색해 출력:

```bash
# 현재 존재하는 docs 폴더 목록 (build/out 산출물 디렉토리는 제외)
find "$(git rev-parse --show-toplevel)/api/{module-name}/src/main/java/{pkg-root}" -type d -name "docs" -not -path "*/build/*" -not -path "*/out/*" 2>/dev/null
```

```
⚠️ docs 폴더를 찾을 수 없습니다.

   브랜치:              {current-branch}
   추론된 feature-path: {feature-path}
   확인한 경로:         api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/

   현재 존재하는 docs:
   - {existing-path-1}   → feature/{existing-feature-path-1}/
   - {existing-path-2}   → feature/{existing-feature-path-2}/

   feature-path를 직접 입력해주세요.
   예) users
       users/email
```

사용자가 feature-path를 입력하면 해당 경로로 재검증 후 진행.
docs가 하나도 없으면 `/feature-planner-be`로 먼저 기획을 완료하도록 안내 후 ⛔ 중단.
docs는 있으나 `issue-{N}.md`에 시그니처·시나리오가 없으면(1.5단계 사전 조건 미충족) `/test-scenarios-be {feature-path} {N}`을 먼저 실행하도록 안내 후 ⛔ 중단.

컨텍스트가 최종 확정되면 **[CONTEXT] 블록을 출력**한다. 이후 서브 스킬·서브에이전트는 `{feature-path} {N}` 형태로 호출하여 브랜치 재추론을 생략한다.

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
│  [ 1 ] tdd-red-be         실패 테스트 작성 (서브에이전트)    │
│  [ 2 ] tdd-green-be       최소 구현 (서브에이전트)           │
│  [ 3 ] ac-verifier-be     AC 충족 검증 (서브에이전트)        │
│  [ 4 ] tdd-refactor-be    코드 구조 개선                    │
│  [ 5 ] security-review-be 보안·패턴·품질 점검               │
│  [ 6 ] git commit         이슈 단위 커밋                   │
│                                                             │
│  시작 단계: {X}/6  ← 재시작인 경우에만 표시                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 실행 규칙

1. 단계 1·2·3은 **Agent 도구**로 서브에이전트에 위임한다. 메인 세션은 서브에이전트가 반환하는 요약만 받고, 서브에이전트 내부의 파일 읽기·테스트 실행 로그는 메인 세션에 남기지 않는다.
2. 단계 4·5는 **Skill 도구**로 메인 세션에서 직접 호출한다 (사용자와 직접 GATE 응답을 주고받아야 하므로).
3. 각 단계 호출 전에 **단계 시작 배너**를 출력한다.
4. Skill 직접 호출 단계의 내부 게이트(사용자 응답 대기)는 그대로 작동한다. 컨테이너는 추가 게이트를 만들지 않는다.
5. 서브에이전트가 `[상태] 실패(⛔)`로 보고하거나, Skill 직접 호출 단계가 ⛔ 메시지로 중단되면 **컨테이너도 즉시 중단**하고 아래 형식으로 출력한다.
6. 정상 완료되면 **단계 완료 배너**를 출력하고 다음 단계로 진행한다.
7. **단계 1·2·3의 Agent 호출은 반드시 하나씩 순차적으로 실행한다 — 절대 병렬로 호출하지 않는다.**
   `Agent` 호출은 `run_in_background`를 지정하지 않는 동기(foreground) 호출이므로, tool call 자체가
   서브에이전트 완료까지 블로킹되고 `[상태]/[요약]` 결과는 그 반환값으로 즉시 돌아온다(완료 알림을
   별도로 기다릴 필요 없음). 단계 2(tdd-green-be)는 단계 1(tdd-red-be)이 만든 실패 테스트에, 단계
   3(ac-verifier-be)은 단계 2의 구현 결과에 의존하므로, 한 메시지에 여러 `Agent` 호출을 동시에 넣으면
   순서 의존성이 깨져 잘못된 결과를 낳는다. **한 번에 하나의 `Agent`만 호출하고, 그 반환값을 받은 뒤에만
   다음 단계의 `Agent`를 호출한다.** 여러 도구를 병렬로 호출하는 일반적인 습관을 이 3단계에는 적용하지 않는다.
8. Agent 호출 자체가 tool 에러로 실패하거나(예: 타임아웃, 크래시) 응답이 [상태]/[요약] 형식을 갖추지
   못한 채 비정상 종료되면, 이는 서브에이전트의 `[상태] 실패(⛔)` 보고와 별개의 상황이므로 임의로
   성공 처리하지 않는다. 실제 저장소 파일 상태(1.5단계 감지 로직과 동일한 기준)를 다시 확인한 뒤,
   변경이 전혀 없으면 재시도, 부분적으로 반영되어 있으면 [중단 출력 형식](#중단-출력-형식)에 준해
   현재 상태를 보고하고 사용자 확인을 받는다.

### 단계 시작 배너 — 서브에이전트 위임 단계 (1·2·3)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶ 단계 X/6 시작 — {스킬명} (서브에이전트 위임)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 단계 시작 배너 — Skill 직접 호출 단계 (4·5)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶ 단계 X/6 시작 — {스킬명}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 단계 완료 배너

서브 스킬(또는 서브에이전트) 완료 직후, 핵심 결과를 1줄로 요약해 아래 형식으로 출력한다.

```
━━━ 단계 X/6 완료 ▶ 단계 X+1/6 시작 ━━━
📌 결과: {핵심 1줄 요약}
```

**단계별 요약 형식 예시:**

| 단계 | 요약 예시 |
|------|---------|
| 1 tdd-red-be | `테스트 8건 작성, 전체 정상 실패 (assertion fail)` |
| 2 tdd-green-be | `AC 4/4 통과, 구현 파일 3건 생성` |
| 3 ac-verifier-be | `AC 4건 모두 ✅ 충족` |
| 4 tdd-refactor-be | `리팩토링 3건 적용, 테스트 이상 없음` |
| 5 security-review-be | `즉시 수정 0건 / 권장 2건 / 무시 1건` |
| 6 git commit | `커밋 완료: feat(users): 이메일 인증 코드 전송 (#1)` |

### 중단 출력 형식

```
⛔ TDD 사이클 중단 — 이슈 #{N}

중단 단계: 단계 X/6 · {스킬명}
원인: {서브에이전트 보고 또는 서브 스킬이 출력한 ⛔ 메시지 요약}

해결 후 /tdd-cycle-be {N} 을 다시 실행하면 자동으로 단계 X부터 이어갑니다.
(직접 해당 스킬만 실행하려면: /{스킬명} {N})
```

---

## 단계별 서브 스킬 호출

### 단계 1/6 — tdd-red-be (서브에이전트 위임)

```
Agent(
  description: "TDD Red — 이슈 #{N}",
  subagent_type: "general-purpose",
  prompt: <아래 템플릿>
)
```

**프롬프트 템플릿:**

```
C:\workspace\platform-service-v2 저장소에서 작업해줘. TDD 사이클의 한 단계를 대행하는 작업이다.

컨텍스트: feature-path={feature-path}, module-name={module-name}, pkg-root={pkg-root}, 이슈 번호={N}

Skill 도구로 아래를 실행해줘:
  skill="tdd-red-be", args="{feature-path} {N}"

이 스킬은 이슈 #{N}의 AC를 실패하는 테스트 코드(Service 단위 + Controller 슬라이스)로 변환한다.
SKILL.md에 정의된 지침을 그대로 따르고, 범위를 임의로 넓히거나 생략하지 마라.
작업은 실제 저장소 파일에 직접 반영해라 (격리된 브랜치나 워크트리를 만들지 마라).

완료되면 다른 설명 없이 아래 형식으로만 보고해줘:

[상태] 성공 | 실패(⛔)
[요약] {작성된 테스트 파일 수와 전체 정상 실패 여부를 1줄로}
[테스트 파일] {생성된 테스트 파일 경로 목록, 없으면 "없음"}
[스켈레톤] {생성된 스켈레톤 파일 경로 목록, 없으면 "없음"}
[중단 메시지] {스킬이 ⛔를 출력했다면 그 원문 그대로, 없으면 "-"}
```

컨테이너는 `[상태]`가 `실패(⛔)`면 `[중단 메시지]`를 그대로 인용해 [중단 출력 형식](#중단-출력-형식)으로 출력하고 종료한다.
`[상태]`가 `성공`이면 `[요약]`을 단계 완료 배너의 `📌 결과`에 사용한다.

---

### 단계 2/6 — tdd-green-be (서브에이전트 위임)

```
Agent(
  description: "TDD Green — 이슈 #{N}",
  subagent_type: "general-purpose",
  prompt: <아래 템플릿>
)
```

**프롬프트 템플릿:**

```
C:\workspace\platform-service-v2 저장소에서 작업해줘. TDD 사이클의 한 단계를 대행하는 작업이다.

컨텍스트: feature-path={feature-path}, module-name={module-name}, pkg-root={pkg-root}, 이슈 번호={N}

Skill 도구로 아래를 실행해줘:
  skill="tdd-green-be", args="{feature-path} {N}"

이 스킬은 /tdd-red-be가 작성한 실패 테스트를 통과시키는 최소 구현 코드를 작성한다.
SKILL.md에 정의된 피드백 루프(최대 5회)·구현 범위 제약을 그대로 따른다.
작업은 실제 저장소 파일에 직접 반영해라 (격리된 브랜치나 워크트리를 만들지 마라).

완료되면 다른 설명 없이 아래 형식으로만 보고해줘:

[상태] 성공 | 실패(⛔)
[요약] {통과 테스트 수}/{전체 수}, 체크된 AC 건수를 1줄로
[구현 파일] {생성/수정된 구현 파일 경로 목록}
[미해결 항목] {통과하지 못한 AC가 있으면 원인 요약, 없으면 "없음"}
[중단 메시지] {5회 반복 후에도 실패해 스킬이 ⛔를 출력했다면 그 원문 그대로, 없으면 "-"}
```

컨테이너는 `[상태]`가 `실패(⛔)`면 `[중단 메시지]`를 그대로 인용해 중단 출력 후 종료한다.

---

### 단계 3/6 — ac-verifier-be (서브에이전트 위임)

```
Agent(
  description: "AC Verifier — 이슈 #{N}",
  subagent_type: "general-purpose",
  prompt: <아래 템플릿>
)
```

**프롬프트 템플릿:**

```
C:\workspace\platform-service-v2 저장소에서 작업해줘. TDD 사이클의 한 단계를 대행하는 작업이다.

컨텍스트: feature-path={feature-path}, module-name={module-name}, pkg-root={pkg-root}, 이슈 번호={N}

Skill 도구로 아래를 실행해줘:
  skill="ac-verifier-be", args="{feature-path} {N}"

이 스킬은 구현 코드를 직접 읽어 AC 충족 여부를 검증한다(테스트 통과와는 별개 기준).
어떤 구현 파일도 수정하지 않는다 — issue-{N}.md에 검증 결과를 기록하는 것만 예외.

완료되면 다른 설명 없이 아래 형식으로만 보고해줘:

[상태] 성공 | 실패(⛔)
[요약] ✅/⚠️/❌ 건수를 1줄로 (예: "✅ 4건 / ⚠️ 0건 / ❌ 0건")
[미충족 목록] {⚠️·❌ 항목이 있으면 AC별 원인, 없으면 "없음"}
[중단 메시지] {스킬이 미충족/부분 충족으로 ⛔ 안내를 출력했다면 그 원문 그대로, 없으면 "-"}

※ AC가 하나라도 ⚠️ 또는 ❌면 스킬 자체가 정상적으로 ⛔ 안내를 출력하고 끝난다.
   이 경우 [상태]는 반드시 "실패(⛔)"로 보고해라. 테스트 통과 여부가 아니라 AC 충족 여부가 기준이다.
```

컨테이너는 `[상태]`가 `실패(⛔)`면 `[중단 메시지]`를 그대로 인용해 중단 출력 후 종료한다.
`[상태]`가 `성공`이면 `[요약]`을 단계 완료 배너의 `📌 결과`에 사용한다.

---

### 단계 4/6 — tdd-refactor-be

```
Skill(skill="tdd-refactor-be", args="{feature-path} {N}")
```

- 리팩토링 대상 목록 보고 [GATE] — 사용자가 전체·부분·취소 선택.
  - "취소" 선택 → 스킬이 `완료: 0건` 요약 출력 후 정상 완료. 컨테이너는 다음 단계로 진행.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 5/6 — security-review-be

```
Skill(skill="security-review-be", args="{feature-path} {N}")
```

- 3분류 결과 보고 [GATE] — 사용자가 즉시 수정/권장/생략 선택.
- ⛔ 감지 시 → 중단 출력 후 종료.

---

### 단계 6/6 — git commit (이슈 단위)

5단계 완료 후 **git commit**을 실행한다.

```bash
# 1. git status 확인
git status

# 2. 커밋 메시지 생성 (issue-{N}.md에서 추출)
# 형식: {type}: {이슈 제목} (#{N})
# 예: feat(users): 이메일 인증 API 구현 (#1)

# 3. 스테이징 — 모듈 경계 내 파일만 명시적으로 추가
git add -- api/{module-name}/ datasource/{module-name}/
git status --short   # 스테이징 목록 확인 출력

# 4. git commit 실행
git commit -m "{커밋 메시지}"
```

스테이징 목록을 사용자에게 보여주고, 예상치 못한 파일이 있으면 확인을 받은 후 커밋한다.

**커밋 메시지 생성 규칙:**

1. `issue-{N}.md`의 제목에서 이슈 제목 추출
2. Git 컨벤션 형식: `{type}({feature-path}): {제목} (#{N})`
   - type 선택 기준:
     | 이슈 성격 | type |
     |---------|------|
     | 신규 API·기능 추가 | `feat` |
     | 잘못된 동작 수정 | `fix` |
     | 기능 변경 없는 구조 개선 | `refactor` |
     | 설정·문서·빌드 변경 | `chore` |
   - scope: feature-path (`/`를 `-`로 변환, 예: `users/email` → `users-email`)
   - 제목: 한글 요약 (50자 이내)
   - 예: `feat(users): 이메일 인증 코드 전송 (#1)`
   - 예: `feat(users-email): 인증 코드 검증 API 추가 (#2)`

**완료 배너:**

```
━━━ 단계 6/6 완료 ━━━
✅ 이슈 #{N} 커밋 완료
📝 커밋 메시지: {실제 커밋 메시지}

다음 이슈가 있으면 /tdd-cycle-be {다음 이슈 번호}
모든 이슈 완료 시 /create-pr-be
```

---

## 완료 배너

6단계 모두 완료되면 출력한다.

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ TDD 풀 사이클 완료 — 이슈 #{N}                          │
│                                                             │
│  ✅ 단계 1 — tdd-red-be         (서브에이전트)               │
│  ✅ 단계 2 — tdd-green-be       (서브에이전트)               │
│  ✅ 단계 3 — ac-verifier-be     (서브에이전트)               │
│  ✅ 단계 4 — tdd-refactor-be                                │
│  ✅ 단계 5 — security-review-be                             │
│  ✅ 단계 6 — git commit                                     │
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
| test-scenarios-be | 이 컨테이너에 포함되지 않음. 실행 전 issue-{N}.md에 시그니처·시나리오가 이미 확정되어 있어야 하며(1.5단계 사전 조건), 없으면 `/test-scenarios-be N`을 별도 실행 후 재시도 |
| 서브에이전트 위임 범위 | 단계 1·2·3만 위임. GATE가 있는 단계(4·5)는 위임 금지 — 사용자 응답을 서브에이전트가 대신 결정할 수 없음 |
| 서브에이전트 격리 | worktree 격리 없이 실제 저장소에 직접 반영 (파일 변경이 다음 단계에 바로 보여야 함) |
| 서브에이전트 실패 판정 | `[상태] 실패(⛔)` 보고를 신뢰 기준으로 삼는다. 보고 형식을 지키지 않거나 Agent 호출 자체가 비정상 종료되면 실패로 간주하고 중단 |
| 서브에이전트 호출 방식 | `run_in_background` 미지정 → 동기(foreground) 호출. tool call 반환값이 곧 결과이며 별도 완료 알림을 기다리지 않는다 |
| 서브에이전트 병렬 호출 금지 | 단계 1·2·3의 `Agent` 호출은 순차 실행. 한 메시지에 여러 `Agent`를 동시에 넣지 않고, 이전 호출의 반환값을 받은 뒤에만 다음 `Agent`를 호출한다 |
| 출력 | 단계 배너 외 컨테이너 자체 설명 출력 최소화 |
| 실패 감지 | ⛔ 이외의 에러(스킬 내부 경고 ⚠️ 등)는 실패로 간주하지 않음 |
