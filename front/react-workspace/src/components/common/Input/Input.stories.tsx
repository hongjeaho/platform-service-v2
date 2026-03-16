import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Common/Input',
  component: Input,
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
    type: {
      control: 'text',
      description: 'input type (text, email, password 등)',
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
type Story = StoryObj<typeof Input>

// ============================================================================
// Variants
// ============================================================================

export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Primary input',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: 'Secondary input',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: 'Tertiary input',
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
}

// ============================================================================
// States
// ============================================================================

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only value',
    placeholder: 'Read-only input',
  },
}

// ============================================================================
// With label & error
// ============================================================================

export const WithLabel: Story = {
  args: {
    label: '아이디',
    placeholder: '아이디를 입력하세요',
    required: true,
  },
}

export const WithLabelAndError: Story = {
  args: {
    label: '이메일',
    placeholder: 'example@email.com',
    error: '올바른 이메일 형식이 아닙니다.',
    value: 'invalid',
  },
}

// ============================================================================
// React Hook Form
// ============================================================================

type RHFDemoForm = {
  name: string
  email: string
}

function RHFDemoFormInner() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFDemoForm>({
    defaultValues: { name: '', email: '' },
  })

  const onSubmit = (data: RHFDemoForm) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-80 flex-col gap-4"
    >
      <Input
        label="이름"
        placeholder="이름을 입력하세요"
        required
        {...register('name', { required: '이름을 입력해 주세요.' })}
        error={errors.name?.message}
      />
      <Input
        label="이메일"
        type="email"
        placeholder="example@email.com"
        required
        {...register('email', {
          required: '이메일을 입력해 주세요.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '올바른 이메일 형식을 입력해 주세요.',
          },
        })}
        error={errors.email?.message}
      />
      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        제출
      </button>
    </form>
  )
}

const RHFUsageCode = `import { useForm } from 'react-hook-form'
import { Input } from '@/components/common/Input'

type FormValues = { name: string; email: string }

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: '', email: '' } })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="flex flex-col gap-4">
      <Input
        label="이름"
        placeholder="이름을 입력하세요"
        required
        {...register('name', { required: '이름을 입력해 주세요.' })}
        error={errors.name?.message}
      />
      <Input
        label="이메일"
        type="email"
        placeholder="example@email.com"
        required
        {...register('email', {
          required: '이메일을 입력해 주세요.',
          pattern: {
            value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
            message: '올바른 이메일 형식을 입력해 주세요.',
          },
        })}
        error={errors.email?.message}
      />
      <button type="submit">제출</button>
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
