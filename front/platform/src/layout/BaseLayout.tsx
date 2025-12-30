import { useScrollToTopEffect } from '@hooks/useScrollToTopEffect'
import { Outlet } from 'react-router-dom'

import CommonFooter from '@/common/components/layout/footer/CommonFooter.tsx'
import CommonHeader from '@/common/components/layout/header/CommonHeader.tsx'

/**
 * 기본 레이아웃 컴포넌트입니다.
 */
export default function BaseLayout() {
  useScrollToTopEffect()

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <CommonHeader />

      {/* 메인 콘텐츠 - Header가 fixed이므로 pt-16으로 헤더 높이만큼 여백 확보 */}
      <main className='flex-1 pt-16 bg-white'>
        <Outlet />
      </main>

      <CommonFooter />
    </div>
  )
}
