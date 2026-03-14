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
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
          <h3 className='text-lg font-semibold text-red-800 mb-2'>Error Loading Users</h3>
          <p className='text-red-600 mb-4'>Failed to fetch users. Please try again.</p>
          <Button onClick={() => refetch()} variant='primary'>
            Retry
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
            placeholder='Search by name or email...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          />
          <Button onClick={() => refetch()} variant='secondary' disabled={isFetching}>
            {isFetching ? 'Refreshing...' : 'Refetch'}
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
        <div className='text-center py-12 text-gray-500'>No users found matching your search.</div>
      )}
    </div>
  )
}
