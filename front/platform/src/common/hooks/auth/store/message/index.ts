import { useSetAtom } from 'jotai'
import { atom } from 'jotai'

export interface MessageProps {
  message?: string | null
  onCallBack?: () => void
}

/**
 * 애플리케이션 전역 경고 메시지 상태입니다.
 *
 * - 상태 관리: Jotai atom 사용
 * - 초기 상태: message는 null (표시할 메시지 없음)
 *
 * 이 상태를 구독하는 컴포넌트는 메시지 변경 시 감지하여
 * 적절한 UI 갱신을 수행할 수 있습니다.
 */
export const alertMessageState = atom<MessageProps>({
  message: null,
})

/**
 * 확인 메시지 전역 상태 (Jotai atom)
 * message가 null일 경우 현재 표시할 메시지가 없는 상태를 나타냅니다.
 */
export const confirmMessageState = atom<MessageProps>({
  message: null,
})

/**
 * 알림 메시지를 표시하는 훅
 *
 * @returns {Function} 알림 메시지를 설정하는 함수
 */
export const useShowAlertMessage = () => {
  const setAlertMessage = useSetAtom(alertMessageState)

  return (newMessage: string) => {
    setAlertMessage(prevState => ({
      ...prevState, // 기존 상태를 유지하면서
      message: newMessage, // message만 새로 갱신
    }))
  }
}

/**
 * 콜백 함수와 함께 알림 메시지를 표시하는 훅
 *
 * @returns {Function} 알림 메시지와 콜백을 설정하는 함수
 */
export const useShowAlertMessageCallBack = () => {
  const setAlertMessage = useSetAtom(alertMessageState)

  return (newMessage: string, callBack: () => void) => {
    setAlertMessage({
      message: newMessage,
      onCallBack: callBack,
    })
  }
}

/**
 * 확인 메시지를 표시하는 훅
 *
 * @returns {Function} 확인 메시지와 콜백을 설정하는 함수
 */
export const useShowConfirmMessage = () => {
  const setConfirmMessage = useSetAtom(confirmMessageState)

  return (newMessage: string, callBack: () => void) => {
    setConfirmMessage({
      message: newMessage,
      onCallBack: callBack,
    })
  }
}
