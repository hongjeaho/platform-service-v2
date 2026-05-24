# Design System — Civic Authority & Fairness

지역 토지수용위원회 서비스 디자인 시스템. **신뢰, 공정성, 행정 효율**을 전달하는 시각 언어.

> 모든 토큰은 `src/styles/`에서 CSS 변수 또는 TypeScript export로 제공됩니다.
> 컴포넌트 스타일 작업 시 이 문서를 기준으로 삼아야 합니다.

---

## 색상 시스템

### 핵심 색상

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

### 서피스 시스템 (Material You)

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

### 상태 색상 (Status)

```css
/* 상태 칩 전용 — 저채도 배경 + 고채도 텍스트 */
접수:  bg-info/15    text-info          (파란 계열)
검토중: bg-warning/15 text-warning       (노란 계열)
완료:  bg-success/15 text-success       (초록 계열)
반려:  bg-error/15   text-destructive   (빨간 계열)
보류:  bg-muted      text-muted-foreground
```

TypeScript: `import { statusChipVariants } from '@/styles'`

### 사이드바

| CSS 변수 | 값 |
|---|---|
| `--sidebar` | Deep Navy `#002045` |
| `--sidebar-foreground` | Blue-tinted White |
| `--sidebar-accent` | Sky Blue |
| `--sidebar-ring` | Pale Blue (역전 primary) |

---

## 타이포그래피

### 폰트 패밀리

| 변수 | 폰트 스택 | 용도 |
|---|---|---|
| `--font-family-display` | Public Sans → Pretendard → Noto Sans KR | h1–h5 헤딩 |
| `--font-family-body` / `--font-family-base` | Inter → Pretendard → Noto Sans KR | 본문/레이블/UI |
| `--font-family-korean` | Pretendard Variable → Noto Sans KR | 한국어 전용 |

> 한국어 폴백(`Pretendard Variable`, `Noto Sans KR`)은 **항상** 폰트 스택에 포함해야 합니다.

### 타입 스케일

| 역할 | 변수 | 크기 | 굵기 | 행간 |
|---|---|---|---|---|
| Display LG | `--font-size-display-lg` | 48px | 700 | 1.2 |
| Headline LG | `--font-size-headline-lg` | 32px | 700 | 1.3 |
| Headline MD | `--font-size-headline-md` | 24px | 600 | 1.4 |
| Headline SM | `--font-size-headline-sm` | 20px | 600 | 1.4 |
| Body LG | `--font-size-body-lg` | 18px | 400 | 1.6 |
| Body MD | `--font-size-body-md` | 16px | 400 | 1.6 |
| Body SM | `--font-size-body-sm` | 14px | 400 | 1.5 |
| Label LG | `--font-size-label-lg` | 14px | 600 | 1.2 |
| Label MD | `--font-size-label-md` | 12px | 500 | 1.2 |

TypeScript: `import { displayScale, textCombinationsV2 } from '@/styles'`

---

## 스페이싱 (8px 기반)

| 이름 | 변수 | 값 | 용도 |
|---|---|---|---|
| xs | `--spacing-xs` | 4px | 아이콘-텍스트 간격 |
| base | `--spacing-base` | 8px | 기본 단위 |
| sm | `--spacing-sm` | 12px | 폼 필드 내부 |
| md | `--spacing-md` | 24px | 카드 패딩 / 컬럼 gap |
| lg | `--spacing-lg` | 48px | 섹션 간 분리 |
| xl | `--spacing-xl` | 80px | 페이지 레벨 섹션 |
| gutter | `--spacing-gutter` | 24px | 그리드 컬럼 간격 |
| margin | `--spacing-margin` | 32px | 페이지 아우터 마진 |

기존 Tailwind 호환 스케일(`--spacing-1` ~ `--spacing-20`)도 그대로 유지됩니다.

---

## 보더 반경

| 변수 | 값 | 용도 |
|---|---|---|
| `--radius-sm` | 4px | 배지, 태그 |
| `--radius` | 8px | 버튼, 입력 필드, 카드 (기본) |
| `--radius-md` | 12px | 중형 카드 |
| `--radius-lg` | 16px | 대형 카드, 모달 |
| `--radius-xl` | 24px | 페이지 레벨 컨테이너 |
| `--radius-full` | 9999px | 상태 칩(pill), 페이지네이션 버튼 |

---

## 섀도우 (소프트 섀도우)

```css
--shadow-card:  0 1px 4px 0 oklch(0 0 0 / 6%)          /* 카드 기본 */
--shadow-base:  0 4px 12px 0 oklch(0 0 0 / 6%), ...     /* 드롭다운, 팝오버 */
--shadow-md:    0 4px 12px 0 oklch(0 0 0 / 6%), ...     /* 중형 오버레이 */
--shadow-modal: 0 8px 32px 0 oklch(0 0 0 / 10%), ...    /* 모달 */
```

