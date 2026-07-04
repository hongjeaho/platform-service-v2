# Design System — Components

> 구현: `src/components/common/` — 각 컴포넌트 폴더 내 `.prompt.md` 참고
> 신규 컴포넌트 생성: `/ds-gen ComponentName` 커맨드 사용

---

## 버튼 의미 구분

| variant       | 색상                             | 언제 사용                                             |
| ------------- | -------------------------------- | ----------------------------------------------------- |
| `primary`     | Bright Blue + 컬러 글로우 섀도우 | **확정 액션**: 제출, 확인, 저장, 승인                 |
| `accent`      | 밝은 Blue                        | **일반 액션**: 수정, 조회, 검색, 다운로드             |
| `outline`     | 투명 + border                    | **취소** (비최종)                                     |
| `destructive` | Red + 컬러 글로우 섀도우         | **최종 삭제/반려**: 삭제, 반려, 최종취소              |
| `ghost`       | 투명                             | **맥락 내 보조** 액션, 아이콘 전용 버튼(케밥 메뉴 등) |

```tsx
import { buttonVariants } from '@/styles'

// 한 폼에 primary는 반드시 하나만
<button className={buttonVariants.primary}>저장</button>
<button className={buttonVariants.outline}>취소</button>
```

아이콘 전용 버튼은 `icon` prop만 전달하고 `children`은 `null`을 넘깁니다(타입상 `children`이 필수이므로). 반드시 `aria-label`을 함께 전달하세요.

```tsx
<Button variant='ghost' size='sm' icon={<icons.more />} aria-label={`${row.name} 행 작업 메뉴`}>
  {null}
</Button>
```

---

## 상태 칩 (Status Chip)

```tsx
import { statusChipVariants } from '@/styles'

// border-radius: 9999px 고정 (pill 형태만 허용)
<span className={statusChipVariants['접수']}>접수</span>
<span className={statusChipVariants['검토중']}>검토중</span>
<span className={statusChipVariants['완료']}>완료</span>
<span className={statusChipVariants['반려']}>반려</span>
<span className={statusChipVariants['보류']}>보류</span>
```

---

## 카드

- 배경: `var(--card)` (흰색)
- 반경: `var(--radius-lg)` (20px) — 일반 버튼/입력(`--radius`, 14px)보다 한 단계 더 둥긂
- 섀도우: `var(--shadow-base)`, hover 시 `var(--shadow-md)`

---

## 입력 필드

- 반경: `var(--radius)` (14px). Select/ComboBox 등 드롭다운형은 `var(--radius-md)` (16px)
- 포커스 링: 2px, `var(--ring)` (Primary Blue)
- 에러 테두리: `var(--destructive)`
- RHF `register()` 스프레드 호환 필수

---

## 모달 (AlertDialog)

- 반경: `var(--radius-lg)` (20px, 카드와 동일 — 모달도 "대형 표면"으로 취급)
- 섀도우: `var(--shadow-modal)` (일반 카드보다 깊은 전용 섀도우)

---

## 데이터 테이블 (DataTable)

- 헤더 배경: `var(--surface-container-highest)`
- 셀 텍스트: `textCombinations.bodySm`
- 테두리: `1px solid var(--border)` (최소화)
- 행 선택: `selectable` prop — 체크박스 컬럼(전체 선택 헤더 포함)은 이미 구현·테스트되어 있음
- **엔터프라이즈 대시보드 패턴**(아바타+이름 셀, 상태 칩 셀, 케밥 액션 컬럼)은 새 prop 없이 기존 `columns[].render` 확장점만으로 구현합니다 — `DataTable.stories.tsx`의 `EnterpriseDashboardPattern` 스토리 참고

```tsx
const columns: ColumnDef<Row>[] = [
  {
    key: 'name',
    header: '신청인',
    render: (_v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
        <span /* 아바타 원형 배지 */ />
        {row.name}
      </div>
    ),
  },
  {
    key: 'status',
    header: '상태',
    render: v => <span className={statusChipVariants[v]}>{v}</span>,
  },
  {
    key: 'id',
    header: '',
    width: '2.5rem',
    render: (_v, row) => (
      <Button
        variant='ghost'
        size='sm'
        icon={<icons.more />}
        aria-label={`${row.name} 행 작업 메뉴`}
      >
        {null}
      </Button>
    ),
  },
]
```

