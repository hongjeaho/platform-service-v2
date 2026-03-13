import type { User } from '../../features/user/types/user.type'
import { apiClient } from '../client'

export const userService = {
  getAll: (): Promise<User[]> => apiClient.get('/users').then(res => res.data),

  getById: (id: number): Promise<User> => apiClient.get(`/users/${id}`).then(res => res.data),
}
