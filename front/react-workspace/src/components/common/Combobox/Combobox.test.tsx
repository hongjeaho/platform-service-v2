import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Combobox, ComboboxItem } from '.'

const defaultChildren = (
  <>
    <ComboboxItem value='0001'>딸기</ComboboxItem>
    <ComboboxItem value='0002'>바나나</ComboboxItem>
    <ComboboxItem value='0003'>수박</ComboboxItem>
  </>
)

describe('Combobox', () => {
  describe('렌더링', () => {
    it('combobox 입력 필드와 placeholder를 렌더링합니다', () => {
      render(<Combobox placeholder='검색하세요'>{defaultChildren}</Combobox>)
      const combobox = screen.getByRole('combobox')
      expect(combobox).toBeInTheDocument()
      expect(combobox).toHaveAttribute('placeholder', '검색하세요')
    })

    it('id를 전달하면 트리거 input에 해당 id를 가집니다', () => {
      render(
        <Combobox id='fruit-combobox' placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'fruit-combobox')
    })

    it('label이 있으면 라벨을 렌더링하고 input과 연결됩니다', () => {
      render(
        <Combobox label='과일' placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.getByText('과일')).toBeInTheDocument()
      expect(screen.getByLabelText('과일')).toBeInTheDocument()
    })

    it('label과 required가 있으면 필수 표시를 렌더링합니다', () => {
      render(
        <Combobox label='과일' required placeholder='검색'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('error가 있으면 에러 메시지를 role="alert"로 렌더링합니다', () => {
      render(
        <Combobox error='과일을 선택해 주세요.' placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.getByRole('alert')).toHaveTextContent('과일을 선택해 주세요.')
    })

    it('숨김 input에 name을 가집니다 (RHF 연동)', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
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
    ] as const)(
      '%s 크기로 combobox를 렌더링합니다',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- it.each 튜플 두 번째 요소는 테스트명 %s용
      (size, _label) => {
        render(
          <Combobox size={size} placeholder='검색' name='f'>
            {defaultChildren}
          </Combobox>,
        )
        expect(screen.getByRole('combobox')).toBeInTheDocument()
      },
    )
  })

  describe('인터랙션', () => {
    it('input 포커스 시 리스트박스가 열립니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      fireEvent.focus(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(3)
    })

    it('입력 시 목록이 실시간으로 필터링됩니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      fireEvent.focus(screen.getByRole('combobox'))
      expect(screen.getAllByRole('option')).toHaveLength(3)
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '바나' } })
      expect(screen.getByRole('combobox')).toHaveValue('바나')
      expect(screen.getAllByRole('option')).toHaveLength(1)
      expect(screen.getByRole('option')).toHaveTextContent('바나나')
    })

    it('옵션 선택 시 리스트박스가 닫히고 input에 선택값이 표시되고 hidden에 value가 설정됩니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      fireEvent.focus(screen.getByRole('combobox'))
      const option = screen.getByRole('option', { name: '바나나' })
      fireEvent.click(option)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.getByRole('combobox')).toHaveValue('바나나')
      const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
      expect(hidden).toHaveValue('0002')
    })

    it('onValueChange가 선택 시 호출됩니다', () => {
      const onValueChange = vi.fn()
      render(
        <Combobox placeholder='검색' name='fruit' onValueChange={onValueChange}>
          {defaultChildren}
        </Combobox>,
      )
      fireEvent.focus(screen.getByRole('combobox'))
      fireEvent.click(screen.getByRole('option', { name: '수박' }))
      expect(onValueChange).toHaveBeenCalledWith('0003')
    })

    it('disabled일 때 input에 포커스해도 리스트박스가 열리지 않습니다', () => {
      render(
        <Combobox disabled placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      const combobox = screen.getByRole('combobox')
      expect(combobox).toBeDisabled()
      fireEvent.focus(combobox)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('검색 결과가 없을 때 listbox는 열려 있지만 옵션이 없습니다 (empty state)', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      fireEvent.focus(screen.getByRole('combobox'))
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '일치하는옵션없음' } })
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('chevron 아이콘 클릭 시 드롭다운이 열립니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      fireEvent.click(document.querySelector('.triggerIcon')!)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('비제어 / defaultValue', () => {
    it('defaultValue가 있으면 input에 해당 옵션 표시가 나옵니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit' defaultValue='0001'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.getByRole('combobox')).toHaveValue('딸기')
      const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
      expect(hidden).toHaveValue('0001')
    })
  })

  describe('포커스 아웃 시 목록에 없는 검색어 초기화', () => {
    it('드롭다운 목록에 없는 검색어 입력 후 blur 시 입력값이 초기화됩니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      const combobox = screen.getByRole('combobox')
      fireEvent.change(combobox, { target: { value: '목록에없는글자' } })
      expect(combobox).toHaveValue('목록에없는글자')
      fireEvent.blur(combobox)
      expect(combobox).toHaveValue('')
      const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
      expect(hidden).toHaveValue('')
    })

    it('선택된 값이 있을 때 목록에 없는 검색어 입력 후 blur 시 선택된 값 표시로 복원됩니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit' defaultValue='0002'>
          {defaultChildren}
        </Combobox>,
      )
      const combobox = screen.getByRole('combobox')
      expect(combobox).toHaveValue('바나나')
      fireEvent.change(combobox, { target: { value: '목록에없는글자' } })
      fireEvent.blur(combobox)
      expect(combobox).toHaveValue('바나나')
      const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
      expect(hidden).toHaveValue('0002')
    })
  })

  describe('접근성', () => {
    it('error가 있으면 combobox에 aria-invalid가 설정됩니다', () => {
      render(
        <Combobox error='에러' placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('combobox에 aria-expanded와 aria-haspopup="listbox"가 있습니다', () => {
      render(
        <Combobox placeholder='검색' name='fruit'>
          {defaultChildren}
        </Combobox>,
      )
      const combobox = screen.getByRole('combobox')
      expect(combobox).toHaveAttribute('aria-haspopup', 'listbox')
      expect(combobox).toHaveAttribute('aria-expanded', 'false')
      fireEvent.focus(combobox)
      expect(combobox).toHaveAttribute('aria-expanded', 'true')
    })
  })
})

describe('ComboboxItem', () => {
  it('Combobox 바깥에서 단독 사용 시 아무것도 렌더하지 않습니다', () => {
    const { container } = render(<ComboboxItem value='a'>옵션 A</ComboboxItem>)
    expect(container.firstChild).toBeNull()
  })

  it('Combobox 내부에서 옵션으로 렌더되고 disabled일 수 있습니다', () => {
    render(
      <Combobox placeholder='검색' name='x'>
        <ComboboxItem value='a'>옵션 A</ComboboxItem>
        <ComboboxItem value='b' disabled>
          옵션 B
        </ComboboxItem>
      </Combobox>,
    )
    fireEvent.focus(screen.getByRole('combobox'))
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    const disabledOption = screen.getByRole('option', { name: '옵션 B' })
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true')
  })

  it('disabled 옵션 클릭 시 선택되지 않고 listbox가 유지됩니다', () => {
    render(
      <Combobox placeholder='검색' name='fruit'>
        <ComboboxItem value='a'>옵션 A</ComboboxItem>
        <ComboboxItem value='b' disabled>
          옵션 B
        </ComboboxItem>
      </Combobox>,
    )
    fireEvent.focus(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: '옵션 B' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    const hidden = document.querySelector('input[type="hidden"][name="fruit"]')
    expect(hidden).toHaveValue('')
  })

  it('옵션에서 Enter 키 입력 시 선택됩니다', () => {
    render(
      <Combobox placeholder='검색' name='fruit'>
        {defaultChildren}
      </Combobox>,
    )
    fireEvent.focus(screen.getByRole('combobox'))
    const option = screen.getByRole('option', { name: '딸기' })
    fireEvent.keyDown(option, { key: 'Enter' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('딸기')
  })
})
