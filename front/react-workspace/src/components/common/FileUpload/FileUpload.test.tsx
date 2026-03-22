import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FileUpload } from './FileUpload'

function createFile(name: string, size = 1024, type = 'text/plain'): File {
  return new File(['x'.repeat(size)], name, { type })
}

describe('FileUpload (단일 파일)', () => {
  describe('렌더링', () => {
    it('선택 전: "파일 선택" 버튼과 안내 텍스트가 표시됩니다', () => {
      render(<FileUpload />)
      expect(screen.getByText('파일 선택')).toBeInTheDocument()
      expect(screen.getByText(/파일을 선택하세요/)).toBeInTheDocument()
    })

    it('label이 있으면 라벨을 렌더링합니다', () => {
      render(<FileUpload label='첨부파일' />)
      expect(screen.getByText('첨부파일')).toBeInTheDocument()
    })

    it('required가 있으면 필수 표시를 렌더링합니다', () => {
      render(<FileUpload label='첨부파일' required />)
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('error가 있으면 role="alert"로 에러 메시지를 표시합니다', () => {
      render(<FileUpload error='파일을 선택해 주세요.' />)
      expect(screen.getByRole('alert')).toHaveTextContent('파일을 선택해 주세요.')
    })

    it('accept가 있으면 허용 형식 안내를 표시합니다', () => {
      render(<FileUpload accept='image/*' />)
      expect(screen.getByText(/허용 형식/)).toBeInTheDocument()
    })
  })

  describe('파일 선택 후 UI 교체', () => {
    it('파일 선택 시 "파일 선택" 버튼이 사라지고 파일명이 표시됩니다', async () => {
      render(<FileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('document.pdf'))

      expect(screen.queryByText('파일 선택')).not.toBeInTheDocument()
      expect(screen.getByText('document.pdf')).toBeInTheDocument()
    })

    it('파일 선택 후 파일 크기가 표시됩니다', async () => {
      render(<FileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.pdf', 1536))
      expect(screen.getByText('1.5 KB')).toBeInTheDocument()
    })

    it('다른 파일로 교체하면 이전 파일명이 사라집니다', async () => {
      render(<FileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('first.pdf'))
      await userEvent.upload(input, createFile('second.pdf'))

      expect(screen.queryByText('first.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('second.pdf')).toBeInTheDocument()
    })
  })

  describe('파일 삭제', () => {
    it('삭제 버튼 클릭 시 파일 카드가 사라지고 초기 UI로 돌아옵니다', async () => {
      render(<FileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'test.pdf 삭제' }))

      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('파일 선택')).toBeInTheDocument()
    })

    it('삭제 시 onFilesChange가 빈 배열로 호출됩니다', async () => {
      const handleFilesChange = vi.fn()
      render(<FileUpload onFilesChange={handleFilesChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.pdf'))
      handleFilesChange.mockClear()
      await userEvent.click(screen.getByRole('button', { name: 'test.pdf 삭제' }))
      expect(handleFilesChange).toHaveBeenCalledWith([])
    })

    it('삭제 버튼 클릭이 부모 클릭 이벤트를 막습니다 (stopPropagation)', async () => {
      const handleZoneClick = vi.fn()
      render(
        <div onClick={handleZoneClick}>
          <FileUpload />
        </div>,
      )
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.pdf'))
      handleZoneClick.mockClear()
      await userEvent.click(screen.getByRole('button', { name: 'test.pdf 삭제' }))
      // 파일 삭제 버튼 클릭이 dropzone 클릭으로 버블링되지 않아야 함
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
      expect(handleZoneClick).not.toHaveBeenCalled()
    })
  })

  describe('드래그앤드롭', () => {
    it('드롭 시 파일이 선택됩니다', () => {
      render(<FileUpload />)
      const dropzone = screen.getByRole('button', { name: /파일 선택/ })
      fireEvent.drop(dropzone, { dataTransfer: { files: [createFile('dropped.pdf')] } })
      expect(screen.getByText('dropped.pdf')).toBeInTheDocument()
    })

    it('disabled 시 드롭이 무시됩니다', () => {
      const handleFilesChange = vi.fn()
      render(<FileUpload disabled onFilesChange={handleFilesChange} />)
      const dropzone = screen.getByRole('button', { name: /파일 선택/ })
      fireEvent.drop(dropzone, { dataTransfer: { files: [createFile('ignored.pdf')] } })
      expect(handleFilesChange).not.toHaveBeenCalled()
    })
  })

  describe('콜백', () => {
    it('파일 선택 시 onFilesChange가 파일 배열로 호출됩니다', async () => {
      const handleFilesChange = vi.fn()
      render(<FileUpload onFilesChange={handleFilesChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.txt'))
      expect(handleFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({ name: 'test.txt' }),
      ])
    })

    it('파일 선택 시 onChange(네이티브)가 호출됩니다', async () => {
      const handleChange = vi.fn()
      render(<FileUpload onChange={handleChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.txt'))
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('접근성', () => {
    it('드롭존은 role="button"을 가집니다', () => {
      render(<FileUpload />)
      expect(screen.getByRole('button', { name: /파일 선택/ })).toBeInTheDocument()
    })

    it('파일 선택 후 드롭존 aria-label이 파일명을 포함합니다', async () => {
      render(<FileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('my-doc.pdf'))
      expect(screen.getByRole('button', { name: /선택된 파일:.*my-doc\.pdf/ })).toBeInTheDocument()
    })

    it('aria-invalid를 전달할 수 있습니다', () => {
      render(<FileUpload aria-invalid />)
      const input = document.querySelector('input[type="file"]')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('error가 있으면 role="alert"가 렌더링됩니다', () => {
      render(<FileUpload error='에러' />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe('상태', () => {
    it('disabled 시 aria-disabled가 설정됩니다', () => {
      render(<FileUpload disabled />)
      expect(screen.getByRole('button', { name: /파일 선택/ })).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    })
  })

  describe('폼 속성', () => {
    it('name을 file input에 전달합니다', () => {
      render(<FileUpload name='attachment' />)
      expect(document.querySelector('input[type="file"]')).toHaveAttribute('name', 'attachment')
    })

    it('accept를 file input에 전달합니다', () => {
      render(<FileUpload accept='image/*' />)
      expect(document.querySelector('input[type="file"]')).toHaveAttribute('accept', 'image/*')
    })

    it('id를 전달하면 input에 해당 id가 설정됩니다', () => {
      render(<FileUpload id='my-file' label='파일' />)
      expect(document.querySelector('input[type="file"]')).toHaveAttribute('id', 'my-file')
    })
  })
})
