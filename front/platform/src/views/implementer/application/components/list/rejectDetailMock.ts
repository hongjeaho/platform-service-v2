import type { ApplicationItem } from './ApplicationTable'

/** 반려 이력 한 건 */
export interface RejectHistoryItem {
  rejectDate: string
  rejectReason: string
}

/** 반려 상세 모달용 데이터 */
export interface RejectDetail {
  reapplyDate: string
  manager: string
  rejections: RejectHistoryItem[]
}

/**
 * 반려 상세 Mock 데이터 반환
 * API 연동 전까지 item의 receptionDate → 재결 신청일, manager → 담당자,
 * rejectCount 기준으로 반려 이력 목록을 생성합니다.
 */
export function getRejectDetailMock(item: ApplicationItem): RejectDetail {
  const count = Math.max(1, item.rejectCount)
  const rejections: RejectHistoryItem[] = []
  const baseDate = new Date(item.receptionDate)

  for (let i = 0; i < count; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + (i + 1) * 7)
    rejections.push({
      rejectDate: d.toISOString().slice(0, 10),
      rejectReason: `반려 사유 ${i + 1} (Mock) - 서류 보완 필요`,
    })
  }

  return {
    reapplyDate: item.receptionDate,
    manager: item.manager,
    rejections,
  }
}
