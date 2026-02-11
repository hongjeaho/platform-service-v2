# Card 컴포넌트

디자인 시스템 토큰을 활용한 카드 컴포넌트입니다.

## 특징

- **CSS Module 기반**: `:global`, `:root`, `!important` 사용 금지
- **디자인 토큰 준수**: `--padding-card-*`, `--gap-*`, `--radius-lg` CSS 변수 사용
- **Flexbox 레이아웃**: position-absolute 사용 금지, 부모-자식 구조
- **타입 안전성**: TypeScript 기반 Props 타입 정의
- **접근성**: forwardRef 지원, semantic HTML 구조

## 컴포넌트 구조

```typescript
<Card>                    // 카드 컨테이너
  <CardHeader>            // 헤더 영역 (선택)
    <CardTitle />         // 제목
    <CardDescription />   // 설명
  </CardHeader>
  <CardContent>           // 본문 영역
    {/* 내용 */}
  </CardContent>
  <CardFooter>            // 푸터 영역 (선택)
    {/* 액션 버튼 등 */}
  </CardFooter>
</Card>
```

## Props

### Card

| Prop          | 타입                                    | 기본값      | 설명                   |
| ------------- | --------------------------------------- | ----------- | ---------------------- |
| `variant`     | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Card 스타일 variant    |
| `size`        | `'sm' \| 'md' \| 'lg'`                  | `'md'`      | Card 크기 (padding)    |
| `interactive` | `boolean`                               | `false`     | hover 효과 활성화 여부 |
| `children`    | `ReactNode`                             | -           | Card 내용              |
| `className`   | `string`                                | -           | 추가 CSS 클래스        |

### CardHeader, CardContent, CardFooter

| Prop        | 타입        | 기본값 | 설명            |
| ----------- | ----------- | ------ | --------------- |
| `children`  | `ReactNode` | -      | 컨텐츠          |
| `className` | `string`    | -      | 추가 CSS 클래스 |

### CardTitle

| Prop        | 타입        | 기본값 | 설명            |
| ----------- | ----------- | ------ | --------------- |
| `children`  | `ReactNode` | -      | 제목 텍스트     |
| `className` | `string`    | -      | 추가 CSS 클래스 |

### CardDescription

| Prop        | 타입        | 기본값 | 설명            |
| ----------- | ----------- | ------ | --------------- |
| `children`  | `ReactNode` | -      | 설명 텍스트     |
| `className` | `string`    | -      | 추가 CSS 클래스 |

## 사용 예시

### 기본 사용

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/components/ui'

export function BasicCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card 제목</CardTitle>
        <CardDescription>Card 설명 텍스트입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card의 본문 내용입니다.</p>
      </CardContent>
    </Card>
  )
}
```

### Footer가 있는 Card

```typescript
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/common/components/ui'
import { Button } from '@/common/components/ui'

export function CardWithFooter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로젝트 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <p>프로젝트 상세 내용입니다.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">취소</Button>
        <Button variant="primary">확인</Button>
      </CardFooter>
    </Card>
  )
}
```

### Interactive Card (클릭 가능)

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui'

export function InteractiveCard() {
  const handleClick = () => {
    console.log('Card clicked')
  }

  return (
    <Card variant="elevated" interactive onClick={handleClick}>
      <CardHeader>
        <CardTitle>클릭 가능한 Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>마우스를 올리면 hover 효과가 나타납니다.</p>
      </CardContent>
    </Card>
  )
}
```

### 크기별 사용

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui'

export function CardSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Small */}
      <Card size="sm">
        <CardHeader>
          <CardTitle>Small Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>작은 크기의 Card</p>
        </CardContent>
      </Card>

      {/* Medium (기본값) */}
      <Card size="md">
        <CardHeader>
          <CardTitle>Medium Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>기본 크기의 Card</p>
        </CardContent>
      </Card>

      {/* Large */}
      <Card size="lg">
        <CardHeader>
          <CardTitle>Large Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>큰 크기의 Card</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Variant별 사용

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui'

export function CardVariants() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Default */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p>기본 Card</p>
        </CardContent>
      </Card>

      {/* Elevated */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
        </CardHeader>
        <CardContent>
          <p>그림자 효과 Card</p>
        </CardContent>
      </Card>

      {/* Outlined */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
        </CardHeader>
        <CardContent>
          <p>테두리 강조 Card</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 아이콘이 포함된 Card

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/common/components/ui'
import { Button } from '@/common/components/ui'
import { icons } from '@/constants/design/icons'

export function CardWithIcon() {
  const InfoIcon = icons.info
  const SuccessIcon = icons.success

  return (
    <Card variant="elevated">
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <InfoIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          <CardTitle>알림</CardTitle>
        </div>
        <CardDescription>중요한 안내사항입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>시스템 점검이 예정되어 있습니다.</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">
          <SuccessIcon style={{ width: '1rem', height: '1rem' }} />
          확인
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### 그리드 레이아웃

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui'

export function CardGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem',
      }}
    >
      {[1, 2, 3, 4].map(index => (
        <Card key={index} variant="elevated" interactive>
          <CardHeader>
            <CardTitle>Card {index}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>그리드 레이아웃 Card</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## 디자인 토큰 사용

Card 컴포넌트는 다음 디자인 토큰을 사용합니다:

### CSS 변수

```css
/* Padding */
--padding-card-sm: 1rem /* Small Card padding */ --padding-card: 1.5rem
  /* Medium Card padding (기본값) */ --padding-card-lg: 2rem /* Large Card padding */ /* Gap */
  --gap-xs: 0.25rem /* CardDescription 간격 */ --gap-sm: 0.5rem /* CardHeader, CardContent 간격 */
  --gap-md: 1rem /* Card 내부 간격 (기본값) */ --gap-lg: 1.5rem /* Large Card 간격 */
  /* Border Radius */ --radius-lg: 0.75rem /* Card 모서리 둥글기 */ /* Colors */
  --card: var(--color-white) /* Card 배경색 */ --card-foreground: var(--color-text-primary)
  /* Card 텍스트 색상 */ --border: var(--color-gray-300) /* Card 테두리 색상 */ /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05) --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1) /* Transitions */ --transition-base: 150ms
  --transition-ease: cubic-bezier(0.4, 0, 0.2, 1);
```

## 접근성

- `forwardRef` 지원으로 ref 전달 가능
- Semantic HTML 구조 (`div`, `h3`, `p`)
- `interactive` prop 사용 시 `cursor: pointer` 적용

## Storybook

Storybook에서 다양한 Card 예시를 확인할 수 있습니다:

```bash
yarn storybook
```

- `UI/Data Display/Card` 카테고리 참조

## 관련 파일

- `Card.tsx` - 컴포넌트 구현
- `Card.types.ts` - TypeScript 타입 정의
- `Card.module.css` - CSS Module 스타일
- `Card.stories.tsx` - Storybook 스토리
- `index.ts` - export

## 참고

- [DESIGN_SYSTEM.md](../../../../../../DESIGN_SYSTEM.md) - 디자인 시스템 가이드
- [CLAUDE.md](../../../../../../CLAUDE.md) - 프로젝트 전체 가이드
