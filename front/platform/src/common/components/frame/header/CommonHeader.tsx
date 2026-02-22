import { Link } from 'react-router-dom'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './CommonHeader.module.css'
import GnbMenu from './components/GnbMenu'
import UserMenu from './components/UserMenu'

/**
 * 공통 헤더 컴포넌트 - V3 디자인 시스템
 * 로고 + GNB 메뉴 + 유저 메뉴로 구성된 상단 헤더
 */
export default function CommonHeader() {
  return (
    <header className={cn(styles.header, 'fixed top-0 left-0 right-0 z-40')}>
      <div className={cn(styles.inner, 'container')}>
        <Link to='/' className={styles.logo} aria-label='심의지원 시스템 홈'>
          <h1 className={cn(textCombinations.h4, 'text-primary whitespace-nowrap')}>
            심의지원 시스템
          </h1>
        </Link>

        <div className={styles.gnbArea}>
          <GnbMenu />
        </div>

        <div className={styles.userArea}>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
