/**
 * 원시 디자인 토큰 (Raw Design Tokens)
 * 모든 색상 값의 단일 진실 공간 (Single Source of Truth)
 * globals.css의 CSS 변수와 동기화됨
 *
 * 새 색상 추가 순서:
 * 1. 여기(rawColors 또는 extendedColors)에 원시 값 추가
 * 2. globals.css :root에 CSS 변수 추가
 * 3. color.ts에 TypeScript export 추가
 */

/**
 * Friendly Trust × Enterprise Dashboard 브랜드 색상
 * OKLCH 색 공간 — 지각적 균일성 보장
 */
export const rawColors = {
  // Primary: Bright Blue #3366ff 계열 — 확정 액션 (제출/확인/저장)
  primary: 'oklch(0.56 0.21 260)',
  primaryForeground: 'oklch(1 0 0)',

  // Accent: 조금 더 밝고 채도 낮은 블루 — 일반 액션 (수정/조회/검색)
  accent: 'oklch(0.63 0.17 250)',
  accentForeground: 'oklch(1 0 0)',

  // Secondary: 옅은 블루 틴트 컨테이너 배경
  secondary: 'oklch(0.95 0.015 255)',
  secondaryForeground: 'oklch(0.22 0.03 258)',

  // Semantic Colors
  success: 'oklch(0.64 0.15 155)',
  successForeground: 'oklch(0.99 0 0)',
  warning: 'oklch(0.76 0.15 75)',
  warningForeground: 'oklch(0.22 0.02 75)',
  error: 'oklch(0.60 0.21 25)',
  errorForeground: 'oklch(1 0 0)',
  info: 'oklch(0.60 0.16 255)',
  infoForeground: 'oklch(1 0 0)',

  // Neutral Colors
  background: 'oklch(0.97 0.008 260)', // 옅은 블루 화이트
  foreground: 'oklch(0.18 0.02 260)', // 짙은 잉크 텍스트
  card: 'oklch(1 0 0)',
  cardForeground: 'oklch(0.18 0.02 260)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.18 0.02 260)',
  muted: 'oklch(0.95 0 0)', // 순수 회색 (블루 톤 제거)
  mutedForeground: 'oklch(0.54 0 0)', // 순수 회색 (블루 톤 제거)

  // Border & Input
  border: 'oklch(0.91 0.012 258)',
  input: 'oklch(0.96 0.008 260)',
  ring: 'oklch(0.56 0.21 260)', // Primary Blue 포커스 링

  // Destructive
  destructive: 'oklch(0.60 0.21 25)',
  destructiveForeground: 'oklch(1 0 0)',

  // Chart Colors (유지)
  chart1: 'oklch(0.646 0.222 41.116)',
  chart2: 'oklch(0.6 0.118 184.704)',
  chart3: 'oklch(0.398 0.07 227.392)',
  chart4: 'oklch(0.828 0.189 84.429)',
  chart5: 'oklch(0.769 0.188 70.08)',

  // Sidebar: Deep Navy Shell
  sidebar: 'oklch(0.17 0.06 250)', // Deep Navy #002045
  sidebarForeground: 'oklch(0.95 0.02 260)', // inverse-on-surface
  sidebarPrimary: 'oklch(0.80 0.07 235)', // inverse-primary: Pale Blue
  sidebarPrimaryForeground: 'oklch(0.17 0.06 250)',
  sidebarAccent: 'oklch(0.44 0.14 235)', // Sky Blue
  sidebarAccentForeground: 'oklch(1 0 0)',
  sidebarBorder: 'oklch(0.23 0.04 248)', // inverse-surface
  sidebarRing: 'oklch(0.80 0.07 235)',
} as const

export type RawColorKey = keyof typeof rawColors

/**
 * Material You 서피스 시스템 + 확장 브랜드 토큰
 */
