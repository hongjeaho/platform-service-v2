export interface SignupFormProps {
  /**
   * 아이디 중복확인. resolve(true)면 사용 가능, resolve(false)면 중복.
   */
  onCheckUserId: (userId: string) => Promise<boolean>
}
