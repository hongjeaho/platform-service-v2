import { checkUserIdAvailability } from '@api/services/usersService'
import { useMutation } from '@tanstack/react-query'

export function useCheckUserId() {
  return useMutation({
    mutationFn: (userId: string) => checkUserIdAvailability(userId),
  })
}
