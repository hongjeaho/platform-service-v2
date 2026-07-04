import type { Meta, StoryObj } from '@storybook/react'

import { MiniBarChart } from './MiniBarChart'

const meta: Meta<typeof MiniBarChart> = {
  title: 'Common/MiniBarChart',
  component: MiniBarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MiniBarChart>

export const WeeklyVolume: Story = {
  args: {
    title: '주간 처리 현황',
    data: [
      { label: '월', value: 38 },
      { label: '화', value: 62 },
      { label: '수', value: 48 },
      { label: '목', value: 82 },
      { label: '금', value: 55 },
      { label: '토', value: 28 },
      { label: '일', value: 20 },
    ],
  },
}
