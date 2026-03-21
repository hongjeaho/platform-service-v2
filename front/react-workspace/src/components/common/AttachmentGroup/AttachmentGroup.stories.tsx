import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { Button } from '../Button'
import { AttachmentGroup } from './AttachmentGroup'
import { AttachmentRow } from './AttachmentRow'

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
