import { useRef, useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Upload.module.css'
import type { UploadMultiProps } from './Upload.types'
import { formatFileSize, validateFile } from './Upload.utils'

const UPLOAD_ICON = icons.upload
const DELETE_ICON = icons.delete
const PAPERCLIP_ICON = icons.attachment
const FILE_ICON = icons.document

/**
 * UploadMulti 컴포넌트 (멀티 파일)
 * 여러 파일을 업로드하고 관리하기 위한 입력 필드입니다.
 * 파일 추가 및 삭제 기능을 제공합니다.
 */
export function UploadMulti({
  value = [],
  onChange,
  accept,
  maxSize,
  maxFiles,
  disabled,
  error,
  label,
  placeholder = '파일 선택 또는 드래그앤드롭',
  required,
  name,
  className,
  variant = 'default',
  displayMode = 'list',
}: UploadMultiProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateFileWithCount = (file: File): string | null => {
    if (maxFiles && (value ?? []).length >= maxFiles) {
      return `최대 ${maxFiles}개의 파일만 추가할 수 있습니다.`
    }
    return validateFile(file, accept, maxSize)
  }

  const displayError = error ?? validationError

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null)
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of newFiles) {
      const err = validateFileWithCount(file)
      if (err) {
        errors.push(`${file.name}: ${err}`)
        continue
      }
      validFiles.push(file)
    }

    if (errors.length > 0) {
      setValidationError(errors.join('\n'))
    }
    if (validFiles.length > 0) {
      onChange?.([...(value ?? []), ...validFiles])
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    if (!disabled && (!maxFiles || value.length < maxFiles)) {
      inputRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length === 0) return

    const newFiles = Array.from(files)
    const validFiles: File[] = []

    for (const file of newFiles) {
      const err = validateFileWithCount(file)
      if (err) {
        setValidationError(`${file.name}: ${err}`)
        return
      }
      validFiles.push(file)
    }
    setValidationError(null)
    if (validFiles.length > 0) {
      onChange?.([...(value ?? []), ...validFiles])
    }
  }

  const handleDelete = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index))
  }

  const canAddMore = !maxFiles || value.length < maxFiles

  // Render file list as table
  const renderTableView = () => (
    <div className={styles.tableContainer}>
      <table className={styles.fileTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>파일명</th>
            <th>크기</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {value.length === 0 ? (
            <tr>
              <td colSpan={3} className={styles.emptyTable}>
                업로드된 파일이 없습니다
              </td>
            </tr>
          ) : (
            value.map((file, index) => (
              <tr key={`${file.name}-${file.size}-${index}`} className={styles.tableRow}>
                <td className={cn(styles.tableCell, styles.fileName)}>{file.name}</td>
                <td className={cn(styles.tableCell, styles.fileSize)}>
                  {formatFileSize(file.size)}
                </td>
                <td className={cn(styles.tableCell, styles.actions)}>
                  <button
                    onClick={() => handleDelete(index)}
                    className={styles.deleteButton}
                    aria-label={`${file.name} 삭제`}
                    disabled={disabled}
                  >
                    <DELETE_ICON className={iconSizes.sm} aria-hidden='true' />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  // Render file list as cards
  const renderListView = () => (
    <div className={styles.fileList} role='list'>
      {value.map((file, index) => (
        <div key={`${file.name}-${file.size}-${index}`} className={styles.fileItem} role='listitem'>
          <FILE_ICON className={cn(iconSizes.sm, styles.fileIcon)} aria-hidden='true' />
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
          </div>
          <button
            onClick={() => handleDelete(index)}
            className={styles.deleteButton}
            aria-label={`${file.name} 삭제`}
            disabled={disabled}
          >
            <DELETE_ICON className={iconSizes.sm} aria-hidden='true' />
          </button>
        </div>
      ))}
    </div>
  )

  // Compact variant rendering
  if (variant === 'compact') {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          {label && (
            <label htmlFor={name} className={styles.compactLabel}>
              {label}
              {required && <span className={styles.required}>*</span>}
            </label>
          )}

          <input
            ref={inputRef}
            type='file'
            name={name}
            accept={accept}
            multiple
            onChange={handleFileChange}
            disabled={disabled || !canAddMore}
            className={styles.hiddenInput}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${name}-error` : undefined}
          />

          <button
            type='button'
            onClick={handleClick}
            disabled={disabled || !canAddMore}
            className={cn(styles.compactUploadButton, className)}
          >
            <PAPERCLIP_ICON className={iconSizes.sm} aria-hidden='true' />
            파일 추가
            {maxFiles && ` (${value.length}/${maxFiles})`}
          </button>
        </div>

        {value.length > 0 && (displayMode === 'table' ? renderTableView() : renderListView())}

        {displayError && (
          <p
            id={`${name}-error`}
            className={cn(styles.error, textCombinations.bodySm)}
            role='alert'
          >
            {displayError}
          </p>
        )}
      </div>
    )
  }

  // Default variant rendering
  return (
    <div className={styles.container}>
      {label && (
        <label className={cn(styles.label, textCombinations.label)}>
          {label}
          {required && <span className={styles.required}>*</span>}
          {maxFiles && (
            <span className={styles.fileCount}>
              {value.length} / {maxFiles}
            </span>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        type='file'
        name={name}
        accept={accept}
        multiple
        onChange={handleFileChange}
        disabled={disabled || !canAddMore}
        className={styles.hiddenInput}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${name}-error` : undefined}
      />

      {canAddMore && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            styles.uploadArea,
            dragActive && styles.dragActive,
            disabled && styles.disabled,
            className,
          )}
          role='button'
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
        >
          <UPLOAD_ICON className={cn(iconSizes.lg, styles.uploadIcon)} aria-hidden='true' />
          <p className={styles.uploadText}>{placeholder}</p>
          <p className={styles.uploadSubText}>
            {maxSize && `최대 ${formatFileSize(maxSize)}`}
            {maxSize && maxFiles && ' • '}
            {maxFiles && `최대 ${maxFiles}개`}
          </p>
        </div>
      )}

      {value.length > 0 && (displayMode === 'table' ? renderTableView() : renderListView())}

      {displayError && (
        <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)} role='alert'>
          {displayError}
        </p>
      )}
    </div>
  )
}

UploadMulti.displayName = 'UploadMulti'
