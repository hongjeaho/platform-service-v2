/**
 * 색상 디자인 토큰
 * Civic Authority & Fairness — TailwindCSS v4 + OKLCH 기반
 *
 * 원시 토큰: src/styles/tokens.ts (Single Source of Truth)
 */

import {
  type DarkModeColorKey,
  darkModeColors,
  type ExtendedColorKey,
  extendedColors,
  type RawColorKey,
  rawColors,
} from './tokens'

export { darkModeColors, extendedColors, rawColors }
export type { DarkModeColorKey, ExtendedColorKey, RawColorKey }

/**
 * Brand Colors
 */
export const brandColors = {
  primary: rawColors.primary, // Rich Navy — 확정 버튼
  primaryForeground: rawColors.primaryForeground,
  deepNavy: extendedColors.deepNavy, // Deep Navy — 헤더/브랜딩
  skyBlue: extendedColors.skyBlue, // Sky Blue — 일반 액션/링크
} as const

/**
 * Accent Colors
 */
export const accentColors = {
  accent: rawColors.accent,
  accentForeground: rawColors.accentForeground,
} as const

/**
 * Secondary Colors
 */
export const secondaryColors = {
  secondary: rawColors.secondary,
  secondaryForeground: rawColors.secondaryForeground,
} as const

/**
 * Semantic Colors
 */
export const semanticColors = {
  success: rawColors.success,
  successForeground: rawColors.successForeground,
  warning: rawColors.warning,
  warningForeground: rawColors.warningForeground,
  error: rawColors.error,
  errorForeground: rawColors.errorForeground,
  info: rawColors.info,
  infoForeground: rawColors.infoForeground,
} as const

/**
 * Neutral Colors
 */
export const neutralColors = {
  background: rawColors.background,
  foreground: rawColors.foreground,
  card: rawColors.card,
  cardForeground: rawColors.cardForeground,
  popover: rawColors.popover,
  popoverForeground: rawColors.popoverForeground,
  muted: rawColors.muted,
  mutedForeground: rawColors.mutedForeground,
} as const

/**
 * Border & Input Colors
 */
export const borderColors = {
  border: rawColors.border,
  input: rawColors.input,
  ring: rawColors.ring,
} as const

/**
 * Destructive Colors
 */
export const destructiveColors = {
  destructive: rawColors.destructive,
  destructiveForeground: rawColors.destructiveForeground,
} as const

/**
 * Chart Colors
 */
export const chartColors = {
  chart1: rawColors.chart1,
  chart2: rawColors.chart2,
  chart3: rawColors.chart3,
  chart4: rawColors.chart4,
  chart5: rawColors.chart5,
} as const

/**
 * Material You 서피스 시스템 색상 그룹
 */
export const surfaceColors = {
  surface: extendedColors.surface,
  surfaceDim: extendedColors.surfaceDim,
  surfaceContainerLowest: extendedColors.surfaceContainerLowest,
  surfaceContainerLow: extendedColors.surfaceContainerLow,
  surfaceContainer: extendedColors.surfaceContainer,
  surfaceContainerHigh: extendedColors.surfaceContainerHigh,
  surfaceContainerHighest: extendedColors.surfaceContainerHighest,
  onSurface: extendedColors.onSurface,
  onSurfaceVariant: extendedColors.onSurfaceVariant,
  inverseSurface: extendedColors.inverseSurface,
  inverseOnSurface: extendedColors.inverseOnSurface,
  outline: extendedColors.outline,
  outlineVariant: extendedColors.outlineVariant,
} as const

export type SurfaceColorKey = keyof typeof surfaceColors

/**
 * 상태 칩 variant — Pill 형태, 저채도 배경 + 고채도 텍스트
 * 사용: <span className={statusChipVariants['완료']}>완료</span>
 */
export const statusChipVariants = {
  접수: 'bg-info/15 text-info border border-info/30 rounded-full',
  검토중: 'bg-warning/15 text-warning-foreground border border-warning/30 rounded-full',
  완료: 'bg-success/15 text-success border border-success/30 rounded-full',
  반려: 'bg-error/15 text-error border border-error/30 rounded-full',
  보류: 'bg-muted text-muted-foreground border border-border rounded-full',
} as const

export type StatusChipType = keyof typeof statusChipVariants

/**
 * 비즈니스 로직별 색상 매핑 (기존 — 하위 호환)
 */
