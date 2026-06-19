import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from './useCopyToClipboard'

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('초기 isCopied는 false이다', () => {
    const { result } = renderHook(() => useCopyToClipboard())
    expect(result.current.isCopied).toBe(false)
  })

  it('복사 성공 시 isCopied가 true가 된다', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      const success = await result.current.copy('복사할 텍스트')
      expect(success).toBe(true)
    })

    expect(result.current.isCopied).toBe(true)
  })

  it('2초 후 isCopied가 false로 리셋된다', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('텍스트')
    })

    expect(result.current.isCopied).toBe(true)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.isCopied).toBe(false)
  })

  it('복사 실패 시 false를 반환하고 isCopied는 false로 유지된다', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('permission denied')) },
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      const success = await result.current.copy('텍스트')
      expect(success).toBe(false)
    })

    expect(result.current.isCopied).toBe(false)
  })
})
