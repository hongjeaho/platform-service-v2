import { beforeEach, describe, expect, it } from 'vitest'

import {
  selectIsAuthenticated,
  selectLogin,
  selectLogout,
  selectUser,
  useAuthStore,
} from './authStore'

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

describe('authStore selectors', () => {
  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }

  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false })
  })

  it('selectUser는 현재 user를 반환한다', () => {
    useAuthStore.getState().login(mockUser)
    expect(selectUser(useAuthStore.getState())).toEqual(mockUser)
  })

  it('selectIsAuthenticated는 인증 상태를 반환한다', () => {
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)
    useAuthStore.getState().login(mockUser)
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true)
  })

  it('selectLogin은 login 함수를 반환한다', () => {
    const login = selectLogin(useAuthStore.getState())
    expect(login).toBeTypeOf('function')
    login(mockUser)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('selectLogout은 logout 함수를 반환한다', () => {
    useAuthStore.getState().login(mockUser)
    const logout = selectLogout(useAuthStore.getState())
    expect(logout).toBeTypeOf('function')
    logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
