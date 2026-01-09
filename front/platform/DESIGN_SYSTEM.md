# 디자인 시스템 Quick Reference

## 1. 개요

프로젝트는 **TypeScript 기반 디자인 토큰 시스템**을 통해 일관된 UI/UX를 제공합니다.

**핵심 원칙:**
- CSS 변수 기반 색상 (OKLCH 색상 공간, WCAG AA 준수)
- 4px 단위 간격 체계 (TailwindCSS 표준)
- TypeScript 타입 안전성 보장
- 하드코딩된 스타일 값 사용 금지

**CSS조건**
- css는 cssModule만 사용할 것.
- css에서 예약어(키워드) ":global"는 사용하지 말 것.
- css에서 예약어(키워드) ":root"는 사용하지 말 것.
- css에서 예약어(키워드) "important"는 사용하지 말 것.
- index.css는 개별 독립적인 파일을 위해서는 변경하지 말 것.
- index.css는 변경 전, 다시 한 번 전역을 위해 필요한 작업인지 확인하고, 그러한 경우에만 변경할 것.
- 추후 수정이 쉽도록, 부모-자식 관계를 형성하여 only flexbox 방식으로 구현할 것. (position-absolute 금지)
- 추가적인 애니메이션 등은 넣지 말고, 있는 그대로만 완벽히 구현할 것.
---

## 2. 디자인 토큰 사용 규칙

### 2.1 색상 (Color)

**Import:**
```typescript
import { brandColors, semanticColors, buttonVariants, statusColors } from '@/constants/design/color'
```

**주요 토큰:**

| 카테고리 | 토큰 | 용도 |
|---------|------|------|
| Brand | `primary`, `accent`, `secondary` | 브랜드 아이덴티티 |
| Semantic | `success`, `warning`, `error`, `info` | 상태 표시 (항상 이것을 사용) |
| Button | `buttonVariants.primary`, `.secondary`, `.outline`, `.ghost` | 버튼 스타일 |
| Status | `statusColors.완료`, `.검토중`, `.접수` | 비즈니스 상태 뱃지 |

**✓ 좋은 예:**
```typescript
// 색상 토큰 사용
<button className={buttonVariants.primary}>버튼</button>
<div className="bg-primary text-primary-foreground">배너</div>
<span className={statusColors.완료}>완료</span>
```

**✗ 나쁜 예:**
```typescript
// ❌ 하드코딩된 색상
<button className="bg-blue-600 text-white">버튼</button>
// ❌ 인라인 스타일
<div style={{ backgroundColor: '#1a73e8' }}>배너</div>
// ❌ 임의의 TailwindCSS 색상
<span className="bg-slate-300">상태</span>
```

---

### 2.2 타이포그래피 (Typography)

**Import:**
```typescript
import { textCombinations, textScale, fontWeights, lineHeights } from '@/constants/design/typography'
```

**주요 토큰:**

| 용도 | 토큰 | 예시 |
|------|------|------|
| 큰 제목 | `textCombinations.h1` | 페이지 제목 |
| 중간 제목 | `textCombinations.h2`, `h3`, `h4` | 섹션 제목 |
| 본문 | `textCombinations.body` | 일반 텍스트 (기본값) |
| 작은 본문 | `textCombinations.bodySm` | 캡션, 보조 텍스트 |
| 버튼 | `textCombinations.button` | 버튼 텍스트 |
| 레이블 | `textCombinations.label` | 폼 라벨 |

**✓ 좋은 예:**
```typescript
// 조합 토큰 사용 (권장)
<h1 className={textCombinations.h1}>페이지 제목</h1>
<p className={textCombinations.body}>본문 텍스트</p>
<button className={textCombinations.button}>버튼</button>
<label className={textCombinations.label}>레이블</label>
```

**✗ 나쁜 예:**
```typescript
// ❌ 개별 클래스 조합
<h1 className="text-3xl font-bold">제목</h1>
// ❌ 인라인 스타일
<p style={{ fontSize: '16px', fontWeight: 'normal' }}>본문</p>
```

---

### 2.3 간격 (Spacing)

프로젝트에서 간격 토큰을 적용하는 두 가지 방식이 있습니다:

