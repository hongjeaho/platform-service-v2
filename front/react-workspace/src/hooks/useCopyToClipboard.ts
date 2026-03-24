import { useState } from 'react'

/**
 * 클립보드 복사 훅
 * @returns [copy, isCopied] 튜플
 */
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)

      // 2초 후 상태 리셋
      setTimeout(() => setIsCopied(false), 2000)

      return true
    } catch (error) {
      console.error('Failed to copy text:', error)
      setIsCopied(false)
      return false
    }
  }

  return { copy, isCopied }
}
