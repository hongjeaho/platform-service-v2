import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Select, SelectItem } from '.'

const defaultChildren = (
  <>
    <SelectItem value='0001'>딸기</SelectItem>
    <SelectItem value='0002'>바나나</SelectItem>
    <SelectItem value='0003'>수박</SelectItem>
  </>
)

describe('Select', () => {
  describe('렌더링', () => {
    it('트리거 버튼과 placeholder를 렌더링합니다', () => {
      render(<Select placeholder='선택하세요'>{defaultChildren}</Select>)
      const trigger = screen.getByRole('button', { name: /선택하세요/ })
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveTextContent('선택하세요')
    })

    it('id를 전달하면 트리거에 해당 id를 가집니다', () => {
      render(
        <Select id='fruit-select' placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.getByRole('button')).toHaveAttribute('id', 'fruit-select')
    })

    it('label이 있으면 라벨을 렌더링하고 트리거와 연결됩니다', () => {
      render(
        <Select label='과일' placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.getByText('과일')).toBeInTheDocument()
      expect(screen.getByLabelText('과일')).toBeInTheDocument()
    })

    it('label과 required가 있으면 필수 표시를 렌더링합니다', () => {
      render(
        <Select label='과일' required placeholder='선택'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('error가 있으면 에러 메시지를 role="alert"로 렌더링합니다', () => {
      render(
        <Select error='과일을 선택해 주세요.' placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.getByRole('alert')).toHaveTextContent('과일을 선택해 주세요.')
    })

    it('숨김 input에 name을 가집니다 (RHF 연동)', () => {
      render(
        <Select placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
      expect(hidden).toBeInTheDocument()
    })
  })

  describe('size', () => {
    it.each([
      ['sm', 'Small'],
      ['md', 'Medium'],
      ['lg', 'Large'],
    ] as const)('%s 크기로 트리거를 렌더링합니다', size => {
      render(
        <Select size={size} placeholder='선택' name='f'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('인터랙션', () => {
    it('트리거 클릭 시 리스트박스가 열립니다', () => {
      render(
        <Select placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(3)
    })

    it('옵션 선택 시 리스트박스가 닫히고 트리거에 선택값 표시가 바뀝니다', () => {
      render(
        <Select placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      fireEvent.click(screen.getByRole('button'))
      const option = screen.getByRole('option', { name: '바나나' })
      fireEvent.click(option)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('바나나')
      const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
      expect(hidden).toHaveValue('0002')
    })

    it('onValueChange가 선택 시 호출됩니다', () => {
      const onValueChange = vi.fn()
      render(
        <Select placeholder='선택' name='fruit' onValueChange={onValueChange}>
          {defaultChildren}
        </Select>,
      )
      fireEvent.click(screen.getByRole('button'))
      fireEvent.click(screen.getByRole('option', { name: '수박' }))
      expect(onValueChange).toHaveBeenCalledWith('0003')
    })

    it('disabled일 때 트리거 클릭해도 리스트박스가 열리지 않습니다', () => {
      render(
        <Select disabled placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      const trigger = screen.getByRole('button')
      expect(trigger).toBeDisabled()
      fireEvent.click(trigger)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('비제어 / defaultValue', () => {
    it('defaultValue가 있으면 트리거에 해당 옵션 표시가 나옵니다', () => {
      render(
        <Select placeholder='선택' name='fruit' defaultValue='0001'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.getByRole('button')).toHaveTextContent('딸기')
      const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
      expect(hidden).toHaveValue('0001')
    })
  })

  describe('접근성', () => {
    it('error가 있으면 트리거에 aria-invalid가 설정됩니다', () => {
      render(
        <Select error='에러' placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      expect(screen.getByRole('button')).toHaveAttribute('aria-invalid', 'true')
    })

    it('트리거에 aria-expanded와 aria-haspopup="listbox"가 있습니다', () => {
      render(
        <Select placeholder='선택' name='fruit'>
          {defaultChildren}
        </Select>,
      )
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      fireEvent.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })
})

describe('SelectItem', () => {
  it('Select 바깥에서 단독 사용 시 아무것도 렌더하지 않습니다', () => {
    const { container } = render(<SelectItem value='a'>옵션 A</SelectItem>)
    expect(container.firstChild).toBeNull()
  })

  it('Select 내부에서 옵션으로 렌더되고 disabled일 수 있습니다', () => {
    render(
      <Select placeholder='선택' name='x'>
        <SelectItem value='a'>옵션 A</SelectItem>
        <SelectItem value='b' disabled>
          옵션 B
        </SelectItem>
      </Select>,
    )
    fireEvent.click(screen.getByRole('button'))
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    const disabledOption = screen.getByRole('option', { name: '옵션 B' })
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true')
  })
})
