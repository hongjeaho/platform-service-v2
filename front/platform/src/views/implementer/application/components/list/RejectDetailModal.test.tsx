import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { ApplicationItem } from './ApplicationTable'
import RejectDetailModal from './RejectDetailModal'

const mockItem: ApplicationItem = {
  id: 5762,
  seq: 3,
  receptionDate: '2025-12-12',
  decisionOrganization: '서울특별시지방토지수용위원회',
  manager: '이미경',
  implementer: '청량리제8구역주택재개발정비사업조합',
  caseNumber: '25수용0095',
  projectName: '청량리제8구역 주택재개발정비사업(2차)',
  location: '-',
  rejectCount: 3,
  progressStatus: '열람공고반려',
  ltisStatus: '접수',
  decisionId: 5762,
}

describe('RejectDetailModal', () => {
  it('open이 false일 때 모달이 렌더되지 않는다', () => {
    render(<RejectDetailModal open={false} onClose={vi.fn()} item={null} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('open이 true이고 item이 있으면 반려 상세 내용이 표시된다', () => {
    render(<RejectDetailModal open onClose={vi.fn()} item={mockItem} />)
    expect(screen.getByRole('dialog', { name: '반려 상세' })).toBeInTheDocument()
    expect(screen.getByText('반려 상세')).toBeInTheDocument()
    expect(screen.getByText('2025-12-12')).toBeInTheDocument()
    expect(screen.getByText('이미경')).toBeInTheDocument()
  })

  it('닫기 시 onClose가 호출된다', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<RejectDetailModal open onClose={onClose} item={mockItem} />)
    const closeButton = screen.getByRole('button', { name: '닫기' })
    await user.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })
})
