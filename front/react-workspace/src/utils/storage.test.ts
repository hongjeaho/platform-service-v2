import { afterEach, describe, expect, it } from 'vitest'

import {
  clearStorage,
  getStorageItem,
  getStorageKeys,
  getStorageSize,
  removeStorageItem,
  setStorageItem,
} from './storage'

afterEach(() => {
  localStorage.clear()
})

describe('setStorageItem / getStorageItem', () => {
  it('값을 저장하고 불러온다', () => {
    setStorageItem('key', { name: '홍길동', age: 30 })
    expect(getStorageItem('key', null)).toEqual({ name: '홍길동', age: 30 })
  })

  it('키가 없으면 defaultValue를 반환한다', () => {
    expect(getStorageItem('missing', 'default')).toBe('default')
  })

  it('숫자, 불리언, 배열 등 다양한 타입을 저장한다', () => {
    setStorageItem('num', 42)
    setStorageItem('bool', true)
    setStorageItem('arr', [1, 2, 3])

    expect(getStorageItem('num', 0)).toBe(42)
    expect(getStorageItem('bool', false)).toBe(true)
    expect(getStorageItem('arr', [])).toEqual([1, 2, 3])
  })

  it('손상된 JSON이 저장되어 있으면 defaultValue를 반환한다', () => {
    localStorage.setItem('broken', 'not-json')
    expect(getStorageItem('broken', 'fallback')).toBe('fallback')
  })

  it('undefined 값 저장 시 항목이 제거된다', () => {
    setStorageItem('key', 'initial')
    expect(getStorageItem('key', null)).toBe('initial')

    setStorageItem('key', undefined)
    expect(getStorageItem('key', 'default')).toBe('default')
  })

  it('문자열 "undefined"가 저장되어 있으면 defaultValue를 반환한다', () => {
    localStorage.setItem('undefined-str', 'undefined')
    expect(getStorageItem('undefined-str', 'fallback')).toBe('fallback')
  })
})

describe('removeStorageItem', () => {
  it('저장된 항목을 삭제한다', () => {
    setStorageItem('toRemove', 'value')
    removeStorageItem('toRemove')
    expect(getStorageItem('toRemove', null)).toBeNull()
  })

  it('존재하지 않는 키 삭제 시 에러 없이 처리한다', () => {
    expect(() => removeStorageItem('nonexistent')).not.toThrow()
  })
})

describe('clearStorage', () => {
  it('모든 항목을 삭제한다', () => {
    setStorageItem('a', 1)
    setStorageItem('b', 2)
    clearStorage()
    expect(getStorageItem('a', null)).toBeNull()
    expect(getStorageItem('b', null)).toBeNull()
  })

  it('exceptKeys에 지정한 키는 유지한다', () => {
    setStorageItem('keep', 'preserved')
    setStorageItem('remove', 'deleted')
    clearStorage(['keep'])
    expect(getStorageItem('keep', null)).toBe('preserved')
    expect(getStorageItem('remove', null)).toBeNull()
  })

  it('exceptKeys에 없는 키는 보존하지 않는다', () => {
    setStorageItem('a', 1)
    setStorageItem('b', 2)
    clearStorage(['a'])
    expect(localStorage.getItem('b')).toBeNull()
  })
})

describe('getStorageKeys', () => {
  it('저장된 키 목록을 반환한다', () => {
    setStorageItem('x', 1)
    setStorageItem('y', 2)
    const keys = getStorageKeys()
    expect(keys).toContain('x')
    expect(keys).toContain('y')
  })

  it('비어 있으면 빈 배열을 반환한다', () => {
    expect(getStorageKeys()).toEqual([])
  })
})

describe('getStorageSize', () => {
  it('저장된 데이터의 바이트 크기를 반환한다', () => {
    localStorage.setItem('k', 'v')
    expect(getStorageSize()).toBeGreaterThan(0)
  })

  it('비어 있으면 0을 반환한다', () => {
    expect(getStorageSize()).toBe(0)
  })
})
