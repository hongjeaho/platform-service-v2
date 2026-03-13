/**
 * 원시 디자인 토큰 (Raw Design Tokens)
 * 모든 색상 값의 단일 진실 공간 (Single Source of Truth)
 * globals.css의 CSS 변수와 동기화됨
 *
 * 중요: 새로운 색상을 추가할 때는 여기에 먼저 추가한 후,
 * globals.css와 color.ts에도 동일한 값을 추가해야 합니다.
 */

/**
 * Brand Colors
 * 정부 플랫폼 아이덴티티 (V3: #274ba9)
 */
export const rawColors = {
  // Brand Colors
  primary: 'oklch(0.45 0.15 240)', // 네이비 블루
  primaryForeground: 'oklch(0.98 0 0)', // 거의 흰색 텍스트

  // Accent Colors - 강조 및 인터랙션
  accent: 'oklch(0.55 0.18 220)', // 밝은 파란색 (링크, 호버)
  accentForeground: 'oklch(0.98 0 0)', // 흰색 텍스트

  // Secondary Colors - 보조 액션
  secondary: 'oklch(0.90 0.02 240)', // 연한 네이비 그레이
  secondaryForeground: 'oklch(0.25 0.05 240)', // 진한 네이비 텍스트

  // Semantic Colors - 상태 표시
  success: 'oklch(0.60 0.15 145)', // 초록색 (승인, 완료)
  successForeground: 'oklch(0.98 0 0)',
  warning: 'oklch(0.70 0.15 70)', // 노란색 (경고, 대기)
  warningForeground: 'oklch(0.20 0 0)',
  error: 'oklch(0.577 0.245 27.325)', // 빨간색 (오류, 거부)
  errorForeground: 'oklch(0.98 0 0)',
  info: 'oklch(0.60 0.12 230)', // 파란색 (정보)
  infoForeground: 'oklch(0.98 0 0)',

  // Neutral Colors - 배경, 텍스트
  background: 'oklch(0.98 0 0)', // 오프화이트 (눈의 피로 감소)
  foreground: 'oklch(0.20 0.02 240)', // 진한 네이비 그레이
  card: 'oklch(1 0 0)', // 순수 흰색 카드 배경
  cardForeground: 'oklch(0.20 0.02 240)',
  popover: 'oklch(1 0 0)', // 순수 흰색
  popoverForeground: 'oklch(0.20 0.02 240)',
  muted: 'oklch(0.95 0.005 240)', // 아주 연한 네이비 그레이 배경
  mutedForeground: 'oklch(0.50 0.02 240)', // 중간 네이비 그레이 텍스트

  // Border & Input
  border: 'oklch(0.88 0.01 240)', // 연한 네이비 그레이 테두리
  input: 'oklch(0.96 0.005 240)', // 입력 필드 배경
  ring: 'oklch(0.45 0.15 240)', // 포커스 링 (primary와 동일)

  // Destructive Colors - 삭제, 거부 등
  destructive: 'oklch(0.577 0.245 27.325)',
  destructiveForeground: 'oklch(0.98 0 0)',

  // Chart Colors
  chart1: 'oklch(0.646 0.222 41.116)',
  chart2: 'oklch(0.6 0.118 184.704)',
  chart3: 'oklch(0.398 0.07 227.392)',
  chart4: 'oklch(0.828 0.189 84.429)',
  chart5: 'oklch(0.769 0.188 70.08)',

  // Sidebar Colors
  sidebar: 'oklch(0.985 0 0)',
  sidebarForeground: 'oklch(0.145 0 0)',
  sidebarPrimary: 'oklch(0.45 0.15 240)',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.55 0.18 220)',
  sidebarAccentForeground: 'oklch(0.98 0 0)',
  sidebarBorder: 'oklch(0.88 0.01 240)',
  sidebarRing: 'oklch(0.45 0.15 240)',
} as const

/**
 * 원시 색상 키 타입
 */
export type RawColorKey = keyof typeof rawColors

/**
 * 다크 모드 색상 토큰
 */
export const darkModeColors = {
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  cardForeground: 'oklch(0.985 0 0)',
  popover: 'oklch(0.205 0 0)',
  popoverForeground: 'oklch(0.985 0 0)',
  primary: 'oklch(0.922 0 0)',
  primaryForeground: 'oklch(0.205 0 0)',
  secondary: 'oklch(0.269 0 0)',
  secondaryForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  accent: 'oklch(0.269 0 0)',
  accentForeground: 'oklch(0.985 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  destructiveForeground: 'oklch(0.985 0 0)',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  ring: 'oklch(0.556 0 0)',
  chart1: 'oklch(0.488 0.243 264.376)',
  chart2: 'oklch(0.696 0.17 162.48)',
  chart3: 'oklch(0.769 0.188 70.08)',
  chart4: 'oklch(0.627 0.265 303.9)',
  chart5: 'oklch(0.645 0.246 16.439)',
  sidebar: 'oklch(0.205 0 0)',
  sidebarForeground: 'oklch(0.985 0 0)',
  sidebarPrimary: 'oklch(0.488 0.243 264.376)',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.269 0 0)',
  sidebarAccentForeground: 'oklch(0.985 0 0)',
  sidebarBorder: 'oklch(1 0 0 / 10%)',
  sidebarRing: 'oklch(0.556 0 0)',
} as const

/**
 * 다크 모드 색상 키 타입
 */
export type DarkModeColorKey = keyof typeof darkModeColors
