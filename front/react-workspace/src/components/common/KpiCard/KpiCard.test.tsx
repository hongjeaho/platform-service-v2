import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { KpiCard } from './KpiCard'

describe('KpiCard', () => {
  it('trend.direction이 up이면 상승 톤 배지를 표시합니다', () => {
    render(<KpiCard label='전체 신청' value='128건' trend={{ direction: 'up', label: '12%' }} />)

    const badge = screen.getByText('▲ 12%')
    expect(badge).toHaveAttribute('data-trend', 'up')
  })

  it('trend.direction이 down이면 하락 톤 배지를 표시합니다', () => {
    render(<KpiCard label='이번달 신규' value='31건' trend={{ direction: 'down', label: '3%' }} />)

    const badge = screen.getByText('▼ 3%')
    expect(badge).toHaveAttribute('data-trend', 'down')
  })

  it('trend가 없으면 배지를 표시하지 않습니다', () => {
    render(<KpiCard label='완료' value='96건' />)

    expect(screen.queryByText(/▲|▼/)).not.toBeInTheDocument()
  })
})
