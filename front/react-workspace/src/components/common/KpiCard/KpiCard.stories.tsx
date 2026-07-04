import type { Meta, StoryObj } from '@storybook/react'

import { KpiCard } from './KpiCard'

const meta: Meta<typeof KpiCard> = {
  title: 'Common/KpiCard',
  component: KpiCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    trend: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof KpiCard>

export const Up: Story = {
  args: {
    label: '전체 신청',
    value: '128건',
    trend: { direction: 'up', label: '12%' },
  },
}

export const Down: Story = {
  args: {
    label: '이번달 신규',
    value: '31건',
    trend: { direction: 'down', label: '3%' },
  },
}

export const NoTrend: Story = {
  args: {
    label: '완료',
    value: '96건',
  },
}

export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--gap-md)' }}>
      <KpiCard label='전체 신청' value='128건' trend={{ direction: 'up', label: '12%' }} />
      <KpiCard label='처리중' value='24건' trend={{ direction: 'up', label: '4%' }} />
      <KpiCard label='완료' value='96건' trend={{ direction: 'up', label: '18%' }} />
      <KpiCard label='이번달 신규' value='31건' trend={{ direction: 'down', label: '3%' }} />
    </div>
  ),
}
