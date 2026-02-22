import type { TableColumn } from '@/common/components/ui'
import { Modal, ModalBody, Table } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import type { ApplicationItem } from './ApplicationTable'
import { getRejectDetailMock } from './rejectDetailMock'
import type { RejectHistoryItem } from './rejectDetailMock'
import styles from './RejectDetailModal.module.css'

interface RejectDetailModalProps {
  open: boolean
  onClose: () => void
  item: ApplicationItem | null
}

const COLUMNS: TableColumn<RejectHistoryItem>[] = [
  { key: 'rejectDate', header: '반려일', align: 'center', width: '120px' },
  { key: 'rejectReason', header: '반려사유', align: 'center' },
]

export default function RejectDetailModal({ open, onClose, item }: RejectDetailModalProps) {
  const detail = item ? getRejectDetailMock(item) : null

  return (
    <Modal open={open} onClose={onClose} title="반려 상세">
      <ModalBody>
        {detail && (
          <>
            <div className={styles.infoRow}>
              <span className={cn(textCombinations.label, styles.label)}>재결 신청일</span>
              <span className={textCombinations.body}>{detail.reapplyDate}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={cn(textCombinations.label, styles.label)}>담당자</span>
              <span className={textCombinations.body}>{detail.manager}</span>
            </div>
            <div className={styles.tableWrap}>
              <Table<RejectHistoryItem>
                columns={COLUMNS}
                data={detail.rejections}
                keyExtractor={(row, index) => `${row.rejectDate}-${index}`}
                emptyMessage="반려 이력이 없습니다."
              />
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}
