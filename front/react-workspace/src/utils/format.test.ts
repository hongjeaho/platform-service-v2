import { describe, expect, it } from 'vitest'

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatFileSize,
  formatNumber,
  formatPhoneNumber,
} from './format'

describe('formatDate', () => {
  it('Date 객체를 포맷팅한다', () => {
    const date = new Date(2024, 0, 15) // 2024-01-15
    expect(formatDate(date)).toBe('2024.01.15')
  })

  it('타임스탬프를 포맷팅한다', () => {
    const timestamp = new Date(2024, 0, 15).getTime()
    expect(formatDate(timestamp)).toBe('2024.01.15')
  })

  it('문자열 날짜를 포맷팅한다', () => {
    expect(formatDate('2024-01-15')).toBe('2024.01.15')
  })

  it('커스텀 포맷을 적용한다', () => {
    const date = new Date(2024, 0, 15, 14, 30, 45)
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15')
  })

  it('잘못된 날짜에 대해 빈 문자열을 반환한다', () => {
    expect(formatDate('invalid-date')).toBe('')
  })
})

describe('formatDateTime', () => {
  it('날짜와 시간을 포맷팅한다', () => {
    const date = new Date(2024, 0, 15, 14, 30, 45)
    expect(formatDateTime(date)).toBe('2024.01.15 14:30:45')
  })
})

describe('formatNumber', () => {
  it('숫자를 천 단위 콤마로 포맷팅한다', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1000000)).toBe('1,000,000')
    expect(formatNumber(1234567.89)).toBe('1,234,567.89')
  })

  it('0을 포맷팅한다', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatCurrency', () => {
  it('숫자를 통화 형태로 포맷팅한다', () => {
    expect(formatCurrency(1000)).toBe('1,000원')
    expect(formatCurrency(1234567)).toBe('1,234,567원')
  })
})

describe('formatPhoneNumber', () => {
  it('11자리 전화번호를 포맷팅한다', () => {
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678')
  })

  it('10자리 전화번호를 포맷팅한다', () => {
    expect(formatPhoneNumber('0101234567')).toBe('010-123-4567')
  })

  it('9자리 전화번호를 포맷팅한다', () => {
    expect(formatPhoneNumber('021234567')).toBe('02-123-4567')
  })

  it('이미 하이픈이 있는 경우 제거하고 포맷팅한다', () => {
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
  })
})

describe('formatFileSize', () => {
  it('바이트를 포맷팅한다', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('소수점을 포함하여 포맷팅한다', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1536 * 1024)).toBe('1.5 MB')
  })
})
