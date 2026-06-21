/skill-creator를 사용해서 아래 조건으로 .claude/skills/tdd-green/SKILL.md를 만들어줘:

---

## 목적
실패하는 테스트를 통과시키는 최소한의 구현 코드를 작성한다 (TDD Green 단계).

---

## feature-path 결정
1. feature-planner 세션 컨텍스트가 있으면 feature-path를 자동 로드해서 사용 하고 없으면
2. Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다.
3. 그것도 없으면 직접 입력 받는다. (/test-scenarios {feature-path} {N})

---

## 입력 스펙
- $ARGUMENTS = {이슈 번호} (필수)
- 예) /tdd-green 42  →  docs/features/{feature-path}/issue-42.md 를 읽음

---

## 전제 조건
- package.json의 test 스크립트가 vitest를 실행함을 가정
- 아닐 경우 npx vitest run 을 직접 사용
- 테스트 환경: Vitest + React Testing Library
- 직접 api를 작성 하지 않고 orval이 생성한 hook 또는 api를 사용 해야 한다.
---

## 실행 순서

1. npm test 실행 → 실패 테스트 목록 확인

2. ccollect 실패 감지 — 시나리오 문서(docs/features/{feature-path}/issue-{N}.md)의
   체크박스(- [ ]) 총 건수와 vitest가 보고하는 Tests 수를 비교.
   불일치 시 import 대상 모듈이 없는 것이므로, 시그니처만 있는 stub 파일을
   생성하여 전체 테스트가 인식되도록 한다.
3. 디자인 컨텍스트 로드
   - src/features/{feature-path}/design-system.md 가 존재하면 읽어서 구현 대상 컴포넌트의 시각적 스펙(색상, 간격, 레이아웃, 상태별 표현)을 파악한다
   - src/features/{feature-path}/issue-{N}.md에 "디자인 참고" 섹션이 있으면 함께 확인한다.
   - CLAUDE.md의 스타일링 컨벤션도 참조한다.
   - 디자인 문서가 없으면 이 단계를 건너뛰고 CLAUDE.md 컨벤션만 따른다.
4. 첫 번째 실패 테스트를 통과시키는 최소한의 코드만 작성
    - 테스트가 요구하는 동작을 충족하는 코드만 작성
    - UI 컴포넌트의 경우 design-system.md 의 Tailwind 클래스, 레이아웃 구조, 상태별 표현을 그대로 적용한다
    - design-system.md 에 없는 시각적 요소는 임의로 추가하지 않는다
5. npm test 실행 → 통과 확인 + 회귀 없는지 전체 테스트 확인 <피드백루프>
    - 정상 통과: 6번으로 이동
    - 해당 테스트가 아직 실패 중이면: 에러 메시지를 읽고 원인을 분석하여 코드를 수정한 뒤 5번을 다시 실행한다 (최대 5회 반복)
    - 5회 반복 후에도 실패하면: 개발자에게 실패 원인을 보고하고 중단
6. docs/features/{feature-path}/issue-{N}.md 해당 항목 [x] 체크
7. 다음 실패 테스트로 이동 → 4번부터 반복
8. 전체 통과 후 커버리지 측정
    - pnpm test:coverage 실행
    - 미커버 라인 확인 → 시나리오에서 빠진 케이스인지 개발자에게 보고
    - 커버리지를 올리기 위한 테스트 추가는 금지. 참고용으로만 활용.
9. 결과 요약
   - 통과한 테스트 수 / 전체 테스트 수
   - 체크된 시나리오 목록
   - 커버리지 리포트 요약
   - 미해결 항목이 있으면 별도 표시