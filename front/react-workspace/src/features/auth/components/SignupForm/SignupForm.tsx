import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { useState } from 'react'

import styles from './SignupForm.module.css'
import type { SignupFormProps } from './SignupForm.type'

const USER_ID_PATTERN = /^[a-zA-Z0-9]{4,20}$/

type UserIdCheckState = 'idle' | 'checking' | 'available' | 'duplicate'

export function SignupForm({ onCheckUserId }: SignupFormProps) {
  const [userId, setUserId] = useState('')
  const [userIdCheckState, setUserIdCheckState] = useState<UserIdCheckState>('idle')

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

  return (
    <form className={styles.form}>
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
    </form>
  )
}
