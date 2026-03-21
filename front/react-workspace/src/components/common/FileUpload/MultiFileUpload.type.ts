import type { AriaAttributes, ChangeEventHandler, FocusEventHandler, Ref } from 'react'

/**
 * MultiFileUpload 드롭존 크기
 */
export type MultiFileUploadSize = 'sm' | 'md' | 'lg'

/**
 * MultiFileUpload 컴포넌트 Props
 *
 * 여러 파일 선택을 위한 드롭존형 컴포넌트입니다.
 * 파일을 추가해도 드롭존이 유지되어 계속 파일을 추가할 수 있습니다.
 * 실제 업로드(API 호출)는 상위 컴포넌트가 처리합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <MultiFileUpload label="첨부파일" onFilesChange={setFiles} />
 *
 * // RHF register 패턴
 * <MultiFileUpload
 *   {...register('attachments', { required: '파일을 선택해 주세요.' })}
 *   label="첨부파일"
 *   error={errors.attachments?.message}
 * />
 *
 * // 최대 파일 수 제한
 * <MultiFileUpload label="이미지" accept="image/*" maxFiles={5} />
 * ```
 */
export interface MultiFileUploadProps extends AriaAttributes {
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
   * 최대 선택 파일 수 (미설정 시 무제한)
   */
  maxFiles?: number

  /**
   * 드롭존 크기
   * @default 'md'
   */
  size?: MultiFileUploadSize

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
   * 파일 목록 변경 콜백 (간단 setState 패턴용)
   * 파일 추가 또는 삭제 시 호출됩니다.
   */
  onFilesChange?: (files: File[]) => void

  /**
   * 필드 컨테이너에 적용할 추가 클래스 (레이아웃 등)
   */
  className?: string

  /**
   * 접근성: 오류 시 true (error가 있으면 자동 설정)
   */
  'aria-invalid'?: boolean

  /**
   * 접근성: 설명/오류 메시지 id (error가 있으면 자동 설정)
   */
  'aria-describedby'?: string
}
