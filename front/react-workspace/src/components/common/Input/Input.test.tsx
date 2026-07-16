import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Input } from './Input'

describe('Input', () => {
  describe('렌더링', () => {
    it('기본 type text로 렌더링됩니다', () => {
      render(<Input placeholder='입력' />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('placeholder를 표시합니다', () => {
      render(<Input placeholder='이름을 입력하세요' />)
      expect(screen.getByPlaceholderText('이름을 입력하세요')).toBeInTheDocument()
    })

    it('id를 전달하면 해당 id를 가집니다', () => {
      render(<Input id='name-input' placeholder='이름' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'name-input')
    })

    it('label이 있으면 라벨을 렌더링합니다', () => {
      render(<Input label='아이디' placeholder='입력' />)
      expect(screen.getByText('아이디')).toBeInTheDocument()
      expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    })

    it('label과 required가 있으면 필수 표시를 렌더링합니다', () => {
      render(<Input label='이메일' required placeholder='입력' />)
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('error가 있으면 에러 메시지를 렌더링합니다', () => {
      render(<Input error='올바른 형식이 아닙니다.' placeholder='입력' />)
      expect(screen.getByRole('alert')).toHaveTextContent('올바른 형식이 아닙니다.')
    })
  })

  describe('variant', () => {
    it.each(['primary', 'secondary', 'tertiary'] as const)('%s variant로 렌더링됩니다', variant => {
      render(<Input variant={variant} placeholder='테스트' />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('size', () => {
    it.each(['sm', 'md', 'lg'] as const)('%s 크기로 렌더링됩니다', size => {
      render(<Input size={size} placeholder='테스트' />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('상태', () => {
    it('disabled일 때 비활성화됩니다', () => {
      render(<Input disabled placeholder='비활성' />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('readOnly일 때 읽기 전용입니다', () => {
      render(<Input readOnly placeholder='읽기 전용' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })
  })

  describe('제어 컴포넌트', () => {
    it('value와 onChange로 제어됩니다', () => {
      const handleChange = vi.fn()
      render(<Input value='초기값' onChange={handleChange} placeholder='제어' />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('초기값')
      fireEvent.change(input, { target: { value: '변경' } })
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('onBlur가 호출됩니다', () => {
      const handleBlur = vi.fn()
      render(<Input onBlur={handleBlur} placeholder='blur' />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('접근성', () => {
    it('aria-invalid를 전달할 수 있습니다', () => {
      render(<Input aria-invalid placeholder='오류' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('aria-describedby를 전달할 수 있습니다', () => {
      render(<Input aria-describedby='hint-id' placeholder='설명' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'hint-id')
    })
  })

  describe('폼 속성', () => {
    it('name을 전달할 수 있습니다', () => {
      render(<Input name='email' placeholder='이메일' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email')
    })

    it('required를 전달할 수 있습니다', () => {
      render(<Input required placeholder='필수' />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })

    it('maxLength를 전달할 수 있습니다', () => {
      render(<Input maxLength={10} placeholder='최대 10자' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10')
    })
  })

  describe('type', () => {
    it('type email을 전달할 수 있습니다', () => {
      render(<Input type='email' placeholder='이메일' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    })

    it('type password일 때 role이 다릅니다', () => {
      render(<Input type='password' placeholder='비밀번호' />)
      const input = document.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'password')
    })
  })
})
