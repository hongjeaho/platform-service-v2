import type { AuthRequest } from '@api/generated/model'
import { login } from '@api/services/authService'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  return useMutation({
    mutationFn: (authRequest: AuthRequest) => login(authRequest),
  })
}
