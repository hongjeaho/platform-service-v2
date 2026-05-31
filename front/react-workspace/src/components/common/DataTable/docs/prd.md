# PRD — DataTable 공통 컴포넌트

## 1. 개요

### 배경

API 응답 데이터를 화면에 표시하는 테이블 UI는 여러 도메인 페이지에서 반복적으로 구현되고 있다.
각 페이지마다 로딩·에러·빈 데이터 처리를 개별 구현하면 일관성이 떨어지고 유지 비용이 증가한다.

### 목적

`Table` · `Pagination` 공통 컴포넌트를 내부에서 조합하여, **로딩·에러·빈 데이터·페이지네이션 상태를 통합 관리하는 래퍼 컴포넌트** `DataTable`을 제공한다.
호출부는 데이터·컬럼 정의·상태 플래그만 전달하면 일관된 UI를 얻는다.

### 성공 기준

- 신규 목록 페이지 개발 시 `DataTable` 하나로 테이블 전체를 구성할 수 있다.
- 로딩·에러·빈 데이터 상태 UI가 모든 사용처에서 동일하게 표시된다.
- `<table>` 직접 작성 없이 `ColumnDef` 배열만으로 컬럼 구성이 완료된다.

---

## 2. 사용자 스토리

### US-01 데이터 표시

> 개발자로서, `data`와 `columns`를 전달하면 테이블이 즉시 렌더되기를 원한다.
> 그래야 매번 `<table>` 구조를 직접 작성하지 않아도 된다.

**인수 조건**

- `data` 배열의 각 항목이 `columns`에 정의된 `key`로 셀에 렌더된다.
- `render` 함수가 있으면 해당 함수의 반환값으로 셀을 렌더한다.
- `render`가 없으면 값을 문자열로 그대로 표시한다.

### US-02 로딩 상태

> 개발자로서, `isLoading: true`일 때 스켈레톤 UI가 표시되기를 원한다.
> 그래야 API 응답 전 레이아웃 이동(Layout Shift) 없이 사용자 경험을 유지할 수 있다.

**인수 조건**

- 헤더는 정상 렌더, tbody 영역만 스켈레톤 행으로 대체된다.
- 스켈레톤 행 수는 `pageSize`와 동일하다 (기본값 10).

### US-03 에러 상태

> 개발자로서, `isError: true`일 때 에러 메시지와 재시도 버튼이 표시되기를 원한다.
> 그래야 사용자가 직접 데이터를 다시 불러올 수 있다.

**인수 조건**

- 에러 상태는 `isLoading`보다 우선 처리된다.
- tbody 전체 영역에 에러 메시지 "데이터를 불러오지 못했습니다."가 표시된다.
- `onRetry` prop이 있을 때만 [다시 시도] 버튼이 표시된다.

### US-04 빈 데이터 상태

> 개발자로서, `data`가 빈 배열일 때 빈 메시지가 표시되기를 원한다.
> 그래야 사용자가 데이터 없음을 명확히 인지할 수 있다.

**인수 조건**

- tbody 중앙에 `emptyMessage` 텍스트가 표시된다.
- `emptyMessage` 미지정 시 기본값 "데이터가 없습니다."를 표시한다.

### US-05 페이지네이션

> 개발자로서, `pagination` prop을 선언하면 페이지 탐색 UI가 자동으로 표시되기를 원한다.
> 그래야 페이지 상태 관리 로직을 직접 작성하지 않아도 된다.

**인수 조건**

- `pagination` prop이 없으면 Pagination 컴포넌트를 렌더하지 않는다.
- `pagination` prop이 있으면 DataTable 내부에서 `currentPage` 상태를 관리한다.
- 페이지 변경 시 `onPageChange(page)` 콜백을 호출한다.
- `totalPages`로 전체 페이지 수를 전달한다.

### US-06 커스텀 셀 렌더링

> 개발자로서, 특정 컬럼에 링크·버튼·날짜 포맷 등 커스텀 UI를 삽입하고 싶다.
> 그래야 `DataTable` 안에서도 행 단위 인터랙션을 구현할 수 있다.

**인수 조건**

- `ColumnDef.render(value, row)` 함수로 셀에 임의의 ReactNode를 반환할 수 있다.
- `row` 전체 객체를 참조할 수 있어 다른 필드 기반 로직도 구현 가능하다.

