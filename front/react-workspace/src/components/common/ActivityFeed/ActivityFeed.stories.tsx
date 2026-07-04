import type { Meta, StoryObj } from '@storybook/react'

import { ActivityFeed } from './ActivityFeed'

const meta: Meta<typeof ActivityFeed> = {
  title: 'Common/ActivityFeed',
  component: ActivityFeed,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActivityFeed>

export const RecentActivity: Story = {
  args: {
    title: '최근 활동',
    items: [
      {
        id: 1,
        tone: 'success',
        text: (
          <>
            <b>이준혁</b> 사건이 완료 처리되었습니다
          </>
        ),
        time: '5분 전',
      },
      {
        id: 2,
        tone: 'info',
        text: (
          <>
            신규 신청 <b>LT-2201</b>이 접수되었습니다
          </>
        ),
        time: '32분 전',
      },
      {
        id: 3,
        tone: 'danger',
        text: (
          <>
            <b>최유나</b> 사건이 반려되었습니다
          </>
        ),
        time: '2시간 전',
      },
    ],
  },
}
