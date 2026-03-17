import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { Select, SelectItem } from '.'

const meta: Meta<typeof Select> = {
  title: 'Common/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '크기',
    },
    limit: {
      control: { type: 'number', min: 1, max: 20 },
      description: '목록에 표시할 최대 항목 수',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
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
    onValueChange: { action: 'valueChange' },
    onBlur: { action: 'blurred' },
  },
}

export default meta
type Story = StoryObj<typeof Select>

const defaultChildren = (
  <>
    <SelectItem value="0001">딸기</SelectItem>
    <SelectItem value="0002">바나나</SelectItem>
    <SelectItem value="0003">수박</SelectItem>
    <SelectItem value="0004">사과</SelectItem>
    <SelectItem value="0005">포도</SelectItem>
    <SelectItem value="0006">키위</SelectItem>
  </>
)

// ============================================================================
// Default
// ============================================================================

export const Default: Story = {
  args: {
    placeholder: '과일을 선택하세요',
    limit: 5,
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

// ============================================================================
// With label & error
// ============================================================================

export const WithLabel: Story = {
  args: {
    label: '과일',
    placeholder: '선택하세요',
    required: true,
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

export const WithLabelAndError: Story = {
  args: {
    label: '과일',
    placeholder: '선택하세요',
    error: '과일을 선택해 주세요.',
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

// ============================================================================
// Sizes
// ============================================================================

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small',
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium',
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large',
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

// ============================================================================
// States
// ============================================================================

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화됨',
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

export const WithDefaultValue: Story = {
  args: {
    placeholder: '선택하세요',
    defaultValue: '0002',
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

// ============================================================================
// Limit (스크롤)
// ============================================================================

export const LimitTwo: Story = {
  args: {
    placeholder: '최대 2개만 보임',
    limit: 2,
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
}

// ============================================================================
// With disabled item
// ============================================================================

export const WithDisabledItem: Story = {
  args: {
    placeholder: '선택하세요',
    children: (
      <>
        <SelectItem value="a">옵션 A</SelectItem>
        <SelectItem value="b" disabled>
          옵션 B (비활성)
        </SelectItem>
        <SelectItem value="c">옵션 C</SelectItem>
      </>
    ),
  },
  render: args => (
    <Select {...args}>
      <SelectItem value="a">옵션 A</SelectItem>
      <SelectItem value="b" disabled>
        옵션 B (비활성)
      </SelectItem>
      <SelectItem value="c">옵션 C</SelectItem>
    </Select>
  ),
}

// ============================================================================
// React Hook Form
// ============================================================================

type RHFSelectForm = {
  fruit: string
}

function RHFSelectFormInner() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFSelectForm>({
    defaultValues: { fruit: '' },
  })

  const onSubmit = (data: RHFSelectForm) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col gap-4">
      <Select
        label="과일"
        placeholder="선택하세요"
        required
        {...register('fruit', { required: '과일을 선택해 주세요.' })}
        error={errors.fruit?.message}
      >
        <SelectItem value="0001">딸기</SelectItem>
        <SelectItem value="0002">바나나</SelectItem>
        <SelectItem value="0003">수박</SelectItem>
      </Select>
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
import { Select, SelectItem } from '@/components/common/Select'

type FormValues = { fruit: string }

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { fruit: '' } })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="flex flex-col gap-4">
      <Select
        label="과일"
        placeholder="선택하세요"
        required
        {...register('fruit', { required: '과일을 선택해 주세요.' })}
        error={errors.fruit?.message}
      >
        <SelectItem value="0001">딸기</SelectItem>
        <SelectItem value="0002">바나나</SelectItem>
        <SelectItem value="0003">수박</SelectItem>
      </Select>
      <button type="submit">제출</button>
    </form>
  )
}
`

export const WithReactHookForm: Story = {
  render: () => <RHFSelectFormInner />,
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
    placeholder: '선택하세요',
    size: 'md',
    limit: 5,
    disabled: false,
    label: '과일',
    required: false,
    children: defaultChildren,
  },
  render: args => <Select {...args}>{defaultChildren}</Select>,
  parameters: {
    controls: { expanded: true },
  },
}
