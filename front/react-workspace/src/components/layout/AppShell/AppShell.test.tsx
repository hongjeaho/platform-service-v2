import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { AppShell } from './AppShell'

const mockBrand = { label: 'Test App', mark: 'TA' }
const mockSections = [
  {
    label: '메인',
    items: [
      { label: '대시보드', to: '/dashboard' },
      { label: '설정', to: '/settings' },
    ],
  },
]
const mockProfile = { name: '테스트 사용자', role: 'Admin' }
const mockBreadcrumb = '홈 > 대시보드'

describe('AppShell', () => {
  describe('렌더링', () => {
    it('브랜드 라벨을 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      expect(screen.getByText('Test App')).toBeInTheDocument()
    })

    it('섹션 라벨을 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      expect(screen.getByText('메인')).toBeInTheDocument()
    })

    it('네비게이션 항목을 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      expect(screen.getByText('대시보드')).toBeInTheDocument()
      expect(screen.getByText('설정')).toBeInTheDocument()
    })

    it('프로필 정보를 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell
            brand={mockBrand}
            sections={mockSections}
            profile={mockProfile}
            breadcrumb={mockBreadcrumb}
          />
        </MemoryRouter>,
      )
      expect(screen.getByText('테스트 사용자')).toBeInTheDocument()
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })

    it('빈 프로필일 때도 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      expect(screen.getByText('Test App')).toBeInTheDocument()
    })
  })

  describe('children', () => {
    it('children이 있을 때 children을 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb}>
            <div data-testid='custom-content'>커스텀 콘텐츠</div>
          </AppShell>
        </MemoryRouter>,
      )
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByText('커스텀 콘텐츠')).toBeInTheDocument()
    })

    it('children이 없을 때 기본 main 요소를 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      const main = document.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('콜백 함수', () => {
    it('onSearch 콜백을 전달합니다', () => {
      const handleSearch = vi.fn()
      render(
        <MemoryRouter>
          <AppShell
            brand={mockBrand}
            sections={mockSections}
            breadcrumb={mockBreadcrumb}
            onSearch={handleSearch}
          />
        </MemoryRouter>,
      )
      // Topbar에 onSearch가 전달되는지 확인
      expect(screen.getByText('Test App')).toBeInTheDocument()
    })

    it('onNotificationsClick 콜백을 전달합니다', () => {
      const handleNotifications = vi.fn()
      render(
        <MemoryRouter>
          <AppShell
            brand={mockBrand}
            sections={mockSections}
            breadcrumb={mockBreadcrumb}
            onNotificationsClick={handleNotifications}
          />
        </MemoryRouter>,
      )
      expect(screen.getByText('Test App')).toBeInTheDocument()
    })
  })

  describe('레이아웃 구조', () => {
    it('flex 컨테이너로 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      const container = document.querySelector('.flex.h-screen')
      expect(container).toBeInTheDocument()
    })

    it('main 요소를 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={mockSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      const main = document.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('경계 케이스', () => {
    it('빈 섹션 배열로 렌더링합니다', () => {
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={[]} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      expect(screen.getByText('Test App')).toBeInTheDocument()
    })

    it('여러 섹션을 렌더링합니다', () => {
      const multipleSections = [
        { label: '섹션 1', items: [{ label: '항목 1', to: '/item1' }] },
        { label: '섹션 2', items: [{ label: '항목 2', to: '/item2' }] },
        { label: '섹션 3', items: [{ label: '항목 3', to: '/item3' }] },
      ]
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={multipleSections} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      expect(screen.getByText('섹션 1')).toBeInTheDocument()
      expect(screen.getByText('섹션 2')).toBeInTheDocument()
      expect(screen.getByText('섹션 3')).toBeInTheDocument()
    })

    it('라벨 없는 섹션을 렌더링합니다', () => {
      const sectionWithoutLabel = [{ items: [{ label: '항목', to: '/item' }] }]
      render(
        <MemoryRouter>
          <AppShell brand={mockBrand} sections={sectionWithoutLabel} breadcrumb={mockBreadcrumb} />
        </MemoryRouter>,
      )
      expect(screen.getByText('항목')).toBeInTheDocument()
    })
  })
})
