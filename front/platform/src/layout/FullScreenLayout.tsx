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
    <Box className='m-0 h-full'>
      <Box as='main'>
        <Outlet />
      </Box>
    </Box>
  )
}
