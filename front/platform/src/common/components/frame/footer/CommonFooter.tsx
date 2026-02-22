import * as React from 'react'

import { textCombinations } from '@/constants/design/typography'
import { gap, layouts, padding } from '@/constants/design/spacing'
import { cn } from '@/lib/utils'

/**
 * 공통 푸터 컴포넌트 - V3 디자인 시스템
 * 모든 페이지에 표시되는 하단 푸터
 */
export default function CommonFooter() {
  return (
    <footer className={cn('bg-muted text-card-foreground', 'mt-12')}>
      {/* 메인 푸터 영역 */}
      <div className={padding.cardLg}>
        <h2 className='sr-only'>FOOTER</h2>

        <div className={cn('container', layouts.pageHorizontal)}>
          <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3', gap.loose)}>
            {/* 정보 섹션 */}
            <div>
              <h3 className='sr-only'>정보</h3>

              {/* 정책 링크 */}
              <div className={cn('mb-6')}>
                <a
                  href='/main/policy'
                  className={cn(
                    'text-card-foreground hover:text-muted-foreground transition-colors',
                    textCombinations.bodySm,
                    'mr-4 underline',
                  )}
                  aria-label='개인정보처리방침'
                >
                  개인정보처리방침
                </a>
                <span className='text-muted-foreground'>|</span>
                <a
                  href='/main/call'
                  className={cn(
                    'text-card-foreground hover:text-muted-foreground transition-colors',
                    textCombinations.bodySm,
                    'ml-4 underline',
                  )}
                  aria-label='콜센터'
                >
                  콜센터
                </a>
              </div>

              {/* 연락처 정보 */}
              <div className={cn('space-y-2', textCombinations.bodySm, 'text-muted-foreground')}>
                <div>서울특별시 중구 서소문로 124 (서소문동) 씨티스퀘어빌딩 11층 토지관리과</div>
                <div>
                  HELP DESK : 02-3465-9975 [월~금 10:00~17:00, 점심시간(12:00~13:00) 및 공휴일 제외]
                </div>
                <div>Email : helpdesk@sltis.info</div>
              </div>

              {/* 저작권 정보 */}
              <div className={cn('text-xs text-muted-foreground mt-6')}>
                Copyright © 2018 land.seoul.go.kr. All right reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
