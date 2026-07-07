import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { LoginForm } from './LoginForm'

function renderLoginForm(props: Parameters<typeof LoginForm>[0]) {
  return render(
    <MemoryRouter>
      <LoginForm {...props} />
    </MemoryRouter>,
  )
}

describe('LoginForm', () => {
  it('아이디, 비밀번호 필드와 로그인 버튼을 렌더링한다', () => {
    renderLoginForm({ onSubmit: vi.fn(), isSubmitting: false })

    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('빈 값으로 제출하면 인라인 에러를 표시하고 onSubmit을 호출하지 않는다', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    renderLoginForm({ onSubmit: handleSubmit, isSubmitting: false })

    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('아이디를 입력해주세요.')).toBeInTheDocument()
    expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('유효한 값으로 제출하면 onSubmit에 입력값을 전달한다', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    renderLoginForm({ onSubmit: handleSubmit, isSubmitting: false })

    await user.type(screen.getByLabelText('아이디'), 'admin')
    await user.type(screen.getByLabelText('비밀번호'), 'secret')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(handleSubmit).toHaveBeenCalledWith({ id: 'admin', password: 'secret' })
  })

  it('제출 중(isSubmitting)에는 제출 버튼이 비활성화된다', () => {
    renderLoginForm({ onSubmit: vi.fn(), isSubmitting: true })

    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled()
  })

  it('errorMessage가 있으면 폼 상단에 배너로 표시한다', () => {
    renderLoginForm({
      onSubmit: vi.fn(),
      isSubmitting: false,
      errorMessage: '아이디 또는 비밀번호가 일치하지 않습니다',
    })

    expect(screen.getByRole('alert')).toHaveTextContent('아이디 또는 비밀번호가 일치하지 않습니다')
  })

  it('회원가입, 비밀번호 찾기로 이동하는 링크를 렌더링한다', () => {
    renderLoginForm({ onSubmit: vi.fn(), isSubmitting: false })

    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup')
    expect(screen.getByRole('link', { name: '비밀번호를 잊으셨나요?' })).toHaveAttribute(
      'href',
      '/password-reset',
    )
  })
})
