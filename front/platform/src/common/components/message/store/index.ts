import { useSetAtom } from 'jotai'
import { atom } from 'jotai'

export interface MessageProps {
  message?: string | null
  onCallBack?: () => void
}

/**
 * `alertMessageState`는 애플리케이션 전역에서 경고 메시지를 관리하는 상태입니다.
 * Recoil의 atom을 사용하여 생성되었으며, 메시지의 내용을 저장하는 데 사용됩니다.
 *
 * - 초기 상태:
 *   - `message`: 기본값은 `null`로 설정되어 있으며, 메시지를 가지고 있지 않은 상태를 나타냅니다.
 *
 * 이 상태를 구독하는 컴포넌트는 `alertMessageState`의 값이 변경될 때 이를 감지하고
 * 적절한 UI 갱신 작업을 수행할 수 있습니다.
 */
export const alertMessageState = atom<MessageProps>({
  message: null,
})

/**
 * confirmMessageState 변수는 Recoil의 atom으로, 전역 상태 관리를 위해 사용된다.
 * 사용자 확인 메시지의 내용을 담고 있으며 MessageProps 형태의 데이터를 가진다.
 * message가 null일 경우 현재 표시할 메시지가 없는 상태를 나타낸다.
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
