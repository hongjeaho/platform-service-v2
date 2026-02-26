/**
 * 숫자 포맷팅 유틸리티
 * 총물량조서, 감정평가액 등 금액/숫자 표시에 사용
 */

/**
 * 숫자를 한국어 로케일 천 단위 구분 포맷으로 변환
 * @example formatCurrency(1234567) => "1,234,567"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value)
}

/**
 * 포맷된 문자열(쉼표 등)에서 숫자만 추출하여 파싱
 * @example parseCurrency("1,234,567") => 1234567
 */
export function parseCurrency(value: string): number {
  if (value == null || value === '') return 0
  const cleaned = String(value).replace(/[^0-9.-]/g, '')
  const num = Number(cleaned)
  return Number.isNaN(num) ? 0 : num
}
