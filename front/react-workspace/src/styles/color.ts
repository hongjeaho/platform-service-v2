/**
 * 색상 디자인 토큰
 * TailwindCSS v4 + OKLCH 기반 색상 시스템
 *
 * 원시 토큰은 src/styles/tokens.ts에서 관리됩니다 (Single Source of Truth)
 * CSS 변수와 동기화되어 있습니다 (src/styles/globals.css)
 */

// 원시 토큰 import (단일 진실 공간)
import { rawColors, darkModeColors, type RawColorKey, type DarkModeColorKey } from './tokens'

/**
 * 원시 토큰 재내보내기
 * 인라인 스타일이나 특수한 경우에 사용합니다
 */
export { rawColors, darkModeColors }
export type { RawColorKey, DarkModeColorKey }

/**
 * Brand Colors
 */
export const brandColors = {
  primary: rawColors.primary,
  primaryForeground: rawColors.primaryForeground,
} as const

/**
 * Accent Colors - 강조 및 인터랙션
 */
export const accentColors = {
  accent: rawColors.accent,
  accentForeground: rawColors.accentForeground,
} as const

/**
 * Secondary Colors - 보조 액션
 */
export const secondaryColors = {
  secondary: rawColors.secondary,
  secondaryForeground: rawColors.secondaryForeground,
} as const

/**
 * Semantic Colors - 상태 표시
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
 * Neutral Colors - 배경, 텍스트
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
 * Destructive Colors - 삭제, 거부 등
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
 * 시맨틱 색상 클래스 매핑
 * TailwindCSS 클래스 기반 색상 조합
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
 * 그림자 효과 실제 값 (인라인 스타일용)
 */
export const shadowValues = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const

/**
 * 색상 타입 정의
 */
export type StatusType = keyof typeof statusColors
export type ButtonVariant = keyof typeof buttonVariants
export type ShadowSize = keyof typeof shadows
export type ShadowValue = keyof typeof shadowValues
export type SemanticColorClass = keyof typeof semanticColorClasses

/**
 * 색상 팔레트 스케일
 * 디자인 시스템 50-900 색상 스케일
 */
export const colorPalettes = {
  primary: {
    50: 'oklch(0.95 0.02 240)',
    100: 'oklch(0.9 0.04 240)',
    200: 'oklch(0.85 0.06 240)',
    300: 'oklch(0.75 0.08 240)',
    400: 'oklch(0.65 0.1 240)',
    500: 'oklch(0.45 0.15 240)',
    600: 'oklch(0.38 0.15 240)',
    700: 'oklch(0.33 0.13 240)',
    800: 'oklch(0.28 0.11 240)',
    900: 'oklch(0.2 0.08 240)',
  },
  gray: {
    50: 'oklch(0.98 0.001 240)',
    100: 'oklch(0.96 0.002 240)',
    200: 'oklch(0.91 0.003 240)',
    300: 'oklch(0.83 0.004 240)',
    400: 'oklch(0.67 0.005 240)',
    500: 'oklch(0.52 0.006 240)',
    600: 'oklch(0.41 0.007 240)',
    700: 'oklch(0.32 0.008 240)',
    800: 'oklch(0.24 0.009 240)',
    900: 'oklch(0.17 0.01 240)',
  },
  success: {
    50: 'oklch(0.97 0.02 145)',
    100: 'oklch(0.95 0.04 145)',
    200: 'oklch(0.91 0.06 145)',
    300: 'oklch(0.85 0.08 145)',
    400: 'oklch(0.75 0.12 145)',
    500: 'oklch(0.6 0.15 145)',
    600: 'oklch(0.5 0.15 145)',
    700: 'oklch(0.45 0.13 145)',
    800: 'oklch(0.4 0.11 145)',
    900: 'oklch(0.32 0.09 145)',
  },
  error: {
    50: 'oklch(0.97 0.02 27)',
    100: 'oklch(0.95 0.04 27)',
    200: 'oklch(0.91 0.06 27)',
    300: 'oklch(0.85 0.08 27)',
    400: 'oklch(0.75 0.12 27)',
    500: 'oklch(0.577 0.245 27.325)',
    600: 'oklch(0.5 0.24 27)',
    700: 'oklch(0.45 0.22 27)',
    800: 'oklch(0.4 0.2 27)',
    900: 'oklch(0.35 0.18 27)',
  },
  warning: {
    50: 'oklch(0.98 0.02 70)',
    100: 'oklch(0.96 0.04 70)',
    200: 'oklch(0.93 0.06 70)',
    300: 'oklch(0.88 0.08 70)',
    400: 'oklch(0.8 0.12 70)',
    500: 'oklch(0.7 0.15 70)',
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
    400: 'oklch(0.73 0.1 230)',
    500: 'oklch(0.6 0.12 230)',
    600: 'oklch(0.52 0.13 230)',
    700: 'oklch(0.46 0.12 230)',
    800: 'oklch(0.41 0.11 230)',
    900: 'oklch(0.38 0.1 230)',
  },
} as const

/**
 * 색상 팔레트 타입 정의
 */
export type ColorPalette = keyof typeof colorPalettes
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

/**
 * 테마 변형 색상
 * 라이트/다크 모드 색상 정의
 */
export const themeColors = {
  light: {
    background: 'oklch(0.98 0 0)',
    foreground: 'oklch(0.2 0.02 240)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.2 0.02 240)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.2 0.02 240)',
    primary: 'oklch(0.45 0.15 240)',
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.9 0.02 240)',
    secondaryForeground: 'oklch(0.25 0.05 240)',
    muted: 'oklch(0.95 0.005 240)',
    mutedForeground: 'oklch(0.5 0.02 240)',
    accent: 'oklch(0.55 0.18 220)',
    accentForeground: 'oklch(0.98 0 0)',
    destructive: 'oklch(0.577 0.245 27.325)',
    destructiveForeground: 'oklch(0.98 0 0)',
    border: 'oklch(0.88 0.01 240)',
    input: 'oklch(0.96 0.005 240)',
    ring: 'oklch(0.45 0.15 240)',
  },
  dark: {
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
  },
} as const

/**
 * 테마 타입 정의
 */
export type ThemeMode = 'light' | 'dark'
export type ThemeColorKey = keyof typeof themeColors.light
