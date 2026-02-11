# Select 컴포넌트

React Hook Form과 완벽하게 통합된 Select(드롭다운) 컴포넌트입니다.

## 주요 기능

- **Floating UI**: 안정적인 드롭다운 포지셔닝
- **검색 기능**: 옵션 검색 및 하이라이트 (debounce 적용)
- **키보드 네비게이션**: 화살표 키, Enter, Escape 지원
- **접근성**: ARIA 속성 완벽 지원
- **성능 최적화**: 메모이제이션 및 불필요한 리렌더링 방지
- **타입 안전성**: 제네릭 타입 지원

## 기본 Select

기본 Select 컴포넌트는 React Hook Form Controller와 직접 사용할 수 있도록 설계되었습니다.

```typescript
import { Select } from '@/common/components/ui/select'

// 기본 사용법
<Select
  value={selectedValue}
  onChange={setSelectedValue}
  options={[
    { label: '옵션 1', value: '1' },
    { label: '옵션 2', value: '2' },
    { label: '옵션 3', value: '3' },
  ]}
  label="선택 항목"
  placeholder="선택해주세요"
  error={error}
/>

// React Hook Form과 직접 사용
<Controller
  name="region"
  control={control}
  rules={{ required: '지역을 선택해주세요' }}
  render={({ field, fieldState }) => (
    <Select
      {...field}
      options={regionOptions}
      label="지역"
      error={fieldState.error?.message}
    />
  )}
/>
```

## FormSelect (React Hook Form Adapter)

`FormSelect`는 React Hook Form Controller를 내부에 감추고 간결한 API를 제공하는 Adapter 패턴 컴포넌트입니다.

### 장점

- **간결한 코드**: Controller를 직접 사용할 필요가 없습니다
- **타입 안전성**: 완벽한 TypeScript 타입 지원
- **자동 에러 처리**: 유효성 검증 결과를 자동으로 표시
- **일관된 사용법**: 프로젝트 전반에서 일관된 패턴

### 기본 사용법

```typescript
import { FormSelect } from '@/common/components/ui/select'

function MyForm() {
  const { control, handleSubmit } = useForm<{
    region: string
    category: string
  }>()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSelect
        name="region"
        control={control}
        options={regionOptions}
        label="지역 선택"
        rules={{ required: '지역을 선택해주세요' }}
        searchable
      />

      <FormSelect
        name="category"
        control={control}
        options={categoryOptions}
        label="카테고리"
        placeholder="카테고리를 선택해주세요"
      />
    </form>
  )
}
```

### 초기값 설정

```typescript
const { control } = useForm({
  defaultValues: {
    region: 'seoul',
    category: 'tech',
  },
})
```

## Props

### SelectProps

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `options` | `SelectOption<T>[]` | **필수** | 선택 가능한 옵션 목록 |
| `value` | `T` | `undefined` | 선택된 값 |
| `onChange` | `(value: T) => void` | `undefined` | 값 변경 콜백 |
| `placeholder` | `string` | `'선택해주세요'` | 플레이스홀더 텍스트 |
| `label` | `string` | `undefined` | 라벨 텍스트 |
| `error` | `string` | `undefined` | 에러 메시지 |
| `required` | `boolean` | `false` | 필수 여부 표시 |
| `disabled` | `boolean` | `false` | 비활성화 여부 |
| `name` | `string` | `undefined` | input name 속성 |
| `className` | `string` | `undefined` | 추가 CSS 클래스 |
| `searchable` | `boolean` | `false` | 검색 기능 활성화 |
| `searchPlaceholder` | `string` | `'검색...'` | 검색창 플레이스홀더 |
| `emptyMessage` | `string` | `'검색 결과가 없습니다'` | 검색 결과 없을 때 메시지 |
| `maxHeight` | `string` | `'300px'` | 드롭다운 최대 높이 |

### FormSelectProps

`FormSelect`는 위의 모든 Props에 추가로 다음을 지원합니다:

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | `Path<TFieldValues>` | **필수** | React Hook Form 필드 이름 |
| `control` | `Control<TFieldValues>` | **필수** | React Hook Form 컨트롤러 |
| `rules` | `RegisterOptions` | `undefined` | 유효성 검증 규칙 |
| `shouldUnregister` | `boolean` | `false` | 언마운트 시 필드 등록 해제 여부 |

### SelectOption

```typescript
interface SelectOption<T = string> {
  label: string      // 표시될 텍스트
  value: T           // 실제 값
  disabled?: boolean // 비활성화 여부
}
```

## 사용 예제

### 검색 가능한 Select

```typescript
<FormSelect
  name="city"
  control={control}
  options={cityOptions}
  label="도시 선택"
  searchable
  searchPlaceholder="도시명을 입력하세요"
  rules={{ required: '도시를 선택해주세요' }}
/>
```

### 비활성화된 옵션

```typescript
<FormSelect
  name="status"
  control={control}
  options={[
    { label: '활성', value: 'active' },
    { label: '비활성', value: 'inactive', disabled: true },
    { label: '대기', value: 'pending' },
  ]}
  label="상태"
/>
```

### 숫자 값 사용

```typescript
<FormSelect<FormData, number>
  name="pageSize"
  control={control}
  options={[
    { label: '10개', value: 10 },
    { label: '20개', value: 20 },
    { label: '50개', value: 50 },
  ]}
  label="페이지당 항목 수"
/>
```

### 커스텀 타입 값

```typescript
interface User {
  id: string
  name: string
}

<FormSelect<FormData, User>
  name="assignee"
  control={control}
  options={users.map(user => ({
    label: user.name,
    value: user,
  }))}
  label="담당자"
/>
```

## 키보드 네비게이션

- **Space / Enter**: 드롭다운 열기
- **↑ / ↓**: 옵션 이동
- **Enter**: 선택
- **Escape**: 닫기
- **Tab**: 닫고 다음 필드로 이동

## 접근성

- ARIA 속성 완벽 지원 (`role`, `aria-expanded`, `aria-haspopup`, `aria-activedescendant` 등)
- 키보드 네비게이션 지원
- 스크린 리더 지원
- 포커스 관리

## 성능 최적화

- **Debounce**: 검색어 입력 시 300ms debounce 적용
- **Memoization**: `useMemo`, `useCallback`으로 불필요한 리렌더링 방지
- **가상화**: 대용량 옵션 리스트에 대한 가상화 지원 (향후 추가 예정)

## 스타일링

컴포넌트는 CSS Module을 사용하며, 디자인 시스템 토큰을 활용합니다.
커스텀 스타일이 필요한 경우 `className` prop을 사용하세요.

```typescript
<FormSelect
  name="region"
  control={control}
  options={options}
  className="my-custom-select"
/>
```

## 주의사항

- `options` 배열은 메모이제이션하는 것이 좋습니다 (불필요한 리렌더링 방지)
- 대용량 옵션 리스트(100개 이상)의 경우 `searchable` 활성화를 권장합니다
- `value`의 타입은 `option.value`의 타입과 일치해야 합니다

## 참고

- [Checkbox 컴포넌트](../checkbox/README.md)
- [DatePicker 컴포넌트](../datePicker/README.md)
- [RadioGroup 컴포넌트](../radio/README.md)



