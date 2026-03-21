import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MultiFileUpload } from './MultiFileUpload'

function createFile(name: string, size = 1024, type = 'text/plain'): File {
  return new File(['x'.repeat(size)], name, { type })
}

describe('MultiFileUpload (복수 파일)', () => {
  describe('렌더링', () => {
    it('드롭존이 렌더링됩니다', () => {
      render(<MultiFileUpload />)
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })

    it('초기 상태에서 파일 목록이 표시되지 않습니다', () => {
      render(<MultiFileUpload />)
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('label이 있으면 라벨을 렌더링합니다', () => {
      render(<MultiFileUpload label='첨부파일' />)
      expect(screen.getByText('첨부파일')).toBeInTheDocument()
    })

    it('required가 있으면 필수 표시를 렌더링합니다', () => {
      render(<MultiFileUpload label='첨부파일' required />)
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('error가 있으면 role="alert"로 에러 메시지를 표시합니다', () => {
      render(<MultiFileUpload error='파일을 선택해 주세요.' />)
      expect(screen.getByRole('alert')).toHaveTextContent('파일을 선택해 주세요.')
    })

    it('maxFiles가 있으면 힌트 텍스트에 표시됩니다', () => {
      render(<MultiFileUpload maxFiles={3} />)
      expect(screen.getByText(/최대 3개/)).toBeInTheDocument()
    })
  })

  describe('드롭존 지속성', () => {
    it('파일을 추가해도 드롭존이 유지됩니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })

    it('여러 파일을 추가한 후에도 드롭존이 유지됩니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      await userEvent.upload(input, createFile('b.pdf'))
      await userEvent.upload(input, createFile('c.pdf'))
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })
  })

  describe('파일 누적', () => {
    it('파일을 선택하면 목록에 표시됩니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('doc.pdf'))
      expect(screen.getByText('doc.pdf')).toBeInTheDocument()
    })

    it('파일을 여러 번 추가하면 누적됩니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      await userEvent.upload(input, createFile('b.docx'))
      expect(screen.getByText('a.pdf')).toBeInTheDocument()
      expect(screen.getByText('b.docx')).toBeInTheDocument()
    })

    it('파일 추가 후 "N개 파일 선택됨" 요약이 표시됩니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      await userEvent.upload(input, createFile('b.pdf'))
      expect(screen.getByText('2개 파일 선택됨')).toBeInTheDocument()
    })
  })

  describe('파일 삭제', () => {
    it('삭제 버튼 클릭 시 해당 파일이 제거됩니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      await userEvent.upload(input, createFile('b.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'a.pdf 삭제' }))
      expect(screen.queryByText('a.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('b.pdf')).toBeInTheDocument()
    })

    it('모든 파일 삭제 후 목록이 사라집니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('only.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'only.pdf 삭제' }))
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('파일 삭제 후 드롭존은 유지됩니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('only.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'only.pdf 삭제' }))
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })
  })

  describe('maxFiles 제한', () => {
    it('maxFiles 도달 시 드롭존이 비활성화됩니다', async () => {
      render(<MultiFileUpload maxFiles={1} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      const dropzone = screen.getByRole('button', { name: /파일 업로드 영역/ })
      expect(dropzone).toHaveAttribute('aria-disabled', 'true')
    })

    it('maxFiles 도달 시 제한 안내 텍스트가 표시됩니다', async () => {
      render(<MultiFileUpload maxFiles={2} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      await userEvent.upload(input, createFile('b.pdf'))
      expect(screen.getByText(/모두 선택했습니다/)).toBeInTheDocument()
    })

    it('maxFiles 초과 시 추가되지 않습니다', async () => {
      const handleFilesChange = vi.fn()
      render(<MultiFileUpload maxFiles={1} onFilesChange={handleFilesChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      handleFilesChange.mockClear()
      // 드롭으로 초과 시도
      const dropzone = screen.getByRole('button', { name: /파일 업로드 영역/ })
      fireEvent.drop(dropzone, { dataTransfer: { files: [createFile('b.pdf')] } })
      expect(handleFilesChange).not.toHaveBeenCalled()
    })
  })

  describe('드래그앤드롭', () => {
    it('드롭 시 파일이 목록에 추가됩니다', () => {
      render(<MultiFileUpload />)
      const dropzone = screen.getByRole('button', { name: /파일 업로드 영역/ })
      fireEvent.drop(dropzone, { dataTransfer: { files: [createFile('dropped.pdf')] } })
      expect(screen.getByText('dropped.pdf')).toBeInTheDocument()
    })

    it('dragover 시 드래그 스타일이 적용됩니다', () => {
      render(<MultiFileUpload />)
      const dropzone = screen.getByRole('button', { name: /파일 업로드 영역/ })
      fireEvent.dragOver(dropzone)
      expect(dropzone.className).toMatch(/dragging/)
    })

    it('dragleave 시 드래그 스타일이 해제됩니다', () => {
      render(<MultiFileUpload />)
      const dropzone = screen.getByRole('button', { name: /파일 업로드 영역/ })
      fireEvent.dragOver(dropzone)
      fireEvent.dragLeave(dropzone)
      expect(dropzone.className).not.toMatch(/dragging/)
    })

    it('disabled 시 드롭이 무시됩니다', () => {
      const handleFilesChange = vi.fn()
      render(<MultiFileUpload disabled onFilesChange={handleFilesChange} />)
      const dropzone = screen.getByRole('button', { name: /파일 업로드 영역/ })
      fireEvent.drop(dropzone, { dataTransfer: { files: [createFile('ignored.pdf')] } })
      expect(handleFilesChange).not.toHaveBeenCalled()
    })
  })

  describe('콜백', () => {
    it('파일 선택 시 onFilesChange가 호출됩니다', async () => {
      const handleFilesChange = vi.fn()
      render(<MultiFileUpload onFilesChange={handleFilesChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.txt'))
      expect(handleFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({ name: 'test.txt' }),
      ])
    })

    it('파일 선택 시 onChange(네이티브)가 호출됩니다', async () => {
      const handleChange = vi.fn()
      render(<MultiFileUpload onChange={handleChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('test.txt'))
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('접근성', () => {
    it('드롭존은 role="button"을 가집니다', () => {
      render(<MultiFileUpload />)
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })

    it('파일 목록은 role="list"와 aria-label을 가집니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('a.pdf'))
      expect(screen.getByRole('list', { name: '선택된 파일 목록' })).toBeInTheDocument()
    })

    it('삭제 버튼에 aria-label이 있습니다', async () => {
      render(<MultiFileUpload />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, createFile('sample.pdf'))
      expect(screen.getByRole('button', { name: 'sample.pdf 삭제' })).toBeInTheDocument()
    })

    it('aria-invalid를 전달할 수 있습니다', () => {
      render(<MultiFileUpload aria-invalid />)
      expect(document.querySelector('input[type="file"]')).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('폼 속성', () => {
    it('name을 file input에 전달합니다', () => {
      render(<MultiFileUpload name='attachments' />)
      expect(document.querySelector('input[type="file"]')).toHaveAttribute('name', 'attachments')
    })

    it('multiple 속성이 항상 설정됩니다', () => {
      render(<MultiFileUpload />)
      expect(document.querySelector('input[type="file"]')).toHaveAttribute('multiple')
    })
  })
})
