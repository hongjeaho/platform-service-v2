# DataTable 공통 컴포넌트 — 태스크 목록

> 수직 슬라이싱(Vertical Slicing) 원칙 적용: 각 태스크는 타입 정의 → 컴포넌트 구현 → 스타일 → 테스트 → 스토리까지 한 번에 완성한다.
> 의존 순서: Task 1 → Task 2·3·4 (병렬 가능) → Task 5 → Task 6

---

## Task 1 — 컴포넌트 스캐폴딩 + 기본 데이터 표시

**관련 US:** US-01 데이터 표시, US-06 커스텀 셀 렌더링

### 설명

DataTable 컴포넌트 파일 구조를 전부 생성하고, `data`·`columns` prop을 받아 테이블을 렌더하는 가장 기본 슬라이스를 구현한다.
`ColumnDef<T>` 타입(key · header · width · align · render)을 확정하고, `render` 함수 유무에 따라 셀을 커스텀 렌더링하는 기능까지 포함한다.

이 태스크 완료 후 DataTable은 정상 데이터를 표시할 수 있는 상태가 된다. 이후 태스크들은 이 베이스 위에 상태 분기를 추가한다.

**생성 파일:**

- `DataTable.tsx` — 조합 컴포넌트
- `DataTableBody.tsx` — tbody 분기 전담 (이 태스크에서는 data 렌더만 구현)
- `DataTable.type.ts` — ColumnDef, DataTableProps 타입
- `DataTable.module.css` — 기본 테이블 레이아웃 스타일
- `DataTable.stories.tsx` — 기본 데이터 표시 스토리
- `DataTable.test.tsx` — 기본 렌더 테스트
- `index.ts` — DataTable만 export

### 완료 조건 (Acceptance Criteria)

**AC-1-1: 기본 데이터 렌더**

- **Given** `data=[{id:1, name:'홍길동'}]`, `columns=[{key:'id', header:'ID'}, {key:'name', header:'이름'}]`를 전달했을 때
- **When** DataTable이 마운트되면
- **Then** thead에 'ID', '이름' 헤더가 렌더되고, tbody에 '1', '홍길동' 셀이 렌더된다

**AC-1-2: render 함수 없는 셀 — 문자열 변환**

- **Given** `columns`의 특정 컬럼에 `render`가 없고, 해당 셀 값이 숫자 `42`일 때
- **When** DataTable이 마운트되면
- **Then** 해당 셀에 문자열 `"42"`가 그대로 표시된다

**AC-1-3: render 함수 있는 셀 — ReactNode 반환**

- **Given** `columns=[{key:'status', header:'상태', render:(value, row) => <Badge>{value}</Badge>}]`를 전달했을 때
- **When** DataTable이 마운트되면
- **Then** 해당 셀에 `<Badge>` 컴포넌트가 렌더된다

**AC-1-4: render 함수에서 row 전체 참조**

- **Given** `render:(value, row) => <a href={`/detail/${row.id}`}>{value}</a>` 형태로 다른 필드를 참조할 때
- **When** DataTable이 마운트되면
- **Then** `row.id`가 정상적으로 참조되어 href가 올바르게 생성된다

**AC-1-5: index.ts — 내부 파일 미노출**

- **Given** `DataTable/index.ts`를 확인했을 때
- **When** export 목록을 살펴보면
- **Then** `DataTable`만 export되고, `DataTableBody`·`DataTableSkeleton`은 export되지 않는다

---

## Task 2 — 로딩 상태 (스켈레톤 UI)

**관련 US:** US-02 로딩 상태

### 설명

`isLoading: true`일 때 tbody 영역을 스켈레톤 행으로 대체한다. `DataTableSkeleton.tsx`를 분리 파일로 생성하고, `DataTableBody.tsx`에 로딩 분기를 추가한다. 헤더는 정상 렌더되어 Layout Shift 없이 자리를 유지한다.

**생성/수정 파일:**

- `DataTableSkeleton.tsx` — 스켈레톤 행 전담 (신규)
- `DataTableBody.tsx` — 로딩 분기 추가
- `DataTable.type.ts` — `isLoading`, `pageSize` prop 추가
- `DataTable.stories.tsx` — Loading 스토리 추가
- `DataTable.test.tsx` — 로딩 상태 테스트 추가

### 완료 조건 (Acceptance Criteria)

**AC-2-1: 스켈레톤 행 수 = pageSize**

- **Given** `isLoading=true`, `pageSize=5`, `columns`가 3개일 때
- **When** DataTable이 마운트되면
- **Then** tbody에 스켈레톤 행이 정확히 5개 렌더된다

**AC-2-2: pageSize 기본값 10**

- **Given** `isLoading=true`이고 `pageSize`를 전달하지 않았을 때
- **When** DataTable이 마운트되면
- **Then** tbody에 스켈레톤 행이 10개 렌더된다

**AC-2-3: 헤더 정상 렌더**

