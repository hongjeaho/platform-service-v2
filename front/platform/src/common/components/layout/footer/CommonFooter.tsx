import * as React from 'react'

import { cn } from '@/lib/utils'

interface CommonFooterProps {}

/**
 * 공통 푸터 컴포넌트 - V3 디자인 시스템
 * 모든 페이지에 표시되는 하단 푸터
 */
const CommonFooter: React.FC<CommonFooterProps> = () => {
  return (
    <footer className='bg-gray-800 text-white mt-12'>
      {/* 메인 푸터 영역 */}
      <div className='py-8'>
        <h2 className='sr-only'>FOOTER</h2>

        <div className='container px-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* 정보 섹션 */}
            <div>
              <h3 className='sr-only'>정보</h3>

              {/* 정책 링크 */}
              <div className='mb-6'>
                <a
                  href='/main/policy'
                  className='text-white hover:text-gray-300 transition-colors text-sm mr-4 underline'
                >
                  개인정보처리방침
                </a>
                <span className='text-gray-400'>|</span>
                <a
                  href='/main/call'
                  className='text-white hover:text-gray-300 transition-colors text-sm ml-4 underline'
                >
                  콜센터
                </a>
              </div>

              {/* 연락처 정보 - V3 스타일 */}
              <div className='space-y-2 text-sm text-gray-300'>
                <div>서울특별시 중구 서소문로 124 (서소문동) 씨티스퀘어빌딩 11층 토지관리과</div>
                <div>
                  HELP DESK : 02-3465-9975 [월~금 10:00~17:00, 점심시간(12:00~13:00) 및 공휴일 제외]
                </div>
                <div>Email : helpdesk@sltis.info</div>
              </div>

              {/* 저작권 정보 */}
              <div className='text-xs text-gray-400 mt-6'>
                Copyright © 2018 land.seoul.go.kr. All right reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CommonFooter
