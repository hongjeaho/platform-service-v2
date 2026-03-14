import type { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Common/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '카드 제목',
    },
    isExpanded: {
      control: 'boolean',
      description: '펼침 영역 표시 여부',
    },
    onToggle: { action: 'toggled' },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    title: 'Card Title',
    subtitle: (
      <>
        <p>Subtitle line one</p>
        <p>Subtitle line two</p>
      </>
    ),
    children: <p>Main body content goes here.</p>,
  },
}

export const WithExpandable: Story = {
  args: {
    title: 'Expandable Card',
    subtitle: <p>Click "Show details" to expand</p>,
    children: <p>Summary or primary content.</p>,
    expandableContent: (
      <>
        <div>
          <span className='font-medium'>Label 1: </span>
          <span>Value one</span>
        </div>
        <div>
          <span className='font-medium'>Label 2: </span>
          <span>Value two</span>
        </div>
      </>
    ),
    isExpanded: false,
    onToggle: () => {},
  },
}

export const Expanded: Story = {
  args: {
    ...WithExpandable.args,
    isExpanded: true,
  },
}
