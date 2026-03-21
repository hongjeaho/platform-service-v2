import type { ReactNode } from 'react'

/**
 * AttachmentGroup 컴포넌트 Props
 *
 * 여러 `AttachmentRow`를 테이블 형태의 섹션으로 묶어주는 레이아웃 컨테이너입니다.
 * `disabled` prop은 React Context를 통해 모든 자식 `AttachmentRow`에 전파됩니다.
 *
 * @example
 * ```tsx
 * <AttachmentGroup label="첨부서류">
 *   <AttachmentRow label="주민등록증" required {...register('idCard')} error={errors.idCard?.message} />
 *   <AttachmentRow label="관련 서류" multiple maxFiles={5} {...register('docs')} />
 * </AttachmentGroup>
 * ```
 */
export interface AttachmentGroupProps {
  /**
   * 섹션 헤더 라벨 (있으면 `<h3>`으로 렌더링)
   */
  label?: string

  /**
   * AttachmentRow 목록
   */
  children: ReactNode

  /**
   * 전체 비활성화 여부 (Context로 자식에 전파)
   * @default false
   */
  disabled?: boolean

  /**
   * 컨테이너에 적용할 추가 클래스 (레이아웃 등)
   */
  className?: string
}

/**
 * AttachmentGroup Context 값 타입
 */
export interface AttachmentGroupContextValue {
  disabled: boolean
}
