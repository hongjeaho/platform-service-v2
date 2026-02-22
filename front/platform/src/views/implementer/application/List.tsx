import * as React from 'react'

import { Box, Container, Pagination } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import ApplicationSubTitle from './components/ApplicationSubTitle'
import type { ApplicationItem } from './components/list/ApplicationTable'
import ApplicationTable from './components/list/ApplicationTable'
import SearchForm from './components/list/SearchForm'
import styles from './List.module.css'

// TODO: API 연동 시 실제 데이터로 교체
const MOCK_DATA: ApplicationItem[] = [
  {
    id: 5881,
    seq: 1,
    receptionDate: '2026-01-19',
    decisionOrganization: '서울특별시지방토지수용위원회',
    manager: '최해경',
    implementer: '서울특별시 서초구청장',
    caseNumber: '26수용0005',
    projectName: '방배동 1344-5 - 1489 도로개설공사',
    projectLink: '/implementer/6076355/view',
    location: '-',
    rejectCount: 0,
    progressStatus: '재결접수',
    ltisStatus: '안건상정',
    decisionId: 5881,
  },
  {
    id: 5841,
    seq: 2,
    receptionDate: '2026-01-14',
    decisionOrganization: '서울특별시지방토지수용위원회',
    manager: '김혜일',
    implementer: '불광제5주택재개발정비사업조합',
    caseNumber: '26수용0003',
    projectName: '불광제5주택재개발정비사업 3차',
    projectLink: '/implementer/6076303/view',
    location: '-',
    rejectCount: 0,
    progressStatus: '입력정보확인',
    ltisStatus: '접수',
  },
  {
    id: 5762,
    seq: 3,
    receptionDate: '2025-12-12',
    decisionOrganization: '서울특별시지방토지수용위원회',
    manager: '이미경',
    implementer: '청량리제8구역주택재개발정비사업조합',
    caseNumber: '25수용0095',
    projectName: '청량리제8구역 주택재개발정비사업(2차)',
    projectLink: '/implementer/6075759/view',
    location: '-',
    rejectCount: 3,
    progressStatus: '열람공고반려',
    ltisStatus: '접수',
    decisionId: 5762,
  },
]

const PAGE_SIZE = 10

export default function ApplicationList() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [data] = React.useState<ApplicationItem[]>(MOCK_DATA)
  // TODO: API 연동 시 실제 totalCount로 교체
  const totalCount = MOCK_DATA.length

  const handleSearch = () => {
    // TODO: API 검색 연동
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePdfPreview = () => {
    // TODO: PDF 미리보기 API 연동
  }

  const handleRejectDetail = () => {
    // TODO: 반려 상세 팝업 연동
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
          <p>※ ? 위에 커서를 올리면 도움말을 확인할 수 있습니다.</p>
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
        <SearchForm onSearch={() => handleSearch()} />

        {/* 목록 테이블 */}
        <ApplicationTable
          data={data}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPdfPreview={() => handlePdfPreview()}
          onRejectDetail={() => handleRejectDetail()}
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
