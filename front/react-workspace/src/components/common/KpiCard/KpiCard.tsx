import styles from './KpiCard.module.css'
import type { KpiCardProps } from './KpiCard.type'

/**
 * KpiCard 컴포넌트
 *
 * 라벨 + 큰 숫자 + 추세 배지(up/down)로 구성된 대시보드 요약 지표 카드.
 */
export function KpiCard({ label, value, trend }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {trend && (
          <span
            className={`${styles.trend} ${trend.direction === 'up' ? styles.trendUp : styles.trendDown}`}
            data-trend={trend.direction}
          >
            {trend.direction === 'up' ? '▲' : '▼'} {trend.label}
          </span>
        )}
      </div>
    </div>
  )
}
