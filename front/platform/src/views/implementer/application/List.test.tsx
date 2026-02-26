import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import ApplicationList from './List'

function renderList() {
  return render(
    <MemoryRouter>
      <ApplicationList />
    </MemoryRouter>,
  )
}

describe('ApplicationList', () => {
  it('목록 페이지가 렌더된다', () => {
    renderList()
    expect(screen.getByText('LTIS입력정보확인')).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'LTIS입력정보 검색' })).toBeInTheDocument()
    expect(screen.getByText('LTIS입력정보 목록')).toBeInTheDocument()
  })

  it('주의사항 문구가 노출된다', () => {
    renderList()
    expect(screen.getByText(/도움말 아이콘 위에 커서를 올리면/)).toBeInTheDocument()
  })

  it('검색 버튼이 있다', () => {
    renderList()
    expect(screen.getByRole('button', { name: '검색 실행' })).toBeInTheDocument()
  })

  it('테이블에 목록 데이터가 표시된다', () => {
    renderList()
    expect(screen.getByText('26수용0005')).toBeInTheDocument()
    expect(screen.getByText('방배동 1344-5 - 1489 도로개설공사')).toBeInTheDocument()
  })

  it('반려횟수 클릭 시 반려 상세 모달이 열린다', async () => {
    const user = userEvent.setup()
    renderList()
    const rejectDetailButton = screen.getByRole('button', { name: /반려 3회 상세보기/ })
    await user.click(rejectDetailButton)
    expect(screen.getByRole('dialog', { name: '반려 상세' })).toBeInTheDocument()
    expect(screen.getByText('반려 상세')).toBeInTheDocument()
  })
})
