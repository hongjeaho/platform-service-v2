/**
 * 타이포그래피 디자인 토큰
 * 텍스트 스케일, 폰트 웨이트, 라인 높이 등을 정의합니다
 */

/**
 * 텍스트 스케일
 * TailwindCSS 기본 스케일을 기반으로 함
 */
export const textScale = {
  // Heading Sizes
  h1: 'text-3xl', // 30px
  h2: 'text-2xl', // 24px
  h3: 'text-xl', // 20px
  h4: 'text-lg', // 18px
  h5: 'text-base', // 16px

  // Body Sizes
  body: 'text-base', // 16px - 기본 본문
  bodySm: 'text-sm', // 14px - 보조 텍스트
  bodyXs: 'text-xs', // 12px - 캡션, 메타

  // Display
  display: 'text-4xl', // 36px
} as const

/**
 * 폰트 웨이트
 * Pretendard Variable 웨이트 활용 (100-900)
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
  tight: 'leading-tight', // 1.25 - 제목
  normal: 'leading-normal', // 1.5 - 본문
  relaxed: 'leading-relaxed', // 1.75 - 긴 본문
} as const

/**
 * 레터 스페이싱
 */
export const letterSpacings = {
  tight: 'tracking-tight', // -0.02em - 큰 제목
  normal: 'tracking-normal', // 0 - 기본
  wide: 'tracking-wide', // 0.025em - 대문자, 버튼
} as const

/**
 * 텍스트 조합 (자주 사용되는 조합)
 * 각 조합은 스케일 + 웨이트 + 라인높이를 포함
 */
export const textCombinations = {
  // Headings
  h1: `${textScale.h1} ${fontWeights.bold} ${lineHeights.tight}`,
  h2: `${textScale.h2} ${fontWeights.semibold} ${lineHeights.tight}`,
  h3: `${textScale.h3} ${fontWeights.semibold} ${lineHeights.tight}`,
  h4: `${textScale.h4} ${fontWeights.semibold} ${lineHeights.normal}`,

  // Body text
  bodyLg: `${textScale.body} ${fontWeights.normal} ${lineHeights.normal}`,
  body: `${textScale.body} ${fontWeights.normal} ${lineHeights.normal}`,
  bodySm: `${textScale.bodySm} ${fontWeights.normal} ${lineHeights.normal}`,
  bodyXs: `${textScale.bodyXs} ${fontWeights.normal} ${lineHeights.normal}`,

  // Button text
  button: `${textScale.body} ${fontWeights.medium} ${lineHeights.normal}`,
  buttonSm: `${textScale.bodySm} ${fontWeights.medium} ${lineHeights.normal}`,

  // Label text
  label: `${textScale.bodySm} ${fontWeights.medium} ${lineHeights.normal}`,
  labelSm: `${textScale.bodyXs} ${fontWeights.medium} ${lineHeights.normal}`,

  // Caption/Meta text
  caption: `${textScale.bodyXs} ${fontWeights.normal} ${lineHeights.normal}`,
} as const

/**
 * 트랜지션 및 애니메이션
 */
export const transitions = {
  fast: 'transition-colors duration-150',
  base: 'transition-colors duration-200',
  slow: 'transition-colors duration-300',
} as const

/**
 * 타이포그래피 타입 정의
 */
export type TextScale = keyof typeof textScale
export type FontWeight = keyof typeof fontWeights
export type LineHeight = keyof typeof lineHeights
export type LetterSpacing = keyof typeof letterSpacings
export type TextCombination = keyof typeof textCombinations
