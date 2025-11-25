import * as React from 'react'

interface CommonFooterProps {}

const CommonFooter: React.FC<CommonFooterProps> = () => {
  return (
    <footer className='bg-gray-200'>
      {/* 메인 푸터 영역 */}
      <div className='bg-gray-100 py-8 justify-start'>
        <h2 className='sr-only'>FOOTER</h2>

        <div className='px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* 정보 섹션 */}
            <div>
              <h3 className='sr-only'>정보</h3>

              {/* 정책 링크 */}
              <div className='mb-6'>
                <a
                  href='/main/policy'
                  className='text-blue-600 hover:text-blue-800 transition-colors text-sm mr-4'
                >
                  개인정보처리방침
                </a>
                <span className='text-gray-400'>|</span>
                <a
                  href='/main/call'
                  className='text-blue-600 hover:text-blue-800 transition-colors text-sm ml-4'
                >
                  콜센터
                </a>
              </div>

              {/* 연락처 정보 */}
              <div className='space-y-3 text-sm text-gray-700'>
                <div>서울특별시 중구 서소문로 124 (서소문동) 씨티스퀘어빌딩 11층 토지관리과</div>
                <div>
                  HELP DESK : 02-3465-9975 [월~금 10:00~17:00, 점심시간(12:00~13:00) 및 공휴일 제외]
                </div>
                <div>Email : helpdesk@sltis.info</div>
              </div>

              {/* 저작권 정보 */}
              <div className='text-xs text-gray-500 mt-6'>
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
