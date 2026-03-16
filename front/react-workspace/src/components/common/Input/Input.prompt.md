# 요구사항

아래의 조건을 모두 적용하여, 커서 룰을 준수하고 요구사항을 모두 구현할 것.  
작업이 끝나면 해당 rules 적용 결과를 체크리스트로 반환할 것.

# 컴포넌트 경로

`src/components/common/Input`

# 핵심 요구사항 (variant 시스템)

다음 조건을 모두 만족하는 variant 시스템을 구현할 것.

- `type`: string (기본 `'text'`)
- `placeholder`: string
- `variant`: `'primary' | 'secondary' | 'tertiary'` (기본 `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (기본 `'md'`)
- `disabled`: boolean (기본 `false`)
- `readOnly`: boolean (기본 `false`)

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
