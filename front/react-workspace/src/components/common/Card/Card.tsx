import styles from './Card.module.css'
import type { CardProps } from './Card.type'

/**
 * 공통 Card 컴포넌트
 * 제목/부제/본문/선택적 펼침 영역·토글을 지원하는 재사용 가능한 카드 UI.
 * 디자인 토큰(CSS 변수) 기반으로 다크 모드·테마와 연동됩니다.
 */
export function Card({
  title,
  subtitle,
  children,
  expandableContent,
  isExpanded = false,
  onToggle,
}: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle != null && <div className={styles.subtitle}>{subtitle}</div>}
      </div>

      <div className={styles.body}>{children}</div>

      {isExpanded && expandableContent != null && (
        <div className={styles.expandable}>{expandableContent}</div>
      )}

      {onToggle != null && (
        <button
          type='button'
          onClick={onToggle}
          className={styles.toggleButton}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show less' : 'Show details'}
        </button>
      )}
    </div>
  )
}
