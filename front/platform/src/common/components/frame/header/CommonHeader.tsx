import * as React from 'react'

import { textCombinations } from '@/constants/design/typography'
import { layouts, padding } from '@/constants/design/spacing'
import { cn } from '@/lib/utils'

interface CommonHeaderProps {}

/**
 * 공통 헤더 컴포넌트 - V3 디자인 시스템
 * 모든 페이지에 표시되는 상단 헤더
 */
const CommonHeader: React.FC<CommonHeaderProps> = () => {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0',
        'bg-card shadow-md',
        'z-40',
        'border-b border-border',
      )}
    >
      <div
        className={cn(
          'container',
          layouts.pageHorizontal,
          padding.cardSm,
          'flex items-center justify-between',
        )}
      >
        <h1 className={textCombinations.h2}>정부 토지보상 심의 시스템</h1>
      </div>
    </header>
  )
}

export default CommonHeader
