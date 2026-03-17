# 요구사항

아래의 조건을 모두 적용하여, 커서 룰을 준수하고 요구사항을 모두 구현할 것.  
작업이 끝나면 해당 rules 적용 결과를 체크리스트로 반환할 것.

# 컴포넌트 경로

`src/components/common/RadioGroup`

# 핵심 요구사항 (variant 시스템)

단일 책임 원칙에 따라 RadioGroup component, RadioGroupItem component 분리해서 컴포넌트를 생성한다.
다음 조건을 모두 만족하는 variant 시스템을 구현해야 한다.

구조는 다음 같은 구조를 만족해야 한다.

```react
<RadioGroup>
    <RadioGroupItem value='0001'>딸기</RadioGroupItem>
    <RadioGroupItem value='0002'>바나나</RadioGroupItem>
    <RadioGroupItem value='0003'>수박</RadioGroupItem>
</RadioGroup>
```

## RadioGroup

- `defaultValue`: string
- `disabled`: boolean (기본 `false`)
- `size`: `'sm' | 'md' | 'lg'` (기본 `'md'`)
- `orientation`: 'horizontal' | 'vertical' (기본 `'horizontal'`)

## RadioGroupItem

- `value`: string
- `disabled`: boolean (기본 `false`)
- `textValue`: string

# React Hook Form (RHF) 연동

- **비제어**: `value`를 넘기지 않으면 비제어로 동작. `{...register('name')}`와 호환.
- **사용 패턴**: `{...register('fieldName', { required: '메시지' })}` 스프레드 후 `error={errors.fieldName?.message}` 전달.
- **onChange**: 네이티브 `onChange` 지원으로 RHF `register()`와 호환. 추가로 `onValueChange?: (value: string) => void` 제공(간단 setState 패턴용).

# 완료 시 산출물

작업 종료 후 공통 컴포넌트 룰(common-component-rule.mdc) 적용 결과를 체크리스트로 반환할 것.
