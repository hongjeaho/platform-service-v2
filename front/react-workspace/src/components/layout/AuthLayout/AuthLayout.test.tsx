import { render, screen } from '@testing-library/react'

/**
 * AuthLayout이 브랜드 문자열을 하드코딩하지 않고 단일 brand config(VITE_APP_NAME)를
 * 소비하는지 검증한다(ADR-0006). env를 stub한 뒤 모듈을 새로 로드해야 하므로
 * 동적 import를 사용한다.
 */
describe('AuthLayout', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('brand config의 이름과 마크를 렌더한다 (VITE_APP_NAME 주도)', async () => {
    vi.stubEnv('VITE_APP_NAME', 'Test Brand')
    vi.resetModules()
    const { AuthLayout } = await import('./AuthLayout')

    render(
      <AuthLayout>
        <div>content</div>
      </AuthLayout>
    )

    expect(screen.getByText('Test Brand')).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('children을 카드 안에 렌더한다', async () => {
    const { AuthLayout } = await import('./AuthLayout')

    render(
      <AuthLayout>
        <div>폼 콘텐츠</div>
      </AuthLayout>
    )

    expect(screen.getByText('폼 콘텐츠')).toBeInTheDocument()
  })
})
