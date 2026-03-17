import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RadioGroup } from './RadioGroup'
import { RadioGroupItem } from './RadioGroupItem'

const defaultItems = (
  <>
    <RadioGroupItem value='0001' textValue='딸기'>
      딸기
    </RadioGroupItem>
    <RadioGroupItem value='0002' textValue='바나나'>
      바나나
    </RadioGroupItem>
    <RadioGroupItem value='0003' textValue='수박'>
      수박
    </RadioGroupItem>
  </>
)

describe('RadioGroup', () => {
  describe('렌더링', () => {
    it('radiogroup으로 렌더링됩니다', () => {
      render(
        <RadioGroup name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })

    it('hidden input이 렌더링됩니다', () => {
      render(
        <RadioGroup name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      const hidden = document.querySelector('input[type="hidden"]')
      expect(hidden).toBeInTheDocument()
      expect(hidden).toHaveAttribute('name', 'fruit')
      expect(hidden).toHaveValue('0001')
    })

    it('defaultValue에 해당하는 항목이 선택됩니다', () => {
      render(
        <RadioGroup name='fruit' defaultValue='0002'>
          {defaultItems}
        </RadioGroup>,
      )
      const radios = screen.getAllByRole('radio')
      expect(radios[0]).toHaveAttribute('aria-checked', 'false')
      expect(radios[1]).toHaveAttribute('aria-checked', 'true')
      expect(radios[2]).toHaveAttribute('aria-checked', 'false')
    })

    it('id를 전달하면 그룹에 해당 id가 적용됩니다', () => {
      render(
        <RadioGroup id='fruit-group' name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      expect(screen.getByRole('radiogroup')).toHaveAttribute('id', 'fruit-group')
    })
  })

  describe('size', () => {
    it.each(['sm', 'md', 'lg'] as const)('%s 크기로 렌더링됩니다', size => {
      render(
        <RadioGroup size={size} name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })
  })

  describe('orientation', () => {
    it('horizontal일 때 가로 배치됩니다', () => {
      render(
        <RadioGroup orientation='horizontal' name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })

    it('vertical일 때 세로 배치됩니다', () => {
      render(
        <RadioGroup orientation='vertical' name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })
  })

  describe('상태', () => {
    it('disabled일 때 모든 항목이 비활성화됩니다', () => {
      render(
        <RadioGroup disabled name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      const radios = screen.getAllByRole('radio')
      radios.forEach(radio => expect(radio).toBeDisabled())
    })

    it('error가 있으면 에러 메시지를 표시합니다', () => {
      render(
        <RadioGroup name='fruit' defaultValue='0001' error='과일을 선택해 주세요.'>
          {defaultItems}
        </RadioGroup>,
      )
      expect(screen.getByTestId('radio-group-error')).toHaveTextContent('과일을 선택해 주세요.')
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('비제어 모드', () => {
    it('클릭 시 선택이 바뀌고 onValueChange가 호출됩니다', () => {
      const onValueChange = vi.fn()
      render(
        <RadioGroup name='fruit' defaultValue='0001' onValueChange={onValueChange}>
          {defaultItems}
        </RadioGroup>,
      )
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[1])
      expect(radios[1]).toHaveAttribute('aria-checked', 'true')
      expect(onValueChange).toHaveBeenCalledWith('0002')
    })

    it('선택 시 hidden input value가 갱신됩니다', () => {
      render(
        <RadioGroup name='fruit' defaultValue='0001'>
          {defaultItems}
        </RadioGroup>,
      )
      const hidden = document.querySelector('input[type="hidden"]') as HTMLInputElement
      expect(hidden.value).toBe('0001')
      fireEvent.click(screen.getByRole('radio', { name: '바나나' }))
      expect(hidden.value).toBe('0002')
    })
  })

  describe('제어 모드', () => {
    it('value와 onChange로 제어됩니다', () => {
      const handleChange = vi.fn()
      render(
        <RadioGroup name='fruit' value='0001' onChange={handleChange}>
          {defaultItems}
        </RadioGroup>,
      )
      fireEvent.click(screen.getByRole('radio', { name: '바나나' }))
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange.mock.calls[0][0].target.value).toBe('0002')
    })
  })

  describe('RadioGroupItem', () => {
    it('Context 없이 사용 시 아무것도 렌더하지 않습니다', () => {
      const { container } = render(
        <RadioGroupItem value='0001' textValue='딸기'>
          딸기
        </RadioGroupItem>,
      )
      expect(container.firstChild).toBeNull()
    })

    it('개별 disabled가 적용됩니다', () => {
      render(
        <RadioGroup name='fruit' defaultValue='0001'>
          <RadioGroupItem value='0001' textValue='딸기'>
            딸기
          </RadioGroupItem>
          <RadioGroupItem value='0002' textValue='바나나' disabled>
            바나나
          </RadioGroupItem>
        </RadioGroup>,
      )
      expect(screen.getByRole('radio', { name: '바나나' })).toHaveAttribute('aria-disabled', 'true')
    })
  })
})