export const statusColors = {
  접수: 'bg-info text-info-foreground',
  검토중: 'bg-warning text-warning-foreground',
  완료: 'bg-success text-success-foreground',
  반려: 'bg-error text-error-foreground',
  보류: 'bg-muted text-muted-foreground',
} as const

/**
 * 시맨틱 색상 클래스 매핑 (기존 — 하위 호환)
 */
export const semanticColorClasses = {
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  error: 'bg-error text-error-foreground',
  info: 'bg-info text-info-foreground',
  muted: 'bg-muted text-muted-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
} as const

/**
 * 버튼 variant 색상 매핑
 * primary = Rich Navy (확정: 제출/확인/저장)
 * accent  = Sky Blue (일반: 수정/조회/검색)
 */
export const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-border bg-background hover:bg-accent/10 hover:text-accent',
  ghost: 'hover:bg-accent/10 hover:text-foreground',
  link: 'underline-offset-4 hover:underline text-accent',
} as const

/**
 * 그림자 효과 클래스 (TailwindCSS)
 */
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  none: 'shadow-none',
} as const

/**
 * 소프트 섀도우 실제 값 (인라인 스타일용)
 * 브랜드/시맨틱 컬러 틴트 — 순수 블랙 대신 프라이머리·위험색 틴트를 사용
 * 불투명도 4–20% 수준 — 높은 값 사용 금지
 */
export const shadowValues = {
  sm: '0 2px 8px 0 oklch(0.2 0.03 260 / 5%)',
  md: '0 6px 16px -4px oklch(0.2 0.05 260 / 10%), 0 2px 6px -1px oklch(0.2 0.03 260 / 6%)',
  base: '0 4px 14px 0 oklch(0.2 0.04 260 / 8%), 0 1px 4px 0 oklch(0.2 0.03 260 / 5%)',
  lg: '0 12px 28px -6px oklch(0.2 0.05 260 / 12%), 0 4px 8px -2px oklch(0.2 0.03 260 / 6%)',
  xl: '0 20px 44px -10px oklch(0.2 0.05 260 / 14%), 0 8px 16px -4px oklch(0.2 0.03 260 / 8%)',
  '2xl': '0 28px 56px -14px oklch(0.2 0.05 260 / 18%)',
  card: '0 4px 14px 0 oklch(0.2 0.04 260 / 8%), 0 1px 4px 0 oklch(0.2 0.03 260 / 5%)',
  modal: '0 12px 36px 0 oklch(0.2 0.05 260 / 14%), 0 4px 12px 0 oklch(0.2 0.03 260 / 8%)',
  inner: 'inset 0 1px 3px 0 oklch(0.2 0.03 260 / 6%)',
  // 프라이머리/위험 액션 강조용 컬러 글로우 섀도우 (버튼 등)
  primary: '0 10px 20px -8px oklch(0.56 0.21 260 / 45%)',
  destructive: '0 10px 20px -8px oklch(0.6 0.21 25 / 45%)',
  none: 'none',
} as const

/**
 * 색상 팔레트 스케일 (50-900)
 */
