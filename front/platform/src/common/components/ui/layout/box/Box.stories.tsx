import type { Meta, StoryObj } from '@storybook/react'

import { Box } from './Box'

const meta: Meta<typeof Box> = {
  title: 'UI/Layout/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'span'],
      description: '렌더링할 시맨틱 HTML 요소',
    },
    display: {
      control: 'select',
      options: ['flex', 'grid', 'block', 'inline-flex'],
      description: 'display 모드',
    },
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'flex-direction',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'align-items',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
      description: 'justify-content',
    },
    gap: {
      control: 'select',
      options: ['tight', 'default', 'loose', 'relaxed'],
      description: 'gap 토큰',
    },
    wrap: {
      control: 'boolean',
      description: 'flex-wrap',
    },
  },
}

export default meta
type Story = StoryObj<typeof Box>

/**
 * 기본 Box (flex row)
 */
export const Default: Story = {
  args: {
    display: 'flex',
    direction: 'row',
  },
  render: args => (
    <Box {...args} className='border border-border border-dashed p-4'>
      <span>Item 1</span>
      <span>Item 2</span>
      <span>Item 3</span>
    </Box>
  ),
}

/**
 * flex column + gap (기존 반복 패턴 대체)
 */
export const FlexColumnWithGap: Story = {
  render: () => (
    <Box direction='column' gap='default' className='border border-border border-dashed p-4'>
      <p>기존: div + cn(&quot;flex flex-col&quot;, gap.default)</p>
      <p>Box: direction=&quot;column&quot; gap=&quot;default&quot;</p>
    </Box>
  ),
}

/**
 * flex row + align center + gap tight
 */
export const FlexRowAlignCenter: Story = {
  render: () => (
    <Box align='center' gap='tight' className='border border-border border-dashed p-4'>
      <span>아이콘</span>
      <span>레이블</span>
    </Box>
  ),
}

/**
 * justify-between
 */
export const JustifyBetween: Story = {
  render: () => (
    <Box justify='between' className='w-80 border border-border border-dashed p-4'>
      <span>왼쪽</span>
      <span>오른쪽</span>
    </Box>
  ),
}

/**
 * grid display
 */
export const Grid: Story = {
  render: () => (
    <Box
      display='grid'
      gap='default'
      className='grid-cols-2 border border-border border-dashed p-4'
    >
      <div className='border border-border p-2'>1</div>
      <div className='border border-border p-2'>2</div>
      <div className='border border-border p-2'>3</div>
      <div className='border border-border p-2'>4</div>
    </Box>
  ),
}

/**
 * wrap
 */
export const Wrap: Story = {
  render: () => (
    <Box wrap className='w-48 border border-border border-dashed p-4' gap='tight'>
      <span className='rounded bg-muted px-2 py-1'>태그1</span>
      <span className='rounded bg-muted px-2 py-1'>태그2</span>
      <span className='rounded bg-muted px-2 py-1'>태그3</span>
    </Box>
  ),
}

/**
 * as="section"
 */
export const AsSection: Story = {
  render: () => (
    <Box as='section' direction='column' gap='loose' className='border border-border p-4'>
      <h3 className='text-lg font-semibold'>섹션 제목</h3>
      <p>as=&quot;section&quot;으로 렌더링된 Box입니다.</p>
    </Box>
  ),
}
