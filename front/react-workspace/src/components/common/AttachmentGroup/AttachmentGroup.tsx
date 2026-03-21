import { createContext, use } from 'react'

import { textCombinations } from '@/styles'

import styles from './AttachmentGroup.module.css'
import type { AttachmentGroupContextValue, AttachmentGroupProps } from './AttachmentGroup.type'

export const AttachmentGroupContext = createContext<AttachmentGroupContextValue>({
  disabled: false,
})

/**
 * AttachmentGroupContext 값을 읽는 훅
 */
export function useAttachmentGroup(): AttachmentGroupContextValue {
  return use(AttachmentGroupContext)
}

/**
 * AttachmentGroup 컴포넌트
 *
 * 여러 `AttachmentRow`를 테이블 형태의 섹션으로 묶어주는 레이아웃 컨테이너입니다.
 * `disabled` prop은 Context를 통해 모든 자식 `AttachmentRow`에 자동 전파됩니다.
 *
 * @example
 * ```tsx
 * <AttachmentGroup label="첨부서류" disabled={isSubmitting}>
 *   <AttachmentRow label="주민등록증" required {...register('idCard')} />
 *   <AttachmentRow label="관련 서류" multiple maxFiles={5} {...register('docs')} />
 * </AttachmentGroup>
 * ```
 */
export function AttachmentGroup({
  label,
  children,
  disabled = false,
  className,
}: AttachmentGroupProps) {
  const containerClasses = [styles.wrapper, className].filter(Boolean).join(' ')

  return (
    <AttachmentGroupContext value={{ disabled }}>
      <section className={containerClasses} aria-label={label}>
        {label != null && (
          <h3 className={[styles.groupLabel, textCombinations.label].join(' ')}>{label}</h3>
        )}
        <div className={styles.container}>{children}</div>
      </section>
    </AttachmentGroupContext>
  )
}
