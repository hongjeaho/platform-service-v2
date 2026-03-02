import { useEffect, useRef } from 'react'

/**
 * 개발 환경에서 컴포넌트 렌더링 성능을 모니터링하는 훅
 * 렌더링 횟수와 소요 시간을 콘솔에 기록
 *
 * Phase 3: 성능 모니터링 훅 생성
 *
 * @param componentName - 모니터링할 컴포넌트 이름
 * @param warnThresholdMs - 경고 표시 기준 시간 (밀리초, 기본값: 16ms = 60fps)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useRenderMonitor('MyComponent', 16)
 *   return <div>...</div>
 * }
 * ```
 *
 * @example
 * With custom threshold:
 * ```tsx
 * function ExpensiveComponent() {
 *   useRenderMonitor('ExpensiveComponent', 33) // 30fps threshold
 *   return <div>...</div>
 * }
 * ```
 */
export function useRenderMonitor(componentName: string, warnThresholdMs = 16) {
  const renderCount = useRef(0)
  const startTime = useRef<number>(performance.now())

  useEffect(() => {
    const renderTime = performance.now() - startTime.current

    if (process.env.NODE_ENV === 'development') {
      renderCount.current++

      console.log(
        `[Performance] ${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`,
      )

      if (renderTime > warnThresholdMs) {
        console.warn(
          `[Performance] ${componentName} exceeded ${warnThresholdMs}ms threshold (took ${renderTime.toFixed(2)}ms)`,
        )
      }
    }

    startTime.current = performance.now()
  })
}
