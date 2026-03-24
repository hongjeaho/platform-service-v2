import { describe, expect, it } from 'vitest'

import {
  getPasswordStrength,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidPostalCode,
  isValidUrl,
} from './validation'

describe('isValidEmail', () => {
  it('유효한 이메일을 true로 판별한다', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@example.co.kr')).toBe(true)
    expect(isValidEmail('user+tag@example.com')).toBe(true)
  })

  it('유효하지 않은 이메일을 false로 판별한다', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('invalid@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
  })
})

describe('isValidPhoneNumber', () => {
  it('유효한 전화번호를 true로 판별한다', () => {
    expect(isValidPhoneNumber('01012345678')).toBe(true)
    expect(isValidPhoneNumber('010-1234-5678')).toBe(true)
    expect(isValidPhoneNumber('02 1234 5678')).toBe(true)
    expect(isValidPhoneNumber('0311234567')).toBe(true)
  })

  it('유효하지 않은 전화번호를 false로 판별한다', () => {
    expect(isValidPhoneNumber('123')).toBe(false)
    expect(isValidPhoneNumber('123456789012')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('유효한 비밀번호를 true로 판별한다', () => {
    expect(isValidPassword('password123')).toBe(true)
    expect(isValidPassword('abc12345')).toBe(true)
    expect(isValidPassword('test1234')).toBe(true)
  })

  it('유효하지 않은 비밀번호를 false로 판별한다', () => {
    expect(isValidPassword('short')).toBe(false) // 8자 미만
    expect(isValidPassword('12345678')).toBe(false) // 숫자만
    expect(isValidPassword('abcdefgh')).toBe(false) // 문자만
  })
})

describe('getPasswordStrength', () => {
  it('약한 비밀번호를 weak로 판별한다', () => {
    expect(getPasswordStrength('password123')).toBe('weak')
    expect(getPasswordStrength('abc12345')).toBe('weak')
    expect(getPasswordStrength('Abcdefgh')).toBe('weak')
  })

  it('중간 강도 비밀번호를 medium으로 판별한다', () => {
    expect(getPasswordStrength('Password123')).toBe('medium')
    expect(getPasswordStrength('Abcdefg123')).toBe('medium') // 10자
  })

  it('강한 비밀번호를 strong으로 판별한다', () => {
    expect(getPasswordStrength('Password123!')).toBe('strong')
    expect(getPasswordStrength('StrongP@ss123')).toBe('strong')
  })
})

describe('isValidUrl', () => {
  it('유효한 URL을 true로 판별한다', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://example.com')).toBe(true)
    expect(isValidUrl('https://example.com/path')).toBe(true)
  })

  it('유효하지 않은 URL을 false로 판별한다', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
    expect(isValidUrl('example')).toBe(false)
  })
})

describe('isValidPostalCode', () => {
  it('유효한 우편번호를 true로 판별한다', () => {
    expect(isValidPostalCode('12345')).toBe(true)
    expect(isValidPostalCode('12345-678')).toBe(false) // 하이픈 허용 안 함
  })

  it('유효하지 않은 우편번호를 false로 판별한다', () => {
    expect(isValidPostalCode('1234')).toBe(false) // 4자리
    expect(isValidPostalCode('123456')).toBe(false) // 6자리
    expect(isValidPostalCode('abcd')).toBe(false) // 문자
  })
})
