import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Textarea } from './Textarea'

describe('Textarea', () => {
  describe('렌더링', () => {
    it('textarea로 렌더링됩니다', () => {
      render(<Textarea placeholder='입력' />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('placeholder를 표시합니다', () => {
      render(<Textarea placeholder='내용을 입력하세요' />)
      expect(screen.getByPlaceholderText('내용을 입력하세요')).toBeInTheDocument()
    })

    it('id를 전달하면 해당 id를 가집니다', () => {
      render(<Textarea id='desc-textarea' placeholder='설명' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'desc-textarea')
    })

    it('label이 있으면 라벨을 렌더링합니다', () => {
      render(<Textarea label='설명' placeholder='입력' />)
      expect(screen.getByText('설명')).toBeInTheDocument()
      expect(screen.getByLabelText('설명')).toBeInTheDocument()
    })

    it('label과 required가 있으면 필수 표시를 렌더링합니다', () => {
      render(<Textarea label='설명' required placeholder='입력' />)
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('error가 있으면 에러 메시지를 렌더링합니다', () => {
      render(<Textarea error='최소 10자 이상 입력해 주세요.' placeholder='입력' />)
      expect(screen.getByRole('alert')).toHaveTextContent('최소 10자 이상 입력해 주세요.')
    })
  })

  describe('variant', () => {
    it.each([
      ['primary', 'Primary'],
      ['secondary', 'Secondary'],
      ['tertiary', 'Tertiary'],
    ] as const)('%s variant로 렌더링됩니다', variant => {
      render(<Textarea variant={variant} placeholder='테스트' />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('size', () => {
    it.each([
      ['sm', 'Small'],
      ['md', 'Medium'],
      ['lg', 'Large'],
    ] as const)('%s 크기로 렌더링됩니다', size => {
      render(<Textarea size={size} placeholder='테스트' />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('상태', () => {
    it('disabled일 때 비활성화됩니다', () => {
      render(<Textarea disabled placeholder='비활성' />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('readOnly일 때 읽기 전용입니다', () => {
      render(<Textarea readOnly placeholder='읽기 전용' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })
  })

  describe('제어 컴포넌트', () => {
    it('value와 onChange로 제어됩니다', () => {
      const handleChange = vi.fn()
      render(<Textarea value='초기값' onChange={handleChange} placeholder='제어' />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('초기값')
      fireEvent.change(textarea, { target: { value: '변경' } })
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('onValueChange가 호출됩니다', () => {
      const onValueChange = vi.fn()
      render(<Textarea onValueChange={onValueChange} placeholder='제어' />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '새 값' } })
      expect(onValueChange).toHaveBeenCalledWith('새 값')
    })

    it('onBlur가 호출됩니다', () => {
      const handleBlur = vi.fn()
      render(<Textarea onBlur={handleBlur} placeholder='blur' />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('접근성', () => {
    it('error가 있으면 aria-invalid가 설정됩니다', () => {
      render(<Textarea error='오류 메시지' placeholder='오류' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('aria-describedby를 전달할 수 있습니다', () => {
      render(<Textarea aria-describedby='hint-id' placeholder='설명' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'hint-id')
    })
  })

  describe('폼 속성', () => {
    it('name을 전달할 수 있습니다', () => {
      render(<Textarea name='description' placeholder='설명' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'description')
    })

    it('required를 전달할 수 있습니다', () => {
      render(<Textarea required placeholder='필수' />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })

    it('maxLength를 전달할 수 있습니다', () => {
      render(<Textarea maxLength={500} placeholder='최대 500자' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '500')
    })
  })
})
