# 요구사항

아래의 조건을 모두 적용하여, 커서 룰을 준수하고 요구사항을 모두 구현할 것.  
작업이 끝나면 해당 rules 적용 결과를 체크리스트로 반환할 것.

# 컴포넌트 경로

`src/components/common/Pagination`

# 핵심 요구사항 (variant 시스템)

다음 조건을 모두 만족하는 variant 시스템을 구현할 것.

- 페이지 버튼은 동그라미로 한다.
- 페이지네이션 기능과 페이지 이동, 다음 및 이전 링크가 포함되어야 한다
  - 이전 버튼을 클릭하면 이전 그룹 목록 첫번째 페이지로 이동 해야 한다.
    - `처음 이전 6 7 8 [9] 10 다음 마지막` > `처음 이전 [1] 2 3 4 5 다음 마지막`
  - 처음 버튼을 클릭하면 첫 번째 페이지로 이동해야 한다.
    - `처음 이전 11 12 [13] 14 15 다음 마지막` > `처음 이전 [1] 2 3 4 5 다음 마지막`

  - 다음 버튼을 클릭하면 다음 그룹 목록 첫번째 페이지로 이동 해야 한다.
    - `처음 이전 1 2 3 [4] 5 다음 마지막` > `처음 이전 [6] 7 8 9 10 다음 마지막`
  - 마지막 버튼을 클릭하면 마지막 페이지로 이동해야 한다.
    - `처음 이전 1 2 3 4 5 다음 마지막` > `처음 이전 11 12 13 14 [15] 다음 마지막`

- 페이지 번호만 있는 간단한 페이지 매김 방식만 노출 하는 기능이 포함 되어야한다.
- 선택적으로 첫 페이지 및 마지막 페이지 버튼을 활성화할 수 있어야 한다.

- `variant`: ` 'primary' | 'secondary' | 'tertiary'` (기본 `'primary'`)
- `color` : ` 'primary' | 'secondary' | 'tertiary'` (기본 `'primary'`)
- `showFirstButton` : `boolean` (기본 `'false'`)
- `showLastButton` : `boolean` (기본 `'false'`)
- `showPageNumbersOnly`: `boolean` (기본 `'false'`)
- `pageGroupSize` : `number` (기본 `5`)
- `totalPages`, : `number`
- `currentPage`: `number`

## 기본 UI

`이전 [1] 2 3 4 5 다음`

# 접근성 (Accessibility)

- focus trap 보장 -키보드 내비게이션 지원
- ARIA 속성은 Radix 기본 동작을 그대로 따른다

# 완료 시 산출물

작업 종료 후 공통 컴포넌트 룰(common-component-rule.mdc) 적용 결과를 체크리스트로 반환할 것.

---

## Design Token Reference

- **아이콘**: `icons.first`, `icons.prev`, `icons.next`, `icons.last`, `iconSizes.sm` — `src/styles/icons.ts`
- **색상**: CSS Module 내 `var(--primary)` (활성 페이지 원), `var(--border)` (비활성 버튼 테두리), `var(--accent)` (secondary variant)
- **반경**: CSS Module 내 `var(--radius-full)` (9999px — 페이지 버튼 동그라미)
- **스페이싱**: CSS Module 내 `var(--spacing-xs)` (버튼 간격)
- **직접 import**: `icons`, `iconSizes` from `@/styles`
- 참고: `docs/design/spacing.md#보더-반경`, `docs/design/color.md`
