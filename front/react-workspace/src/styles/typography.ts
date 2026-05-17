/**
 * 타이포그래피 디자인 토큰
 * Civic Authority & Fairness 타입 스케일
 *
 * 헤딩: Public Sans (--font-family-display)
 * 본문: Inter (--font-family-body)
 * 한국어 폴백: Pretendard Variable, Noto Sans KR
 */

/**
 * 텍스트 스케일 (기존 — 하위 호환)
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
 * Civic Authority 타입 스케일 — CSS 변수 기반 스타일 객체
 * 인라인 스타일 또는 CSS-in-JS 사용 시 활용
 */
export const displayScale = {
  displayLg: {
    fontFamily: 'var(--font-family-display)',
    fontSize: 'var(--font-size-display-lg)', // 48px
    fontWeight: '700',
    lineHeight: 'var(--line-height-display)', // 1.2
    letterSpacing: 'var(--letter-spacing-display)', // -0.02em
  },
  headlineLg: {
    fontFamily: 'var(--font-family-display)',
    fontSize: 'var(--font-size-headline-lg)', // 32px
    fontWeight: '700',
    lineHeight: 'var(--line-height-headline)', // 1.3
  },
  headlineMd: {
    fontFamily: 'var(--font-family-display)',
    fontSize: 'var(--font-size-headline-md)', // 24px
    fontWeight: '600',
    lineHeight: 'var(--line-height-headline-tight)', // 1.4
  },
  headlineSm: {
    fontFamily: 'var(--font-family-display)',
    fontSize: 'var(--font-size-headline-sm)', // 20px
    fontWeight: '600',
    lineHeight: 'var(--line-height-headline-tight)',
  },
  bodyLg: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-body-lg)', // 18px
    fontWeight: '400',
    lineHeight: 'var(--line-height-body)', // 1.6
  },
  bodyMd: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-body-md)', // 16px
    fontWeight: '400',
    lineHeight: 'var(--line-height-body)',
  },
  bodySm: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-body-sm)', // 14px
    fontWeight: '400',
    lineHeight: '1.5',
  },
  labelLg: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-label-lg)', // 14px
    fontWeight: '600',
    lineHeight: 'var(--line-height-label)', // 1.2
  },
  labelMd: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-label-md)', // 12px
    fontWeight: '500',
    lineHeight: 'var(--line-height-label)',
  },
} as const

/**
 * Tailwind 클래스 조합 — Civic Authority 타입 스케일
 * CSS Module 외부(feature 컴포넌트, 페이지 등)에서 사용
 */
export const textCombinationsV2 = {
  displayLg: 'text-5xl font-bold leading-tight tracking-tight', // 48px/700/1.2/-0.02em
  headlineLg: 'text-4xl font-bold leading-snug', // 32px/700/1.3
  headlineMd: 'text-2xl font-semibold leading-snug', // 24px/600/1.4
  headlineSm: 'text-xl font-semibold leading-snug', // 20px/600/1.4
  bodyLg: 'text-lg font-normal leading-relaxed', // 18px/400/1.6
  bodyMd: 'text-base font-normal leading-relaxed', // 16px/400/1.6
  bodySm: 'text-sm font-normal leading-normal', // 14px/400/1.5
  labelLg: 'text-sm font-semibold leading-none', // 14px/600/1.2
  labelMd: 'text-xs font-medium leading-none', // 12px/500/1.2
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
export type DisplayScale = keyof typeof displayScale
export type TextCombinationV2 = keyof typeof textCombinationsV2
export type TransitionSpeed = keyof typeof transitions
export type Duration = keyof typeof durations
export type Easing = keyof typeof easings
