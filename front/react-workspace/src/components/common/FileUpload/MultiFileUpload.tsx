import { useId, useRef, useState } from 'react'

import { icons, iconSizes, textCombinations } from '@/styles'

import styles from './MultiFileUpload.module.css'
import type { MultiFileUploadProps, MultiFileUploadSize } from './MultiFileUpload.type'

const sizeClasses: Record<MultiFileUploadSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * MultiFileUpload 컴포넌트 (복수 파일)
 *
 * 드롭존형 복수 파일 선택 컴포넌트입니다.
 * - 항상 드롭존이 표시되어 계속 파일을 추가할 수 있습니다.
 * - 선택된 파일은 드롭존 아래에 목록으로 누적됩니다.
 * - 각 파일은 개별 삭제 가능합니다.
 *
 * 단일 파일 선택이 필요하면 `FileUpload`를 사용하세요.
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
  className,
  id: idProp,
  name,
  onChange,
  onBlur,
  onFilesChange,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: MultiFileUploadProps) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  const [files, setFiles] = useState<File[]>([])
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

  const isAtLimit = maxFiles != null && files.length >= maxFiles

  const addFiles = (newFiles: File[]) => {
    const remaining = maxFiles != null ? maxFiles - files.length : newFiles.length
    const toAdd = newFiles.slice(0, remaining)
    if (toAdd.length === 0) return
    const updated = [...files, ...toAdd]
    setFiles(updated)
    onFilesChange?.(updated)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesChange?.(updated)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length > 0) addFiles(selected)
    onChange?.(e)
    // reset input so same file can be re-added after removal
    e.target.value = ''
  }

  const handleZoneClick = () => {
    if (!disabled && !isAtLimit) localRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && !isAtLimit && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      localRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && !isAtLimit) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isAtLimit) return
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length > 0) addFiles(dropped)
  }

  const UploadIcon = icons.upload
  const FileIcon = icons.document
  const CloseIcon = icons.close

  const dropzoneClasses = [
    styles.dropzone,
    sizeClasses[size],
    isDragging ? styles.dragging : '',
    disabled || isAtLimit ? styles.disabled : '',
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ')

  const fieldClasses = [styles.field, className].filter(Boolean).join(' ')

  const hintText = (() => {
    if (accept && maxFiles) return `허용 형식: ${accept} · 최대 ${maxFiles}개`
    if (accept) return `허용 형식: ${accept}`
    if (maxFiles) return `최대 ${maxFiles}개 파일 선택 가능`
    return '여러 파일을 선택할 수 있습니다'
  })()

  return (
    <div className={fieldClasses}>
      {label != null && (
        <label htmlFor={inputId} className={[styles.label, textCombinations.label].join(' ')}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      {/* 드롭존 (항상 표시) */}
      <div
        role='button'
        tabIndex={disabled || isAtLimit ? -1 : 0}
        aria-label='파일 업로드 영역. 클릭하거나 파일을 끌어다 놓으세요.'
        aria-disabled={disabled || isAtLimit}
        className={dropzoneClasses}
        onClick={handleZoneClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.dropzoneContent}>
          <UploadIcon
            className={[iconSizes.xl, styles.dropzoneIcon].join(' ')}
            aria-hidden='true'
          />
          <span className={[styles.dropzoneText, textCombinations.body].join(' ')}>
            클릭하거나 파일을 끌어다 놓으세요
          </span>
          <span className={[styles.dropzoneHint, textCombinations.bodyXs].join(' ')}>
            {isAtLimit ? `최대 ${maxFiles}개 파일을 모두 선택했습니다` : hintText}
          </span>
        </div>
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

      {/* 파일 목록 */}
      {files.length > 0 && (
        <ul className={styles.fileList} role='list' aria-label='선택된 파일 목록'>
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className={styles.fileItem}>
              <FileIcon className={[iconSizes.sm, styles.fileIcon].join(' ')} aria-hidden='true' />
              <span className={[styles.fileName, textCombinations.bodySm].join(' ')}>{f.name}</span>
              <span className={[styles.fileSize, textCombinations.bodyXs].join(' ')}>
                {formatFileSize(f.size)}
              </span>
              <button
                type='button'
                className={styles.removeButton}
                onClick={() => removeFile(i)}
                aria-label={`${f.name} 삭제`}
                disabled={disabled}
              >
                <CloseIcon className={iconSizes.sm} aria-hidden='true' />
              </button>
            </li>
          ))}
          <li className={[styles.fileCount, textCombinations.bodyXs].join(' ')} aria-live='polite'>
            {files.length}개 파일 선택됨
          </li>
        </ul>
      )}

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
