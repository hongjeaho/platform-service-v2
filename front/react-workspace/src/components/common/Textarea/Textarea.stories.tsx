import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { Button } from '../Button'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Common/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '시각적 variant',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder',
    },
    label: {
      control: 'text',
      description: '필드 라벨',
    },
    error: {
      control: 'text',
      description: '에러 메시지',
    },
    required: {
      control: 'boolean',
      description: '필수 여부',
    },
    onChange: { action: 'changed' },
    onValueChange: { action: 'valueChange' },
    onBlur: { action: 'blurred' },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

// ============================================================================
// Variants
// ============================================================================

export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Primary textarea',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: 'Secondary textarea',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: 'Tertiary textarea',
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small textarea',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium textarea',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large textarea',
  },
}

// ============================================================================
// States
// ============================================================================

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only value',
    placeholder: 'Read-only textarea',
  },
}

// ============================================================================
// With label & error
// ============================================================================

export const WithLabel: Story = {
  args: {
    label: '설명',
    placeholder: '내용을 입력하세요',
    required: true,
  },
}

export const WithLabelAndError: Story = {
  args: {
    label: '설명',
    placeholder: '내용을 입력하세요',
    error: '최소 10자 이상 입력해 주세요.',
    value: '짧음',
  },
}

// ============================================================================
// React Hook Form
// ============================================================================

type RHFDemoForm = {
  description: string
  comment: string
}

function RHFDemoFormInner() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFDemoForm>({
    defaultValues: { description: '', comment: '' },
  })

  const onSubmit = (data: RHFDemoForm) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-80 flex-col gap-4'>
      <Textarea
        label='설명'
        placeholder='설명을 입력하세요'
        required
        {...register('description', { required: '설명을 입력해 주세요.' })}
        error={errors.description?.message}
      />
      <Textarea
        label='의견'
        placeholder='의견을 입력하세요 (선택)'
        {...register('comment', { minLength: { value: 10, message: '10자 이상 입력해 주세요.' } })}
        error={errors.comment?.message}
      />
      <Button type='submit'>제출</Button>
    </form>
  )
}

const RHFUsageCode = `import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/common/Textarea'
import { Button } from '@/components/common/Button'

type FormValues = { description: string }

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { description: '' } })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="flex flex-col gap-4">
      <Textarea
        label="설명"
        placeholder="내용을 입력하세요"
        required
        {...register('description', { required: '설명을 입력해 주세요.' })}
        error={errors.description?.message}
      />
      <Button type="submit">제출</Button>
    </form>
  )
}
`

export const WithReactHookForm: Story = {
  render: () => <RHFDemoFormInner />,
  parameters: {
    docs: {
      description: {
        story:
          '`register()`를 스프레드하고 `error={errors.fieldName?.message}`로 검증 메시지를 연결합니다. value를 넘기지 않으면 비제어로 동작해 RHF와 호환됩니다.',
      },
      source: {
        code: RHFUsageCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
}

// ============================================================================
// Playground
// ============================================================================

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    placeholder: 'Playground',
    disabled: false,
    readOnly: false,
  },
  parameters: {
    controls: { expanded: true },
  },
}
