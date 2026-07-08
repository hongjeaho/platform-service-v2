import type { AriaAttributes, ChangeEventHandler, FocusEventHandler, Ref } from 'react'

import type { ManagedFile, ServerFileInfo } from '../FileUpload/FileUpload.type'

export type { ManagedFile, ServerFileInfo }

/**
 * 단일 파일 수정 시나리오 상태
 * - existing: 서버에서 받아온 기존 파일 (변경 없음)
 * - deleted:  기존 파일이 삭제됨 (서버에 삭제 요청 필요)
 * - replace:  기존 파일을 새 파일로 교체 (서버에 삭제 + 업로드 필요)
 * - added:    초기 파일 없이 새로 추가된 파일 (서버에 업로드 필요)
 */
export type SingleManagedFile =
  | { state: 'existing'; seqNo: number; name: string; size: number }
  | { state: 'deleted'; seqNo: number; name: string; size: number }
  | { state: 'replace'; seqNo: number; name: string; size: number; file: File }
  | { state: 'added'; file: File; name: string; size: number }

/**
 * AttachmentRow 컴포넌트 Props
 *
 * 3컬럼 그리드(라벨 | 버튼 | 상태) 레이아웃의 단일 첨부파일 행입니다.
 * `multiple=false`이면 단일 파일 선택, `multiple=true`이면 복수 파일 누적 선택입니다.
 * `{...register('fieldName')}` 스프레드로 RHF와 호환됩니다.
 *
 * @example
 * ```tsx
 * // 싱글 (기본)
 * <AttachmentRow label="주민등록증" required {...register('idCard')} error={errors.idCard?.message} />
 *
 * // 멀티
 * <AttachmentRow label="관련 서류" multiple maxFiles={5} accept=".pdf,.docx" {...register('docs')} />
 * ```
 */
export interface AttachmentRowProps extends AriaAttributes {
  /**
   * ref (React 19: 일반 prop으로 전달, RHF register 호환)
   */
  ref?: Ref<HTMLInputElement>

  /**
   * 행 라벨 (라벨 열에 표시, htmlFor 연결)
   */
  label: string

  /**
   * 필수 여부 (라벨 옆 * 표시)
   * @default false
   */
  required?: boolean

  /**
   * 복수 파일 선택 여부
   * - false: 단일 파일 (파일 선택 시 교체)
   * - true: 복수 파일 누적 선택
   * @default false
   */
  multiple?: boolean

  /**
   * 허용 파일 타입 (input accept 속성과 동일)
   * @example 'image/*', '.pdf,.docx'
   */
  accept?: string

  /**
   * 최대 파일 수 (multiple=true 일 때만 유효)
   */
  maxFiles?: number

  /**
   * 비활성화 여부 (AttachmentGroupContext.disabled도 적용됨)
   * @default false
   */
  disabled?: boolean

  /**
   * 에러 메시지 (있으면 role="alert"로 표시, 에러 스타일 적용)
   */
  error?: string

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
   * 수정 시나리오: 서버에서 받아온 기존 파일 (multiple=false 일 때 사용)
   * 제공 시 컴포넌트가 해당 파일이 선택된 상태로 초기화됩니다.
   */
  initialFile?: ServerFileInfo

  /**
   * 수정 시나리오: 서버에서 받아온 기존 파일 목록 (multiple=true 일 때 사용)
   * 제공 시 컴포넌트가 해당 파일들이 선택된 상태로 초기화됩니다.
   */
  initialFiles?: ServerFileInfo[]

  /**
   * 파일 목록 변경 콜백 (간단 setState 패턴용)
   */
  onFilesChange?: (files: File[]) => void

  /**
   * 단일 파일 상태 변경 콜백 (수정 시나리오용, multiple=false)
   * 파일 추가·삭제·교체 시 SingleManagedFile 또는 null을 전달합니다.
   */
  onManagedFileChange?: (file: SingleManagedFile | null) => void

  /**
   * 복수 파일 상태 변경 콜백 (수정 시나리오용, multiple=true)
   * 파일 추가·삭제 시 전체 ManagedFile[] 목록(deleted 포함)을 전달합니다.
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