- **Given** `isLoading=true`, `columns=[{key:'name', header:'이름'}]`을 전달했을 때
- **When** DataTable이 마운트되면
- **Then** thead에 '이름' 헤더가 정상적으로 렌더된다

**AC-2-4: 스켈레톤 셀 수 = 컬럼 수**

- **Given** `isLoading=true`, `columns`가 4개일 때
- **When** DataTable이 마운트되면
- **Then** 각 스켈레톤 행에 셀(td/플레이스홀더)이 4개씩 렌더된다

**AC-2-5: DataTableSkeleton 독립 테스트 가능**

- **Given** `DataTableSkeleton`을 `columnCount=3`, `rowCount=5`로 단독 마운트했을 때
- **When** 렌더 결과를 확인하면
- **Then** DataTable 전체를 마운트하지 않아도 스켈레톤 행 수와 셀 수가 검증된다

---

## Task 3 — 에러 상태

**관련 US:** US-03 에러 상태

### 설명

`isError: true`일 때 tbody 전체에 에러 메시지와 선택적 재시도 버튼을 표시한다. 에러 상태는 로딩 상태보다 우선 처리된다.

**수정 파일:**

- `DataTableBody.tsx` — 에러 분기 추가 (error → loading → empty → data 순서 확정)
- `DataTable.type.ts` — `isError`, `onRetry` prop 추가
- `DataTable.stories.tsx` — Error / ErrorWithRetry 스토리 추가
- `DataTable.test.tsx` — 에러 상태 테스트 추가

### 완료 조건 (Acceptance Criteria)

**AC-3-1: 에러 메시지 표시**

- **Given** `isError=true`를 전달했을 때
- **When** DataTable이 마운트되면
- **Then** tbody 영역에 "데이터를 불러오지 못했습니다." 텍스트가 표시된다

**AC-3-2: onRetry 없으면 버튼 미표시**

- **Given** `isError=true`이고 `onRetry`를 전달하지 않았을 때
- **When** DataTable이 마운트되면
- **Then** [다시 시도] 버튼이 렌더되지 않는다

**AC-3-3: onRetry 있으면 버튼 표시 + 클릭 호출**

- **Given** `isError=true`, `onRetry={mockFn}`을 전달했을 때
- **When** [다시 시도] 버튼을 클릭하면
- **Then** `mockFn`이 1회 호출된다

**AC-3-4: 에러가 로딩보다 우선**

- **Given** `isError=true`, `isLoading=true`를 동시에 전달했을 때
- **When** DataTable이 마운트되면
- **Then** 스켈레톤이 아닌 에러 메시지가 표시된다

---

## Task 4 — 빈 데이터 상태

**관련 US:** US-04 빈 데이터 상태

### 설명

`data`가 빈 배열(`[]`)이고 로딩·에러 상태가 아닐 때, tbody에 빈 데이터 메시지를 표시한다. `emptyMessage` prop으로 메시지를 커스터마이징할 수 있다.

**수정 파일:**

- `DataTableBody.tsx` — empty 분기 추가
- `DataTable.type.ts` — `emptyMessage` prop 추가
- `DataTable.stories.tsx` — Empty / EmptyCustomMessage 스토리 추가
- `DataTable.test.tsx` — 빈 데이터 상태 테스트 추가

### 완료 조건 (Acceptance Criteria)

**AC-4-1: 기본 빈 메시지**

- **Given** `data=[]`이고 `emptyMessage`를 전달하지 않았을 때
- **When** DataTable이 마운트되면
- **Then** tbody에 "데이터가 없습니다." 텍스트가 표시된다

**AC-4-2: 커스텀 빈 메시지**

- **Given** `data=[]`, `emptyMessage="검색 결과가 없습니다."`를 전달했을 때
- **When** DataTable이 마운트되면
- **Then** tbody에 "검색 결과가 없습니다." 텍스트가 표시된다

**AC-4-3: 빈 상태는 로딩·에러보다 낮은 우선순위**

- **Given** `data=[]`, `isLoading=true`를 동시에 전달했을 때
- **When** DataTable이 마운트되면
- **Then** 빈 메시지가 아닌 스켈레톤 UI가 표시된다

**AC-4-4: 분기 순서 확정 — error → loading → empty → data**

- **Given** `DataTableBody.tsx` 코드를 확인했을 때
- **When** 조건 분기 순서를 검토하면
- **Then** isError → isLoading → data.length===0 → data 렌더 순서로 처리된다

---

## Task 5 — 페이지네이션

**관련 US:** US-05 페이지네이션

### 설명

`pagination` prop을 전달하면 DataTable 하단에 Pagination 컴포넌트가 렌더되고, 내부에서 `currentPage` 상태를 관리한다. 페이지 변경 시 `onPageChange(page)` 콜백을 호출한다.

**수정 파일:**

