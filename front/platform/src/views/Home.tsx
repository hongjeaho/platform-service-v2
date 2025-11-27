import { BookOpen, CheckCircle, DollarSign, FileText, Gavel, Settings } from 'lucide-react'

import { iconSizes } from '@/lib/design-tokens'

/**
 * 홈 페이지 컴포넌트입니다.
 * 로그인 후 사용자가 보는 대시보드/홈 페이지입니다.
 */
export default function Home() {
  const menuItems = [
    {
      title: '접수관리',
      description: '토지보상 신청 접수 관리',
      icon: FileText,
    },
    {
      title: '심의관리',
      description: '심의 위원회 관리',
      icon: Gavel,
    },
    {
      title: '결론관리',
      description: '결론 및 의결 관리',
      icon: CheckCircle,
    },
    {
      title: '참고자료',
      description: '판례, 선례 등 참고자료',
      icon: BookOpen,
    },
    {
      title: '공시지가',
      description: 'KAPA 공시지가 조회',
      icon: DollarSign,
    },
    {
      title: '관리자',
      description: '시스템 관리 메뉴',
      icon: Settings,
    },
  ]

  return (
    <div className='space-y-8'>
      {/* 페이지 헤더 */}
      <div>
        <h2 className='text-3xl font-bold text-foreground'>대시보드</h2>
        <p className='mt-2 text-muted-foreground'>
          정부 토지보상 심의 시스템에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 주요 메뉴 카드들 */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className='rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer'
            >
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Icon className={`${iconSizes.lg} text-primary`} />
              </div>
              <h3 className='text-lg font-semibold text-card-foreground'>{item.title}</h3>
              <p className='mt-2 text-sm text-muted-foreground'>{item.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
