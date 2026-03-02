import * as React from 'react'

import { Box, Container, Pagination } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import type { ApplicationListItem } from '@/gen/model/application-list.types'
import { cn } from '@/lib/utils'

import ApplicationSubTitle from './components/ApplicationSubTitle'
import ApplicationTable from './components/list/ApplicationTable'
import RejectDetailModal from './components/list/RejectDetailModal'
import type { SearchValues } from './components/list/SearchForm'
import SearchForm from './components/list/SearchForm'
import styles from './List.module.css'

// TODO: API 연동 시 실제 데이터로 교체
const MOCK_DATA: ApplicationListItem[] = [
  {
    seqNo: 4162,
    judgSeq: 6076355,
    recepDt: '2026-01-19',
    charge: '최해경',
    caseNo: '26수용0005',
    implementer: '서울특별시 서초구청장',
    caseTitle: '방배동 1344-5 - 1489 도로개설공사',
    address: null,
    ltisStatCd: '20',
    ltisStatNm: '안건상정',
    stateCd: '10',
    stateNm: 'LTIS 입력정보 확인',
    rejectionCnt: 0,
  },
  {
    seqNo: 4161,
    judgSeq: 6076303,
    recepDt: '2026-01-14',
    charge: '김혜일',
    caseNo: '26수용0003',
    implementer: '불광제5주택재개발정비사업조합',
    caseTitle: '불광제5주택재개발정비사업 3차',
    address: null,
    ltisStatCd: '10',
    ltisStatNm: '접수',
    stateCd: '91',
    stateNm: 'LTIS 입력정보 확인 반려',
    rejectionCnt: 0,
  },
  {
    seqNo: 4150,
    judgSeq: 6075759,
    recepDt: '2025-12-12',
    charge: '이미경',
    caseNo: '25수용0095',
    implementer: '청량리제8구역주택재개발정비사업조합',
    caseTitle: '청량리제8구역 주택재개발정비사업(2차)',
    address: null,
    ltisStatCd: '10',
    ltisStatNm: '접수',
    stateCd: '70',
    stateNm: '열람공고반려',
    rejectionCnt: 3,
  },
]

const PAGE_SIZE = 10

export default function ApplicationList() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [data] = React.useState<ApplicationListItem[]>(MOCK_DATA)
  const [selectedRejectItem, setSelectedRejectItem] = React.useState<ApplicationListItem | null>(
    null,
  )
  // TODO: API 연동 시 searchValues로 목록 조회, totalCount는 API 응답으로 교체
  // const [searchValues, setSearchValues] = React.useState<SearchValues | null>(null)
  const totalCount = MOCK_DATA.length

  const handleSearch = (values: SearchValues) => {
    void values
    // setSearchValues(values)
    setCurrentPage(1)
    // TODO: API 검색 연동 시 values로 목록 재조회
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePdfPreview = () => {
    // TODO: PDF 미리보기 API 연동
  }

  const handleRejectDetail = (item: ApplicationListItem) => {
    setSelectedRejectItem(item)
  }

  return (
    <div className={styles.page}>
      <ApplicationSubTitle />

      <Container>
        {/* 주의사항 */}
        <Box
          as='aside'
          direction='column'
          gap='tight'
          className={cn(styles.caution, textCombinations.bodySm)}
        >
          <p>※ 각 항목의 도움말 아이콘 위에 커서를 올리면 도움말을 확인할 수 있습니다.</p>
          <p>
            ※ 사건목록이 표시되지 않는 경우 재결관의 사건접수(전) 상태일 수 있습니다. 담당
            재결관에게 확인 바랍니다.
          </p>
          <p>
            ※ &apos;주의&apos; 동 정보는 중앙토지수용위원회 재결정보시스템(LTIS)에 귀하가 입력한
            정보를 연계하여 표시하는 것으로, 정보가 불일치 하는 경우 재결정보시스템(LTIS) 입력사항을
            확인바랍니다.
          </p>
        </Box>

        {/* 검색 폼 */}
        <SearchForm onSearch={handleSearch} />

        {/* 목록 테이블 */}
        <ApplicationTable
          data={data}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPdfPreview={() => handlePdfPreview()}
          onRejectDetail={item => handleRejectDetail(item)}
        />

        <RejectDetailModal
          open={!!selectedRejectItem}
          item={selectedRejectItem}
          onClose={() => setSelectedRejectItem(null)}
        />

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </Container>
    </div>
  )
}
