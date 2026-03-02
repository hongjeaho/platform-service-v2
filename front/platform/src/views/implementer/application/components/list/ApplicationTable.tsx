import { Link } from 'react-router-dom'

import type { DataTableColumn } from '@/common/components/ui'
import { DataTable } from '@/common/components/ui'
import type { StatusType } from '@/constants/design/color'
import { statusColors } from '@/constants/design/color'
import { borderRadius, padding } from '@/constants/design/spacing'
import { textCombinations } from '@/constants/design/typography'
import type { ApplicationListItem } from '@/gen/model/application-list.types'
import { cn } from '@/lib/utils'

import styles from './ApplicationTable.module.css'

/** stateCd 91 = LTIS 입력정보 확인 반려 → edit 이동 */
const STATE_CD_EDIT = '91'

interface ApplicationTableProps {
  data: ApplicationListItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  onPdfPreview?: (decisionId: number) => void
  onRejectDetail?: (item: ApplicationListItem) => void
}

/** 심의 진행현황 표시값(stateNm) → statusColors 키 매핑 */
const PROGRESS_STATUS_TO_VARIANT: Partial<Record<string, StatusType>> = {
  'LTIS 입력정보 확인': '접수',
  입력정보확인: '접수',
  재결접수: '접수',
  열람공고: '접수',
  접수: '접수',
  안건상정: '접수',
  'LTIS 입력정보 확인 반려': '반려',
  열람공고반려: '반려',
  '열람공고 반려': '반려',
  재결관검토반려: '반려',
  '재결관검토 반려': '반려',
  재결신청의견제출: '검토중',
  '재결신청 의견제출': '검토중',
  재결관검토: '검토중',
  심의: '검토중',
  완료: '완료',
}

function StatusBadge({ status }: { status: string }) {
  const variant: StatusType = PROGRESS_STATUS_TO_VARIANT[status] ?? '보류'
  const colorClass = statusColors[variant]

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

function getCaseTitleLinkPath(row: ApplicationListItem): string {
  const path = row.stateCd === STATE_CD_EDIT ? 'edit' : 'view'
  return `${row.judgSeq}/${path}`
}

export default function ApplicationTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPdfPreview: _onPdfPreview,
  onRejectDetail,
}: ApplicationTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize)

  const columns: DataTableColumn<ApplicationListItem>[] = [
    {
      key: 'recepDt',
      header: '접수일',
      align: 'center',
      width: '100px',
    },
    {
      key: 'charge',
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
      key: 'caseNo',
      header: '사건번호',
      align: 'center',
      width: '110px',
    },
    {
      key: 'caseTitle',
      header: '사업명',
      align: 'center',
      render: (_, row) => (
        <Link to={getCaseTitleLinkPath(row)} className={styles.projectLink}>
          {row.caseTitle}
        </Link>
      ),
    },
    {
      key: 'address',
      header: '소재지',
      align: 'center',
      render: value => value ?? '-',
    },
    {
      key: 'rejectionCnt',
      header: '반려횟수',
      align: 'center',
      width: '70px',
      render: (value, row) => {
        if (value == null || value === 0) return <span>-</span>
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
      key: 'stateNm',
      header: '심의진행현황',
      align: 'center',
      width: '110px',
      render: value => <StatusBadge status={String(value)} />,
    },
    {
      key: 'ltisStatNm',
      header: 'LTIS진행상황',
      align: 'center',
      width: '100px',
    },
    {
      key: 'pdfPreview',
      header: 'PDF미리보기',
      align: 'center',
      width: '80px',
      render: () => <span>-</span>,
    },
  ]

  return (
    <div className={styles.wrapper}>
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

      <DataTable<ApplicationListItem>
        columns={columns}
        data={data}
        keyExtractor={item => item.judgSeq}
        emptyMessage='조회된 사건이 없습니다.'
        striped
      />
    </div>
  )
}
