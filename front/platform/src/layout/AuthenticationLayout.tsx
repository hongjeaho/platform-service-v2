import { Outlet } from 'react-router-dom'

import { Box, Container } from '@/common/components/ui'
import { layouts, padding } from '@/constants/design/spacing'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

/**
 * 인증이 필요한 페이지들을 위한 레이아웃입니다.
 * 접수, 심의, 결론 등의 주요 기능이 여기에 포함됩니다.
 */
export default function AuthenticationLayout() {
  return (
    <Box direction='column' className='min-h-screen bg-muted'>
      {/* 헤더 영역 */}
      <Box as='header' className='bg-card shadow'>
        <Container as='nav' size='6xl' withPadding className={cn(padding.cardSm)}>
          <h1 className={cn(textCombinations.h2, 'font-bold text-foreground')}>
            정부 토지보상 심의 시스템
          </h1>
        </Container>
      </Box>

      {/* 메인 콘텐츠 */}
      <Container as='main' size='6xl' withPadding className={layouts.pageVertical}>
        <Outlet />
      </Container>
    </Box>
  )
}
