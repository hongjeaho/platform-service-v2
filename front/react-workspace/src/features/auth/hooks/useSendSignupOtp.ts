import { sendSignupOtp } from '@api/services/otpsService'
import { useMutation } from '@tanstack/react-query'

export function useSendSignupOtp() {
  return useMutation({
    mutationFn: (userEmail: string) => sendSignupOtp(userEmail),
  })
}
