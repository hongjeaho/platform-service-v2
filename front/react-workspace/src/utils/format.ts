/**
 * 날짜 포맷팅 유틸리티
 */

/**
 * 날짜를 포맷팅합니다.
 * @param date - Date 객체 또는 타임스탬프
 * @param format - 포맷 문자열 (default: 'YYYY.MM.DD')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date | number | string, format: string = 'YYYY.MM.DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date instanceof Date ? date : new Date(date)

  if (Number.isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 날짜와 시간을 포맷팅합니다.
 * @param date - Date 객체 또는 타임스탬프
 * @returns 포맷팅된 날짜시간 문자열 (YYYY.MM.DD HH:mm:ss)
 */
export function formatDateTime(date: Date | number | string): string {
  return formatDate(date, 'YYYY.MM.DD HH:mm:ss')
}

/**
 * 상대적 시간을 포맷팅합니다 (예: "3분 전", "2시간 전").
 * @param date - Date 객체 또는 타임스탬프
 * @returns 상대적 시간 문자열
 */
export function formatRelativeTime(date: Date | number | string): string {
  const d = typeof date === 'string' ? new Date(date) : date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`
  return `${Math.floor(diffDay / 365)}년 전`
}

/**
 * 숫자를 포맷팅합니다 (천 단위 콤마).
 * @param num - 포맷팅할 숫자
 * @returns 포맷팅된 숫자 문자열
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}

/**
 * 숫자를 통화 형태로 포맷팅합니다.
 * @param amount - 금액
 * @returns 포맷팅된 통화 문자열 (예: "1,234,567원")
 */
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)}원`
}

/**
 * 전화번호를 포맷팅합니다.
 * @param phone - 전화번호 문자열 (숫자만)
 * @returns 포맷팅된 전화번호 (예: "010-1234-5678")
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phone // 변환 실패 시 원본 반환
}

/**
 * 파일 크기를 포맷팅합니다.
 * @param bytes - 바이트 단위 파일 크기
 * @returns 포맷팅된 파일 크기 (예: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

/**
 * 퍼센트를 포맷팅합니다.
 * @param value - 값
 * @param total - 전체
 * @param decimals - 소수점 자릿수 (default: 1)
 * @returns 포맷팅된 퍼센트 문자열 (예: "33.3%")
 */
export function formatPercent(value: number, total: number, decimals: number = 1): string {
  if (total === 0) return '0%'
  const percent = (value / total) * 100
  return `${percent.toFixed(decimals)}%`
}
