# DataTable 기능 정의서

## 기능 개요

API로부터 데이터를 주입받아 테이블 형태로 표시하고, 페이지네이션으로 탐색할 수 있는 공통 컴포넌트.

---

## 컴포넌트 구조

`Table` · `Pagination` 공통 컴포넌트를 내부에서 조합하여 구성한다.

```
DataTable
├── Table (공통 컴포넌트)
│   ├── TableHeader / TableHead  ← columns 배열로 렌더
│   └── TableBody  / TableCell   ← data 배열로 렌더
│       ├── 로딩: 스켈레톤 행 (pageSize 수)
│       ├── 에러: 에러 메시지 + 다시 시도 버튼
│       ├── 빈 데이터: emptyMessage 텍스트
│       └── 정상: 데이터 행
└── Pagination (공통 컴포넌트, pagination prop이 있을 때만)
```

---

## Props 인터페이스

### ColumnDef\<T\>

| 속성     | 타입                                       | 필수 | 설명                                               |
| -------- | ------------------------------------------ | ---- | -------------------------------------------------- |
| `key`    | `keyof T & string`                         | ✅   | 데이터 객체의 키                                   |
| `header` | `string`                                   | ✅   | 헤더 텍스트                                        |
| `width`  | `string`                                   |      | 컬럼 너비 (예: `'80px'`, `'10%'`)                  |
| `align`  | `'left' \| 'center' \| 'right'`            |      | 셀 정렬, 미지정 시 TableHead/TableCell 기본값 따름 |
| `render` | `(value: T[keyof T], row: T) => ReactNode` |      | 셀 커스텀 렌더러. 미지정 시 값을 문자열로 표시     |

### DataTableProps\<T\>

| 속성           | 타입                     | 필수 | 기본값                 | 설명                                            |
| -------------- | ------------------------ | ---- | ---------------------- | ----------------------------------------------- |
| `data`         | `T[] \| undefined`       | ✅   |                        | 표시할 데이터 배열                              |
| `columns`      | `ColumnDef<T>[]`         | ✅   |                        | 컬럼 설정 배열                                  |
| `isLoading`    | `boolean`                | ✅   |                        | 로딩 상태                                       |
| `isError`      | `boolean`                |      | `false`                | 에러 상태                                       |
| `onRetry`      | `() => void`             |      |                        | 에러 시 다시 시도 콜백                          |
| `emptyMessage` | `string`                 |      | `'데이터가 없습니다.'` | 빈 데이터 메시지                                |
| `pageSize`     | `number`                 |      | `10`                   | 페이지당 행 수 (스켈레톤 행 수도 동일하게 적용) |
| `pagination`   | `boolean`                |      |                        | 지정 시 Pagination 컴포넌트 렌더                |
| `totalPages`   | `number`                 |      |                        | 전체 페이지 수 (`pagination` 사용 시 필요)      |
| `onPageChange` | `(page: number) => void` |      |                        | 페이지 변경 콜백 (`pagination` 사용 시 필요)    |

---

## 상태별 UI

### 로딩 (`isLoading: true`)

- `pageSize`와 동일한 수의 스켈레톤 행을 표시한다.
- 헤더는 정상 렌더, tbody만 스켈레톤으로 대체한다.
- 레이아웃 이동(Layout Shift) 없이 데이터 영역을 유지한다.

```
┌──────────────────────────────────────┐
│  ID    │  제목          │  작성자     │
├──────────────────────────────────────┤
│ ░░░░   │ ░░░░░░░░░░░    │ ░░░░░░     │
│ ░░░░   │ ░░░░░░░░░░░    │ ░░░░░░     │
│ ░░░░   │ ░░░░░░░░░░░    │ ░░░░░░     │
└──────────────────────────────────────┘
```

### 에러 (`isError: true`)

- `isLoading`보다 우선 처리한다.
- tbody 전체를 차지하는 에러 메시지와 [다시 시도] 버튼을 표시한다.
- `onRetry`가 없으면 버튼을 표시하지 않는다.

```
┌──────────────────────────────────────┐
│  ID    │  제목          │  작성자     │
├──────────────────────────────────────┤
│     데이터를 불러오지 못했습니다.       │
│              [다시 시도]              │
└──────────────────────────────────────┘
```

### 빈 데이터 (`data: []`)

- `emptyMessage` 텍스트를 tbody 중앙에 표시한다.

```
┌──────────────────────────────────────┐
│  ID    │  제목          │  작성자     │
├──────────────────────────────────────┤
│           데이터가 없습니다.           │
└──────────────────────────────────────┘
```

### 정상

- 데이터 행을 렌더하고, `pagination` prop이 있으면 하단에 Pagination 컴포넌트를 표시한다.

---

## 페이지네이션

- `pagination` prop이 없으면 Pagination 컴포넌트를 렌더하지 않는다.
- `pagination` prop이 있으면:
  - DataTable 내부에서 `currentPage` 상태를 관리한다.
  - 페이지 변경 시 `onPageChange(page)` 콜백을 호출한다.
  - 호출부에서 새 page로 API를 재요청하여 `data`를 갱신한다.
- 총 건수(totalCount)는 표시하지 않는다.

```tsx
// 호출부 예시
const [page, setPage] = useState(1)
const { data, isLoading, isError, refetch } = useBoards({ page, size: 10 })

<DataTable
  data={data?.data}
  columns={columns}
  isLoading={isLoading}
  isError={isError}
  onRetry={refetch}
  pageSize={10}
  pagination
  totalPages={data?.meta.totalPages}
  onPageChange={setPage}
/>
```

---

## 컬럼 설정 예시

```ts
const columns: ColumnDef<Board>[] = [
  { key: 'id',        header: 'ID',    width: '80px',  align: 'center' },
  { key: 'title',     header: '제목',  align: 'left',
    render: (value, row) => <a href={`/boards/${row.id}`}>{value}</a> },
  { key: 'author',    header: '작성자', width: '120px', align: 'center' },
  { key: 'createdAt', header: '등록일', width: '160px', align: 'center',
    render: (value) => formatDate(value as string) },
]
```

---

## 행 인터랙션

- 행 클릭 이벤트를 지원하지 않는다.
- 상세 페이지 이동, 수정/삭제 버튼 등 셀 내 인터랙션은 `render` 함수로 직접 구현한다.

---

## API 응답 규격

DataTable이 기대하는 API 응답 구조:

```json
{
  "data": [...],
  "meta": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 100
  }
}
```

---

## 제약사항

- `Table` · `Pagination` 공통 컴포넌트를 사용한다. 직접 `<table>` 태그 작성 금지.
- 데이터는 외부(TanStack Query)에서 주입받는다. DataTable 내부에서 API를 직접 호출하지 않는다.
- 추가 라이브러리 설치 금지.
- 정렬 기능을 제공하지 않는다.
- 기존 공통 컴포넌트를 조합하고 상태(로딩·에러·빈 데이터·currentPage)를 관리하는 래퍼 역할만 한다.
