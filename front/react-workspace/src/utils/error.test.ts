import { describe, expect, it, vi } from 'vitest'

import { getApiErrorMessage, getErrorMessage, logError } from './error'

describe('getErrorMessage', () => {
  it('Error 인스턴스에서 message를 추출한다', () => {
    expect(getErrorMessage(new Error('에러 발생'))).toBe('에러 발생')
  })

  it('문자열 에러를 그대로 반환한다', () => {
    expect(getErrorMessage('문자열 에러')).toBe('문자열 에러')
  })

  it('message 필드가 있는 객체에서 메시지를 추출한다', () => {
    expect(getErrorMessage({ message: '객체 에러' })).toBe('객체 에러')
  })

  it('알 수 없는 타입은 기본 메시지를 반환한다', () => {
    expect(getErrorMessage(null)).toBe('알 수 없는 오류가 발생했습니다.')
    expect(getErrorMessage(undefined)).toBe('알 수 없는 오류가 발생했습니다.')
    expect(getErrorMessage(42)).toBe('알 수 없는 오류가 발생했습니다.')
  })
})

describe('getApiErrorMessage', () => {
  it('message 필드를 우선 반환한다', () => {
    expect(getApiErrorMessage({ message: 'API 메시지', error: 'API 에러' })).toBe('API 메시지')
  })

  it('message 없을 때 error 필드를 반환한다', () => {
    expect(getApiErrorMessage({ error: 'API 에러' })).toBe('API 에러')
  })

  it('둘 다 없으면 기본 메시지를 반환한다', () => {
    expect(getApiErrorMessage({})).toBe('API 요청에 실패했습니다.')
  })
})

describe('logError', () => {
  it('DEV 환경에서 console.error를 호출한다', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    logError(new Error('테스트 에러'))

    consoleSpy.mockRestore()
  })

  it('context가 있으면 prefix를 포함하여 로깅한다', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    logError(new Error('테스트 에러'), 'TestContext')

    consoleSpy.mockRestore()
  })
})
