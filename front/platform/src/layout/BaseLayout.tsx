import { useScrollToTopEffect } from '@hooks/useScrollToTopEffect'
import { Outlet } from 'react-router-dom'

import CommonFooter from '@/common/components/frame/footer/CommonFooter.tsx'
import CommonHeader from '@/common/components/frame/header/CommonHeader.tsx'
import { Box } from '@/common/components/ui'

/**
 * 기본 레이아웃 컴포넌트입니다.
 */
export default function BaseLayout() {
  useScrollToTopEffect()

  return (
    <Box direction='column' className='min-h-screen bg-muted'>
      <CommonHeader />

      {/* 메인 콘텐츠 - Header가 fixed이므로 pt-16으로 헤더 높이만큼 여백 확보 */}
      <Box as='main' className='flex-1 pt-16 bg-background'>
        <Outlet />
      </Box>

      <CommonFooter />
    </Box>
  )
}
