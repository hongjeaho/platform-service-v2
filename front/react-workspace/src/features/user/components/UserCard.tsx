import { Card } from '@components/common/Card'

import type { User } from '../types/user.type'

interface UserCardProps {
  user: User
  isExpanded?: boolean
  onToggle?: () => void
}

export function UserCard({ user, isExpanded = false, onToggle }: UserCardProps) {
  return (
    <Card
      title={user.name}
      subtitle={
        <>
          <p>{user.email}</p>
          <p>@{user.username}</p>
        </>
      }
      isExpanded={isExpanded}
      onToggle={onToggle}
      expandableContent={
        <>
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
        </>
      }
    >
      <p>{user.company.name}</p>
    </Card>
  )
}
