/**
 * 홈 페이지 컴포넌트입니다.
 * 로그인 후 사용자가 보는 대시보드/홈 페이지입니다.
 */
export default function Home() {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900'>대시보드</h2>
        <p className='mt-2 text-gray-600'>정부 토지보상 심의 시스템에 오신 것을 환영합니다.</p>
      </div>

      {/* 주요 메뉴 카드들 */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[
          { title: '접수관리', description: '토지보상 신청 접수 관리', icon: '📋' },
          { title: '심의관리', description: '심의 위원회 관리', icon: '⚖️' },
          { title: '결론관리', description: '결론 및 의결 관리', icon: '📝' },
          { title: '참고자료', description: '판례, 선례 등 참고자료', icon: '📚' },
          { title: '공시지가', description: 'KAPA 공시지가 조회', icon: '💰' },
          { title: '관리자', description: '시스템 관리 메뉴', icon: '⚙️' },
        ].map(item => (
          <div
            key={item.title}
            className='rounded-lg border border-gray-200 bg-white p-6 shadow transition hover:shadow-lg'
          >
            <div className='text-4xl'>{item.icon}</div>
            <h3 className='mt-4 text-lg font-semibold text-gray-900'>{item.title}</h3>
            <p className='mt-2 text-sm text-gray-600'>{item.description}</p>
            <div className='text-4xl'>{item.icon}</div>
            <h3 className='mt-4 text-lg font-semibold text-gray-900'>{item.title}</h3>
            <p className='mt-2 text-sm text-gray-600'>{item.description}</p>
            <div className='text-4xl'>{item.icon}</div>
            <h3 className='mt-4 text-lg font-semibold text-gray-900'>{item.title}</h3>
            <p className='mt-2 text-sm text-gray-600'>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
