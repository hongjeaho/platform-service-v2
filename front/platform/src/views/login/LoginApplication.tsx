import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 로그인 페이지 컴포넌트입니다.
 * 사용자 인증을 처리하는 로그인 폼을 제공합니다.
 */
export default function LoginApplication() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: 실제 인증 API 호출 구현
      // const response = await loginApi(userId, password)
      console.log('로그인 시도:', { userId, password })

      // 임시: 3초 후 홈으로 이동
      setTimeout(() => {
        navigate('/')
        setIsLoading(false)
      }, 1000)
    } catch {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.')
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
        {/* 헤더 */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>정부 토지보상 심의</h1>
          <p className='mt-2 text-gray-600'>시스템 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {/* 에러 메시지 */}
          {error && <div className='rounded-lg bg-red-50 p-4 text-sm text-red-800'>{error}</div>}

          {/* 사용자 ID */}
          <div>
            <label htmlFor='userId' className='block text-sm font-medium text-gray-700'>
              사용자 ID
            </label>
            <input
              id='userId'
              type='text'
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder='아이디를 입력하세요'
              className='mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
              disabled={isLoading}
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              비밀번호
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='비밀번호를 입력하세요'
              className='mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
              disabled={isLoading}
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type='submit'
            disabled={isLoading || !userId || !password}
            className='w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400'
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 하단 안내 */}
        <div className='mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600'>
          <p>테스트용 계정: admin / admin</p>
        </div>
      </div>
    </div>
  )
}
