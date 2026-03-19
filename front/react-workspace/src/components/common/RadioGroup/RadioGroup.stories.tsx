import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { Button } from '../Button'
import { RadioGroup } from './RadioGroup'
import { RadioGroupItem } from './RadioGroupItem'

const meta: Meta<typeof RadioGroup> = {
  title: 'Common/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: '비제어 모드 초기값',
    },
    disabled: {
      control: 'boolean',
      description: '그룹 비활성화',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '크기',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '배치 방향',
    },
    name: {
      control: 'text',
      description: '폼 필드 이름',
    },
    onChange: { action: 'changed' },
    onValueChange: { action: 'valueChange' },
    onBlur: { action: 'blurred' },
  },
  decorators: [
    Story => (
      <div style={{ minWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const defaultItems = (
  <>
    <RadioGroupItem value='0001' textValue='딸기'>
      딸기
    </RadioGroupItem>
    <RadioGroupItem value='0002' textValue='바나나'>
      바나나
    </RadioGroupItem>
    <RadioGroupItem value='0003' textValue='수박'>
      수박
    </RadioGroupItem>
  </>
)

// ============================================================================
// Default
// ============================================================================

export const Default: Story = {
  args: {
    defaultValue: '0001',
    name: 'fruit',
    children: defaultItems,
  },
}

// ============================================================================
// Size
// ============================================================================

export const SizeSm: Story = {
  args: {
    defaultValue: '0002',
    size: 'sm',
    name: 'fruit',
    children: defaultItems,
  },
}

export const SizeMd: Story = {
  args: {
    defaultValue: '0002',
    size: 'md',
    name: 'fruit',
    children: defaultItems,
  },
}

export const SizeLg: Story = {
  args: {
    defaultValue: '0002',
    size: 'lg',
    name: 'fruit',
    children: defaultItems,
  },
}

// ============================================================================
// Orientation
// ============================================================================

export const Horizontal: Story = {
  args: {
    defaultValue: '0001',
    orientation: 'horizontal',
    name: 'fruit',
    children: defaultItems,
  },
}

export const Vertical: Story = {
  args: {
    defaultValue: '0001',
    orientation: 'vertical',
    name: 'fruit',
    children: defaultItems,
  },
}

// ============================================================================
// States
// ============================================================================

export const Disabled: Story = {
  args: {
    defaultValue: '0002',
    disabled: true,
    name: 'fruit',
    children: defaultItems,
  },
}

export const DisabledItem: Story = {
  args: {
    defaultValue: '0001',
    name: 'fruit',
    children: (
      <>
        <RadioGroupItem value='0001' textValue='딸기'>
          딸기
        </RadioGroupItem>
        <RadioGroupItem value='0002' textValue='바나나' disabled>
          바나나 (비활성)
        </RadioGroupItem>
        <RadioGroupItem value='0003' textValue='수박'>
          수박
        </RadioGroupItem>
      </>
    ),
  },
}

// ============================================================================
// React Hook Form
// ============================================================================

type RHFDemoForm = {
  fruit: string
}

const RenderRHF: Story['render'] = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFDemoForm>({
    defaultValues: { fruit: '' },
  })

  const onSubmit = (data: RHFDemoForm) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-80 flex-col gap-4'>
      <RadioGroup
        {...register('fruit', { required: '과일을 선택해 주세요.' })}
        error={errors.fruit?.message}
      >
        <RadioGroupItem value='0001' textValue='딸기'>
          딸기
        </RadioGroupItem>
        <RadioGroupItem value='0002' textValue='바나나'>
          바나나
        </RadioGroupItem>
        <RadioGroupItem value='0003' textValue='수박'>
          수박
        </RadioGroupItem>
      </RadioGroup>
      <Button type='submit'>제출</Button>
    </form>
  )
}

const RHFUsageCode = `import { useForm } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/common/RadioGroup'
import { Button } from '@/components/common/Button'

type FormValues = { fruit: string }

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { fruit: '' } })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="flex w-80 flex-col gap-4">
      <RadioGroup
        name="fruit"
        {...register('fruit', { required: '과일을 선택해 주세요.' })}
        error={errors.fruit?.message}
      >
        <RadioGroupItem value="0001" textValue="딸기">딸기</RadioGroupItem>
        <RadioGroupItem value="0002" textValue="바나나">바나나</RadioGroupItem>
        <RadioGroupItem value="0003" textValue="수박">수박</RadioGroupItem>
      </RadioGroup>
      <Button type="submit">
        제출
      </Button>
    </form>
  )
}
`

export const WithReactHookForm: Story = {
  render: RenderRHF,
  parameters: {
    docs: {
      description: {
        story:
          '`register()`를 스프레드하여 사용합니다. 초기값을 빈 문자열로 두면 선택 전 제출 시 required 검증이 동작합니다. 검증 에러는 `error` prop으로 전달합니다.',
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
    defaultValue: '0001',
    disabled: false,
    size: 'md',
    orientation: 'horizontal',
    name: 'fruit',
    children: defaultItems,
  },
  parameters: {
    controls: { expanded: true },
  },
}
