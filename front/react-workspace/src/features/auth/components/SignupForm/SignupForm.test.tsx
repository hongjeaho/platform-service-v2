import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SignupForm } from './SignupForm'

function renderSignupForm(props: Parameters<typeof SignupForm>[0]) {
  return render(<SignupForm {...props} />)
}

describe('SignupForm', () => {
  it('아이디 입력 필드와 중복확인 버튼을 렌더링한다', () => {
    renderSignupForm({ onCheckUserId: vi.fn() })

    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중복확인' })).toBeInTheDocument()
  })

  it('아이디 형식이 올바르지 않으면 인라인 에러를 표시하고 중복확인 버튼을 비활성화한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({ onCheckUserId: vi.fn() })

    await user.type(screen.getByLabelText('아이디'), 'ab')

    expect(screen.getByText('영문/숫자 4~20자로 입력해주세요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중복확인' })).toBeDisabled()
  })

  it('아이디 형식이 올바르면 중복확인 버튼을 활성화한다', async () => {
    const user = userEvent.setup()
    renderSignupForm({ onCheckUserId: vi.fn() })

    await user.type(screen.getByLabelText('아이디'), 'hongjeaho')

    expect(screen.getByRole('button', { name: '중복확인' })).toBeEnabled()
  })

  it('중복확인 클릭 시 onCheckUserId를 호출하고, 사용 가능하면 성공 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    const handleCheckUserId = vi.fn().mockResolvedValue(true)
    renderSignupForm({ onCheckUserId: handleCheckUserId })

    await user.type(screen.getByLabelText('아이디'), 'hongjeaho')
    await user.click(screen.getByRole('button', { name: '중복확인' }))

    expect(handleCheckUserId).toHaveBeenCalledWith('hongjeaho')
    expect(await screen.findByText('사용 가능한 아이디예요')).toBeInTheDocument()
  })

  it('중복확인 결과가 중복이면 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    const handleCheckUserId = vi.fn().mockResolvedValue(false)
    renderSignupForm({ onCheckUserId: handleCheckUserId })

    await user.type(screen.getByLabelText('아이디'), 'admin1234')
    await user.click(screen.getByRole('button', { name: '중복확인' }))

    expect(await screen.findByText('이미 사용 중인 아이디예요')).toBeInTheDocument()
  })

  it('중복확인 통과 후 아이디를 수정하면 확인 상태가 초기화된다', async () => {
    const user = userEvent.setup()
    const handleCheckUserId = vi.fn().mockResolvedValue(true)
    renderSignupForm({ onCheckUserId: handleCheckUserId })

    await user.type(screen.getByLabelText('아이디'), 'hongjeaho')
    await user.click(screen.getByRole('button', { name: '중복확인' }))
    expect(await screen.findByText('사용 가능한 아이디예요')).toBeInTheDocument()

    await user.type(screen.getByLabelText('아이디'), '1')

    expect(screen.queryByText('사용 가능한 아이디예요')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '중복확인' })).toBeEnabled()
  })
})
