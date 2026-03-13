import type { Meta, StoryObj } from '@storybook/react'

import type { User } from '../types/user.type'
import { UserCard } from './UserCard'

const meta: Meta<typeof UserCard> = {
  title: 'Features/User/UserCard',
  component: UserCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: 'object',
      description: 'User object to display',
    },
    isExpanded: {
      control: 'boolean',
      description: 'Show expanded details',
    },
    onToggle: { action: 'toggled' },
  },
}

export default meta
type Story = StoryObj<typeof UserCard>

const mockUser: User = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  address: {
    street: 'Kulas Light',
    city: 'Gwenborough',
    zipcode: '92998-3874',
  },
  company: {
    name: 'Romaguera-Crona',
  },
}

export const Default: Story = {
  args: {
    user: mockUser,
    isExpanded: false,
  },
}

export const Expanded: Story = {
  args: {
    user: mockUser,
    isExpanded: true,
  },
}

export const WithoutToggle: Story = {
  args: {
    user: mockUser,
    isExpanded: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'UserCard without toggle functionality - displays basic info only',
      },
    },
  },
}

export const Interactive: Story = {
  args: {
    user: mockUser,
    isExpanded: false,
    onToggle: () => console.log('Toggle clicked'),
  },
  parameters: {
    controls: { expanded: true },
  },
}

export const MultipleUsers: Story = {
  render: () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
        address: {
          street: 'Kulas Light',
          city: 'Gwenborough',
          zipcode: '92998-3874',
        },
        company: {
          name: 'Romaguera-Crona',
        },
      },
      {
        id: 2,
        name: 'Ervin Howell',
        username: 'Antonette',
        email: 'Shanna@melissa.tv',
        phone: '010-692-6593 x09125',
        website: 'anastasia.net',
        address: {
          street: 'Victor Plains',
          city: 'Wisokyburgh',
          zipcode: '90566-7771',
        },
        company: {
          name: 'Deckow-Crist',
        },
      },
      {
        id: 3,
        name: 'Clementine Bauch',
        username: 'Samantha',
        email: 'Nathan@yesenia.net',
        phone: '1-463-123-4447',
        website: 'ramiro.info',
        address: {
          street: 'Douglas Extension',
          city: 'McKenziehaven',
          zipcode: '59590-4157',
        },
        company: {
          name: 'Romaguera-Jacobson',
        },
      },
    ]

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {mockUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    )
  },
  parameters: {
    layout: 'padded',
  },
}

export const LoadingState: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
          <div className='h-3 bg-gray-200 rounded w-1/2 mb-4' />
          <div className='h-3 bg-gray-200 rounded w-1/3' />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const ErrorState: Story = {
  render: () => (
    <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
      <h3 className='text-lg font-semibold text-red-800 mb-2'>Error Loading User</h3>
      <p className='text-red-600'>Failed to fetch user data. Please try again.</p>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
}
