import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/store/auth/authStore'

import { ProtectedRoute } from './ProtectedRoute'

function renderWithRouter(isAuthenticated: boolean, redirectTo?: string) {
  useAuthStore.setState({
    user: isAuthenticated ? { id: 1, name: 'User', email: 'u@test.com', roles: [] } : null,
  })

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path='/login' element={<div>로그인 페이지</div>} />
        <Route
          path='/protected'
          element={
            <ProtectedRoute redirectTo={redirectTo}>
              <div>보호된 컨텐츠</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null })
  })

  it('인증된 사용자에게 자식 컴포넌트를 렌더링한다', () => {
    renderWithRouter(true)
    expect(screen.getByText('보호된 컨텐츠')).toBeInTheDocument()
  })

  it('미인증 사용자를 /login으로 리다이렉트한다 (기본값)', () => {
    renderWithRouter(false)
    expect(screen.getByText('로그인 페이지')).toBeInTheDocument()
    expect(screen.queryByText('보호된 컨텐츠')).not.toBeInTheDocument()
  })

  it('커스텀 redirectTo 경로로 리다이렉트한다', () => {
    useAuthStore.setState({ user: null })

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path='/custom-login' element={<div>커스텀 로그인</div>} />
          <Route
            path='/protected'
            element={
              <ProtectedRoute redirectTo='/custom-login'>
                <div>보호된 컨텐츠</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('커스텀 로그인')).toBeInTheDocument()
  })
})
