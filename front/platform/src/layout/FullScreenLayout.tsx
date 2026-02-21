import { useScrollToTopEffect } from '@hooks/useScrollToTopEffect'
import { Outlet } from 'react-router-dom'

import { Box } from '@/common/components/ui'

/**
 * 전체 화면을 사용하는 레이아웃입니다.
 * 로그인 페이지 등 네비게이션이 없는 페이지에 사용됩니다.
 */
export default function FullScreenLayout() {
  useScrollToTopEffect()

  return (
    <Box display='block' className='m-0 h-full w-full'>
      <Box as='main' display='block' className='h-full w-full'>
        <Outlet />
      </Box>
    </Box>
  )
}
