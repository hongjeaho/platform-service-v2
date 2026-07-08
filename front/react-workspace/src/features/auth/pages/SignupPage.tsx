import { AuthLayout } from '@components/layout/AuthLayout'

import { SignupForm } from '../components/SignupForm'
import { useCheckUserId } from '../hooks/useCheckUserId'
import { useSendSignupOtp } from '../hooks/useSendSignupOtp'
import styles from './SignupPage.module.css'

/**
 * 회원가입 페이지.
 *
 * React Router lazy 로딩 컨벤션에 따라 `Component`로 export한다.
 */
export function Component() {
  const { mutateAsync: checkUserId } = useCheckUserId()
  const { mutateAsync: sendOtp } = useSendSignupOtp()

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>회원가입</h1>
        <p>몇 가지 정보만 입력하면 시작할 수 있어요</p>
      </div>
      <SignupForm onCheckUserId={checkUserId} onSendOtp={sendOtp} />
    </AuthLayout>
  )
}
