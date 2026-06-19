import { useId, useRef, useState } from 'react'

import { icons, iconSizes, textCombinations } from '@/styles'
import { formatFileSize } from '@/utils/format'

import { Button } from '../Button'
import { useAttachmentGroup } from './AttachmentGroup'
import styles from './AttachmentRow.module.css'
import type { AttachmentRowProps, ManagedFile, SingleManagedFile } from './AttachmentRow.type'

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
  initialFile,
  initialFiles,
  onFilesChange,
  onManagedFileChange,
  onManagedFilesChange,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: AttachmentRowProps) {
  const { disabled: groupDisabled } = useAttachmentGroup()
  const disabled = disabledProp || groupDisabled

  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  // 수정 시나리오: 원본 서버 파일 참조 (seqNo 유지용)
  const originalFileRef = useRef<typeof initialFile>(initialFile)

  // ── Single 모드 상태 ──────────────────────────────────────────
  const [managedFile, setManagedFile] = useState<SingleManagedFile | null>(() =>
    initialFile ? { state: 'existing', ...initialFile } : null,
  )

  // ── Multi 모드 상태 ───────────────────────────────────────────
  const [managedFiles, setManagedFiles] = useState<ManagedFile[]>(
    () => initialFiles?.map(f => ({ state: 'existing' as const, ...f })) ?? [],
  )

  // 화면에 표시할 파일 (deleted 제외)
  const visibleFile = managedFile?.state !== 'deleted' ? managedFile : null
  const visibleFiles = managedFiles.filter(f => f.state !== 'deleted')

  const [isExpanded, setIsExpanded] = useState(() => multiple && (initialFiles?.length ?? 0) > 0)
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
  const isActionDisabled = disabled || (multiple ? isAtLimit : false)

  // ── Single 파일 선택 ──────────────────────────────────────────
  const selectSingleFile = (file: File) => {
    const original = originalFileRef.current
    const next: SingleManagedFile = original
      ? { state: 'replace', seqNo: original.seqNo, name: file.name, size: file.size, file }
      : { state: 'added', file, name: file.name, size: file.size }
    setManagedFile(next)
    onManagedFileChange?.(next)
    onFilesChange?.([file])
  }

  // ── Single 파일 삭제 ──────────────────────────────────────────
  const deleteSingleFile = () => {
    const original = originalFileRef.current
    const next: SingleManagedFile | null = original
      ? { state: 'deleted', seqNo: original.seqNo, name: original.name, size: original.size }
      : null
    setManagedFile(next)
    onManagedFileChange?.(next)
    onFilesChange?.([])
  }

  // ── Multi 파일 추가 ───────────────────────────────────────────
  const addMultiFiles = (newFiles: File[]) => {
    const remaining = maxFiles != null ? maxFiles - visibleFiles.length : newFiles.length
    const toAdd = newFiles.slice(0, remaining)
    if (toAdd.length === 0) return
    const added: ManagedFile[] = toAdd.map(f => ({
      state: 'added' as const,
      file: f,
      name: f.name,
      size: f.size,
    }))
    const updated = [...managedFiles, ...added]
    setManagedFiles(updated)
    onManagedFilesChange?.(updated)
    onFilesChange?.(
      updated
        .filter((f): f is Extract<ManagedFile, { state: 'added' }> => f.state === 'added')
        .map(f => f.file),
    )
    if (!isExpanded) setIsExpanded(true)
  }

  // ── Multi 파일 삭제 ───────────────────────────────────────────
  const removeMultiFile = (target: ManagedFile) => {
    const updated =
      target.state === 'existing'
        ? managedFiles.map(f => (f === target ? { ...f, state: 'deleted' as const } : f))
        : managedFiles.filter(f => f !== target)
    setManagedFiles(updated)
    onManagedFilesChange?.(updated)
    onFilesChange?.(
      updated
        .filter((f): f is Extract<ManagedFile, { state: 'added' }> => f.state === 'added')
        .map(f => f.file),
    )
    if (updated.filter(f => f.state !== 'deleted').length === 0) setIsExpanded(false)
  }

  // ── 통합 파일 추가 (입력/드롭 이벤트용) ─────────────────────
  const addFiles = (newFiles: File[]) => {
    if (multiple) {
      addMultiFiles(newFiles)
    } else {
      selectSingleFile(newFiles[0])
    }
  }

  const removeFile = (index: number) => {
    if (multiple) {
      removeMultiFile(visibleFiles[index])
    } else {
      deleteSingleFile()
    }
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
    return visibleFile ? '교체' : '파일 선택'
  })()

  const buttonVariant = !multiple && visibleFile ? 'secondary' : 'primary'
  const buttonIcon = (() => {
    if (!multiple && visibleFile) return <EditIcon className={iconSizes.sm} aria-hidden='true' />
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
        {!multiple && visibleFile === null && (
          <span className={[styles.placeholder, textCombinations.bodySm].join(' ')}>
            파일을 선택하세요
          </span>
        )}

        {/* 싱글: 파일 선택됨 */}
        {!multiple && visibleFile !== null && (
          <div className={styles.singleFileRow}>
            <FileIcon className={[iconSizes.sm, styles.fileIcon].join(' ')} aria-hidden='true' />
            <span className={[styles.fileName, textCombinations.bodySm].join(' ')}>
              {visibleFile.name}
            </span>
            <span className={[styles.fileSize, textCombinations.bodyXs].join(' ')}>
              {formatFileSize(visibleFile.size)}
            </span>
            <button
              type='button'
              className={styles.removeButton}
              onClick={() => removeFile(0)}
              aria-label={`${visibleFile.name} 삭제`}
              disabled={disabled}
            >
              <CloseIcon className={iconSizes.sm} aria-hidden='true' />
            </button>
          </div>
        )}

        {/* 멀티: 파일 없음 */}
        {multiple && visibleFiles.length === 0 && (
          <span className={[styles.placeholder, textCombinations.bodySm].join(' ')}>
            파일을 선택하세요
          </span>
        )}

        {/* 멀티: 파일 있음 — 요약 + 펼침/접힘 */}
        {multiple && visibleFiles.length > 0 && (
          <>
            <div className={styles.multiSummaryRow}>
              <AttachIcon
                className={[iconSizes.sm, styles.fileIcon].join(' ')}
                aria-hidden='true'
              />
              <span className={[styles.fileCount, textCombinations.bodySm].join(' ')}>
                {visibleFiles.length}개 첨부됨
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
