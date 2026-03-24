import { useEffect, useState } from 'react'

import type { StorageKey } from '@/utils/storage'
import { getStorageItem, removeStorageItem, setStorageItem } from '@/utils/storage'

/**
 * localStorage 상태 동기화 훅
 * @param key - 저장 키
 * @param initialValue - 초기값
 * @returns [value, setValue, removeValue] 튜플
 */
export function useLocalStorage<T>(key: StorageKey, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStorageItem(key, initialValue)
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      setStorageItem(key, valueToStore)
    } catch (error) {
      console.error(`Failed to set localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      removeStorageItem(key)
    } catch (error) {
      console.error(`Failed to remove localStorage key "${key}":`, error)
    }
  }

  // 다른 탭에서의 변경을 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue) as T)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue] as const
}
