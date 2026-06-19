import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useThrottle } from './useThrottle'

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('초기값을 즉시 반환한다', () => {
    const { result } = renderHook(() => useThrottle('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('쓰로틀 시간이 지나기 전에는 이전 값을 유지한다', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
      initialProps: { value: 'first' },
    })

    expect(result.current).toBe('first')

    rerender({ value: 'second' })

    // 아직 쓰로틀 시간이 지나지 않음
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('first')
  })

  it('쓰로틀 시간이 지나면 최신 값으로 업데이트된다', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('second')
  })

  it('기본 limit(500ms)을 사용한다', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value), {
      initialProps: { value: 'initial' },
    })

    rerender({ value: 'updated' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('unmount 시 타이머가 정리된다', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { unmount } = renderHook(() => useThrottle('value', 500))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
