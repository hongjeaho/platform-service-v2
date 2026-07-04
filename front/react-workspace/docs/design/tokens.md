# Design System — TypeScript Token Reference

> 중앙 import: `import { ... } from '@/styles'`
> 전체 export 목록: `src/styles/index.ts`

---

## 원시 토큰 (Single Source of Truth)

| export           | 파일        | 설명                                                                                                  |
| ---------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| `rawColors`      | `tokens.ts` | OKLCH 원본 색상값 (Bright Blue 브랜드·의미론·중립 계열)                                               |
| `extendedColors` | `tokens.ts` | Material You 서피스 + 브랜드 확장 색상 (이번 재설계에서 미변경)                                       |
| `darkModeColors` | `tokens.ts` | 다크 모드 전용 색상 재정의 — **이전 팔레트 기준값 그대로, 라이트 모드와 불일치** (`overview.md` 참조) |

---

## 색상 토큰

| export                 | 파일       | 설명                                                                           |
| ---------------------- | ---------- | ------------------------------------------------------------------------------ |
| `buttonVariants`       | `color.ts` | 버튼 variant별 Tailwind 클래스 (primary/accent/outline/destructive/ghost/link) |
| `statusChipVariants`   | `color.ts` | 상태 칩 Tailwind 클래스 (접수/검토중/완료/반려/보류)                           |
| `surfaceColors`        | `color.ts` | Material You 서피스 그룹                                                       |
| `semanticColors`       | `color.ts` | 의미론적 상태 색상 (success/warning/error/info)                                |
| `semanticColorClasses` | `color.ts` | 상태 색상 Tailwind 클래스 조합                                                 |
| `brandColors`          | `color.ts` | 브랜드 아이덴티티 색상                                                         |
| `shadowValues`         | `color.ts` | 컬러 틴트 소프트 섀도우 토큰 (card/base/md/modal/primary/destructive)          |
| `themeColors`          | `color.ts` | CSS 변수 기반 테마 색상 전체                                                   |
| `colorPalettes`        | `color.ts` | 색상 스케일 50-900 (primary는 Bright Blue 계열로 재산정됨)                     |

---

## 타이포그래피 토큰

| export             | 파일            | 설명                                                                                                                           |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `textCombinations` | `typography.ts` | Tailwind 클래스 조합 (h1–h4/body/label/caption 등) — **단일 타입 스케일**. 과거의 `textCombinationsV2`/`displayScale`은 삭제됨 |
| `fontWeights`      | `typography.ts` | 폰트 굵기 (light 300 ~ black 900)                                                                                              |
| `lineHeights`      | `typography.ts` | 행간 (tight 1.25 ~ relaxed 1.75)                                                                                               |
| `transitions`      | `typography.ts` | CSS 트랜지션 클래스                                                                                                            |
| `durations`        | `typography.ts` | 애니메이션 지속 시간                                                                                                           |
| `easings`          | `typography.ts` | 이징 함수                                                                                                                      |

---

## 스페이싱 토큰

| export               | 파일         | 설명                                                                                                                                          |
| -------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `spacingScale`       | `spacing.ts` | 8px 기반 시맨틱 스케일 (xs/base/sm/md/lg/xl/gutter/margin) — **단일 스케일**. 과거의 4px 단위 v1 `spacingScale`은 삭제되고 이 이름으로 통합됨 |
| `borderRadiusValues` | `spacing.ts` | 보더 반경 CSS 변수 참조 (sm/base/md/lg/xl/2xl/full) — 이번 재설계에서 전반적으로 확대됨                                                       |
| `layouts`            | `spacing.ts` | 페이지·섹션 레이아웃 클래스                                                                                                                   |
| `padding`            | `spacing.ts` | 컴포넌트 내부 여백 클래스                                                                                                                     |
| `gap`                | `spacing.ts` | Flex/Grid 간격 클래스                                                                                                                         |
| `zIndex`             | `spacing.ts` | z-index 레이어 (dropdown/sticky/modal/tooltip)                                                                                                |
| `breakpoints`        | `spacing.ts` | 반응형 브레이크포인트 값                                                                                                                      |

---

## 아이콘 토큰

| export         | 파일       | 설명                                                                            |
| -------------- | ---------- | ------------------------------------------------------------------------------- |
| `icons`        | `icons.ts` | 아이콘 이름 상수 (add/edit/delete/search/document/**more**/**notification** 등) |
| `iconSizes`    | `icons.ts` | 아이콘 크기 (xs 12px ~ xl 32px)                                                 |
| `iconVariants` | `icons.ts` | 크기+색상 조합 클래스 (smPrimary/mdSuccess 등)                                  |

`more`(케밥/⋯, DataTable 행 액션용)와 `notification`(Bell, Topbar 알림 버튼용)이 AppShell·DataTable 작업 과정에서 추가되었습니다.

---

## 빠른 import 예시

```ts
import {
  // 색상
  buttonVariants,
  statusChipVariants,
  shadowValues,
  rawColors,
  surfaceColors,

  // 타이포그래피
  textCombinations,

  // 스페이싱
  spacingScale,
  borderRadiusValues,
  layouts,

  // 아이콘
  icons,
  iconSizes,
} from '@/styles'
```

---

## 신규 공통 컴포넌트 (토큰 소비처)

이번 재설계로 추가된 컴포넌트는 모두 위 토큰만 참조하며 하드코딩된 값이 없습니다.

| 컴포넌트                          | 위치                              | 설명                                                     |
| --------------------------------- | --------------------------------- | -------------------------------------------------------- |
| `AppShell` / `Sidebar` / `Topbar` | `components/layout/AppShell/`     | 앱 셸 — nav 항목은 props/config로 주입, 도메인 로직 없음 |
| `KpiCard`                         | `components/common/KpiCard/`      | 라벨+숫자+트렌드 배지(up/down)                           |
| `MiniBarChart`                    | `components/common/MiniBarChart/` | 값 배열 → 상대 높이 막대                                 |
| `ActivityFeed`                    | `components/common/ActivityFeed/` | 톤별 색상 점 + 텍스트 + 시간 목록                        |
