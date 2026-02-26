import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import styles from './Table.module.css'

export interface TableProps {
  /** thead 내용 (tr 또는 여러 tr) */
  header: ReactNode
  /** tbody 내용 (tr 목록) */
  children: ReactNode
  /** 래퍼에 적용할 추가 클래스 */
  className?: string
}

/**
 * Table (레이아웃)
 * 섹션/카드 내 입력·조회용 테이블 구조를 제공합니다.
 * header와 children으로 thead/tbody를 부모가 채우고, th/td에는 tableStyles를 적용하세요.
 */
export function Table({ header, children, className }: TableProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      <table className={styles.table}>
        <thead>{header}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

Table.displayName = 'Table'
