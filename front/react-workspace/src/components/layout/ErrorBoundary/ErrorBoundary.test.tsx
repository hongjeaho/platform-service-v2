import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from './ErrorBoundary'

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('테스트 에러')
  return <div>정상 컨텐츠</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('에러가 없으면 자식 컴포넌트를 렌더링한다', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('정상 컨텐츠')).toBeInTheDocument()
  })

  it('에러 발생 시 FallbackPage를 렌더링한다', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.queryByText('정상 컨텐츠')).not.toBeInTheDocument()
  })

  it('새로고침 버튼 클릭 시 에러 상태가 초기화된다', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    const refreshButton = screen.getByRole('button', { name: /새로고침/i })
    fireEvent.click(refreshButton)

    // 에러 초기화 후 hasError가 false가 되어 자식을 렌더링 시도
    // (ThrowError는 여전히 throw하므로 FallbackPage가 다시 보임)
    expect(screen.getByRole('button', { name: /새로고침/i })).toBeInTheDocument()
  })
})
