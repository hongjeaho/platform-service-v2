import { act,renderHook } from '@testing-library/react'
import { beforeEach,describe, expect, it, vi } from 'vitest'

import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // localStorage mock
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      get length() {
        return 0
      },
      key: vi.fn(),
    }
    vi.stubGlobal('localStorage', localStorageMock)

    // StorageEvent mock
    vi.stubGlobal('StorageEvent', class StorageEvent extends Event {})
  })

  it('초기값을 설정한다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    expect(result.current[0]).toBe('default')
  })

  it('값을 설정하고 localStorage에 저장한다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('updated'))
  })

  it('함수를 통해 값을 업데이트할 수 있다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('값을 제거하고 초기값으로 되돌린다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]('updated')
    })
    expect(result.current[0]).toBe('updated')

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe('default')
    expect(localStorage.removeItem).toHaveBeenCalledWith('test-key')
  })
})
