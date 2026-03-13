import { create } from 'zustand'

import type { AuthState } from './authStore.type'

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  login: user => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

// Selectors for optimized re-renders
export const selectUser = (state: AuthState) => state.user
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
