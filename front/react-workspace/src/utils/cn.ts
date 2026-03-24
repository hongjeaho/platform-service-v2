import { type ClassValue,clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * clsx와 tailwind-merge를 결합한 유틸리티 함수.
 * TailwindCSS 클래스를 병합할 때 충돌을 해결합니다.
 * @param inputs - 클래스 이름 또는 조건부 클래스
 * @returns 병합된 클래스 이름 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
