# ADR-0007: 테마의 단일 소스는 CSS 변수 — TS 색상 토큰 사본 금지

- **상태(Status)**: 수락됨(Accepted)
- **날짜**: 2026-07-16
- **컨텍스트**: 프론트엔드 디자인 시스템 / 발판(base) 리포 모델

## 배경(Context)

아키텍처 검토(candidate 4)에서 프론트 테마 층을 조사한 결과:

1. **소비자 없는 3벌 동기화** — `tokens.ts`(원시 OKLCH)·`globals.css :root`·`color.ts`(시맨틱 수출)에 같은 색상 값이 수기로 중복 입력되었고, `tokens.ts` 헤더가 "새 색상 추가 3단계 절차"를 문서화하고 있었다. 그런데 TS 토큰 810줄(tokens/color/spacing/typography) 중 런타임 실소비는 `textCombinations`(클래스 문자열)와 `icons`(아이콘 매핑)뿐 — **색상 값 계열의 소비자는 Storybook 문서 페이지 하나였다**. 지킬 소비자가 없는 동기화를 유지해온 것.
2. **drift의 실증** — 도달 불가능한 `.dark` 블록(테마 토글 없음)이 이전 브랜드(Civic Authority) 팔레트 값 그대로 남아, 사본이 실물과 어긋난다는 것을 스스로 증명했다.
3. **죽은 폰트 interface** — `--font-family-*` 변수는 정의만 되고 `body`/`h1-h6` 규칙은 리터럴 스택을 하드코딩 — 변수를 바꿔도 화면이 안 바뀌었다.
4. **도메인 어휘 누수** — `statusChipVariants`의 키(접수·검토중·완료·반려·보류)가 토큰 층에 존재. 소비처는 스토리북 데모 2곳뿐.

## 결정(Decision)

1. **테마 interface는 `globals.css`의 `:root` 변수 + `@theme inline` 매핑 하나다.** 리스킨 = `:root` 블록 교체. 분기 리포(개인 서비스, 공공시스템)의 팔레트 변경은 이 한 곳에서 끝난다.
2. **TS 색상·스페이싱 토큰 사본을 금지한다** — `tokens.ts`·`color.ts`·`spacing.ts`를 삭제한다. TS에서 색상 값이 필요한 실소비자가 나타나면 그때 CSS→TS 생성 파이프라인을 검토한다(사전 구축은 투기적). TS 헬퍼는 값이 아닌 **클래스 문자열**(`typography.ts`의 `textCombinations`)과 **아이콘 매핑**(`icons.ts`)만 허용한다.
3. **도달 불가 다크 모드를 삭제한다** — `.dark` 블록과 `darkModeColors`. 다크 모드가 요구사항이 되면 현재 브랜드 기준으로 새로 설계한다(이전 값은 재사용 불가, git 히스토리 참조 가능).
4. **폰트 규칙은 변수를 참조한다** — `body`/`h1-h6`가 `var(--font-family-body)`/`var(--font-family-display)`를 사용하고, 변수 값은 기존 리터럴 스택으로 정렬해 렌더링을 동일하게 유지한다. 소비자 없는 폰트 변수는 삭제한다.
5. **도메인 상태 어휘는 토큰 층에서 제거한다** — `statusChipVariants` 삭제, 스토리북 데모는 스토리 로컬 데이터로 대체. 상태 칩이 실기능이 되면 해당 feature 층이 소유한다.
6. **Storybook 디자인 시스템 문서(`DesignTokens.stories`)는 CSS 변수를 직접 렌더한다** — TS 사본이 아닌 실물(`var(--color-*)`)을 보여주므로 문서가 구조적으로 drift할 수 없다.

## 결과(Consequences)

- **긍정**: 수기 동기화 절차와 그 drift 위험 소멸. 리스킨 interface가 렌더링을 실제로 결정하는 것과 일치(leverage: 블록 1개 교체 = 전체 리스킨). ~700줄의 deletion test 탈락 코드 제거. 분기 리포가 잘못된 다크 팔레트를 상속하지 않음.
- **부정/비용**: TS에서 색상 값을 읽고 싶은 미래 소비자는 생성 파이프라인 구축이 선행 필요(의도된 마찰 — 사본 재도입을 막는다). 다크 모드 재도입 시 팔레트를 새로 설계해야 한다(어차피 필요했음).
