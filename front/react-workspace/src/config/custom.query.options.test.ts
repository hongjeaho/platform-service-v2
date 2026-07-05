import { customQueryOptionsFn } from '@config/custom.query.options'
import { describe, expect, it } from 'vitest'

describe('customQueryOptionsFn', () => {
  describe('Mutation 옵션', () => {
    it('mutation 키가 있을 때 retry를 false로 설정한다', () => {
      const result = customQueryOptionsFn({ mutation: true })

      expect(result).toHaveProperty('retry', false)
    })

    it('Mutation 옵션을 반환한다', () => {
      const options = { mutation: true }
      const result = customQueryOptionsFn(options)

      expect(result).toMatchObject({
        retry: false,
      })
    })
  })

  describe('Query 옵션', () => {
    it('mutation 키가 없을 때 Query 기본값을 설정한다', () => {
      const result = customQueryOptionsFn()

      expect(result).toMatchObject({
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      })
    })

    it('retry 함수가 4xx 에러에 대해 false를 반환한다', () => {
      const result = customQueryOptionsFn()
      const retryFn = result.retry as (failureCount: number, error: unknown) => boolean

      const error4xx = { response: { status: 404 } }
      expect(retryFn(1, error4xx)).toBe(false)
    })

    it('retry 함수가 2회 미만일 때 true를 반환한다', () => {
      const result = customQueryOptionsFn()
      const retryFn = result.retry as (failureCount: number, error: unknown) => boolean

      const error5xx = { response: { status: 500 } }
      expect(retryFn(0, error5xx)).toBe(true)
      expect(retryFn(1, error5xx)).toBe(true)
      expect(retryFn(2, error5xx)).toBe(false)
    })
  })

  describe('옵션 override', () => {
    it('사용자 옵션이 기본값을 덮어쓴다', () => {
      const customStaleTime = 1000 * 60 * 10
      const result = customQueryOptionsFn({ staleTime: customStaleTime })

      expect(result.staleTime).toBe(customStaleTime)
    })

    it('Mutation 옵션에서도 사용자 옵션이 적용된다', () => {
      const result = customQueryOptionsFn({ mutation: true, onSuccess: () => {} })

      expect(result.retry).toBe(false)
      expect(result).toHaveProperty('onSuccess')
    })
  })
})
