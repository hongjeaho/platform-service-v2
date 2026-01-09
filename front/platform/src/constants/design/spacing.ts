/**
 * 간격 디자인 토큰
 * TailwindCSS 4px 단위 간격 시스템
 */

/**
 * Spacing Scale
 * TailwindCSS 기본 4px 단위 사용
 */
export const spacingScale = {
  0: '0px',
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const

/**
 * 패딩 (Padding)
 * 컴포넌트 내부 여백
 */
export const padding = {
  // 작은 컴포넌트
  buttonSm: 'px-3 py-1.5', // 12px/6px
  buttonMd: 'px-4 py-2', // 16px/8px
  buttonLg: 'px-6 py-3', // 24px/12px

  // 입력 필드
  inputDefault: 'px-3 py-2', // 12px/8px

  // 카드 내부
  cardSm: 'p-4', // 16px
  card: 'p-6', // 24px
  cardLg: 'p-8', // 32px
} as const

/**
 * 마진 (Margin)
 * 요소 간 외부 여백
 */
export const margin = {
  // 폼 필드 간격
  formField: 'space-y-4', // 16px
  formFieldLg: 'space-y-6', // 24px

  // 카드/섹션 간격
  sectionSm: 'space-y-4', // 16px
  section: 'space-y-6', // 24px
  sectionLg: 'space-y-8', // 32px

  // 페이지 섹션
  page: 'space-y-8', // 32px
} as const

/**
 * 갭 (Grid/Flex Gap)
 * 그리드 및 플렉스 컨테이너의 간격
 */
export const gap = {
  tight: 'gap-2', // 8px
  default: 'gap-4', // 16px
  loose: 'gap-6', // 24px
  relaxed: 'gap-8', // 32px
} as const

/**
 * 테두리 반경 (Border Radius)
 * 요소의 모서리 반경
 */
export const borderRadius = {
  sm: 'rounded-sm', // calc(var(--radius) - 4px)
  md: 'rounded-md', // calc(var(--radius) - 2px)
  lg: 'rounded-lg', // var(--radius)
  xl: 'rounded-xl', // calc(var(--radius) + 4px)
  full: 'rounded-full',
} as const

/**
 * 컨테이너 최대 너비
 * 페이지 레이아웃용 최대 너비 정의
 */
export const containerSizes = {
  sm: 'max-w-sm', // 24rem (384px)
  md: 'max-w-md', // 28rem (448px)
  lg: 'max-w-lg', // 32rem (512px)
  xl: 'max-w-xl', // 36rem (576px)
  '2xl': 'max-w-2xl', // 42rem (672px)
  '4xl': 'max-w-4xl', // 56rem (896px)
  '6xl': 'max-w-6xl', // 72rem (1152px)
  full: 'max-w-full',
  screen: 'max-w-screen',
} as const

/**
 * 반응형 브레이크포인트
 * Desktop-first 전략
 */
export const breakpoints = {
  sm: 'sm:', // 640px
  md: 'md:', // 768px
  lg: 'lg:', // 1024px
  xl: 'xl:', // 1280px
  '2xl': '2xl:', // 1536px
} as const

/**
 * 일반적인 레이아웃 패턴
 */
export const layouts = {
  // 페이지 상하 여백
  pageVertical: 'py-8', // 32px
  // 페이지 좌우 여백
  pageHorizontal: 'px-6', // 24px
  // 전체 페이지 여백
  page: 'py-8 px-6',

  // 섹션 내부 여백
  sectionPadding: 'p-6', // 24px

  // 그리드 간격
  gridGap: 'gap-6', // 24px
  gridGapTight: 'gap-4', // 16px
  gridGapLoose: 'gap-8', // 32px
} as const

/**
 * CSS 변수 매핑
 * CSS Module에서 사용할 간격 관련 CSS 변수
 */
export const cssVariables = {
  // Padding
  paddingButtonSm: 'var(--padding-button-sm)',
  paddingButtonMd: 'var(--padding-button-md)',
  paddingButtonLg: 'var(--padding-button-lg)',
  paddingInputDefault: 'var(--padding-input-default)',
  paddingCardSm: 'var(--padding-card-sm)',
  paddingCard: 'var(--padding-card)',
  paddingCardLg: 'var(--padding-card-lg)',

  // Gap
  gapXs: 'var(--gap-xs)',
  gapSm: 'var(--gap-sm)',
  gapMd: 'var(--gap-md)',
  gapLg: 'var(--gap-lg)',

  // Size
  sizeCheckbox: 'var(--size-checkbox)',
  sizeRadio: 'var(--size-radio)',
  sizeIconSm: 'var(--size-icon-sm)',
  sizeIconMd: 'var(--size-icon-md)',
} as const

/**
 * 간격 타입 정의
 */
export type SpacingSize = keyof typeof spacingScale
export type PaddingVariant = keyof typeof padding
export type MarginVariant = keyof typeof margin
export type GapSize = keyof typeof gap
export type BorderRadiusSize = keyof typeof borderRadius
export type ContainerSize = keyof typeof containerSizes
export type CssVariableKey = keyof typeof cssVariables
