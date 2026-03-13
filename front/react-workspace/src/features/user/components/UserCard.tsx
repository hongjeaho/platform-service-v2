import type { User } from '../types/user.type'

interface UserCardProps {
  user: User
  isExpanded?: boolean
  onToggle?: () => void
}

export function UserCard({ user, isExpanded = false, onToggle }: UserCardProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>{user.name}</h3>
        <p className='text-sm text-gray-600'>{user.email}</p>
        <p className='text-sm text-indigo-600'>@{user.username}</p>
      </div>

      <div className='text-sm text-gray-600 mb-4'>
        <p className='font-medium text-gray-900'>{user.company.name}</p>
      </div>

      {isExpanded && (
        <div className='pt-4 border-t border-gray-200 space-y-2 text-sm'>
          <div>
            <span className='font-medium text-gray-900'>Phone:</span>{' '}
            <span className='text-gray-600'>{user.phone}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Website:</span>{' '}
            <span className='text-indigo-600'>{user.website}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Address:</span>{' '}
            <span className='text-gray-600'>
              {user.address.street}, {user.address.city} {user.address.zipcode}
            </span>
          </div>
        </div>
      )}

      {onToggle && (
        <button
          onClick={onToggle}
          className='mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium'
        >
          {isExpanded ? 'Show less' : 'Show details'}
        </button>
      )}
    </div>
  )
}
