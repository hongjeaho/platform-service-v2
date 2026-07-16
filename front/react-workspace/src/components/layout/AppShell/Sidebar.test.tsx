import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'

import { Sidebar } from './Sidebar'

const sections = [
  { items: [{ label: '대시보드', to: '/' }] },
  {
    label: '문서',
    items: [
      { label: '전체 문서', to: '/cases' },
      { label: '신청접수', to: '/cases/new' },
    ],
  },
]

describe('Sidebar', () => {
  it('현재 라우트에 해당하는 nav 항목에 aria-current를 표시합니다', () => {
    render(
      <MemoryRouter initialEntries={['/cases']}>
        <Sidebar brand={{ label: 'React Workspace' }} sections={sections} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: '전체 문서' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '대시보드' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: '신청접수' })).not.toHaveAttribute('aria-current')
  })

  it('nav 항목 클릭 시 해당 라우트로 이동합니다', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/cases']}>
        <Sidebar brand={{ label: 'React Workspace' }} sections={sections} />
        <Routes>
          <Route path='/cases' element={<div>사건 목록 화면</div>} />
          <Route path='/cases/new' element={<div>신청접수 화면</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('사건 목록 화면')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '신청접수' }))

    expect(screen.getByText('신청접수 화면')).toBeInTheDocument()
    expect(screen.queryByText('사건 목록 화면')).not.toBeInTheDocument()
  })
})
