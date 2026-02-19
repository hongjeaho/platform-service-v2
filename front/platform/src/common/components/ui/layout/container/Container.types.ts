import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import type { containerSizes } from '@/constants/design/spacing'

/**
 * Container가 렌더링할 수 있는 시맨틱 HTML 요소
 */
export type ContainerAs = 'div' | 'main' | 'section' | 'article' | 'aside'

/**
 * Container 최대 너비 (spacing.ts containerSizes 키와 동기화)
 */
export type ContainerSize = keyof typeof containerSizes

/**
 * Container 컴포넌트 Props
 */
export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  /** 렌더링할 시맨틱 HTML 요소 (기본값: 'div') */
  as?: ContainerAs
  /** 최대 너비 (기본값: '6xl') */
  size?: ContainerSize
  /** 중앙 정렬 여부 (기본값: true) */
  centered?: boolean
  /** 좌우 패딩 적용 여부 (기본값: true) */
  withPadding?: boolean
  /** 컨테이너 내용 */
  children: ReactNode
}
