---
name: create-pr-be
description: |
  TDD 이슈 사이클 완료 후 git commit 안내 및 PR 제목·본문 자동 생성 스킬. git 명령 직접 실행 없음.
  "PR 생성"·"create-pr-be"·"커밋하고 PR" 언급 시 이 스킬 사용.
---

# Create PR Workflow [백엔드 · Spring Boot]

`/security-review-be` 완료 후 **git commit → PR 생성**까지 안내하는 파이프라인.
`issue-{N}.md`와 `prd.md`, `git diff`를 읽어 PR 제목·본문을 자동 생성한다.

> **원칙**: Claude는 git 명령과 gh pr create를 직접 실행하지 않는다.
> 명령어만 제시하고 사용자가 직접 실행한다.

---

## 입력 형식

```
/create-pr-be                              ← 컨텍스트 또는 브랜치 추론 (이슈 번호 질문)
/create-pr-be {N}                          ← 단일 이슈 지정
/create-pr-be {N1},{N2},...                ← 다중 이슈 (예: /create-pr-be 1,2,3)
/create-pr-be {feature-path} {N}          ← 경로 직접 지정 + 단일 이슈
/create-pr-be {feature-path} {N1},{N2}   ← 경로 직접 지정 + 다중 이슈
```

다중 이슈를 지정하면 `issue-1.md`, `issue-2.md` ... 를 모두 읽어 PR 본문을 통합 작성한다.

---

## 컨텍스트 결정

아래 4순위로 결정한다:
1순위 세션 [CONTEXT] 블록 → 2순위 첫 토큰 `/` 포함 경로 직접 지정 → 3순위 `git branch --show-current` (`feature/*` 파싱) → 4순위 직접 입력 요청.
보호 브랜치(main/master/develop/dev) 감지 시 즉시 중단.

세션 컨텍스트 `[CONTEXT]`에서 `feature-path`, `module-name`, `api-module`, `ds-module`, `pkg-root`를 로드한다.

---

## 진입 안내

```
🌿 브랜치: feature/notice/list        ← 브랜치 추론 시에만 표시
📦 모듈:   api/platform + datasource/platform
📁 feature-path: notice/list
📄 이슈: ...notice/list/docs/issue-1.md
🔀 Create PR — git commit 및 PR 생성을 안내합니다.
```

---

## 파일 경로 규칙

| 항목 | 경로 |
|------|------|
| 이슈 파일 (읽기) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issue-{N}.md` |
| PRD (읽기) | `api/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/prd.md` |

---

## 파이프라인 개요

```
/create-pr-be [{feature-path}] [{N}]
    ↓ 컨텍스트 결정
    ↓ 이슈 번호 확인 (없으면 질문)
    ↓ 단계 1: PR 사전 체크리스트 확인
    ↓ 단계 2: git 상태 확인
    ↓ 단계 3: 커밋 메시지 제안 [GATE]
    ↓ 단계 4: PR 제목·본문 생성 [GATE]
    ↓ 단계 5: push + gh pr create 명령어 제시
    ↓ 단계 6: 완료 출력
```

---

## 이슈 번호가 없는 경우

`{N}`이 입력되지 않으면 경로 확정 후 바로 질문한다.

```
어떤 이슈의 PR을 생성할까요?
단일: 1
다중: 1,2,3
```

---

## 단계 1: PR 사전 체크리스트 확인

아래 명령으로 최종 상태를 확인한다.

```bash
./gradlew :api:{module-name}:build -x test 2>&1 | tail -10
./gradlew :api:{module-name}:test 2>&1 | tail -10
```

동시에 **모든 이슈 파일** `issue-{N}.md`를 읽어 아래 섹션 존재 여부를 확인한다.
(다중 이슈인 경우 각 이슈별로 동일하게 확인)

| 항목 | 확인 방법 | 실패 시 |
|------|---------|--------|
| 전체 테스트 통과 | Gradle 출력 | `/tdd-green-be {N}` 실행 요청 후 중단 |
| AC 검증 완료 | `issue-{N}.md`의 `## AC 검증` 섹션 존재 여부 확인 | 없으면 `/ac-verifier-be {N}` 실행 요청 후 중단 |
| 리팩토링 결과 기록됨 | `## 리팩토링 결과` 섹션 존재 | `/tdd-refactor-be {N}` 실행 요청 후 중단 |
| 컴파일 오류 없음 | Gradle build 출력 | `/security-review-be {N}` 실행 요청 후 중단 |
| 보안 검토 결과 기록됨 | `## 보안 검토` 섹션 존재 확인. ① 섹션 없으면 → 중단, ② 섹션 있고 내부에 `- [ ]` 항목이 하나라도 있으면 → 중단, ③ 섹션 있고 `- [ ]` 항목 없으면 → 통과 | 섹션 없거나 `[ ]` 항목 존재 시 `/security-review-be {N}` 실행 요청 후 중단 |

