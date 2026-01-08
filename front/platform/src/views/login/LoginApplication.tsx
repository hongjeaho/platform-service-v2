import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/common/components/ui/button'
import { FormInput } from '@/common/components/ui/input'
import { useAuth } from '@/common/hooks/auth/useAuth'
import { useLogin } from '@/gen/hooks/public-authority-api/public-authority-api'

import styles from './LoginApplication.module.css'

/**
 * 로그인 폼 데이터 인터페이스
 */
interface LoginFormData {
  id: string
  password: string
}

/**
 * LoginApplication 컴포넌트
 *
 * 디자인 시스템을 준수하는 로그인 컴포넌트입니다.
 * React Hook Form으로 폼 상태를 관리하고, useLogin API 훅으로 인증을 처리합니다.
 */
const LoginApplication = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    mode: 'onBlur',
    defaultValues: {
      id: '',
      password: '',
    },
  })
  const { mutate: login, isPending } = useLogin()
  const { login: setAuthUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: LoginFormData) => {
    login(
      { data: { id: data.id, password: data.password } },
      {
        onSuccess: authUser => {
          // 1. useAuth로 사용자 상태 저장
          setAuthUser(authUser)
          // 2. JWT 토큰은 HTTP 인터셉터가 자동 저장
          // 3. 홈으로 이동
          navigate('/', { replace: true })
        },
        onError: (error: any) => {
          if (error.response?.status === 401) {
            setError('root', {
              type: 'manual',
              message: '아이디 또는 비밀번호가 올바르지 않습니다.',
            })
          } else {
            setError('root', {
              type: 'manual',
              message: '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            })
          }
        },
      },
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.description}>정부 토지보상 심의 시스템에 오신 것을 환영합니다.</p>
        </div>

        {/* API 에러 메시지 */}
        {errors.root && (
          <div className={styles.formError} role='alert'>
            {errors.root.message}
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          {/* ID 입력 필드 */}
          <FormInput
            name='id'
            control={control}
            label='아이디'
            placeholder='아이디 입력'
            rules={{
              required: '아이디를 입력해주세요.',
              minLength: { value: 3, message: '아이디는 3자 이상 입력해주세요.' },
            }}
          />

          {/* Password 입력 필드 */}
          <div className={styles.passwordField}>
            <FormInput
              name='password'
              control={control}
              label='비밀번호'
              placeholder='비밀번호 입력'
              type={showPassword ? 'text' : 'password'}
              rules={{
                required: '비밀번호를 입력해주세요.',
                minLength: { value: 4, message: '비밀번호는 4자 이상 입력해주세요.' },
              }}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className={styles.toggleButton}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* 제출 버튼 */}
          <div className={styles.actions}>
            <Button
              type='submit'
              variant='primary'
              size='lg'
              isLoading={isPending}
              disabled={isPending}
              className={styles.submitButton}
            >
              로그인
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginApplication
