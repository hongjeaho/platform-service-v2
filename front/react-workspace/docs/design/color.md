# Design System — Color

> 구현 파일: `src/styles/tokens.ts` (원시값) · `src/styles/color.ts` (의미론) · `src/styles/globals.css` (CSS 변수)
> TypeScript import: `import { rawColors, statusChipVariants, buttonVariants, surfaceColors } from '@/styles'`

---

## 핵심 색상

| 역할               | CSS 변수               | 값                           | 용도                       |
| ------------------ | ---------------------- | ---------------------------- | -------------------------- |
| Primary            | `--primary`            | Bright Blue (`#3366ff` 계열) | 확정 버튼 (제출/확인/저장) |
| Primary Foreground | `--primary-foreground` | White                        | Primary 위의 텍스트        |
| Accent             | `--accent`             | 밝고 채도 낮은 Blue          | 일반 액션 (수정/조회/검색) |
| Accent Foreground  | `--accent-foreground`  | White                        | Accent 위의 텍스트         |
| Background         | `--background`         | 옅은 블루 화이트             | 페이지 배경                |
| Foreground         | `--foreground`         | 짙은 잉크 (블루 틴트)        | 기본 본문 텍스트           |
| Card               | `--card`               | Pure White                   | 카드 배경                  |
| Muted              | `--muted`              | 옅은 블루 그레이             | 비활성 배경                |
| Muted Foreground   | `--muted-foreground`   | Gray                         | 보조 텍스트                |
| Border             | `--border`             | Light Gray (블루 틴트)       | 카드/입력 테두리           |
| Ring               | `--ring`               | Primary Blue와 동일          | 포커스 링                  |
| Destructive        | `--destructive`        | Red                          | 삭제/반려 액션             |

---

## 서피스 시스템 (Material You)

이번 재설계(#12)에서 핵심 색상만 교체했고, 서피스 시스템(`extendedColors`)의 세부 톤은 아직 손대지 않았습니다. AppShell 등 후속 작업에서 필요 시 조정될 수 있습니다.

| CSS 변수                      | 용도                                                |
| ----------------------------- | --------------------------------------------------- |
| `--surface`                   | 페이지 메인 배경 (`--background`와 동일)            |
| `--surface-container-low`     | 섹션 배경                                           |
| `--surface-container`         | 카드/패널 배경 (`--muted`와 동일)                   |
| `--surface-container-high`    | 강조 컨테이너                                       |
| `--surface-container-highest` | 테이블 헤더, 구분 배경                              |
| `--on-surface`                | 서피스 위 텍스트 (`--foreground`와 동일)            |
| `--on-surface-variant`        | 서피스 위 보조 텍스트 (`--muted-foreground`와 동일) |
| `--outline`                   | 중요 테두리 (강조선)                                |
| `--outline-variant`           | 미세 테두리 (`--border`와 동일)                     |

---

## 상태 색상 (Status Chip)

파스텔 배경(15%) + 채도 높은 텍스트 조합, pill 형태. `statusChipVariants`만 사용.

```tsx
import { statusChipVariants } from '@/styles'

// 접수: bg-info/15 text-info
// 검토중: bg-warning/15 text-warning-foreground
// 완료: bg-success/15 text-success
// 반려: bg-error/15 text-error
// 보류: bg-muted text-muted-foreground
;<span className={statusChipVariants['완료']}>완료</span>
```

---

## 버튼 색상 (Button Variants)

Primary/Destructive에는 각각 `--shadow-primary`/`--shadow-destructive` 컬러 글로우 섀도우가 함께 적용됩니다.

```tsx
import { buttonVariants } from '@/styles'

<button className={buttonVariants.primary}>저장</button>     // Bright Blue + 컬러 글로우 섀도우
<button className={buttonVariants.accent}>검색</button>      // 밝은 Blue
<button className={buttonVariants.outline}>취소</button>     // 투명 + border
<button className={buttonVariants.destructive}>삭제</button> // Red + 컬러 글로우 섀도우
<button className={buttonVariants.ghost}>더보기</button>     // 투명
```

---

## 사이드바 — 레거시 토큰, 실사용 안 함 (주의)

`--sidebar`/`--sidebar-foreground`/`--sidebar-accent` 등은 이전 디자인 방향의 Deep Navy 셸을 위한 토큰으로, **AppShell의 `Sidebar` 컴포넌트는 이 토큰을 사용하지 않습니다.** 실제 Sidebar는 밝은 카드형(`--card`/`--border`/`--muted`/`--primary`)으로 구현되어 있습니다. 이 레거시 토큰들은 `DesignTokens.stories.tsx` 쇼케이스 외에는 어디서도 참조되지 않으며, 정리 대상 후보입니다.

---

## 섀도우 (컬러 틴트 소프트 섀도우)

순수 블랙 대신 프라이머리 컬러가 옅게 섞인 소프트 섀도우를 사용합니다. `shadowValues` 토큰 사용.

```css
:root {
  --shadow-card: 0 4px 14px 0 oklch(0.2 0.04 260 / 8%); /* 카드 기본 */
  --shadow-md: 0 6px 16px -4px oklch(0.2 0.05 260 / 10%); /* 드롭다운, 팝오버 */
  --shadow-modal: 0 12px 36px 0 oklch(0.2 0.05 260 / 14%); /* 모달(AlertDialog) */
  --shadow-primary: 0 10px 20px -8px oklch(0.56 0.21 260 / 45%); /* Primary 버튼 글로우 */
  --shadow-destructive: 0 10px 20px -8px oklch(0.6 0.21 25 / 45%); /* Destructive 버튼 글로우 */
}
```

---

## Do / Don't

### Do

- `--primary`(Bright Blue)는 페이지당 **하나**의 CTA에만 사용
- 링크 색상은 반드시 `--accent` 또는 `--primary` 사용
- 상태 칩은 pill 형태(`border-radius: 9999px`)로 구현
- 모달류(AlertDialog 등)는 `--radius-lg` + `--shadow-modal` 조합 사용
- 모든 색상은 CSS 변수 또는 `rawColors`/`extendedColors` 토큰 사용

### Don't

- **하드코딩 hex/rgb 절대 금지** — CSS 변수 또는 토큰 필수 (fallback 값 포함)
- `bg-gray-*`, `text-blue-*` 등 Tailwind 기본 팔레트 직접 사용 금지
- 공통 컴포넌트에 `className` prop 전달 금지
- 오류/삭제 외 목적으로 red/orange 계열 사용 금지
- 순수 블랙 저투명도 그림자(`rgba(0,0,0,...)`) 신규 추가 금지 — 반드시 컬러 틴트 섀도우 토큰 사용
