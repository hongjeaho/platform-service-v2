import { render, screen } from '@testing-library/react'

import LoginApplication from './LoginApplication'

describe('LoginApplication', () => {
  it('로그인 폼이 렌더된다', () => {
    render(<LoginApplication />)
    expect(screen.getByRole('form', { name: /로그인/i })).toBeInTheDocument()
  })

  it('아이디 입력 필드가 있다', () => {
    render(<LoginApplication />)
    expect(screen.getByLabelText(/아이디/)).toBeInTheDocument()
  })

  it('비밀번호 입력 필드가 있다', () => {
    render(<LoginApplication />)
    expect(screen.getByLabelText(/비밀번호/)).toBeInTheDocument()
  })

  it('로그인 버튼이 있다', () => {
    render(<LoginApplication />)
    expect(screen.getByRole('button', { name: /로그인/ })).toBeInTheDocument()
  })
})
