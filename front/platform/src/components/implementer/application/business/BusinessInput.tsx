import { useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle, FormInput } from '@/common/components/ui'
import { icons, iconSizes } from '@/constants/design'
import { cn } from '@/lib/utils'

import type { ApplicationFormData } from '../types'
import styles from './BusinessInput.module.css'

const HelpIcon = icons.info

const TOOLTIP_TEXT =
  '서울지방토지수용위원회 재결 심의를 위해 필요한 기본정보를 입력하는 화면입니다.'

/**
 * 사업 정보 입력 섹션
 * useFormContext로 부모 폼과 연동되며, API 데이터는 부모의 reset()으로 주입됩니다.
 */
export function BusinessInput() {
  const { control } = useFormContext<ApplicationFormData>()

  return (
    <Card>
      <CardHeader>
        <div className={cn(styles.headerRow)}>
          <CardTitle>사업 정보</CardTitle>
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
        <div className={styles.gridRow}>
          <FormInput name='business.caseNo' control={control} label='사건번호' readOnly />
          <FormInput name='business.caseTitle' control={control} label='사업명' readOnly />
        </div>
        <div className={styles.gridRow}>
          <FormInput name='business.address' control={control} label='위치' readOnly />
          <FormInput
            name='business.scale'
            control={control}
            label='규모(단위)'
            placeholder='예) 1.234㎡'
            required
            rules={{
              required: '규모를 입력해주세요.',
              maxLength: {
                value: 25,
                message: '25자 이내로 입력해주세요.',
              },
            }}
          />
        </div>
        <div className={styles.gridFull}>
          <FormInput
            name='business.businessPeriod'
            control={control}
            label='사업기간'
            placeholder='예) 2014.1.1 ~ 2023.3.1'
            required
            rules={{
              required: '사업기간을 입력해주세요.',
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