export const extendedColors = {
  // 브랜드 레퍼런스
  deepNavy: 'oklch(0.17 0.06 250)', // #002045 — 헤더, 브랜딩
  richNavy: 'oklch(0.26 0.08 248)', // #1a365d — primary 버튼
  onPrimaryContainer: 'oklch(0.67 0.07 240)', // #86a0cd
  inversePrimary: 'oklch(0.80 0.07 235)', // #adc7f7
  skyBlue: 'oklch(0.44 0.14 235)', // #0061a5 — accent/secondary
  secondaryContainer: 'oklch(0.70 0.12 230)', // #66affe
  onSecondaryContainer: 'oklch(0.31 0.10 245)', // #004172

  // 서피스 시스템
  surface: 'oklch(0.98 0.005 270)',
  surfaceDim: 'oklch(0.87 0.03 255)',
  surfaceBright: 'oklch(0.98 0.005 270)',
  surfaceContainerLowest: 'oklch(1 0 0)',
  surfaceContainerLow: 'oklch(0.85 0 0)', // 순수 회색 (더 진한 명도)
  surfaceContainer: 'oklch(0.93 0.02 260)',
  surfaceContainerHigh: 'oklch(0.91 0.03 255)',
  surfaceContainerHighest: 'oklch(0.89 0.03 255)',
  onSurface: 'oklch(0.15 0.04 250)',
  onSurfaceVariant: 'oklch(0.33 0.01 250)',
  inverseSurface: 'oklch(0.23 0.04 248)',
  inverseOnSurface: 'oklch(0.95 0.02 260)',
  outline: 'oklch(0.52 0.01 250)',
  outlineVariant: 'oklch(0.80 0.01 255)',

  // 에러 컨테이너
  errorContainer: 'oklch(0.91 0.04 22)', // #ffdad6
  onErrorContainer: 'oklch(0.30 0.18 27)', // #93000a

  // 테이블 전용 색상 — 그라데이션 계층 구조
  tableHeaderMain: 'oklch(0.91 0.007 250)', // #E2E5EC — 메인 헤더
  tableHeaderSub: 'oklch(0.94 0.005 250)', // #EDEEF2 — 서브 헤더
  tableBorder: 'oklch(0.28 0.05 250)', // #2C3550 — 헤더-바디 구분선
  tableGroupCell: 'oklch(0.93 0.006 250)', // #EAEDF3 — 그룹 셀
  tableStripe: 'oklch(0.97 0.004 250)', // #F5F6F8 — Stripe
  tableHover: 'oklch(0.92 0.006 250)', // #E8EBF2 — Hover
} as const

export type ExtendedColorKey = keyof typeof extendedColors

/**
 * 다크 모드 색상 토큰 — Civic Authority Dark
 */
export const darkModeColors = {
  background: 'oklch(0.14 0.03 250)',
  foreground: 'oklch(0.92 0.01 255)',
  card: 'oklch(0.19 0.04 248)',
  cardForeground: 'oklch(0.92 0.01 255)',
  popover: 'oklch(0.19 0.04 248)',
  popoverForeground: 'oklch(0.92 0.01 255)',
  primary: 'oklch(0.80 0.07 235)', // Pale Blue (반전)
  primaryForeground: 'oklch(0.17 0.06 250)',
  secondary: 'oklch(0.25 0.05 248)',
  secondaryForeground: 'oklch(0.92 0.01 255)',
  muted: 'oklch(0.22 0.04 248)',
  mutedForeground: 'oklch(0.70 0.03 255)',
  accent: 'oklch(0.70 0.12 230)',
  accentForeground: 'oklch(0.15 0.04 250)',
  destructive: 'oklch(0.65 0.20 22)',
  destructiveForeground: 'oklch(0.15 0.04 250)',
  border: 'oklch(0.35 0.04 248)',
  input: 'oklch(0.22 0.04 248)',
  ring: 'oklch(0.70 0.12 230)',
  chart1: 'oklch(0.65 0.18 235)',
  chart2: 'oklch(0.65 0.15 165)',
  chart3: 'oklch(0.78 0.17 75)',
  chart4: 'oklch(0.62 0.22 305)',
  chart5: 'oklch(0.64 0.20 22)',
  sidebar: 'oklch(0.10 0.02 250)',
  sidebarForeground: 'oklch(0.92 0.01 255)',
  sidebarPrimary: 'oklch(0.80 0.07 235)',
  sidebarPrimaryForeground: 'oklch(0.17 0.06 250)',
  sidebarAccent: 'oklch(0.44 0.14 235)',
  sidebarAccentForeground: 'oklch(1 0 0)',
  sidebarBorder: 'oklch(0.20 0.04 248)',
  sidebarRing: 'oklch(0.70 0.12 230)',
} as const

export type DarkModeColorKey = keyof typeof darkModeColors
