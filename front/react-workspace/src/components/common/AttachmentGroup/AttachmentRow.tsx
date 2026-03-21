import { useId, useRef, useState } from 'react'

import { icons, iconSizes, textCombinations } from '@/styles'

import { Button } from '../Button'
import { useAttachmentGroup } from './AttachmentGroup'
import styles from './AttachmentRow.module.css'
import type { AttachmentRowProps } from './AttachmentRow.type'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * AttachmentRow 컴포넌트
 *
 * 3컬럼 그리드(라벨 | 버튼 | 상태) 레이아웃의 단일 첨부파일 행입니다.
 * - `multiple=false`: 단일 파일 선택, 선택 후 "교체" 버튼으로 변경
 * - `multiple=true`: 복수 파일 누적 선택, 파일 목록 접기/펼치기 지원
 * - `AttachmentGroup` 안에서 사용하면 `disabled`가 Context에서 자동으로 주입됩니다.
 *
 * @example
 * ```tsx
 * <AttachmentRow label="주민등록증" required {...register('idCard')} error={errors.idCard?.message} />
 * <AttachmentRow label="관련 서류" multiple maxFiles={5} {...register('docs')} />
 * ```
 */
export function AttachmentRow({
  ref,
  label,
  required = false,
  multiple = false,
  accept,
  maxFiles,
  disabled: disabledProp = false,
  error,
  id: idProp,
  name,
  onChange,
  onBlur,
  onFilesChange,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: AttachmentRowProps) {
  const { disabled: groupDisabled } = useAttachmentGroup()
  const disabled = disabledProp || groupDisabled

  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  const [files, setFiles] = useState<File[]>([])
  const [isExpanded, setIsExpanded] = useState(multiple)
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
  const isActionDisabled = disabled || (multiple ? isAtLimit : false)

  const updateFiles = (updated: File[]) => {
    setFiles(updated)
    onFilesChange?.(updated)
  }

  const addFiles = (newFiles: File[]) => {
    if (multiple) {
      const remaining = maxFiles != null ? maxFiles - files.length : newFiles.length
      const toAdd = newFiles.slice(0, remaining)
      if (toAdd.length === 0) return
      updateFiles([...files, ...toAdd])
    } else {
      updateFiles(newFiles.slice(0, 1))
    }
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    updateFiles(updated)
    if (updated.length === 0) setIsExpanded(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length > 0) addFiles(selected)
    onChange?.(e)
    e.target.value = ''
  }

  const handleButtonClick = () => {
    if (!isActionDisabled) localRef.current?.click()
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

  const FileIcon = icons.document
  const CloseIcon = icons.close
  const AttachIcon = icons.attachment
  const EditIcon = icons.edit
  const FolderIcon = icons.folder
  const ChevronIcon = icons.next

  // 버튼 레이블·variant 계산
  const buttonLabel = (() => {
    if (multiple) return '파일 추가'
    return files.length > 0 ? '교체' : '파일 선택'
  })()

  const buttonVariant = !multiple && files.length > 0 ? 'secondary' : 'primary'
  const buttonIcon = (() => {
    if (!multiple && files.length > 0)
      return <EditIcon className={iconSizes.sm} aria-hidden='true' />
    if (multiple) return <FolderIcon className={iconSizes.sm} aria-hidden='true' />
    return <AttachIcon className={iconSizes.sm} aria-hidden='true' />
  })()

  const rowClasses = [
    styles.row,
    isDragging ? styles.dragging : '',
    disabled ? styles.disabled : '',
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={rowClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 컬럼 1: 라벨 */}
      <label htmlFor={inputId} className={[styles.labelCol, textCombinations.bodySm].join(' ')}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      {/* 컬럼 2: 액션 버튼 */}
      <div className={styles.buttonCol}>
        <Button
          type='button'
          size='sm'
          variant={buttonVariant}
          icon={buttonIcon}
          disabled={isActionDisabled}
          onClick={handleButtonClick}
        >
          {buttonLabel}
        </Button>
      </div>

      {/* 컬럼 3: 상태 영역 */}
      <div className={styles.statusCol}>
        {/* 싱글: 파일 없음 */}
        {!multiple && files.length === 0 && (
          <span className={[styles.placeholder, textCombinations.bodySm].join(' ')}>
            파일을 선택하세요
          </span>
        )}

        {/* 싱글: 파일 선택됨 */}
        {!multiple && files.length === 1 && (
          <div className={styles.singleFileRow}>
            <FileIcon className={[iconSizes.sm, styles.fileIcon].join(' ')} aria-hidden='true' />
            <span className={[styles.fileName, textCombinations.bodySm].join(' ')}>
              {files[0].name}
            </span>
            <span className={[styles.fileSize, textCombinations.bodyXs].join(' ')}>
              {formatFileSize(files[0].size)}
            </span>
            <button
              type='button'
              className={styles.removeButton}
              onClick={() => removeFile(0)}
              aria-label={`${files[0].name} 삭제`}
              disabled={disabled}
            >
              <CloseIcon className={iconSizes.sm} aria-hidden='true' />
            </button>
          </div>
        )}

        {/* 멀티: 파일 없음 */}
        {multiple && files.length === 0 && (
          <span className={[styles.placeholder, textCombinations.bodySm].join(' ')}>
            파일을 선택하세요
          </span>
        )}

        {/* 멀티: 파일 있음 — 요약 + 펼침/접힘 */}
        {multiple && files.length > 0 && (
          <>
            <div className={styles.multiSummaryRow}>
              <AttachIcon
                className={[iconSizes.sm, styles.fileIcon].join(' ')}
                aria-hidden='true'
              />
              <span className={[styles.fileCount, textCombinations.bodySm].join(' ')}>
                {files.length}개 첨부됨
              </span>
              <button
                type='button'
                className={styles.toggleButton}
                onClick={() => setIsExpanded(prev => !prev)}
                aria-label={isExpanded ? '파일 목록 접기' : '파일 목록 펼치기'}
                aria-expanded={isExpanded}
              >
                <ChevronIcon
                  className={[
                    iconSizes.sm,
                    isExpanded ? styles.chevronUp : styles.chevronDown,
                  ].join(' ')}
                  aria-hidden='true'
                />
              </button>
            </div>

            {isExpanded && (
              <ul className={styles.fileList} role='list' aria-label={`${label} 파일 목록`}>
                {files.map((f, i) => (
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
                      onClick={() => removeFile(i)}
                      aria-label={`${f.name} 삭제`}
                      disabled={disabled}
                    >
                      <CloseIcon className={iconSizes.sm} aria-hidden='true' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* 숨겨진 파일 input */}
      <input
        ref={mergedRef}
        type='file'
        id={inputId}
        name={name}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={onBlur}
        className={styles.hiddenInput}
        aria-invalid={error ? 'true' : ariaInvalid}
        aria-describedby={errorId ?? ariaDescribedBy}
      />

      {/* 에러 메시지 (col 2~3 span) */}
      {error != null && (
        <span
          id={errorId}
          className={[styles.errorRow, textCombinations.bodySm].join(' ')}
          role='alert'
        >
          {error}
        </span>
      )}
    </div>
  )
}
