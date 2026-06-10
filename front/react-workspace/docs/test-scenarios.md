# 테스트 시나리오 

이슈 단위로 시그니처 확정 → 테스트 시나리오 도출을 순서대로 처리. (참고: 이후 TDD 방법론으로 테스트 코드 구현 예정)


# 경로 및 브랜치 네이밍 규칙

## 입력 형식

```
/test-scenarios  {feature-path} 1
```

`{feature-path}`는 **기능의 위치를 나타내는 경로 전체**다.
도메인만 넣는 것이 아니라 기능명까지 포함해서 입력한다.

| 입력 예시 | 의미 | 문서 경로 | 브랜치 |
|----------|------|----------|-------|
| `/test-scenarios tag` | tag 단독 기능 | `/src/features/tag/docs/` | `feature/tag` |
| `/test-scenarios  notice/list` | notice 도메인의 list 기능 | `/src/features/notice/list/docs/` | `feature/notice/list` |
| `/test-scenarios  notice/list 페이지네이션 포함` | 설명 추가 | `/src/features/notice/list/docs/` | `feature/notice/list` |
| `/test-scenarios  notice/category/detail` | 3단계 중첩 | `/src/features/notice/category/detail/docs/` | `feature/notice/category/detail` |


**파싱 규칙:**
- 첫 번째 공백 이전 → `{feature-path}` (슬래시 포함 가능)
- 슬래시가 있으면 마지막 세그먼트가 기능명, 전체가 경로
- 한글·공백이 포함된 경우: 공백을 `-`로, 한글은 영문 slug로 변환하도록 사용자에게 제안


#  실행순서

1. `/src/features/{feature-path}/docs/prd.md` 와 코드 베이스를 참고해서 시그니처를 도출한다
  - 함수 시그니처 (이름, 파라미터 타입, 반환 타입)
  - 에러 케이스 (어떤 상황에서 에러를 던지는지)
  - 컴포넌트 Props 타입 정의
  - 구현 코드는 절대 작성하지 않음
  - 기존 패턴을 따를 것 (api/notes.ts, 공통 컴포넌트 Pick, Omit, 컴포넌트 Props 패턴)
  - 단일 책임원칙 준수
2. 확정된 시그니처를 개발자에게 보여주고 검토/승인을 받는다
3. 승인된 시그니처를 `/src/features/{feature-path}/docs/issue-{N}.md`상단에 기록한다
4. 시그니처를 기반으로 테스트 시나리오를 도출한다
    - 시나리오를 정상/경계/예외로 분류
    - 형식: "[정상/경계/예외] 함수명 — should [기대동작] when [조건]"
    - 테스트 코드는 작성하지 않음
5. 도출된 시나리오를 /docs/features/{feature-path}/issue-{N}.md 하단에 추가한다
6. task 번호와 AC 항목과 시나리오를 대조한다
    - AC 항목 중 시나리오가 없는 항목이 있으면 시나리오를 추가한다
    - 모든 AC가 최소 1개 이상의 시나리오로 커버되는지 확인한다
7. 시나리오를 개발자에게 보여주고 검토/승인을 받는다
   (승인 전까지 다음 단계로 넘어가지 말 것)