### US-07 행 선택 (선택적)

> 개발자로서, 필요한 경우 체크박스로 다중 행을 선택하고 선택된 행 목록을 받고 싶다.
> 그래야 일괄 삭제·일괄 처리 등 선택 기반 액션을 구현할 수 있다.

**인수 조건**

- `selectable` prop이 없으면 체크박스 컬럼을 렌더하지 않는다.
- `selectable` prop이 있으면 테이블 첫 번째 컬럼에 체크박스가 추가된다.
- 헤더 체크박스로 현재 페이지 전체 행을 일괄 선택/해제할 수 있다.
- `onSelectionChange(selectedRows: T[])` 콜백으로 선택된 행 배열을 호출부에 전달한다.
- 페이지 변경 시 선택 상태는 초기화된다.

---

## 3. 아키텍처 결정

### Context

목록 페이지들이 로딩·에러·빈 데이터 분기, 테이블 조합, 페이지네이션을 각자 반복 구현하고 있다. 이를 `DataTable` 공통 컴포넌트로 통합하면서, **tbody 상태 분기 로직**을 어디에 둘 것인지가 핵심 설계 결정이다.

단순 구현(Flat Monolith)은 파일 하나로 빠르게 완성할 수 있지만, 상태 분기 코드가 메인 파일에 누적될수록 변경 범위 예측이 어려워진다. 반면 컬럼 헬퍼 함수(Column Factory)는 확장성이 높지만, selectable·sortable 같은 컬럼 단위 기능이 확정되지 않은 현 시점에서는 불필요한 복잡도를 추가한다.

---

### Decision

**안 B (내부 파일 분리형)** 을 기본으로 채택한다. `DataTable.tsx`(조합·상태)와 `DataTableBody.tsx`(상태별 분기), `DataTableSkeleton.tsx`(스켈레톤 행)으로 역할을 분리한다. 외부 인터페이스는 단일 `DataTable` 컴포넌트로 노출하며, 내부 서브 파일은 `index.ts`에서 export하지 않는다.

향후 selectable·sortable 등 컬럼 단위 기능이 2가지 이상 확정되면, `columns.ts` 헬퍼 함수를 추가하는 **안 C로 점진적으로 확장**한다. 이 시점에 ColumnDef 타입에 `type` 판별자를 도입한다.

```
DataTable/
├── DataTable.tsx         ← 조합 + 상태 (currentPage, selectedRows)
├── DataTableBody.tsx     ← tbody 상태별 분기 전담 (error → loading → empty → data)
├── DataTableSkeleton.tsx ← 스켈레톤 행 전담
├── DataTable.type.ts
├── DataTable.module.css
├── DataTable.stories.tsx
├── DataTable.test.tsx
└── index.ts              ← DataTable만 export
```

---

### Alternatives

**안 A (Flat Monolith) — 거부**
DataTable.tsx 단일 파일에 모든 분기·상태를 담는 방식. 초기 구현은 가장 빠르다. 그러나 selectable, 추가 상태 조건 등 기능이 붙을수록 분기 코드가 한 파일에 누적된다. tbody 스켈레톤 UI를 변경하더라도 DataTable.tsx 전체를 열어야 하고, 단위 테스트에서 분기 케이스를 하나의 describe에 모두 작성해야 한다. 현재 요구사항 수준에서는 수용 가능하지만, selectable 기능이 이미 확정된 시점에서 변경 범위 예측이 불충분하다고 판단해 제외한다.

**안 C (Column Factory) — 현 시점 보류**
`createColumn` / `createSelectionColumn` 헬퍼 함수와 `type` 판별자를 도입해 컬럼 단위 기능을 캡슐화하는 방식. 확장성이 가장 높다. 그러나 현재 확정된 컬럼 단위 기능은 selectable 하나뿐이다. 헬퍼 함수 API를 설계하고, ColumnDef 타입에 유니온을 추가하고, 호출부가 createColumn 사용법을 학습해야 한다. 이 비용 대비 현 시점의 이득이 크지 않다. selectable·sortable 등 2가지 이상 확정 시점에 안 B에서 안 C로 전환한다.

---

### Consequences

**장점**

