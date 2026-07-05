import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ActivityFeed } from './ActivityFeed'

describe('ActivityFeed', () => {
  describe('렌더링', () => {
    it('타이틀을 렌더링합니다', () => {
      render(<ActivityFeed title='최근 활동' items={[]} />)
      expect(screen.getByText('최근 활동')).toBeInTheDocument()
    })

    it('빈 items 목록을 렌더링합니다', () => {
      render(<ActivityFeed title='활동' items={[]} />)
      const list = screen.queryByRole('list')
      expect(list).toBeInTheDocument()
    })

    it('단일 항목을 렌더링합니다', () => {
      render(
        <ActivityFeed
          title='활동'
          items={[
            {
              id: '1',
              tone: 'success',
              text: '작업 완료',
              time: '1시간 전',
            },
          ]}
        />,
      )
      expect(screen.getByText('작업 완료')).toBeInTheDocument()
      expect(screen.getByText('1시간 전')).toBeInTheDocument()
    })

    it('여러 항목을 렌더링합니다', () => {
      render(
        <ActivityFeed
          title='활동'
          items={[
            { id: '1', tone: 'success', text: '작업 1', time: '1시간 전' },
            { id: '2', tone: 'info', text: '작업 2', time: '2시간 전' },
            { id: '3', tone: 'warning', text: '작업 3', time: '3시간 전' },
          ]}
        />,
      )
      expect(screen.getByText('작업 1')).toBeInTheDocument()
      expect(screen.getByText('작업 2')).toBeInTheDocument()
      expect(screen.getByText('작업 3')).toBeInTheDocument()
    })
  })

  describe('톤별 스타일', () => {
    it.each([
      ['success', '성공'],
      ['info', '정보'],
      ['warning', '경고'],
      ['danger', '위험'],
      ['muted', '무음'],
    ] as const)('%s 톤을 렌더링합니다', (tone, label) => {
      render(
        <ActivityFeed title='활동' items={[{ id: '1', tone, text: label, time: '방금 전' }]} />,
      )
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  describe('텍스트 내용', () => {
    it('ReactNode를 text로 렌더링합니다', () => {
      render(
        <ActivityFeed
          title='활동'
          items={[
            {
              id: '1',
              tone: 'info',
              text: (
                <span>
                  <strong>사용자</strong>님이 로그인했습니다
                </span>
              ),
              time: '5분 전',
            },
          ]}
        />,
      )
      expect(screen.getByText('사용자')).toBeInTheDocument()
      expect(screen.getByText('님이 로그인했습니다')).toBeInTheDocument()
    })
  })

  describe('접근성', () => {
    it('점 요소에 aria-hidden 속성이 있습니다', () => {
      render(
        <ActivityFeed
          title='활동'
          items={[{ id: '1', tone: 'success', text: '작업', time: '1시간 전' }]}
        />,
      )
      // dot 요소가 aria-hidden="true"를 가집니다
      const dots = document.querySelectorAll('[aria-hidden="true"]')
      expect(dots.length).toBeGreaterThan(0)
    })

    it('리스트를 렌더링하고 접근 가능합니다', () => {
      render(
        <ActivityFeed
          title='활동'
          items={[{ id: '1', tone: 'info', text: '작업 완료', time: '1시간 전' }]}
        />,
      )
      const list = screen.queryByRole('list')
      expect(list).toBeInTheDocument()
    })
  })

  describe('경계 케이스', () => {
    it('숫자 id를 지원합니다', () => {
      render(
        <ActivityFeed
          title='활동'
          items={[{ id: 123, tone: 'success', text: '작업', time: '1시간 전' }]}
        />,
      )
      expect(screen.getByText('작업')).toBeInTheDocument()
    })

    it('긴 텍스트를 렌더링합니다', () => {
      const longText = 'A'.repeat(100)
      render(
        <ActivityFeed
          title='활동'
          items={[{ id: '1', tone: 'info', text: longText, time: '1시간 전' }]}
        />,
      )
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })
})
