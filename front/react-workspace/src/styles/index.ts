/**
 * 디자인 토큰 중앙 export
 */

// Raw tokens (Single Source of Truth)
export {
  type DarkModeColorKey,
  darkModeColors,
  type ExtendedColorKey,
  extendedColors,
  type RawColorKey,
  rawColors,
} from './tokens'

// Color tokens
export {
  accentColors,
  borderColors,
  brandColors,
  type ButtonVariant,
  buttonVariants,
  chartColors,
  type ColorPalette,
  colorPalettes,
  type ColorShade,
  destructiveColors,
  neutralColors,
  secondaryColors,
  type SemanticColorClass,
  semanticColorClasses,
  semanticColors,
  shadows,
  type ShadowSize,
  type ShadowValue,
  shadowValues,
  type StatusChipType,
  statusChipVariants,
  statusColors,
  type StatusType,
  type SurfaceColorKey,
  surfaceColors,
  type ThemeColorKey,
  themeColors,
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
  type BorderRadiusValue,
  borderRadiusValues,
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
  zIndex,
  type ZIndexLayer,
} from './spacing'