모든 항목 통과 시에만 단계 2로 진행한다.

---

## 단계 2: git 상태 확인

```bash
git status --short
git diff --cached --stat
git log --oneline -5
```

**커밋 전략 선택:**

| 전략 | 언제 권장 | 처리 방식 |
|------|---------|---------|
| **단일 커밋** (기본 권장) | 이슈 수가 적거나 기능이 하나의 흐름으로 연결될 때 | 단계 3에서 하나의 커밋 메시지 제안 |
| **이슈별 커밋** | 이슈가 독립적이고 되돌릴 단위가 명확할 때 | 이슈별로 이미 커밋된 경우 단계 3 건너뜀 |

**커밋 전략 결정 기준:**

| 상황 | 권장 전략 |
|------|---------|
| 이슈가 하나의 기능 흐름 (예: 목록 + 상세 조회) | 단일 커밋 |
| 이슈가 독립적 (예: 조회 + 삭제) | 이슈별 커밋 |
| 이슈 중 Flyway 마이그레이션 포함 | Flyway 커밋 먼저 분리 후 구현 커밋 |
| 이슈가 5개 이상 | 이슈별 커밋 필수 (revert 단위 명확화) |

> 일반적으로 `/security-review-be` 완료 시점까지 커밋을 보류하고,
> `/create-pr-be`에서 한 번에 커밋·푸시·PR 생성을 진행하는 것을 권장한다.

| 상황 | 처리 방식 |
|------|---------|
| 아직 커밋이 없음 (변경 파일만 존재) | 단계 3에서 단일 커밋 메시지 제안 |
| 이슈별로 이미 커밋된 경우 | 단계 3을 건너뛰고 단계 4(PR 생성)로 바로 진행 |
| 일부만 커밋된 경우 | 미커밋 파일을 사용자에게 표시하고 커밋 전략 질문 (단일 합산 or 별도 커밋) |

스테이징되지 않은 변경 파일이 있으면 아래를 출력한다.

```
📋 스테이징되지 않은 파일:
  {파일 목록}

아래 명령어로 스테이징 후 "완료"라고 말씀해주세요.
git add {관련 파일들}
```

사용자가 "완료"라고 응답하면 단계 3으로 진행.

---

## 단계 3: 커밋 메시지 제안 [GATE]

`issue-{N}.md`의 이슈 제목 + 변경 파일 목록을 기반으로 커밋 메시지를 제안한다.

**CLAUDE.md 커밋 컨벤션:**
```
type(scope): 한글 요약 (50자 이내)

type: feat | fix | refactor | chore | docs | test | style
scope: 변경 모듈 또는 기능 영역
```

**타입 결정 기준 — issue-{N}.md 이슈 제목/설명을 읽어 판단한다:**

| 이슈 성격 | 타입 |
|---------|------|
| 신규 API 엔드포인트, 신규 기능 | `feat` |
| 버그 수정, 잘못된 동작 교정 | `fix` |
| 기능 변경 없는 코드 구조 개선 | `refactor` |
| 테스트 추가/수정만 | `test` |
| 문서, 설정, 빌드 스크립트 | `chore` |

```
📝 커밋 메시지 제안:

  {type}({feature-path}): {이슈 핵심 동작 한 줄 요약}

수정이 필요하면 말씀해주세요.
승인(yes / ok / 확인)하면 커밋 명령어를 제시합니다.
```

승인 후:

```bash
git commit -m "feat({feature-path}): {요약}"
```

위 명령어를 실행하신 후 "완료"라고 말씀해주세요.

---

## 단계 4: PR 제목·본문 생성 [GATE]

`issue-{N}.md`와 `prd.md`를 읽어 PR 제목·본문을 자동 생성한다.

### PR 제목

```
feat({feature-path}): {이슈 핵심 동작 한 줄 요약}
```

- 70자 이내
- 커밋 메시지와 동일 형식

### PR 본문 자동 생성

