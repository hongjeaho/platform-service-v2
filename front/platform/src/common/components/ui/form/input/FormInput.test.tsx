import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import { FormInput } from './FormInput'

function TestForm({
  type = 'text',
  defaultValues,
}: {
  type?: 'text' | 'number'
  defaultValues?: { amount?: number; name?: string }
}) {
  const { control, watch } = useForm({
    defaultValues: defaultValues ?? { amount: undefined, name: '' },
  })
  const amount = watch('amount')
  return (
    <form>
      <FormInput
        name='amount'
        control={control}
        label='금액'
        type={type}
        placeholder={type === 'number' ? '0' : ''}
      />
      <output data-testid='form-amount-value'>
        {amount === undefined ? 'undefined' : String(amount)}
      </output>
    </form>
  )
}

describe('FormInput', () => {
  describe('type="number"', () => {
    it('숫자 입력 시 천 단위 콤마로 표시된다', async () => {
      const user = userEvent.setup()
      render(<TestForm type='number' />)
      const input = screen.getByLabelText(/금액/)
      await user.type(input, '1000')
      expect(input).toHaveValue('1,000')
    })

    it('여러 자리 숫자 입력 시 콤마가 적용된다', async () => {
      const user = userEvent.setup()
      render(<TestForm type='number' />)
      const input = screen.getByLabelText(/금액/)
      await user.type(input, '1234567')
      expect(input).toHaveValue('1,234,567')
    })

    it('숫자 외 문자는 입력되지 않는다', async () => {
      const user = userEvent.setup()
      render(<TestForm type='number' />)
      const input = screen.getByLabelText(/금액/)
      await user.type(input, '1a2b3c')
      expect(input).toHaveValue('123')
    })

    it('defaultValues가 있으면 콤마 포맷으로 표시된다', () => {
      render(<TestForm type='number' defaultValues={{ amount: 1000 }} />)
      const input = screen.getByLabelText(/금액/)
      expect(input).toHaveValue('1,000')
    })

    it('input은 type="text"와 inputMode="numeric"을 사용한다', () => {
      render(<TestForm type='number' />)
      const input = screen.getByLabelText(/금액/)
      expect(input).toHaveAttribute('type', 'text')
      expect(input).toHaveAttribute('inputmode', 'numeric')
    })

    it('값을 지우면 폼 값은 undefined가 된다', async () => {
      const user = userEvent.setup()
      render(<TestForm type='number' defaultValues={{ amount: 1000 }} />)
      const input = screen.getByLabelText(/금액/)
      expect(screen.getByTestId('form-amount-value')).toHaveTextContent('1000')
      await user.clear(input)
      expect(screen.getByTestId('form-amount-value')).toHaveTextContent('undefined')
    })
  })

  describe('type="text"', () => {
    it('문자열을 그대로 표시한다', async () => {
      const user = userEvent.setup()
      render(<TestForm type='text' />)
      const input = screen.getByLabelText(/금액/)
      await user.type(input, 'hello')
      expect(input).toHaveValue('hello')
    })
  })
})
