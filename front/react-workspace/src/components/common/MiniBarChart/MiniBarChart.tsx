import styles from './MiniBarChart.module.css'
import type { MiniBarChartProps } from './MiniBarChart.type'

/**
 * MiniBarChart 컴포넌트
 *
 * 값 배열을 상대 높이 막대로 렌더링하는 대시보드용 미니 위젯.
 * 최댓값 막대는 프라이머리 색상으로 강조됩니다.
 */
export function MiniBarChart({ title, data }: MiniBarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.bars}>
        {data.map(d => (
          <div
            key={d.label}
            className={`${styles.bar} ${d.value === max ? styles.barHighlight : ''}`}
            style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
            role='img'
            aria-label={`${d.label}: ${d.value}`}
          />
        ))}
      </div>
      <div className={styles.labels}>
        {data.map(d => (
          <span key={d.label} className={styles.labelItem}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
