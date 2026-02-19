import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { Box } from '@/common/components/ui'
import { buttonVariants } from '@/constants/design/color'
import { padding } from '@/constants/design/spacing'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

/**
 * 라우팅 에러를 처리하는 페이지입니다.
 * 404, 500 등의 에러를 표시합니다.
 */
export default function ErrorPage() {
  const error = useRouteError()

  let status = 500
  let statusText = 'Internal Server Error'
  let message = '알 수 없는 에러가 발생했습니다.'

  if (isRouteErrorResponse(error)) {
    status = error.status
    statusText = error.statusText
    message = error.data?.message || `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <Box direction='column' align='center' justify='center' className='min-h-screen bg-muted'>
      <Box direction='column' gap='default' className='text-center'>
        <h1 className={cn(textCombinations.display, 'font-bold text-foreground')}>{status}</h1>
        <p className={cn(textCombinations.h2, 'font-semibold text-muted-foreground')}>
          {statusText}
        </p>
        <p className={cn(textCombinations.body, 'text-muted-foreground')}>{message}</p>
        <Link
          to='/'
          className={cn(buttonVariants.primary, padding.buttonLg, 'inline-block rounded-lg')}
        >
          홈으로 돌아가기
        </Link>
      </Box>
    </Box>
  )
}
