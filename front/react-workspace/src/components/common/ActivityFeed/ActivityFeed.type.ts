import type { ReactNode } from 'react'

export type ActivityTone = 'success' | 'info' | 'warning' | 'danger' | 'muted'

export interface ActivityItem {
  id: string | number
  tone: ActivityTone
  text: ReactNode
  time: string
}

export interface ActivityFeedProps {
  /**
   * 위젯 제목 (예: '최근 활동')
   */
  title: string
  items: ActivityItem[]
}
