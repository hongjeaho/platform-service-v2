/skill-creator를 사용해서 아래 조건으로 .claude/skills/tdd-red/SKILL.md를 만들어줘:

목적: 승인된 테스트 시나리오를 실패하는 테스트 코드로 작성

feature-path 결정:
1. feature-planner 세션 컨텍스트가 있으면 feature-path를 자동 로드해서 사용 하고 없으면
2. Git 브랜치명(feature/xxx)을 자동 파싱해 feature-path를 설정한다. 
3. 그것도 없으면 직접 입력 받는다. (/test-scenarios {feature-path} {N})

입력:
- $ARGUMENTS = {이슈 번호} (필수)
- 예) /tdd-red 42  →  docs/features/{feature-path}/issue-42.md 를 읽음

실행 순서:
1. docs/features/{feature-path}/issue-{번호}.md 에서 시나리오와 시그니처를 읽는다
2. 시나리오를 하나씩 테스트 코드로 작성한다
    - 테스트 이름: "should [기대 동작] when [조건]" 형식
    - Vitest + React Testing Library 사용
3. 작성 후 즉시 실행하여 실패를 확인한다
    - 정상 실패: 다음 시나리오로 이동
    - 에러 실패(import 오류, 컴파일 오류 등): 최소 스켈레톤 코드 생성 후 재실행
4. 전체 완료 후 npm test 실행 → 모두 실패 확인

테스트 파일 컨벤션:
- 위치: 테스트 대상 파일과 같은 디렉토리
  예) src/api/tags.ts → src/api/tags.test.ts
  src/components/TagInput.tsx → src/components/TagInput.test.tsx
- 네이밍: {파일명}.test.ts / {파일명}.test.tsx
- describe 블록: 함수/컴포넌트 단위로 묶기
  예) describe('addTag', () => { it('should ...') })

제약:
- 테스트 파일만 생성/수정
- src/의 구현 코드는 절대 수정 금지

참고:
- .claude/skills/feature-planning/SKILL.md
- .claude/skills/test-scenarios/SKILL.md