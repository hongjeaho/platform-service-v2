import { forwardRef } from 'react'

import { gap } from '@/constants/design/spacing'
import { cn } from '@/lib/utils'

import styles from './Box.module.css'
import type { BoxProps } from './Box.types'

const DISPLAY_MAP = {
  flex: 'flex',
  grid: 'grid',
  block: 'block',
  'inline-flex': 'inline-flex',
} as const

const DIRECTION_MAP = {
  row: 'flex-row',
  column: 'flex-col',
} as const

const ALIGN_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const

const JUSTIFY_MAP = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
} as const

/**
 * Box 컴포넌트
 * flex/grid 레이아웃 wrapper. display, direction, align, justify, gap을 prop으로 제어합니다.
 * 디자인 토큰(gap)을 사용합니다.
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Component = 'div',
      display = 'flex',
      direction = 'row',
      align,
      justify,
      gap: gapKey,
      wrap = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          styles.box,
          DISPLAY_MAP[display],
          display === 'flex' && direction && DIRECTION_MAP[direction],
          align && ALIGN_MAP[align],
          justify && JUSTIFY_MAP[justify],
          gapKey && gap[gapKey],
          wrap && 'flex-wrap',
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    )
  },
)

Box.displayName = 'Box'