| 접근 방식 | 사용 대상 | 적용 위치 |
|----------|----------|-----------|
| **TailwindCSS 클래스** | React 컴포넌트의 `className` prop | `.tsx` 파일 |
| **CSS 변수** | CSS Module 내의 스타일 정의 | `.module.css` 파일 |

---

#### 2.3.1 접근 방식 1: TailwindCSS 클래스

**사용 상황:** React 컴포넌트의 JSX에서 직접 스타일 적용 시

**Import:**
```typescript
import { padding, gap, borderRadius, layouts } from '@/constants/design/spacing'
```

**주요 토큰:**

| 카테고리 | 토큰 | 값 | 용도 |
|---------|------|-----|------|
| Padding | `padding.buttonSm/.buttonMd/.buttonLg` | 8px/16px/24px | 버튼 내부 여백 |
| | `padding.cardSm/.card/.cardLg` | 12px/24px/32px | 카드 내부 여백 |
| Gap | `gap.tight/.default/.loose` | 8px/16px/24px | Flex/Grid 간격 |
| Border Radius | `borderRadius.md/.lg/.xl` | 8px/12px/16px | 모서리 둥글기 |
| Layout | `layouts.page/.pageVertical` | 양쪽 32px 여백 | 페이지 구조 |

**✓ 좋은 예:**
```typescript
// 토큰 사용
<button className={padding.buttonMd}>버튼</button>
<div className={cn('flex', gap.default)}>리스트</div>
<div className={cn(padding.card, borderRadius.lg, 'bg-card border')}>
  카드 컴포넌트
</div>
```

**✗ 나쁜 예:**
```typescript
// ❌ 임의의 간격 값
<button className="px-5 py-2.5">버튼</button>
// ❌ 하드코딩된 여백
<div className="gap-5">리스트</div>
// ❌ 인라인 스타일
<div style={{ padding: '20px', borderRadius: '10px' }}>카드</div>
```

---

#### 2.3.2 접근 방식 2: CSS 변수

**사용 상황:** CSS Module 파일에서 간격 값 정의 시

**CSS 변수 정의 위치:** `src/index.css` `:root` (lines 124-143)

**Import (TypeScript에서 타입 참조 시):**
```typescript
import { cssVariables } from '@/constants/design/spacing'

// 타입 참조
type SpacingCssVar = keyof typeof cssVariables
```

**주요 CSS 변수:**

**Padding CSS Variables:**
| 변수 | 값 | 용도 | TypeScript 키 |
|------|-----|------|---------------|
| `--padding-button-sm` | 0.375rem 0.75rem | 작은 버튼 | `paddingButtonSm` |
| `--padding-button-md` | 0.5rem 1rem | 기본 버튼 | `paddingButtonMd` |
| `--padding-button-lg` | 0.75rem 1.5rem | 큰 버튼 | `paddingButtonLg` |
| `--padding-input-default` | 0.5rem 0.75rem | 입력 필드 | `paddingInputDefault` |
| `--padding-card-sm` | 1rem | 작은 카드 | `paddingCardSm` |
| `--padding-card` | 1.5rem | 기본 카드 | `paddingCard` |
| `--padding-card-lg` | 2rem | 큰 카드 | `paddingCardLg` |

**Gap CSS Variables:**
| 변수 | 값 | 용도 | TypeScript 키 |
|------|-----|------|---------------|
| `--gap-xs` | 0.25rem (4px) | 아주 작은 간격 | `gapXs` |
| `--gap-sm` | 0.5rem (8px) | 작은 간격 | `gapSm` |
| `--gap-md` | 1rem (16px) | 기본 간격 | `gapMd` |
| `--gap-lg` | 1.5rem (24px) | 큰 간격 | `gapLg` |

**Size CSS Variables:**
| 변수 | 값 | 용도 | TypeScript 키 |
|------|-----|------|---------------|
| `--size-checkbox` | 1.25rem | 체크박스 크기 | `sizeCheckbox` |
| `--size-radio` | 1.25rem | 라디오 버튼 크기 | `sizeRadio` |
| `--size-icon-sm` | 1rem | 작은 아이콘 | `sizeIconSm` |
| `--size-icon-md` | 1.5rem | 기본 아이콘 | `sizeIconMd` |

