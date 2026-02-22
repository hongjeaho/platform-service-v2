import { forwardRef } from 'react'

import { containerSizes, gap, layouts } from '@/constants/design/spacing'
import { cn } from '@/lib/utils'

import styles from './Container.module.css'
import type { ContainerProps } from './Container.types'

/**
 * Container 컴포넌트
 * 페이지/섹션 레이아웃에서 콘텐츠를 중앙 정렬하고 최대 너비를 제한합니다.
 * 디자인 토큰(containerSizes, layouts)을 사용합니다.
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      as: Component = 'div',
      size = '8xl',
      centered = true,
      withPadding = true,
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
          styles.container,
          containerSizes[size],
          gap.default,
          centered && 'mx-auto',
          withPadding && layouts.pageHorizontal,
          withPadding && layouts.pageContentVertical,
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    )
  },
)

Container.displayName = 'Container'
