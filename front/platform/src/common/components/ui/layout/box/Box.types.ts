import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import type { gap } from '@/constants/design/spacing'

/**
 * Box가 렌더링할 수 있는 시맨틱 HTML 요소
 */
export type BoxAs = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'span'

/**
 * Box display 모드
 */
export type BoxDisplay = 'flex' | 'grid' | 'block' | 'inline-flex'

/**
 * Box flex 방향 (flex 전용)
 */
export type BoxDirection = 'row' | 'column'

/**
 * align-items 값 (flex/grid)
 */
export type BoxAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

/**
 * justify-content 값 (flex/grid)
 */
export type BoxJustify = 'start' | 'center' | 'end' | 'between' | 'around'

/**
 * gap 토큰 키 (spacing.ts gap 키와 동기화)
 */
export type BoxGap = keyof typeof gap

/**
 * Box 컴포넌트 Props
 */
export interface BoxProps extends ComponentPropsWithoutRef<'div'> {
  /** 렌더링할 시맨틱 HTML 요소 (기본값: 'div') */
  as?: BoxAs
  /** display 모드 (기본값: 'flex') */
  display?: BoxDisplay
  /** flex-direction (기본값: 'row') */
  direction?: BoxDirection
  /** align-items */
  align?: BoxAlign
  /** justify-content */
  justify?: BoxJustify
  /** gap 토큰 키 */
  gap?: BoxGap
  /** flex-wrap (기본값: false) */
  wrap?: boolean
  /** Box 내용 */
  children: ReactNode
}