**CSS Module 사용 예시:**
```css
/* Button.module.css */
.buttonSm {
  padding: var(--padding-button-sm);
}

.buttonMd {
  padding: var(--padding-button-md);
}

.icon {
  margin-right: var(--gap-sm);
}

/* Input.module.css */
.field {
  gap: var(--gap-xs);
}

.input {
  padding: var(--padding-input-default);
}

/* Checkbox.module.css */
.input {
  width: var(--size-checkbox);
  height: var(--size-checkbox);
}
```

---

#### 2.3.3 사용 가이드라인

**언제 TailwindCSS 클래스 사용:**
- ✅ React 컴포넌트의 JSX에서 직접 스타일링
- ✅ 동적으로 클래스가 변경되는 경우
- ✅ 간단한 스타일 조합

**언제 CSS 변수 사용:**
- ✅ CSS Module 파일(`.module.css`)에서 스타일 정의
- ✅ 복잡한 스타일링이 필요한 컴포넌트
- ✅ 일관된 컴포넌트 스타일 유지가 중요한 경우

**❌ 혼용 주의:**
```typescript
// ❌ 피해야 할 패턴 - JSX와 style 속성 혼용
<div className={padding.buttonMd} style={{ padding: 'var(--padding-button-md)' }}>

// ✅ 올바른 패턴 1 - JSX에서는 TailwindCSS
<div className={padding.buttonMd}>

/* ✅ 올바른 패턴 2 - CSS Module에서는 CSS 변수 */
.customButton {
  padding: var(--padding-button-md);
}
```

---

### 2.4 아이콘 (Icons)

**Import:**
```typescript
import { icons, iconSizes, iconVariants } from '@/constants/design/icons'
```

**주요 토큰:**

| 카테고리 | 토큰 | 예시 |
|---------|------|------|
| 아이콘 | `icons.add`, `icons.edit`, `icons.delete` | lucide-react 매핑 |
| | `icons.success`, `icons.error`, `icons.warning` | 상태 아이콘 |
| | `icons.case`, `icons.folder`, `icons.calendar` | 도메인 아이콘 |
| 크기 | `iconSizes.xs/.sm/.md/.lg/.xl` | 12px / 16px / 20px / 24px / 32px |
| 조합 | `iconVariants.smPrimary`, `mdSuccess`, `lgError` | 크기 + 색상 |

**✓ 좋은 예:**
```typescript
// 의미 기반 아이콘 선택
const Icon = icons.add  // 또는 icons.success
<Icon className={iconSizes.md} />
<Icon className={iconVariants.mdPrimary} />

// cn() 조합
<CheckCircle className={cn(iconSizes.md, 'text-success')} />
```

**✗ 나쁜 예:**
```typescript
// ❌ 직접 import (금지)
import { Plus } from 'lucide-react'
<Plus className="h-5 w-5" />

// ❌ 임의의 크기
<Icon className="h-7 w-7" />
```

---

## 3. 컴포넌트 작성 가이드

### 3.1 기본 구조

```typescript
import { cn } from '@/lib/utils'
import { padding, borderRadius } from '@/constants/design/spacing'
import { buttonVariants, textCombinations } from '@/constants/design'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children
}: ButtonProps) {
  const paddingClass = {
    sm: padding.buttonSm,
    md: padding.buttonMd,
    lg: padding.buttonLg,
  }[size]

  return (
    <button className={cn(
      buttonVariants[variant],
      paddingClass,
      textCombinations.button,
      borderRadius.md
    )}>
      {children}
    </button>
  )
}
```

### 3.2 스타일링 패턴

**패턴 1: 토큰 조합 (권장)**
```typescript
<div className={cn(
  padding.card,
  borderRadius.lg,
  'bg-card border border-border',
  'shadow-sm hover:shadow-md transition-shadow'
)}>
  {children}
</div>
```

**패턴 2: 조건부 스타일링**
```typescript
<button className={cn(
  padding.buttonMd,
  borderRadius.md,
  isActive && 'bg-primary text-primary-foreground',
  !isActive && 'bg-muted text-muted-foreground'
)}>
  {label}
</button>
```

