import { AuthLayout } from '@components/layout/AuthLayout'

import styles from './PasswordResetPage.module.css'

/**
 * 비밀번호 재설정 페이지 — 최소 스켈레톤(제목만).
 *
 * 실제 폼 로직은 별도 후속 작업에서 구현한다.
 * React Router lazy 로딩 컨벤션에 따라 `Component`로 export한다.
 */
export function Component() {
  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1>비밀번호 재설정</h1>
      </div>
    </AuthLayout>
  )
}
