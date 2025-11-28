import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 기본 체크박스 (라벨 없음)
 */
export const Default: Story = {
  args: {
    checked: false,
  },
}

/**
 * 라벨이 있는 체크박스
 */
export const WithLabel: Story = {
  args: {
    label: '동의합니다',
    checked: false,
  },
}

/**
 * 라벨과 설명이 있는 체크박스
 */
export const WithDescription: Story = {
  args: {
    label: '마케팅 수신 동의',
    description: '프로모션과 특별 오퍼에 대한 이메일을 받으시겠습니까?',
    checked: false,
  },
}

/**
 * 체크된 상태
 */
export const Checked: Story = {
  args: {
    label: '동의합니다',
    checked: true,
  },
}

/**
 * 부분 선택 상태 (Indeterminate)
 */
export const Indeterminate: Story = {
  args: {
    label: '모두 선택',
    indeterminate: true,
  },
}

/**
 * 비활성화 상태 (체크되지 않음)
 */
export const DisabledUnchecked: Story = {
  args: {
    label: '비활성화된 체크박스',
    disabled: true,
    checked: false,
  },
}

/**
 * 비활성화 상태 (체크됨)
 */
export const DisabledChecked: Story = {
  args: {
    label: '비활성화된 체크박스',
    disabled: true,
    checked: true,
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  args: {
    label: '약관에 동의',
    error: '약관에 동의해야 합니다',
    checked: false,
  },
}

/**
 * 대화형 체크박스 (상태 관리)
 */
export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox {...args} checked={checked} onChange={(val) => setChecked(val)} />
        <p>상태: {checked ? '체크됨' : '체크 안 됨'}</p>
      </div>
    )
  },
  args: {
    label: '동의합니다',
  },
}

/**
 * 체크박스 목록 (상태 관리)
 */
export const CheckboxList: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      item1: false,
      item2: false,
      item3: false,
    })

    const handleChange = (item: string, value: boolean) => {
      setChecked((prev) => ({
        ...prev,
        [item]: value,
      }))
    }

    const allChecked = Object.values(checked).every((v) => v)
    const someChecked = Object.values(checked).some((v) => v)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          label='모두 선택'
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(value) => {
            const newState = {
              item1: value,
              item2: value,
              item3: value,
            }
            setChecked(newState)
          }}
        />
        <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Checkbox
            label='항목 1'
            checked={checked.item1}
            onChange={(value) => handleChange('item1', value)}
          />
          <Checkbox
            label='항목 2'
            checked={checked.item2}
            onChange={(value) => handleChange('item2', value)}
          />
          <Checkbox
            label='항목 3'
            checked={checked.item3}
            onChange={(value) => handleChange('item3', value)}
          />
        </div>
      </div>
    )
  },
}

/**
 * 설명이 있는 체크박스 목록
 */
export const CheckboxListWithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      notifications: false,
      marketing: false,
      analytics: false,
    })

    const handleChange = (item: string, value: boolean) => {
      setChecked((prev) => ({
        ...prev,
        [item]: value,
      }))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox
          label='알림'
          description='중요한 업데이트 및 공지사항'
          checked={checked.notifications}
          onChange={(value) => handleChange('notifications', value)}
        />
        <Checkbox
          label='마케팅'
          description='프로모션과 특별 오퍼'
          checked={checked.marketing}
          onChange={(value) => handleChange('marketing', value)}
        />
        <Checkbox
          label='분석'
          description='사용 통계 및 피드백'
          checked={checked.analytics}
          onChange={(value) => handleChange('analytics', value)}
        />
      </div>
    )
  },
}
