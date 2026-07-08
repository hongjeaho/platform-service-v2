import { useState } from 'react'

import type { ManagedFile, ServerFileInfo } from '@/components/common/FileUpload/FileUpload.type'

/**
 * 복수 파일 추가/삭제/추적 상태 관리 훅
 * `AttachmentRow`(multiple)와 `MultiFileUpload`가 공유하는 ManagedFile 상태 전이 로직입니다.
 * @param initialFiles - 수정 시나리오에서 서버로부터 받아온 기존 파일 목록
 * @param maxFiles - 최대 파일 수 (초과분은 addFiles에서 잘림)
 */
export function useManagedFiles(initialFiles?: ServerFileInfo[], maxFiles?: number) {
  const [files, setFiles] = useState<ManagedFile[]>(
    () => initialFiles?.map(f => ({ state: 'existing' as const, ...f })) ?? [],
  )

  const visibleFiles = files.filter(f => f.state !== 'deleted')

  const addFiles = (newFiles: File[]) => {
    const remaining = maxFiles != null ? maxFiles - visibleFiles.length : newFiles.length
    const toAdd = newFiles.slice(0, remaining)
    if (toAdd.length === 0) return files
    const added: ManagedFile[] = toAdd.map(f => ({
      state: 'added' as const,
      file: f,
      name: f.name,
      size: f.size,
    }))
    const updated = [...files, ...added]
    setFiles(updated)
    return updated
  }

  const removeFile = (target: ManagedFile) => {
    const updated =
      target.state === 'existing'
        ? files.map(f => (f === target ? { ...f, state: 'deleted' as const } : f))
        : files.filter(f => f !== target)
    setFiles(updated)
    return updated
  }

  return { files, visibleFiles, addFiles, removeFile }
}
