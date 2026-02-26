import { useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle, FormUploadMulti } from '@/common/components/ui'
import { icons, iconSizes } from '@/constants/design'
import { cn } from '@/lib/utils'

import type { ApplicationFormData } from '../types'
import styles from './DecisionAttachmentsInput.module.css'

const HelpIcon = icons.info

const TOOLTIP_TEXT = '재결신청에 필요한 서류를 등록합니다.'

/**
 * 재결신청 파일첨부 입력 섹션
 */
export function DecisionAttachmentsInput() {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <div className={cn(styles.headerRow)}>
          <CardTitle>재결신청 파일첨부</CardTitle>
          <button
            type='button'
            className={styles.helpButton}
            aria-label='도움말'
            title={TOOLTIP_TEXT}
          >
            <HelpIcon className={cn(iconSizes.md)} aria-hidden />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <FormUploadMulti
          name='decisionAttachments'
          control={control}
          label='재결신청 파일첨부'
          placeholder='파일 선택 또는 드래그앤드롭'
          displayMode='list'
        />
      </CardContent>
    </Card>
  )
}
