/**
 * 색상 디자인 토큰
 * 정부 플랫폼 아이덴티티 기반 색상 시스템
 * CSS 변수와 동기화되어 있습니다 (src/index.css)
 * V3 디자인 시스템 (html/css/v3-main.css)과 동기화
 */

/**
 * Brand Colors - 정부 플랫폼 아이덴티티
 * V3: #274ba9 (신뢰감 있는 네이비 블루)
 */
export const brandColors = {
  primary: 'oklch(0.45 0.15 240)', // V3: #274ba9 (네이비 블루)
  primaryForeground: 'oklch(0.98 0 0)', // 거의 흰색 텍스트
} as const

/**
 * Accent Colors - 강조 및 인터랙션
 */
export const accentColors = {
  accent: 'oklch(0.55 0.18 220)', // 밝은 파란색 (링크, 호버)
  accentForeground: 'oklch(0.98 0 0)', // 흰색 텍스트
} as const

/**
 * Secondary Colors - 보조 액션
 * V3: #5e697c (네이비 그레이)
 */
export const secondaryColors = {
  secondary: 'oklch(0.90 0.02 240)', // V3: 연한 네이비 그레이
  secondaryForeground: 'oklch(0.25 0.05 240)', // 진한 네이비 텍스트
} as const

/**
 * Semantic Colors - 상태 표시
 * V3 디자인 시스템 색상과 동기화
 */
export const semanticColors = {
  success: 'oklch(0.60 0.15 145)', // V3: #22c55e - 초록색 (승인, 완료)
  successForeground: 'oklch(0.98 0 0)',

  warning: 'oklch(0.70 0.15 70)', // V3: #f59e0b - 노란색 (경고, 대기)
  warningForeground: 'oklch(0.20 0 0)',

  error: 'oklch(0.577 0.245 27.325)', // V3: #ef4444 - 빨간색 (오류, 거부)
  errorForeground: 'oklch(0.98 0 0)',

  info: 'oklch(0.60 0.12 230)', // V3: #3b82f6 - 파란색 (정보)
  infoForeground: 'oklch(0.98 0 0)',
} as const

/**
 * Neutral Colors - 배경, 텍스트
 */
export const neutralColors = {
  background: 'oklch(0.98 0 0)', // 오프화이트 (눈의 피로 감소)
  foreground: 'oklch(0.20 0.02 240)', // 진한 네이비 그레이

  card: 'oklch(1 0 0)', // 순수 흰색 카드 배경
  cardForeground: 'oklch(0.20 0.02 240)',

  popover: 'oklch(1 0 0)', // 순수 흰색
  popoverForeground: 'oklch(0.20 0.02 240)',

  muted: 'oklch(0.95 0.005 240)', // 아주 연한 네이비 그레이 배경
  mutedForeground: 'oklch(0.50 0.02 240)', // 중간 네이비 그레이 텍스트
} as const

/**
 * Border & Input Colors
 */
export const borderColors = {
  border: 'oklch(0.88 0.01 240)', // 연한 네이비 그레이 테두리
  input: 'oklch(0.96 0.005 240)', // 입력 필드 배경
  ring: 'oklch(0.45 0.15 240)', // 포커스 링 (primary와 동일)
} as const

/**
 * Destructive Colors - 삭제, 거부 등
 */
export const destructiveColors = {
  destructive: 'oklch(0.577 0.245 27.325)',
  destructiveForeground: 'oklch(0.98 0 0)',
} as const

/**
 * Chart Colors
 */
export const chartColors = {
  chart1: 'oklch(0.646 0.222 41.116)',
  chart2: 'oklch(0.6 0.118 184.704)',
  chart3: 'oklch(0.398 0.07 227.392)',
  chart4: 'oklch(0.828 0.189 84.429)',
  chart5: 'oklch(0.769 0.188 70.08)',
} as const

/**
 * 비즈니스 로직별 색상 매핑
 * 심의 진행 상황별 색상 클래스
 */
export const statusColors = {
  접수: 'bg-info text-info-foreground',
  검토중: 'bg-warning text-warning-foreground',
  완료: 'bg-success text-success-foreground',
  반려: 'bg-error text-error-foreground',
  보류: 'bg-muted text-muted-foreground',
} as const

/**
 * 버튼 variant 색상 매핑
 */
export const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-border bg-background hover:bg-accent/10 hover:text-accent',
  ghost: 'hover:bg-accent/10 hover:text-foreground',
  link: 'underline-offset-4 hover:underline text-primary',
} as const

/**
 * 그림자 효과 매핑
 */
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const

/**
 * 색상 타입 정의
 */
export type StatusType = keyof typeof statusColors
export type ButtonVariant = keyof typeof buttonVariants
export type ShadowSize = keyof typeof shadows
