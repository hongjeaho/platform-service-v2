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
