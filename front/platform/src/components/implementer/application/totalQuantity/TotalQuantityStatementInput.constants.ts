/**
 * 총물량조서 입력 컴포넌트 상수
 * Phase 1.4: 정적 상수 추출 (성능 최적화)
 */
import type { QuantityRow } from '../types'

export const ROWS = [
  { key: 'land' as const, label: '토 지' },
  { key: 'object' as const, label: '물건' },
  { key: 'goodwill' as const, label: '영업권' },
  { key: 'etc' as const, label: '기타' },
] as const

export const ROW_HAS_AREA = {
  land: true,
  object: false,
  goodwill: false,
  etc: true,
} as const

export const EMPTY_ROW: QuantityRow = {
  totalCnt: '',
  totalPrice: '',
  conferCnt: '',
  conferPrice: '',
  decisionCnt: '',
  decisionPrice: '',
}
