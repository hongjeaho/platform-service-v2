# Checkbox 컴포넌트

React Hook Form과 완벽하게 통합된 체크박스 컴포넌트입니다.

## 기본 Checkbox

기본 체크박스 컴포넌트는 React Hook Form Controller와 직접 사용할 수 있도록 설계되었습니다.

```typescript
import { Checkbox } from '@/common/components/ui/checkbox'

// 기본 사용법
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="동의합니다"
  description="약관에 동의해야 합니다"
  error={error}
/>

// React Hook Form과 직접 사용
<Controller
  name="agree"
  control={control}
  rules={{ required: '약관에 동의해야 합니다' }}
  render={({ field, fieldState }) => (
    <Checkbox
      {...field}
      label="이용약관 동의"
      error={fieldState.error?.message}
    />
  )}
/>
```

## FormCheckbox (React Hook Form Adapter)

`FormCheckbox`는 React Hook Form Controller를 내부에 감추고 간결한 API를 제공하는 Adapter 패턴 컴포넌트입니다.

### 장점

- **간결한 코드**: Controller를 직접 사용할 필요가 없습니다
- **타입 안전성**: 완벽한 TypeScript 타입 지원
- **자동 에러 처리**: 유효성 검증 결과를 자동으로 표시
- **일관된 사용법**: 프로젝트 전반에서 일관된 패턴

### 기본 사용법

```typescript
import { FormCheckbox } from '@/common/components/ui/checkbox'

function MyForm() {
  const { control, handleSubmit } = useForm<{
    agree: boolean
    newsletter: boolean
  }>()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCheckbox
        name="agree"
        control={control}
        rules={{ required: '약관에 동의해야 합니다' }}
        label="약관 동의"
      />

      <FormCheckbox
        name="newsletter"
        control={control}
        label="뉴스레터 구독"
        description="중요한 업데이트를 받아보세요"
      />
    </form>
  )
}
```

### 초기값 설정

```typescript
const { control } = useForm({
  defaultValues: {
    agree: true,
    newsletter: false
  }
})
```

### 유효성 검증

```typescript
<FormCheckbox
  name="terms"
  control={control}
  rules={{
    required: '이용약관에 동의해야 합니다',
    validate: (value) => value || '약관에 동의해주세요'
  }}
  label="이용약관 동의"
/>
```

### 조건부 렌더링

```typescript
<FormCheckbox
  name="marketing"
  control={control}
  label="마케팅 정보 수신"
  disabled={!user.isEmailVerified}
  indeterminate={someSelectedButNotAll}
/>
```

## Props

### Checkbox Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|----------|------|
| checked | boolean | false | 체크 상태 |
| onChange | (checked: boolean) => void | - | 체크 상태 변경 콜백 |
| label | string | - | 라벨 텍스트 |
| description | string | - | 설명 텍스트 |
| error | string | - | 에러 메시지 |
| indeterminate | boolean | false | 부분 선택 상태 |
| disabled | boolean | false | 비활성화 상태 |

### FormCheckbox Props

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | Path\<TFieldValues\> | ✓ | 폼 필드 이름 |
| control | Control\<TFieldValues\> | ✓ | RHF 컨트롤러 |
| rules | RegisterOptions | - | 유효성 검증 규칙 |
| shouldUnregister | boolean | false | 컴포넌트 언등록 여부 |
| label | string | - | 라벨 텍스트 |
| description | string | - | 설명 텍스트 |
| disabled | boolean | false | 비활성화 상태 |
| indeterminate | boolean | false | 부분 선택 상태 |

## 사용 예시

### 회원가입 폼

```typescript
function SignupForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<{
    terms: boolean
    privacy: boolean
    marketing: boolean
  }>({
    mode: 'onChange'
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCheckbox
        name="terms"
        control={control}
        rules={{ required: '이용약관에 동의해야 합니다' }}
        label="이용약관 동의"
      />

      <FormCheckbox
        name="privacy"
        control={control}
        rules={{ required: '개인정보 처리방침에 동의해야 합니다' }}
        label="개인정보 수집 동의"
        description="서비스 제공을 위한 최소한의 개인정보 수집에 동의합니다"
      />

      <FormCheckbox
        name="marketing"
        control={control}
        label="마케팅 정보 수신 동의 (선택)"
        description="할인, 프로모션, 이벤트 정보를 이메일로 받아보세요"
      />

      {Object.keys(errors).length > 0 && (
        <div className="error-summary">
          {Object.values(errors).map((error, index) => (
            <p key={index}>• {error?.message}</p>
          ))}
        </div>
      )}
    </form>
  )
}
```

### 다중 선택 필터

```typescript
function FilterPanel() {
  const { control, watch } = useForm<{
    categories: string[]
  }>({
    defaultValues: { categories: [] }
  })

  const categories = watch('categories') || []

  const filterOptions = [
    { value: 'tech', label: '기술' },
    { value: 'design', label: '디자인' },
    { value: 'marketing', label: '마케팅' },
    { value: 'business', label: '비즈니스' }
  ]

  const handleCategoryToggle = (value: string, checked: boolean) => {
    const updated = checked
      ? [...categories, value]
      : categories.filter(cat => cat !== value)

    // setValue를 통한 직접 업데이트
    setValue('categories', updated)
  }

  return (
    <div>
      {filterOptions.map(option => (
        <Controller
          key={option.value}
          name="categories"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              label={option.label}
              checked={categories.includes(option.value)}
              onChange={(checked) => handleCategoryToggle(option.value, checked)}
            />
          )}
        />
      ))}
    </div>
  )
}
```

## 마이그레이션 가이드

### 기존 코드에서 FormCheckbox로 전환

#### 이전 (Controller 직접 사용)
```typescript
<Controller
  name="agree"
  control={control}
  rules={{ required: '약관에 동의해야 합니다' }}
  render={({ field, fieldState }) => (
    <Checkbox
      {...field}
      label="약관 동의"
      error={fieldState.error?.message}
    />
  )}
/>
```

#### 이후 (FormCheckbox 사용)
```typescript
<FormCheckbox
  name="agree"
  control={control}
  rules={{ required: '약관에 동의해야 합니다' }}
  label="약관 동의"
/>
```

### 점진적 전환

1. **새로운 기능**: FormCheckbox를 사용하여 개발
2. **기존 기능**: 점진적으로 FormCheckbox로 교체
3. **하위 호환성**: 기존 Checkbox는 그대로 유지

## 주의사항

- `FormCheckbox`는 React Hook Form v7과 호환됩니다
- `checked` prop은 FormCheckbox에서 자동으로 관리되므로 전달할 필요 없습니다
- `onChange` prop은 FormCheckbox에서 자동으로 처리되므로 전달할 필요 없습니다
- 유효성 검증 에러는 자동으로 표시됩니다

## Storybook

다양한 사용 예시를 Storybook에서 확인할 수 있습니다:

- 기본 Checkbox 컴포넌트 예시
- FormCheckbox 사용 예시
- 유효성 검증 예시
- 실용적인 시나리오 기반 예시

```bash
yarn storybook
```

## 접근성

- `aria-checked` 속성을 통한 상태 접근성 지원
- `aria-invalid`와 `aria-describedby`를 통한 에러 접근성 지원
- 키보드 네비게이션 완벽 지원
- 스크린 리더 호환