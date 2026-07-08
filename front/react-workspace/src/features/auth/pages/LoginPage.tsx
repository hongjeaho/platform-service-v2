import { AuthLayout } from '@components/layout/AuthLayout'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { selectLogin, useAuthStore } from '@/store/auth/authStore'

import { LoginForm } from '../components/LoginForm'
import { useLogin } from '../hooks/useLogin'
import styles from './LoginPage.module.css'

interface LoginRedirectState {
  from?: { pathname: string }
  message?: string
}

/**
 * 로그인 페이지.
 *
 * React Router lazy 로딩 컨벤션에 따라 `Component`로 export한다.
 */
export function Component() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore(selectLogin)
  const { mutate, isPending } = useLogin()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const redirectState = location.state as LoginRedirectState | null

  const handleSubmit = (values: { id: string; password: string }) => {
    setErrorMessage(null)
    mutate(values, {
      onSuccess: result => {
        login(result.user, result.token)
        navigate(redirectState?.from?.pathname ?? '/', { replace: true })
      },
      onError: () => {
        setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다')
      },
    })
  }

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>로그인</h1>
        <p>다시 오신 것을 환영합니다</p>
      </div>
      {redirectState?.message && (
        <div className={styles.successBanner} role='status'>
          {redirectState.message}
        </div>
      )}
      <LoginForm onSubmit={handleSubmit} isSubmitting={isPending} errorMessage={errorMessage} />
    </AuthLayout>
  )
}
