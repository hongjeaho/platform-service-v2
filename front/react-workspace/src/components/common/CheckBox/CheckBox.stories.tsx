import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { CheckBox } from './CheckBox'

const meta: Meta<typeof CheckBox> = {
  title: 'Common/CheckBox',
  component: CheckBox,
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
    checked: {
      control: 'boolean',
      description: '체크 여부 (제어 모드)',
    },
    value: {
      control: 'text',
      description: '폼 제출 시 전달되는 값',
    },
    textValue: {
      control: 'text',
      description: '체크박스 옆 표시 텍스트',
    },
    onChange: { action: 'changed' },
    onValueChange: { action: 'valueChange' },
    onBlur: { action: 'blurred' },
  },
}

export default meta
type Story = StoryObj<typeof CheckBox>

// ============================================================================
// Variants
// ============================================================================

export const Primary: Story = {
  args: {
    variant: 'primary',
    textValue: 'Primary 옵션',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    textValue: 'Secondary 옵션',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    textValue: 'Tertiary 옵션',
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const Small: Story = {
  args: {
    size: 'sm',
    textValue: 'Small',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    textValue: 'Medium',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    textValue: 'Large',
  },
}

// ============================================================================
// States
// ============================================================================

export const Checked: Story = {
  args: {
    checked: true,
    textValue: '체크됨',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    textValue: '비활성화',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    textValue: '비활성화 + 체크',
  },
}

// ============================================================================
// React Hook Form
// ============================================================================

type RHFDemoForm = {
  agree: boolean
  marketing: boolean
}

function RHFDemoFormInner() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFDemoForm>({
    defaultValues: { agree: false, marketing: false },
  })

  const onSubmit = (data: RHFDemoForm) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-80 flex-col gap-4'>
      <CheckBox
        textValue='이용약관에 동의합니다 (필수)'
        value='agree'
        {...register('agree', { required: '이용약관 동의가 필요합니다.' })}
      />
      <CheckBox
        textValue='마케팅 수신에 동의합니다 (선택)'
        value='marketing'
        {...register('marketing')}
      />
      {errors.agree?.message && (
        <p className='text-sm text-destructive' role='alert'>
          {errors.agree.message}
        </p>
      )}
      <button type='submit' className='rounded bg-primary px-4 py-2 text-primary-foreground'>
        제출
      </button>
    </form>
  )
}

const RHFUsageCode = `import { useForm } from 'react-hook-form'
import { CheckBox } from '@/components/common/CheckBox'

type FormValues = { agree: boolean; marketing: boolean }

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { agree: false, marketing: false } })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="flex w-80 flex-col gap-4">
      <CheckBox
        textValue="이용약관에 동의합니다 (필수)"
        value="agree"
        {...register('agree', { required: '이용약관 동의가 필요합니다.' })}
      />
      <CheckBox
        textValue="마케팅 수신에 동의합니다 (선택)"
        value="marketing"
        {...register('marketing')}
      />
      {errors.agree?.message && (
        <p className="text-sm text-destructive" role="alert">{errors.agree.message}</p>
      )}
      <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground">
        제출
      </button>
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
          '`register()`를 스프레드하여 사용합니다. 검증 에러는 폼 레벨에서 errors를 사용해 표시합니다. checked를 넘기지 않으면 비제어로 동작해 RHF와 호환됩니다.',
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
    disabled: false,
    checked: false,
    value: 'on',
    textValue: 'Playground 옵션',
  },
  parameters: {
    controls: { expanded: true },
  },
}
