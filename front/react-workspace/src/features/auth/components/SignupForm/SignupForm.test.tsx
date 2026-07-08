import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SignupForm } from './SignupForm'

function renderSignupForm(props: Parameters<typeof SignupForm>[0]) {
  return render(<SignupForm {...props} />)
}

describe('SignupForm', () => {
  it('아이디 입력 필드와 중복확인 버튼을 렌더링한다', () => {
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중복확인' })).toBeInTheDocument()
  })

  it('아이디 형식이 올바르지 않으면 인라인 에러를 표시하고 중복확인 버튼을 비활성화한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('아이디'), 'ab')

    expect(screen.getByText('영문/숫자 4~20자로 입력해주세요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중복확인' })).toBeDisabled()
  })

  it('아이디 형식이 올바르면 중복확인 버튼을 활성화한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('아이디'), 'hongjeaho')

    expect(screen.getByRole('button', { name: '중복확인' })).toBeEnabled()
  })

  it('중복확인 클릭 시 onCheckUserId를 호출하고, 사용 가능하면 성공 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    const handleCheckUserId = vi.fn().mockResolvedValue(true)
    renderSignupForm({
      onCheckUserId: handleCheckUserId,
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('아이디'), 'hongjeaho')
    await user.click(screen.getByRole('button', { name: '중복확인' }))

    expect(handleCheckUserId).toHaveBeenCalledWith('hongjeaho')
    expect(await screen.findByText('사용 가능한 아이디예요')).toBeInTheDocument()
  })

  it('중복확인 결과가 중복이면 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    const handleCheckUserId = vi.fn().mockResolvedValue(false)
    renderSignupForm({
      onCheckUserId: handleCheckUserId,
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('아이디'), 'admin1234')
    await user.click(screen.getByRole('button', { name: '중복확인' }))

    expect(await screen.findByText('이미 사용 중인 아이디예요')).toBeInTheDocument()
  })

  it('중복확인 통과 후 아이디를 수정하면 확인 상태가 초기화된다', async () => {
    const user = userEvent.setup()
    const handleCheckUserId = vi.fn().mockResolvedValue(true)
    renderSignupForm({
      onCheckUserId: handleCheckUserId,
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('아이디'), 'hongjeaho')
    await user.click(screen.getByRole('button', { name: '중복확인' }))
    expect(await screen.findByText('사용 가능한 아이디예요')).toBeInTheDocument()

    await user.type(screen.getByLabelText('아이디'), '1')

    expect(screen.queryByText('사용 가능한 아이디예요')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중복확인' })).toBeEnabled()
  })

  it('이메일 입력 필드와 인증요청 버튼을 렌더링한다', () => {
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '인증요청' })).toBeInTheDocument()
  })

  it('이메일 형식이 올바르지 않으면 인증요청 버튼을 비활성화한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('이메일'), 'not-an-email')

    expect(screen.getByRole('button', { name: '인증요청' })).toBeDisabled()
  })

  it('이메일 형식이 올바르면 인증요청 버튼을 활성화한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('이메일'), 'hongjeaho@example.com')

    expect(screen.getByRole('button', { name: '인증요청' })).toBeEnabled()
  })

  it('인증요청 클릭 시 onSendOtp를 호출하고, 성공하면 인증번호 입력 필드와 성공 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    const handleSendOtp = vi.fn().mockResolvedValue(undefined)
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: handleSendOtp,
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    expect(screen.queryByLabelText('인증번호')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('이메일'), 'hongjeaho@example.com')
    await user.click(screen.getByRole('button', { name: '인증요청' }))

    expect(handleSendOtp).toHaveBeenCalledWith('hongjeaho@example.com')
    expect(await screen.findByText('인증번호를 발송했어요')).toBeInTheDocument()
    expect(screen.getByLabelText('인증번호')).toBeInTheDocument()
  })

  it('이미 가입된 이메일로 인증요청을 하면 에러 메시지를 표시하고 재시도할 수 있다', async () => {
    const user = userEvent.setup()
    const handleSendOtp = vi.fn().mockRejectedValue(new Error('이미 가입된 이메일'))
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: handleSendOtp,
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('이메일'), 'taken@example.com')
    await user.click(screen.getByRole('button', { name: '인증요청' }))

    expect(await screen.findByText('이미 가입된 이메일이에요')).toBeInTheDocument()
    expect(screen.queryByLabelText('인증번호')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '인증요청' })).toBeEnabled()
  })

  it('발송 성공 후 이메일을 수정하면 발송 상태와 인증번호 필드가 초기화된다', async () => {
    const user = userEvent.setup()
    const handleSendOtp = vi.fn().mockResolvedValue(undefined)
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: handleSendOtp,
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('이메일'), 'hongjeaho@example.com')
    await user.click(screen.getByRole('button', { name: '인증요청' }))
    expect(await screen.findByText('인증번호를 발송했어요')).toBeInTheDocument()
    await user.type(screen.getByLabelText('인증번호'), '123456')

    await user.type(screen.getByLabelText('이메일'), '.kr')

    expect(screen.queryByText('인증번호를 발송했어요')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('인증번호')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '인증요청' })).toBeEnabled()
  })

  it('발송 성공 후 버튼이 재전송 카운트다운을 표시하다가 완료되면 재전송으로 활성화된다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup()
    const handleSendOtp = vi.fn().mockResolvedValue(undefined)
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: handleSendOtp,
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('이메일'), 'hongjeaho@example.com')
    await user.click(screen.getByRole('button', { name: '인증요청' }))
    await screen.findByText('인증번호를 발송했어요')

    expect(screen.getByRole('button', { name: '재전송 9:59' })).toBeDisabled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600 * 1000)
    })

    expect(screen.getByRole('button', { name: '재전송' })).toBeEnabled()

    vi.useRealTimers()
  })

  it('이름 필드를 렌더링하고, 비어있으면 인라인 에러를 표시한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    expect(screen.getByLabelText('이름')).toBeInTheDocument()

    await user.click(screen.getByLabelText('이름'))
    await user.tab()

    expect(screen.getByText('이름을 입력해주세요')).toBeInTheDocument()
  })

  it('비밀번호가 8~12자를 벗어나면 인라인 에러를 표시한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('비밀번호', { exact: true }), 'short1')

    expect(screen.getByText('비밀번호는 8~12자로 입력해주세요')).toBeInTheDocument()
  })

  it('비밀번호 확인이 비밀번호와 다르면 인라인 에러를 표시한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('비밀번호', { exact: true }), 'password1')
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password2')

    expect(screen.getByText('비밀번호가 일치하지 않아요')).toBeInTheDocument()
  })

  it('아이디 확인과 이메일 인증을 마치기 전에는 제출 버튼이 비활성화되고 안내 문구를 보여준다', () => {
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
    })

    expect(screen.getByRole('button', { name: '회원가입' })).toBeDisabled()
    expect(screen.getByText('아이디 중복확인과 이메일 인증을 완료해주세요')).toBeInTheDocument()
  })

  it('모든 조건을 충족하면 제출 버튼이 활성화되고, 클릭 시 onSubmit에 입력값을 전달한다', async () => {
    const user = userEvent.setup()
    const handleCheckUserId = vi.fn().mockResolvedValue(true)
    const handleSendOtp = vi.fn().mockResolvedValue(undefined)
    const handleSubmit = vi.fn()
    renderSignupForm({
      onCheckUserId: handleCheckUserId,
      onSendOtp: handleSendOtp,
      onSubmit: handleSubmit,
      isSubmitting: false,
    })

    await user.type(screen.getByLabelText('아이디'), 'hongjeaho')
    await user.click(screen.getByRole('button', { name: '중복확인' }))
    await screen.findByText('사용 가능한 아이디예요')

    await user.type(screen.getByLabelText('이메일'), 'hongjeaho@example.com')
    await user.click(screen.getByRole('button', { name: '인증요청' }))
    await screen.findByText('인증번호를 발송했어요')

    await user.type(screen.getByLabelText('이름'), '홍재호')
    await user.type(screen.getByLabelText('비밀번호', { exact: true }), 'password1')
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password1')
    await user.type(screen.getByLabelText('인증번호'), '123456')

    expect(screen.getByRole('button', { name: '회원가입' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: '회원가입' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      userId: 'hongjeaho',
      userName: '홍재호',
      password: 'password1',
      userEmail: 'hongjeaho@example.com',
      otpCode: '123456',
    })
  })

  it('errorMessage가 있으면 폼 상단에 배너로 표시한다', () => {
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: false,
      errorMessage: '인증번호가 올바르지 않거나 만료됐어요. 다시 시도해주세요.',
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      '인증번호가 올바르지 않거나 만료됐어요. 다시 시도해주세요.',
    )
  })

  it('제출 중(isSubmitting)에는 제출 버튼이 비활성화된다', () => {
    renderSignupForm({
      onCheckUserId: vi.fn(),
      onSendOtp: vi.fn(),
      onSubmit: vi.fn(),
      isSubmitting: true,
    })

    expect(screen.getByRole('button', { name: '회원가입' })).toBeDisabled()
  })
})
