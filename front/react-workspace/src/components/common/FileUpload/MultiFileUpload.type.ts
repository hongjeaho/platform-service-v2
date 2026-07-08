import type { AriaAttributes, ChangeEventHandler, FocusEventHandler, Ref } from 'react'

import type { ManagedFile, ServerFileInfo } from './FileUpload.type'

export type { ManagedFile, ServerFileInfo }

/**
 * MultiFileUpload 드롭존 크기 (고정 높이)
 */
export type MultiFileUploadSize = 'sm' | 'md' | 'lg'

/**
 * MultiFileUpload 컴포넌트 Props
 *
 * 드롭존 내부에 선택된 파일 목록이 함께 표시되는 복수 파일 선택 컴포넌트입니다.
 * 파일이 없을 때는 큰 안내 프롬프트가, 1개 이상 있을 때는 슬림 헤더 + 스크롤 가능한
 * 파일 목록이 표시됩니다. 실제 업로드(API 호출)는 상위 컴포넌트가 처리합니다.
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
 * // 수정 시나리오
 * <MultiFileUpload
 *   initialFiles={existingFiles}
 *   onManagedFilesChange={setManagedFiles}
 * />
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
   * 드롭존 크기 (고정 높이)
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
   * 수정 시나리오에서 서버에서 받아온 기존 파일 목록
   * 제공 시 컴포넌트가 해당 파일들이 선택된 상태로 초기화됩니다.
   */
  initialFiles?: ServerFileInfo[]

  /**
   * 파일 목록 변경 콜백 (간단 setState 패턴용)
   * 새로 추가된 raw File만 전달합니다. 추가·삭제 시 호출됩니다.
   */
  onFilesChange?: (files: File[]) => void

  /**
   * 복수 파일 상태 변경 콜백 (수정 시나리오용)
   * 추가·삭제 시 전체 ManagedFile[] 목록(deleted 포함)을 전달합니다.
   */
  onManagedFilesChange?: (files: ManagedFile[]) => void

  /**
   * 접근성: 오류 시 true (error가 있으면 자동 설정)
   */
  'aria-invalid'?: boolean

  /**
   * 접근성: 설명/오류 메시지 id (error가 있으면 자동 설정)
   */
  'aria-describedby'?: string
}
