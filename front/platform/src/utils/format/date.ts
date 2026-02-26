import { format } from 'date-fns'

/**
 * 협의 내역 등 날짜 필드 표시/제출용 포맷 (yyyy.MM.dd)
 * FormDatePicker 값(Date)을 API/화면용 문자열로 변환할 때 사용
 */
export function formatConsultationDate(value: string | Date | null | undefined): string {
  if (value == null || value === '') return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return format(date, 'yyyy.MM.dd')
}
