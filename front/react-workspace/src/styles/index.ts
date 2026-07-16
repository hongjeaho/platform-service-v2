/**
 * 스타일 TS 헬퍼 중앙 export.
 *
 * 색상·스페이싱·섀도우의 단일 소스는 `globals.css`의 CSS 변수(`:root` + `@theme inline`)다 —
 * TS에 값 사본을 두지 않는다(ADR-0007). 여기서 내보내는 것은 값이 아닌
 * 클래스 문자열 조합(typography)과 아이콘 매핑(icons)뿐이다.
 */

// Typography — Tailwind 클래스 문자열 조합
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

// Icon — lucide-react 매핑
export {
  type IconKey,
  icons,
  type IconSize,
  iconSizes,
  type IconVariant,
  iconVariants,
} from './icons'
