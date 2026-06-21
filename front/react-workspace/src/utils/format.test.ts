import { describe, expect, it } from 'vitest'

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatFileSize,
  formatNumber,
  formatPercent,
  formatPhoneNumber,
  formatRelativeTime,
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

  it('변환 불가능한 길이의 번호는 원본을 반환한다', () => {
    expect(formatPhoneNumber('12345')).toBe('12345')
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

describe('formatRelativeTime', () => {
  it('방금 전을 반환한다 (60초 미만)', () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe('방금 전')
  })

  it('분 단위 상대 시간을 반환한다', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(date)).toBe('5분 전')
  })

  it('시간 단위 상대 시간을 반환한다', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000)
    expect(formatRelativeTime(date)).toBe('3시간 전')
  })

  it('일 단위 상대 시간을 반환한다', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(date)).toBe('2일 전')
  })

  it('주 단위 상대 시간을 반환한다', () => {
    const date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(date)).toBe('2주 전')
  })

  it('개월 단위 상대 시간을 반환한다', () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(date)).toBe('2개월 전')
  })

  it('년 단위 상대 시간을 반환한다', () => {
    const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(date)).toBe('1년 전')
  })

  it('문자열 날짜를 처리한다', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(date)).toBe('5분 전')
  })

  it('타임스탬프(number)를 처리한다', () => {
    const timestamp = Date.now() - 3 * 60 * 1000
    expect(formatRelativeTime(timestamp)).toBe('3분 전')
  })
})

describe('formatPercent', () => {
  it('기본 소수점 1자리로 퍼센트를 계산한다', () => {
    expect(formatPercent(1, 3)).toBe('33.3%')
    expect(formatPercent(2, 3)).toBe('66.7%')
  })

  it('소수점 자릿수를 커스텀 지정한다', () => {
    expect(formatPercent(1, 3, 0)).toBe('33%')
    expect(formatPercent(1, 3, 2)).toBe('33.33%')
  })

  it('total이 0이면 "0%"를 반환한다', () => {
    expect(formatPercent(0, 0)).toBe('0%')
  })

  it('100%를 반환한다', () => {
    expect(formatPercent(5, 5)).toBe('100.0%')
  })
})
