/**
 * 검증 유틸리티
 */

/**
 * 이메일 유효성을 검사합니다.
 * @param email - 이메일 주소
 * @returns 유효성 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 전화번호 유효성을 검사합니다.
 * @param phone - 전화번호 문자열
 * @returns 유효성 여부
 */
export function isValidPhoneNumber(phone: string): boolean {
  // 숫자, 하이픈, 공백만 허용
  const cleaned = phone.replace(/[\s-]/g, '')
  const phoneRegex = /^010\d{8}$|^0\d{9,10}$/
  return phoneRegex.test(cleaned)
}

/**
 * 비밀번호 강도를 검사합니다.
 * 최소 8자, 최소 1개의 소문자, 1개의 숫자
 * @param password - 비밀번호
 * @returns 유효성 여부
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

/**
 * 비밀번호 강도를 평가합니다.
 * @param password - 비밀번호
 * @returns 강도 레벨 (weak, medium, strong)
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
}

/**
 * URL 유효성을 검사합니다.
 * @param url - URL 문자열
 * @returns 유효성 여부
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 주민등록번호 유효성을 검사합니다.
 * @param ssn - 주민등록번호 ( '-' 제외)
 * @returns 유효성 여부
 */
export function isValidSSN(ssn: string): boolean {
  const cleaned = ssn.replace(/[-\s]/g, '')

  if (cleaned.length !== 13) return false

  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]
  let sum = 0

  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(cleaned[i]) * weights[i]
  }

  const checkDigit = (11 - (sum % 11)) % 10

  return checkDigit === Number.parseInt(cleaned[12])
}

/**
 * 사업자등록번호 유효성을 검사합니다.
 * @param brn - 사업자등록번호 ( '-' 제외)
 * @returns 유효성 여부
 */
export function isValidBRN(brn: string): boolean {
  const cleaned = brn.replace(/[-\s]/g, '')

  if (cleaned.length !== 10) return false

  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleaned[i]) * weights[i]
  }

  const checkDigit =
    (10 - ((sum + Math.floor((Number.parseInt(cleaned[8]) * weights[8]) / 10)) % 10)) % 10

  return checkDigit === Number.parseInt(cleaned[9])
}

/**
 * 우편번호 유효성을 검사합니다.
 * @param postalCode - 우편번호 (5자리)
 * @returns 유효성 여부
 */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode.replace(/[-\s]/g, ''))
}
