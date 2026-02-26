import { useParams } from 'react-router-dom'

import { Container } from '@/common/components/ui'

import ApplicationSubTitle from './components/ApplicationSubTitle'
import { ApplicationForm } from './components/form/ApplicationForm'
import styles from './List.module.css'

/**
 * 재결신청 작성/수정 페이지
 * - /implementer/application/write → 신규 작성
 * - /implementer/application/:judgSeqNo/edit → 수정
 */
export default function ApplicationFormPage() {
  const { judgSeqNo } = useParams<{ judgSeqNo?: string }>()
  const mode = judgSeqNo ? 'edit' : 'write'

  return (
    <div className={styles.page}>
      <ApplicationSubTitle />
      <Container>
        <ApplicationForm mode={mode} />
      </Container>
    </div>
  )
}
