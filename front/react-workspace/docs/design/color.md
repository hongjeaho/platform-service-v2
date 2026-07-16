# Design System — Color

> 구현 파일: `src/styles/globals.css` — `:root` CSS 변수가 유일한 소스([ADR-0007](../../../docs/adr/0007-css-variables-single-theme-source.md)). TS 값 사본 금지.
> 사용법: Tailwind 유틸리티(`bg-primary` 등) 또는 `var(--primary)` 직접 참조.

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

파스텔 배경(15%) + 채도 높은 텍스트 조합, pill 형태. 상태 어휘(접수/완료 등)는 도메인 개념이므로 **토큰 층이 아닌 사용처(feature)가 소유**한다(ADR-0007) — 클래스 조합 레시피만 여기 기록한다.

```tsx
// 레시피: bg-{tone}/15 text-{tone} border border-{tone}/30 rounded-full
<span className='bg-success/15 text-success border border-success/30 rounded-full px-3 py-1'>완료</span>
```

---

## 버튼 색상 (Button Variants)

Primary/Destructive에는 각각 `--shadow-primary`/`--shadow-destructive` 컬러 글로우 섀도우가 함께 적용됩니다. 버튼은 공통 `Button` 컴포넌트의 `variant` prop으로 사용한다(클래스 문자열 직접 조립 금지).

```tsx
import { Button } from '@/components/common/Button'

<Button variant='primary'>저장</Button>     // Bright Blue + 컬러 글로우 섀도우
<Button variant='outline'>취소</Button>     // 투명 + border
```

---

## 사이드바 — 레거시 토큰, 실사용 안 함 (주의)

`--sidebar`/`--sidebar-foreground`/`--sidebar-accent` 등은 이전 디자인 방향의 Deep Navy 셸을 위한 토큰으로, **AppShell의 `Sidebar` 컴포넌트는 이 토큰을 사용하지 않습니다.** 실제 Sidebar는 밝은 카드형(`--card`/`--border`/`--muted`/`--primary`)으로 구현되어 있습니다. 이 레거시 토큰들은 `DesignTokens.stories.tsx` 쇼케이스 외에는 어디서도 참조되지 않으며, 정리 대상 후보입니다.

---

## 섀도우 (컬러 틴트 소프트 섀도우)

순수 블랙 대신 프라이머리 컬러가 옅게 섞인 소프트 섀도우를 사용합니다. `var(--shadow-*)` CSS 변수를 직접 참조한다.

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
- 모든 색상은 CSS 변수(`var(--...)`) 또는 Tailwind 시맨틱 유틸리티 사용 — TS 값 사본 금지(ADR-0007)

### Don't

- **하드코딩 hex/rgb 절대 금지** — CSS 변수 또는 토큰 필수 (fallback 값 포함)
- `bg-gray-*`, `text-blue-*` 등 Tailwind 기본 팔레트 직접 사용 금지
- 공통 컴포넌트에 `className` prop 전달 금지
- 오류/삭제 외 목적으로 red/orange 계열 사용 금지
- 순수 블랙 저투명도 그림자(`rgba(0,0,0,...)`) 신규 추가 금지 — 반드시 컬러 틴트 섀도우 토큰 사용
