import { useEffect, useState } from 'react'

/**
 * 반응형 미디어 쿼리 훅
 * @param query - 미디어 쿼리 문자열 (예: "(min-width: 768px)")
 * @returns 쿼리 일치 여부
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)

    // 초기값 설정
    setMatches(mediaQuery.matches)

    // 이벤트 리스너 등록 (호환성 고려)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
    // 레거시 브라우저 지원
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [query])

  return matches
}

/**
 * 반응형 미디어 쿼리 프리셋 훅들
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 640px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)')
}
