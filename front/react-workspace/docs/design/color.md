# Design System — Color

> 구현 파일: `src/styles/tokens.ts` (원시값) · `src/styles/color.ts` (의미론) · `src/styles/globals.css` (CSS 변수)
> TypeScript import: `import { rawColors, statusChipVariants, buttonVariants, surfaceColors } from '@/styles'`

---

## 핵심 색상

| 역할 | CSS 변수 | 값 | 용도 |
|---|---|---|---|
| Primary | `--primary` | Rich Navy `#1a365d` | 확정 버튼 (제출/확인/저장) |
| Primary Foreground | `--primary-foreground` | White | Primary 위의 텍스트 |
| Accent | `--accent` | Sky Blue `#0061a5` | 일반 액션 (수정/조회/검색) |
| Accent Foreground | `--accent-foreground` | White | Accent 위의 텍스트 |
| Background | `--background` | Blue-tinted White `#f9f9ff` | 페이지 배경 |
| Foreground | `--foreground` | Deep Navy `#121c2c` | 기본 본문 텍스트 |
| Card | `--card` | Pure White | 카드 배경 |
| Muted | `--muted` | Surface Container | 비활성 배경 |
| Muted Foreground | `--muted-foreground` | Gray `#43474e` | 보조 텍스트 |
| Border | `--border` | Light Gray `#c4c6cf` | 카드/입력 테두리 |
| Ring | `--ring` | Sky Blue | 포커스 링 |
| Destructive | `--destructive` | Red `#ba1a1a` | 삭제/반려 액션 |

---

## 서피스 시스템 (Material You)

| CSS 변수 | 용도 |
|---|---|
| `--surface` | 페이지 메인 배경 (`--background`와 동일) |
| `--surface-container-low` | 섹션 배경 |
| `--surface-container` | 카드/패널 배경 (`--muted`와 동일) |
| `--surface-container-high` | 강조 컨테이너 |
| `--surface-container-highest` | 테이블 헤더, 구분 배경 |
| `--on-surface` | 서피스 위 텍스트 (`--foreground`와 동일) |
| `--on-surface-variant` | 서피스 위 보조 텍스트 (`--muted-foreground`와 동일) |
| `--outline` | 중요 테두리 (강조선) |
| `--outline-variant` | 미세 테두리 (`--border`와 동일) |

---

## 상태 색상 (Status Chip)

저채도 배경(15%) + 고채도 텍스트 조합. `statusChipVariants`만 사용.

```tsx
import { statusChipVariants } from '@/styles'

// 접수: bg-info/15 text-info
// 검토중: bg-warning/15 text-warning
// 완료: bg-success/15 text-success
// 반려: bg-error/15 text-destructive
// 보류: bg-muted text-muted-foreground
<span className={statusChipVariants['완료']}>완료</span>
```

---

## 버튼 색상 (Button Variants)

```tsx
import { buttonVariants } from '@/styles'

<button className={buttonVariants.primary}>저장</button>     // Rich Navy
<button className={buttonVariants.accent}>검색</button>      // Sky Blue
<button className={buttonVariants.outline}>취소</button>     // 투명 + border
<button className={buttonVariants.destructive}>삭제</button> // Red
<button className={buttonVariants.ghost}>더보기</button>     // 투명
```

---

## 사이드바

| CSS 변수 | 값 |
|---|---|
| `--sidebar` | Deep Navy `#002045` |
| `--sidebar-foreground` | Blue-tinted White |
| `--sidebar-accent` | Sky Blue |
| `--sidebar-ring` | Pale Blue (역전 primary) |

---

## 섀도우 (소프트 섀도우)

불투명도 14% 이하만 허용. `shadowValues` 토큰 사용.

```css
--shadow-card:  0 1px 4px 0 oklch(0 0 0 / 6%)       /* 카드 기본 */
--shadow-base:  0 4px 12px 0 oklch(0 0 0 / 6%)       /* 드롭다운, 팝오버 */
--shadow-md:    0 4px 12px 0 oklch(0 0 0 / 6%)        /* 중형 오버레이 */
--shadow-modal: 0 8px 32px 0 oklch(0 0 0 / 10%)       /* 모달 */
```

---

## Do / Don't

### Do
- `--primary`(Rich Navy)는 페이지당 **하나**의 CTA에만 사용
- 링크 색상은 반드시 `--accent`(Sky Blue) 사용
- 상태 칩은 pill 형태(`border-radius: 9999px`)로 구현
- 모든 색상은 CSS 변수 또는 `rawColors`/`extendedColors` 토큰 사용

### Don't
- **하드코딩 hex/rgb 절대 금지** — CSS 변수 또는 토큰 필수
- `bg-gray-*`, `text-blue-*` 등 Tailwind 기본 팔레트 직접 사용 금지
- `--color-deep-navy`를 본문 텍스트로 직접 사용 금지 (너무 어두움)
- 공통 컴포넌트에 `className` prop 전달 금지
- 오류/삭제 외 목적으로 red/orange 계열 사용 금지
- 높은 불투명도 박스 섀도우(`rgba(..., 0.2)` 이상) 금지
