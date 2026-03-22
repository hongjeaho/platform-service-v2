import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../Button'
import { FileUpload } from './FileUpload'
import type { ServerFileInfo } from './FileUpload.type'

// ============================================================================
// 공통 Render — meta.render로 연결
// ============================================================================

type Story = StoryObj<typeof FileUpload>

const Render: Story['render'] = args => <FileUpload {...args} />

const meta: Meta<typeof FileUpload> = {
  title: 'Common/FileUpload',
  component: FileUpload,
  render: Render,
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
// React Hook Form (예외 — 복합 컴포넌트 조합 예제)
// ============================================================================

type RHFDemoForm = {
  attachment: FileList
}

const RHFRender: Story['render'] = args => {
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
        {...args}
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
  render: RHFRender,
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '단일 파일 선택. `register()`를 스프레드하고 `error={errors.fieldName?.message}`로 검증 메시지를 연결합니다.',
      },
      source: {
        language: 'tsx',
        code: `
const { register, handleSubmit, formState: { errors } } = useForm<{ attachment: FileList }>()

const onSubmit = (data: { attachment: FileList }) => {
  const fileName = data.attachment?.[0]?.name ?? '없음'
  alert(\`선택된 파일: \${fileName}\`)
}

<form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col gap-4">
  <FileUpload
    label="첨부파일"
    required
    {...register('attachment', { required: '파일을 선택해 주세요.' })}
    error={errors.attachment?.message}
  />
  <Button type="submit">제출</Button>
</form>
        `.trim(),
      },
    },
  },
}

// ============================================================================
// React Hook Form — 수정 시나리오 (기존 파일 있음)
// ============================================================================

const existingFile: ServerFileInfo = { seqNo: 101, name: '보고서_2024.pdf', size: 204800 }

type RHFEditDemoForm = { attachment: FileList }

const RHFEditRender: Story['render'] = args => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFEditDemoForm>()

  const [fileStatus, setFileStatus] = useState<'existing' | 'replaced' | 'deleted'>('existing')

  const onSubmit = (data: RHFEditDemoForm) => {
    if (fileStatus === 'deleted') {
      alert(`기존 파일 삭제됨 (seqNo: ${existingFile.seqNo})`)
    } else if (data.attachment?.[0]) {
      alert(`새 파일로 교체됨: ${data.attachment[0].name}`)
    } else {
      alert(`기존 파일 유지: ${existingFile.name}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-80 flex-col gap-4'>
      <FileUpload
        {...args}
        initialFile={existingFile}
        label='첨부파일'
        required
        {...register('attachment')}
        error={errors.attachment?.message}
        onFilesChange={files => {
          setFileStatus(files.length === 0 ? 'deleted' : 'replaced')
        }}
      />
      <Button type='submit'>저장</Button>
    </form>
  )
}

export const WithReactHookFormEdit: Story = {
  render: RHFEditRender,
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          '수정 폼: 서버에서 받아온 기존 파일(`initialFile`)이 사전 표시됩니다. 삭제하거나 새 파일로 교체할 수 있습니다. `onFilesChange`로 상태 변화를 감지해 제출 시 처리합니다.',
      },
      source: {
        language: 'tsx',
        code: `
// 서버 응답 데이터
const existingFile = { seqNo: 101, name: '보고서_2024.pdf', size: 204800 }

const { register, handleSubmit, formState: { errors } } = useForm<{ attachment: FileList }>()
const [fileStatus, setFileStatus] = useState<'existing' | 'replaced' | 'deleted'>('existing')

const onSubmit = (data: { attachment: FileList }) => {
  if (fileStatus === 'deleted') {
    // 기존 파일 삭제 → 서버에 삭제 요청 (existingFile.seqNo 사용)
  } else if (data.attachment?.[0]) {
    // 새 파일로 교체 → 새 파일 업로드 후 서버 파일 교체
  } else {
    // 변경 없음 → 기존 파일 유지
  }
}

<form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col gap-4">
  <FileUpload
    initialFile={existingFile}
    label="첨부파일"
    required
    {...register('attachment')}
    error={errors.attachment?.message}
    onFilesChange={(files) => {
      setFileStatus(files.length === 0 ? 'deleted' : 'replaced')
    }}
  />
  <Button type="submit">저장</Button>
</form>
        `.trim(),
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
