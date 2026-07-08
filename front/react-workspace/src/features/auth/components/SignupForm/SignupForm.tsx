import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { useEffect, useState } from 'react'

import styles from './SignupForm.module.css'
import type { SignupFormProps } from './SignupForm.type'

const USER_ID_PATTERN = /^[a-zA-Z0-9]{4,20}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 재전송 쿨다운(10분)은 "9:59"부터 "0:00"까지 카운트다운하는 표기 관례를 따른다.
const OTP_RESEND_COOLDOWN_SECONDS = 599

type UserIdCheckState = 'idle' | 'checking' | 'available' | 'duplicate'
type OtpSendState = 'idle' | 'sending' | 'sent' | 'error'

function formatCooldown(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

export function SignupForm({
  onCheckUserId,
  onSendOtp,
  onSubmit,
  isSubmitting,
  errorMessage,
}: SignupFormProps) {
  const [userId, setUserId] = useState('')
  const [userIdCheckState, setUserIdCheckState] = useState<UserIdCheckState>('idle')
  const [userEmail, setUserEmail] = useState('')
  const [otpSendState, setOtpSendState] = useState<OtpSendState>('idle')
  const [otpCode, setOtpCode] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [userName, setUserName] = useState('')
  const [userNameTouched, setUserNameTouched] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const passwordLengthValid = password === '' || (password.length >= 8 && password.length <= 12)
  const passwordConfirmValid = passwordConfirm === '' || passwordConfirm === password

  const userEmailFormatValid = userEmail === '' || EMAIL_PATTERN.test(userEmail)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown(prev => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resendCooldown > 0])

  const handleUserEmailChange = (value: string) => {
    setUserEmail(value)
    setOtpSendState('idle')
    setOtpCode('')
    setResendCooldown(0)
  }

  const handleSendOtp = async () => {
    setOtpSendState('sending')
    try {
      await onSendOtp(userEmail)
      setOtpSendState('sent')
      setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS)
    } catch {
      setOtpSendState('error')
    }
  }

  const otpButtonLabel =
    otpSendState !== 'sent'
      ? '인증요청'
      : resendCooldown > 0
        ? `재전송 ${formatCooldown(resendCooldown)}`
        : '재전송'

  const otpEmailHint =
    otpSendState === 'sent'
      ? '인증번호를 발송했어요'
      : otpSendState === 'error'
        ? '이미 가입된 이메일이에요'
        : undefined

  const userIdFormatValid = userId === '' || USER_ID_PATTERN.test(userId)

  const handleUserIdChange = (value: string) => {
    setUserId(value)
    setUserIdCheckState('idle')
  }

  const handleCheckUserId = async () => {
    setUserIdCheckState('checking')
    const available = await onCheckUserId(userId)
    setUserIdCheckState(available ? 'available' : 'duplicate')
  }

  const userIdHint =
    userIdCheckState === 'available'
      ? '사용 가능한 아이디예요'
      : userIdCheckState === 'duplicate'
        ? '이미 사용 중인 아이디예요'
        : undefined

  const canSubmit =
    userIdCheckState === 'available' &&
    otpSendState === 'sent' &&
    userName !== '' &&
    passwordLengthValid &&
    password !== '' &&
    passwordConfirmValid &&
    passwordConfirm !== '' &&
    otpCode !== ''

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ userId, userName, password, userEmail, otpCode })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMessage && (
        <div className={styles.banner} role='alert'>
          {errorMessage}
        </div>
      )}
      <div className={styles.fieldRow}>
        <Input
          label='아이디'
          placeholder='영문/숫자 4~20자'
          autoComplete='off'
          value={userId}
          onValueChange={handleUserIdChange}
          error={userIdFormatValid ? undefined : '영문/숫자 4~20자로 입력해주세요'}
        />
        <Button
          type='button'
          variant='accent'
          disabled={!userIdFormatValid || userId === '' || userIdCheckState !== 'idle'}
          loading={userIdCheckState === 'checking'}
          onClick={handleCheckUserId}
        >
          중복확인
        </Button>
      </div>
      {userIdHint && (
        <p
          className={[
            styles.hint,
            userIdCheckState === 'available' ? styles.hintSuccess : styles.hintError,
          ].join(' ')}
        >
          {userIdHint}
        </p>
      )}

      <div className={styles.fieldRow}>
        <Input
          label='이메일'
          type='email'
          placeholder='you@example.com'
          autoComplete='email'
          value={userEmail}
          onValueChange={handleUserEmailChange}
        />
        <Button
          type='button'
          variant='accent'
          disabled={
            !userEmailFormatValid ||
            userEmail === '' ||
            otpSendState === 'sending' ||
            (otpSendState === 'sent' && resendCooldown > 0)
          }
          loading={otpSendState === 'sending'}
          onClick={handleSendOtp}
        >
          {otpButtonLabel}
        </Button>
      </div>
      {otpEmailHint && (
        <p
          className={[
            styles.hint,
            otpSendState === 'sent' ? styles.hintSuccess : styles.hintError,
          ].join(' ')}
        >
          {otpEmailHint}
        </p>
      )}

      {otpSendState === 'sent' && (
        <Input
          label='인증번호'
          maxLength={6}
          placeholder='6자리 숫자'
          autoComplete='one-time-code'
          value={otpCode}
          onValueChange={setOtpCode}
        />
      )}

      <Input
        label='이름'
        placeholder='이름을 입력해주세요'
        autoComplete='name'
        value={userName}
        onValueChange={setUserName}
        onBlur={() => setUserNameTouched(true)}
        error={userNameTouched && userName === '' ? '이름을 입력해주세요' : undefined}
      />

      <Input
        label='비밀번호'
        type='password'
        placeholder='8~12자로 입력해주세요'
        autoComplete='new-password'
        value={password}
        onValueChange={setPassword}
        error={passwordLengthValid ? undefined : '비밀번호는 8~12자로 입력해주세요'}
      />

      <Input
        label='비밀번호 확인'
        type='password'
        placeholder='비밀번호를 한 번 더 입력해주세요'
        autoComplete='new-password'
        value={passwordConfirm}
        onValueChange={setPasswordConfirm}
        error={passwordConfirmValid ? undefined : '비밀번호가 일치하지 않아요'}
      />

      <Button
        type='submit'
        variant='primary'
        fullWidth
        disabled={!canSubmit}
        loading={isSubmitting}
      >
        회원가입
      </Button>
      {!canSubmit && <p className={styles.hint}>아이디 중복확인과 이메일 인증을 완료해주세요</p>}
    </form>
  )
}
