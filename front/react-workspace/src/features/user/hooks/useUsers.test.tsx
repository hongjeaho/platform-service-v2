import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { userService } from '../../../api/services/userService'
import type { User } from '../types/user.type'
import { useUsers } from './useUsers'

// Mock userService
vi.mock('../../../api/services/userService', () => ({
  userService: {
    getAll: vi.fn(),
  },
}))

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
]

function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches users successfully', async () => {
    vi.mocked(userService.getAll).mockResolvedValue(mockUsers)

    const { result } = renderHook(() => useUsers(), {
      wrapper: createQueryClientWrapper(),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for the promise to resolve and state to update
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUsers)
    expect(userService.getAll).toHaveBeenCalledTimes(1)
  })

  it('handles errors gracefully', async () => {
    vi.mocked(userService.getAll).mockRejectedValue(new Error('Failed to fetch'))

    const { result } = renderHook(() => useUsers(), {
      wrapper: createQueryClientWrapper(),
    })

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeTruthy()
  })

  it('returns loading state while fetching', () => {
    vi.mocked(userService.getAll).mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useUsers(), {
      wrapper: createQueryClientWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })
})
