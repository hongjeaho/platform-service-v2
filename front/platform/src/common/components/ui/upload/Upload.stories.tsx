/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../button/Button'
import { FormUpload } from './FormUpload'
import { FormUploadMulti } from './FormUploadMulti'
import { Upload } from './Upload'
import { UploadMulti } from './UploadMulti'

const meta = {
  title: 'Components/Upload',
  component: Upload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Upload>

export default meta
type Story = StoryObj<typeof meta>

const MB = 1024 * 1024

/**
 * 기본 Upload 컴포넌트 (단일 파일)
 */
export const Default: Story = {
  args: {
    placeholder: '파일 선택 또는 드래그앤드롭',
    label: '파일 업로드',
    name: 'upload-default',
  },
}

/**
 * 필수 필드 표시
 */
export const Required: Story = {
  args: {
    placeholder: '파일 선택 또는 드래그앤드롭',
    label: '필수 파일',
    required: true,
    name: 'upload-required',
  },
}

/**
 * 파일 타입 제한 (PDF, Word)
 */
export const DocumentOnly: Story = {
  args: {
    placeholder: 'PDF 또는 Word 문서를 선택해주세요',
    label: '문서 업로드',
    accept: '.pdf,.docx,.xlsx',
    name: 'upload-document',
  },
}

/**
 * 최대 파일 크기 제한 (5MB)
 */
export const WithMaxSize: Story = {
  args: {
    placeholder: '파일을 선택해주세요 (최대 5MB)',
    label: '파일 업로드',
    maxSize: 5 * MB,
    name: 'upload-max-size',
  },
}

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    placeholder: '파일 선택 또는 드래그앤드롭',
    label: '비활성화된 파일 업로드',
    disabled: true,
    name: 'upload-disabled',
  },
}

/**
 * 에러 상태
 */
export const WithError: Story = {
  args: {
    placeholder: '파일 선택 또는 드래그앤드롭',
    label: '파일 업로드',
    error: '파일 업로드에 실패했습니다',
    name: 'upload-error',
  },
}

/**
 * 파일이 선택된 상태
 */
export const WithFile: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | null>(null)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Upload {...args} value={file} onChange={setFile} />
        {file && (
          <div>
            <p>선택된 파일: {file.name}</p>
            <p>파일 크기: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>
    )
  },
  args: {
    placeholder: '파일 선택 또는 드래그앤드롭',
    label: '파일 업로드',
    name: 'upload-with-file',
  },
}

/**
 * UploadMulti - 기본 (여러 파일)
 */
export const MultiDefault: StoryObj = {
  component: UploadMulti,
  args: {
    placeholder: '파일들을 선택하거나 드래그앤드롭',
    label: '파일 목록 업로드',
    name: 'upload-multi-default',
  },
}

/**
 * UploadMulti - 최대 파일 개수 제한
 */
export const MultiWithMaxFiles: StoryObj = {
  component: UploadMulti,
  args: {
    placeholder: '파일들을 선택하거나 드래그앤드롭 (최대 5개)',
    label: '파일 목록 업로드',
    maxFiles: 5,
    name: 'upload-multi-max-files',
  },
}

/**
 * UploadMulti - 파일 타입 제한
 */
export const MultiDocumentOnly: StoryObj = {
  component: UploadMulti,
  args: {
    placeholder: 'PDF 또는 Word 문서들을 선택해주세요',
    label: '문서 목록 업로드',
    accept: '.pdf,.docx,.xlsx',
    name: 'upload-multi-document',
  },
}

/**
 * UploadMulti - 최대 파일 크기 제한
 */
export const MultiWithMaxSize: StoryObj = {
  component: UploadMulti,
  args: {
    placeholder: '파일들을 선택해주세요 (파일당 최대 10MB)',
    label: '파일 목록 업로드',
    maxSize: 10 * MB,
    name: 'upload-multi-max-size',
  },
}

/**
 * UploadMulti - 필수 필드
 */
export const MultiRequired: StoryObj = {
  component: UploadMulti,
  args: {
    placeholder: '파일들을 선택하거나 드래그앤드롭',
    label: '필수 파일 목록',
    required: true,
    name: 'upload-multi-required',
  },
}

/**
 * UploadMulti - 비활성화
 */
export const MultiDisabled: StoryObj = {
  component: UploadMulti,
  args: {
    placeholder: '파일들을 선택하거나 드래그앤드롭',
    label: '비활성화된 파일 업로드',
    disabled: true,
    name: 'upload-multi-disabled',
  },
}

/**
 * UploadMulti - 에러
 */
