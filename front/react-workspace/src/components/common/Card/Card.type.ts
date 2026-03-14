import type { ReactNode } from 'react'

/**
 * 공통 Card 컴포넌트 Props
 * 제목/부제/본문/펼침 영역/토글을 지원하는 재사용 가능한 카드 UI
 */
export interface CardProps {
  /** 카드 제목 */
  title: ReactNode
  /** 헤더 부가 정보 (이메일, 부가 텍스트 등) */
  subtitle?: ReactNode
  /** 본문 콘텐츠 */
  children: ReactNode
  /** 펼쳤을 때만 보이는 영역 */
  expandableContent?: ReactNode
  /** 펼침 여부 */
  isExpanded?: boolean
  /** 있으면 "Show details" / "Show less" 버튼 노출 */
  onToggle?: () => void
}
