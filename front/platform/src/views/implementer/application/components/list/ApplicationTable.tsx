import { Link } from 'react-router-dom'

import type { TableColumn } from '@/common/components/ui'
import { Table } from '@/common/components/ui'
import { statusColors } from '@/constants/design/color'
import { icons, iconSizes } from '@/constants/design/icons'
import { borderRadius, padding } from '@/constants/design/spacing'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './ApplicationTable.module.css'

export interface ApplicationItem {
  id: number
  seq: number
  receptionDate: string
  decisionOrganization: string
  manager: string
  implementer: string
  caseNumber: string
  projectName: string
  projectLink?: string
  location: string
  rejectCount: number
  progressStatus: string
  ltisStatus: string
  decisionId?: number
}

interface ApplicationTableProps {
  data: ApplicationItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  onPdfPreview?: (decisionId: number) => void
  onRejectDetail?: (item: ApplicationItem) => void
}

const DownloadIcon = icons.download

const REJECTION_STATUS_COLORS: Record<string, string> = {
  열람공고반려: 'bg-destructive text-destructive-foreground',
  재결관검토반려: 'bg-destructive text-destructive-foreground',
}

function StatusBadge({ status }: { status: string }) {
  const colorClass =
    REJECTION_STATUS_COLORS[status] ??
    (statusColors as Record<string, string>)[status] ??
    'bg-muted text-muted-foreground'

  return (
    <span
      className={cn(
        colorClass,
        padding.buttonSm,
        borderRadius.md,
        textCombinations.labelSm,
        'inline-block text-center',
      )}
    >
      {status}
    </span>
  )
}

export default function ApplicationTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPdfPreview,
  onRejectDetail,
}: ApplicationTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize)

  const columns: TableColumn<ApplicationItem>[] = [
    {
      key: 'receptionDate',
      header: '접수일',
      align: 'center',
      width: '100px',
    },
    {
      key: 'manager',
      header: '담당자',
      align: 'center',
      width: '80px',
    },
    {
      key: 'implementer',
      header: '사업시행자',
      align: 'center',
    },
    {
      key: 'caseNumber',
      header: '사건번호',
      align: 'center',
      width: '110px',
    },
    {
      key: 'projectName',
      header: '사업명',
      align: 'center',
      render: (_, row) =>
        row.projectLink ? (
          <Link to={row.projectLink} className={styles.projectLink}>
            {row.projectName}
          </Link>
        ) : (
          <span>{row.projectName}</span>
        ),
    },
    {
      key: 'location',
      header: '소재지',
      align: 'center',
    },
    {
      key: 'rejectCount',
      header: '반려횟수',
      align: 'center',
      width: '70px',
      render: (value, row) => {
        if (!value || value === 0) return <span>-</span>
        return (
          <button
            type='button'
            className={cn(
              styles.rejectBtn,
              textCombinations.labelSm,
              padding.buttonSm,
              borderRadius.md,
            )}
            onClick={() => onRejectDetail?.(row)}
            aria-label={`반려 ${value}회 상세보기`}
          >
            {value}
          </button>
        )
      },
    },
    {
      key: 'progressStatus',
      header: '심의진행현황',
      align: 'center',
      width: '110px',
      render: value => <StatusBadge status={String(value)} />,
    },
    {
      key: 'ltisStatus',
      header: 'LTIS진행상황',
      align: 'center',
      width: '100px',
    },
    {
      key: 'decisionId',
      header: 'PDF미리보기',
      align: 'center',
      width: '80px',
      render: (value, row) => {
        if (!value) return <span>-</span>
        return (
          <button
            type='button'
            className={cn(styles.pdfBtn, padding.buttonSm, borderRadius.md)}
            onClick={() => onPdfPreview?.(row.decisionId!)}
            aria-label={`${row.caseNumber} PDF 미리보기`}
          >
            <DownloadIcon className={iconSizes.sm} aria-hidden='true' />
          </button>
        )
      },
    },
  ]

  return (
    <div className={styles.wrapper}>
      {/* 테이블 헤더 — 건수/페이지 정보 */}
      <div className={styles.tableHeader}>
        <h4 className={cn(textCombinations.label, styles.tableTitle)}>LTIS입력정보 목록</h4>
        <ul className={cn('flex', 'gap-4', textCombinations.bodySm, styles.countInfo)}>
          <li>
            Total: <mark className={styles.countMark}>{totalCount.toLocaleString()}</mark>
          </li>
          <li>
            Page:{' '}
            <mark className={styles.countMark}>
              {currentPage}/{totalPages}
            </mark>
          </li>
        </ul>
      </div>

      <Table<ApplicationItem>
        columns={columns}
        data={data}
        keyExtractor={item => item.id}
        emptyMessage='조회된 사건이 없습니다.'
        striped
      />
    </div>
  )
}