export const MultiWithError: StoryObj = {
  component: UploadMulti,
  args: {
    placeholder: '파일들을 선택하거나 드래그앤드롭',
    label: '파일 목록 업로드',
    error: '파일 업로드에 실패했습니다',
    name: 'upload-multi-error',
  },
}

/**
 * UploadMulti - 파일들이 선택된 상태 (대화형)
 */
export const MultiWithFiles: StoryObj = {
  component: UploadMulti,
  render: (args) => {
    const [files, setFiles] = useState<File[]>([])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <UploadMulti {...args} value={files} onChange={setFiles} />
        {files.length > 0 && (
          <div>
            <p>선택된 파일 ({files.length}개):</p>
            <ul style={{ marginLeft: '1rem' }}>
              {files.map((file, idx) => (
                <li key={idx}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  },
  args: {
    placeholder: '파일들을 선택하거나 드래그앤드롭',
    label: '파일 목록 업로드',
    name: 'upload-multi-with-files',
  },
}

// ============================================================
// Compact Variant Stories
// ============================================================


/**
 * Compact Multi - 리스트 뷰
 */
export const CompactMultiList: StoryObj = {
  component: UploadMulti,
  args: {
    label: '첨부 파일',
    variant: 'compact',
    displayMode: 'list',
    accept: '.pdf,.hwp,.doc,.docx',
    maxSize: 10 * MB,
    maxFiles: 5,
    name: 'compact-multi-list',
  },
}

/**
 * Compact Multi - 테이블 뷰
 */
export const CompactMultiTable: StoryObj = {
  component: UploadMulti,
  args: {
    label: '재결신청 청구',
    variant: 'compact',
    displayMode: 'table',
    accept: '.pdf,.hwp,.doc,.docx',
    maxSize: 10 * MB,
    maxFiles: 5,
    required: true,
    name: 'compact-multi-table',
  },
}


// ============================================================
// FormUpload Stories (React Hook Form)
// ============================================================

/**
 * FormUpload 기본 사용 예시
 */
export const FormUploadBasic: Story = {
  render: () => {
    const { control, handleSubmit, watch } = useForm<{
      document: File | null
    }>({
      defaultValues: {
        document: null,
      },
    })

    const onSubmit = (data: { document: File | null }) => {
      alert(`업로드된 파일: ${data.document?.name || '없음'}`)
    }

    const document = watch('document')

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormUpload
          name='document'
          control={control}
          label='문서 업로드'
          placeholder='파일을 선택하거나 드래그앤드롭'
          accept='.pdf,.docx'
          maxSize={5 * MB}
        />
        <Button type='submit' variant='primary'>
          제출
        </Button>
        {document && (
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            선택된 파일: {document.name} ({(document.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </form>
    )
  },
}

/**
 * FormUpload 유효성 검증 예시
 */
export const FormUploadValidation: Story = {
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<{
      document: File | null
      certificate: File | null
    }>({
      defaultValues: {
        document: null,
        certificate: null,
      },
      mode: 'onChange',
    })

    const onSubmit = (data: { document: File | null; certificate: File | null }) => {
      alert(
        `문서: ${data.document?.name || '없음'}\n증명서: ${data.certificate?.name || '없음'}`,
      )
    }

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormUpload
          name='document'
          control={control}
          label='신청 문서'
          required
          rules={{ required: '신청 문서를 업로드해주세요' }}
          accept='.pdf'
          maxSize={10 * MB}
        />
        <FormUpload
          name='certificate'
          control={control}
          label='증명서'
          required
          rules={{ required: '증명서를 업로드해주세요' }}
          accept='.pdf,.jpg,.png'
          maxSize={5 * MB}
        />
        <Button type='submit' variant='primary'>
          제출
        </Button>
        <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
          {errors.document && <p>• {errors.document.message}</p>}
          {errors.certificate && <p>• {errors.certificate.message}</p>}
        </div>
      </form>
    )
  },
}

/**
 * FormUploadMulti 기본 사용 예시
 */
export const FormUploadMultiBasic: StoryObj = {
  render: () => {
    const { control, handleSubmit, watch } = useForm<{
      attachments: File[]
    }>({
      defaultValues: {
        attachments: [],
      },
    })

    const onSubmit = (data: { attachments: File[] }) => {
      alert(`업로드된 파일: ${data.attachments.length}개`)
    }

    const attachments = watch('attachments')

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormUploadMulti
          name='attachments'
          control={control}
          label='첨부파일'
          placeholder='파일들을 선택하거나 드래그앤드롭'
          accept='.pdf,.docx,.xlsx'
          maxSize={10 * MB}
          maxFiles={5}
        />
        <Button type='submit' variant='primary'>
          제출
        </Button>
        {attachments.length > 0 && (
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            <p>선택된 파일 ({attachments.length}개):</p>
            <ul style={{ marginLeft: '1rem' }}>
              {attachments.map((file, idx) => (
                <li key={idx}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    )
  },
}

/**
 * FormUploadMulti 유효성 검증 예시
 */
export const FormUploadMultiValidation: StoryObj = {
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<{
      attachments: File[]
    }>({
      defaultValues: {
        attachments: [],
      },
      mode: 'onChange',
    })

    const onSubmit = (data: { attachments: File[] }) => {
      alert(`업로드된 파일: ${data.attachments.length}개`)
    }

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormUploadMulti
          name='attachments'
          control={control}
          label='첨부파일'
          required
          rules={{
            required: '최소 1개 이상의 파일을 업로드해주세요',
            validate: (files: File[]) => {
              if (files.length === 0) return '최소 1개 이상의 파일을 업로드해주세요'
              if (files.length > 5) return '최대 5개까지만 업로드 가능합니다'
              return true
            },
          }}
          accept='.pdf,.hwp,.doc,.docx'
          maxSize={10 * MB}
          maxFiles={5}
          displayMode='table'
        />
        <Button type='submit' variant='primary'>
          제출
        </Button>
        <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
          {errors.attachments && <p>• {errors.attachments.message}</p>}
        </div>
      </form>
    )
  },
}

/**
 * 실제 사용 예제 - React Hook Form 통합
 */
export const FormRealWorldExample: StoryObj = {
  render: () => {
    const {
      control,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<{
      adequacyFile: File | null
      applicationFile: File | null
      adjudicationFiles: File[]
    }>({
      defaultValues: {
        adequacyFile: null,
        applicationFile: null,
        adjudicationFiles: [],
      },
      mode: 'onChange',
    })

    const onSubmit = (data: {
      adequacyFile: File | null
      applicationFile: File | null
      adjudicationFiles: File[]
    }) => {
      alert(
        `제출 완료!\n적정성 검토: ${data.adequacyFile?.name || '없음'}\n신청 문서: ${data.applicationFile?.name || '없음'}\n재결신청 청구: ${data.adjudicationFiles.length}개`,
      )
    }

    const values = watch()

    const allFilesUploaded =
      values.adequacyFile && values.applicationFile && values.adjudicationFiles.length > 0

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}
      >
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
          첨부 파일 업로드 (React Hook Form)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. 적정성 검토 (단일, PDF/HWP만) */}
          <FormUpload
            name='adequacyFile'
            control={control}
            label='적정성 검토'
            variant='compact'
            accept='.pdf,.hwp'
            maxSize={10 * MB}
            required
            rules={{ required: '적정성 검토 파일을 업로드해주세요' }}
          />

          {/* 2. 신청 문서 (단일, PDF만) */}
          <FormUpload
            name='applicationFile'
            control={control}
            label='신청 문서'
            variant='compact'
            accept='.pdf'
            maxSize={10 * MB}
            required
            rules={{ required: '신청 문서를 업로드해주세요' }}
          />

          {/* 3. 재결신청 청구 (다중, 테이블 뷰) */}
          <FormUploadMulti
            name='adjudicationFiles'
            control={control}
            label='재결신청 청구'
            variant='compact'
            displayMode='table'
            accept='.pdf,.hwp,.doc,.docx'
            maxSize={10 * MB}
            maxFiles={5}
            required
            rules={{ required: '최소 1개 이상의 파일을 업로드해주세요' }}
          />

          <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
            {errors.adequacyFile && <p>• {errors.adequacyFile.message}</p>}
            {errors.applicationFile && <p>• {errors.applicationFile.message}</p>}
            {errors.adjudicationFiles && <p>• {errors.adjudicationFiles.message}</p>}
          </div>

          <Button
            type='submit'
            variant={allFilesUploaded ? 'primary' : 'secondary'}
            disabled={!allFilesUploaded}
          >
            제출하기
          </Button>

          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>선택된 파일 요약:</p>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>적정성 검토: {values.adequacyFile ? values.adequacyFile.name : '없음'}</li>
              <li>신청 문서: {values.applicationFile ? values.applicationFile.name : '없음'}</li>
              <li>재결신청 청구: {values.adjudicationFiles.length}개 파일</li>
            </ul>
          </div>
        </div>
      </form>
    )
  },
}