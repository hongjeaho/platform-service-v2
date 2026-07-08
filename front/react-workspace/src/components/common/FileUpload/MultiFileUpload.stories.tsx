import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../Button'
import { MultiFileUpload } from './MultiFileUpload'
import type { ManagedFile, ServerFileInfo } from './MultiFileUpload.type'

// ============================================================================
// 공통 Render — meta.render로 연결
// ============================================================================

type Story = StoryObj<typeof MultiFileUpload>

const Render: Story['render'] = args => <MultiFileUpload {...args} />

const meta: Meta<typeof MultiFileUpload> = {
  title: 'Common/MultiFileUpload',
  component: MultiFileUpload,
  render: Render,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '드롭존 박스 크기 (고정 높이)',
    },
    maxFiles: {
      control: 'number',
      description: '최대 파일 수',
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
    onManagedFilesChange: { action: 'managedFilesChange' },
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
// 라벨 & 옵션
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

export const WithMaxFiles: Story = {
  args: {
    label: '첨부파일 (최대 3개)',
    maxFiles: 3,
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
// 파일이 많을 때 (스크롤 확인용)
// ============================================================================

const manyFiles: ServerFileInfo[] = Array.from({ length: 8 }, (_, i) => ({
  seqNo: i + 1,
  name: `문서_${i + 1}.pdf`,
  size: 1024 * (i + 1) * 20,
}))

export const ScrollableFileList: Story = {
  args: {
    label: '첨부파일 (스크롤 확인)',
    initialFiles: manyFiles,
  },
  parameters: {
    docs: {
      description: {
        story:
          '박스 높이는 size별로 고정되어 있어, 파일이 많아지면 헤더 아래 목록 영역이 내부 스크롤됩니다.',
      },
    },
  },
}

// ============================================================================
// React Hook Form (예외 — 복합 컴포넌트 조합 예제)
// ============================================================================

type RHFDemoForm = {
  attachments: FileList
}

const RHFRender: Story['render'] = args => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFDemoForm>()

  const onSubmit = (data: RHFDemoForm) => {
    const fileNames = Array.from(data.attachments ?? [])
      .map(f => f.name)
      .join(', ')
    alert(`선택된 파일: ${fileNames || '없음'}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-96 flex-col gap-4'>
      <MultiFileUpload
        {...args}
        label='첨부파일'
        required
        maxFiles={5}
        {...register('attachments', { required: '파일을 선택해 주세요.' })}
        error={errors.attachments?.message}
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
          '복수 파일 선택. 박스 내부에 파일 목록이 함께 표시됩니다. `register()`를 스프레드하고 `error`를 연결합니다.',
      },
      source: {
        language: 'tsx',
        code: `
const { register, handleSubmit, formState: { errors } } = useForm<{ attachments: FileList }>()

const onSubmit = (data: { attachments: FileList }) => {
  const fileNames = Array.from(data.attachments ?? []).map(f => f.name).join(', ')
  alert(\`선택된 파일: \${fileNames || '없음'}\`)
}

<form onSubmit={handleSubmit(onSubmit)} className="flex w-96 flex-col gap-4">
  <MultiFileUpload
    label="첨부파일"
    required
    maxFiles={5}
    {...register('attachments', { required: '파일을 선택해 주세요.' })}
    error={errors.attachments?.message}
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

const existingFiles: ServerFileInfo[] = [
  { seqNo: 101, name: '계획서_2024.pdf', size: 204800 },
  { seqNo: 102, name: '결과보고.xlsx', size: 51200 },
]

type RHFEditDemoForm = { attachments: FileList }

const RHFEditRender: Story['render'] = args => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RHFEditDemoForm>()

  const [managedFiles, setManagedFiles] = useState<ManagedFile[]>([])

  const onSubmit = () => {
    const toDelete = managedFiles
      .filter((f): f is Extract<ManagedFile, { state: 'deleted' }> => f.state === 'deleted')
      .map(f => f.seqNo)
    const toUpload = managedFiles
      .filter((f): f is Extract<ManagedFile, { state: 'added' }> => f.state === 'added')
      .map(f => f.file)

    const parts: string[] = []
    if (toDelete.length > 0) parts.push(`삭제된 파일 seqNo: [${toDelete.join(', ')}]`)
    if (toUpload.length > 0) parts.push(`신규 업로드: ${toUpload.map(f => f.name).join(', ')}`)
    if (parts.length === 0) parts.push('변경 없음 (기존 파일 유지)')

    alert(parts.join('\n'))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-96 flex-col gap-4'>
      <MultiFileUpload
        {...args}
        initialFiles={existingFiles}
        label='첨부파일'
        required
        maxFiles={5}
        {...register('attachments')}
        error={errors.attachments?.message}
        onManagedFilesChange={setManagedFiles}
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
          '수정 시나리오: `initialFiles`로 서버 기존 파일을 미리 채웁니다. 기존 파일을 삭제하면 목록에서는 사라지지만 `onManagedFilesChange`에는 deleted 상태로 유지되어, 제출 시 삭제 대상 seqNo를 계산할 수 있습니다.',
      },
    },
  },
}
