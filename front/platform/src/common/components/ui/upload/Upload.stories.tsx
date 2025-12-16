import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

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
 * 라벨이 없는 Upload
 */
export const WithoutLabel: Story = {
  args: {
    placeholder: '파일 선택 또는 드래그앤드롭',
    name: 'upload-no-label',
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
 * 파일 타입 제한 (이미지만)
 */
export const ImageOnly: Story = {
  args: {
    placeholder: '이미지 파일을 선택해주세요',
    label: '이미지 업로드',
    accept: 'image/*',
    name: 'upload-image',
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
 * Compact - 단일 파일 (PDF/HWP)
 */
export const CompactSingle: Story = {
  args: {
    label: '적정성 검토',
    variant: 'compact',
    accept: '.pdf,.hwp',
    maxSize: 10 * MB,
    required: true,
    name: 'compact-single',
  },
}

/**
 * Compact - 단일 파일 (PDF만)
 */
export const CompactSinglePDF: Story = {
  args: {
    label: '신청 문서',
    variant: 'compact',
    accept: '.pdf',
    maxSize: 10 * MB,
    required: true,
    name: 'compact-single-pdf',
  },
}

/**
 * Compact - 단일 파일 (대화형)
 */
export const CompactSingleInteractive: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | null>(null)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <Upload {...args} value={file} onChange={setFile} />
        {file && (
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            <p>선택된 파일: {file.name}</p>
            <p>파일 크기: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>
    )
  },
  args: {
    label: '파일 업로드',
    variant: 'compact',
    accept: '.pdf,.hwp',
    maxSize: 10 * MB,
    name: 'compact-single-interactive',
  },
}

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

/**
 * Compact Multi - 테이블 뷰 (대화형)
 */
export const CompactMultiTableInteractive: StoryObj = {
  component: UploadMulti,
  render: (args) => {
    const [files, setFiles] = useState<File[]>([])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <UploadMulti {...args} value={files} onChange={setFiles} />
        {files.length > 0 && (
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            <p>총 {files.length}개 파일 선택됨</p>
            <p>
              전체 크기: {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)}{' '}
              MB
            </p>
          </div>
        )}
      </div>
    )
  },
  args: {
    label: '문서 목록',
    variant: 'compact',
    displayMode: 'table',
    accept: '.pdf,.hwp,.doc,.docx',
    maxSize: 10 * MB,
    maxFiles: 5,
    name: 'compact-multi-table-interactive',
  },
}

/**
 * Default Multi - 테이블 뷰
 */
export const DefaultMultiTable: StoryObj = {
  component: UploadMulti,
  args: {
    label: '파일 목록 (테이블)',
    variant: 'default',
    displayMode: 'table',
    accept: '.pdf,.hwp',
    maxSize: 5 * MB,
    maxFiles: 3,
    name: 'default-multi-table',
  },
}

// ============================================================
// Real-world Use Case: 한 화면에 여러 업로드 필드
// ============================================================

/**
 * 실제 사용 예시 - 여러 첨부 파일 업로드
 */
export const RealWorldExample: StoryObj = {
  render: () => {
    const [adequacyFile, setAdequacyFile] = useState<File | null>(null)
    const [applicationFile, setApplicationFile] = useState<File | null>(null)
    const [adjudicationFiles, setAdjudicationFiles] = useState<File[]>([])

    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
          첨부 파일 업로드
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. 적정성 검토 (단일, PDF/HWP만) */}
          <Upload
            label='적정성 검토'
            variant='compact'
            accept='.pdf,.hwp'
            maxSize={10 * MB}
            value={adequacyFile}
            onChange={setAdequacyFile}
            required
            name='adequacy-file'
          />

          {/* 2. 신청 문서 (단일, PDF만) */}
          <Upload
            label='신청 문서'
            variant='compact'
            accept='.pdf'
            maxSize={10 * MB}
            value={applicationFile}
            onChange={setApplicationFile}
            required
            name='application-file'
          />

          {/* 3. 재결신청 청구 (다중, 테이블 뷰) */}
          <UploadMulti
            label='재결신청 청구'
            variant='compact'
            displayMode='table'
            accept='.pdf,.hwp,.doc,.docx'
            maxSize={10 * MB}
            maxFiles={5}
            value={adjudicationFiles}
            onChange={setAdjudicationFiles}
            required
            name='adjudication-files'
          />

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
              <li>적정성 검토: {adequacyFile ? adequacyFile.name : '없음'}</li>
              <li>신청 문서: {applicationFile ? applicationFile.name : '없음'}</li>
              <li>재결신청 청구: {adjudicationFiles.length}개 파일</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
}