- `DataTable.tsx` — `currentPage` 상태 + Pagination 조합 추가
- `DataTable.type.ts` — `PaginationProps`, `pagination` prop 추가
- `DataTable.stories.tsx` — WithPagination 스토리 추가
- `DataTable.test.tsx` — 페이지네이션 테스트 추가

### 완료 조건 (Acceptance Criteria)

**AC-5-1: pagination prop 없으면 Pagination 미렌더**

- **Given** `pagination`을 전달하지 않았을 때
- **When** DataTable이 마운트되면
- **Then** Pagination 컴포넌트가 DOM에 렌더되지 않는다

**AC-5-2: pagination prop 있으면 Pagination 렌더**

- **Given** `pagination={{ totalPages: 5, onPageChange: mockFn }}`을 전달했을 때
- **When** DataTable이 마운트되면
- **Then** Pagination 컴포넌트가 테이블 하단에 렌더된다

**AC-5-3: 페이지 변경 시 onPageChange 호출**

- **Given** `pagination={{ totalPages: 5, onPageChange: mockFn }}`을 전달하고 DataTable이 마운트된 상태에서
- **When** Pagination에서 3페이지를 클릭하면
- **Then** `mockFn`이 인수 `3`과 함께 1회 호출된다

**AC-5-4: currentPage 내부 상태 관리**

- **Given** DataTable이 `pagination={{ totalPages: 3, onPageChange: mockFn }}`으로 마운트된 상태에서
- **When** 2페이지를 클릭하면
- **Then** Pagination의 현재 페이지 표시가 2로 업데이트된다 (외부에서 `currentPage`를 주입하지 않아도)

**AC-5-5: totalPages 전달**

- **Given** `pagination={{ totalPages: 7, onPageChange: mockFn }}`을 전달했을 때
- **When** DataTable이 마운트되면
- **Then** Pagination에 `totalPages=7`이 전달되어 7페이지까지 탐색이 가능하다

---

## Task 6 — 행 선택 (체크박스)

**관련 US:** US-07 행 선택

### 설명

`selectable` prop을 전달하면 테이블 첫 번째 컬럼에 체크박스가 추가된다. 헤더 체크박스로 현재 페이지 전체를 일괄 선택/해제할 수 있으며, 선택된 행 배열을 `onSelectionChange` 콜백으로 전달한다. 페이지 변경 시 선택 상태는 초기화된다.

**수정 파일:**

- `DataTable.tsx` — `selectedRows` 상태 + 페이지 변경 시 초기화 로직
- `DataTableBody.tsx` — 체크박스 컬럼 렌더 분기
- `DataTable.type.ts` — `selectable`, `onSelectionChange` prop 추가
- `DataTable.stories.tsx` — Selectable / SelectableWithPagination 스토리 추가
- `DataTable.test.tsx` — 행 선택 테스트 추가

### 완료 조건 (Acceptance Criteria)

**AC-6-1: selectable 없으면 체크박스 컬럼 미렌더**

- **Given** `selectable`을 전달하지 않았을 때
- **When** DataTable이 마운트되면
- **Then** thead와 tbody 어디에도 체크박스가 렌더되지 않는다

**AC-6-2: selectable 있으면 첫 번째 컬럼에 체크박스 추가**

- **Given** `selectable`, `data`(3행), `columns`를 전달했을 때
- **When** DataTable이 마운트되면
- **Then** 헤더 행 첫 번째 셀에 체크박스가 렌더되고, 데이터 행 각각 첫 번째 셀에도 체크박스가 렌더된다

**AC-6-3: 개별 행 체크 시 onSelectionChange 호출**

- **Given** `selectable`, `onSelectionChange={mockFn}`, `data=[row1, row2, row3]`을 전달하고 DataTable이 마운트된 상태에서
- **When** `row1`의 체크박스를 클릭하면
- **Then** `mockFn`이 `[row1]` 배열과 함께 호출된다

**AC-6-4: 헤더 체크박스 — 전체 선택**

- **Given** `selectable`, `onSelectionChange={mockFn}`, `data=[row1, row2, row3]`을 전달하고 DataTable이 마운트된 상태에서
- **When** 헤더 체크박스를 클릭하면
- **Then** `mockFn`이 `[row1, row2, row3]` 배열과 함께 호출된다

**AC-6-5: 헤더 체크박스 — 전체 해제**

- **Given** `selectable`, `data=[row1, row2]`이고 전체 선택 상태에서
- **When** 헤더 체크박스를 다시 클릭하면
- **Then** `onSelectionChange`가 빈 배열 `[]`과 함께 호출된다

**AC-6-6: 페이지 변경 시 선택 상태 초기화**

- **Given** `selectable`, `pagination={{ totalPages: 3, onPageChange: mockFn }}`, `data=[row1, row2]`이고 `row1`이 선택된 상태에서
- **When** Pagination에서 2페이지를 클릭하면
- **Then** 선택된 행이 초기화되어 `onSelectionChange`가 빈 배열 `[]`과 함께 호출된다
