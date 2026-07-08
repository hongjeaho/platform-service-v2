import { AuthLayout } from '@components/layout/AuthLayout'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { SignupForm } from '../components/SignupForm'
import { useCheckUserId } from '../hooks/useCheckUserId'
import { useSendSignupOtp } from '../hooks/useSendSignupOtp'
import { useSignup } from '../hooks/useSignup'
import styles from './SignupPage.module.css'

/**
 * 회원가입 페이지.
 *
 * React Router lazy 로딩 컨벤션에 따라 `Component`로 export한다.
 */
export function Component() {
  const navigate = useNavigate()
  const { mutateAsync: checkUserId } = useCheckUserId()
  const { mutateAsync: sendOtp } = useSendSignupOtp()
  const { mutate: submitSignup, isPending } = useSignup()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = (values: {
    userId: string
    userName: string
    password: string
    userEmail: string
    otpCode: string
  }) => {
    setErrorMessage(null)
    submitSignup(values, {
      onSuccess: () => {
        navigate('/login', { state: { message: '회원가입이 완료됐어요. 로그인해주세요.' } })
      },
      onError: () => {
        setErrorMessage('인증번호가 올바르지 않거나 만료됐어요. 다시 시도해주세요.')
      },
    })
  }

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>회원가입</h1>
        <p>몇 가지 정보만 입력하면 시작할 수 있어요</p>
      </div>
      <SignupForm
        onCheckUserId={checkUserId}
        onSendOtp={sendOtp}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        errorMessage={errorMessage ?? undefined}
      />
    </AuthLayout>
  )
}
