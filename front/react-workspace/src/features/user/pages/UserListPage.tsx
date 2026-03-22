import { Button } from '@components/common/Button'
import { useState } from 'react'

import { UserCard } from '../components/UserCard'
import { useUsers } from '../hooks/useUsers'

export function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set())

  const { data, isLoading, isFetching, isError, refetch } = useUsers()

  const toggleExpand = (userId: number) => {
    setExpandedUsers(prev => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }

  const filteredUsers = data?.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isError) {
    return (
      <div className='text-center py-12'>
        <div className='bg-error/10 border border-error rounded-lg p-6 max-w-md mx-auto'>
          <h3 className='text-lg font-semibold text-error-foreground mb-2'>사용자 로드 실패</h3>
          <p className='text-error mb-4'>사용자 목록을 불러오지 못했습니다. 다시 시도해 주세요.</p>
          <Button onClick={() => refetch()} variant='primary'>
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Users</h1>
        <p className='text-gray-600 mb-6'>
          Browse and search through our user directory. Data fetched from JSONPlaceholder API.
        </p>

        {/* TanStack Query Status Badges */}
        <div className='flex flex-wrap gap-2 mb-6'>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isLoading ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            isLoading: {String(isLoading)}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isFetching ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            isFetching: {String(isFetching)}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isError ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            isError: {String(isError)}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              data ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            Users: {data?.length ?? 0}
          </div>
        </div>

        {/* Search and Refetch */}
        <div className='flex gap-4'>
          <input
            type='text'
            placeholder='이름 또는 이메일로 검색...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='flex-1 px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent'
          />
          <Button onClick={() => refetch()} variant='secondary' disabled={isFetching}>
            {isFetching ? '새로고침 중...' : '새로고침'}
          </Button>
        </div>
      </div>

      {/* User Cards */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
              <div className='h-3 bg-gray-200 rounded w-1/2 mb-4' />
              <div className='h-3 bg-gray-200 rounded w-1/3' />
            </div>
          ))}
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              isExpanded={expandedUsers.has(user.id)}
              onToggle={() => toggleExpand(user.id)}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-12 text-muted-foreground'>검색 결과가 없습니다.</div>
      )}
    </div>
  )
}
