import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../Button'
import { AttachmentGroup } from './AttachmentGroup'
import { AttachmentRow } from './AttachmentRow'
import type { ManagedFile, ServerFileInfo, SingleManagedFile } from './AttachmentRow.type'

// ============================================================================
// 공통 Render — meta.render로 연결
// ============================================================================

type Story = StoryObj<typeof AttachmentGroup>

const Render: Story['render'] = args => <AttachmentGroup {...args} />

const meta: Meta<typeof AttachmentGroup> = {
  title: 'Common/AttachmentGroup',
  component: AttachmentGroup,
  render: Render,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: 700 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: '섹션 헤더 라벨',
    },
    disabled: {
      control: 'boolean',
      description: '전체 비활성화 (모든 AttachmentRow에 전파)',
    },
  },
}

export default meta

// ============================================================================
// 기본
// ============================================================================

export const Default: Story = {
  args: {
    label: '첨부서류',
    children: (
      <>
        <AttachmentRow label='주민등록증' required />
        <AttachmentRow label='사업자등록증' />
        <AttachmentRow label='관련 서류' multiple maxFiles={5} />
      </>
    ),
  },
}

// ============================================================================
// 라벨 없음 (섹션 헤더 미사용)
// ============================================================================

export const WithoutLabel: Story = {
  args: {
    children: (
      <>
        <AttachmentRow label='주민등록증' required />
        <AttachmentRow label='관련 서류' multiple />
      </>
    ),
  },
}

// ============================================================================
// 에러 상태
// ============================================================================

export const WithErrors: Story = {
  args: {
    label: '첨부서류',
    children: (
      <>
        <AttachmentRow label='주민등록증' required error='주민등록증을 첨부해 주세요.' />
        <AttachmentRow label='사업자등록증' />
        <AttachmentRow
          label='관련 서류'
          multiple
          maxFiles={3}
          error='관련 서류를 최소 1개 이상 첨부해 주세요.'
        />
      </>
    ),
  },
}

// ============================================================================
// 전체 비활성화
// ============================================================================

export const Disabled: Story = {
  args: {
    label: '첨부서류 (제출 후 수정 불가)',
    disabled: true,
    children: (
      <>
        <AttachmentRow label='주민등록증' required />
        <AttachmentRow label='관련 서류' multiple />
      </>
    ),
  },
}

// ============================================================================
// 허용 파일 형식 지정
// ============================================================================

export const WithAccept: Story = {
  args: {
    label: '서류 첨부',
    children: (
      <>
        <AttachmentRow label='이미지' accept='image/*' />
        <AttachmentRow label='PDF 문서' accept='.pdf' multiple maxFiles={3} />
        <AttachmentRow label='워드/엑셀' accept='.doc,.docx,.xls,.xlsx' multiple />
      </>
    ),
  },
}

// ============================================================================
// 10개 이상 필드 (공간 효율 시연)
// ============================================================================

export const FullForm: Story = {
  args: {
    label: '사업 신청 첨부서류',
    children: (
      <>
        <AttachmentRow label='사업자등록증' required />
        <AttachmentRow label='법인등기부등본' />
        <AttachmentRow label='주주명부' />
        <AttachmentRow label='재무제표' multiple maxFiles={3} accept='.pdf,.xlsx' />
        <AttachmentRow label='사업계획서' accept='.pdf,.docx' />
        <AttachmentRow label='대표자 신분증' required accept='image/*,.pdf' />
        <AttachmentRow label='인감증명서' required />
        <AttachmentRow label='위임장' />
        <AttachmentRow label='관련 사진' multiple accept='image/*' />
        <AttachmentRow label='기타 서류' multiple />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '10개 이상의 첨부파일 필드를 한 화면에 표시합니다. 기존 MultiFileUpload 대비 약 66% 공간을 절감합니다.',
      },
    },
  },
}

// ============================================================================
// React Hook Form 연동 (예외 — 복합 컴포넌트 조합 예제)
// ============================================================================

type RHFDemoForm = {
  idCard: FileList
  bizReg: FileList
  documents: FileList
  financial: FileList
}

