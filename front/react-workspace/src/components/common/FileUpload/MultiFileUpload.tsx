import { useId, useRef, useState } from 'react'

import { useManagedFiles } from '@/hooks/useManagedFiles'
import { icons, iconSizes, textCombinations } from '@/styles'
import { formatFileSize } from '@/utils/format'

import styles from './MultiFileUpload.module.css'
import type { ManagedFile, MultiFileUploadProps, MultiFileUploadSize } from './MultiFileUpload.type'

const sizeClasses: Record<MultiFileUploadSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

/**
 * MultiFileUpload 컴포넌트 (복수 파일, 드롭존 내장형)
 *
 * - 파일이 없을 때: 박스 전체를 채우는 중앙 정렬 프롬프트
 * - 파일이 1개 이상 있을 때: 슬림 헤더(파일 추가) + 스크롤 가능한 파일 목록
 * - 박스 전체(헤더 + 목록)가 항상 드래그앤드롭 대상이며, 헤더만 클릭/Enter/Space로 파일 선택창을 엽니다.
 *
 * 단일 파일 선택이 필요하면 `FileUpload`를, `AttachmentGroup` 폼 행이 필요하면 `AttachmentRow`(multiple)를 사용하세요.
 *
 * @example
 * ```tsx
 * <MultiFileUpload label="첨부파일" onFilesChange={setFiles} />
 * <MultiFileUpload {...register('attachments')} label="첨부파일" maxFiles={5} error={errors.attachments?.message} />
 * ```
 */
export function MultiFileUpload({
  ref,
  accept,
  maxFiles,
  size = 'md',
  disabled = false,
  label,
  error,
  required = false,
  id: idProp,
  name,
  onChange,
  onBlur,
  initialFiles,
  onFilesChange,
  onManagedFilesChange,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: MultiFileUploadProps) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  const {
    files: managedFiles,
    visibleFiles,
    addFiles: addManagedFiles,
    removeFile: removeManagedFile,
  } = useManagedFiles(initialFiles, maxFiles)
  const [isDragging, setIsDragging] = useState(false)

  const localRef = useRef<HTMLInputElement>(null)

  const mergedRef = (node: HTMLInputElement | null) => {
    localRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    }
  }

  const isAtLimit = maxFiles != null && visibleFiles.length >= maxFiles
  const isActionDisabled = disabled || isAtLimit

  const addFiles = (newFiles: File[]) => {
    const updated = addManagedFiles(newFiles)
    if (updated === managedFiles) return
    onManagedFilesChange?.(updated)
    onFilesChange?.(
      updated
        .filter((f): f is Extract<ManagedFile, { state: 'added' }> => f.state === 'added')
        .map(f => f.file),
    )
  }

  const removeFile = (target: ManagedFile) => {
    const updated = removeManagedFile(target)
    onManagedFilesChange?.(updated)
    onFilesChange?.(
      updated
        .filter((f): f is Extract<ManagedFile, { state: 'added' }> => f.state === 'added')
        .map(f => f.file),
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length > 0) addFiles(selected)
    onChange?.(e)
    e.target.value = ''
  }

  const handleHeaderClick = () => {
    if (!isActionDisabled) localRef.current?.click()
  }

  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isActionDisabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      localRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isActionDisabled) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (isActionDisabled) return
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length > 0) addFiles(dropped)
  }

  const UploadIcon = icons.upload
  const FolderIcon = icons.folder
  const FileIcon = icons.document
  const CloseIcon = icons.close

  const hasFiles = visibleFiles.length > 0

  const boxClasses = [
    styles.box,
    sizeClasses[size],
    isDragging ? styles.dragging : '',
    disabled || isAtLimit ? styles.disabled : '',
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ')

  const headerClasses = [styles.header, hasFiles ? styles.headerFilled : styles.headerEmpty]
    .filter(Boolean)
    .join(' ')

  const emptyHintText = (() => {
    if (accept && maxFiles) return `허용 형식: ${accept} · 최대 ${maxFiles}개`
    if (accept) return `허용 형식: ${accept}`
    if (maxFiles) return `최대 ${maxFiles}개 파일 선택 가능`
    return '여러 파일을 선택할 수 있습니다'
  })()

  const filledHeaderText = isAtLimit ? `최대 ${maxFiles}개 파일을 모두 선택했습니다` : '파일 추가'

  return (
    <div className={styles.field}>
      {label != null && (
        <label htmlFor={inputId} className={[styles.label, textCombinations.label].join(' ')}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      {/* 박스 (헤더 + 파일 목록) — 항상 드래그앤드롭 대상 */}
      <div
        className={boxClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 헤더 — 유일한 클릭/키보드 진입점 */}
        <div
          role='button'
          tabIndex={isActionDisabled ? -1 : 0}
          aria-label='파일 업로드 영역. 클릭하거나 파일을 끌어다 놓으세요.'
          aria-disabled={isActionDisabled}
          className={headerClasses}
          onClick={handleHeaderClick}
          onKeyDown={handleHeaderKeyDown}
        >
          {hasFiles ? (
            <>
              <FolderIcon
                className={[iconSizes.sm, styles.headerFilledIcon].join(' ')}
                aria-hidden='true'
              />
              <span className={[styles.headerFilledText, textCombinations.bodySm].join(' ')}>
                {filledHeaderText}
              </span>
            </>
          ) : (
            <>
              <UploadIcon
                className={[iconSizes.xl, styles.headerIcon].join(' ')}
                aria-hidden='true'
              />
              <span className={[styles.headerText, textCombinations.body].join(' ')}>
                클릭하거나 파일을 끌어다 놓으세요
              </span>
              <span className={[styles.headerHint, textCombinations.bodyXs].join(' ')}>
                {isAtLimit ? `최대 ${maxFiles}개 파일을 모두 선택했습니다` : emptyHintText}
              </span>
            </>
          )}
        </div>

        {/* 파일 목록 — 헤더의 형제 요소 (스크롤 영역) */}
        {hasFiles && (
          <div className={styles.listArea}>
            <ul className={styles.fileList} role='list' aria-label='선택된 파일 목록'>
              {visibleFiles.map((f, i) => (
                <li key={`${f.name}-${i}`} className={styles.fileItem}>
                  <FileIcon
                    className={[iconSizes.sm, styles.fileIcon].join(' ')}
                    aria-hidden='true'
                  />
                  <span className={[styles.fileName, textCombinations.bodySm].join(' ')}>
                    {f.name}
                  </span>
                  <span className={[styles.fileSize, textCombinations.bodyXs].join(' ')}>
                    {formatFileSize(f.size)}
                  </span>
                  <button
                    type='button'
                    className={styles.removeButton}
                    onClick={() => removeFile(f)}
                    aria-label={`${f.name} 삭제`}
                    disabled={disabled}
                  >
                    <CloseIcon className={iconSizes.sm} aria-hidden='true' />
                  </button>
                </li>
              ))}
            </ul>
            <div
              className={[styles.fileCount, textCombinations.bodyXs].join(' ')}
              aria-live='polite'
            >
              {visibleFiles.length}개 파일 선택됨
            </div>
          </div>
        )}
      </div>

      <input
        ref={mergedRef}
        type='file'
        id={inputId}
        name={name}
        multiple
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={onBlur}
        className={styles.hiddenInput}
        aria-invalid={error ? 'true' : ariaInvalid}
        aria-describedby={errorId ?? ariaDescribedBy}
      />

      {error != null && (
        <span
          id={errorId}
          className={[styles.errorMessage, textCombinations.bodySm].join(' ')}
          role='alert'
        >
          {error}
        </span>
      )}
    </div>
  )
}