---

## 컴포넌트 가이드

### 버튼 의미 구분

| variant | 색상 | 언제 사용 |
|---|---|---|
| `primary` | Rich Navy | **확정 액션**: 제출, 확인, 저장, 승인 |
| `accent` | Sky Blue | **일반 액션**: 수정, 조회, 검색, 다운로드 |
| `outline` | 투명 + border | **취소** (비최종) |
| `destructive` | Red | **최종 삭제/반려**: 삭제, 반려, 최종취소 |
| `ghost` | 투명 | **맥락 내 보조** 액션 |

### 상태 칩 (Status Chip)

```tsx
// border-radius: 9999px, 저채도 배경 + 고채도 텍스트
import { statusChipVariants } from '@/styles'

<span className={statusChipVariants['완료']}>완료</span>
```

### 카드

- 배경: `var(--card)` (흰색)
- 테두리: `1px solid var(--border)`
- 반경: `var(--radius)` (8px)
- 섀도우: `var(--shadow-card)`

### 입력 필드

- 반경: `var(--radius)` (8px)
- 포커스 링: 2px, `var(--ring)` (Sky Blue)
- 에러 테두리: `var(--destructive)`

### 데이터 테이블

- 헤더 배경: `var(--surface-container-highest)` 또는 `var(--background)`
- 셀 텍스트: `textCombinationsV2.bodySm`
- 테두리: `1px solid var(--border)` (최소화)

---

## ✅ Do — 이렇게 하세요

### 색상
- `--primary`(Rich Navy)는 페이지당 **하나**의 CTA에만 사용
- 링크 색상은 반드시 `--accent`(Sky Blue) 사용
- 상태 칩은 pill 형태(`border-radius: 9999px`)로 구현
- 모든 색상은 CSS 변수 또는 `rawColors`/`extendedColors` 토큰 사용

### 타이포그래피
- 헤딩(h1–h5)에 `--font-family-display` 적용
- 본문/레이블에 `--font-family-body` 적용
- 모든 `font-family` 선언에 Pretendard Variable, Noto Sans KR 폴백 포함

### 스페이싱
- 4px 그리드(xs=4, base=8, sm=12...) 준수
- 컴포넌트 내부 간격: `--spacing-1`~`--spacing-4` 범위
- 섹션 간 분리: `--spacing-lg` 이상

### 컴포넌트
- 한 폼에 `variantPrimary` 버튼 **하나**만
- 아이콘 전용 버튼에 `aria-label` 필수
- 카드 섀도우는 `--shadow-card`(가장 옅은 것) 사용

---

## ❌ Don't — 하지 마세요

### 색상
- **하드코딩 hex/rgb 절대 금지** — 반드시 CSS 변수 또는 토큰 사용
- `--color-deep-navy`를 본문 텍스트로 직접 사용 금지 (너무 어두움, Foreground 용도 아님)
- 공통 컴포넌트에 `className` prop 전달 금지 (인터페이스에서 제외됨)
- 오류/삭제 외 목적으로 red/orange 계열 사용 금지
- 높은 불투명도 박스 섀도우(`rgba(..., 0.2)` 이상) 금지 — 소프트 섀도우 토큰 사용

### 타이포그래피
- Public Sans를 테이블 바디 데이터에 사용 금지 (헤딩 전용)
- 한국어 글자에 `letter-spacing` 적용 금지
- 폰트 선언 시 한국어 폴백 생략 금지

### 스페이싱
- 홀수 픽셀(5px, 7px, 11px 등) 사용 금지
- `--spacing-lg`(48px)를 컴포넌트 내부 gap으로 사용 금지 (섹션 레벨 전용)
- `--spacing-xl`(80px)를 카드 패딩으로 사용 금지

### 컴포넌트
- Primary 버튼을 한 화면에 2개 이상 사용 금지
- 상태 칩에 pill 형태(`border-radius: 9999px`) 이외의 반경 사용 금지
- 카드에 `--shadow-2xl` 사용 금지 (모달 전용)

---

## TypeScript 토큰 import

```ts
import {
  // 색상
  rawColors,          // OKLCH 원본 값
  extendedColors,     // 서피스 시스템 + 확장 브랜드 색상
  surfaceColors,      // Material You 서피스 그룹
  statusChipVariants, // 상태 칩 Tailwind 클래스
  buttonVariants,     // 버튼 variant Tailwind 클래스

  // 타이포그래피
  displayScale,       // 새 타입 스케일 (display/headline/body/label)
  textCombinationsV2, // Tailwind 조합 클래스

  // 스페이싱
  spacingScaleV2,     // 8px 기반 시맨틱 스케일
  borderRadiusValues, // 반경 CSS 변수 참조
} from '@/styles'
```
