import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Click me',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Primary 버튼 - 주요 작업에 사용
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Primary Button',
  },
}

/**
 * Secondary 버튼 - 부가 작업에 사용
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Secondary Button',
  },
}

/**
 * Outline 버튼 - 테두리만 있는 버튼
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    children: 'Outline Button',
  },
}

/**
 * Ghost 버튼 - 배경 없는 투명한 버튼
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'Ghost Button',
  },
}

/**
 * Destructive 버튼 - 삭제, 취소 같은 위험한 작업
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'md',
    children: 'Delete',
  },
}

/**
 * Link 버튼 - 링크처럼 보이는 버튼
 */
export const Link: Story = {
  args: {
    variant: 'link',
    size: 'md',
    children: 'Link Button',
  },
}

/**
 * Small 크기 버튼
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
}

/**
 * Medium 크기 버튼
 */
export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Button',
  },
}

/**
 * Large 크기 버튼
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
}

/**
 * Disabled 상태 버튼
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Disabled Button',
  },
}

/**
 * Loading 상태 버튼
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    isLoading: true,
    children: 'Loading...',
  },
}

/**
 * 모든 버튼 크기 비교
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
      <Button size='sm' variant='primary'>
        Small
      </Button>
      <Button size='md' variant='primary'>
        Medium
      </Button>
      <Button size='lg' variant='primary'>
        Large
      </Button>
    </div>
  ),
}

/**
 * 모든 버튼 variant 비교
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant='primary'>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='destructive'>Destructive</Button>
      <Button variant='link'>Link</Button>
    </div>
  ),
}

/**
 * 대화형 버튼 예제
 */
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Click me!',
    onClick: () => alert('Button clicked!'),
  },
}
