/**
 * 단일 파일 Upload 컴포넌트 Props
 */
export interface UploadProps {
  /** 선택된 파일 */
  value?: File | null
  /** 파일 변경 콜백 */
  onChange?: (file: File | null) => void
  /** 허용되는 파일 타입 (예: '.pdf,.docx' 또는 'image/*') */
  accept?: string
  /** 최대 파일 크기 (바이트 단위, 예: 5 * 1024 * 1024 = 5MB) */
  maxSize?: number
  /** 비활성화 여부 */
  disabled?: boolean
  /** 에러 메시지 */
  error?: string
  /** 라벨 */
  label?: string
  /** 플레이스홀더 텍스트 */
  placeholder?: string
  /** 필수 여부 */
  required?: boolean
  /** 입력 필드의 name 속성 */
  name?: string
  /** CSS 클래스 */
  className?: string
  /** 레이아웃 변형 */
  variant?: 'default' | 'compact'
}

/**
 * 멀티 파일 Upload 컴포넌트 Props
 */
export interface UploadMultiProps {
  /** 선택된 파일 배열 */
  value?: File[]
  /** 파일 변경 콜백 */
  onChange?: (files: File[]) => void
  /** 허용되는 파일 타입 */
  accept?: string
  /** 최대 파일 크기 (바이트 단위) */
  maxSize?: number
  /** 최대 파일 개수 */
  maxFiles?: number
  /** 비활성화 여부 */
  disabled?: boolean
  /** 에러 메시지 */
  error?: string
  /** 라벨 */
  label?: string
  /** 플레이스홀더 텍스트 */
  placeholder?: string
  /** 필수 여부 */
  required?: boolean
  /** 입력 필드의 name 속성 */
  name?: string
  /** CSS 클래스 */
  className?: string
  /** 레이아웃 변형 */
  variant?: 'default' | 'compact'
  /** 파일 목록 표시 모드 */
  displayMode?: 'list' | 'table'
}
