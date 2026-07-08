import type { AriaAttributes, ChangeEventHandler, FocusEventHandler, Ref } from 'react'

/**
 * FileUpload 크기
 */
export type FileUploadSize = 'sm' | 'md' | 'lg'

/**
 * 서버에서 받아온 기존 파일 정보 (수정 시나리오에서 사용)
 */
export type ServerFileInfo = {
  /** 파일 일련번호 */
  seqNo: number
  /** 파일 이름 */
  name: string
  /** 파일 용량 (bytes) */
  size: number
}

/**
 * 복수 파일 수정 시나리오에서 파일의 상태를 나타내는 타입
 * - existing: 서버에서 받아온 기존 파일 (변경 없음)
 * - deleted:  기존 파일이 삭제됨 (서버에 삭제 요청 필요)
 * - added:    새로 추가된 파일 (서버에 업로드 필요)
 */
export type ManagedFile =
  | { state: 'existing'; seqNo: number; name: string; size: number }
  | { state: 'deleted'; seqNo: number; name: string; size: number }
  | { state: 'added'; file: File; name: string; size: number }

/**
 * FileUpload 컴포넌트 Props
 *
 * 단일 파일 선택을 위한 인풋 필드형 컴포넌트입니다.
 * 파일 선택 전에는 "[파일 선택] 파일을 선택하세요" 형태의 입력 필드처럼 보이고,
 * 선택 후에는 파일 이름·크기·삭제 버튼이 있는 카드로 교체됩니다.
 * 실제 업로드(API 호출)는 상위 컴포넌트가 처리합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <FileUpload label="첨부파일" onFilesChange={setFiles} />
 *
 * // RHF register 패턴
 * <FileUpload
 *   {...register('attachment', { required: '파일을 선택해 주세요.' })}
 *   label="첨부파일"
 *   error={errors.attachment?.message}
 * />
 * ```
 */
export interface FileUploadProps extends AriaAttributes {
  /**
   * ref (React 19: 일반 prop으로 전달)
   */
  ref?: Ref<HTMLInputElement>

  /**
   * 허용 파일 타입 (input accept 속성과 동일)
   * @example 'image/*', '.pdf,.docx'
   */
  accept?: string

  /**
   * 크기
   * @default 'md'
   */
  size?: FileUploadSize

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  /**
   * 필드 라벨 (있으면 label 요소로 렌더링)
   */
  label?: string

  /**
   * 에러 메시지 (있으면 하단에 role="alert"로 표시, 에러 스타일 적용)
   */
  error?: string

  /**
   * 필수 여부 (라벨 옆 * 표시)
   * @default false
   */
  required?: boolean

  /**
   * 접근성: label과 연결할 id (미제공 시 useId로 자동 생성)
   */
  id?: string

  /**
   * 폼 필드명 (RHF register()와 호환)
   */
  name?: string

  /**
   * onChange (네이티브, RHF register()와 호환)
   */
  onChange?: ChangeEventHandler<HTMLInputElement>

  /**
   * onBlur (RHF register()와 호환)
   */
  onBlur?: FocusEventHandler<HTMLInputElement>

  /**
   * 수정 시나리오에서 서버에서 받아온 기존 파일 정보
   * 제공 시 컴포넌트가 해당 파일이 선택된 상태로 초기화됩니다.
   */
  initialFile?: ServerFileInfo

  /**
   * 파일 변경 콜백 (간단 setState 패턴용)
   * 파일 선택 또는 삭제 시 호출됩니다.
   */
  onFilesChange?: (files: File[]) => void

  /**
   * 접근성: 오류 시 true (error가 있으면 자동 설정)
   */
  'aria-invalid'?: boolean

  /**
   * 접근성: 설명/오류 메시지 id (error가 있으면 자동 설정)
   */
  'aria-describedby'?: string
}
