import { useRef, useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Upload.module.css'
import type { UploadProps } from './Upload.types'
import { formatFileSize, validateFile } from './Upload.utils'

const UPLOAD_ICON = icons.upload
const DELETE_ICON = icons.delete
const PAPERCLIP_ICON = icons.attachment
const FILE_ICON = icons.document

/**
 * Upload 컴포넌트 (단일 파일)
 * 단일 파일을 업로드하기 위한 입력 필드입니다.
 */
export function Upload({
  value,
  onChange,
  accept,
  maxSize,
  disabled,
  error,
  label,
  placeholder = '파일 선택 또는 드래그앤드롭',
  required,
  name,
  className,
  variant = 'default',
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const displayError = error ?? validationError

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null)
    const file = e.target.files?.[0]
    if (!file) {
      onChange?.(null)
      return
    }

    const err = validateFile(file, accept, maxSize)
    if (err) {
      setValidationError(err)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      return
    }

    onChange?.(file)
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length === 0) return

    const file = files[0]
    const err = validateFile(file, accept, maxSize)
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)

    onChange?.(file)
    if (inputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      inputRef.current.files = dataTransfer.files
    }
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  // Compact variant 렌더링
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
            onChange={handleFileChange}
            disabled={disabled}
            className={styles.hiddenInput}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${name}-error` : undefined}
          />

          <button
            type='button'
            onClick={handleClick}
            disabled={disabled}
            className={cn(styles.compactUploadButton, className)}
          >
            <PAPERCLIP_ICON className={iconSizes.sm} aria-hidden='true' />
            파일 선택
          </button>

          {value && (
            <div className={styles.compactFileInfo}>
              <span className={styles.fileName}>{value.name}</span>
              <span className={styles.fileSize}>({formatFileSize(value.size)})</span>
              <button
                type='button'
                onClick={handleDelete}
                className={styles.deleteButton}
                aria-label={`${value.name} 삭제`}
                disabled={disabled}
              >
                <DELETE_ICON className={iconSizes.sm} aria-hidden='true' />
              </button>
            </div>
          )}
        </div>

        {error && (
          <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
            {error}
          </p>
        )}
      </div>
    )
  }

  // Default variant 렌더링
  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={name} className={cn(styles.label, textCombinations.label)}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type='file'
        name={name}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className={styles.hiddenInput}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${name}-error` : undefined}
      />

      {!value ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(styles.uploadArea, disabled && styles.disabled, className)}
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
          <p className={styles.uploadSubText}>{maxSize && `최대 ${formatFileSize(maxSize)}`}</p>
        </div>
      ) : (
        <div className={styles.fileDisplay}>
          <div className={styles.fileItem}>
            <FILE_ICON className={cn(iconSizes.sm, styles.fileIcon)} aria-hidden='true' />
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{value.name}</span>
              <span className={styles.fileSize}>{formatFileSize(value.size)}</span>
            </div>
            <button
              onClick={handleDelete}
              className={styles.deleteButton}
              aria-label={`${value.name} 삭제`}
              disabled={disabled}
            >
              <DELETE_ICON className={iconSizes.sm} aria-hidden='true' />
            </button>
          </div>
        </div>
      )}

      {displayError && (
        <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)} role='alert'>
          {displayError}
        </p>
      )}
    </div>
  )
}

Upload.displayName = 'Upload'
