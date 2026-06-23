---
name: create-pr
description: |
  PR 생성을 자동화한다. 브랜치 변경사항 분석 → PR 초안 생성 → 사용자 승인 → E2E 검증 → push → gh pr create 순서로 실행.

  다음 상황에서 반드시 이 스킬을 사용할 것:
  - "PR 만들어줘", "PR 올려줘", "PR 보내줘", "PR 날려줘", "PR 제출해줘", "PR 생성해"
  - "이거 머지하자", "머지 준비해줘", "create-pr"
  - /create-pr 명시적 호출
---

# create-pr

브랜치 변경사항을 분석하여 PR 초안을 만들고, 사용자 승인 후 E2E 검증을 거쳐 PR을 생성한다.
E2E가 실패하면 PR 생성을 중단하고 근본 원인 파악을 안내한다 — 테스트 코드 수정으로 우회하는 것은 절대 금지.

## 단계 1: Base 브랜치 결정

다음 우선순위로 base 브랜치를 자동 결정한다:

```bash
# 현재 브랜치 확인
git rev-parse --abbrev-ref HEAD

# 원격 브랜치 목록 확인
git branch -r
```

**결정 로직:**
1. 원격에 `feature/*` 브랜치가 존재하고, 현재 브랜치가 그 브랜치에서 분기했다면 → base = 해당 `feature/*` 브랜치
   - 분기 확인: `git merge-base HEAD origin/feature/<name>`이 현재 브랜치 히스토리에 있으면 해당 feature 브랜치
2. 위 조건에 해당하지 않으면 → base = `master`

> TDD 사이클에서 이슈 브랜치는 `feature/<spec>` 브랜치로 PR을 올린다. (CLAUDE.md 기준)

## 단계 2: 변경사항 분석

```bash
# 커밋 목록
git log origin/<base>...HEAD --oneline

# 파일 변경 요약
git diff origin/<base>...HEAD --stat

# 주요 변경 내용 (참고용)
git diff origin/<base>...HEAD --name-only
```

커밋 목록과 변경 파일을 분석해 PR의 목적을 파악한다.

## 단계 3: PR 초안 생성

분석 결과를 바탕으로 PR 초안을 작성하고 사용자에게 출력한다.

### 제목 형식

```
type(scope): 한글 요약 (50자 이내)
```

- **type**: feat | fix | refactor | chore | docs | test | style
- **scope**: 변경 모듈 또는 기능 영역 (브랜치명, 변경 파일 경로 참고)
- 커밋이 여러 개이고 type이 혼재하면 가장 비중 큰 type 사용

**예시:**
- `feat(notice): 공지사항 목록 페이지 구현`
- `fix(auth): 토큰 만료 시 로그인 리다이렉트 수정`
- `chore(skills): create-pr 스킬 추가`

### 본문 형식

```markdown
## 변경사항 요약
- (주요 변경 내용을 불릿 2-4개로)

## 구현 내용
- (기술적 구현 세부 사항)

## 테스트
- [x] E2E 테스트 통과 (`pnpm e2e`)
- [ ] 수동 확인 필요 항목 (있을 경우)

## 관련 이슈
`src/features/{feature-path}/docs/issue-{N}.md`  (TDD 사이클 이슈가 있을 경우, 없으면 이 줄 삭제)
```

### 출력 형식

초안을 다음과 같이 출력한다:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PR 초안
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base 브랜치: <base>
현재 브랜치: <current>

제목: <title>

본문:
<body>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## [GATE] 사용자 승인

초안 출력 후 반드시 멈추고 승인을 요청한다:

> "이 초안으로 PR을 생성할까요? 수정이 필요하면 알려주세요."

- 승인(`y`, `네`, `좋아`, `고`): 단계 4로 진행
- 수정 요청: 수정 내용 반영 후 초안 다시 출력 → 재승인
- **승인 없이 E2E 실행 금지**

## 단계 4: E2E 실행

```bash
pnpm e2e
```

### E2E 실패 시 — PR 생성 중단

E2E가 실패하면 즉시 중단하고 아래 안내를 출력한다. PR 생성으로 넘어가지 않는다.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
E2E 테스트 실패 — PR 생성을 중단합니다.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

E2E 코드를 고쳐 통과시키는 것은 금지입니다.
근본 원인을 찾아 프로덕션 코드를 수정해야 합니다.

① Trace Viewer로 실패 지점 확인
   pnpm e2e:report

② 어느 레이어에서 깨졌는지 판별:
   - API 레이어    → 네트워크 탭, 응답 코드/페이로드 확인
   - 렌더링 레이어 → 컴포넌트 미노출, 셀렉터 불일치, 타이밍 문제
   - 로직 레이어  → 잘못된 상태, 흐름 오류, 조건 분기

③ 해당 단위 테스트에 실패 케이스 추가
   /tdd-red <issue-number>

④ 프로덕션 코드 수정
   /tdd-green <issue-number>

⑤ 수정 완료 후 다시 실행
   /create-pr
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### E2E 성공 시 — 단계 5로 진행

## 단계 5: Push 및 PR 생성

```bash
# push
git push -u origin <현재브랜치>

# PR 생성
gh pr create \
  --title "<승인된 제목>" \
  --body "$(cat <<'EOF'
<승인된 본문>
EOF
)" \
  --base <base브랜치>
```

PR이 생성되면 URL을 출력한다.

```
PR이 생성되었습니다:
https://github.com/<owner>/<repo>/pull/<number>
```

## 주의사항

- E2E 테스트 파일(`.spec.ts`) 수정으로 실패를 통과시키는 것은 근본 원인 회피 — 절대 금지
- push 전에 반드시 E2E를 통과해야 한다
- `git push --force`는 사용하지 않는다 (히스토리 덮어쓰기 위험)
- PR 제목은 반드시 `type(scope): 한글 요약` 컨벤션을 따른다
