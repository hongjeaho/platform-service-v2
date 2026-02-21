import { Box, Button, FormInput } from '@/common/components/ui'
import { borderRadius, containerSizes, gap, margin, padding } from '@/constants/design/spacing'
import { cn } from '@/lib/utils'

import type { LoginFormValues } from './hooks/useLoginForm'
import { useLoginForm } from './hooks/useLoginForm'
import styles from './LoginApplication.module.css'

export default function LoginApplication() {
  const { control, handleSubmit } = useLoginForm()

  const onSubmit = (data: LoginFormValues) => {
    // 백엔드 연동 시 별도 작업 (data 사용 예정)
    void data
  }

  return (
    <Box
      direction='column'
      align='center'
      justify='center'
      className={cn(styles.wrapper, 'w-full')}
    >
      <Box
        as='section'
        className={cn(
          styles.card,
          containerSizes.md,
          padding.cardLg,
          borderRadius.lg,
          'border border-border bg-card',
        )}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn(styles.form, 'flex flex-col', gap.default, margin.formField)}
          aria-label='로그인 폼'
        >
          <FormInput
            name='id'
            control={control}
            label='아이디'
            placeholder='아이디 입력'
            rules={{ required: '아이디를 입력해주세요.' }}
          />
          <FormInput
            name='password'
            control={control}
            type='password'
            label='비밀번호'
            placeholder='비밀번호 입력'
            rules={{ required: '비밀번호를 입력해주세요.' }}
          />
          <Button type='submit' variant='primary'>
            로그인
          </Button>
        </form>
      </Box>
    </Box>
  )
}
