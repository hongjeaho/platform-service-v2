import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('단일 클래스를 반환한다', () => {
    expect(cn('flex')).toBe('flex')
  })

  it('여러 클래스를 병합한다', () => {
    expect(cn('flex', 'items-center', 'gap-2')).toBe('flex items-center gap-2')
  })

  it('조건부 클래스를 처리한다', () => {
    expect(cn('base', '', 'visible')).toBe('base visible')
  })

  it('Tailwind 충돌 클래스를 마지막 것으로 덮어쓴다', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('undefined/null 값을 무시한다', () => {
    expect(cn('flex', undefined, null, 'gap-2')).toBe('flex gap-2')
  })

  it('빈 인자를 처리한다', () => {
    expect(cn()).toBe('')
  })

  it('배열 클래스를 처리한다', () => {
    expect(cn(['flex', 'items-center'])).toBe('flex items-center')
  })

  it('객체 형태의 조건부 클래스를 처리한다', () => {
    expect(cn({ flex: true, hidden: false, 'gap-2': true })).toBe('flex gap-2')
  })
})
