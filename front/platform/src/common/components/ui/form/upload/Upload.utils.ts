/**
 * Upload 컴포넌트 유틸리티 함수
 * 파일 검증 및 포맷팅 관련 헬퍼 함수들
 */

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환
 * @param bytes - 바이트 단위 파일 크기
 * @returns 포맷된 파일 크기 문자열 (예: "1.23 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 파일명에서 확장자 추출
 * @param filename - 파일명
 * @returns 확장자 (점 포함, 예: ".pdf") 또는 빈 문자열
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return filename.slice(lastDotIndex).toLowerCase()
}

/**
 * accept 문자열에서 허용된 확장자 목록 추출
 * @param accept - accept 속성 문자열 (예: ".pdf,.hwp,application/pdf")
 * @returns 확장자 배열 (예: [".pdf", ".hwp"])
 */
export function getAcceptedExtensions(accept?: string): string[] {
  if (!accept) return []

  return accept
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(item => item.startsWith('.'))
}

/**
 * accept 문자열에서 허용된 MIME 타입 목록 추출
 * @param accept - accept 속성 문자열
 * @returns MIME 타입 배열 (예: ["application/pdf", "image/*"])
 */
export function getAcceptedMimeTypes(accept?: string): string[] {
  if (!accept) return []

  return accept
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(item => !item.startsWith('.'))
}

/**
 * 파일이 허용된 타입인지 검증
 * @param file - 검증할 파일
 * @param accept - accept 속성 문자열 (예: ".pdf,.hwp,application/pdf")
 * @returns 검증 성공 시 null, 실패 시 에러 메시지
 */
export function validateFileType(file: File, accept?: string): string | null {
  if (!accept) return null

  const fileExtension = getFileExtension(file.name)
  const fileMimeType = file.type.toLowerCase()

  const acceptedExtensions = getAcceptedExtensions(accept)
  const acceptedMimeTypes = getAcceptedMimeTypes(accept)

  // 확장자 검증
  if (acceptedExtensions.length > 0) {
    const extensionMatch = acceptedExtensions.some(ext => fileExtension === ext)
    if (extensionMatch) return null
  }

  // MIME 타입 검증
  if (acceptedMimeTypes.length > 0) {
    const mimeMatch = acceptedMimeTypes.some(mimeType => {
      // 와일드카드 지원 (예: image/*)
      if (mimeType.endsWith('/*')) {
        const baseType = mimeType.slice(0, -2)
        return fileMimeType.startsWith(baseType)
      }
      return fileMimeType === mimeType
    })
    if (mimeMatch) return null
  }

  // 둘 다 없으면 통과
  if (acceptedExtensions.length === 0 && acceptedMimeTypes.length === 0) {
    return null
  }

  // 검증 실패
  const allowedFormats = [...acceptedExtensions, ...acceptedMimeTypes].join(', ')
  return `허용되지 않는 파일 형식입니다. 허용된 형식: ${allowedFormats}`
}

/**
 * 파일 크기 검증
 * @param file - 검증할 파일
 * @param maxSize - 최대 파일 크기 (바이트)
 * @returns 검증 성공 시 null, 실패 시 에러 메시지
 */
export function validateFileSize(file: File, maxSize?: number): string | null {
  if (!maxSize) return null

  if (file.size > maxSize) {
    return `파일 크기가 ${formatFileSize(maxSize)}를 초과합니다.`
  }

  return null
}

/**
 * 파일 전체 검증 (타입 + 크기)
 * @param file - 검증할 파일
 * @param accept - accept 속성 문자열
 * @param maxSize - 최대 파일 크기 (바이트)
 * @returns 검증 성공 시 null, 실패 시 에러 메시지
 */
export function validateFile(file: File, accept?: string, maxSize?: number): string | null {
  const typeError = validateFileType(file, accept)
  if (typeError) return typeError

  const sizeError = validateFileSize(file, maxSize)
  if (sizeError) return sizeError

  return null
}


