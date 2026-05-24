# Design System — TypeScript Token Reference

> 중앙 import: `import { ... } from '@/styles'`
> 전체 export 목록: `src/styles/index.ts`

---

## 원시 토큰 (Single Source of Truth)

| export | 파일 | 설명 |
|---|---|---|
| `rawColors` | `tokens.ts` | OKLCH 원본 색상값 (브랜드·의미론·중립 계열) |
| `extendedColors` | `tokens.ts` | Material You 서피스 + 브랜드 확장 색상 |
| `darkModeColors` | `tokens.ts` | 다크 모드 전용 색상 재정의 |

---

## 색상 토큰

| export | 파일 | 설명 |
|---|---|---|
| `buttonVariants` | `color.ts` | 버튼 variant별 Tailwind 클래스 (primary/accent/outline/destructive/ghost/link) |
| `statusChipVariants` | `color.ts` | 상태 칩 Tailwind 클래스 (접수/검토중/완료/반려/보류) |
| `surfaceColors` | `color.ts` | Material You 서피스 그룹 |
| `semanticColors` | `color.ts` | 의미론적 상태 색상 (success/warning/error/info) |
| `semanticColorClasses` | `color.ts` | 상태 색상 Tailwind 클래스 조합 |
| `brandColors` | `color.ts` | 브랜드 아이덴티티 색상 |
| `shadowValues` | `color.ts` | 소프트 섀도우 토큰 (card/base/md/modal) |
| `themeColors` | `color.ts` | CSS 변수 기반 테마 색상 전체 |
| `colorPalettes` | `color.ts` | 색상 스케일 50-900 |

---

## 타이포그래피 토큰

| export | 파일 | 설명 |
|---|---|---|
| `textCombinationsV2` | `typography.ts` | Tailwind 클래스 조합 (displayLg/headlineLg/bodyMd/labelMd 등 8단계) |
| `displayScale` | `typography.ts` | 인라인 스타일용 타입 스케일 객체 |
| `fontWeights` | `typography.ts` | 폰트 굵기 (light 300 ~ black 900) |
| `lineHeights` | `typography.ts` | 행간 (tight 1.25 ~ relaxed 1.75) |
| `transitions` | `typography.ts` | CSS 트랜지션 클래스 |
| `durations` | `typography.ts` | 애니메이션 지속 시간 |
| `easings` | `typography.ts` | 이징 함수 |

---

## 스페이싱 토큰

| export | 파일 | 설명 |
|---|---|---|
| `spacingScaleV2` | `spacing.ts` | 8px 기반 시맨틱 스케일 (xs/base/sm/md/lg/xl/gutter/margin) |
| `spacingScale` | `spacing.ts` | 4px 단위 기본 스케일 (Tailwind 호환) |
| `borderRadiusValues` | `spacing.ts` | 보더 반경 CSS 변수 참조 (sm/default/md/lg/xl/full) |
| `layouts` | `spacing.ts` | 페이지·섹션 레이아웃 클래스 |
| `padding` | `spacing.ts` | 컴포넌트 내부 여백 클래스 |
| `gap` | `spacing.ts` | Flex/Grid 간격 클래스 |
| `zIndex` | `spacing.ts` | z-index 레이어 (dropdown/sticky/modal/tooltip) |
| `breakpoints` | `spacing.ts` | 반응형 브레이크포인트 값 |

---

## 아이콘 토큰

| export | 파일 | 설명 |
|---|---|---|
| `icons` | `icons.ts` | 아이콘 이름 상수 (add/edit/delete/search/document 등) |
| `iconSizes` | `icons.ts` | 아이콘 크기 (xs 12px ~ xl 32px) |
| `iconVariants` | `icons.ts` | 크기+색상 조합 클래스 (smPrimary/mdSuccess 등) |

---

## 빠른 import 예시

```ts
import {
  // 색상
  buttonVariants, statusChipVariants, shadowValues,
  rawColors, surfaceColors,

  // 타이포그래피
  textCombinationsV2, displayScale,

  // 스페이싱
  spacingScaleV2, borderRadiusValues, layouts,

  // 아이콘
  icons, iconSizes,
} from '@/styles'
```
