import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RadioGroup } from './RadioGroup'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { label: '옵션 1', value: '1' },
  { label: '옵션 2', value: '2' },
  { label: '옵션 3', value: '3' },
]

const optionsWithDescription = [
  { label: '옵션 1', value: '1', description: '첫 번째 옵션의 설명' },
  { label: '옵션 2', value: '2', description: '두 번째 옵션의 설명' },
  { label: '옵션 3', value: '3', description: '세 번째 옵션의 설명' },
]

/**
 * 기본 RadioGroup (수직 레이아웃)
 */
export const Default: Story = {
  args: {
    options,
    label: '라디오 그룹',
    name: 'radio-default',
  },
}

/**
 * 수평 레이아웃
 */
export const Horizontal: Story = {
  args: {
    options,
    label: '라디오 그룹',
    orientation: 'horizontal',
    name: 'radio-horizontal',
  },
}

/**
 * 설명이 있는 옵션
 */
export const WithDescription: Story = {
  args: {
    options: optionsWithDescription,
    label: '라디오 그룹',
    name: 'radio-description',
  },
}

/**
 * 값이 선택된 상태
 */
export const WithValue: Story = {
  args: {
    options,
    value: '2',
    label: '라디오 그룹',
    name: 'radio-value',
  },
}

/**
 * 비활성화된 옵션이 있는 경우
 */
export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: '활성화된 옵션 1', value: '1' },
      { label: '비활성화된 옵션 2', value: '2', disabled: true },
      { label: '활성화된 옵션 3', value: '3' },
    ],
    label: '라디오 그룹',
    name: 'radio-disabled-option',
  },
}

/**
 * 전체 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    options,
    label: '라디오 그룹',
    disabled: true,
    name: 'radio-disabled',
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  args: {
    options,
    label: '라디오 그룹',
    error: '이 필드는 필수입니다',
    name: 'radio-error',
  },
}

/**
 * 라벨이 없는 경우
 */
export const WithoutLabel: Story = {
  args: {
    options,
    name: 'radio-no-label',
  },
}

/**
 * 대화형 RadioGroup (상태 관리)
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup {...args} value={value} onChange={(val) => setValue(val)} />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    options,
    label: '라디오 그룹',
    name: 'radio-interactive',
  },
}

/**
 * 대화형 RadioGroup (설명 포함)
 */
export const InteractiveWithDescription: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup {...args} value={value} onChange={(val) => setValue(val)} />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    options: optionsWithDescription,
    label: '라디오 그룹',
    name: 'radio-interactive-desc',
  },
}

/**
 * 숫자 값을 가진 RadioGroup
 */
export const WithNumberValues: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup
          {...args}
          value={value}
          onChange={(val) => setValue(val)}
          options={[
            { label: '10개', value: 10 as any },
            { label: '20개', value: 20 as any },
            { label: '50개', value: 50 as any },
          ]}
        />
        {value && <p>선택된 값: {value}</p>}
      </div>
    )
  },
  args: {
    label: '페이지당 항목 수',
    name: 'radio-number',
  },
}