const RHFRender: Story['render'] = args => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RHFDemoForm>()

  const onSubmit = (data: RHFDemoForm) => {
    const summary = Object.entries(data)
      .map(([key, files]) => `${key}: ${Array.from(files ?? []).length}개`)
      .join(', ')
    alert(`제출됨 — ${summary}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <AttachmentGroup {...args} disabled={isSubmitting}>
        <AttachmentRow
          label='주민등록증'
          required
          {...register('idCard', { required: '주민등록증을 첨부해 주세요.' })}
          error={errors.idCard?.message}
        />
        <AttachmentRow label='사업자등록증' {...register('bizReg')} />
        <AttachmentRow
          label='관련 서류'
          multiple
          maxFiles={5}
          accept='.pdf,.docx'
          {...register('documents', { required: '관련 서류를 첨부해 주세요.' })}
          error={errors.documents?.message}
        />
        <AttachmentRow label='재무제표' multiple {...register('financial')} />
      </AttachmentGroup>
      <Button type='submit'>제출</Button>
    </form>
  )
}

export const WithReactHookForm: Story = {
  render: RHFRender,
  args: {
    label: '첨부서류',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`register()`를 스프레드하고 `error={errors.fieldName?.message}`로 검증 메시지를 연결합니다. `disabled={isSubmitting}`으로 제출 중 전체 비활성화됩니다.',
      },
    },
  },
}

// ============================================================================
// 수정 시나리오 (React Hook Form + 기존 서버 파일)
// ============================================================================

type EditDemoForm = {
  idCard: FileList
  documents: FileList
  optional: FileList
}

const serverFile: ServerFileInfo = { seqNo: 1, name: '기존_주민등록증.pdf', size: 1024 * 1024 }
const serverFiles: ServerFileInfo[] = [
  { seqNo: 2, name: '계약서.pdf', size: 512 * 1024 },
  { seqNo: 3, name: '첨부서류.docx', size: 256 * 1024 },
]

const EditRHFRender: Story['render'] = args => {
  const [singleManaged, setSingleManaged] = useState<SingleManagedFile | null>(null)
  const [multiManaged, setMultiManaged] = useState<ManagedFile[]>([])
  const [optionalManaged, setOptionalManaged] = useState<SingleManagedFile | null>(null)

  const { register, handleSubmit } = useForm<EditDemoForm>()

  const onSubmit = () => {
    const toDeleteSeqNos: number[] = []
    const toUploadFiles: string[] = []

    // 단일 파일 처리
    if (singleManaged?.state === 'deleted') {
      toDeleteSeqNos.push(singleManaged.seqNo)
    } else if (singleManaged?.state === 'replace') {
      toDeleteSeqNos.push(singleManaged.seqNo)
      toUploadFiles.push(singleManaged.file.name)
    } else if (singleManaged?.state === 'added') {
      toUploadFiles.push(singleManaged.file.name)
    }

    // 선택 파일 처리 (필수 아님)
    if (optionalManaged?.state === 'added') {
      toUploadFiles.push(optionalManaged.file.name)
    }

    // 복수 파일 처리
    multiManaged.filter(f => f.state === 'deleted').forEach(f => toDeleteSeqNos.push(f.seqNo))
    multiManaged
      .filter((f): f is Extract<ManagedFile, { state: 'added' }> => f.state === 'added')
      .forEach(f => toUploadFiles.push(f.file.name))

    alert(
      `수정 제출\n삭제 seqNo: [${toDeleteSeqNos.join(', ')}]\n업로드: [${toUploadFiles.join(', ')}]`,
    )
  }

  const singleState = singleManaged?.state ?? 'existing'
  const optionalState = optionalManaged?.state ?? 'none'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <AttachmentGroup {...args}>
        {/* 필수 단일 파일: 기존 파일 있음 → existing/deleted/replace */}
        <AttachmentRow
          label='주민등록증'
          required
          {...register('idCard')}
          initialFile={serverFile}
          onManagedFileChange={setSingleManaged}
        />
        {/* 선택 단일 파일: 기존 파일 없음 → added */}
        <AttachmentRow
          label='추가 서류'
          {...register('optional')}
          onManagedFileChange={setOptionalManaged}
        />
        {/* 복수 파일: 기존 파일 2개 → existing/deleted/added 혼재 */}
        <AttachmentRow
          label='관련 서류'
          multiple
          maxFiles={5}
          {...register('documents')}
          initialFiles={serverFiles}
          onManagedFilesChange={setMultiManaged}
        />
      </AttachmentGroup>

      <div className='text-sm text-muted-foreground'>
        주민등록증 상태: <strong>{singleState}</strong> | 추가 서류 상태:{' '}
        <strong>{optionalState}</strong> | 관련 서류:{' '}
        <strong>
          {multiManaged.filter(f => f.state === 'existing').length}유지 /{' '}
          {multiManaged.filter(f => f.state === 'deleted').length}삭제 /{' '}
          {multiManaged.filter(f => f.state === 'added').length}추가
        </strong>
      </div>

      <Button type='submit'>수정 제출</Button>
    </form>
  )
}

export const WithReactHookFormEdit: Story = {
  render: EditRHFRender,
  args: {
    label: '첨부서류 수정',
  },
  parameters: {
    docs: {
      description: {
        story: [
          '수정 화면에서 서버 기존 파일과 신규 파일을 함께 관리하는 시나리오입니다.',
          '',
          '- `initialFile` / `initialFiles`: 서버 파일로 초기화',
          '- `onManagedFileChange`: 단일 파일 상태 콜백 (`existing` → `deleted` / `replace` / `added`)',
          '- `onManagedFilesChange`: 복수 파일 상태 콜백 (`ManagedFile[]` 전체)',
          '',
          '제출 시 `deleted` → 삭제 API, `replace`·`added` → 업로드 API로 분기합니다.',
        ].join('\n'),
      },
    },
  },
}
