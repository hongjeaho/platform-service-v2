import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('지정된 지연 시간 후에 값을 업데이트한다', () => {
    const { result } = renderHook(() => useDebounce('test', 500))

    expect(result.current).toBe('test')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('test')
  })

  it('지연 시간 내에 값이 변경되면 타이머를 리셋한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    })

    expect(result.current).toBe('initial')

    // 300ms 경과 후 값 변경
    act(() => {
      vi.advanceTimersByTime(300)
      rerender({ value: 'updated', delay: 500 })
    })

    // 이전 타이머가 취소되었으므로 500ms 더 기다려야 함
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('기본 지연 시간은 500ms이다', () => {
    const { result } = renderHook(() => useDebounce('test'))

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('test')
  })
})
