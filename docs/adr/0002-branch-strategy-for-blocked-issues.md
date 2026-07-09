# ADR-0002: blocked-by 이슈의 브랜치 전략

- **상태(Status)**: 수락됨(Accepted) — 2026-07-08 머지 전략을 squash → rebase merge로 개정; 2026-07-09 rebase merge의 동작 메커니즘 설명을 정정(머지 전략 자체는 변경 없음, rebase merge 유지)
- **날짜**: 2026-07-07 (개정: 2026-07-08, 2026-07-09)
- **컨텍스트**: Git 워크플로우 / 멀티 이슈 구현

## 배경(Context)

`/to-issues`로 분해된 이슈들은 서로 `blocked by` 관계를 가질 수 있다(예: 이슈 B가 이슈 A의 컴포넌트를 재사용). 이슈 #36(로그인 화면) → #37(401 처리), #38(스켈레톤 페이지) 구현 중, #37/#38을 #36의 PR이 머지되기 **전에** #36의 기능 브랜치(`feat/36-login-page`) 위에 스택으로 얹어 작업했다.

이 저장소는 PR을 **squash merge**로 병합한다(머지 커밋의 부모가 1개임을 `git log --pretty=%P`로 확인). Squash merge는 `main`에 완전히 새로운 커밋을 만들 뿐, 원본 기능 브랜치의 커밋들과 히스토리를 공유하지 않는다. 그 결과:

