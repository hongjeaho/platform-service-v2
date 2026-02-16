/**
 * Table Storybook용 샘플 데이터
 */

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

export const sampleData: User[] = [
  {
    id: 1,
    name: '김준호',
    email: 'kim@example.com',
    role: '관리자',
    status: 'active',
  },
  {
    id: 2,
    name: '이순신',
    email: 'lee@example.com',
    role: '사용자',
    status: 'active',
  },
  {
    id: 3,
    name: '박영희',
    email: 'park@example.com',
    role: '편집자',
    status: 'inactive',
  },
  {
    id: 4,
    name: '정민수',
    email: 'jung@example.com',
    role: '사용자',
    status: 'active',
  },
  {
    id: 5,
    name: '최지혜',
    email: 'choi@example.com',
    role: '관리자',
    status: 'inactive',
  },
]

export const tableColumns = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'name', header: '이름', width: '120px' },
  { key: 'email', header: '이메일' },
  { key: 'role', header: '역할', width: '100px' },
  { key: 'status', header: '상태', width: '100px' },
] as const

/**
 * 페이지네이션 스토리용 대량 데이터 생성 (100개)
 */
export function createLargeUserData(count = 100): User[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `사용자${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: ['관리자', '사용자', '편집자'][index % 3],
    status: (index % 2 === 0 ? 'active' : 'inactive') as 'active' | 'inactive',
  }))
}
