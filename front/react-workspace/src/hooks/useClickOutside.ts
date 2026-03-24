import { useEffect, useRef } from 'react'

/**
 * 외부 클릭 감지 훅
 * @param callback - 외부 클릭 시 실행할 콜백 함수
 * @returns ref 객체
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [callback])

  return ref
}
