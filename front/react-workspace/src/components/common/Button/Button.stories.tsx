import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Button variant style',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Interactive Button',
  },
  parameters: {
    controls: { expanded: true },
  },
}

export const ButtonGroup: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Button variant='primary'>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='danger'>Danger</Button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-2'>
        <Button variant='primary' size='sm'>
          Small Primary
        </Button>
        <Button variant='primary' size='md'>
          Medium Primary
        </Button>
        <Button variant='primary' size='lg'>
          Large Primary
        </Button>
      </div>
      <div className='flex gap-2'>
        <Button variant='secondary' size='sm'>
          Small Secondary
        </Button>
        <Button variant='secondary' size='md'>
          Medium Secondary
        </Button>
        <Button variant='secondary' size='lg'>
          Large Secondary
        </Button>
      </div>
      <div className='flex gap-2'>
        <Button variant='danger' size='sm'>
          Small Danger
        </Button>
        <Button variant='danger' size='md'>
          Medium Danger
        </Button>
        <Button variant='danger' size='lg'>
          Large Danger
        </Button>
      </div>
      <div className='flex gap-2'>
        <Button variant='primary' loading>
          Loading
        </Button>
        <Button variant='secondary' disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
}
