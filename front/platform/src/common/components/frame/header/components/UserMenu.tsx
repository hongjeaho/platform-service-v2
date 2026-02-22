import * as React from 'react'
import { Link } from 'react-router-dom'

import { textCombinations } from '@/constants/design/typography'
import { useAuth } from '@/common/hooks/auth/useAuth'
import { cn } from '@/lib/utils'

import styles from './UserMenu.module.css'

export default function UserMenu() {
  const { userData, logout } = useAuth()

  return (
    <ul className={styles.userMenu} aria-label='사용자 메뉴'>
      {userData && (
        <li>
          <span className={cn(styles.welcome, textCombinations.bodySm)}>
            {userData.userId}님 환영합니다!
          </span>
        </li>
      )}
      <li>
        <Link to='/member/mypage' className={cn(styles.menuLink, textCombinations.bodySm)}>
          마이페이지
        </Link>
      </li>
      <li>
        <button
          type='button'
          className={cn(styles.logoutButton, textCombinations.bodySm)}
          onClick={logout}
        >
          로그아웃
        </button>
      </li>
    </ul>
  )
}
