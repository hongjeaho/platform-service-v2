import type { AriaAttributes, ChangeEventHandler, FocusEventHandler, Ref } from 'react'

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
   * 파일 목록 변경 콜백 (간단 setState 패턴용)
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
