import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { ApplicationListItem } from '@/gen/model/application-list.types'

import RejectDetailModal from './RejectDetailModal'

const mockItem: ApplicationListItem = {
  seqNo: 4150,
  judgSeq: 6075759,
  recepDt: '2025-12-12',
  charge: '이미경',
  caseNo: '25수용0095',
  implementer: '청량리제8구역주택재개발정비사업조합',
  caseTitle: '청량리제8구역 주택재개발정비사업(2차)',
  address: null,
  ltisStatCd: '10',
  ltisStatNm: '접수',
  stateCd: '70',
  stateNm: '열람공고반려',
  rejectionCnt: 3,
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
