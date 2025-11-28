import { useRef, useState } from 'react'

import { icons, iconSizes } from '@/constants/design/icons'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './Upload.module.css'
import type { UploadMultiProps } from './Upload.types'

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
}: UploadMultiProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const UploadIcon = icons.upload
  const DeleteIcon = icons.delete

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `파일 크기가 ${formatFileSize(maxSize)}를 초과합니다.`
    }
    if (maxFiles && value.length >= maxFiles) {
      return `최대 ${maxFiles}개의 파일만 추가할 수 있습니다.`
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const validFiles: File[] = []

    for (const file of newFiles) {
      const validationError = validateFile(file)
      if (validationError) {
        alert(`${file.name}: ${validationError}`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      onChange?.([...value, ...validFiles])
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
      const validationError = validateFile(file)
      if (validationError) {
        alert(`${file.name}: ${validationError}`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      onChange?.([...value, ...validFiles])
    }
  }

  const handleDelete = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index))
  }

  const canAddMore = !maxFiles || value.length < maxFiles

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
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
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
              handleClick()
            }
          }}
        >
          <UploadIcon className={cn(iconSizes.lg, styles.uploadIcon)} aria-hidden='true' />
          <p className={styles.uploadText}>{placeholder}</p>
          <p className={styles.uploadSubText}>
            {maxSize && `최대 ${formatFileSize(maxSize)}`}
            {maxSize && maxFiles && ' • '}
            {maxFiles && `최대 ${maxFiles}개`}
          </p>
        </div>
      )}

      {value.length > 0 && (
        <div className={styles.fileList} role='list'>
          {value.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className={styles.fileItem}
              role='listitem'
            >
              <span className={styles.fileIcon}>📄</span>
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
                <DeleteIcon className={iconSizes.sm} aria-hidden='true' />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p id={`${name}-error`} className={cn(styles.error, textCombinations.bodySm)}>
          {error}
        </p>
      )}
    </div>
  )
}

UploadMulti.displayName = 'UploadMulti'
