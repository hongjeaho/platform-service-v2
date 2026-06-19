import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

    // StorageEvent mock (key, newValue 지원)
    vi.stubGlobal(
      'StorageEvent',
      class StorageEvent extends Event {
        key: string | null
        newValue: string | null
        constructor(type: string, init?: { key?: string; newValue?: string }) {
          super(type)
          this.key = init?.key ?? null
          this.newValue = init?.newValue ?? null
        }
      },
    )
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

  it('다른 탭에서 storage 이벤트 발생 시 값이 동기화된다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: JSON.stringify('from-other-tab'),
        }),
      )
    })

    expect(result.current[0]).toBe('from-other-tab')
  })

  it('다른 키의 storage 이벤트는 무시한다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'other-key',
          newValue: JSON.stringify('other-value'),
        }),
      )
    })

    expect(result.current[0]).toBe('default')
  })

  it('setValue에서 에러 발생 시 console.error를 호출한다', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockSetItem = vi.fn().mockImplementation(() => {
      throw new Error('storage full')
    })
    vi.stubGlobal('localStorage', {
      ...localStorage,
      getItem: vi.fn().mockReturnValue(null),
      setItem: mockSetItem,
      removeItem: vi.fn(),
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]('value')
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('setValue에 함수를 전달 시 에러가 발생하면 catch 블록을 실행한다', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1](() => {
        throw new Error('setter function error')
      })
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('storage 이벤트에서 newValue가 null이면 상태를 업데이트하지 않는다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: null,
        }),
      )
    })

    expect(result.current[0]).toBe('default')
  })
})
