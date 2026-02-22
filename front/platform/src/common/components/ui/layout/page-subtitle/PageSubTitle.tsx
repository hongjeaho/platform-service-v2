import * as React from 'react'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './PageSubTitle.module.css'

export interface PageSubTitleProps {
  /** 페이지 타이틀 */
  title: string
  /** 오른쪽 영역 — 다운로드 버튼 등 페이지별 오버라이드 */
  children?: React.ReactNode
  className?: string
}

/**
 * PageSubTitle 컴포넌트
 * 페이지 상단 타이틀 영역 + 오른쪽 슬롯(다운로드 버튼 등)을 제공합니다.
 *
 * @example 기본 사용
 * ```tsx
 * <PageSubTitle title="LTIS입력정보확인" />
 * ```
 *
 * @example 다운로드 버튼 오버라이드
 * ```tsx
 * <PageSubTitle title="LTIS입력정보확인">
 *   <a href="/files/manual.pdf" download>
 *     <Button variant="outline" size="sm">사용설명서</Button>
 *   </a>
 * </PageSubTitle>
 * ```
 */
export function PageSubTitle({ title, children, className }: PageSubTitleProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.inner}>
        {/* 왼쪽 spacer — 타이틀을 정중앙에 고정 */}
        <div className={styles.side} aria-hidden='true' />

        <h2 className={cn(styles.title, textCombinations.h3)}>{title}</h2>

        {/* 오른쪽 슬롯 — 페이지별 오버라이드 */}
        <div className={styles.side}>
          {children && <div className={styles.actions}>{children}</div>}
        </div>
      </div>
    </div>
  )
}

PageSubTitle.displayName = 'PageSubTitle'
