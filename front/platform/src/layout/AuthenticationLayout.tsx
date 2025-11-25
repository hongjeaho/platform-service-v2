import { Outlet } from 'react-router-dom'

/**
 * 인증이 필요한 페이지들을 위한 레이아웃입니다.
 * 접수, 심의, 결론 등의 주요 기능이 여기에 포함됩니다.
 */
export default function AuthenticationLayout() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 영역 */}
      <header className='bg-white shadow'>
        <nav className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-bold text-gray-900'>정부 토지보상 심의 시스템</h1>
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
    </div>
  )
}
