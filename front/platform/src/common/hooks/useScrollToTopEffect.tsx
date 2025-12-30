import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 경로가 변경될 때마다 페이지 상단으로 스크롤하는 훅입니다.
 *
 * @example
 * ```tsx
 * import { useScrollToTopEffect } from '@hooks/useScrollToTopEffect'
 *
 * function MyLayout() {
 *   useScrollToTopEffect()
 *   return <Outlet />
 * }
 * ```
 */
export const useScrollToTopEffect = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
