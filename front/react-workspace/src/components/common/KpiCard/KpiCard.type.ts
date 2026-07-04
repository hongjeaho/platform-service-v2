export type KpiTrendDirection = 'up' | 'down'

export interface KpiTrend {
  /**
   * 추세 방향 — up은 success 톤, down은 danger 톤 배지로 렌더링됩니다.
   */
  direction: KpiTrendDirection
  /**
   * 배지에 표시할 값 (예: '12%')
   */
  label: string
}

export interface KpiCardProps {
  /**
   * 지표 라벨 (예: '전체 신청')
   */
  label: string
  /**
   * 지표 값 (예: '128건')
   */
  value: string | number
  /**
   * 추세 배지 — 미전달 시 표시하지 않음
   */
  trend?: KpiTrend
}
