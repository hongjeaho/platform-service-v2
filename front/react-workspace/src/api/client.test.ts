import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/store/auth/authStore'

import { extractRenewedToken, handleAuthResponse } from './client'

function fakeResponse(url: string, authorization?: string): AxiosResponse {
  return {
    headers: authorization ? { authorization } : {},
    config: { url },
  } as unknown as AxiosResponse
}

describe('extractRenewedToken', () => {
  it('returns the token when the authorization header is present', () => {
    expect(extractRenewedToken({ authorization: 'renewed-token' })).toBe('renewed-token')
  })

  it('returns undefined when the authorization header is absent', () => {
    expect(extractRenewedToken({})).toBeUndefined()
  })

  it('returns undefined when the authorization header is an empty string', () => {
    expect(extractRenewedToken({ authorization: '' })).toBeUndefined()
  })
})

describe('handleAuthResponse', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null })
  })

  it('renews the store token when an authenticated response carries a renewed token', () => {
    useAuthStore.setState({ token: 'old-token' })

    handleAuthResponse(fakeResponse('/api/users', 'new-token'))

    expect(useAuthStore.getState().token).toBe('new-token')
  })

  it('does not renew the store token for /api/public/** responses', () => {
    useAuthStore.setState({ token: 'old-token' })

    handleAuthResponse(fakeResponse('/api/public/auth', 'initial-login-token'))

    expect(useAuthStore.getState().token).toBe('old-token')
  })
})
