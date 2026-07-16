# Design System — Token Reference

> **단일 소스**: 색상·radius·섀도우는 `src/styles/globals.css`의 `:root` CSS 변수 + `@theme inline` 매핑이 유일한 소스다([ADR-0007](../../../docs/adr/0007-css-variables-single-theme-source.md)). **TS 값 사본 금지** — 과거의 `tokens.ts`(rawColors 등)·`color.ts`·`spacing.ts`는 소비자 없는 3벌 동기화였으므로 삭제되었다.
> TS 헬퍼는 값이 아닌 클래스 문자열·아이콘 매핑만: `import { textCombinations, icons } from '@/styles'`

---

## 색상·radius·섀도우 — CSS 변수 (`globals.css :root`)

| 그룹 | 변수 예시 | Tailwind 유틸리티 |
| --- | --- | --- |
| 브랜드 | `--primary`, `--accent`, `--secondary` | `bg-primary`, `text-accent` … |
| 시맨틱 | `--success`, `--warning`, `--error`, `--info` (+`-foreground`) | `bg-success`, `text-error` … |
| 중립 | `--background`, `--foreground`, `--card`, `--muted`, `--border` | `bg-background`, `border-border` … |
| 사이드바 | `--sidebar-*` | `bg-sidebar` … |
| 서피스 | `--surface-*`, `--on-surface*`, `--outline*` | `bg-surface-container` … |
| 반경 | `--radius`, `--radius-sm/md/lg/xl` | `rounded-lg` … |
| 섀도우 | `--shadow-sm/base/md/lg/xl/2xl` | CSS `box-shadow: var(--shadow-base)` |
| 폰트 | `--font-family-display`(헤딩) · `--font-family-body`(본문) · `--font-family-base`(폼) | `body`/`h1–h6` 규칙과 CSS Module이 참조 |

리스킨 = `:root` 블록 교체. Storybook의 `Design System/Tokens` 스토리가 이 변수들을 **직접 렌더**하므로 문서와 실물이 어긋날 수 없다.

다크 모드는 현재 미지원 — `overview.md` 참조.

---

## 타이포그래피 헬퍼 (`typography.ts` — 클래스 문자열)

| export             | 설명                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `textCombinations` | Tailwind 클래스 조합 (h1–h4/body/label/caption 등) — **단일 타입 스케일**                     |
| `fontWeights`      | 폰트 굵기 (light 300 ~ black 900)                                                             |
| `lineHeights`      | 행간 (tight 1.25 ~ relaxed 1.75)                                                              |
| `transitions`      | CSS 트랜지션 클래스                                                                           |
| `durations`        | 애니메이션 지속 시간                                                                          |
| `easings`          | 이징 함수                                                                                     |

---

## 아이콘 헬퍼 (`icons.ts`)

| export         | 설명                                                                            |
| -------------- | ------------------------------------------------------------------------------- |
| `icons`        | 아이콘 이름 상수 (add/edit/delete/search/document/**more**/**notification** 등) |
| `iconSizes`    | 아이콘 크기 (xs 12px ~ xl 32px)                                                 |
| `iconVariants` | 크기+색상 조합 클래스 (smPrimary/mdSuccess 등)                                  |

`more`(케밥/⋯, DataTable 행 액션용)와 `notification`(Bell, Topbar 알림 버튼용)이 AppShell·DataTable 작업 과정에서 추가되었습니다.

---

## 빠른 import 예시

```ts
import {
  // 타이포그래피 (클래스 문자열)
  textCombinations,

  // 아이콘
  icons,
  iconSizes,
} from '@/styles'
```

색상·스페이싱 값이 필요하면 TS import가 아니라 **Tailwind 유틸리티 또는 `var(--...)`** 를 사용한다.

---

## 신규 공통 컴포넌트 (토큰 소비처)

이번 재설계로 추가된 컴포넌트는 모두 CSS 변수/Tailwind 유틸리티만 참조하며 하드코딩된 값이 없습니다.

| 컴포넌트                          | 위치                              | 설명                                                     |
| --------------------------------- | --------------------------------- | -------------------------------------------------------- |
| `AppShell` / `Sidebar` / `Topbar` | `components/layout/AppShell/`     | 앱 셸 — nav 항목은 props/config로 주입, 도메인 로직 없음 |
| `KpiCard`                         | `components/common/KpiCard/`      | 라벨+숫자+트렌드 배지(up/down)                           |
| `MiniBarChart`                    | `components/common/MiniBarChart/` | 값 배열 → 상대 높이 막대                                 |
| `ActivityFeed`                    | `components/common/ActivityFeed/` | 톤별 색상 점 + 텍스트 + 시간 목록                        |
