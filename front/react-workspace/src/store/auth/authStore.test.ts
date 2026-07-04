import { beforeEach, describe, expect, it } from 'vitest'

import {
  selectHasAnyRole,
  selectHasRole,
  selectIsAuthenticated,
  selectLogin,
  selectLogout,
  selectUser,
  useAuthStore,
} from './authStore'
import type { RoleName } from './authStore.type'

describe('authStore', () => {
  const mockRoles = [
    { id: 1, name: 'USER' as RoleName },
    { id: 2, name: 'MANAGER' as RoleName },
  ]

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    roles: mockRoles,
  }

  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null })
  })

  it('has initial state with null user, null token and not authenticated', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(selectIsAuthenticated(state)).toBe(false)
  })

  it('sets user and token on login', () => {
    const mockToken = 'mock-jwt-token'
    useAuthStore.getState().login(mockUser, mockToken)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(selectIsAuthenticated(state)).toBe(true)
  })

  it('clears user and token on logout', () => {
    const mockToken = 'mock-jwt-token'
    useAuthStore.getState().login(mockUser, mockToken)
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(selectIsAuthenticated(state)).toBe(false)
  })

  it('allows multiple login/logout cycles', () => {
    const user1 = { ...mockUser, id: 1, email: 'user1@example.com' }
    const user2 = { ...mockUser, id: 2, email: 'user2@example.com' }

    useAuthStore.getState().login(user1, 'token1')
    expect(useAuthStore.getState().user).toEqual(user1)
    expect(useAuthStore.getState().token).toBe('token1')

    useAuthStore.getState().logout()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()

    useAuthStore.getState().login(user2, 'token2')
    expect(useAuthStore.getState().user).toEqual(user2)
    expect(useAuthStore.getState().token).toBe('token2')
  })

  it('hasRole returns true when user has the role', () => {
    useAuthStore.getState().login(mockUser, 'token')

    expect(useAuthStore.getState().hasRole('USER')).toBe(true)
    expect(useAuthStore.getState().hasRole('MANAGER')).toBe(true)
    expect(useAuthStore.getState().hasRole('ADMIN')).toBe(false)
  })

  it('hasAnyRole returns true when user has any of the roles', () => {
    useAuthStore.getState().login(mockUser, 'token')

    expect(useAuthStore.getState().hasAnyRole(['USER', 'ADMIN'])).toBe(true)
    expect(useAuthStore.getState().hasAnyRole(['ADMIN', 'MD'])).toBe(false)
  })

  it('hasRole and hasAnyRole return false when user is null', () => {
    expect(useAuthStore.getState().hasRole('USER')).toBe(false)
    expect(useAuthStore.getState().hasAnyRole(['USER', 'ADMIN'])).toBe(false)
  })
})

describe('authStore selectors', () => {
  const mockRoles = [
    { id: 1, name: 'USER' as RoleName },
    { id: 2, name: 'MANAGER' as RoleName },
  ]

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    roles: mockRoles,
  }

  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null })
  })

  it('selectUser는 현재 user를 반환한다', () => {
    useAuthStore.getState().login(mockUser, 'token')
    expect(selectUser(useAuthStore.getState())).toEqual(mockUser)
  })

  it('selectIsAuthenticated는 user가 null일 때 false를 반환한다', () => {
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)
  })

  it('selectIsAuthenticated는 user가 있을 때 true를 반환한다', () => {
    useAuthStore.getState().login(mockUser, 'token')
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true)
  })

  it('selectHasRole은 역할 체크 함수를 반환한다', () => {
    useAuthStore.getState().login(mockUser, 'token')
    const hasUserRole = selectHasRole('USER')(useAuthStore.getState())
    expect(hasUserRole).toBe(true)

    const hasAdminRole = selectHasRole('ADMIN')(useAuthStore.getState())
    expect(hasAdminRole).toBe(false)
  })

  it('selectHasAnyRole은 다중 역할 체크 함수를 반환한다', () => {
    useAuthStore.getState().login(mockUser, 'token')
    const hasAnyRole = selectHasAnyRole(['USER', 'ADMIN'])(useAuthStore.getState())
    expect(hasAnyRole).toBe(true)

    const hasNoneRole = selectHasAnyRole(['ADMIN', 'MD'])(useAuthStore.getState())
    expect(hasNoneRole).toBe(false)
  })

  it('selectLogin은 login 함수를 반환한다', () => {
    const login = selectLogin(useAuthStore.getState())
    expect(login).toBeTypeOf('function')
    login(mockUser, 'token')
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true)
  })

  it('selectLogout은 logout 함수를 반환한다', () => {
    useAuthStore.getState().login(mockUser, 'token')
    const logout = selectLogout(useAuthStore.getState())
    expect(logout).toBeTypeOf('function')
    logout()
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)
  })
})
