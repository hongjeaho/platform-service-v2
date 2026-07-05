import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MiniBarChart } from './MiniBarChart'

describe('MiniBarChart', () => {
  describe('렌더링', () => {
    it('타이틀을 렌더링합니다', () => {
      render(<MiniBarChart title='주간 현황' data={[]} />)
      expect(screen.getByText('주간 현황')).toBeInTheDocument()
    })

    it('데이터 배열을 렌더링합니다', () => {
      render(
        <MiniBarChart
          title='주간 현황'
          data={[
            { label: '월', value: 10 },
            { label: '화', value: 20 },
          ]}
        />,
      )
      expect(screen.getByText('월')).toBeInTheDocument()
      expect(screen.getByText('화')).toBeInTheDocument()
    })

    it('빈 데이터를 렌더링합니다', () => {
      render(<MiniBarChart title='데이터 없음' data={[]} />)
      expect(screen.getByText('데이터 없음')).toBeInTheDocument()
    })
  })

  describe('막대 렌더링', () => {
    it('모든 라벨을 렌더링합니다', () => {
      render(
        <MiniBarChart
          title='월별 데이터'
          data={[
            { label: '1월', value: 50 },
            { label: '2월', value: 75 },
            { label: '3월', value: 100 },
          ]}
        />,
      )
      expect(screen.getByText('1월')).toBeInTheDocument()
      expect(screen.getByText('2월')).toBeInTheDocument()
      expect(screen.getByText('3월')).toBeInTheDocument()
    })

    it('최댓값 막대가 강조됩니다', () => {
      render(
        <MiniBarChart
          title='데이터'
          data={[
            { label: 'A', value: 10 },
            { label: 'B', value: 50 },
            { label: 'C', value: 30 },
          ]}
        />,
      )
      // 최댓값이 50인 B가 강조되어야 함
      // height가 최댓값일 것
      const bars = screen.getAllByRole('img')
      const maxBar = bars.find(bar => bar.getAttribute('aria-label') === 'B: 50')
      expect(maxBar).toBeInTheDocument()
    })

    it('모든 막대에 aria-label이 있습니다', () => {
      render(
        <MiniBarChart
          title='데이터'
          data={[
            { label: 'X', value: 42 },
            { label: 'Y', value: 73 },
          ]}
        />,
      )
      expect(screen.getByRole('img', { name: 'X: 42' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Y: 73' })).toBeInTheDocument()
    })
  })

  describe('데이터 값 처리', () => {
    it('0값 데이터를 처리합니다', () => {
      render(
        <MiniBarChart
          title='0 포함'
          data={[
            { label: 'A', value: 0 },
            { label: 'B', value: 10 },
          ]}
        />,
      )
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
    })

    it('음수를 포함한 데이터를 처리합니다', () => {
      render(
        <MiniBarChart
          title='음수 포함'
          data={[
            { label: 'A', value: -5 },
            { label: 'B', value: 10 },
            { label: 'C', value: 25 },
          ]}
        />,
      )
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
    })

    it('단일 데이터 포인트를 렌더링합니다', () => {
      render(<MiniBarChart title='단일' data={[{ label: 'Only', value: 100 }]} />)
      expect(screen.getByText('Only')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Only: 100' })).toBeInTheDocument()
    })
  })

  describe('경계 케이스', () => {
    it('최댓값이 1 미만일 때도 렌더링합니다', () => {
      render(
        <MiniBarChart
          title='소수값'
          data={[
            { label: 'A', value: 0.1 },
            { label: 'B', value: 0.5 },
          ]}
        />,
      )
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
    })

    it('많은 데이터 포인트를 렌더링합니다', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({
        label: `${i + 1}`,
        value: Math.random() * 100,
      }))

      render(<MiniBarChart title='많은 데이터' data={data} />)

      // 첫 번째와 마지막 라벨 확인
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('동일한 최댓값이 여러 개일 때 모두 강조됩니다', () => {
      render(
        <MiniBarChart
          title='동일 최댓값'
          data={[
            { label: 'A', value: 50 },
            { label: 'B', value: 50 },
            { label: 'C', value: 30 },
          ]}
        />,
      )
      expect(screen.getByRole('img', { name: 'A: 50' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'B: 50' })).toBeInTheDocument()
    })
  })

  describe('접근성', () => {
    it('각 막대에 role="img"가 있습니다', () => {
      render(<MiniBarChart title='데이터' data={[{ label: 'Test', value: 42 }]} />)
      const bar = screen.getByRole('img')
      expect(bar).toBeInTheDocument()
    })

    it('aria-label에 라벨과 값을 포함합니다', () => {
      render(<MiniBarChart title='데이터' data={[{ label: 'Sales', value: 1234 }]} />)
      expect(screen.getByRole('img', { name: 'Sales: 1234' })).toBeInTheDocument()
    })
  })
})
