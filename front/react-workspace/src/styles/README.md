# 디자인 시스템 (Design System)

정부 플랫폼을 위한 통합 디자인 토큰 시스템입니다. TailwindCSS v4와 OKLCH 색상 공간을 기반으로 구현되었습니다.

## 목차

- [구조](#-구조)
- [사용법](#-사용법)
  - [색상 사용](#색상-사용)
  - [타이포그래피](#타이포그래피)
  - [간격](#간격)
  - [아이콘](#아이콘)
- [네이밍 컨벤션](#-네이밍-컨벤션)
- [새 토큰 추가 방법](#-새-토큰-추가-방법)
- [다크 모드](#-다크-모드)
- [반응형 브레이크포인트](#-반응형-브레이크포인트)
- [커스텀 테마](#-커스텀-테마)
- [참고 자료](#-참고-자료)
- [기여 가이드](#-기여-가이드)

---

## 📁 구조

```
src/styles/
├── tokens.ts          # 원시 토큰 (Single Source of Truth)
├── color.ts           # 색상 시스템
├── typography.ts      # 타이포그래피 시스템
├── spacing.ts         # 간격 시스템
├── icons.ts           # 아이콘 시스템
├── index.ts           # 중앙 export
├── globals.css        # CSS 변수 및 Tailwind 설정
├── README.md          # 이 문서
└── assets/
    └── fonts/         # Pretendard Variable 폰트
        └── PretendardVariable.woff2
```

---

## 🚀 사용법

### 색상 사용

#### 1. TailwindCSS 클래스 (권장)

```tsx
import { buttonVariants, semanticColorClasses } from '@/styles'

function MyButton() {
  return <button className={buttonVariants.primary}>클릭</button>
}

function StatusBadge() {
  return <span className={semanticColorClasses.success}>완료</span>
}
```

#### 2. 인라인 스타일 (특수한 경우)

```tsx
import { rawColors } from '@/styles'

function CustomComponent() {
  return <div style={{ backgroundColor: rawColors.primary }} />
}
```

#### 3. CSS 변수 사용

```css
.custom-element {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

### 타이포그래피

```tsx
import { textCombinations, fontWeights } from '@/styles'

<h1 className={textCombinations.h1}>제목</h1>
<p className={textCombinations.body}>본문</p>
<span className={fontWeights.medium}>중간 굵기</span>
```

### 간격

```tsx
import { padding, gap, layouts } from '@/styles'

<button className={padding.buttonMd}>버튼</button>
<div className={gap.default}>간격</div>
<section className={layouts.page}>페이지</section>
```

### 아이콘

```tsx
import { icons, iconSizes } from '@/styles'
import { Icon } from './components/Icon' // 커스텀 아이콘 컴포넌트

;<Icon icon={icons.add} size={iconSizes.md} />
```

---

## 🎨 네이밍 컨벤션

### 색상

| 그룹                   | 설명                    | 예시                               |
| ---------------------- | ----------------------- | ---------------------------------- |
| `semanticColors`       | 의미 중심 상태 색상     | success, warning, error, info      |
| `colorPalettes`        | 색상 스케일 (50-900)    | primary, gray, success, error      |
| `statusColors`         | 비즈니스 로직 매핑      | 접수, 검토중, 완료, 반려           |
| `brandColors`          | 브랜드 아이덴티티       | primary, primaryForeground         |
| `semanticColorClasses` | TailwindCSS 클래스 조합 | bg-success text-success-foreground |

### 간격

| 그룹           | 설명               | 예시                                      |
| -------------- | ------------------ | ----------------------------------------- |
| `spacingScale` | 기본 4px 단위      | 0, xs, sm, md, lg, xl, 2xl, 3xl           |
| `padding`      | 컴포넌트 내부 여백 | buttonSm, buttonMd, inputDefault          |
| `margin`       | 요소 간 외부 여백  | formField, section, page                  |
| `gap`          | Flex/Grid 간격     | tight, default, loose, relaxed            |
| `layouts`      | 페이지 레이아웃    | page, pageContentVertical, sectionPadding |

### 타이포그래피

| 그룹               | 설명                      | 예시                                  |
| ------------------ | ------------------------- | ------------------------------------- |
| `textScale`        | Tailwind 기준 텍스트 크기 | h1-h5, body, bodySm, bodyXs           |
| `fontWeights`      | 폰트 굵기                 | light, normal, medium, semibold, bold |
| `lineHeights`      | 줄 간격                   | tight, normal, relaxed                |
| `textCombinations` | 자주 사용하는 조합        | h1, h2, body, button, label           |

---

## ✅ 새 토큰 추가 방법

### 1. 원시 토큰 추가

`src/styles/tokens.ts`에 원시 값을 추가합니다.

```typescript
export const rawColors = {
  // 기존 색상들...
  newColor: 'oklch(0.5 0.1 250)',
} as const
```

### 2. CSS 변수 추가

`src/styles/globals.css`의 `:root`에 추가합니다.

```css
:root {
  /* 기존 변수들... */
  --new-color: oklch(0.5 0.1 250);
}
```

### 3. Tailwind 테마 등록

`globals.css`의 `@theme inline`에 추가합니다.

```css
@theme inline {
  /* 기존 색상들... */
  --color-new-color: var(--new-color);
}
```

### 4. TypeScript export 추가

`src/styles/index.ts`에서 export합니다.

```typescript
export { newColor } from './tokens'
```

---

## 🌓 다크 모드

다크 모드는 `.dark` 클래스로 자동 전환됩니다.

```tsx
'use client'

import { useState, useEffect } from 'react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return <button onClick={() => setIsDark(!isDark)}>{isDark ? '라이트 모드' : '다크 모드'}</button>
}
```

### 다크 모드 색상 정의

다크 모드 색상은 `tokens.ts`의 `darkModeColors`에서 관리됩니다.

```typescript
import { darkModeColors } from '@/styles'
```

---

## 📱 반응형 브레이크포인트

| 접두사 | 크기   | 사용 예시                     |
| ------ | ------ | ----------------------------- |
| `sm:`  | 640px  | `className="sm:text-lg"`      |
| `md:`  | 768px  | `className="md:px-8"`         |
| `lg:`  | 1024px | `className="lg:grid-cols-3"`  |
| `xl:`  | 1280px | `className="xl:max-w-7xl"`    |
| `2xl:` | 1536px | `className="2xl:grid-cols-4"` |

### 사용 예시

```tsx
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
  <div>항목 1</div>
  <div>항목 2</div>
  <div>항목 3</div>
</div>
```

---

## 🔧 커스텀 테마

프로젝트별로 테마를 커스터마이즈하려면:

1. **원시 토큰 수정**: `tokens.ts`의 원시 값 수정
2. **CSS 변수 동기화**: `globals.css`의 CSS 변수 업데이트
3. **Tailwind 설정 추가**: 필요시 Tailwind config 추가

```typescript
// tokens.ts 예시
export const rawColors = {
  primary: 'oklch(0.5 0.2 250)', // 새로운 브랜드 색상
  // ...
}
```

```css
/* globals.css 예시 */
:root {
  --primary: oklch(0.5 0.2 250);
  /* ... */
}
```

---

## 📚 참고 자료

- [TailwindCSS v4 문서](https://tailwindcss.com/docs)
- [OKLCH 색상 공간](https://oklch.com/)
- [Pretendard 폰트](https://github.com/orioncactus/pretendard)
- [Lucide 아이콘](https://lucide.dev/)
- [디자인 토큰 모범 사례](https://www.designsystems.com/)

---

## 🤝 기여 가이드

디자인 시스템 개선에 기여하려면:

1. **이슈 등록**: 작업 시작 전에 이슈를 등록하세요
2. **네이밍 컨벤션 준수**: 위의 컨벤션을 따르세요
3. **TypeScript 타입 정의**: 모든 토큰에 타입을 추가하세요
4. **이중화 방지**: `tokens.ts` → `globals.css` → `color.ts` 순서로 동기화
5. **문서 업데이트**: 변경사항을 README에 반영하세요
6. **PR 시 스크린샷**: 시각적 변경이 있다면 스크린샷을 첨부하세요

### PR 체크리스트

- [ ] `tokens.ts`에 원시 토큰 추가
- [ ] `globals.css`에 CSS 변수 추가 및 동기화
- [ ] `color.ts`에서 TypeScript export 추가
- [ ] `index.ts`에서 중앙 export 추가
- [ ] TypeScript 타입 검증 통과
- [ ] 스타일이 적용된 컴포넌트 스크린샷 첨부

---

## 📦 주요 Export

```typescript
// 모든 토큰을 한 번에 import
import * as tokens from '@/styles'

// 또는 개별 import
import {
  // 원시 토큰
  rawColors,
  darkModeColors,

  // 색상
  semanticColorClasses,
  buttonVariants,
  statusColors,
  colorPalettes,

  // 타이포그래피
  textCombinations,
  fontWeights,

  // 간격
  padding,
  margin,
  gap,
  layouts,

  // 타입
  type StatusType,
  type ButtonVariant,
  type SemanticColorClass,
} from '@/styles'
```

---

## 📝 버전 및 변경사항

### 버전: 1.0.0

- **초기 구현**: 단일 진실 공간(Single Source of Truth) 구조 도입
- **토큰 중앙화**: `tokens.ts` 파일을 통한 원시 토큰 관리
- **TailwindCSS 클래스 기반**: JIT 컴파일 호환성 확보
- **문서화**: README.md 추가

**마지막 업데이트**: 2025-03-13

---

## 🐛 문제 신고

버그나 개선사항을 발견하시면 [GitHub Issues](https://github.com/your-org/repo/issues)에 등록해주세요.

---

**라이선스**: MIT
**관리자**: 정부 플랫폼 개발팀