**단일 이슈:**
```markdown
## Summary

- {AC 항목 중 핵심 내용 3개 이내로 요약}
- 구현 범위: {영향 계층 — Controller / Service / Repository / Flyway 여부}
- **DB 변경**: `{Flyway 파일명}` — {테이블/컬럼 변경 내용} (Flyway 없으면 이 줄 생략)
- 테스트: Service 단위 {N}개, Controller 슬라이스 {N}개

## Test Plan

- [x] `./gradlew :api:{module-name}:test` — 전체 통과
- [x] AC 검증 (`/ac-verifier-be {N}`) — 모든 AC 충족
- [x] 보안 검토 (`/security-review-be {N}`) — 즉시 수정 필요 항목 없음
- [ ] Swagger UI에서 {HTTP메서드} {URI} 직접 호출 확인 (배포 후)
```

**다중 이슈 (예: 이슈 1, 2, 3):**
```markdown
## Summary

### Issue 1: {이슈 1 제목}
- {핵심 AC 요약 1~2개}

### Issue 2: {이슈 2 제목}
- {핵심 AC 요약 1~2개}

### Issue 3: {이슈 3 제목}
- {핵심 AC 요약 1~2개}

구현 범위: {전체 영향 계층 합산}
**DB 변경**: {Flyway 파일 목록 — 없으면 이 줄 생략}
테스트: Service 단위 {합산}개, Controller 슬라이스 {합산}개

## Test Plan

- [x] `./gradlew :api:{module-name}:test` — 전체 통과
- [x] AC 검증 — Issue 1, 2, 3 모든 AC 충족
- [x] 보안 검토 — 즉시 수정 필요 항목 없음
- [ ] Swagger UI에서 각 엔드포인트 직접 호출 확인 (배포 후)
```

생성된 PR 제목·본문을 사용자에게 보여주고 승인을 받는다.

```
[GATE] 위 PR 제목·본문을 검토해주세요.
       수정이 필요하면 말씀해주세요.
       승인(yes / ok / 확인)하면 push + PR 생성 명령어를 제시합니다.
```

---

## 단계 5: push + gh pr create 명령어 제시

승인 후 아래 명령어를 순서대로 제시한다.

```bash
# 1. 원격 브랜치 push
git push -u origin {브랜치명}        # 처음 push인 경우
git push origin {브랜치명}           # 이미 원격 브랜치가 있는 경우

# 2. PR 생성
gh pr create \
  --title "{PR 제목}" \
  --body "$(cat <<'EOF'
## Summary

{본문 내용}

## Test Plan

{체크리스트 내용}
EOF
)"
```

위 명령어를 실행하신 후 PR URL을 알려주세요. 또는 "완료"라고 말씀해주세요.

---

## 단계 6: 완료 출력

```
✅ Create PR 완료 — issue-{N} (또는 issue-{N1}, {N2}, ...)

🔀 PR: {사용자가 공유한 URL 또는 gh pr view --json url -q .url 결과}

📋 완료된 이슈 사이클:
  ✅ /test-scenarios-be {N} — 시그니처·시나리오 확정
  ✅ /tdd-red-be {N}        — 실패 테스트 작성
  ✅ /tdd-green-be {N}      — 구현 코드 작성
  ✅ /ac-verifier-be {N}    — AC 충족 검증
  ✅ /tdd-refactor-be {N}   — 코드 구조 개선
  ✅ /security-review-be {N}— 보안 검토
  ✅ /create-pr-be             — PR 생성

```

> 맥락 보존: PR 본문에 모든 AC와 구현 상세가 포함되어 있으며,
> Git 히스토리(`git log --all --full-history -- <path>`)로 언제든 검색 가능합니다.

다음 이슈가 있으면 /test-scenarios-be {다음 이슈 번호} 로 시작하세요.
```

---

## 제약 사항

| 항목 | 규칙 |
|------|------|
| git add / commit / push | 직접 실행 금지 — 명령어만 제시 |
| gh pr create | 직접 실행 금지 — 명령어만 제시 |
| force push | 금지 |
| 커밋 메시지 | CLAUDE.md 커밋 컨벤션 준수 (`type(scope): 한글 요약`) |
| PR 생성 전 | 체크리스트 4개 항목 모두 통과해야 진행 |

---

## 승인 게이트 요약

| 지점 | 확인 내용 |
|------|----------|
| 단계 3 | 커밋 메시지 형식·내용 확인 |
| 단계 4 | PR 제목·본문 내용 확인 |

---

## 오류 안내

issue-{N}.md 파일이 없는 경우:
```
⚠️  issue-{N}.md 파일이 없습니다.
    /feature-planner-be → /test-scenarios-be {N} → /tdd-red-be {N} → /tdd-green-be {N}
    → /ac-verifier-be {N} → /tdd-refactor-be {N} → /security-review-be {N}
    순서로 먼저 실행해주세요.
```
