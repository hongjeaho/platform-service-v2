import { useEffect, useState } from 'react'

/**
 * 쓰로틀 훅
 * @param value - 쓰로틀할 값
 * @param limit - 제한 시간 (ms)
 * @returns 쓰로틀된 값
 */
export function useThrottle<T>(value: T, limit: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const [lastRan, setLastRan] = useState<number>(Date.now())

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan >= limit) {
          setThrottledValue(value)
          setLastRan(Date.now())
        }
      },
      limit - (Date.now() - lastRan),
    )

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit, lastRan])

  return throttledValue
}
