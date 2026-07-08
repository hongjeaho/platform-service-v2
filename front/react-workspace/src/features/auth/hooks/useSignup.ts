import type { UsersSignupRequest } from '@api/generated/model'
import { signup } from '@api/services/usersService'
import { useMutation } from '@tanstack/react-query'

export function useSignup() {
  return useMutation({
    mutationFn: (request: UsersSignupRequest) => signup(request),
  })
}
