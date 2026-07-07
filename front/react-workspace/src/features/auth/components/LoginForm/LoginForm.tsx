import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { useState } from 'react'
import { Link } from 'react-router'

import styles from './LoginForm.module.css'
import type { LoginFormProps } from './LoginForm.type'

interface FieldErrors {
  id?: string
  password?: string
}

export function LoginForm({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const errors: FieldErrors = {}
    if (!id.trim()) errors.id = '아이디를 입력해주세요.'
    if (!password.trim()) errors.password = '비밀번호를 입력해주세요.'

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    onSubmit({ id, password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {errorMessage && (
        <div className={styles.banner} role='alert'>
          {errorMessage}
        </div>
      )}
      <Input
        label='아이디'
        placeholder='아이디를 입력하세요'
        autoComplete='username'
        value={id}
        onValueChange={setId}
        error={fieldErrors.id}
      />
      <Input
        label='비밀번호'
        type='password'
        placeholder='비밀번호를 입력하세요'
        autoComplete='current-password'
        value={password}
        onValueChange={setPassword}
        error={fieldErrors.password}
      />
      <Button type='submit' variant='primary' fullWidth loading={isSubmitting}>
        로그인
      </Button>

      <div className={styles.links}>
        <Link to='/signup'>회원가입</Link>
        <span className={styles.linkDivider} aria-hidden='true'>
          ·
        </span>
        <Link to='/password-reset'>비밀번호를 잊으셨나요?</Link>
      </div>
    </form>
  )
}
