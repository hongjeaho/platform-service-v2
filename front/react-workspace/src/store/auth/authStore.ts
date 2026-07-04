import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState, RoleName } from './authStore.type'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      hasRole: roleName => {
        const { user } = get()
        return user?.roles.some(r => r.name === roleName) ?? false
      },
      hasAnyRole: roleNames => {
        const { user } = get()
        return user?.roles.some(r => roleNames.includes(r.name)) ?? false
      },
    }),
    {
      name: 'platform-auth',
      partialize: state => ({ user: state.user, token: state.token }),
    },
  ),
)

// Selectors for optimized re-renders
export const selectUser = (state: AuthState) => state.user
export const selectToken = (state: AuthState) => state.token
export const selectIsAuthenticated = (state: AuthState) => state.user !== null
export const selectHasRole = (roleName: RoleName) => (state: AuthState) => state.hasRole(roleName)
export const selectHasAnyRole = (roleNames: RoleName[]) => (state: AuthState) =>
  state.hasAnyRole(roleNames)
export const selectLogin = (state: AuthState) => state.login
export const selectLogout = (state: AuthState) => state.logout
