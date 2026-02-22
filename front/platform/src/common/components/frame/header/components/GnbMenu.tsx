import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './GnbMenu.module.css'

interface NavChild {
  label: string
  path: string
  external?: boolean
}

interface NavItem {
  label: string
  path: string
  children: NavChild[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '토지수용제도안내',
    path: '/land/compensation',
    children: [
      { label: '토지수용제도 및 보상금안내', path: '/land/compensation' },
      { label: '수용재결 안내', path: '/land/acceptanceDecision' },
      { label: '수용재결 절차안내', path: '/land/procedure' },
      { label: '서울지방토지 수용위원회', path: '/land/committee' },
      { label: '구별 담당현황', path: '/land/charge' },
      {
        label: '재결정보시스템(LTIS)바로가기',
        path: 'https://oclt.molit.go.kr/USR/WPGE0201/m_36649/DTL.jsp',
        external: true,
      },
    ],
  },
  {
    label: '사업시행자',
    path: '/implementer',
    children: [
      { label: 'LTIS입력정보확인', path: '/implementer/application' },
      { label: '재결신청 의견제출', path: '/implementer/opinion/application' },
    ],
  },
  {
    label: '열람공고',
    path: '/cities',
    children: [{ label: '열람공고 결과등록', path: '/cities/announcement' }],
  },
  {
    label: '감정평가사',
    path: '/appraiser',
    children: [{ label: '재결감정평가 의견등록', path: '/appraiser/application/list' }],
  },
  {
    label: '재결관',
    path: '/decision',
    children: [
      { label: '열람공고 의뢰', path: '/decision/announcement' },
      { label: '심의 안건 검토', path: '/decision/agenda' },
      { label: '경정·협의', path: '/decision/correction/list' },
      { label: '심의서 작성', path: '/decision/register/application' },
      { label: '송달 결과', path: '/board/dispatch/list' },
      { label: '쟁점 의견 검토', path: '/law/list' },
      { label: '심의 기록', path: '/decision/history/list' },
      { label: '통계', path: '/decision/statistics/workStatus' },
    ],
  },
  {
    label: '심의위원',
    path: '/deliberate',
    children: [{ label: '심의안건', path: '/deliberate/agenda' }],
  },
  {
    label: '게시판',
    path: '/board',
    children: [
      { label: '공지사항', path: '/board/notice/list' },
      { label: '묻고답하기', path: '/board/inquiry/list' },
      { label: '법률질의', path: '/board/inquiryLaw/list' },
      { label: '재결례', path: '/board/case/list' },
      { label: '심의목록', path: '/board/result/list' },
    ],
  },
]

export default function GnbMenu() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav} aria-label='주요 메뉴'>
      <ul className={styles.gnb} role='menubar'>
        {NAV_ITEMS.map(item => {
          const isActive = pathname.startsWith(item.path)

          return (
            <li
              key={item.path}
              className={cn(styles.gnbItem, isActive && styles.gnbItemActive)}
              role='none'
            >
              <Link
                to={item.children[0]?.path ?? item.path}
                className={cn(styles.gnbLink, textCombinations.bodySm)}
                role='menuitem'
                aria-haspopup='true'
              >
                {item.label}
              </Link>
              <ul className={styles.lnb} role='menu' aria-label={`${item.label} 하위 메뉴`}>
                {item.children.map(child =>
                  child.external ? (
                    <li key={child.path} role='none'>
                      <a
                        href={child.path}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={cn(styles.lnbLink, textCombinations.bodySm)}
                        role='menuitem'
                      >
                        {child.label}
                      </a>
                    </li>
                  ) : (
                    <li key={child.path} role='none'>
                      <Link
                        to={child.path}
                        className={cn(
                          styles.lnbLink,
                          textCombinations.bodySm,
                          pathname === child.path && styles.lnbLinkActive,
                        )}
                        role='menuitem'
                      >
                        {child.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
