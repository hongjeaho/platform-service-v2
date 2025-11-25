import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Link } from 'react-router-dom'

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
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-900'>{status}</h1>
        <p className='mt-4 text-2xl font-semibold text-gray-600'>{statusText}</p>
        <p className='mt-2 text-gray-500'>{message}</p>
        <Link
          to='/'
          className='mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700'
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
