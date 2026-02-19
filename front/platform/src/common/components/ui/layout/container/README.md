# Container 컴포넌트

페이지/섹션 레이아웃에서 콘텐츠를 중앙 정렬하고 최대 너비를 제한하는 레이아웃 컴포넌트입니다.

## 특징

- **CSS Module 기반**: `:global`, `:root`, `!important` 사용 금지
- **디자인 토큰 준수**: `containerSizes`, `layouts.pageHorizontal` 등 spacing 토큰 사용
- **Flexbox 레이아웃**: position-absolute 사용 금지
- **타입 안전성**: TypeScript 기반 Props 타입 정의
- **접근성**: forwardRef 지원, `as` prop으로 시맨틱 HTML 요소 선택 가능

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `as` | `'div' \| 'main' \| 'section' \| 'article' \| 'aside'` | `'div'` | 렌더링할 시맨틱 HTML 요소 |
| `size` | `ContainerSize` | `'6xl'` | 최대 너비 (sm ~ 6xl, full, screen) |
| `centered` | `boolean` | `true` | 중앙 정렬 여부 (mx-auto) |
| `withPadding` | `boolean` | `true` | 좌우 패딩 적용 여부 |
| `children` | `ReactNode` | - | 컨테이너 내용 |
| `className` | `string` | - | 추가 CSS 클래스 |

## 사용 예시

### 기본 사용

```typescript
import { Container } from '@/common/components/ui'

export function PageLayout() {
  return (
    <Container>
      <h1>페이지 제목</h1>
      <p>콘텐츠가 최대 너비로 제한되고 중앙에 배치됩니다.</p>
    </Container>
  )
}
```

### Container + Card

```typescript
import { Container, Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui'
import { layouts, gap } from '@/constants/design/spacing'
import { cn } from '@/lib/utils'

export function PageWithCard() {
  return (
    <Container size="4xl" className={cn(layouts.pageVertical, gap.default)}>
      <Card>
        <CardHeader>
          <CardTitle>섹션 제목</CardTitle>
        </CardHeader>
        <CardContent>
          <p>페이지 본문 내용입니다.</p>
        </CardContent>
      </Card>
    </Container>
  )
}
```

### 시맨틱 요소로 사용

```typescript
import { Container } from '@/common/components/ui'

export function MainContent() {
  return (
    <Container as="main" size="2xl">
      <article>메인 콘텐츠 영역</article>
    </Container>
  )
}
```

### 패딩 없이 사용

```typescript
<Container withPadding={false} size="6xl">
  풀 블리드 레이아웃
</Container>
```

## 디자인 토큰

Container는 다음 디자인 토큰을 사용합니다.

- **containerSizes** (`@/constants/design/spacing`): `max-w-sm` ~ `max-w-6xl`, `max-w-full`, `max-w-screen`
- **layouts.pageHorizontal**: 좌우 패딩 (`px-6`)

## Storybook

```bash
yarn storybook
```

- `UI/Layout/Container` 카테고리 참조

## 관련 파일

- `Container.tsx` - 컴포넌트 구현
- `Container.types.ts` - TypeScript 타입 정의
- `Container.module.css` - CSS Module 스타일
- `Container.stories.tsx` - Storybook 스토리
- `index.ts` - export

## 참고

- [DESIGN_SYSTEM.md](../../../../../../DESIGN_SYSTEM.md) - 디자인 시스템 가이드
- [Card README](./../card/README.md) - 동일 layout 패턴 컴포넌트