export const colorPalettes = {
  primary: {
    50: 'oklch(0.96 0.02 260)',
    100: 'oklch(0.92 0.05 260)',
    200: 'oklch(0.86 0.08 260)',
    300: 'oklch(0.78 0.12 260)',
    400: 'oklch(0.68 0.17 260)',
    500: 'oklch(0.56 0.21 260)', // Bright Blue — primary
    600: 'oklch(0.49 0.2 260)',
    700: 'oklch(0.42 0.18 260)',
    800: 'oklch(0.34 0.15 260)',
    900: 'oklch(0.26 0.11 260)',
  },
  gray: {
    50: 'oklch(0.98 0.001 260)',
    100: 'oklch(0.96 0.002 260)',
    200: 'oklch(0.91 0.003 258)',
    300: 'oklch(0.83 0.004 256)',
    400: 'oklch(0.67 0.005 254)',
    500: 'oklch(0.52 0.006 252)',
    600: 'oklch(0.41 0.007 252)',
    700: 'oklch(0.32 0.008 250)',
    800: 'oklch(0.24 0.009 250)',
    900: 'oklch(0.15 0.04 250)',
  },
  success: {
    50: 'oklch(0.97 0.02 145)',
    100: 'oklch(0.95 0.04 145)',
    200: 'oklch(0.91 0.06 145)',
    300: 'oklch(0.85 0.08 145)',
    400: 'oklch(0.75 0.12 145)',
    500: 'oklch(0.60 0.15 145)',
    600: 'oklch(0.50 0.15 145)',
    700: 'oklch(0.45 0.13 145)',
    800: 'oklch(0.40 0.11 145)',
    900: 'oklch(0.32 0.09 145)',
  },
  error: {
    50: 'oklch(0.97 0.02 27)',
    100: 'oklch(0.95 0.04 27)',
    200: 'oklch(0.91 0.06 27)',
    300: 'oklch(0.85 0.08 27)',
    400: 'oklch(0.75 0.12 27)',
    500: 'oklch(0.45 0.22 27)', // #ba1a1a
    600: 'oklch(0.40 0.20 27)',
    700: 'oklch(0.35 0.18 27)',
    800: 'oklch(0.30 0.16 27)',
    900: 'oklch(0.25 0.14 27)',
  },
  warning: {
    50: 'oklch(0.98 0.02 70)',
    100: 'oklch(0.96 0.04 70)',
    200: 'oklch(0.93 0.06 70)',
    300: 'oklch(0.88 0.08 70)',
    400: 'oklch(0.80 0.12 70)',
    500: 'oklch(0.70 0.15 70)',
    600: 'oklch(0.62 0.15 70)',
    700: 'oklch(0.52 0.13 70)',
    800: 'oklch(0.45 0.11 70)',
    900: 'oklch(0.38 0.09 70)',
  },
  info: {
    50: 'oklch(0.97 0.02 230)',
    100: 'oklch(0.95 0.04 230)',
    200: 'oklch(0.91 0.06 230)',
    300: 'oklch(0.85 0.08 230)',
    400: 'oklch(0.73 0.10 230)',
    500: 'oklch(0.60 0.12 230)',
    600: 'oklch(0.52 0.13 230)',
    700: 'oklch(0.46 0.12 230)',
    800: 'oklch(0.41 0.11 230)',
    900: 'oklch(0.38 0.10 230)',
  },
} as const

/**
 * 테마 변형 색상 (하위 호환)
 */
export const themeColors = {
  light: {
    background: rawColors.background,
    foreground: rawColors.foreground,
    card: rawColors.card,
    cardForeground: rawColors.cardForeground,
    popover: rawColors.popover,
    popoverForeground: rawColors.popoverForeground,
    primary: rawColors.primary,
    primaryForeground: rawColors.primaryForeground,
    secondary: rawColors.secondary,
    secondaryForeground: rawColors.secondaryForeground,
    muted: rawColors.muted,
    mutedForeground: rawColors.mutedForeground,
    accent: rawColors.accent,
    accentForeground: rawColors.accentForeground,
    destructive: rawColors.destructive,
    destructiveForeground: rawColors.destructiveForeground,
    border: rawColors.border,
    input: rawColors.input,
    ring: rawColors.ring,
  },
  dark: {
    background: darkModeColors.background,
    foreground: darkModeColors.foreground,
    card: darkModeColors.card,
    cardForeground: darkModeColors.cardForeground,
    popover: darkModeColors.popover,
    popoverForeground: darkModeColors.popoverForeground,
    primary: darkModeColors.primary,
    primaryForeground: darkModeColors.primaryForeground,
    secondary: darkModeColors.secondary,
    secondaryForeground: darkModeColors.secondaryForeground,
    muted: darkModeColors.muted,
    mutedForeground: darkModeColors.mutedForeground,
    accent: darkModeColors.accent,
    accentForeground: darkModeColors.accentForeground,
    destructive: darkModeColors.destructive,
    destructiveForeground: darkModeColors.destructiveForeground,
    border: darkModeColors.border,
    input: darkModeColors.input,
    ring: darkModeColors.ring,
  },
} as const

/**
 * 타입 정의
 */
export type StatusType = keyof typeof statusColors
export type ButtonVariant = keyof typeof buttonVariants
export type ShadowSize = keyof typeof shadows
export type ShadowValue = keyof typeof shadowValues
export type SemanticColorClass = keyof typeof semanticColorClasses
export type ColorPalette = keyof typeof colorPalettes
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type ThemeMode = 'light' | 'dark'
export type ThemeColorKey = keyof typeof themeColors.light
