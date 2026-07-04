export interface MiniBarChartDatum {
  /**
   * 막대 아래 표시할 라벨 (예: '월')
   */
  label: string
  /**
   * 막대 값 — 데이터 내 최댓값 대비 상대 높이로 렌더링됩니다.
   */
  value: number
}

export interface MiniBarChartProps {
  /**
   * 위젯 제목 (예: '주간 처리 현황')
   */
  title: string
  data: MiniBarChartDatum[]
}
