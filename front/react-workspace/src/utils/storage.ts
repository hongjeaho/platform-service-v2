/**
 * localStorage 래퍼 유틸리티
 */

export type StorageKey = string

/**
 * localStorage에 데이터를 저장합니다.
 * undefined인 경우 저장하지 않고 항목을 제거합니다.
 * @param key - 저장 키
 * @param value - 저장할 값
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
  try {
    // undefined는 저장하지 않고 제거 (JSON.stringify(undefined)는 "undefined"가 되어 파싱 에러 발생)
    if (value === undefined) {
      removeStorageItem(key)
      return
    }
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error(`Failed to set storage item "${key}":`, error)
  }
}

/**
 * localStorage에서 데이터를 가져옵니다.
 * @param key - 가져올 키
 * @param defaultValue - 기본값
 * @returns 저장된 값 또는 기본값
 */
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    // null뿐만 아니라 undefined도 체크 (mock localStorage.getItem()이 undefined를 반환할 수 있음)
    if (item == null) {
      return defaultValue
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Failed to get storage item "${key}":`, error)
    return defaultValue
  }
}

/**
 * localStorage에서 데이터를 삭제합니다.
 * @param key - 삭제할 키
 */
export function removeStorageItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove storage item "${key}":`, error)
  }
}

/**
 * localStorage를 초기화합니다.
 * @param exceptKeys - 제외할 키 배열
 */
export function clearStorage(exceptKeys: StorageKey[] = []): void {
  try {
    if (exceptKeys.length > 0) {
      const itemsToKeep: Record<string, string> = {}
      exceptKeys.forEach(key => {
        const item = localStorage.getItem(key)
        if (item !== null) {
          itemsToKeep[key] = item
        }
      })
      localStorage.clear()
      Object.entries(itemsToKeep).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })
    } else {
      localStorage.clear()
    }
  } catch (error) {
    console.error('Failed to clear storage:', error)
  }
}

/**
 * localStorage에 저장된 모든 키를 가져옵니다.
 * @returns 저장된 키 배열
 */
export function getStorageKeys(): StorageKey[] {
  try {
    return Object.keys(localStorage)
  } catch (error) {
    console.error('Failed to get storage keys:', error)
    return []
  }
}

/**
 * localStorage 크기를 바이트 단위로 계산합니다.
 * @returns 저장소 크기 (바이트)
 */
export function getStorageSize(): number {
  try {
    let total = 0
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      const item = localStorage.getItem(key)
      if (item !== null) {
        total += item.length + key.length
      }
    }
    return total
  } catch (error) {
    console.error('Failed to calculate storage size:', error)
    return 0
  }
}
