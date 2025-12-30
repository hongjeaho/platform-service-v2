/**
 * localStorage 키 상수
 * 중복된 문자열 리터럴을 방지하고 오타를 줄이기 위해 상수로 관리합니다.
 */

/** localStorage 키 상수 */
export const STORAGE_KEYS = {
  /** JWT 인증 토큰 (Bearer 토큰) */
  AUTHORIZATION: 'authorization',
  /** 사용자 정보 (JSON 문자열) */
  USER: 'user',
} as const

/** localStorage 키 타입 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