**패턴 3: 동적 토큰 선택**
```typescript
const sizeClasses = {
  small: cn(padding.buttonSm, textCombinations.bodySm),
  medium: cn(padding.buttonMd, textCombinations.body),
  large: cn(padding.buttonLg, textCombinations.body),
}

<button className={sizeClasses[size]}>
  {label}
</button>
```

### 3.3 네이밍 컨벤션

| 항목 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `Button`, `CardHeader`, `Modal` |
| Props 인터페이스 | PascalCase + Props | `ButtonProps`, `ModalProps` |
| 파일명 | PascalCase + .tsx | `Button.tsx`, `Modal.tsx` |
| 상수 | camelCase | `sizeOptions`, `variantMap` |
| 변수 | camelCase | `isOpen`, `buttonSize` |

---

## 4. 금지 사항 (Don'ts)

### ❌ 색상 하드코딩 금지
```typescript
// ❌ 금지
<div className="bg-blue-600 text-white">
<div style={{ backgroundColor: '#1a73e8', color: 'white' }}>

// ✓ 올바름
<div className="bg-primary text-primary-foreground">
```

### ❌ 임의의 간격 값 금지
```typescript
// ❌ 금지 (TailwindCSS 기본 값)
<button className="px-5 py-2.5">
<div className="gap-5">

// ✓ 올바름
<button className={padding.buttonMd}>
<div className={gap.default}>
```

### ❌ CSS 변수 우회 금지
```typescript
// ❌ 금지
const color = '#1a73e8'
<div style={{ color }}>

// ✓ 올바름
<div className="text-primary">
```

### ❌ 아이콘 직접 import 금지
```typescript
// ❌ 금지
import { Plus } from 'lucide-react'
const Icon = Plus

// ✓ 올바름
import { icons } from '@/constants/design/icons'
const Icon = icons.add
```

---

## 5. 자주 사용하는 패턴

### 5.1 상태 표시 뱃지

```typescript
import { cn } from '@/lib/utils'
import { statusColors } from '@/constants/design/color'
import { padding, borderRadius } from '@/constants/design/spacing'

export function StatusBadge({ status }: { status: '완료' | '검토중' | '접수' }) {
  return (
    <span className={cn(
      statusColors[status],
      padding.buttonSm,
      borderRadius.md,
      'inline-block'
    )}>
      {status}
    </span>
  )
}
```

### 5.2 카드 컴포넌트

```typescript
import { cn } from '@/lib/utils'
import { padding, gap, borderRadius } from '@/constants/design/spacing'

interface CardProps {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <div className={cn(
      'bg-card border border-border',
      padding.card,
      borderRadius.lg,
      'shadow-sm hover:shadow-md transition-shadow'
    )}>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <div className={gap.default}>
        {children}
      </div>
    </div>
  )
}
```

### 5.3 폼 필드

```typescript
import { cn } from '@/lib/utils'
import { padding, margin, borderRadius } from '@/constants/design/spacing'
import { textCombinations } from '@/constants/design/typography'

interface FormFieldProps {
  label: string
  children: React.ReactNode
  error?: string
}

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div className={margin.formField}>
      <label className={textCombinations.label}>
        {label}
      </label>
      <div className="mt-1">
        {children}
      </div>
      {error && (
        <p className={cn(textCombinations.bodySm, 'text-error mt-1')}>
          {error}
        </p>
      )}
    </div>
  )
}
```

---

## 6. 참고 자료

### 디자인 토큰 정의 파일
- `src/constants/design/index.ts` - 중앙 export
- `src/constants/design/color.ts` - 색상 토큰
- `src/constants/design/typography.ts` - 타이포그래피 토큰
- `src/constants/design/spacing.ts` - 간격 토큰
- `src/constants/design/icons.ts` - 아이콘 매핑

### CSS 및 설정
- `src/index.css` - CSS 변수 정의
- `src/lib/utils.ts` - cn() 유틸리티 함수

### 실제 사용 예시
- `src/views/Home.tsx` - 프로젝트 내 토큰 사용 예시

### 추가 정보
- [CLAUDE.md](./CLAUDE.md) - 프로젝트 전체 가이드
- [TailwindCSS 공식 문서](https://tailwindcss.com) - CSS 클래스 참조