1. #36의 PR(#39)이 squash merge로 `main`에 병합됨 — `main`에 새 커밋 생성, `feat/36-login-page`의 원본 커밋과는 히스토리 단절.
2. #37/#38(PR #40, #41)이 `feat/36-login-page` 위에 스택되어 그 브랜치로 병합됨 — 이 시점까지는 문제 없음.
3. `feat/36-login-page`(이제 #36+#37+#38 전체를 포함)를 다시 `main`으로 병합하려 하자(PR #42), #36에서 이미 `main`에 들어간 모든 파일이 "새로 추가"로 인식되어 **전체 파일이 충돌**.

### 2026-07-09 추가 발견: rebase merge도 커밋 SHA를 보존하지 않는다

PR #62(#61, JWT 세션 갱신)가 GitHub "Rebase and merge" 버튼으로 병합된 뒤 확인한 결과, 로컬 기능 브랜치 `feat/61-jwt-token-renewal`의 tip 커밋(`677fc28`)과 병합 후 `main`의 새 커밋(`d3edfa9`)은 **트리(tree)와 부모(parent)가 완전히 동일**했다(즉 diff 내용은 바이트 단위로 동일). 그러나 SHA는 서로 달랐다 — GitHub의 rebase merge는 커밋을 재생(replay)할 때 **committer 필드(신원+타임스탬프)를 새로 기록**하며, 커밋 SHA는 parent+tree+author+committer로 계산되므로 committer만 바뀌어도 SHA는 항상 바뀐다. 그 결과 `git merge-base --is-ancestor 677fc28 origin/main`은 **false**를 반환한다 — `677fc28`은 병합 후 `main`의 실제 조상이 아니다. 아래 "결정 — 2026-07-08 개정"의 근거였던 "원본 커밋이 main의 실제 조상이 된다"는 전제는 **SHA 수준에서는 사실이 아니다.**

## 결정(Decision) — 2026-07-08 개정, 2026-07-09 메커니즘 정정 (머지 전략 자체는 변경 없음)

1. **머지 전략은 squash → rebase merge 유지** (2026-07-08 결정 그대로). 다만 그 근거였던 "원본 커밋이 `main`의 실제 조상이 된다"는 설명은 정정한다 — 2026-07-09 확인 결과, GitHub rebase merge는 replay 시 committer 필드를 새로 쓰므로 replay된 `main` 커밋의 SHA는 tree/parent/내용이 동일해도 원본 브랜치 커밋과 항상 다르다. **SHA 조상 관계는 보장되지 않는다.**
2. **blocked-by 이슈도 선행 PR 머지 대기 없이 선행 브랜치 위에 스택해서 진행할 수 있다** — 이 결론 자체는 유효하다. 다만 그 이유는 "원본 커밋이 그대로 재생되어 조상 관계가 유지되기 때문"이 아니라, **`git rebase`가 patch 내용 동등성(patch-equivalence)을 감지해 이미 반영된 커밋을 자동으로 건너뛰기(drop) 때문**이다. 선행 브랜치가 rebase merge로 `main`에 들어간 뒤 스택 브랜치를 이어가려면 반드시 `git merge main`이 아니라 `git rebase main`을 쓴다 — `git rebase`는 각 커밋을 patch로 재적용하면서 이미 동일한 내용이 새 base에 있으면 "dropping <sha> -- patch contents already upstream." 메시지와 함께 자동으로 스킵한다. **`git merge`를 쓰면 이 감지가 동작하지 않고 전체 파일 충돌이 재현될 수 있다.** 커밋 메시지는 각 이슈 단위로 나눠 작성해 `main` 로그에서 이슈별 경계가 보이게 한다.
3. **"이미 병합됐는지" 판단에 SHA 조상 관계 기반 명령을 쓰지 않는다.** `git branch -d`, `git merge-base --is-ancestor`, `git log origin/main..origin/<브랜치>`가 비어있는지 확인하는 방법은 모두 rebase merge 이후 항상 false negative를 낸다. 대신 PR 머지 여부는 `gh pr view <번호> --json state,mergedAt`으로, 스택 브랜치가 이미 반영됐는지는 `git rebase origin/main` 실행 후 "dropping ... already upstream" 메시지 유무로 확인한다.
4. **로컬 브랜치 정리는 `git branch -D`(강제)로 한다.** rebase merge 후 로컬 기능 브랜치는 `git branch -d`로 지워지지 않는다 — 위와 동일한 SHA 조상 관계 검사가 항상 거부하기 때문이며, 이는 버그가 아니라 예상된 동작이다. `gh pr view`로 머지를 확인한 뒤 `git branch -D <브랜치>`로 삭제한다. 이 저장소는 `deleteBranchOnMerge: false`이므로 원격 브랜치도 `git push origin --delete <브랜치>`로 함께 정리해야 한다.
5. **커밋 위생을 위해**, PR을 열기 전 로컬에서 `git rebase -i`로 fixup/오타 수정 커밋을 정리하는 것을 권장한다(단, 이미 push한 공유 커밋을 rebase로 재작성해 강제 push하지 않는다 — 이 저장소의 Git Safety Protocol 준수).

## 결과(Consequences) — 2026-07-08 개정

- **긍정**: blocked-by 체인을 선행 PR 머지 대기 없이 이어서 진행할 수 있어 병렬화 속도가 개선된다. cherry-pick 재구성 절차가 더 이상 필요 없다. `main` 로그는 여전히 선형을 유지한다.
- **부정/비용**: PR당 커밋이 하나로 압축되지 않아 `main` 로그의 커밋 수가 늘어난다(대신 이슈 단위 커밋 메시지로 가독성을 보완). 팀원이 PR 브랜치에서 커밋을 지저분하게 쌓았다면 그 지저분함이 `main`에도 그대로 남으므로, PR 커밋 위생(위 결정 5)에 더 신경 써야 한다.
- **부정/비용 (2026-07-09 추가)**: 스택 브랜치의 재병합 안전성은 구조적 보장(SHA 조상 관계)이 아니라, "항상 `git rebase`로 갱신하고 `git merge`는 쓰지 않는다"는 운영 규율에 의존한다. 머지 완료 판단에 SHA 조상 관계 검사(`git branch -d`, `--is-ancestor` 등)를 쓰는 자동화(스크립트, CI 등)가 있다면 false negative를 내므로 함께 점검이 필요하다.

---

## 2026-07-08 결정의 메커니즘 설명(오류, 2026-07-09 정정으로 대체됨)

> 아래는 2026-07-08 개정 당시 실제로 작성됐던 근거 설명이다. PR #62(#61) 이후 SHA 조상 관계가 보장되지 않음이 확인되어 위 "결정" 섹션에서 정정되었으나, 무엇이 왜 틀렸는지 기록으로 남긴다.

> "rebase merge로 바꾸면 원본 커밋이 `main`의 실제 조상이 되어 스택 브랜치 재병합 시의 '전체 파일 충돌' 문제 자체가 사라진다."

결론(전체 파일 충돌이 사라진다는 것) 자체는 맞았지만, 이유는 SHA 조상 관계가 아니라 `git rebase`의 patch-내용 동등성 감지였다.

---

## 최초 결정(2026-07-07, 위 개정으로 대체됨)

1. **머지 전략은 squash 유지.** `main` 히스토리를 PR당 커밋 하나로 깔끔하게 유지하는 이 저장소의 기존 관례를 우선한다. Merge commit 전략으로 바꾸면 이 문제 자체는 막을 수 있으나(원본 커밋이 `main`의 실제 조상이 됨), `main` 로그가 지저분해지는 트레이드오프가 더 크다고 판단.
2. **blocked-by 이슈는 선행 PR이 실제로 `main`에 머지된 후에만 브랜치를 딴다.** `gh pr view <번호> --json state,mergedAt`(또는 `git log origin/main..origin/<선행-브랜치>`가 비어있는지)으로 확인 후, `main`을 pull하고 그 위에서 새 브랜치를 생성한다. 아직 열려 있거나 머지 대기 중인 형제 이슈의 브랜치 위에 스택하지 않는다.
3. **이미 스택된 상태에서 충돌이 발생하면**, 스택 브랜치 전체를 병합하지 말고 고유 커밋만 최신 `main` 위로 `git cherry-pick` 해서 새 브랜치로 만든다(강제 push 불필요, 이번 사례에서 PR #42 → #43으로 대체한 방식).

### 결과(최초)

- **긍정**: `main` 히스토리는 계속 PR당 커밋 하나로 깔끔하게 유지된다. 충돌 원인이 명확해져 재발 시 빠르게 진단·복구 가능(cherry-pick 절차가 표준화됨).
- **부정/비용**: blocked-by 이슈를 병렬로 미리 시작할 수 없고, 선행 PR이 머지될 때까지 대기해야 한다 — 순수 병렬화 속도는 다소 희생된다. 부득이 병렬로 먼저 시작했다면, 선행 PR 머지 후 스택 브랜치를 그대로 합치지 말고 반드시 cherry-pick으로 재구성해야 한다.
