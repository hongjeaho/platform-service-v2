import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FallbackPage } from './FallbackPage'

describe('FallbackPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('에러 메시지를 렌더링한다', () => {
    const error = new Error('테스트 에러 메시지')
    render(<FallbackPage error={error} />)
    expect(screen.getByText('테스트 에러 메시지')).toBeInTheDocument()
  })

  it('error가 없으면 기본 메시지를 표시한다', () => {
    render(<FallbackPage />)
    expect(screen.getByText('알 수 없는 오류가 발생했습니다.')).toBeInTheDocument()
  })

  it('resetError가 있으면 새로고침 버튼 클릭 시 resetError를 호출한다', () => {
    const resetError = vi.fn()
    render(<FallbackPage resetError={resetError} />)

    fireEvent.click(screen.getByRole('button', { name: /새로고침/i }))
    expect(resetError).toHaveBeenCalledOnce()
  })

  it('resetError가 없으면 새로고침 버튼 클릭 시 window.location.reload를 호출한다', () => {
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    })

    render(<FallbackPage />)
    fireEvent.click(screen.getByRole('button', { name: /새로고침/i }))
    expect(reloadMock).toHaveBeenCalledOnce()
  })

  it('홈으로 이동 버튼을 렌더링한다', () => {
    render(<FallbackPage />)
    expect(screen.getByRole('button', { name: /홈으로 이동/i })).toBeInTheDocument()
  })

  it('"오류가 발생했습니다" 페이지 제목을 렌더링한다', () => {
    render(<FallbackPage />)
    expect(screen.getByRole('heading', { name: '오류가 발생했습니다' })).toBeInTheDocument()
  })

  it('홈으로 이동 버튼 클릭 시 루트 경로로 이동한다', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, href: '' },
      writable: true,
    })

    render(<FallbackPage />)
    fireEvent.click(screen.getByRole('button', { name: /홈으로 이동/i }))
    expect(window.location.href).toBe('/')
  })
})
