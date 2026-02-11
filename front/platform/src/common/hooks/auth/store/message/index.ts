/**
 * 메시지 전역 상태 및 훅 re-export
 * 단일 소스: @/common/message/store
 */
export type { MessageProps } from '@/common/message/store'
export {
  alertMessageState,
  confirmMessageState,
  useShowAlertMessage,
  useShowAlertMessageCallBack,
  useShowConfirmMessage,
} from '@/common/message/store'
