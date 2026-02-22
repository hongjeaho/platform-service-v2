import type { ReactNode } from 'react'

export interface ModalProps {
  /** 모달 열림 여부 */
  open: boolean
  /** 닫기 콜백 (오버레이 클릭, ESC, 닫기 버튼) */
  onClose: () => void
  /** 모달 제목 (선택, aria-labelledby에 사용) */
  title?: string
  /** 모달 내용 */
  children: ReactNode
  /** 추가 클래스명 */
  className?: string
}

export interface ModalHeaderProps {
  children: ReactNode
  className?: string
  /** 제목 요소 id (Modal의 aria-labelledby와 연결 시 사용) */
  id?: string
}

export interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export interface ModalFooterProps {
  children: ReactNode
  className?: string
}
