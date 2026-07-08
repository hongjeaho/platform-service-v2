import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MultiFileUpload } from './MultiFileUpload'
import type { ServerFileInfo } from './MultiFileUpload.type'

function createFile(name: string, size = 1024, type = 'text/plain'): File {
  return new File(['x'.repeat(size)], name, { type })
}

const fileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement

describe('MultiFileUpload (복수 파일)', () => {
  describe('렌더링', () => {
    it('드롭존 헤더가 렌더링됩니다', () => {
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
  })

  describe('드롭존 지속성', () => {
    it('파일을 추가해도 드롭존 헤더가 유지됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })

    it('여러 파일을 추가한 후에도 드롭존 헤더가 유지됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      await userEvent.upload(fileInput(), createFile('b.pdf'))
      await userEvent.upload(fileInput(), createFile('c.pdf'))
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })
  })

  describe('파일 누적', () => {
    it('파일을 선택하면 목록에 표시됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('doc.pdf'))
      expect(screen.getByText('doc.pdf')).toBeInTheDocument()
    })

    it('파일을 여러 번 추가하면 누적됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      await userEvent.upload(fileInput(), createFile('b.docx'))
      expect(screen.getByText('a.pdf')).toBeInTheDocument()
      expect(screen.getByText('b.docx')).toBeInTheDocument()
    })

    it('파일 추가 후 "N개 파일 선택됨" 요약이 표시됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      await userEvent.upload(fileInput(), createFile('b.pdf'))
      expect(screen.getByText('2개 파일 선택됨')).toBeInTheDocument()
    })
  })

  describe('파일 삭제', () => {
    it('삭제 버튼 클릭 시 해당 파일이 제거됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      await userEvent.upload(fileInput(), createFile('b.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'a.pdf 삭제' }))
      expect(screen.queryByText('a.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('b.pdf')).toBeInTheDocument()
    })

    it('모든 파일 삭제 후 목록이 사라집니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('only.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'only.pdf 삭제' }))
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('파일 삭제 후에도 드롭존 헤더는 유지됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('only.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'only.pdf 삭제' }))
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })

    it('삭제 버튼 클릭이 파일 선택창을 열지 않습니다(헤더 onClick으로 전파되지 않음)', async () => {
      const handleChange = vi.fn()
      render(<MultiFileUpload onChange={handleChange} />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      handleChange.mockClear()
      await userEvent.click(screen.getByRole('button', { name: 'a.pdf 삭제' }))
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('헤더 접힘/펼침', () => {
    it('파일이 없으면 헤더에 큰 안내 문구가 표시됩니다', () => {
      render(<MultiFileUpload />)
      expect(screen.getByText('클릭하거나 파일을 끌어다 놓으세요')).toBeInTheDocument()
    })

    it('파일이 1개 이상 있으면 헤더가 "파일 추가" 슬림 라벨로 바뀝니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      expect(screen.queryByText('클릭하거나 파일을 끌어다 놓으세요')).not.toBeInTheDocument()
      expect(screen.getByText('파일 추가')).toBeInTheDocument()
    })

    it('파일 목록은 헤더(role="button") 요소 밖의 형제 요소로 렌더링됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      const header = screen.getByRole('button', { name: /파일 업로드 영역/ })
      const list = screen.getByRole('list')
      expect(header.contains(list)).toBe(false)
      expect(list.contains(header)).toBe(false)
    })
  })

  describe('maxFiles 제한', () => {
    it('maxFiles 도달 시 헤더가 비활성화됩니다', async () => {
      render(<MultiFileUpload maxFiles={1} />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      const header = screen.getByRole('button', { name: /파일 업로드 영역/ })
      expect(header).toHaveAttribute('aria-disabled', 'true')
    })

    it('maxFiles 도달 시 제한 안내 텍스트가 표시됩니다', async () => {
      render(<MultiFileUpload maxFiles={2} />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      await userEvent.upload(fileInput(), createFile('b.pdf'))
      expect(screen.getByText(/모두 선택했습니다/)).toBeInTheDocument()
    })

    it('maxFiles 초과 시 추가되지 않습니다', async () => {
      const handleManagedFilesChange = vi.fn()
      render(<MultiFileUpload maxFiles={1} onManagedFilesChange={handleManagedFilesChange} />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      handleManagedFilesChange.mockClear()
      const header = screen.getByRole('button', { name: /파일 업로드 영역/ })
      fireEvent.drop(header.parentElement as HTMLElement, {
        dataTransfer: { files: [createFile('b.pdf')] },
      })
      expect(handleManagedFilesChange).not.toHaveBeenCalled()
    })
  })

  describe('드래그앤드롭', () => {
    it('헤더에 드롭 시 파일이 목록에 추가됩니다', () => {
      render(<MultiFileUpload />)
      const box = screen.getByRole('button', { name: /파일 업로드 영역/ })
        .parentElement as HTMLElement
      fireEvent.drop(box, { dataTransfer: { files: [createFile('dropped.pdf')] } })
      expect(screen.getByText('dropped.pdf')).toBeInTheDocument()
    })

    it('파일 목록 영역에 드롭해도 박스 전체가 드롭 대상이라 파일이 추가됩니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('existing.pdf'))
      const box = screen.getByRole('list').parentElement?.parentElement as HTMLElement
      fireEvent.drop(box, { dataTransfer: { files: [createFile('over-list.pdf')] } })
      expect(screen.getByText('over-list.pdf')).toBeInTheDocument()
    })

    it('dragover 시 드래그 스타일이 적용됩니다', () => {
      render(<MultiFileUpload />)
      const box = screen.getByRole('button', { name: /파일 업로드 영역/ })
        .parentElement as HTMLElement
      fireEvent.dragOver(box)
      expect(box.className).toMatch(/dragging/)
    })

    it('dragleave 시 드래그 스타일이 해제됩니다', () => {
      render(<MultiFileUpload />)
      const box = screen.getByRole('button', { name: /파일 업로드 영역/ })
        .parentElement as HTMLElement
      fireEvent.dragOver(box)
      fireEvent.dragLeave(box)
      expect(box.className).not.toMatch(/dragging/)
    })

    it('disabled 시 드롭이 무시됩니다', () => {
      const handleFilesChange = vi.fn()
      render(<MultiFileUpload disabled onFilesChange={handleFilesChange} />)
      const box = screen.getByRole('button', { name: /파일 업로드 영역/ })
        .parentElement as HTMLElement
      fireEvent.drop(box, { dataTransfer: { files: [createFile('ignored.pdf')] } })
      expect(handleFilesChange).not.toHaveBeenCalled()
    })
  })

  describe('콜백', () => {
    it('파일 선택 시 onManagedFilesChange가 호출됩니다', async () => {
      const handleManagedFilesChange = vi.fn()
      render(<MultiFileUpload onManagedFilesChange={handleManagedFilesChange} />)
      await userEvent.upload(fileInput(), createFile('test.txt'))
      expect(handleManagedFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({ state: 'added', name: 'test.txt' }),
      ])
    })

    it('파일 선택 시 onFilesChange가 새로 추가된 raw File만 전달합니다', async () => {
      const handleFilesChange = vi.fn()
      render(<MultiFileUpload onFilesChange={handleFilesChange} />)
      await userEvent.upload(fileInput(), createFile('test.txt'))
      expect(handleFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({ name: 'test.txt' }),
      ])
    })

    it('파일 선택 시 onChange(네이티브)가 호출됩니다', async () => {
      const handleChange = vi.fn()
      render(<MultiFileUpload onChange={handleChange} />)
      await userEvent.upload(fileInput(), createFile('test.txt'))
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('접근성', () => {
    it('헤더는 role="button"을 가집니다', () => {
      render(<MultiFileUpload />)
      expect(screen.getByRole('button', { name: /파일 업로드 영역/ })).toBeInTheDocument()
    })

    it('파일 목록은 role="list"와 aria-label을 가집니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('a.pdf'))
      expect(screen.getByRole('list', { name: '선택된 파일 목록' })).toBeInTheDocument()
    })

    it('삭제 버튼에 aria-label이 있습니다', async () => {
      render(<MultiFileUpload />)
      await userEvent.upload(fileInput(), createFile('sample.pdf'))
      expect(screen.getByRole('button', { name: 'sample.pdf 삭제' })).toBeInTheDocument()
    })

    it('aria-invalid를 전달할 수 있습니다', () => {
      render(<MultiFileUpload aria-invalid />)
      expect(fileInput()).toHaveAttribute('aria-invalid', 'true')
    })

    it('Tab으로 헤더에 포커스하고 Enter로 파일 선택창을 열 수 있습니다(클릭 위임)', async () => {
      render(<MultiFileUpload />)
      const header = screen.getByRole('button', { name: /파일 업로드 영역/ })
      const clickSpy = vi.spyOn(fileInput(), 'click')
      header.focus()
      expect(header).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      expect(clickSpy).toHaveBeenCalled()
    })
  })

  describe('폼 속성', () => {
    it('name을 file input에 전달합니다', () => {
      render(<MultiFileUpload name='attachments' />)
      expect(fileInput()).toHaveAttribute('name', 'attachments')
    })

    it('multiple 속성이 항상 설정됩니다', () => {
      render(<MultiFileUpload />)
      expect(fileInput()).toHaveAttribute('multiple')
    })
  })

  describe('수정 시나리오 (initialFiles)', () => {
    const existingFiles: ServerFileInfo[] = [
      { seqNo: 1, name: 'old.pdf', size: 2048 },
      { seqNo: 2, name: 'old2.pdf', size: 4096 },
    ]

    it('initialFiles로 목록이 미리 채워집니다', () => {
      render(<MultiFileUpload initialFiles={existingFiles} />)
      expect(screen.getByText('old.pdf')).toBeInTheDocument()
      expect(screen.getByText('old2.pdf')).toBeInTheDocument()
    })

    it('기존(existing) 파일을 삭제하면 목록에서 사라지지만 deleted 상태로 콜백에 유지됩니다', async () => {
      const handleManagedFilesChange = vi.fn()
      render(
        <MultiFileUpload
          initialFiles={existingFiles}
          onManagedFilesChange={handleManagedFilesChange}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'old.pdf 삭제' }))
      expect(screen.queryByText('old.pdf')).not.toBeInTheDocument()
      expect(handleManagedFilesChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ state: 'deleted', name: 'old.pdf' })]),
      )
    })
  })
})
