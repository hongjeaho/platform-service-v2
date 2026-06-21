import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useIsDesktop, useIsMobile, useIsTablet, useMediaQuery } from './useMediaQuery'

function createMatchMedia(matches: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

beforeEach(() => {
  vi.stubGlobal('window', { ...window, matchMedia: createMatchMedia(false) })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useMediaQuery', () => {
  it('쿼리가 일치하면 true를 반환한다', () => {
    vi.stubGlobal('window', { ...window, matchMedia: createMatchMedia(true) })
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('쿼리가 일치하지 않으면 false를 반환한다', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('unmount 시 이벤트 리스너가 제거된다', () => {
    const removeEventListener = vi.fn()
    const mockMatchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })
    vi.stubGlobal('window', { ...window, matchMedia: mockMatchMedia })

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('레거시 브라우저에서는 addListener/removeListener를 사용한다', () => {
    const addListener = vi.fn()
    const removeListener = vi.fn()
    const mockMatchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      addEventListener: undefined,
      removeEventListener: undefined,
      addListener,
      removeListener,
    })
    vi.stubGlobal('window', { ...window, matchMedia: mockMatchMedia })

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    unmount()

    expect(addListener).toHaveBeenCalledWith(expect.any(Function))
    expect(removeListener).toHaveBeenCalledWith(expect.any(Function))
  })
})

describe('useIsMobile', () => {
  it('모바일 쿼리를 사용한다', () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBeTypeOf('boolean')
  })
})

describe('useIsTablet', () => {
  it('태블릿 쿼리를 사용한다', () => {
    const { result } = renderHook(() => useIsTablet())
    expect(result.current).toBeTypeOf('boolean')
  })
})

describe('useIsDesktop', () => {
  it('데스크탑 쿼리를 사용한다', () => {
    const { result } = renderHook(() => useIsDesktop())
    expect(result.current).toBeTypeOf('boolean')
  })
})
