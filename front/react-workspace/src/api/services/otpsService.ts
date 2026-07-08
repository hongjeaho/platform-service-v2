import { apiClient } from '@api/client'

/**
 * 회원가입용 이메일 인증(OTP)을 발송한다. 이미 가입된 이메일이면 서버가 409를 반환하며
 * 그대로 reject된다 — 사전조건(미가입 확인)은 서버(UsersService.sendSignupOtp)가 소유한다.
 */
export async function sendSignupOtp(userEmail: string): Promise<void> {
  await apiClient.post('/api/public/otps', { userEmail, purpose: 'SIGNUP' })
}
