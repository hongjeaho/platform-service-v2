import {
  getGetListQueryKey,
  useCreate,
  useDelete,
  useGetList,
} from '@api/generated/hooks/board/board'
import type { GetListParams } from '@api/generated/model'
import { useQueryClient } from '@tanstack/react-query'

export const boardKeys = {
  all: ['/api/public/board'] as const,
  list: (params?: GetListParams) => getGetListQueryKey(params),
}

export function useBoardList(params?: GetListParams) {
  return useGetList(params)
}

export function useBoardCreate() {
  const queryClient = useQueryClient()
  return useCreate({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.all }),
    },
  })
}

export function useBoardDelete() {
  const queryClient = useQueryClient()
  return useDelete({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.all }),
    },
  })
}
