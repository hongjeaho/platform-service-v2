import styles from './ActivityFeed.module.css'
import type { ActivityFeedProps, ActivityTone } from './ActivityFeed.type'

const toneClasses: Record<ActivityTone, string> = {
  success: styles.toneSuccess,
  info: styles.toneInfo,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  muted: styles.toneMuted,
}

/**
 * ActivityFeed 컴포넌트
 *
 * 톤별 색상 점 + 텍스트 + 상대 시간으로 구성된 최근 활동 목록 위젯.
 */
export function ActivityFeed({ title, items }: ActivityFeedProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <ul className={styles.list}>
        {items.map(item => (
          <li key={item.id} className={styles.item}>
            <span className={`${styles.dot} ${toneClasses[item.tone]}`} aria-hidden='true' />
            <div>
              <div className={styles.text}>{item.text}</div>
              <div className={styles.time}>{item.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
