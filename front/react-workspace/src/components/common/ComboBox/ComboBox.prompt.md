# 요구사항

아래의 조건을 모두 적용하여, 커서 룰을 준수하고 요구사항을 모두 구현할 것.  
작업이 끝나면 해당 rules 적용 결과를 체크리스트로 반환할 것.

# 컴포넌트 경로

`src/components/common/Combobox`

# 핵심 요구사항 (variant 시스템)

사용자가 입력 필드에 텍스트를 입력할 수 있어야 한다.

1. 드롭다운 목록은 사용자의 입력에 따라 실시간으로 필터링되어야 한다.
2. 드롭다운 목록에 없는 검색어를 입력 했을때 foucs out 되면 초기화 되어야 한다.

단일 책임 원칙에 따라 Combobox component, ComboboxItem component 분리해서 컴포넌트를 생성한다.
다음 조건을 모두 만족하는 variant 시스템을 구현해야 한다.

구조는 다음 같은 구조를 만족해야 한다.

```react
<Combobox>
    <ComboboxItem value='0001'>딸기</ComboboxItem>
    <ComboboxItem value='0002'>바나나</ComboboxItem>
    <ComboboxItem value='0003'>수박</ComboboxItem>
</Combobox>
```

## Select

- `placeholder`: string
- `limit`: number (기본값 : 5) - 목록에 표시할 최대 항목 수
- `defaultValue`: string
- `disabled`: boolean (기본 `false`)
- `size`: `'sm' | 'md' | 'lg'` (기본 `'md'`)

## SelectItem

- `value`: string
- `disabled`: boolean (기본 `false`)
- `textValue`: string

# 필드 UI (라벨·에러)

- **label**: string — 있으면 `<label htmlFor={inputId}>`로 렌더링.
- **error**: string — 있으면 input 하단에 `<span role="alert">`로 에러 메시지 표시, input에 에러 스타일 및 `aria-invalid`, `aria-describedby` 연결.
- **required**: boolean — `true`이면 라벨 옆에 ` *` 표시.

# React Hook Form (RHF) 연동

- **비제어**: `value`를 넘기지 않으면 비제어로 동작. `{...register('name')}`와 호환.
- **사용 패턴**: `{...register('fieldName', { required: '메시지' })}` 스프레드 후 `error={errors.fieldName?.message}` 전달.
- **onChange**: 네이티브 `onChange` 지원으로 RHF `register()`와 호환. 추가로 `onValueChange?: (value: string) => void` 제공(간단 setState 패턴용).

# 완료 시 산출물

작업 종료 후 공통 컴포넌트 룰(common-component-rule.mdc) 적용 결과를 체크리스트로 반환할 것.

---

## Design Token Reference

- **타이포**: `textCombinations.label` (라벨), `textCombinations.bodySm` (에러 메시지)
- **색상**: CSS Module 내 `var(--border)` (기본 테두리), `var(--ring)` (포커스 링), `var(--destructive)` (에러), `var(--card)` (드롭다운 배경)
- **스페이싱**: CSS Module 내 `var(--spacing-sm)` (트리거 패딩), `var(--radius)` (트리거 반경), `var(--shadow-base)` (드롭다운 섀도우)
- **z-index**: `zIndex.dropdown` (1000) — 드롭다운 리스트박스에 적용
- **직접 import**: `textCombinations` from `@/styles`
- 참고: `docs/design/components.md#입력-필드`, `docs/design/spacing.md`
