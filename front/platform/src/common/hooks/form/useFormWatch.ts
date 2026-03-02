import type { FieldPath } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'

/**
 * 여러 폼 필드를 효율적으로 감시하는 커스텀 훅
 * 단일 구독으로 여러 필드를 감시하여 불필요한 리렌더링 방지
 *
 * Phase 3.1: 재사용 가능한 폼 감시 훅 생성 (성능 최적화)
 *
 * @param names - 감시할 필드 이름 배열
 * @returns 지정된 필드들의 현재 값들
 *
 * @example
 * ```tsx
 * // 단일 필드 감시
 * const { email } = useFormWatch<FormData>(['email'])
 *
 * // 여러 필드 감시 (단일 구독)
 * const { email, password, confirmPassword } = useFormWatch<FormData>(
 *   ['email', 'password', 'confirmPassword'] as const
 * )
 *
 * // 중첩 필드 감시
 * const { selectedCheck, amounts } = useFormWatch<ApplicationFormData>(
 *   ['evaluation.selectedCheck', 'evaluation.amounts'] as const
 * )
 * ```
 */
/**
 * useWatch는 name이 배열일 때 값 배열을 같은 순서로 반환한다.
 * 이를 name 순서대로 객체 키에 매핑하여, 객체 디스트럭처링으로 사용할 수 있게 한다.
 * 중첩 경로(예: 'evaluation.selectedCheck')는 마지막 세그먼트를 키로 사용한다.
 */
function buildWatchedObject<K extends string>(
  names: readonly K[],
  valuesArray: unknown[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  names.forEach((name, i) => {
    const key =
      typeof name === 'string' && name.includes('.') ? name.split('.').pop()! : (name as string)
    result[key] = valuesArray[i]
  })
  return result
}

export function useFormWatch<
  T extends Record<string, unknown>,
  K extends FieldPath<T> = FieldPath<T>,
>(names: readonly K[]): Pick<T, K> {
  const { control } = useFormContext<T>()

  const watchedValues = useWatch({
    control,
    name: names as unknown as FieldPath<T>[],
  })

  const valuesArray = Array.isArray(watchedValues) ? watchedValues : [watchedValues]
  const result = buildWatchedObject(names as readonly string[], valuesArray)
  return result as unknown as Pick<T, K>
}
