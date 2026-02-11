import * as React from 'react'

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
        'bg-white shadow-md',
        'z-40',
        'border-b border-gray-200',
      )}
    >
      <div className={cn('container', 'px-6 py-4', 'flex items-center justify-between')}>
        <h2 className='text-xl font-semibold text-gray-900'>
          정부 토지보상 심의 시스템
        </h2>
      </div>
    </header>
  )
}

export default CommonHeader
