import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { FormInput } from './FormInput'

/* eslint-disable react-hooks/rules-of-hooks */

const meta = {
  title: 'UI/Form/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    control: { table: { disable: true } },
    name: { table: { disable: true } },
  },
} satisfies Meta<typeof FormInput>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 기본 FormInput (type="text") - React Hook Form과 연동
 */
export const Default: Story = {
  render: args => {
    const { control } = useForm({ defaultValues: { name: '' } })
    return (
      <div style={{ width: '320px' }}>
        <FormInput name='name' control={control} {...args} />
      </div>
    )
  },
  args: {
    label: '이름',
    placeholder: '이름을 입력하세요',
  },
}

/**
 * type="number" - 숫자만 입력, 천 단위 콤마 자동 표시 (예: 1000 → 1,000)
 */
export const NumberWithComma: Story = {
  render: args => {
    const { control, watch } = useForm<{ amount?: number }>({
      defaultValues: { amount: undefined },
    })
    const amount = watch('amount')
    return (
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormInput name='amount' control={control} type='number' {...args} />
        {amount !== undefined && (
          <p className='text-sm text-muted-foreground'>
            폼 값 (number): <strong>{amount}</strong>
          </p>
        )}
      </div>
    )
  },
  args: {
    label: '금액',
    placeholder: '0',
  },
}

/**
 * type="number" + defaultValues - 초기값이 있을 때도 콤마 포맷 표시
 */
export const NumberWithDefaultValue: Story = {
  render: args => {
    const { control } = useForm<{ amount?: number }>({ defaultValues: { amount: 1234567 } })
    return (
      <div style={{ width: '320px' }}>
        <FormInput name='amount' control={control} type='number' {...args} />
      </div>
    )
  },
  args: {
    label: '금액',
    placeholder: '0',
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  render: args => {
    const { control } = useForm({ defaultValues: { email: 'invalid' } })
    return (
      <div style={{ width: '320px' }}>
        <FormInput name='email' control={control} {...args} />
      </div>
    )
  },
  args: {
    label: '이메일',
    error: '올바른 이메일 형식이 아닙니다',
  },
}

/**
 * 필수 입력
 */
export const Required: Story = {
  render: args => {
    const { control } = useForm({ defaultValues: { requiredField: '' } })
    return (
      <div style={{ width: '320px' }}>
        <FormInput name='requiredField' control={control} {...args} />
      </div>
    )
  },
  args: {
    label: '필수 입력',
    placeholder: '필수 항목입니다',
    required: true,
  },
}
