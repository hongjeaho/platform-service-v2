import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { label: '선택 옵션 1', value: '1' },
  { label: '선택 옵션 2', value: '2' },
  { label: '선택 옵션 3', value: '3' },
  { label: '선택 옵션 4', value: '4' },
]

/**
 * 기본 Select 컴포넌트
 */
export const Default: Story = {
  args: {
    options,
    placeholder: '선택해주세요',
    label: '선택 항목',
    name: 'select-default',
  },
}

/**
 * 라벨이 없는 Select
 */
export const WithoutLabel: Story = {
  args: {
    options,
    placeholder: '선택해주세요',
    name: 'select-no-label',
  },
}

/**
 * 필수 필드 표시
 */
export const Required: Story = {
  args: {
    options,
    label: '필수 항목',
    required: true,
    placeholder: '선택해주세요',
    name: 'select-required',
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  args: {
    options,
    label: '선택 항목',
    error: '이 필드는 필수입니다',
    placeholder: '선택해주세요',
    name: 'select-error',
  },
}

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    options,
    label: '비활성화된 Select',
    disabled: true,
    placeholder: '선택해주세요',
    name: 'select-disabled',
  },
}

/**
 * 값이 선택된 상태
 */
export const WithValue: Story = {
  args: {
    options,
    label: '선택 항목',
    value: '2',
    placeholder: '선택해주세요',
    name: 'select-with-value',
  },
}

/**
 * 비활성화된 옵션이 있는 Select
 */
export const WithDisabledOptions: Story = {
  args: {
    options: [
      { label: '활성화된 옵션 1', value: '1' },
      { label: '비활성화된 옵션 2', value: '2', disabled: true },
      { label: '활성화된 옵션 3', value: '3' },
      { label: '비활성화된 옵션 4', value: '4', disabled: true },
    ],
    label: '선택 항목',
    placeholder: '선택해주세요',
    name: 'select-disabled-options',
  },
}

/**
 * 대화형 Select (상태 관리)
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Select {...args} value={value} onChange={(val) => setValue(val)} />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    options,
    label: '선택 항목',
    placeholder: '선택해주세요',
    name: 'select-interactive',
  },
}

/**
 * 숫자 값을 가진 Select
 */
export const WithNumberValues: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Select
          {...args}
          value={value}
          onChange={(val) => setValue(Number(val))}
          options={[
            { label: '10개', value: '10' },
            { label: '20개', value: '20' },
            { label: '50개', value: '50' },
          ]}
        />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    label: '페이지당 항목 수',
    placeholder: '선택해주세요',
    name: 'select-number',
  },
}
