export interface SignupFormProps {
  /**
   * 아이디 중복확인. resolve(true)면 사용 가능, resolve(false)면 중복.
   */
  onCheckUserId: (userId: string) => Promise<boolean>

  /**
   * 이메일 인증번호(OTP) 발송. resolve되면 발송 성공, reject되면 실패(예: 이미 가입된 이메일).
   */
  onSendOtp: (userEmail: string) => Promise<void>
}
