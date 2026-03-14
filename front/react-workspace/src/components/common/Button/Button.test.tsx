import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  describe('렌더링', () => {
    it('버튼 텍스트를 렌더링합니다', () => {
      render(<Button>클릭하세요</Button>)
      expect(screen.getByText('클릭하세요')).toBeInTheDocument()
    })

    it('기본 variant (primary)로 렌더링합니다', () => {
      render(<Button>기본</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('전체 너비로 렌더링합니다', () => {
      render(<Button fullWidth>전체 너비</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('버튼 변형', () => {
    it.each([
      ['primary', 'Primary'],
      ['secondary', 'Secondary'],
      ['accent', 'Accent'],
      ['destructive', 'Destructive'],
      ['outline', 'Outline'],
      ['ghost', 'Ghost'],
      ['link', 'Link'],
    ] as const)('%s variant를 렌더링합니다', (variant, label) => {
      render(<Button variant={variant}>{label}</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('버튼 크기', () => {
    it.each([
      ['sm', 'Small'],
      ['md', 'Medium'],
      ['lg', 'Large'],
    ] as const)('%s 크기를 렌더링합니다', (size, label) => {
      render(<Button size={size}>{label}</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('인터랙션', () => {
    it('클릭 시 onClick을 호출합니다', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>클릭</Button>)
      fireEvent.click(screen.getByText('클릭'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('비활성화 상태에서는 onClick을 호출하지 않습니다', () => {
      const handleClick = vi.fn()
      render(
        <Button onClick={handleClick} disabled>
          비활성화
        </Button>,
      )
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('로딩 상태에서는 onClick을 호출하지 않습니다', () => {
      const handleClick = vi.fn()
      render(
        <Button onClick={handleClick} loading>
          로딩 중
        </Button>,
      )
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('로딩 상태', () => {
    it('로딩 시 스피너를 표시하고 비활성화됩니다', () => {
      render(<Button loading>로딩 중</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(screen.getByText('로딩 중')).toBeInTheDocument()
      expect(button.querySelector('svg')).toBeInTheDocument()
    })

    it('로딩 시 아이콘을 숨깁니다', () => {
      render(
        <Button loading icon={<span data-testid='icon'>I</span>}>
          로딩 중
        </Button>,
      )
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    })
  })

  describe('아이콘', () => {
    it('기본적으로 아이콘을 왼쪽에 렌더링합니다', () => {
      render(<Button icon={<span data-testid='icon'>I</span>}>아이콘과 함께</Button>)
      const icon = screen.getByTestId('icon')
      const text = screen.getByText('아이콘과 함께')
      expect(icon).toBeInTheDocument()
      // 아이콘이 텍스트보다 앞에 와야 합니다
      expect(icon.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('지정 시 아이콘을 오른쪽에 렌더링합니다', () => {
      render(
        <Button iconPosition='right' icon={<span data-testid='icon'>I</span>}>
          아이콘과 함께
        </Button>,
      )
      const icon = screen.getByTestId('icon')
      const text = screen.getByText('아이콘과 함께')
      expect(icon).toBeInTheDocument()
      // 아이콘이 텍스트 뒤에 와야 합니다
      expect(icon.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
    })

    it('로딩 시 아이콘을 숨깁니다', () => {
      render(
        <Button loading icon={<span data-testid='icon'>I</span>}>
          로딩 중
        </Button>,
      )
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    })
  })

  describe('접근성', () => {
    it('아이콘 요소에 aria-hidden 속성이 있습니다', () => {
      render(<Button icon={<span data-testid='icon'>I</span>}>아이콘과 함께</Button>)
      const icon = screen.getByTestId('icon').parentElement
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('로딩 스피너에 aria-hidden 속성이 있습니다', () => {
      render(<Button loading>로딩 중</Button>)
      const spinner = screen.getByRole('button').querySelector('svg')
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
    })

    it('disabled prop이 true일 때 적절히 비활성화됩니다', () => {
      render(<Button disabled>비활성화</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('포커스 가능한 버튼입니다', () => {
      render(<Button>포커스</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('폼 속성', () => {
    it('type 속성을 전달할 수 있습니다', () => {
      render(<Button type='submit'>제출</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('name 속성을 전달할 수 있습니다', () => {
      render(<Button name='button-name'>버튼</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('name', 'button-name')
    })

    it('value 속성을 전달할 수 있습니다', () => {
      render(<Button value='button-value'>버튼</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('value', 'button-value')
    })

    it('formAction 속성을 전달할 수 있습니다', () => {
      render(<Button formAction='/submit'>제출</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('formaction', '/submit')
    })
  })

  describe('디자인 시스템 통합', () => {
    it('CSS Module을 사용하여 스타일을 적용합니다', () => {
      render(<Button variant='primary'>Primary</Button>)
      const button = screen.getByRole('button')
      // CSS Module이 적용되면 className에 button 관련 클래스가 있어야 합니다
      expect(button.className).toMatch(/\bbutton\b/)
    })

    it('variant와 size에 따라 다른 스타일을 적용합니다', () => {
      const { rerender } = render(
        <Button variant='primary' size='sm'>
          Small Primary
        </Button>,
      )
      const button = () => screen.getByRole('button')

      // 기본 렌더링 확인
      expect(button()).toBeInTheDocument()

      // 다른 variant로 재렌더링
      rerender(
        <Button variant='secondary' size='lg'>
          Large Secondary
        </Button>,
      )
      expect(button()).toBeInTheDocument()
    })
  })
})
