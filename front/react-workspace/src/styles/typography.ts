/**
 * 타이포그래피 디자인 토큰
 *
 * 헤딩/본문: Pretendard Variable (--font-family-display / --font-family-body)
 * 라틴 폴백: Public Sans(헤딩) / Inter(본문)
 */

/**
 * 텍스트 스케일
 */
export const textScale = {
  h1: 'text-3xl', // 30px
  h2: 'text-2xl', // 24px
  h3: 'text-xl', // 20px
  h4: 'text-lg', // 18px
  h5: 'text-base', // 16px
  body: 'text-base',
  bodySm: 'text-sm',
  bodyXs: 'text-xs',
  display: 'text-4xl', // 36px
} as const

/**
 * 폰트 웨이트
 */
export const fontWeights = {
  light: 'font-light', // 300
  normal: 'font-normal', // 400
  medium: 'font-medium', // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold', // 700
} as const

/**
 * 라인 높이
 */
export const lineHeights = {
  tight: 'leading-tight', // 1.25
  normal: 'leading-normal', // 1.5
  relaxed: 'leading-relaxed', // 1.75
} as const

/**
 * 레터 스페이싱
 */
export const letterSpacings = {
  tight: 'tracking-tight', // -0.02em
  normal: 'tracking-normal', // 0
  wide: 'tracking-wide', // 0.025em
} as const

/**
 * 텍스트 조합 (기존 — 하위 호환)
 */
export const textCombinations = {
  h1: `${textScale.h1} ${fontWeights.bold} ${lineHeights.tight}`,
  h2: `${textScale.h2} ${fontWeights.semibold} ${lineHeights.tight}`,
  h3: `${textScale.h3} ${fontWeights.semibold} ${lineHeights.tight}`,
  h4: `${textScale.h4} ${fontWeights.semibold} ${lineHeights.normal}`,
  bodyLg: `${textScale.body} ${fontWeights.normal} ${lineHeights.normal}`,
  body: `${textScale.body} ${fontWeights.normal} ${lineHeights.normal}`,
  bodySm: `${textScale.bodySm} ${fontWeights.normal} ${lineHeights.normal}`,
  bodyXs: `${textScale.bodyXs} ${fontWeights.normal} ${lineHeights.normal}`,
  button: `${textScale.body} ${fontWeights.medium} ${lineHeights.normal}`,
  buttonSm: `${textScale.bodySm} ${fontWeights.medium} ${lineHeights.normal}`,
  label: `${textScale.bodySm} ${fontWeights.medium} ${lineHeights.normal}`,
  labelSm: `${textScale.bodyXs} ${fontWeights.medium} ${lineHeights.normal}`,
  caption: `${textScale.bodyXs} ${fontWeights.normal} ${lineHeights.normal}`,
} as const

/**
 * 트랜지션
 */
export const transitions = {
  fast: 'transition-colors duration-150',
  base: 'transition-colors duration-200',
  slow: 'transition-colors duration-300',
} as const

export const durations = {
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
} as const

export const easings = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

/**
 * 타입 정의
 */
export type TextScale = keyof typeof textScale
export type FontWeight = keyof typeof fontWeights
export type LineHeight = keyof typeof lineHeights
export type LetterSpacing = keyof typeof letterSpacings
export type TextCombination = keyof typeof textCombinations
export type TransitionSpeed = keyof typeof transitions
export type Duration = keyof typeof durations
export type Easing = keyof typeof easings
