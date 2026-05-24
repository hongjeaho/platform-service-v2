# Button

## 컴포넌트 경로

`src/components/common/Button`

## 핵심 요구사항 (variant 시스템)

- `variant`: `'primary' | 'secondary' | 'accent' | 'destructive' | 'outline' | 'ghost' | 'link'` (기본 `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (기본 `'md'`)
- `loading`: boolean — true이면 스피너 표시 + disabled 처리
- `disabled`: boolean
- `icon`: ReactNode — 아이콘 삽입
- `iconPosition`: `'left' | 'right'` (기본 `'left'`)
- `fullWidth`: boolean

## 접근성 규칙

- 아이콘 전용 버튼(children 없음)에는 `aria-label` 필수
- DEV 환경에서 미제공 시 console.warn 출력
- `className` prop 외부 노출 금지 — CSS Module 캡슐화

## Design Token Reference

- **아이콘**: `icons.*`, `iconSizes.sm` (`src/styles/icons.ts`) — 스피너, 아이콘 렌더링
- **색상**: CSS Module 내 `var(--primary)`, `var(--accent)`, `var(--destructive)`, `var(--border)` 사용
- **타이포**: CSS Module 내 `var(--font-family-body)`, `var(--font-size-label-md)` 사용
- **스페이싱**: CSS Module 내 `var(--spacing-xs)` (아이콘-텍스트 gap), `var(--spacing-sm)` (패딩 수직)
- **반경**: CSS Module 내 `var(--radius)` (8px)
- **variant 규칙**: 한 폼에 `primary` 하나만 / `destructive`는 최종 삭제·반려 전용
- 참고: `docs/design/components.md#버튼-의미-구분`, `docs/design/color.md#버튼-색상`
