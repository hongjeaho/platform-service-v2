import { useId, useRef, useState } from 'react'

import { icons, iconSizes, textCombinations } from '@/styles'

import styles from './FileUpload.module.css'
import type { FileUploadProps, FileUploadSize, ServerFileInfo } from './FileUpload.type'
import { formatFileSize } from './utils'

const sizeClasses: Record<FileUploadSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

/**
 * FileUpload 컴포넌트 (단일 파일)
 *
 * 인풋 필드형 단일 파일 선택 컴포넌트입니다.
 * - 선택 전: "[파일 선택] 파일을 선택하세요" 형태의 1행 입력 필드
 * - 선택 후: 파일 이름·크기·삭제 버튼이 있는 카드로 교체
 * - 클릭 또는 Drag & Drop 지원
 *
 * 여러 파일 선택이 필요하면 `MultiFileUpload`를 사용하세요.
 *
 * @example
 * ```tsx
 * <FileUpload label="첨부파일" onFilesChange={setFiles} />
 * <FileUpload {...register('attachment')} label="첨부파일" error={errors.attachment?.message} />
 * ```
 */
export function FileUpload({
  ref,
  accept,
  size = 'md',
  disabled = false,
  label,
  error,
  required = false,
  id: idProp,
  name,
  onChange,
  onBlur,
  onFilesChange,
  initialFile,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: FileUploadProps) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  const [file, setFile] = useState<File | ServerFileInfo | null>(initialFile ?? null)
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

  const selectFile = (selected: File) => {
    setFile(selected)
    onFilesChange?.([selected])
  }

  const clearFile = () => {
    setFile(null)
    onFilesChange?.([])
    if (localRef.current) localRef.current.value = ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) selectFile(selected)
    onChange?.(e)
  }

  const handleZoneClick = () => {
    if (!disabled) localRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      localRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const dropped = e.dataTransfer.files[0]
    if (dropped) selectFile(dropped)
  }

  const AttachIcon = icons.attachment
  const FileIcon = icons.document
  const CloseIcon = icons.close

  const fieldClasses = styles.field

  const zoneStateClasses = [
    isDragging ? styles.dragging : '',
    disabled ? styles.disabled : '',
    error ? styles.error : '',
    sizeClasses[size],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      {label != null && (
        <label htmlFor={inputId} className={[styles.label, textCombinations.label].join(' ')}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      {file == null ? (
        /* 선택 전: 인풋 필드형 */
        <div
          role='button'
          tabIndex={disabled ? -1 : 0}
          aria-label='파일 선택. 클릭하거나 파일을 끌어다 놓으세요.'
          aria-disabled={disabled}
          className={[styles.singleField, zoneStateClasses].join(' ')}
          onClick={handleZoneClick}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span className={styles.singleSelectBtn}>
            <AttachIcon className={iconSizes.sm} aria-hidden='true' />
            파일 선택
          </span>
          <span className={[styles.singlePlaceholder, textCombinations.bodySm].join(' ')}>
            {accept ? `허용 형식: ${accept}` : '파일을 선택하세요 …'}
          </span>
        </div>
      ) : (
        /* 선택 후: 파일 카드 (클릭으로 교체 가능) */
        <div
          role='button'
          tabIndex={disabled ? -1 : 0}
          aria-label={`선택된 파일: ${file.name}. 클릭하여 다른 파일로 교체하세요.`}
          aria-disabled={disabled}
          className={[styles.singleCard, zoneStateClasses].join(' ')}
          onClick={handleZoneClick}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileIcon className={[iconSizes.sm, styles.fileIcon].join(' ')} aria-hidden='true' />
          <span className={[styles.fileName, textCombinations.bodySm].join(' ')}>{file.name}</span>
          <span className={[styles.fileSize, textCombinations.bodyXs].join(' ')}>
            {formatFileSize(file.size)}
          </span>
          <button
            type='button'
            className={styles.removeButton}
            onClick={e => {
              e.stopPropagation()
              clearFile()
            }}
            aria-label={`${file.name} 삭제`}
            disabled={disabled}
          >
            <CloseIcon className={iconSizes.sm} aria-hidden='true' />
          </button>
        </div>
      )}

      <input
        ref={mergedRef}
        type='file'
        id={inputId}
        name={name}
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
