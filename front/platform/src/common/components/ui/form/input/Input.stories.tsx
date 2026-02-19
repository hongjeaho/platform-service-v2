import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Input } from './Input'

const meta = {
  title: 'UI/Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    placeholder: '입력하세요',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 기본 Input - 라벨과 플레이스홀더
 */
export const Default: Story = {
  args: {
    label: '이름',
    placeholder: '이름을 입력하세요',
  },
}

/**
 * 에러 상태 - 유효성 검증 실패 시 메시지 표시
 */
export const WithError: Story = {
  args: {
    label: '이메일',
    value: 'invalid-email',
    error: '올바른 이메일 형식이 아닙니다',
  },
}

/**
 * 필수 입력 - 필수 항목 표시
 */
export const Required: Story = {
  args: {
    label: '필수 입력',
    required: true,
    placeholder: '필수 항목입니다',
  },
}

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    label: '비활성화',
    value: '수정 불가',
    disabled: true,
  },
}

/**
 * 라벨 없음 - 플레이스홀더만 표시
 */
export const WithoutLabel: Story = {
  args: {
    placeholder: '라벨 없이 입력',
  },
}

/**
 * 대화형 - 입력 가능한 상태
 */
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [value, setValue] = useState('')
    return <Input label='이름' placeholder='이름을 입력하세요' value={value} onChange={setValue} />
  },
}
