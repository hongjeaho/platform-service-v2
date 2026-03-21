import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AttachmentGroup } from './AttachmentGroup'
import { AttachmentRow } from './AttachmentRow'

function createFile(name: string, size = 1024, type = 'text/plain'): File {
  return new File(['x'.repeat(size)], name, { type })
}

function getFileInput(container: HTMLElement = document.body) {
  return container.querySelector('input[type="file"]') as HTMLInputElement
}

describe('AttachmentGroup', () => {
  describe('렌더링', () => {
    it('섹션 헤더 라벨을 렌더링합니다', () => {
      render(
        <AttachmentGroup label='첨부서류'>
          <AttachmentRow label='서류' />
        </AttachmentGroup>,
      )
      expect(screen.getByText('첨부서류')).toBeInTheDocument()
    })

    it('label이 없으면 헤더를 렌더링하지 않습니다', () => {
      render(
        <AttachmentGroup>
          <AttachmentRow label='서류' />
        </AttachmentGroup>,
      )
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('여러 AttachmentRow를 렌더링합니다', () => {
      render(
        <AttachmentGroup>
          <AttachmentRow label='서류A' />
          <AttachmentRow label='서류B' />
          <AttachmentRow label='서류C' />
        </AttachmentGroup>,
      )
      expect(screen.getByText('서류A')).toBeInTheDocument()
      expect(screen.getByText('서류B')).toBeInTheDocument()
      expect(screen.getByText('서류C')).toBeInTheDocument()
    })
  })

  describe('disabled 전파', () => {
    it('AttachmentGroup disabled 시 자식 Row의 버튼이 비활성화됩니다', () => {
      render(
        <AttachmentGroup disabled>
          <AttachmentRow label='서류' />
        </AttachmentGroup>,
      )
      expect(screen.getByRole('button', { name: '파일 선택' })).toBeDisabled()
    })

    it('Row 개별 disabled도 정상 동작합니다', () => {
      render(
        <AttachmentGroup>
          <AttachmentRow label='서류' disabled />
        </AttachmentGroup>,
      )
      expect(screen.getByRole('button', { name: '파일 선택' })).toBeDisabled()
    })
  })
})

describe('AttachmentRow', () => {
  describe('렌더링', () => {
    it('행 라벨을 렌더링합니다', () => {
      render(<AttachmentRow label='주민등록증' />)
      expect(screen.getByText('주민등록증')).toBeInTheDocument()
    })

    it('required가 있으면 필수 표시를 렌더링합니다', () => {
      render(<AttachmentRow label='주민등록증' required />)
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('초기 상태에서 "파일 선택" 버튼이 표시됩니다', () => {
      render(<AttachmentRow label='서류' />)
      expect(screen.getByRole('button', { name: '파일 선택' })).toBeInTheDocument()
    })

    it('multiple=true 이면 "파일 추가" 버튼이 표시됩니다', () => {
      render(<AttachmentRow label='서류' multiple />)
      expect(screen.getByRole('button', { name: '파일 추가' })).toBeInTheDocument()
    })

    it('초기 상태에서 "파일을 선택하세요" 안내 텍스트가 표시됩니다', () => {
      render(<AttachmentRow label='서류' />)
      expect(screen.getByText('파일을 선택하세요')).toBeInTheDocument()
    })

    it('error가 있으면 role="alert"로 에러 메시지를 표시합니다', () => {
      render(<AttachmentRow label='서류' error='파일을 선택해 주세요.' />)
      expect(screen.getByRole('alert')).toHaveTextContent('파일을 선택해 주세요.')
    })
  })

  describe('싱글 파일 선택', () => {
    it('파일 선택 후 파일명이 상태 영역에 표시됩니다', async () => {
      render(<AttachmentRow label='서류' />)
      await userEvent.upload(getFileInput(), createFile('document.pdf'))
      expect(screen.getByText('document.pdf')).toBeInTheDocument()
    })

    it('파일 선택 후 "교체" 버튼으로 변경됩니다', async () => {
      render(<AttachmentRow label='서류' />)
      await userEvent.upload(getFileInput(), createFile('doc.pdf'))
      expect(screen.queryByRole('button', { name: '파일 선택' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: '교체' })).toBeInTheDocument()
    })

    it('"교체" 버튼 클릭 시 새 파일로 교체됩니다', async () => {
      render(<AttachmentRow label='서류' />)
      await userEvent.upload(getFileInput(), createFile('first.pdf'))
      await userEvent.upload(getFileInput(), createFile('second.pdf'))
      expect(screen.queryByText('first.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('second.pdf')).toBeInTheDocument()
    })

    it('삭제 버튼 클릭 시 파일이 제거되고 초기 UI로 복원됩니다', async () => {
      render(<AttachmentRow label='서류' />)
      await userEvent.upload(getFileInput(), createFile('doc.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'doc.pdf 삭제' }))
      expect(screen.queryByText('doc.pdf')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: '파일 선택' })).toBeInTheDocument()
    })

    it('파일 크기가 표시됩니다', async () => {
      render(<AttachmentRow label='서류' />)
      await userEvent.upload(getFileInput(), createFile('test.pdf', 1536))
      expect(screen.getByText('1.5 KB')).toBeInTheDocument()
    })
  })

  describe('멀티 파일 선택', () => {
    it('파일을 누적 추가합니다', async () => {
      render(<AttachmentRow label='서류' multiple />)
      const input = getFileInput()
      await userEvent.upload(input, createFile('a.pdf'))
      await userEvent.upload(input, createFile('b.pdf'))
      expect(screen.getByText('2개 첨부됨')).toBeInTheDocument()
    })

    it('maxFiles 도달 시 "파일 추가" 버튼이 비활성화됩니다', async () => {
      render(<AttachmentRow label='서류' multiple maxFiles={1} />)
      await userEvent.upload(getFileInput(), createFile('a.pdf'))
      expect(screen.getByRole('button', { name: '파일 추가' })).toBeDisabled()
    })

    it('파일 목록이 기본적으로 펼쳐있습니다', async () => {
      render(<AttachmentRow label='서류' multiple />)
      await userEvent.upload(getFileInput(), createFile('a.pdf'))
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('토글 버튼 클릭 시 파일 목록이 접힙니다', async () => {
      render(<AttachmentRow label='서류' multiple />)
      await userEvent.upload(getFileInput(), createFile('a.pdf'))
      await userEvent.click(screen.getByRole('button', { name: '파일 목록 접기' }))
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('접힌 상태에서 토글 버튼 재클릭 시 펼쳐집니다', async () => {
      render(<AttachmentRow label='서류' multiple />)
      await userEvent.upload(getFileInput(), createFile('a.pdf'))
      await userEvent.click(screen.getByRole('button', { name: '파일 목록 접기' }))
      await userEvent.click(screen.getByRole('button', { name: '파일 목록 펼치기' }))
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getByText('a.pdf')).toBeInTheDocument()
    })

    it('파일 삭제가 가능합니다', async () => {
      render(<AttachmentRow label='서류' multiple />)
      const input = getFileInput()
      await userEvent.upload(input, createFile('a.pdf'))
      await userEvent.upload(input, createFile('b.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'a.pdf 삭제' }))
      expect(screen.queryByText('a.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('1개 첨부됨')).toBeInTheDocument()
    })

    it('모든 파일 삭제 시 파일 목록이 사라집니다', async () => {
      render(<AttachmentRow label='서류' multiple />)
      await userEvent.upload(getFileInput(), createFile('a.pdf'))
      await userEvent.click(screen.getByRole('button', { name: 'a.pdf 삭제' }))
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
      expect(screen.getByText('파일을 선택하세요')).toBeInTheDocument()
    })
  })

  describe('드래그앤드롭', () => {
    it('드롭 시 파일이 추가됩니다', () => {
      render(<AttachmentRow label='서류' />)
      const row = screen.getByText('서류').closest('[class]')!
      fireEvent.drop(row, { dataTransfer: { files: [createFile('dropped.pdf')] } })
      expect(screen.getByText('dropped.pdf')).toBeInTheDocument()
    })

    it('disabled 시 드롭이 무시됩니다', () => {
      const handleFilesChange = vi.fn()
      render(<AttachmentRow label='서류' disabled onFilesChange={handleFilesChange} />)
      const row = screen.getByText('서류').closest('[class]')!
      fireEvent.drop(row, { dataTransfer: { files: [createFile('ignored.pdf')] } })
      expect(handleFilesChange).not.toHaveBeenCalled()
    })
  })

  describe('콜백', () => {
    it('파일 선택 시 onFilesChange가 호출됩니다', async () => {
      const handleFilesChange = vi.fn()
      render(<AttachmentRow label='서류' onFilesChange={handleFilesChange} />)
      await userEvent.upload(getFileInput(), createFile('test.pdf'))
      expect(handleFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({ name: 'test.pdf' }),
      ])
    })

    it('파일 삭제 시 onFilesChange가 빈 배열로 호출됩니다', async () => {
      const handleFilesChange = vi.fn()
      render(<AttachmentRow label='서류' onFilesChange={handleFilesChange} />)
      await userEvent.upload(getFileInput(), createFile('test.pdf'))
      handleFilesChange.mockClear()
      await userEvent.click(screen.getByRole('button', { name: 'test.pdf 삭제' }))
      expect(handleFilesChange).toHaveBeenCalledWith([])
    })

    it('onChange(네이티브)가 호출됩니다', async () => {
      const handleChange = vi.fn()
      render(<AttachmentRow label='서류' onChange={handleChange} />)
      await userEvent.upload(getFileInput(), createFile('test.pdf'))
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('접근성', () => {
    it('label이 input과 htmlFor로 연결됩니다', () => {
      render(<AttachmentRow label='주민등록증' id='id-card' />)
      const label = screen.getByText('주민등록증')
      expect(label).toHaveAttribute('for', 'id-card')
    })

    it('error 시 role="alert"가 렌더링됩니다', () => {
      render(<AttachmentRow label='서류' error='에러 메시지' />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('aria-invalid를 전달할 수 있습니다', () => {
      render(<AttachmentRow label='서류' aria-invalid />)
      expect(getFileInput()).toHaveAttribute('aria-invalid', 'true')
    })

    it('토글 버튼에 aria-expanded가 설정됩니다', async () => {
      render(<AttachmentRow label='서류' multiple />)
      await userEvent.upload(getFileInput(), createFile('a.pdf'))
      const toggle = screen.getByRole('button', { name: '파일 목록 접기' })
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await userEvent.click(toggle)
      expect(screen.getByRole('button', { name: '파일 목록 펼치기' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })
  })

  describe('폼 속성', () => {
    it('name을 file input에 전달합니다', () => {
      render(<AttachmentRow label='서류' name='attachment' />)
      expect(getFileInput()).toHaveAttribute('name', 'attachment')
    })

    it('multiple 시 file input에 multiple 속성이 설정됩니다', () => {
      render(<AttachmentRow label='서류' multiple />)
      expect(getFileInput()).toHaveAttribute('multiple')
    })

    it('accept를 file input에 전달합니다', () => {
      render(<AttachmentRow label='서류' accept='.pdf' />)
      expect(getFileInput()).toHaveAttribute('accept', '.pdf')
    })
  })
})
