/**
 * 디자인 토큰 중앙 export
 * 모든 디자인 토큰을 한 곳에서 관리합니다
 */

// Raw tokens (Single Source of Truth)
export {
  darkModeColors,
  rawColors,
  type DarkModeColorKey,
  type RawColorKey,
} from './tokens'

// Color tokens
export {
  accentColors,
  borderColors,
  brandColors,
  type ButtonVariant,
  buttonVariants,
  chartColors,
  colorPalettes,
  destructiveColors,
  neutralColors,
  secondaryColors,
  semanticColorClasses,
  semanticColors,
  shadowValues,
  shadows,
  type ShadowSize,
  type ShadowValue,
  statusColors,
  type StatusType,
  themeColors,
  type ThemeColorKey,
  type ThemeMode,
} from './color'

// Typography tokens
export {
  type Duration,
  durations,
  type Easing,
  easings,
  type FontWeight,
  fontWeights,
  type LetterSpacing,
  letterSpacings,
  type LineHeight,
  lineHeights,
  type TextCombination,
  textCombinations,
  type TextScale,
  textScale,
  transitions,
  type TransitionSpeed,
} from './typography'

// Icon tokens
export {
  type IconKey,
  icons,
  type IconSize,
  iconSizes,
  type IconVariant,
  iconVariants,
} from './icons'

// Spacing tokens
export {
  borderRadius,
  type BorderRadiusSize,
  borderRadiusValues,
  type BorderRadiusValue,
  breakpoints,
  type ContainerSize,
  containerSizes,
  gap,
  type GapSize,
  layouts,
  margin,
  type MarginVariant,
  padding,
  type PaddingVariant,
  spacingScale,
  type SpacingSize,
  type ZIndexLayer,
  zIndex,
} from './spacing'
