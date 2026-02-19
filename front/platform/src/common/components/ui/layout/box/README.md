# Box 컴포넌트

flex/grid 레이아웃 wrapper. display, direction, align, justify, gap을 prop으로 제어하는 기본 레이아웃 컴포넌트입니다.

## 특징

- **CSS Module 기반**: `:global`, `:root`, `!important` 사용 금지
- **디자인 토큰 준수**: `gap` (spacing) 토큰 사용
- **Flexbox/Grid**: position-absolute 사용 금지
- **타입 안전성**: TypeScript 기반 Props 타입 정의
- **접근성**: forwardRef 지원, `as` prop으로 시맨틱 HTML 요소 선택 가능

## Layout 컴포넌트 역할 구분

| 컴포넌트   | 역할 |
|-----------|------|
| **Box**       | flex/grid wrapper. display, direction, align, justify, gap 제어 |
| **Container** | 최대 너비 제한 + 중앙 정렬 |
| **Card**      | 시각적 스타일 (border, shadow, padding, bg-card) |

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `as` | `BoxAs` | `'div'` | 렌더링할 시맨틱 HTML 요소 (div, section, main, header, footer 등) |
| `display` | `'flex' \| 'grid' \| 'block' \| 'inline-flex'` | `'flex'` | display 모드 |
| `direction` | `'row' \| 'column'` | `'row'` | flex-direction |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | - | align-items |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around'` | - | justify-content |
| `gap` | `'tight' \| 'default' \| 'loose' \| 'relaxed'` | - | gap (디자인 토큰) |
| `wrap` | `boolean` | `false` | flex-wrap |
| `children` | `ReactNode` | - | Box 내용 |
| `className` | `string` | - | 추가 CSS 클래스 |

## 사용 예시

### 기존 반복 패턴 대체

```typescript
// 기존
<div className={cn('flex flex-col', gap.default)}>
  {children}
</div>

// Box 적용
<Box direction="column" gap="default">
  {children}
</Box>
```

```typescript
// 기존
<div className={cn('flex items-center', gap.tight)}>
  <Icon />
  <span>레이블</span>
</div>

// Box 적용
<Box align="center" gap="tight">
  <Icon />
  <span>레이블</span>
</Box>
```

### 기본 사용

```typescript
import { Box } from '@/common/components/ui'

export function Example() {
  return (
    <Box direction="column" gap="default">
      <p>첫 번째</p>
      <p>두 번째</p>
    </Box>
  )
}
```

### Box + Container + Card 조합

```typescript
import { Box, Container, Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui'

export function PageLayout() {
  return (
    <Container size="4xl">
      <Box direction="column" gap="loose">
        <Card>
          <CardHeader>
            <CardTitle>제목</CardTitle>
          </CardHeader>
          <CardContent>
            <p>본문</p>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
```

### as prop으로 시맨틱 요소

```typescript
<Box as="section" direction="column" gap="loose">
  <h2>섹션 제목</h2>
  {content}
</Box>
```

## 디자인 토큰

Box는 다음 디자인 토큰을 사용합니다.

- **gap** (`@/constants/design/spacing`): `tight`(8px), `default`(16px), `loose`(24px), `relaxed`(32px)

## Storybook

```bash
yarn storybook
```

- `UI/Layout/Box` 카테고리 참조

## 관련 파일

- `Box.tsx` - 컴포넌트 구현
- `Box.types.ts` - TypeScript 타입 정의
- `Box.module.css` - CSS Module 스타일
- `Box.stories.tsx` - Storybook 스토리
- `index.ts` - export

## 참고

- [DESIGN_SYSTEM.md](../../../../../../DESIGN_SYSTEM.md) - 디자인 시스템 가이드
- [Container README](../container/README.md), [Card README](../card/README.md) - 동일 layout 패턴 컴포넌트
