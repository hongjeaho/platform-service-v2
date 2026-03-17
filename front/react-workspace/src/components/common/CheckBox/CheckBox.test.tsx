import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckBox } from './CheckBox'

describe('CheckBox', () => {
  describe('렌더링', () => {
    it('checkbox로 렌더링됩니다', () => {
      render(<CheckBox textValue='옵션' />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })

    it('id를 전달하면 해당 id를 가집니다', () => {
      render(<CheckBox id='agree-input' textValue='동의' />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'agree-input')
    })

    it('textValue를 표시합니다', () => {
      render(<CheckBox textValue='이용약관에 동의합니다' />)
      expect(screen.getByText('이용약관에 동의합니다')).toBeInTheDocument()
    })
  })

  describe('variant', () => {
    it.each([
      ['primary', 'Primary'],
      ['secondary', 'Secondary'],
      ['tertiary', 'Tertiary'],
    ] as const)('%s variant로 렌더링됩니다', variant => {
      render(<CheckBox variant={variant} textValue='테스트' />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })
  })

  describe('size', () => {
    it.each([
      ['sm', 'Small'],
      ['md', 'Medium'],
      ['lg', 'Large'],
    ] as const)('%s 크기로 렌더링됩니다', size => {
      render(<CheckBox size={size} textValue='테스트' />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })
  })

  describe('상태', () => {
    it('disabled일 때 비활성화됩니다', () => {
      render(<CheckBox disabled textValue='비활성' />)
      expect(screen.getByRole('checkbox')).toBeDisabled()
    })

    it('checked를 전달하면 체크된 상태로 렌더링됩니다', () => {
      render(<CheckBox checked textValue='체크됨' />)
      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })

  describe('제어 컴포넌트', () => {
    it('checked와 onChange로 제어됩니다', () => {
      const handleChange = vi.fn()
      render(<CheckBox checked={false} onChange={handleChange} textValue='제어' />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      fireEvent.click(checkbox)
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('onValueChange가 체크 시 value와 함께 호출됩니다', () => {
      const onValueChange = vi.fn()
      render(<CheckBox value='agree' onValueChange={onValueChange} textValue='동의' />)
      fireEvent.click(screen.getByRole('checkbox'))
      expect(onValueChange).toHaveBeenCalledWith('agree')
    })

    it('onBlur가 호출됩니다', () => {
      const handleBlur = vi.fn()
      render(<CheckBox onBlur={handleBlur} textValue='blur' />)
      fireEvent.blur(screen.getByRole('checkbox'))
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('접근성', () => {
    it('aria-describedby를 전달할 수 있습니다', () => {
      render(<CheckBox aria-describedby='hint-id' textValue='설명' />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'hint-id')
    })
  })

  describe('폼 속성', () => {
    it('name을 전달할 수 있습니다', () => {
      render(<CheckBox name='agree' textValue='동의' />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'agree')
    })

    it('value를 전달할 수 있습니다', () => {
      render(<CheckBox value='terms' textValue='약관' />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'terms')
    })
  })
})
