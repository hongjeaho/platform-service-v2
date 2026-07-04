export type RoleName = 'ADMIN' | 'MANAGER' | 'MD' | 'USER'

export interface Role {
  id: number
  name: RoleName
}

export interface User {
  id: number
  name: string
  email: string
  roles: Role[]
}

export interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  hasRole: (roleName: RoleName) => boolean
  hasAnyRole: (roleNames: RoleName[]) => boolean
}
