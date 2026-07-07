export interface LoginFormValues {
  id: string
  password: string
}

export interface LoginFormProps {
  /** 검증을 통과한 값으로 제출 시 호출된다 */
  onSubmit: (values: LoginFormValues) => void
  /** 제출(mutation) 진행 중 여부 — true면 제출 버튼이 비활성화된다 */
  isSubmitting: boolean
  /** 서버에서 내려온 에러 메시지(예: 401 인증 실패) — 폼 상단 배너로 표시 */
  errorMessage?: string | null
}
