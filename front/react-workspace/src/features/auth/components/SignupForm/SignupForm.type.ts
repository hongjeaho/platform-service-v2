export interface SignupFormProps {
  /**
   * 아이디 중복확인. resolve(true)면 사용 가능, resolve(false)면 중복.
   */
  onCheckUserId: (userId: string) => Promise<boolean>

  /**
   * 이메일 인증번호(OTP) 발송. resolve되면 발송 성공, reject되면 실패(예: 이미 가입된 이메일).
   */
  onSendOtp: (userEmail: string) => Promise<void>

  /**
   * 회원가입 최종 제출.
   */
  onSubmit: (values: {
    userId: string
    userName: string
    password: string
    userEmail: string
    otpCode: string
  }) => void

  /**
   * 제출 진행 중 여부 (제출 버튼 비활성화/로딩 표시).
   */
  isSubmitting: boolean

  /**
   * 제출 실패 메시지 (있으면 폼 상단 배너로 표시).
   */
  errorMessage?: string
}
