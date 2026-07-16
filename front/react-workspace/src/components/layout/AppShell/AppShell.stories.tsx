import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router'

import { icons } from '@/styles'

import { AppShell } from './AppShell'
import type { NavSection } from './AppShell.type'

const sections: NavSection[] = [
  { items: [{ label: '대시보드', to: '/', icon: icons.home }] },
  {
    label: '문서',
    items: [
      { label: '전체 문서', to: '/docs', icon: icons.folder },
      { label: '새 문서', to: '/docs/new', icon: icons.add },
    ],
  },
  {
    label: '분석',
    items: [{ label: '통계', to: '/stats', icon: icons.filter }],
  },
]

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/docs']}>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AppShell>

export const Default: Story = {
  args: {
    brand: { label: 'React Workspace' },
    sections,
    profile: { name: '김민준', role: '관리자' },
    breadcrumb: (
      <span>
        문서 › <b style={{ color: 'var(--foreground)' }}>전체 목록</b>
      </span>
    ),
    children: (
      <div
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          background: 'var(--card)',
          padding: 'var(--spacing-8)',
          color: 'var(--muted-foreground)',
        }}
      >
        페이지 콘텐츠 영역 — 실제 화면은 각 기능별로 이 영역에 렌더링됩니다.
      </div>
    ),
  },
}