- `DataTableBody.tsx`가 상태별 분기(error / loading / empty / data)를 단독 담당하므로, 스켈레톤 UI나 에러 메시지 변경 시 수정 파일이 명확하다.
- `DataTableSkeleton.tsx`를 독립 테스트할 수 있어, 스켈레톤 행 수·컬럼 수 검증이 `DataTable` 전체를 마운트하지 않아도 가능하다.
- 외부 인터페이스는 `DataTable` 단일 컴포넌트로 유지되어, 호출부 변경 없이 내부 구조를 개선할 수 있다.
- 안 C로의 전환 경로가 열려 있다. `columns.ts` 파일 추가와 ColumnDef 타입 확장만으로 헬퍼 함수를 도입할 수 있고, 기존 plain object 컬럼 정의와 하위 호환이 가능하다.

**단점**

- 안 A 대비 파일 수가 3개(`DataTableBody`, `DataTableSkeleton`, 기존 대비 추가) 늘어난다. DataTable 하나를 이해하려면 여러 파일을 함께 읽어야 한다.
- `DataTableBody`에 전달해야 할 props가 많다 (`columns`, `data`, `isLoading`, `isError`, `pageSize`, `selectable`, `selectedRows`, `onSelectionChange`). props drilling이 발생하며, 향후 기능 추가 시 인터페이스가 더 넓어질 수 있다.
- 안 C로 전환하는 시점에 ColumnDef 타입 변경이 모든 호출부에 영향을 미친다. 전환 비용을 최소화하려면 `type` 판별자 도입 전 호출부 현황을 파악해야 한다.

---

## 4. Out of Scope

- **행 클릭 이벤트**: 행 단위 `onClick` 핸들러를 지원하지 않는다. 셀 내 인터랙션은 `render` 함수로 직접 구현한다.
- **컬럼 정렬**: 컬럼 헤더 클릭을 통한 정렬 기능을 제공하지 않는다.
- **API 직접 호출**: DataTable 내부에서 API를 호출하지 않는다. 데이터는 항상 외부(TanStack Query)에서 주입한다.
- **총 건수(totalCount) 표시**: 페이지 하단 또는 헤더에 전체 데이터 건수를 표시하지 않는다.
- **무한 스크롤**: 페이지네이션 방식만 지원하며, 무한 스크롤은 범위 밖이다.
- **추가 라이브러리**: 신규 npm 패키지 설치 없이 기존 공통 컴포넌트만 조합한다.

---

## 5. 용어 정의

| 용어                  | 정의                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **DataTable**         | 이 PRD에서 정의하는 공통 래퍼 컴포넌트. `Table` + `Pagination`을 조합하고 상태를 관리한다.        |
| **ColumnDef\<T\>**    | 컬럼 하나를 정의하는 설정 객체. `key`, `header`, `width`, `align`, `render`로 구성된다.           |
| **pageSize**          | 한 페이지에 표시할 행 수. 스켈레톤 행 수에도 동일하게 적용된다. 기본값 10.                        |
| **currentPage**       | DataTable 내부에서 관리하는 현재 페이지 번호 상태. 1부터 시작한다.                                |
| **totalPages**        | API 응답 `meta.totalPages`에서 유래한 전체 페이지 수. Pagination 컴포넌트에 전달된다.             |
| **스켈레톤 행**       | 로딩 중 레이아웃을 유지하기 위해 실제 데이터 행 자리에 표시하는 플레이스홀더 UI.                  |
| **Layout Shift**      | 콘텐츠 로드 전후로 레이아웃이 밀리는 현상. 스켈레톤 행으로 방지한다.                              |
| **render 함수**       | `ColumnDef.render(value, row)`로 정의하는 셀 커스텀 렌더러. ReactNode를 반환한다.                 |
| **onRetry**           | 에러 상태에서 [다시 시도] 버튼 클릭 시 호출되는 콜백. 보통 TanStack Query의 `refetch`를 전달한다. |
| **selectable**        | 행 선택 기능 활성화 여부. 이 prop이 있을 때만 체크박스 컬럼이 렌더된다.                           |
| **onSelectionChange** | 선택된 행 배열을 호출부에 전달하는 콜백. `selectable` 사용 시 함께 전달한다.                      |
