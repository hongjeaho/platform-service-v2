# DataTable

## 컴포넌트 경로

`src/components/common/DataTable`

## Design Token Reference

- 색상: `var(--muted)`, `var(--muted-foreground)`, `var(--border)`, `var(--surface-container-highest)`
- 스페이싱: `var(--spacing-2)`, `var(--spacing-3)`, `var(--spacing-4)`, `var(--spacing-8)`
- 타이포: `var(--font-size-sm)`, `var(--line-height-normal)`
- 반경: `var(--radius-sm)`
- 규칙: 공통 컴포넌트(Table, Pagination, Button, CheckBox) 조합, `className` prop 외부 노출 금지
- 참고: `docs/design/components.md`, PRD: `docs/prd.md`

## 내부 파일 구조 (PRD 안 B)

- `DataTable.tsx` — 조합 + 상태 (`currentPage`, `selectedRows`)
- `DataTableBody.tsx` — tbody 상태별 분기 (error → loading → empty → data)
- `DataTableSkeleton.tsx` — 스켈레톤 행 전담
- `index.ts` — `DataTable`만 외부 export (내부 파일 노출 금지)

## 주요 타입

- `ColumnDef<T>`: `key`, `header`, `width?`, `align?`, `render?(value, row)`
- `DataTablePagination`: `totalPages`, `onPageChange`
- `DataTableProps<T extends object>`: 전체 공개 인터페이스

## 상태 처리 우선순위

`isError` → `isLoading` → `data.length === 0` → 데이터 렌더
