import type { Meta, StoryObj } from '@storybook/react'

import { icons } from '@/styles'
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
      options: ['primary', 'secondary', 'accent', 'destructive', 'outline', 'ghost', 'link'],
      description: '버튼 variant 스타일 (디자인 시스템)',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    loading: {
      control: 'boolean',
      description: '로딩 스피너 표시',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화',
    },
    fullWidth: {
      control: 'boolean',
      description: '버튼 전체 너비 사용',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: '아이콘 위치',
    },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// ============================================================================
// Variants
// ============================================================================

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

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Accent Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

// ============================================================================
// Sizes
// ============================================================================

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

// ============================================================================
// States
// ============================================================================

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

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'fullscreen',
  },
}

// ============================================================================
// With Icons
// ============================================================================

export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    icon: <icons.add />,
    children: 'Add Item',
  },
}

export const WithIconRight: Story = {
  args: {
    variant: 'secondary',
    iconPosition: 'right',
    icon: <icons.download />,
    children: 'Download',
  },
}

export const IconOnly: Story = {
  args: {
    variant: 'outline',
    size: 'sm',
    icon: <icons.delete />,
    children: '',
  },
}

// ============================================================================
// Variant Showcase
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-6 p-8'>
      <div>
        <h3 className='text-lg font-semibold mb-3'>Primary</h3>
        <div className='flex gap-3'>
          <Button variant='primary' size='sm'>
            Small
          </Button>
          <Button variant='primary' size='md'>
            Medium
          </Button>
          <Button variant='primary' size='lg'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Secondary</h3>
        <div className='flex gap-3'>
          <Button variant='secondary' size='sm'>
            Small
          </Button>
          <Button variant='secondary' size='md'>
            Medium
          </Button>
          <Button variant='secondary' size='lg'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Accent</h3>
        <div className='flex gap-3'>
          <Button variant='accent' size='sm'>
            Small
          </Button>
          <Button variant='accent' size='md'>
            Medium
          </Button>
          <Button variant='accent' size='lg'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Destructive</h3>
        <div className='flex gap-3'>
          <Button variant='destructive' size='sm'>
            Small
          </Button>
          <Button variant='destructive' size='md'>
            Medium
          </Button>
          <Button variant='destructive' size='lg'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Outline</h3>
        <div className='flex gap-3'>
          <Button variant='outline' size='sm'>
            Small
          </Button>
          <Button variant='outline' size='md'>
            Medium
          </Button>
          <Button variant='outline' size='lg'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Ghost</h3>
        <div className='flex gap-3'>
          <Button variant='ghost' size='sm'>
            Small
          </Button>
          <Button variant='ghost' size='md'>
            Medium
          </Button>
          <Button variant='ghost' size='lg'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Link</h3>
        <div className='flex gap-3'>
          <Button variant='link' size='sm'>
            Small
          </Button>
          <Button variant='link' size='md'>
            Medium
          </Button>
          <Button variant='link' size='lg'>
            Large
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>States</h3>
        <div className='flex gap-3'>
          <Button variant='primary' loading>
            Loading
          </Button>
          <Button variant='secondary' disabled>
            Disabled
          </Button>
          <Button variant='destructive'>
            Delete
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>With Icons</h3>
        <div className='flex gap-3'>
          <Button variant='primary' icon={<icons.add />}>
            Add
          </Button>
          <Button variant='secondary' iconPosition='right' icon={<icons.download />}>
            Download
          </Button>
          <Button variant='destructive' icon={<icons.delete />}>
            Delete
          </Button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Full Width</h3>
        <div className='flex flex-col gap-3'>
          <Button variant='primary' fullWidth>
            Full Width Primary
          </Button>
          <Button variant='secondary' fullWidth>
            Full Width Secondary
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

// ============================================================================
// Interactive
// ============================================================================

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

export const Playground: Story = {
  render: (args) => <Button {...args}>Button</Button>,
  parameters: {
    controls: { expanded: true },
  },
}

// ============================================================================
// Design System Integration
// ============================================================================

export const DesignSystemColors: Story = {
  render: () => (
    <div className='flex flex-col gap-4 p-8'>
      <h2 className='text-2xl font-bold'>디자인 시스템 색상 통합</h2>
      <p className='text-muted-foreground'>
        모든 버튼 변형은 일관성을 위해 디자인 시스템 색상 토큰을 사용합니다
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <h4 className='font-medium'>시맨틱 색상</h4>
          <Button variant='primary' fullWidth>
            Primary (brand)
          </Button>
          <Button variant='secondary' fullWidth>
            Secondary
          </Button>
          <Button variant='accent' fullWidth>
            Accent
          </Button>
          <Button variant='destructive' fullWidth>
            Destructive (error)
          </Button>
        </div>

        <div className='space-y-2'>
          <h4 className='font-medium'>Subtle 변형</h4>
          <Button variant='outline' fullWidth>
            Outline
          </Button>
          <Button variant='ghost' fullWidth>
            Ghost
          </Button>
          <Button variant='link' fullWidth>
            Link
          </Button>
        </div>

        <div className='space-y-2'>
          <h4 className='font-medium'>상태</h4>
          <Button variant='primary' loading fullWidth>
            Loading State
          </Button>
          <Button variant='primary' disabled fullWidth>
            Disabled State
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
