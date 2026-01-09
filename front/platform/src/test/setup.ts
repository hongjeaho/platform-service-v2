/**
 * Vitest 테스트 전역 설정 파일
 *
 * @testing-library/jest-dom의 커스텀 매처를 전역으로 사용 가능하게 설정합니다.
 */
import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/**
 * 각 테스트 후 자동으로 DOM을 정리합니다.
 * 이를 통해 메모리 누수를 방지하고 테스트 간 격리를 보장합니다.
 */
afterEach(() => {
  cleanup()
})
