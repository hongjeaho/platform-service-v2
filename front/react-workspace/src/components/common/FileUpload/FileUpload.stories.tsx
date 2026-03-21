import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { Button } from '../Button'
import { FileUpload } from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'Common/FileUpload',
  component: FileUpload,
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
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
    accept: {
      control: 'text',
      description: '허용 파일 타입 (예: image/*, .pdf)',
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
    onFilesChange: { action: 'filesChange' },
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof FileUpload>

// ============================================================================
// 기본
// ============================================================================

export const Default: Story = {
  args: {},
}

// ============================================================================
// 크기
// ============================================================================

export const Small: Story = {
  args: {
    size: 'sm',
    label: '소형',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    label: '중형',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    label: '대형',
  },
}

// ============================================================================
// 라벨 & 에러
// ============================================================================

export const WithLabel: Story = {
  args: {
    label: '첨부파일',
    required: true,
  },
}

export const WithAccept: Story = {
  args: {
    label: '이미지 파일',
    accept: 'image/*',
  },
}

export const WithError: Story = {
  args: {
    label: '첨부파일',
    required: true,
    error: '파일을 선택해 주세요.',
  },
}

// ============================================================================
// 상태
// ============================================================================

export const Disabled: Story = {
  args: {
    label: '첨부파일',
    disabled: true,
  },
}

// ============================================================================
// React Hook Form
// ============================================================================

type RHFDemoForm = {
  attachment: FileList
}

function RHFDemoFormInner() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFDemoForm>()

  const onSubmit = (data: RHFDemoForm) => {
    const fileName = data.attachment?.[0]?.name ?? '없음'
    alert(`선택된 파일: ${fileName}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-80 flex-col gap-4'>
      <FileUpload
        label='첨부파일'
        required
        {...register('attachment', { required: '파일을 선택해 주세요.' })}
        error={errors.attachment?.message}
      />
      <Button type='submit'>제출</Button>
    </form>
  )
}

export const WithReactHookForm: Story = {
  render: () => <RHFDemoFormInner />,
  parameters: {
    docs: {
      description: {
        story:
          '단일 파일 선택. `register()`를 스프레드하고 `error={errors.fieldName?.message}`로 검증 메시지를 연결합니다.',
      },
    },
  },
}

// ============================================================================
// Playground
// ============================================================================

export const Playground: Story = {
  args: {
    size: 'md',
    disabled: false,
    label: '파일 업로드',
    required: false,
  },
  parameters: {
    controls: { expanded: true },
  },
}
