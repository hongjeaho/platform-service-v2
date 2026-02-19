import type { Meta, StoryObj } from '@storybook/react'

import { gap } from '@/constants/design/spacing'
import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'UI/Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'main', 'section', 'article', 'aside'],
      description: '렌더링할 시맨틱 HTML 요소',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', '4xl', '6xl', 'full', 'screen'],
      description: '최대 너비',
    },
    centered: {
      control: 'boolean',
      description: '중앙 정렬 여부',
    },
    withPadding: {
      control: 'boolean',
      description: '좌우 패딩 적용 여부',
    },
  },
}

export default meta
type Story = StoryObj<typeof Container>

/**
 * 기본 Container
 */
export const Default: Story = {
  args: {
    size: '6xl',
    centered: true,
    withPadding: true,
  },
  render: args => (
    <Container {...args}>
      <p>Container 안의 콘텐츠입니다. 최대 너비가 제한되고 중앙에 배치됩니다.</p>
    </Container>
  ),
}

/**
 * Container + Card 조합 (페이지 레이아웃 예시)
 */
export const WithCard: Story = {
  args: {
    size: '4xl',
    centered: true,
    withPadding: true,
  },
  render: args => (
    <Container {...args} className={cn('py-8', gap.default)}>
      <Card>
        <CardHeader>
          <CardTitle>페이지 제목</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Container로 감싼 페이지에서 Card를 사용한 예시입니다.</p>
        </CardContent>
      </Card>
    </Container>
  ),
}

/**
 * size별 최대 너비 비교
 */
export const Sizes: Story = {
  render: () => (
    <div className={cn('flex flex-col', gap.loose)}>
      {(['sm', 'md', 'lg', '4xl', '6xl'] as const).map(size => (
        <Container key={size} size={size} className='border border-border border-dashed p-4'>
          <p className='text-muted-foreground'>
            <strong>size=&quot;{size}&quot;</strong> — 최대 너비가 제한된 Container
          </p>
        </Container>
      ))}
    </div>
  ),
}

/**
 * as prop으로 시맨틱 요소 사용
 */
export const AsMain: Story = {
  render: () => (
    <Container as='main' size='2xl'>
      <p>as=&quot;main&quot;으로 렌더링된 Container입니다. 메인 콘텐츠 영역에 적합합니다.</p>
    </Container>
  ),
}

/**
 * 패딩 없음 (centered + withPadding: false)
 */
export const NoPadding: Story = {
  args: {
    size: '4xl',
    centered: true,
    withPadding: false,
  },
  render: args => (
    <Container {...args} className='border border-border'>
      <p>withPadding=false — 좌우 패딩이 적용되지 않습니다.</p>
    </Container>
  ),
}
