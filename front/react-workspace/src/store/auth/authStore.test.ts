import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({ user: null, isAuthenticated: false })
  })

  it('has initial state with null user and not authenticated', () => {
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('sets user and authenticated to true on login', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
    useAuthStore.getState().login(mockUser)

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toEqual(mockUser)
    expect(isAuthenticated).toBe(true)
  })

  it('clears user and sets authenticated to false on logout', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
    useAuthStore.getState().login(mockUser)

    useAuthStore.getState().logout()

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('allows multiple login/logout cycles', () => {
    const user1 = { id: 1, name: 'User 1', email: 'user1@example.com' }
    const user2 = { id: 2, name: 'User 2', email: 'user2@example.com' }

    useAuthStore.getState().login(user1)
    expect(useAuthStore.getState().user).toEqual(user1)

    useAuthStore.getState().logout()
    expect(useAuthStore.getState().user).toBeNull()

    useAuthStore.getState().login(user2)
    expect(useAuthStore.getState().user).toEqual(user2)
  })
})