---

## AppShell (Sidebar + Topbar)

`components/layout/AppShell/` — 실제 화면을 조립하는 앱 셸. `app/router.tsx`의 최상위 레이아웃 라우트로 연결되어 있습니다.

- **도메인 로직을 포함하지 않습니다** — nav 항목(`sections: NavSection[]`)과 브레드크럼은 호출부(현재는 `app/router.tsx`)가 props/config로 주입합니다.
- `Sidebar`의 active 상태는 `react-router`의 `NavLink`(`end` 옵션)가 자동으로 `aria-current="page"`를 부여합니다 — 수동 상태 관리 없음.
- `Topbar`의 검색/알림 버튼은 아이콘 전용 `Button`(`ghost`, `aria-label` 필수)입니다.

```tsx
import { AppShell } from '@/components/layout/AppShell'
import type { NavSection } from '@/components/layout/AppShell'

const sections: NavSection[] = [
  { items: [{ label: '대시보드', to: '/', icon: icons.home }] },
  { label: '사건', items: [{ label: '전체 사건', to: '/cases', icon: icons.folder }] },
]

<AppShell
  brand={{ label: '토지수용위원회' }}
  sections={sections}
  profile={{ name: '김민준', role: '심사관' }}
  breadcrumb={<span>사건관리 › 전체 목록</span>}
/>
```

---

## 대시보드 위젯

`components/common/KpiCard/`, `MiniBarChart/`, `ActivityFeed/` — 대시보드 화면 조립용 프레젠테이셔널 위젯. 셋 다 `--radius-lg` + `--shadow-base` 카드 표면을 공유합니다.

```tsx
import { ActivityFeed } from '@/components/common/ActivityFeed'
import { KpiCard } from '@/components/common/KpiCard'
import { MiniBarChart } from '@/components/common/MiniBarChart'

<KpiCard label='전체 신청' value='128건' trend={{ direction: 'up', label: '12%' }} />
<MiniBarChart title='주간 처리 현황' data={[{ label: '월', value: 38 }, /* ... */]} />
<ActivityFeed
  title='최근 활동'
  items={[{ id: 1, tone: 'success', text: <><b>이준혁</b> 사건이 완료되었습니다</>, time: '5분 전' }]}
/>
```

`KpiCard`의 `trend.direction`만 검증된 동작입니다(up=success 톤, down=danger 톤). `MiniBarChart`/`ActivityFeed`는 순수 프레젠테이셔널이라 Storybook으로만 확인합니다.

---

## 필터바 패턴 (조합 패턴 — 별도 컴포넌트 없음)

검색 입력 + 필터 칩 + 프라이머리 액션 조합은 기존 `Input`/`Button`만으로 충분해 새 컴포넌트를 만들지 않았습니다. 리스트 화면(예: DataTable 위) 상단에 다음과 같이 조합하세요.

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
  <Input placeholder='검색' size='sm' />
  <Button variant='outline' size='sm'>
    상태: 전체
  </Button>
  <div style={{ flex: 1 }} />
  <Button variant='primary' size='sm' icon={<icons.add />}>
    신규 등록
  </Button>
</div>
```

---

## Do / Don't

### Do

- 한 폼에 `primary` 버튼 **하나**만
- 아이콘 전용 버튼에 `aria-label` 필수, `children`은 `null`
- 카드 섀도우는 `var(--shadow-base)`, 모달은 `var(--shadow-modal)` 사용
- 상태 칩은 pill 형태(`border-radius: 9999px`)만
- AppShell의 nav 항목은 항상 props로 주입 (하드코딩 금지)
- DataTable에 새로운 시각 패턴이 필요하면 먼저 `columns[].render` 확장점으로 가능한지 검토 (새 prop 추가는 최후 수단)

### Don't

- Primary 버튼을 한 화면에 2개 이상 사용 금지
- 상태 칩에 pill 이외의 반경 사용 금지
- 카드에 `--shadow-2xl` 사용 금지 (모달도 전용 `--shadow-modal` 사용, `--shadow-2xl` 아님)
- 공통 컴포넌트에 `className` prop 전달 금지 (인터페이스에서 제외됨)
- `components/layout/`에 도메인 전용 로직/API 호출 작성 금지
