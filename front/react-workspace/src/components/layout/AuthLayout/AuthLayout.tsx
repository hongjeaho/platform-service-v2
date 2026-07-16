import { brand } from '@/config/brand'

import styles from './AuthLayout.module.css'
import type { AuthLayoutProps } from './AuthLayout.type'

/**
 * 로그인/회원가입/비밀번호 재설정 등 인증 전 화면 전용 셸.
 *
 * AppShell(사이드바/톱바) 밖에서 동작하며, 중앙 정렬 카드 안에 페이지별 콘텐츠를 렌더링한다.
 * 브랜드 마크(사각 배지 + 워드마크)는 Sidebar와 동일한 조합을 재사용해 로그인 전/후
 * 화면의 시각적 연속성을 유지한다.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden='true' />
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>{brand.mark}</span>
          <span className={styles.brandName}>{brand.label}</span>
        </div>
        {children}
      </div>
    </div>
  )
}
