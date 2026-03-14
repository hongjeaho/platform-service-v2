import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Card } from './Card'

describe('Card', () => {
  describe('렌더링', () => {
    it('제목을 렌더링합니다', () => {
      render(
        <Card title='카드 제목'>
          <p>본문</p>
        </Card>,
      )
      expect(screen.getByRole('heading', { level: 3, name: '카드 제목' })).toBeInTheDocument()
    })

    it('본문 children을 렌더링합니다', () => {
      render(
        <Card title='제목'>
          <p>본문 내용</p>
        </Card>,
      )
      expect(screen.getByText('본문 내용')).toBeInTheDocument()
    })

    it('subtitle이 있으면 부제를 렌더링합니다', () => {
      render(
        <Card title='제목' subtitle='부제목 텍스트'>
          <p>본문</p>
        </Card>,
      )
      expect(screen.getByText('부제목 텍스트')).toBeInTheDocument()
    })

    it('onToggle이 없으면 토글 버튼을 렌더링하지 않습니다', () => {
      render(
        <Card title='제목' expandableContent={<div>펼침 내용</div>}>
          <p>본문</p>
        </Card>,
      )
      expect(screen.queryByRole('button', { name: /show details/i })).not.toBeInTheDocument()
    })

    it('onToggle이 있으면 토글 버튼을 렌더링합니다', () => {
      render(
        <Card title='제목' onToggle={() => {}}>
          <p>본문</p>
        </Card>,
      )
      expect(screen.getByRole('button', { name: 'Show details' })).toBeInTheDocument()
    })

    it('isExpanded가 true일 때 토글 버튼 라벨이 "Show less"입니다', () => {
      render(
        <Card title='제목' isExpanded onToggle={() => {}}>
          <p>본문</p>
        </Card>,
      )
      expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument()
    })

    it('isExpanded가 true이고 expandableContent가 있으면 펼침 영역을 렌더링합니다', () => {
      render(
        <Card
          title='제목'
          isExpanded
          expandableContent={<div data-testid='expandable'>펼침 내용</div>}
        >
          <p>본문</p>
        </Card>,
      )
      expect(screen.getByTestId('expandable')).toBeInTheDocument()
      expect(screen.getByText('펼침 내용')).toBeInTheDocument()
    })

    it('isExpanded가 false이면 expandableContent를 렌더링하지 않습니다', () => {
      render(
        <Card
          title='제목'
          isExpanded={false}
          expandableContent={<div data-testid='expandable'>펼침 내용</div>}
        >
          <p>본문</p>
        </Card>,
      )
      expect(screen.queryByTestId('expandable')).not.toBeInTheDocument()
    })

    it('토글 버튼에 aria-expanded를 반영합니다', () => {
      const { rerender } = render(
        <Card title='제목' isExpanded={false} onToggle={() => {}}>
          <p>본문</p>
        </Card>,
      )
      expect(screen.getByRole('button', { name: 'Show details' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )

      rerender(
        <Card title='제목' isExpanded onToggle={() => {}}>
          <p>본문</p>
        </Card>,
      )
      expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })
  })

  describe('인터랙션', () => {
    it('토글 버튼 클릭 시 onToggle을 호출합니다', () => {
      const onToggle = vi.fn()
      render(
        <Card title='제목' onToggle={onToggle}>
          <p>본문</p>
        </Card>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Show details' }))
      expect(onToggle).toHaveBeenCalledTimes(1)
    })
  })
})
