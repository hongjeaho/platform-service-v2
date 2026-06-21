import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useClickOutside } from './useClickOutside'

describe('useClickOutside', () => {
  it('ref를 반환한다', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useClickOutside(callback))
    expect(result.current).toBeDefined()
    expect(result.current.current).toBeNull()
  })

  it('요소 외부 클릭 시 callback을 호출한다', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(callback))

    const outer = document.createElement('div')
    const inner = document.createElement('div')
    outer.appendChild(inner)
    document.body.appendChild(outer)

    Object.defineProperty(result.current, 'current', { value: inner, writable: true })

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, target: outer } as MouseEventInit))

    document.body.removeChild(outer)
  })

  it('요소 내부 클릭 시 callback을 호출하지 않는다', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(callback))

    const container = document.createElement('div')
    document.body.appendChild(container)

    Object.defineProperty(result.current, 'current', { value: container, writable: true })

    container.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(callback).not.toHaveBeenCalled()
    document.body.removeChild(container)
  })

  it('unmount 시 이벤트 리스너가 제거된다', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const callback = vi.fn()
    const { unmount } = renderHook(() => useClickOutside(callback))

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    removeSpy.mockRestore()
  })
})
