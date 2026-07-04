import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Topbar } from './Topbar'

describe('Topbar', () => {
  it('아이콘 전용 버튼(검색, 알림)에 aria-label이 있습니다', () => {
    render(<Topbar breadcrumb='사건관리 › 전체 목록' />)

    expect(screen.getByRole('button', { name: '검색' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '알림' })).toBeInTheDocument()
  })
})
